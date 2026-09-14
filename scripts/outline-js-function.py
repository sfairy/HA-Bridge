#!/usr/bin/env python3
"""Outline a large JavaScript function so it can be decomposed safely.

Usage:
    python scripts/tmp-fn-outline.py <file.js> <functionName> [--min-lines N]

For the given function it reports its line range, then splits the body into
top-level statements and annotates each one with:

    lines   block size
    signals ret / await / this / args / brk / yield  -- constructs that change
            meaning or legality when the block is lifted out of its position
    leaks   locals the block declares that *later* statements read
            -> the extracted helper must return them
    wout    *outer* variables the block assigns to
            -> lifting turns an explicit side effect into a hidden mutation
    caps    free variables: identifiers the block reads that are neither
            declared inside it, nor bound at module scope, nor JS globals
            -> these are the closure captures; a non-empty set means the block
               cannot be lifted without threading them in as parameters
    SAFE    caps is empty and there are no signals and no wout, i.e. the block
            can be moved out verbatim, needing only its own parameters

Read-only analysis tool. It never edits the file.
"""
from __future__ import annotations

import argparse
import bisect
import pathlib
import re
import sys

KEYWORDS = frozenset('''
break case catch class const continue debugger default delete do else export extends
finally for function if import in instanceof let new return super switch this throw
try typeof var void while with yield async await of get set static
true false null undefined
'''.split())

GLOBALS = frozenset('''
window document globalThis self top parent frames console Math JSON Object Array String
Number Boolean Date Map Set WeakMap WeakSet Promise Proxy Reflect Symbol RegExp Error
TypeError RangeError SyntaxError ReferenceError EvalError URIError AggregateError BigInt
Infinity NaN parseInt parseFloat isNaN isFinite encodeURIComponent decodeURIComponent
encodeURI decodeURI escape unescape
setTimeout clearTimeout setInterval clearInterval queueMicrotask requestAnimationFrame
cancelAnimationFrame requestIdleCallback cancelIdleCallback structuredClone reportError
fetch alert confirm prompt addEventListener removeEventListener dispatchEvent
getComputedStyle matchMedia localStorage sessionStorage indexedDB caches crypto
performance navigator location history screen devicePixelRatio innerWidth innerHeight
URL URLSearchParams Blob File FileReader FormData Headers Request Response
AbortController AbortSignal DOMException
Image Audio Path2D OffscreenCanvas createImageBitmap DOMParser XMLSerializer
Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array
Float32Array Float64Array BigInt64Array BigUint64Array ArrayBuffer SharedArrayBuffer
DataView TextEncoder TextDecoder
Element HTMLElement HTMLCanvasElement HTMLInputElement HTMLDivElement HTMLImageElement
Node Event CustomEvent MouseEvent PointerEvent KeyboardEvent WheelEvent TouchEvent
IntersectionObserver ResizeObserver MutationObserver WebSocket Worker MessageChannel
MessagePort EventTarget NodeList NamedNodeMap
'''.split())


# A regex literal may only start where a value is expected: after one of these
# characters, or after one of these keywords.  Without this, a regex such as
# `/[<>:"/\\|?*]/g` leaves a stray quote that desyncs the masker, which then
# swallows real code and reports wildly wrong function spans.
REGEX_PREV_CHARS = set('(,=:[!&|?{};+-*%<>~^')
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
    """Blank comments and string/template/regex literals, preserving offsets."""
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


def line_starts(text: str) -> list[int]:
    offs = [0]
    for line in text.split('\n'):
        offs.append(offs[-1] + len(line) + 1)
    return offs


class Lines:
    def __init__(self, text: str) -> None:
        self.offs = line_starts(text)

    def of(self, idx: int) -> int:
        return bisect.bisect_right(self.offs, idx)

    def start(self, line: int) -> int:
        return self.offs[line - 1]


def match_brace(masked: str, i: int) -> int:
    depth = 0
    j = i
    while j < len(masked):
        c = masked[j]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return j
        j += 1
    return -1


def decl_body_span(masked: str, from_at: int) -> tuple[int, int]:
    """(body_open, body_end) for a declaration whose parameter list follows `from_at`.

    Scanning forward for the first `{` would stop inside a default value such as
    `({preserveLightCache = false} = {})`, so the parameter list is skipped first.
    """
    paren = masked.find('(', from_at)
    if paren < 0:
        return -1, -1
    depth = 0
    i, n = paren, len(masked)
    while i < n:
        c = masked[i]
        if c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
            if depth == 0:
                i += 1
                break
        elif c == ';' and depth == 0:
            return -1, -1
        i += 1
    p = i
    while p < n and masked[p] in ' \t\r\n':
        p += 1
    if masked.startswith('=>', p):
        p += 2
        while p < n and masked[p] in ' \t\r\n':
            p += 1
    if p < n and masked[p] == '{':
        return p, match_brace(masked, p)
    return -1, -1


def find_function(masked: str, name: str) -> tuple[int, int]:
    pat = re.compile(
        r'\b(?:async\s+)?function\s+' + re.escape(name) + r'\s*\(|'
        + r'\b(?:const|let|var)\s+' + re.escape(name) + r'\s*=\s*(?:async\s*)?(?:function\b|\()'
    )
    for m in pat.finditer(masked):
        body, end = decl_body_span(masked, m.end() - 1)
        if body >= 0 and end > 0:
            return body, end
    raise SystemExit(f'function {name!r} not found')


def body_indent(masked: str, lines: Lines, body_open: int, body_end: int) -> int:
    line = lines.of(body_open) + 1
    while line <= len(lines.offs) - 1:
        ls = lines.start(line)
        if ls >= body_end:
            break
        j = ls
        while j < len(masked) and masked[j] == ' ':
            j += 1
        if j < len(masked) and masked[j] not in ('\n', '}'):
            return j - ls
        line += 1
    return 0


def continues(masked: str, i: int) -> bool:
    """Does the statement keep going after position i (`} else {`, `a &&` ...)?"""
    j = i + 1
    n = len(masked)
    while j < n:
        c = masked[j]
        if c in (' ', '\t', '\n', '\r'):
            j += 1
            continue
        if c == ';':
            return False
        if c in ('.', '?', ',', ')', ']'):
            return True
        if masked[j:j + 2] in ('||', '&&', '??', '=>'):
            return True
        if re.match(r'(?:else|catch|finally|while)\b', masked[j:j + 8]):
            return True
        if c in '+-*/%<>=!&|^:':
            return True
        return False
    return False


def top_level_blocks(masked: str, lines: Lines, body_open: int, body_end: int, indent: int) -> list[tuple[int, int]]:
    blocks: list[tuple[int, int]] = []
    depth = 0
    stmt_start: int | None = None
    li = lines.of(body_open) + 1
    while li <= len(lines.offs) - 1:
        ls = lines.start(li)
        if ls >= body_end:
            break
        j = ls
        while j < len(masked) and masked[j] == ' ':
            j += 1
        col = j - ls
        first = masked[j] if j < len(masked) else '\n'
        if depth == 0 and stmt_start is None and col == indent and first not in ('}', '\n', ';'):
            stmt_start = ls
        line_end = lines.start(li + 1) if li + 1 <= len(lines.offs) - 1 else len(masked)
        k = ls
        while k < min(line_end, body_end + 1):
            ch = masked[k]
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0 and stmt_start is not None and not continues(masked, k):
                    blocks.append((stmt_start, k))
                    stmt_start = None
            elif ch == ';' and depth == 0 and stmt_start is not None and not continues(masked, k):
                blocks.append((stmt_start, k))
                stmt_start = None
            k += 1
        li += 1
    if stmt_start is not None:
        blocks.append((stmt_start, body_end - 1))
    return blocks


SIGNALS = {
    'ret': re.compile(r'\breturn\b'),
    'await': re.compile(r'\bawait\b'),
    'this': re.compile(r'\bthis\b'),
    'args': re.compile(r'\barguments\b|\bnew\.target\b'),
    'brk': re.compile(r'\bbreak\b|\bcontinue\b'),
    'yield': re.compile(r'\byield\b'),
}

DECL_HEAD = re.compile(r'\b(?:const|let|var)\s+')
FMN_DECL = re.compile(r'\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|\bclass\s+([A-Za-z_$][\w$]*)')
ASSIGN = re.compile(r'(?<![\w$.])([A-Za-z_$][\w$]*)\s*(?:=(?!=|>)|[-+*/%&|^]=|\?\?=|&&=|\|\|=)')
INC = re.compile(r'(?<![\w$.])(?:\+\+|--)\s*([A-Za-z_$][\w$]*)|([A-Za-z_$][\w$]*)\s*(?:\+\+|--)')
IDENT = re.compile(r'(?<![\w$.])([A-Za-z_$][\w$]*)')
ARROW = re.compile(r'(?:\(([^()]*)\)|([A-Za-z_$][\w$]*))\s*=>')
FN_DECL = re.compile(r'^\s*(?:async\s+)?function\s*(?:[A-Za-z_$][\w$]*)?\s*\(')
KEY_BEFORE = re.compile(r'([{,(])\s*[A-Za-z_$][\w$]*\s*:')


def strip_defaults(s: str) -> str:
    """Drop `= expr` defaults from a parameter/binding pattern."""
    out = []
    depth = 0
    i = 0
    while i < len(s):
        c = s[i]
        if c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
        if c == '=' and depth == 0:
            while i < len(s):
                if s[i] in '([{':
                    depth += 1
                elif s[i] in ')]}':
                    depth -= 1
                elif s[i] == ',' and depth == 0:
                    break
                i += 1
            continue
        out.append(c)
        i += 1
    return ''.join(out)


def pattern_names(pat: str) -> set[str]:
    """Binding names introduced by a parameter list or destructuring pattern."""
    pat = strip_defaults(pat)
    # `{ key: value }` -> the binding is `value`; drop the key
    cleaned = re.sub(r'([{,])\s*[A-Za-z_$][\w$]*\s*:', r'\1 ', pat)
    names = set()
    for m in IDENT.finditer(cleaned):
        n = m.group(1)
        if n not in KEYWORDS:
            names.add(n)
    return names


def params_of(block: str) -> set[str]:
    m = FN_DECL.match(block)
    if not m:
        return set()
    i = m.end() - 1
    depth = 0
    j = i
    while j < len(block):
        if block[j] == '(':
            depth += 1
        elif block[j] == ')':
            depth -= 1
            if depth == 0:
                break
        j += 1
    return pattern_names(block[i + 1:j])


def own_bindings(block: str) -> set[str]:
    names = params_of(block)
    for m in FMN_DECL.finditer(block):
        names.add(m.group(1) or m.group(2))
    # declarations: capture the binding pattern up to its `=`
    for m in DECL_HEAD.finditer(block):
        i = m.end()
        j = i
        depth = 0
        while j < len(block):
            c = block[j]
            if c in '([{':
                depth += 1
            elif c in ')]}':
                if depth == 0:
                    break
                depth -= 1
            elif depth == 0 and c in '=;':
                break
            j += 1
        names |= pattern_names(block[i:j])
        # every declarator after a top-level comma declares another pattern
        k = j
        depth = 0
        while k < len(block):
            c = block[k]
            if c in '([{':
                depth += 1
            elif c in ')]}':
                depth -= 1
                if depth < 0:
                    break
            elif depth == 0 and c == ';':
                break
            elif depth == 0 and c == ',':
                s = k + 1
                e = s
                d2 = 0
                while e < len(block):
                    c2 = block[e]
                    if c2 in '([{':
                        d2 += 1
                    elif c2 in ')]}':
                        if d2 == 0:
                            break
                        d2 -= 1
                    elif d2 == 0 and c2 in '=;,':
                        break
                    e += 1
                names |= pattern_names(block[s:e])
                k = e
                continue
            k += 1
    # arrow function parameters are locals of that arrow
    for m in ARROW.finditer(block):
        raw = m.group(1) if m.group(1) is not None else m.group(2)
        names |= pattern_names(raw)
    return names


def reads(block: str) -> set[str]:
    """Identifiers that are read (not member names, not object keys)."""
    cleaned = KEY_BEFORE.sub(lambda m: m.group(1) + ' ', block)
    out = set()
    for m in IDENT.finditer(cleaned):
        n = m.group(1)
        if n in KEYWORDS or n in GLOBALS:
            continue
        out.add(n)
    return out


def decl_name(block: str) -> str:
    m = re.match(r'\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)', block)
    if m:
        return m.group(1)
    m = re.match(r'\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)', block)
    if m:
        return m.group(1)
    return ''


def binding_info(masked: str, body_open: int, body_end: int, name: str) -> str:
    """How `name` is bound in the enclosing function, and whether it is reassigned.

    A capture may be passed to an extracted helper as a value only when its
    binding is never reassigned in the enclosing function; otherwise the helper
    would observe a stale value and the closure would have seen the new one.
    """
    body = masked[body_open:body_end]
    esc = re.escape(name)
    kinds: list[str] = []
    if re.search(r'\b(?:async\s+)?function\s+' + esc + r'\b', body):
        kinds.append('function')
    for m in re.finditer(r'\b(const|let|var)\s+' + esc + r'\b', body):
        kinds.append(m.group(1))
    for m in re.finditer(r'\bfunction\s*[A-Za-z_$]*\s*\(([^)]*)\)', body):
        if re.search(r'(?<![\w$])' + esc + r'(?![\w$])', m.group(1)):
            kinds.append('param')
    mutable = False
    for m in ASSIGN.finditer(body):
        if m.group(1) != name:
            continue
        before = body[max(0, m.start() - 24):m.start()]
        if re.search(r'(?:const|let|var)\s*$', before):
            continue  # this is the declaration itself, not a reassignment
        mutable = True
    for m in INC.finditer(body):
        if (m.group(1) or m.group(2)) == name:
            mutable = True
    kind = kinds[0] if kinds else 'unknown'
    return kind + ('+MUTABLE' if mutable else '')


def top_level_bindings(masked: str, lines: Lines) -> set[str]:
    names: set[str] = set()
    for m in re.finditer(r'\bimport\s*\{([^}]*)\}\s*from', masked):
        for part in m.group(1).split(','):
            part = part.strip()
            if not part:
                continue
            names.add(part.split(' as ')[-1].strip())
    for m in re.finditer(r'\bimport\s+(?:\*\s*as\s+)?([A-Za-z_$][\w$]*)', masked):
        names.add(m.group(1))
    for i in range(1, len(lines.offs)):
        ls = lines.start(i)
        if masked[ls:ls + 1] not in ('c', 'l', 'v', 'f', 'a', 'e'):
            continue
        m = re.match(r'(?:const|let|var)\s+', masked[ls:])
        if m:
            j = ls + m.end()
            k = j
            depth = 0
            while k < len(masked):
                c = masked[k]
                if c in '([{':
                    depth += 1
                elif c in ')]}':
                    if depth == 0:
                        break
                    depth -= 1
                elif depth == 0 and c in '=;\n':
                    break
                k += 1
            names |= pattern_names(masked[j:k])
        m2 = re.match(r'(?:async\s+)?function\s+([A-Za-z_$][\w$]*)', masked[ls:])
        if m2:
            names.add(m2.group(1))
        m3 = re.match(r'class\s+([A-Za-z_$][\w$]*)', masked[ls:])
        if m3:
            names.add(m3.group(1))
    return names


SELFTEST_CASES = [
    # title, source, function, expected first line, expected last line
    ('regex with a quote in its class must not desync the masker', '''\
function sanitize(raw, fallback) {
  return String(raw).replace(/[<>:"/\\\\|?*]/g, "-") || fallback;
}
function afterSanitize() {
  return 1;
}
''', 'sanitize', 1, 3),
    ('braces and quotes inside a regex are not code', '''\
function bracey(text) {
  const re = /\\{["']\\}/g;
  return re.test(text);
}
function afterBracey() { return 4; }
''', 'bracey', 1, 4),
    ('division is not mistaken for a regex literal', '''\
function ratioOf(value) {
  const half = value / 2;
  return half / 1;
}
function afterRatio() {
  return 2;
}
''', 'ratioOf', 1, 4),
    ('template literal braces do not count', '''\
function tpl(value) {
  return `a${value} { }`;
}
function afterTpl() { return 3; }
''', 'tpl', 1, 3),
    ('regex flags and escapes are handled', '''\
function esc(text) {
  const re = /a\\/b[/*]c/gi;
  return re.test(text) ? 1 : 2;
}
function afterEsc() {
  return 5;
}
''', 'esc', 1, 4),
]


def run_selftest() -> int:
    failures = 0
    for title, src, name, first, last in SELFTEST_CASES:
        masked = mask(src)
        lines = Lines(masked)
        try:
            body_open, body_end = find_function(masked, name)
        except SystemExit:
            print(f'FAIL  {title}: function {name!r} not found')
            failures += 1
            continue
        got = (lines.of(body_open), lines.of(body_end))
        if got != (first, last):
            print(f'FAIL  {title}: {name} spans L{got[0]}-L{got[1]}, expected L{first}-L{last}')
            failures += 1
            continue
        # the extracted span must be self-contained: every '{' balanced
        indent = body_indent(masked, lines, body_open, body_end)
        blocks = top_level_blocks(masked, lines, body_open, body_end, indent)
        if not blocks or blocks[-1][1] > body_end:
            print(f'FAIL  {title}: block scan left the function body')
            failures += 1
            continue
        print(f'ok    {title}: {name} L{first}-L{last}, {len(blocks)} top-level block(s)')
    if failures:
        print(f'selftest: {failures} failure(s)')
        return 1
    print(f'selftest: {len(SELFTEST_CASES)} cases passed')
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('file', nargs='?')
    ap.add_argument('name', nargs='?')
    ap.add_argument('--selftest', action='store_true',
                    help='run the masker/span regression cases and exit')
    ap.add_argument('--min-lines', type=int, default=25)
    ap.add_argument('--caps-max', type=int, default=999,
                    help='only list blocks whose closure-capture count is <= this')
    ap.add_argument('--detail', action='store_true',
                    help='for each listed block, annotate every capture with its binding kind')
    ap.add_argument('--liftable-only', action='store_true',
                    help='only blocks whose captures are all non-mutable and whose name is '
                         'referenced only inside the enclosing function')
    args = ap.parse_args()

    if args.selftest:
        return run_selftest()
    if not args.file or not args.name:
        ap.error('file and name are required unless --selftest is given')

    src = pathlib.Path(args.file).read_text(encoding='utf-8')
    masked = mask(src)
    lines = Lines(masked)
    module_names = top_level_bindings(masked, lines)

    body_open, body_end = find_function(masked, args.name)
    open_line = lines.of(body_open)
    end_line = lines.of(body_end)
    indent = body_indent(masked, lines, body_open, body_end)

    print(f'{args.name}  ->  {args.file}:{open_line}-{end_line}  '
          f'({end_line - open_line + 1} lines, body indent {indent}, module bindings {len(module_names)})')
    print('   SAFE = captures empty, no signals, no outer writes  ->  verbatim extraction')
    print()

    rows = []
    for bs, be in top_level_blocks(masked, lines, body_open, body_end, indent):
        bl, el = lines.of(bs), lines.of(be)
        size = el - bl + 1
        if size < args.min_lines:
            continue
        seg = masked[bs:be + 1]
        raw = src[bs:be + 1]
        sig = [k for k, p in SIGNALS.items() if p.search(seg)]
        own = own_bindings(seg)
        dec = own | {n for n in own if False}
        tail = masked[be + 1:body_end]
        leaks = sorted(d for d in own if re.search(r'(?<![\w$.])' + re.escape(d) + r'(?![\w$])', tail))
        wout = sorted(a for a in {m.group(1) for m in ASSIGN.finditer(seg)}
                      | {m.group(1) or m.group(2) for m in INC.finditer(seg)}
                      if a not in own)
        caps = sorted(reads(seg) - own - module_names)
        if len(caps) > args.caps_max:
            continue
        mut = [c for c in caps if 'MUTABLE' in binding_info(masked, body_open, body_end, c)]
        decl = decl_name(seg)
        inner = len(re.findall(r'(?<![\w$.])' + re.escape(decl) + r'(?![\w$])', masked[body_open:body_end])) if decl else 0
        total = len(re.findall(r'(?<![\w$.])' + re.escape(decl) + r'(?![\w$])', masked)) if decl else 0
        contains_calls = bool(decl) and inner == total
        liftable = bool(caps) and not mut and contains_calls and 'this' not in sig and 'args' not in sig
        rows.append((bl, el, size, sig, leaks, wout, caps, mut, liftable, raw))

    print(f'-- top-level blocks >= {args.min_lines} lines, captures <= {args.caps_max} ({len(rows)}) --')
    hdr = (f'{"lines":>6}  {"range":<16} {"signals":<22} {"captures":<30} '
           f'{"mutable caps":<26} {"LIFT":<5} head')
    print(hdr)
    for bl, el, size, sig, leaks, wout, caps, mut, liftable, raw in rows:
        if args.liftable_only and not liftable:
            continue

        def clip(v: list[str], w: int) -> str:
            s = ','.join(v)
            return (s[:w - 4] + '...') if len(s) > w else (s or '-')
        head = ' '.join(raw.split())[:46]
        print(f'{size:>6}  L{bl}-{el:<11} {",".join(sig) or "-":<22} {clip(caps, 30):<30} '
              f'{clip(mut, 26):<26} {"LIFT" if liftable else "":<5} {head}')
        if args.detail:
            for c in caps:
                print(f'          capture  {c:<28} {binding_info(masked, body_open, body_end, c)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
