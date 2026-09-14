#!/usr/bin/env python3
"""Rename placeholder identifiers in a JavaScript file under a declared plan.

The obfuscator reused a handful of grammatical names (`localValue`,
`computedValue`, `argPrimary`, ...) for unrelated variables, so a plain
find/replace welds together values that only happen to share a name. This tool
refuses to write unless it can prove the edit is *nothing but* the rename:

  resolution    every occurrence of an old name must resolve to exactly one of
                that name's bindings, and a name must not be bound twice in the
                same scope. Two bindings means shadowing; each occurrence is
                attributed to the innermost binding whose scope contains it.
  collision     a new name must not already be used inside the function, must
                not be another old name, and must not be a duplicate target.
  purity        the text between identifiers must be byte-identical afterwards.
                Only identifier tokens may change, and only by a planned swap.

Two job forms:

  {"function": "buildTvItemMeshGroup",
   "bindings": {"localValue": ["screenThickness", "bezel"]}}
      one new name per binding, in source order. The tool finds the bindings
      itself, so shadowed names need no line arithmetic. The function name must
      be unique in the file; the tool refuses an ambiguous name (use a range).

  {"range": [15143, 15156], "bindings": {...}}
      window form, for code the function finder cannot name: anonymous arrows
      that the scanner attributes to a misleading "function", or repeated helper
      names. `exclude` is honoured in the flat `map` form for the rare case where
      a name must be split by hand.

Refusals are atomic: nothing is written unless every job in the plan passes, and
the result must still parse. Workflow for one round:

  1. outline-junk-names.py FILE --rename-safe --top N   # pick targets
  2. read the target, write scripts/junk-plans/plan-<round>.json
  3. rename-junk.py FILE --plan ...           # dry run, check binding counts
  4. rename-junk.py FILE --plan ... --apply
  5. ./scripts/check-guards.sh                # ratchet + diffs must all pass

Usage:
  rename-junk.py FILE --plan PLAN.json [--apply]
  rename-junk.py --selftest
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import subprocess
import sys

DECL_RE = re.compile(r'(?m)^[ \t]*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(')
ARROW_RE = re.compile(r'(?m)^[ \t]*const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(')
# `function` is deliberately absent: `x.onBeforeRender = function (...args) {` is an
# anonymous function expression whose parens are a *parameter list*, not a control
# head. Keeping it here made `find_bindings` blind to those params, so `--audit-spill`
# reported their uses as dangling.
CONTROL_KEYWORDS = ('for', 'while', 'if', 'switch', 'catch')

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
    """Offset of the '}' matching the '{' at i, or -1."""
    depth = 0
    for j in range(i, len(masked)):
        if masked[j] == '{':
            depth += 1
        elif masked[j] == '}':
            depth -= 1
            if depth == 0:
                return j
    return -1


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


def functions(masked: str):
    """(name, start, end) for every declaration, nested included."""
    found = []
    for rx in (DECL_RE, ARROW_RE):
        for m in rx.finditer(masked):
            body, end = decl_body_span(masked, m.end() - 1)
            if body < 0:
                # concise arrow body: no braces, the declaration runs to line end
                line_end = masked.find('\n', m.end())
                end = len(masked) if line_end < 0 else line_end
            if end < 0:
                continue
            found.append((m.group(1), m.start(), end))
    found.sort(key=lambda f: f[1])
    seen = set()
    for name, start, end in found:
        if start in seen:
            continue
        seen.add(start)
        yield name, start, end


def line_offsets(masked: str) -> list[int]:
    offs = [0]
    for i, ch in enumerate(masked):
        if ch == '\n':
            offs.append(i + 1)
    return offs


def line_range_to_chars(masked: str, first: int, last: int) -> tuple[int, int]:
    offs = line_offsets(masked)
    if first < 1 or last > len(offs):
        raise SystemExit(f'line range {first}-{last} outside file (1-{len(offs)})')
    return offs[first - 1], (offs[last] if last < len(offs) else len(masked))


def tokens(masked: str):
    """(start, end, text, prev_non_space, next_non_space) per identifier token.

    `prev_non_space` is the single preceding non-space char, except that a run of
    dots is collapsed to `..`: `a.b` -> prev '.' (member access), while `...b` and
    `[...b]` -> prev '..' (spread / rest, so `b` is a real reference). Without that
    distinction a spread argument reads as a property access and gets skipped.

    `next_non_space` likewise skips whitespace: `{ a }` must read as a shorthand
    just like `{a}`, and `{ a : 1 }` must read as a key.
    """
    out = []
    i, n = 0, len(masked)
    while i < n:
        c = masked[i]
        if c.isalpha() or c in '_$':
            j = i
            while j < n and (masked[j].isalnum() or masked[j] in '_$'):
                j += 1
            k = i - 1
            while k >= 0 and masked[k] in ' \t\r\n':
                k -= 1
            if k >= 0 and masked[k] == '.' and k - 1 >= 0 and masked[k - 1] == '.':
                prev = '..'
            else:
                prev = masked[k] if k >= 0 else ''
            t = j
            while t < n and masked[t] in ' \t\r\n':
                t += 1
            out.append((i, j, masked[i:j], prev, masked[t] if t < n else ''))
            i = j
            continue
        i += 1
    return out


def is_reference(masked: str, start: int, end: int, prev: str, after: str) -> bool:
    """Is the identifier at [start,end) a plain read/write, not a member access or key?

    `{ name(...)` is a shorthand method key inside an object literal, but a plain call
    as the first statement of a block (`if (x) { draw(y); }`) or in argument position
    (`f(1, g(2))`). Treating those as keys made the renamer silently skip them, which
    is how `helperFn(floorShape)` was left dangling in `rebuildWorldPreview`. So the
    paren case looks at what follows the closing paren: a `{` opens a method body (a
    key), anything else was a call (a reference).
    """
    if prev == '.':
        return False
    if after == ':' and prev in '{,(':
        return False
    if after == '(' and prev in '{,':
        open_at = masked.find('(', end)
        if open_at < 0 or masked[end:open_at].strip():
            return False
        close = closing_paren(masked, open_at)
        if close < 0:
            return False
        return not masked[close + 1:].lstrip().startswith('{')
    return True


ACCESSORS = {'get', 'set'}


def accessor_name(masked: str, start: int, end: int) -> bool:
    """True when the token at [start,end) names a `get foo()` / `set foo(v)` accessor.

    The accessor keyword itself is not a reference, so an audit that renamed a
    local called `get` must not report every getter in its range as a leftover.
    """
    if masked[start:end] not in ACCESSORS:
        return False
    return bool(re.match(r'\s*[A-Za-z_$][\w$]*\s*\(', masked[end:end + 80]))


BLOCK_KEYWORDS = {'else', 'do', 'try', 'finally', 'switch', 'catch', 'function'}


def enclosing_brace(text: str, pos: int) -> int:
    """Index of the `{` enclosing `pos` (or -1 when the nearest opener is not a brace)."""
    depth = 0
    for j in range(pos - 1, -1, -1):
        c = text[j]
        if c in '}])':
            depth += 1
        elif c in '{[(':
            if depth == 0:
                return j if c == '{' else -1
            depth -= 1
    return -1


def shorthand_kind(masked: str, start: int, end: int, prev: str, after: str):
    """How an occurrence of a bound name reads inside braces, or None.

    `{ name }` and `{ a, name }` are either object literals or destructuring
    patterns. In both, `name` is a *key* as well as the thing being renamed, so
    a bare token swap would rename the property (and, in a pattern, silently
    rebind from a property that does not exist). The only correct edit is to
    expand the shorthand to `name: newName`, which preserves the key.

    A brace that might be a block statement instead is reported as 'block' so
    the caller refuses rather than guesses.
    """
    if prev not in '{,' or after not in ',}=':
        return None
    brace = enclosing_brace(masked, start)
    if brace < 0:
        return None
    # what introduces the brace decides between object and block
    k = brace - 1
    while k >= 0 and masked[k] in ' \t\r\n':
        k -= 1
    if k < 0:
        return 'block'
    if masked[k] in '=,([?:':
        return 'expand'
    word = re.search(r'([A-Za-z_$][\w$]*)$', masked[:k + 1])
    object_ish = word.group(1) not in BLOCK_KEYWORDS if word else False
    if not object_ish:
        # `after == '='` is the only trigger that also matches ordinary code --
        # a statement-initial assignment inside a block, `{ name = 0; }`. There
        # the name is a plain reference, so returning None renames it normally
        # instead of blocking the whole job.
        return None if after == '=' else 'block'
    return 'expand'


def blank(text: str, ranges) -> str:
    out = list(text)
    for lo, hi in ranges:
        for k in range(lo, min(hi, len(out))):
            if out[k] != '\n':
                out[k] = ' '
    return ''.join(out)


def enclosing_paren(text: str, pos: int) -> int:
    depth = 0
    for j in range(pos - 1, -1, -1):
        if text[j] == ')':
            depth += 1
        elif text[j] == '(':
            if depth == 0:
                return j
            depth -= 1
    return -1


def closing_paren(masked: str, open_at: int) -> int:
    depth = 0
    for j in range(open_at, len(masked)):
        if masked[j] == '(':
            depth += 1
        elif masked[j] == ')':
            depth -= 1
            if depth == 0:
                return j
    return -1


def block_end(masked: str, pos: int) -> int:
    """End of the innermost block containing pos (its closing brace)."""
    stack = []
    for j in range(pos):
        if masked[j] == '{':
            stack.append(j)
        elif masked[j] == '}':
            if stack:
                stack.pop()
    return match_brace(masked, stack[-1]) if stack else len(masked) - 1


def concise_end(masked: str, start: int) -> int:
    """Offset where a brace-less arrow body starting at `start` ends.

    Stops at the first top-level separator (`,`, `;`, newline) or at the
    closer that would drop below the body's own depth.
    """
    j = start
    while j < len(masked) and masked[j] in ' \t\r\n':
        j += 1
    depth = 0
    while j < len(masked):
        c = masked[j]
        if c in '([{':
            depth += 1
        elif c in ')]}':
            if depth == 0:
                return j
            depth -= 1
        elif depth == 0 and c in ',;\n':
            return j
        j += 1
    return len(masked) - 1


def arrow_body_end(masked: str, arrow: int) -> int:
    """End of the arrow body whose `=>` is at `arrow`."""
    j = arrow + 2
    while j < len(masked) and masked[j] in ' \t\r\n':
        j += 1
    if j < len(masked) and masked[j] == '{':
        return match_brace(masked, j)
    return concise_end(masked, j)


def callee_body_end(masked: str, close: int) -> int:
    """End of the body of a function/arrow whose parameter list closes at `close`."""
    j = close + 1
    while j < len(masked) and masked[j] in ' \t\r\n':
        j += 1
    if masked.startswith('=>', j):
        return arrow_body_end(masked, j)
    if j < len(masked) and masked[j] == '{':
        return match_brace(masked, j)
    return -1


def pattern_bindings(pattern: str, base: int):
    """[(name, absolute_offset)] for the identifiers a param/destructuring pattern binds.

    Walks the pattern instead of splitting on commas, so nested and array patterns
    work (`[a, b]`, `{a, b: c}`, `{...rest}`). Identifiers in *reference* position
    are skipped: an object key (`b` in `{b: c}`) and anything inside a default value
    (`f` in `{a = f()}`) or inside a nested parameter list (`cb` in `(cb) => ...`).
    """
    out = []
    i, n = 0, len(pattern)
    parens = 0
    while i < n:
        c = pattern[i]
        if c in ' \t\r\n,' or c in '[{' or c in ']}':
            i += 1
        elif c == '(':
            parens += 1
            i += 1
        elif c == ')':
            parens -= 1
            i += 1
        elif pattern.startswith('...', i):
            i += 3
        elif c == '=':
            # default value: read, not binding -- skip to the next separator that is
            # not nested inside the expression.
            i += 1
            depth = 0
            while i < n:
                ch = pattern[i]
                if ch in '([{':
                    depth += 1
                elif ch in ')]}':
                    if depth == 0:
                        break
                    depth -= 1
                elif ch == ',' and depth == 0:
                    break
                i += 1
        elif re.match(r'[A-Za-z_$]', c):
            m = re.match(r'[A-Za-z_$][\w$]*', pattern[i:])
            name = m.group(0)
            j = k = i + len(name)
            while k < n and pattern[k] in ' \t\r\n':
                k += 1
            if k < n and pattern[k] == ':':
                i = k + 1  # `key: value` -- the key is not a binding
                continue
            if parens == 0:
                out.append((name, base + i))
            i = j
        else:
            i += 1
    return out


def find_bindings(masked: str, name: str, lo: int, hi: int):
    """[(position, kind, scope_start, scope_end)] for bindings of `name`.

    kind is 'param', 'for-of', or 'block'. Positions are absolute offsets.
    """
    esc = re.escape(name)
    region = masked[lo:hi]
    out = []

    for m in re.finditer(r'(?<![\w$.])(?:const|let|var)\s+' + esc + r'\b', region, re.MULTILINE):
        pos = lo + m.start()
        paren = enclosing_paren(masked, pos)
        # only the word right before the paren matters (`for`, `function`, ...), so look
        # at a small window: slicing the whole prefix made this 15ms per binding.
        head = masked[max(0, paren - 80):paren].rstrip() if paren > 0 else ''
        word = re.search(r'([A-Za-z_$][\w$]*)$', head)
        if word and word.group(1) == 'for':
            close = closing_paren(masked, paren)
            brace = masked.find('{', close)
            if brace >= 0 and masked[close + 1:brace].strip() == '':
                out.append((pos, 'for-of', pos, match_brace(masked, brace)))
            else:
                out.append((pos, 'for-of', pos, block_end(masked, close)))
        else:
            out.append((pos, 'block', pos, block_end(masked, pos)))

    for m in re.finditer(r'(?<![\w$.])(?:const|let|var)\s*([{\[])([^}\]]*)[}\]]\s*(of|=)', region):
        pos = lo + m.start()
        if not any(bound == name for bound, _at in pattern_bindings(m.group(2), 0)):
            continue
        if m.group(3) == 'of':
            close = closing_paren(masked, enclosing_paren(masked, pos))
            brace = masked.find('{', close)
            end = (match_brace(masked, brace)
                   if brace >= 0 and masked[close + 1:brace].strip() == ''
                   else block_end(masked, close))
            out.append((pos, 'for-of', pos, end))
        else:
            out.append((pos, 'block', pos, block_end(masked, pos)))

    for m in re.finditer(r'(?<![\w$.])function\s+' + esc + r'\s*\(', region):
        pos = lo + m.start()
        brace = masked.find('{', lo + m.end())
        out.append((pos, 'block', pos, match_brace(masked, brace)))

    # `catch (name)` only as a clause; `promise.catch(name)` is a method call and
    # must not be mistaken for a binding.
    for m in re.finditer(r'(?<![\w$.])catch\s*\(\s*' + esc + r'\s*\)', region):
        pos = lo + m.start()
        brace = masked.find('{', lo + m.end())
        out.append((pos, 'block', pos, match_brace(masked, brace)))

    # a parameter list is `(` ... `)` directly followed by `{` or `=>`. Match on
    # the closing paren so defaults may contain calls, `(now = performance.now())`.
    # The opening paren may sit just before the region (a multi-line parameter
    # pattern), so the guard is on the binding position, not on `open_at`.
    for m in re.finditer(r'\)\s*(?:=>|\{)', region):
        close = lo + m.start()
        open_at = enclosing_paren(masked, close)
        if open_at < 0:
            continue
        head = masked[max(0, open_at - 80):open_at].rstrip()
        word = re.search(r'([A-Za-z_$][\w$]*)$', head)
        if word and word.group(1) in CONTROL_KEYWORDS:
            continue
        end = callee_body_end(masked, close)
        for bound, at in pattern_bindings(masked[open_at + 1:close], open_at + 1):
            if bound == name and lo <= at < hi:
                out.append((at, 'param', at, end))

    # bare arrow parameter, i.e. `NAME => ...` with no parentheses
    for m in re.finditer(r'(?<![\w$.])' + esc + r'\s*=>', region):
        pos = lo + m.start()
        end = arrow_body_end(masked, pos + len(name))
        out.append((pos, 'param', pos, end))

    # dedupe: the same position can be matched as both declaration and parameter
    unique = {}
    for pos, kind, s, e in out:
        unique.setdefault((pos, kind), (pos, kind, s, e))
    return sorted(unique.values())


def edits_for_bindings(masked: str, name: str, lo: int, hi: int, new_names):
    """[(start, end, old, new)] attributing each occurrence to its innermost binding."""
    binds = find_bindings(masked, name, lo, hi)
    invalid = [(p, e) for p, _k, _s, e in binds if e < 0]
    if invalid:
        return None, [f'{name}: a binding at L{masked.count(chr(10), 0, invalid[0][0]) + 1} '
                      f'has an unclosed scope; is the function truncated?']
    if len(binds) != len(new_names):
        where = ', '.join(f'L{masked.count(chr(10), 0, p) + 1}' for p, *_ in binds)
        return None, [f'{name}: found {len(binds)} bindings ({where}) but {len(new_names)} '
                      f'names were given']
    scopes = [(s, e) for _p, _k, s, e in binds]

    edits = []
    for start, end, text, prev, after in tokens(masked):
        if text != name or not (lo <= start < hi) or not is_reference(masked, start, end, prev, after):
            continue
        candidates = [(e - s, i) for i, (s, e) in enumerate(scopes) if s <= start <= e]
        if not candidates:
            return None, [f'{name}: the occurrence at L{masked.count(chr(10), 0, start) + 1} '
                          f'belongs to no binding inside this function (probably an outer '
                          f'scope); rename it separately or leave it alone']
        candidates.sort()
        new = new_names[candidates[0][1]]
        kind = shorthand_kind(masked, start, end, prev, after)
        if kind == 'block':
            return None, [f'{name}: the occurrence at L{masked.count(chr(10), 0, start) + 1} '
                          f'is `{{ {name} }}`, which could be a block rather than an object; '
                          f'rewrite that site by hand']
        if kind == 'expand':
            new = f'{name}: {new}'
        edits.append((start, end, name, new))
    if not edits:
        return None, [f'{name}: no occurrences inside the function']
    return edits, []


def edits_for_mapping(masked: str, lo: int, hi: int, mapping, excluded):
    """[(start, end, old, new)] for a flat rename of `mapping` inside [lo,hi).

    Positions are absolute (the apply step subtracts `lo`), and `excluded` is absolute
    too. This used to scan the blanked *slice* while comparing against the absolute
    `lo`/`hi`, so every occurrence sat "outside the region": the map form silently did
    nothing deep in a file, and mis-applied edits when it did fire.
    """
    edits, failures = [], []
    occurrences = {}
    for old in mapping:
        occurrences[old] = [t for t in tokens(masked)
                            if lo <= t[0] < hi and t[2] == old
                            and is_reference(masked, t[0], t[1], t[3], t[4])]
    for old in mapping:
        binds = [(p, k) for p, k, *_ in find_bindings(masked, old, lo, hi)
                 if not any(a <= p < b for a, b in excluded)]
        if not binds:
            failures.append(f'{old} has no binding inside the region')
            continue
        if len(binds) > 1:
            where = ', '.join(f'L{masked.count(chr(10), 0, p) + 1}' for p, _ in binds)
            failures.append(f'{old} is bound {len(binds)}x ({where}); use "bindings" or split '
                            f'with "range"/"exclude"')
            continue
        bpos, kind = binds[0]
        _p, _k, s, e = find_bindings(masked, old, lo, hi)[0]
        if e < 0:
            failures.append(f'the scope of {old} extends past the region (the range cuts its '
                            f'brace); use the whole function plus "exclude" instead')
            continue
        stray = [t for t in occurrences[old] if not (s <= t[0] <= e)]
        if stray:
            where = ', '.join(f'L{masked.count(chr(10), 0, t[0]) + 1}' for t in stray[:4])
            failures.append(f'{old} occurs outside the scope of its single binding ({where}); '
                            f'the region spans two variables')
            continue
        for start, end, _t, _p, _a in occurrences[old]:
            edits.append((start, end, old, mapping[old]))
    return edits, failures


def scope_span(full_mask: str, spec: dict):
    """(lo, hi, excluded, label, err) for one plan entry."""
    label = spec.get('function') or f"L{spec.get('range')}"

    if 'range' in spec:
        lo, hi = line_range_to_chars(full_mask, *spec['range'])
    else:
        spans = [s for s in functions(full_mask) if s[0] == spec['function']]
        if not spans:
            return 0, 0, [], label, f'{label}: no such function'
        if len(spans) > 1:
            where = ', '.join(f'L{full_mask.count(chr(10), 0, s[1]) + 1}' for s in spans)
            return 0, 0, [], label, (f'{label}: ambiguous function name ({len(spans)} matches at '
                                     f'{where}); use an explicit range')
        _n, lo, hi = spans[0]
        # `functions()` ends on the index of the closing brace, so a slice spelled
        # `full_mask[lo:hi]` would cut that brace off and any binding whose block ends
        # there would find no matching `}` (the map form used to refuse for this reason).
        if hi < len(full_mask) and full_mask[hi] == '}':
            hi += 1
    excluded = [(max(0, a - lo), max(0, b - lo))
                for a, b in (line_range_to_chars(full_mask, x, y)
                             for x, y in spec.get('exclude', []))]
    return lo, hi, excluded, label, None


def audit_scope(src: str, spec: dict, full_mask: str) -> list:
    """Old names from one entry that are still *referenced* inside its scope.

    A leftover may be legitimate: a range-split entry deliberately leaves an
    outer binding of the same name alone. So this reports candidates for triage,
    it does not decide. Its job is to catch the one failure the purity check
    cannot see -- a token the tokenizer missed entirely, which would leave a
    dangling reference behind after the rename.

    Triage happens in the plan itself: `"allowRefs": ["name", ...]` records that
    a leftover of that name was inspected and belongs to another binding (the
    note next to it says which), while `"audit": "allow"` skips the whole entry.
    """
    lo, hi, excluded, label, err = scope_span(full_mask, spec)
    if err:
        return [err]
    if spec.get('audit') == 'allow':
        # A range-split entry may deliberately leave an outer binding of the same
        # name alone; say so explicitly rather than silently skipping the check.
        return []
    red = blank(full_mask[lo:hi], excluded)
    olds = set(spec.get('map') or {}) | set(spec.get('bindings') or {})
    allowed = set(spec.get('allowRefs') or [])
    # A name can be renamed away *and* handed to another binding in the same
    # entry (`halfWidth -> ring` while the old `ring` becomes `ringIndex`).
    # Then the surviving `ring` tokens are our own output, not leftovers. The
    # byte-level purity check already proves which tokens were rewritten, so
    # these swaps are counted and reported, never treated as dangling.
    swaps = set()
    new_names = (list((spec.get('map') or {}).values())
                 + list((spec.get('bindings') or {}).values()))
    for names in new_names:
        swaps |= {names} if isinstance(names, str) else set(names)
    swaps &= olds
    found = []
    for start, _end, text, prev, after in tokens(red):
        if text in olds and is_reference(red, start, _end, prev, after):
            if text in swaps or text in allowed:
                continue
            if accessor_name(red, start, _end):
                continue
            line = full_mask.count('\n', 0, lo + start) + 1
            found.append(f'{label}: {text} still referenced at L{line}')
    return found


def audit_spill(src: str, spec: dict, full_mask: str) -> list:
    """Old names of one entry that are still referenced in the same function but outside
    the entry's range.

    `audit_scope` only looks *inside* the range, which is how a rename that covered the
    declaration but missed a later use slips through: the missed token then resolves to an
    outer binding of the same name. In `rebuildWorldPreview` that turned
    `const list = filter.filter(...)` into `const coveringSegments = ...` while a later
    `list.filter(...)` stayed behind and started reading the module-level DOM list, so the
    accent floor polygons were silently never drawn. Candidates are triaged the same way as
    `audit_scope`: fix the reference, or record `allowRefs`.
    """
    lo, hi, _excluded, label, err = scope_span(full_mask, spec)
    if err or spec.get('audit') == 'allow':
        return []
    olds = set(spec.get('map') or {}) | set(spec.get('bindings') or {})
    allowed = set(spec.get('allowRefs') or [])
    new_names = (list((spec.get('map') or {}).values())
                 + list((spec.get('bindings') or {}).values()))
    swaps = set()
    for names in new_names:
        swaps |= {names} if isinstance(names, str) else set(names)
    # the function the entry lives in; a spill outside it belongs to another scope
    hay = []
    for _name, fstart, fend in functions(full_mask):
        if fstart <= lo <= fend:
            hay.append((fend - fstart, fstart, fend))
    if not hay:
        return []
    _size, fstart, fend = min(hay)
    red = full_mask[fstart:fend]
    # every binding of the old names in this function, with its visibility span
    bindings = {}
    for name in olds - allowed - swaps:
        bindings[name] = find_bindings(full_mask, name, fstart, fend)
    found = []
    for start, end, text, prev, after in tokens(red):
        if text not in bindings:
            continue
        if not is_reference(red, start, end, prev, after) or accessor_name(red, start, end):
            continue
        at = fstart + start
        # A missed use is always *after* the range: a rename covers the declaration and
        # whatever uses the range author saw. References before the range bind to something
        # else by construction, so reporting them only adds noise.
        if at < hi:
            continue
        # If some binding of this name other than the renamed one is still in scope here,
        # it explains the reference (`const list = []` inside the next loop). Otherwise the
        # token resolves to an outer or module-level binding -- which is exactly how
        # `list.filter(...)` started reading the module-level DOM list and silently stopped
        # drawing the accent floor polygons.
        if any(s <= at <= e and not (lo <= pos < hi) for pos, _k, s, e in bindings[text]):
            continue
        line = full_mask.count('\n', 0, at) + 1
        found.append(f'{label}: {text} referenced at L{line}, outside its renamed scope')
    return found


def rename_scope(src: str, spec: dict, full_mask: str) -> tuple[str, dict]:
    """Rename inside one slice of `src`. Offsets stay local to the slice so a
    longer replacement cannot invalidate the regions we compare."""
    lo, hi, excluded, label, err = scope_span(full_mask, spec)
    if err:
        return src, {'error': [err]}

    slice_src = src[lo:hi]
    slice_mask = full_mask[lo:hi]
    red = blank(slice_mask, excluded)

    mapping = spec.get('map') or {}
    bindings = spec.get('bindings') or {}
    if not mapping and not bindings:
        return src, {'error': [f'{label}: job has neither "map" nor "bindings"']}

    failures = []
    edits = []
    for old, new_names in bindings.items():
        got, errs = edits_for_bindings(full_mask, old, lo, hi, new_names)
        failures += [f'{label}: {e}' for e in errs]
        if got:
            edits += got
    if mapping:
        got, errs = edits_for_mapping(full_mask, lo, hi, mapping,
                                      [(a + lo, b + lo) for a, b in excluded])
        failures += [f'{label}: {e}' for e in errs]
        edits += got
    if failures:
        return src, {'error': failures}

    # collisions. Each renamed variable needs its own name, so the set of names
    # handed out must be distinct; and a new name must not already be a live
    # identifier in the function, or it would silently shadow it.
    handed_out = []
    for new_names in bindings.values():
        handed_out += list(new_names)
    handed_out += list(mapping.values())
    dupes = sorted({n for n in handed_out if handed_out.count(n) > 1})
    if dupes:
        failures.append(f'{label}: the same new name is handed to two variables: {dupes}')
    renamed_at = {(s - lo, e - lo) for s, e, _o, _n in edits}
    untouched = {t[2] for t in tokens(red)
                 if (t[0], t[1]) not in renamed_at
                 and is_reference(red, t[0], t[1], t[3], t[4])
                 and not any(a <= t[0] < b for a, b in excluded)}
    for new in sorted(set(handed_out)):
        if new in untouched:
            failures.append(f'{label}: new name {new} is already a live identifier in the '
                            f'function; it would shadow it')
    if failures:
        return src, {'error': failures}

    edited = slice_src
    for start, end, _old, new in sorted(edits, key=lambda e: -e[0]):
        edited = edited[:start - lo] + new + edited[end - lo:]

    # purity: walk the slice and the edited slice together; everything outside a
    # planned replacement must be byte-identical, and each replacement must be
    # present verbatim. This catches a stray edit anywhere in the region and
    # understands replacements that stretch a token (`{ a }` -> `{ a: b }`).
    i = j = 0
    for start, end, _old, new in sorted(edits, key=lambda e: e[0]):
        s, e = start - lo, end - lo
        run = s - i
        if slice_src[i:s] != edited[j:j + run]:
            return src, {'error': [f'{label}: text changed outside identifiers']}
        j += run
        if edited[j:j + len(new)] != new:
            return src, {'error': [f'{label}: a planned replacement is not present verbatim']}
        j += len(new)
        i = e
    if slice_src[i:] != edited[j:]:
        return src, {'error': [f'{label}: text changed outside identifiers']}

    return src[:lo] + edited + src[hi:], {'renamed': len(edits),
                                          'names': len(bindings) + len(mapping)}


def edit_selftest() -> int:
    """End-to-end cases for the edit builder: shorthand expansion, refusal of
    ambiguous braces, and the shorthand-method key, on tiny in-memory sources."""
    cases = [
        # (label, source, plan spec, expected output or None when it must refuse)
        ('pattern shorthand',
         'function f(preset) {\n  const { value } = preset;\n  return value;\n}\n',
         {'function': 'f', 'bindings': {'value': ['label']}},
         'function f(preset) {\n  const { value: label } = preset;\n  return label;\n}\n'),
        ('object literal shorthand',
         'function f(value) {\n  return { value };\n}\n',
         {'function': 'f', 'bindings': {'value': ['payload']}},
         'function f(payload) {\n  return { value: payload };\n}\n'),
        ('trailing shorthand with default',
         'function f(source) {\n  const { a, value = 2 } = source;\n  return value;\n}\n',
         {'function': 'f', 'bindings': {'value': ['fallback']}},
         'function f(source) {\n  const { a, value: fallback = 2 } = source;\n'
         '  return fallback;\n}\n'),
        ('key with spaced colon stays a key',
         'function f(value) {\n  return { value : 1 };\n}\n',
         {'function': 'f', 'bindings': {'value': ['payload']}},
         'function f(payload) {\n  return { value : 1 };\n}\n'),
        ('ambiguous block refused',
         'function f(value) {\n  if (value) { value }\n}\n',
         {'function': 'f', 'bindings': {'value': ['flag']}},
         None),
        ('else-block refused',
         'function f(value) {\n  if (a) { b(); } else { value }\n}\n',
         {'function': 'f', 'bindings': {'value': ['flag']}},
         None),
        ('shorthand method key untouched',
         'function f(handler) {\n  const o = { handler() { return handler; } };\n  return o;\n}\n',
         {'function': 'f', 'bindings': {'handler': ['onEvent']}},
         'function f(onEvent) {\n  const o = { handler() { return onEvent; } };\n  return o;\n}\n'),
        # `{ name = 0; }` at the top of a block is a statement, not a shorthand,
        # so it must be renamed plainly rather than refused
        ('statement-initial assignment in a block',
         'function f() {\n  let value = 1;\n  {\n    value = 0;\n  }\n  return value;\n}\n',
         {'function': 'f', 'bindings': {'value': ['counter']}},
         'function f() {\n  let counter = 1;\n  {\n    counter = 0;\n  }\n  return counter;\n}\n'),
        ('param default containing a call',
         'function f(now = performance.now()) {\n  return now * 2;\n}\n',
         {'function': 'f', 'bindings': {'now': ['nowMs']}},
         'function f(nowMs = performance.now()) {\n  return nowMs * 2;\n}\n'),
        # a call as the first statement of a block used to read as a shorthand key
        # and stayed behind, dangling to the outer scope
        ('call at the start of a block',
         'function f(handler) {\n  for (const x of xs) {\n    handler(x);\n  }\n'
         '  return handler;\n}\n',
         {'function': 'f', 'bindings': {'handler': ['onEvent']}},
         'function f(onEvent) {\n  for (const x of xs) {\n    onEvent(x);\n  }\n'
         '  return onEvent;\n}\n'),
        # ... and the same in argument position, right after a comma
        ('call in argument position',
         'function f(handler) {\n  return wrap(1, handler(2));\n}\n',
         {'function': 'f', 'bindings': {'handler': ['onEvent']}},
         'function f(onEvent) {\n  return wrap(1, onEvent(2));\n}\n'),
        # an anonymous function expression's parens are a parameter list, not a
        # control head, so its parameters must be found (rest params included)
        ('anonymous function expression parameter',
         'const o = {};\no.onBeforeRender = function (...argPrimary) {\n'
         '  return argPrimary[2];\n};\nuse(argPrimary);\n',
         {'range': [2, 4], 'map': {'argPrimary': 'renderArgs'}},
         'const o = {};\no.onBeforeRender = function (...renderArgs) {\n'
         '  return renderArgs[2];\n};\nuse(argPrimary);\n'),
    ]
    bad = 0
    for label, src, spec, want in cases:
        got, stats = rename_scope(src, spec, mask(src))
        if want is None:
            good = 'error' in stats
            detail = '' if good else f'  (expected refusal, got {got!r})'
        else:
            good = 'error' not in stats and got == want
            detail = '' if good else f'  (got {stats.get("error") or got!r})'
        bad += 0 if good else 1
        print(f"  {'ok  ' if good else 'FAIL'}  {label}{detail}")
    return 1 if bad else 0


def tokenizer_selftest() -> int:
    """`prev` classification: spreads must read as references, not members."""
    cases = [
        ('a.b', 'b', '.', True),
        ('a . b', 'b', '.', True),
        ('a?.b', 'b', '.', True),
        ('x = b', 'b', '=', False),
        ('...b', 'b', '..', False),
        ('[...b]', 'b', '..', False),
        ('f(...b)', 'b', '..', False),
        ('{...b}', 'b', '..', False),
        ('f(... b)', 'b', '..', False),
        ('{ b: 1 }', 'b', '{', True),
        ('{ a: b }', 'b', ':', False),
        ('{a, b}', 'b', ',', False),
        # a call as the first statement of a block, or in argument position, is a
        # reference; only `{ name() {} }` (a method body follows) is a key
        ('{ f(x) }', 'f', '{', False),
        ('f(1, g(2))', 'g', ',', False),
        ('{ m() {} }', 'm', '{', True),
    ]
    bad = 0
    for src, ident, want_prev, want_member in cases:
        hit = [t for t in tokens(mask(src)) if t[2] == ident]
        if not hit:
            print(f'  FAIL  {src!r}: {ident} not tokenized at all')
            bad += 1
            continue
        prev = hit[0][3]
        member = not is_reference(mask(src), hit[0][0], hit[0][1], hit[0][3], hit[0][4])
        good = prev == want_prev and member == want_member
        bad += 0 if good else 1
        print(f"  {'ok  ' if good else 'FAIL'}  {src:<12} prev={prev!r} member={member}")
    return 1 if bad else 0


def selftest() -> int:
    """Regression cases for binding-scope detection (run with --selftest)."""

    cases = [
        ("function f(localValue) {\n  return localValue;\n}\nouter(localValue);\n", 1),
        ("const g = (localValue) => localValue + 1;\nouter(localValue);\n", 1),
        ("const h = localValue => localValue * 2;\nouter(localValue);\n", 1),
        ("const h2 = async localValue => localValue * 2;\nouter(localValue);\n", 1),
        ("xs.forEach(localValue => localValue.dispose());\nouter(localValue);\n", 1),
        ("const k = (a) => { const localValue = a;\n  return localValue; };\n"
         "outer(localValue);\n", 1),
        ("function m() {\n  for (const localValue of list) {\n    use(localValue);\n  }\n}\n"
         "outer(localValue);\n", 1),
        ("function n(localValue) {\n  return {...localValue, a: 1};\n}\n"
         "outer(localValue);\n", 1),
        ("function p(localValue) {\n  return [...localValue];\n}\n"
         "outer(localValue);\n", 1),
        # a binding whose scope must be found from an absolute offset (a
        # region-relative `m.end()` used to silently produce a bogus scope end)
        ("function q(cb) {\n  return cb;\n}\nfunction r(localValue) {\n"
         "  return localValue + 1;\n}\nouter(localValue);\n", 1),
        ("function s() {\n  try {\n    risky();\n  } catch (localValue) {\n"
         "    report(localValue);\n  }\n}\nouter(localValue);\n", 1),
        # `.catch(localValue)` is a method call, not a catch-clause binding: the
        # reference must stay outside the *declaring* binding's scope, so counting
        # it as a binding would hand out a name to a token that is never renamed.
        ("function t() {\n  const localValue = 1;\n"
         "  return Promise.resolve().then(() => localValue).catch(localValue);\n"
         "}\nouter(localValue);\n", 1),
        # destructured parameters: every name in the pattern binds, and the
        # array/object form used to hide all but the last one.
        ("const u = ([localValue, other]) => localValue + other;\n"
         "outer(localValue);\n", 1),
        ("const v = ({a, b: localValue}) => a + localValue;\n"
         "outer(localValue);\n", 1),
        ("const w = ([localValue, {x: other}]) => localValue + other;\n"
         "outer(localValue);\n", 1),
        # a quote sitting inside a regex character class used to desync the masker
        # and hide every declaration after it (found via sanitizeExportFileName).
        ('function a(x) {\n  return x.replace(/[<>:"/\\\\|?*]/g, "-");\n}\n'
         'function b(localValue) {\n  return localValue;\n}\nouter(localValue);\n', 1),
        # ...and braces inside a regex must not count as code braces.
        ('const r = /[{}]/;\nfunction d(localValue) {\n  return localValue;\n}\n'
         'outer(localValue);\n', 1),
        # division is not a regex literal.
        ('function e(localValue) {\n  return localValue / 2 / 3;\n}\n'
         'outer(localValue);\n', 1),
    ]
    bad = 0
    for src, want in cases:
        masked = mask(src)
        binds = find_bindings(masked, 'localValue', 0, len(masked))
        tail = src.rindex('outer(localValue)') + len('outer(')
        covered = any(s <= tail <= e for _p, _k, s, e in binds)
        good = len(binds) == want and not covered
        bad += 0 if good else 1
        print(f"  {'ok  ' if good else 'FAIL'}  {len(binds)} binding(s), "
              f"tail covered={covered}   {src.splitlines()[0][:54]}")

    # a region that starts *inside* a multi-line parameter pattern must still see
    # the parameter binding: the opening paren sits before the region, which the
    # old `open_at < lo` guard mistook for an outer scope.
    pat = ('const q = ({\n  a: localValue,\n  b: other\n}) => localValue + other;\n'
           'outer(localValue);\n')
    start = pat.index('  a: localValue')
    params = [b for b in find_bindings(mask(pat), 'localValue', start, len(pat))
              if b[1] == 'param']
    good = len(params) == 1
    bad += 0 if good else 1
    print(f"  {'ok  ' if good else 'FAIL'}  {len(params)} param binding(s) when the"
          f" region starts inside the pattern")
    print('selftest', 'FAILED' if bad else 'passed')
    return 1 if bad else 0


def list_bindings(src: str, full_mask: str, spec: dict, name: str) -> int:
    """Print every binding of `name` inside one scope, with the line that
    declares it. This is the manual step of naming the remaining placeholders:
    the rename itself stays mechanical, the semantics come from reading here."""
    lo, hi, _excluded, label, err = scope_span(full_mask, spec)
    if err:
        print(f'  {err}')
        return 1
    binds = find_bindings(full_mask, name, lo, hi)
    if not binds:
        print(f'{label}: no binding of {name} inside the scope')
        return 1
    lines = src.splitlines()
    print(f'{label}: {len(binds)} binding(s) of {name}')
    for i, (pos, kind, _s, e) in enumerate(binds):
        line = full_mask.count('\n', 0, pos) + 1
        end_line = full_mask.count('\n', 0, e) + 1
        text = lines[line - 1].strip() if 0 < line <= len(lines) else ''
        print(f'  #{i:<3} {kind:<6} L{line}-{end_line}  {text[:92]}')
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('file', nargs='?')
    ap.add_argument('--plan')
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--audit', action='store_true',
                    help='report plan entries whose old names are still referenced in scope')
    ap.add_argument('--audit-spill', action='store_true',
                    help='advisory: old names still referenced outside their renamed scope '
                         '(catches renames whose missed use now binds to an outer name)')
    ap.add_argument('--list-bindings', metavar='NAME',
                    help='print each binding of NAME in --function/--range, to name them by hand')
    ap.add_argument('--audit-dir', metavar='DIR',
                    help='audit every plan-*.json in DIR, masking the source only once')
    ap.add_argument('--function', dest='fn', help='scope for --list-bindings')
    ap.add_argument('--range', nargs=2, type=int, metavar=('A', 'B'),
                    help='scope for --list-bindings, as two line numbers')
    args = ap.parse_args()

    if args.selftest:
        return selftest() | tokenizer_selftest() | edit_selftest()
    if args.list_bindings:
        if not args.file:
            ap.error('--list-bindings needs a file')
        if args.fn and args.range:
            ap.error('--list-bindings takes either --function or --range, not both')
        src = pathlib.Path(args.file).read_text(encoding='utf-8')
        spec = {'function': args.fn} if args.fn else {'range': args.range or [1, src.count('\n') + 1]}
        return list_bindings(src, mask(src), spec, args.list_bindings)
    if not args.file:
        ap.error('a file is required unless --selftest/--list-bindings is used')

    path = pathlib.Path(args.file)
    src = path.read_text(encoding='utf-8')

    if args.audit_dir:
        masked = mask(src)
        plans = sorted(pathlib.Path(args.audit_dir).glob('plan-*.json'))
        total = 0
        for plan_path in plans:
            plan = json.loads(plan_path.read_text(encoding='utf-8'))
            leftovers = []
            for spec in plan:
                leftovers += audit_scope(src, spec, masked)
                leftovers += audit_spill(src, spec, masked)
            if leftovers:
                print(f'== {plan_path.name}')
                for line in leftovers:
                    print(f'  AUDIT  {line}')
            total += len(leftovers)
        print(f'audit: {total} leftover reference(s) across {len(plans)} plans')
        return 1 if total else 0

    if not args.plan:
        ap.error('--plan is required unless --selftest/--list-bindings/--audit-dir is used')

    if args.audit or args.audit_spill:
        plan = json.loads(pathlib.Path(args.plan).read_text(encoding='utf-8'))
        leftovers = []
        check = audit_spill if args.audit_spill else audit_scope
        masked = mask(src)
        for spec in plan:
            leftovers += check(src, spec, masked)
        for line in leftovers:
            print(f'  AUDIT  {line}')
        print(f'audit: {len(leftovers)} leftover reference(s) to triage')
        return 0

    before_lines = src.count('\n')
    plan = json.loads(pathlib.Path(args.plan).read_text(encoding='utf-8'))

    ok = True
    for spec in plan:
        label = spec.get('function') or f"L{spec.get('range')}"
        src, stats = rename_scope(src, spec, mask(src))
        if 'error' in stats:
            ok = False
            for e in stats['error']:
                print(f'  REFUSED  {e}')
        else:
            targets = list((spec.get('map') or {}).values())
            targets += [n for v in (spec.get('bindings') or {}).values() for n in v]
            print(f"  ok       {label}: {stats['renamed']} tokens, {stats['names']} names -> "
                  + ', '.join(targets))
    if not ok:
        print('\nplan refused; nothing written')
        return 1
    if src.count('\n') != before_lines:
        print(f'REFUSED: line count changed {before_lines} -> {src.count(chr(10))}; '
              f'line ranges in later jobs would be wrong')
        return 1

    if not args.apply:
        print('\ndry run: pass --apply to write')
        return 0

    check = subprocess.run(['node', '--check', '--input-type=module'],
                           input=src, capture_output=True, text=True)
    if check.returncode != 0:
        print('syntax check failed after rename, nothing written:')
        print(check.stderr)
        return 1
    path.write_text(src, encoding='utf-8')
    print(f'\nwrote {path}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
