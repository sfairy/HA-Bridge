#!/usr/bin/env python3
"""Find meaningless placeholder identifiers and rank the functions carrying them.

Usage:
    python scripts/outline-junk-names.py <file.js>                     # ranked functions
    python scripts/outline-junk-names.py <file.js> --function NAME     # one function in detail
    python scripts/outline-junk-names.py <file.js> --summary           # totals per family
    python scripts/outline-junk-names.py <file.js> --fail-over 2700    # ratchet guard

Background: this codebase was at some point passed through an automated rename
that replaced meaningful local names with placeholders (argPrimary, localValue,
computedValue, ...). The placeholders are grammatical, not semantic: `localValue`
reads like a name but says nothing, so every reader has to reconstruct the intent
from the surrounding code. This tool locates the remaining ones.

Families are matched by stem, so disambiguated variants (`localValueNext`,
`comparisonFlagCurrent`) are reported together with the bare stem. Note that the
*disambiguating suffix* is usually meaningful even though the stem is not.

Read-only analysis tool.
"""
from __future__ import annotations

import argparse
import collections
import pathlib
import re
import sys

# stem -> regex source; each is anchored to a whole identifier
FAMILIES: dict[str, str] = {
    'argPrimary/...': r'arg(?:Primary|Secondary|Tertiary|Quaternary|Quinary)',
    'argN': r'argN\d*',
    'arg+digit': r'arg\d+',
    'localValue*': r'localValue\w*',
    'computedValue*': r'computedValue\w*',
    'zeroValue*': r'zeroValue\w*',
    'oneValue*': r'oneValue\w*',
    'valuesVar': r'valuesVar\w*',
    'comparisonFlag*': r'comparisonFlag\w*',
    'boolFlag*': r'boolFlag\w*',
    'helperFn*': r'helperFn\w*',
    '*Param': r'\w+Param\d*',
    'x+digit': r'x\d+',
    'id+digit': r'id\d+',
    'value+digit': r'value\d+',
    'flag+digit': r'flag\d+',
    'name+digit': r'name\d+',
    'result+digit': r'result\d+',
}
JUNK_RE = re.compile(r'(?<![\w$.])(?:' + '|'.join(FAMILIES.values()) + r')(?![\w$])')
JUNK_ONE = re.compile(r'(?<![\w$.])([A-Za-z_$][\w$]*)(?![\w$])')


def family_of(identifier: str) -> str | None:
    for label, src in FAMILIES.items():
        if re.fullmatch(src, identifier):
            return label
    return None


# A regex literal may only start where a value is expected. These are the
# preceding characters (after an operator/keyword) that allow one.
REGEX_PREV_CHARS = set('(,=:[!&|?{};+-*%<>~^')
# ...and the keywords after which `/` starts a regex rather than a division.
REGEX_PREV_WORDS = {'return', 'typeof', 'instanceof', 'delete', 'void', 'in',
                    'of', 'new', 'do', 'else', 'case', 'yield', 'await'}


def regex_literal_end(src: str, i: int, n: int) -> int:
    """End offset (exclusive) of a regex literal at src[i] == '/', or -1.

    Tracks `[...]` classes (where `/` does not terminate) and escapes, and
    refuses to span a newline so a misdetected division cannot eat code.
    """
    j = i + 1
    in_class = False
    while j < n:
        c = src[j]
        if c == '\\':
            j += 2
            continue
        if c == '\n':
            return -1
        if in_class:
            if c == ']':
                in_class = False
        elif c == '[':
            in_class = True
        elif c == '/':
            j += 1
            while j < n and src[j].isalpha():
                j += 1
            return j
        j += 1
    return -1


def regex_starts_here(src: str, i: int) -> bool:
    """True when the `/` at src[i] opens a regex literal, not a division."""
    k = i - 1
    while k >= 0 and src[k] in ' \t\r\n':
        k -= 1
    if k < 0:
        return True
    if src[k] in REGEX_PREV_CHARS:
        return True
    if src[k].isalnum() or src[k] in '_$':
        w = k
        while w >= 0 and (src[w].isalnum() or src[w] in '_$'):
            w -= 1
        return src[w + 1:k + 1] in REGEX_PREV_WORDS
    return False


def mask(src: str) -> str:
    """Blank comments, string/template and regex literals, preserving offsets."""
    out = list(src)
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            j = src.find('\n', i)
            j = n if j < 0 else j
            for k in range(i, j):
                out[k] = ' '
            i = j
        elif c == '/' and i + 1 < n and src[i + 1] == '*':
            j = src.find('*/', i + 2)
            j = n if j < 0 else j + 2
            for k in range(i, j):
                if src[k] != '\n':
                    out[k] = ' '
            i = j
        elif c == '/':
            end = regex_literal_end(src, i, n) if regex_starts_here(src, i) else -1
            if end > 0:
                for k in range(i, end):
                    if src[k] != '\n':
                        out[k] = ' '
                i = end
            else:
                i += 1
        elif c in ('"', "'", '`'):
            q = c
            j = i + 1
            while j < n:
                if src[j] == '\\':
                    j += 2
                    continue
                if src[j] == q:
                    break
                j += 1
            for k in range(i + 1, min(j, n)):
                if src[k] != '\n':
                    out[k] = ' '
            i = min(j + 1, n)
        else:
            i += 1
    return ''.join(out)


def match_brace(masked: str, i: int) -> int:
    depth = 0
    for j in range(i, len(masked)):
        if masked[j] == '{':
            depth += 1
        elif masked[j] == '}':
            depth -= 1
            if depth == 0:
                return j
    return -1


DECL = re.compile(r'(?m)^[ \t]*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(')
ARROW = re.compile(r'(?m)^[ \t]*const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(')


def decl_body_span(masked: str, paren_open: int) -> tuple[int, int]:
    """(body_brace, body_end) for a declaration whose parameter list starts at
    `paren_open`. The `{` is only searched for *after* the parameter list, so a
    default value like `(options = {})` can no longer be mistaken for the body."""
    depth = 0
    j = paren_open
    n = len(masked)
    while j < n:
        c = masked[j]
        if c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
            if depth == 0:
                j += 1
                break
        j += 1
    p = j
    while p < n and masked[p] in ' \t\r\n':
        p += 1
    if p < n and masked[p] == '{':
        return p, match_brace(masked, p)
    return -1, -1


def functions(src: str, masked: str):
    """Yield (name, start, end, param_paren) for every declaration, nested included."""
    found = []
    for rx in (DECL, ARROW):
        for m in rx.finditer(masked):
            body, end = decl_body_span(masked, m.end() - 1)
            if body < 0:
                # concise arrow body: no braces, the declaration runs to line end
                line_end = masked.find('\n', m.end())
                end = len(masked) if line_end < 0 else line_end
            if end < 0:
                continue
            found.append((m.group(1), m.start(), end, masked.find('(', m.start())))
    found.sort(key=lambda f: f[1])
    seen = set()
    for name, start, end, paren in found:
        if start in seen:
            continue
        seen.add(start)
        yield name, start, end, paren


def own_junk(masked: str, spans, index: int) -> collections.Counter:
    """Placeholder identifiers belonging to one function, excluding any that sit
    inside a function nested within it (those are reported on the inner one)."""
    name, start, end, _ = spans[index]
    children = []
    for j, (_, s2, e2, _) in enumerate(spans):
        if j == index or not (start < s2 and e2 < end):
            continue
        # keep only direct children, so a grandchild's range is not subtracted twice
        if not any(k not in (index, j) and start < s3 <= s2 and e2 <= e3 < end
                   for k, (_, s3, e3, _) in enumerate(spans)):
            children.append((s2, e2))
    hits = collections.Counter()
    for m in JUNK_RE.finditer(masked[start:end]):
        at = start + m.start()
        if any(s2 <= at < e2 for s2, e2 in children):
            continue
        hits[m.group(0)] += 1
    return hits


def depth_of(spans, index: int) -> int:
    _, start, end, _ = spans[index]
    return sum(1 for j, (_, s2, e2, _) in enumerate(spans)
               if j != index and s2 < start and end <= e2)


def param_names(masked: str, paren: int) -> list[str]:
    if paren < 0:
        return []
    close = masked.find(')', paren)  # good enough: params rarely contain parens at depth 0
    depth = 0
    for j in range(paren, len(masked)):
        if masked[j] == '(':
            depth += 1
        elif masked[j] == ')':
            depth -= 1
            if depth == 0:
                close = j
                break
    raw = masked[paren + 1:close]
    out = []
    for part in raw.split(','):
        part = part.strip()
        if not part:
            continue
        m = re.match(r'^([A-Za-z_$][\w$]*)$', part)
        if m:
            out.append(m.group(1))
        else:
            # destructuring / defaults: surface every identifier so it is not
            # mistaken for a free variable
            out.extend(re.findall(r'[A-Za-z_$][\w$]*', part))
    return out


def binding_of(src: str, masked: str, start: int, end: int, name: str, params: list[str]) -> str:
    if name in params:
        return 'parameter'
    body = masked[start:end]
    if re.search(r'\bfunction\s+' + re.escape(name) + r'\b', body):
        return 'function'
    decl = re.search(r'(?<![\w$.])(const|let|var)\s+' + re.escape(name) + r'\s*=', body)
    if decl:
        reassigned = False
        for m in re.finditer(r'(?<![\w$.])' + re.escape(name)
                             + r'\s*(?:=(?!=)|\+\+|--|\+=|-=|\*=|/=)', body):
            before = body[max(0, m.start() - 12):m.start()]
            if re.search(r'(?:const|let|var)\s*$', before):
                continue  # this is the declaration itself, not a reassignment
            reassigned = True
            break
        if reassigned and decl.group(1) == 'const':
            return 'const+REASSIGNED?'  # would throw at runtime: worth a look
        return decl.group(1) + ('+reassigned' if reassigned else '')
    if re.search(r'(?<![\w$.])\(?\s*' + re.escape(name) + r'\s*\)?\s*=>', body):
        return 'arrow param'
    if re.search(r'catch\s*\(\s*' + re.escape(name) + r'\s*\)', body):
        return 'catch binding'
    return 'unknown'


def decl_count(masked: str, start: int, end: int, name: str) -> int:
    """How many times one identifier is *re-bound* inside a function. Two or more
    bindings means the inner one shadows the outer, and a flat find/replace would
    silently merge two different variables -- the usual way a rename goes wrong."""
    body = masked[start:end]
    n = len(re.findall(r'(?<![\w$.])(?:const|let|var)\s+' + re.escape(name) + r'\b', body))
    n += len(re.findall(r'for\s*\(\s*' + re.escape(name) + r'\s+(?:of|in)\b', body))
    n += len(re.findall(r'catch\s*\(\s*' + re.escape(name) + r'\s*\)', body))
    return n


def shadowed_names(masked: str, start: int, end: int, hits) -> dict[str, int]:
    """Placeholder names bound more than once inside this function."""
    return {name: n for name in hits
            if (n := decl_count(masked, start, end, name)) > 1}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('file')
    ap.add_argument('--min-lines', type=int, default=8)
    ap.add_argument('--top', type=int, default=25)
    ap.add_argument('--function', help='show one function in detail')
    ap.add_argument('--summary', action='store_true', help='totals per family, then stop')
    ap.add_argument('--rename-safe', action='store_true',
                    help='only list functions with no shadowed placeholder names')
    ap.add_argument('--fail-over', type=int,
                    help='exit 1 when the file carries more than N placeholder identifiers')
    ap.add_argument('--list', action='store_true',
                    help='every placeholder with its line and owning function')
    args = ap.parse_args()

    path = pathlib.Path(args.file)
    src = path.read_text(encoding='utf-8')
    masked = mask(src)
    total = len(JUNK_RE.findall(masked))

    if args.list:
        # Every hit, with the innermost enclosing named function. Hits inside a
        # callback that `functions()` cannot name show up as their host function
        # (or `<module>` at the top level), which is what `own_junk` counts too.
        spans = list(functions(src, masked))
        for m in JUNK_RE.finditer(masked):
            at = m.start()
            cand = sorted((e - s, n) for n, s, e, _ in spans if s <= at <= e)
            owner = cand[0][1] if cand else '<module>'
            print(f'L{masked.count(chr(10), 0, at) + 1}\t{m.group(0)}\t'
                  f'{family_of(m.group(0))}\t{owner}')
        return 0

    if args.summary or args.fail_over is not None:
        counts = collections.Counter()
        for ident in JUNK_RE.findall(masked):
            counts[family_of(ident) or '?'] += 1
        print(f'{path}: {total} placeholder identifiers across {len(counts)} families')
        for label, n in counts.most_common():
            print(f'  {label:<24} {n:>5}')
        if args.fail_over is not None:
            if total > args.fail_over:
                print(f'\nFAIL: {total} > budget {args.fail_over}')
                return 1
            print(f'\nOK: {total} <= budget {args.fail_over}')
        return 0

    rows = []
    spans = list(functions(src, masked))
    for index, (name, start, end, paren) in enumerate(spans):
        hits = own_junk(masked, spans, index)
        if not hits:
            continue
        line = masked.count('\n', 0, start) + 1
        end_line = masked.count('\n', 0, end) + 1
        size = end_line - line + 1
        if size < args.min_lines:
            continue
        shadows = shadowed_names(masked, start, end, hits)
        if args.rename_safe and shadows:
            continue
        occ = sum(hits.values())
        rows.append((occ / size, occ, len(hits), size, line, end_line,
                     depth_of(spans, index), name, shadows))

    if args.function:
        spans = list(functions(src, masked))
        match = [(n, s, e, p) for n, s, e, p in spans if n == args.function]
        if not match:
            print(f'{args.function}: no such function')
            return 1
        index = next(i for i, (n, _, _, _) in enumerate(spans) if n == args.function)
        _, start, end, paren = match[0]
        hits = own_junk(masked, spans, index)
        line = masked.count('\n', 0, start) + 1
        end_line = masked.count('\n', 0, end) + 1
        if not hits:
            print(f'{args.function}  ->  {path}:{line}-{end_line}  '
                  f'({end_line - line + 1} lines)  clean: no placeholder identifiers')
            return 0
        params = param_names(masked, paren)
        shadows = shadowed_names(masked, start, end, hits)
        note = (f'{len(shadows)} shadowed name(s): ' + ', '.join(sorted(shadows))
                if shadows else 'rename-safe: no shadowing')
        print(f'{args.function}  ->  {path}:{line}-{end_line}  '
              f'({end_line - line + 1} lines, {sum(hits.values())} own placeholders)\n'
              f'  {note}\n')
        for ident, n in sorted(hits.items(), key=lambda kv: (-kv[1], kv[0])):
            binds = decl_count(masked, start, end, ident)
            mark = f'  SHADOW x{binds}' if binds > 1 else ''
            print(f'  {ident:<28} x{n:<3} {family_of(ident):<20} '
                  f'{binding_of(src, masked, start, end, ident, params)}{mark}')
        return 0

    rows.sort(key=lambda r: -r[0])
    label = ' (rename-safe only)' if args.rename_safe else ''
    print(f'{path}: {total} placeholder identifiers total, '
          f'{len(rows)} functions over {args.min_lines} lines own at least one{label}\n')
    print(f'{"dens":>6} {"own":>5} {"dist":>5} {"lines":>6} {"nest":>4} {"shad":>5}  {"range":<16} name')
    for dens, occ, distinct, size, line, end_line, nest, name, shadows in rows[:args.top]:
        indent = '  ' * nest
        mark = str(len(shadows)) if shadows else '-'
        print(f'{dens:>6.2f} {occ:>5} {distinct:>5} {size:>6} {nest:>4} {mark:>5}  L{line}-{end_line:<11} {indent}{name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
