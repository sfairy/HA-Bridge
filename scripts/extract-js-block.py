#!/usr/bin/env python3
"""Extract a top-level statement block of a giant function into a module-level helper.

Usage:
  extract-js-block.py PLAN.json [--apply] [--report FILE]
  extract-js-block.py --selftest

Plan shape:

  {
    "file": "frontend/static/3d-studio/studio-app.js",
    "function": "rebuildWorldPreview",
    "extractions": [
      {
        "id": "makePreviewLocalWallPoint",
        "lines": [15101, 15104],
        "as": "makePreviewLocalWallPoint",
        "params": ["centerX", "centerZ", "scale"],
        "rename": {
          "previewFloorCenterX": "centerX",
          "item": "centerZ",
          "group": "scale",
          "toPreviewLocalWallPoint": "resolvePreviewLocalPoint"
        },
        "epilogue": ["return resolvePreviewLocalPoint;"],
        "doc": "local (x,z) projection of one wall point for the preview scene",
        "replaceWith": [
          "const toPreviewLocalWallPoint = makePreviewLocalWallPoint(previewFloorCenterX, item, group);"
        ]
      }
    ]
  }

Every extraction is refused unless all of the following hold:

  1. `lines` is exactly one top-level statement block of the enclosing function, and the
     block indentation equals the function body indentation;
  2. the helper body is the moved block dedented (relative indentation preserved) plus
     `epilogue`, and `rename` is a pure token swap: the token streams before/after
     differ only where a declared old name became its declared new name. No renamed
     occurrence may be a member access, object key or shorthand -- a plain token swap
     would corrupt those;
  3. every free identifier of the helper body is a parameter, a helper local, a
     module-level binding of the file, or a known browser global (closed-scope audit);
  4. nothing in the helper assigns to a parameter (pass-by-value cannot write back);
  5. every identifier read by `replaceWith` is module-level or bound earlier inside the
     enclosing function;
  6. `node --check` accepts each synthesized helper and the rewritten file.

`--apply` writes the file; without it the plan is only validated and diffed.
"""

from __future__ import annotations

import argparse
import difflib
import importlib.util
import json
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def load_tool(filename: str, modname: str):
    spec = importlib.util.spec_from_file_location(modname, os.path.join(HERE, filename))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


OUTLINE = load_tool('outline-js-function.py', 'outline_js_function')
JUNK = load_tool('rename-junk.py', 'rename_junk')


class Refused(Exception):
    pass


def node_check(source: str, label: str) -> None:
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as handle:
        handle.write(source)
        path = handle.name
    try:
        proc = subprocess.run(['node', '--check', path], capture_output=True, text=True)
        if proc.returncode != 0:
            head = '\n'.join(proc.stderr.strip().splitlines()[:6])
            raise Refused(f'node --check rejected {label}:\n{head}')
    finally:
        os.unlink(path)


def indent_width(line: str) -> int:
    return len(line) - len(line.lstrip(' '))


def dedent(text: str) -> tuple[str, int]:
    """(dedented text, base indent) for one block slice, keeping relative indentation."""
    lines = text.split('\n')
    if lines and lines[-1] == '':
        lines.pop()
    widths = [indent_width(line) for line in lines if line.strip()]
    if not widths:
        raise Refused('block is blank')
    base = min(widths)
    return '\n'.join(line[base:] if line.strip() else '' for line in lines), base


def is_reference(masked_text: str, start: int, end: int, prev: str, after: str) -> bool:
    """Single source of truth: see `rename-junk.is_reference`."""
    return JUNK.is_reference(masked_text, start, end, prev, after)


def rename_tokens(masked_block: str, mapping: dict[str, str], require_all: bool = True):
    """Edits for a pure 1:1 rename.

    Member accesses and object keys are skipped, never renamed: `obj.name` and
    `{ name: v }` are property lookups, so leaving them alone is always correct (and is
    what `obj.wallId -> obj.wallId` needs). Shorthand `{ name }` is refused instead of
    skipped, because a plain swap would rename the property and leave the variable
    undefined.

    Returns (edits, renamed counts, skipped counts).
    """
    edits: list[tuple[int, int, str]] = []
    counts: dict[str, int] = {}
    skipped: dict[str, int] = {}
    for start, end, text, prev, after in JUNK.tokens(masked_block):
        target = mapping.get(text)
        if target is None:
            continue
        if not is_reference(masked_block, start, end, prev, after):
            skipped[text] = skipped.get(text, 0) + 1
            continue
        kind = JUNK.shorthand_kind(masked_block, start, end, prev, after)
        if kind is not None:
            raise Refused(f'{text!r} is a shorthand ({kind}) at offset {start} -- rename it by hand')
        counts[text] = counts.get(text, 0) + 1
        edits.append((start, end, target))
    if require_all:
        missing = sorted(name for name in mapping if name not in counts)
        if missing:
            raise Refused(f'declared rename(s) {missing} have no occurrence in the block')
    return edits, counts, skipped


def apply_edits(source: str, edits: list[tuple[int, int, str]]) -> str:
    out = source
    for start, end, text in sorted(edits, key=lambda e: -e[0]):
        out = out[:start] + text + out[end:]
    return out


def token_purity(before: str, after: str, mapping: dict[str, str], label: str) -> int:
    """Token streams must be identical except for declared renames."""
    a = [t[2] for t in JUNK.tokens(JUNK.mask(before))]
    b = [t[2] for t in JUNK.tokens(JUNK.mask(after))]
    if len(a) != len(b):
        raise Refused(f'{label}: token count changed {len(a)} -> {len(b)}')
    renamed = 0
    for old, new in zip(a, b):
        if old == new:
            continue
        if mapping.get(old) == new:
            renamed += 1
            continue
        raise Refused(f'{label}: undeclared token change {old!r} -> {new!r}')
    return renamed


def reads_of(masked_text: str, known: set[str]) -> set[str]:
    """Identifiers read by masked_text that are not member names / keys / known names."""
    out: set[str] = set()
    for start, end, text, prev, after in JUNK.tokens(masked_text):
        if text in OUTLINE.KEYWORDS or text in OUTLINE.GLOBALS:
            continue
        if not is_reference(masked_text, start, end, prev, after):
            continue
        if text in known:
            continue
        out.add(text)
    return out


def occurrences(masked_text: str, name: str) -> list[int]:
    return [masked_text.count('\n', 0, start) + 1 for start, end, text, prev, after in JUNK.tokens(masked_text) if text == name]


def param_writes(masked_text: str, params: set[str]) -> list[str]:
    hits: list[str] = []
    for name in sorted(params):
        esc = re.escape(name)
        assign = re.search(
            r'(?<![\w$.])' + esc + r'\s*(?:(?:\*\*|<<|>>>|>>|&&|\|\||\?\?|[+\-*/%&|^])=|=(?![=>]))',
            masked_text,
        )
        update = re.search(r'(?<![\w$.])(?:\+\+|--)\s*' + esc + r'\b|(?<![\w$.])' + esc + r'\s*(?:\+\+|--)', masked_text)
        if assign or update:
            hits.append(name)
    return hits


def decl_line_start(masked: str, lines, name: str) -> int:
    """Char offset of the line holding the declaration of the named function."""
    pat = re.compile(
        r'(?:export\s+)?(?:async\s+)?function\s+' + re.escape(name) + r'\s*\(|'
        r'(?:const|let|var)\s+' + re.escape(name) + r'\s*=\s*(?:async\s*)?(?:function\b|\()'
    )
    match = pat.search(masked)
    if not match:
        raise Refused(f'cannot locate the declaration line of {name!r}')
    return lines.start(lines.of(match.start()))


def function_params(masked: str, decl_at: int) -> set[str]:
    head = masked[decl_at:decl_at + 3000]
    open_paren = head.find('(')
    if open_paren < 0:
        return set()
    close = JUNK.closing_paren(head, open_paren)
    if close < 0:
        return set()
    return OUTLINE.pattern_names(head[open_paren + 1:close])


def format_helper(name: str, params: list[str], body_lines: list[str], epilogue: list[str], doc: str, indent: int) -> str:
    pad = ' ' * indent
    out: list[str] = []
    if doc:
        out.append(f'// {doc}')
    head = f'function {name}(' + ', '.join(params) + ') {'
    out.append(head)
    out.extend(pad + line if line.strip() else '' for line in body_lines)
    out.extend(pad + line if line.strip() else '' for line in epilogue)
    out.append('}')
    return '\n'.join(out) + '\n'


def block_run(block_list: list[tuple[int, int]], masked: str, lines, first: int, last: int):
    """The run of top-level blocks covering [first,last], or None when it is not contiguous.

    Blank and comment-only lines may separate the blocks (both are whitespace in the
    mask), so a cluster such as two declarations plus the loop that consumes them can be
    extracted in one go.
    """
    run = [(a, b) for a, b in block_list if a >= first and b <= last]
    if not run or run[0][0] != first or run[-1][1] != last:
        return None
    for (a1, b1), (a2, _b2) in zip(run, run[1:]):
        if a2 <= b1:
            return None
        if masked[lines.start(b1 + 1):lines.start(a2)].strip():
            return None
    return run


def run(plan: dict) -> tuple[str, str]:
    src_path = plan['file']
    with open(src_path, encoding='utf-8') as handle:
        src = handle.read()
    masked = JUNK.mask(src)
    lines = OUTLINE.Lines(masked)
    func = plan['function']
    body_open, body_end = OUTLINE.find_function(masked, func)
    indent = OUTLINE.body_indent(masked, lines, body_open, body_end)
    block_list = [(lines.of(a), lines.of(b - 1)) for a, b in OUTLINE.top_level_blocks(masked, lines, body_open, body_end, indent)]
    blocks = {pair: True for pair in block_list}
    module_level = OUTLINE.top_level_bindings(masked, lines)
    decl_at = decl_line_start(masked, lines, func)
    func_params = function_params(masked, decl_at)

    report: list[str] = [
        f'file      {src_path}',
        f'function  {func}  body indent {indent}  module bindings {len(module_level)}  params {sorted(func_params)}',
        '',
    ]

    prepared: list[dict] = []
    for spec in plan['extractions']:
        first, last = spec['lines']
        run_blocks = block_run(block_list, masked, lines, first, last)
        if run_blocks is None:
            near = sorted(block_list, key=lambda k: abs(k[0] - first))[:4]
            raise Refused(f'{spec["id"]}: lines {first}-{last} is not a contiguous run of top-level '
                          f'blocks of {func}; nearest blocks {near}')
        start, end = JUNK.line_range_to_chars(masked, first, last)
        raw = src[start:end]
        if not raw.strip().endswith((';', '}')):
            raise Refused(f'{spec["id"]}: slice does not end with a complete statement: {raw.strip()[-40:]!r}')
        body_text, width = dedent(raw)
        if width != indent:
            raise Refused(f'{spec["id"]}: block indent {width} != body indent {indent}')
        mapping = dict(spec.get('rename') or {})
        edits, counts, skipped = rename_tokens(JUNK.mask(body_text), mapping)
        renamed_body = apply_edits(body_text, edits)
        renamed = token_purity(body_text, renamed_body, mapping, f'{spec["id"]} body')

        epilogue = [line.strip() for line in (spec.get('epilogue') or [])]
        epilogue_text = '\n'.join(epilogue)
        if epilogue:
            ep_edits, _, _ = rename_tokens(JUNK.mask(epilogue_text), mapping, require_all=False)
            renamed_epilogue = apply_edits(epilogue_text, ep_edits)
            token_purity(epilogue_text, renamed_epilogue, mapping, f'{spec["id"]} epilogue')
            ep_lines = renamed_epilogue.split('\n')
        else:
            ep_lines = []

        params = list(spec['params'])
        param_set = set(params)
        body_lines = renamed_body.split('\n')
        helper_body = '\n'.join(body_lines + ep_lines)
        helper_text = format_helper(spec['as'], params, body_lines, ep_lines, spec.get('doc', ''), plan.get('helperIndent', 2))

        masked_helper = JUNK.mask(helper_body)
        own = OUTLINE.own_bindings(helper_body)
        shadowed = sorted(param_set & own)
        free = reads_of(masked_helper, own | param_set | module_level)
        if free:
            detail = ', '.join(f'{name}@{occurrences(masked_helper, name)[:4]}' for name in sorted(free))
            raise Refused(f'{spec["id"]}: unbound identifiers in helper -- {detail}')
        writes = param_writes(masked_helper, param_set)
        if writes:
            raise Refused(f'{spec["id"]}: helper assigns to parameter(s) {writes}')

        replace_lines = list(spec['replaceWith'])
        for line in replace_lines:
            if indent_width(line) != 0:
                raise Refused(f'{spec["id"]}: replaceWith lines must be unindented')
        replacement_text = '\n'.join((' ' * indent) + line for line in replace_lines) + '\n'
        bound_before = OUTLINE.own_bindings(masked[body_open:start]) | func_params
        known = bound_before | module_level | param_set | {spec['as']} | OUTLINE.own_bindings(replacement_text)
        stray = reads_of(JUNK.mask(replacement_text), known)
        if stray:
            raise Refused(f'{spec["id"]}: replaceWith reads names not bound at the call site: {sorted(stray)}')

        # A binding that the move deletes must not be referenced anywhere else in the
        # caller: `node --check` cannot see a ReferenceError. A same-name declaration
        # elsewhere in the function (a different binding) makes the name safe again.
        removed = OUTLINE.own_bindings(body_text) - OUTLINE.own_bindings(replacement_text)
        if removed:
            outside = masked[body_open:start] + masked[end:body_end]
            outside_declared = OUTLINE.own_bindings(outside)
            outside_reads = {tok[2] for tok in JUNK.tokens(outside) if is_reference(outside, tok[0], tok[1], tok[3], tok[4])}
            dangling = sorted(name for name in removed if name not in outside_declared and name in outside_reads)
            if dangling:
                raise Refused(f'{spec["id"]}: binding(s) removed from {func} are still referenced '
                              f'elsewhere in it: {dangling}')

        node_check(helper_text, f'{spec["id"]} helper')

        prepared.append({
            'id': spec['id'],
            'start': start,
            'end': end,
            'lines': (first, last),
            'helper_text': helper_text,
            'replacement': replacement_text,
            'params': params,
            'renames': counts,
            'skipped': skipped,
            'epilogue': ep_lines,
            'body_lines': body_lines,
            'shadowed': shadowed,
            'renamed_tokens': renamed,
        })
        report.append(f'[{spec["id"]}] L{first}-{last} -> {spec["as"]}({", ".join(params)})'
                      + (f'  [run of {len(run_blocks)} blocks]' if len(run_blocks) > 1 else ''))
        report.append('    renames: ' + (', '.join(f'{k}x{v}' for k, v in sorted(counts.items())) or 'none')
                      + (f' | epilogue {len(ep_lines)} line(s)' if ep_lines else '')
                      + (' | skipped member/key: ' + ', '.join(f'{k}x{v}' for k, v in sorted(skipped.items())) if skipped else ''))
        for line in helper_text.rstrip('\n').split('\n'):
            report.append('    | ' + line)
        report.append('    call site: ' + (replace_lines[0].strip() if len(replace_lines) == 1 else '; '.join(replace_lines)))
        if shadowed:
            report.append(f'    WARNING helper shadows: {shadowed}')
        report.append('')

    new = src
    for item in sorted(prepared, key=lambda e: -e['start']):
        new = new[:item['start']] + item['replacement'] + new[item['end']:]
    insertion = ''.join(item['helper_text'] for item in sorted(prepared, key=lambda e: e['start']))
    new = new[:decl_at] + insertion + new[decl_at:]
    node_check(new, 'rewritten file')

    diff = difflib.unified_diff(
        src.splitlines(keepends=True), new.splitlines(keepends=True),
        fromfile='a/' + src_path, tofile='b/' + src_path, n=3,
    )
    report.append('---- diff ----')
    report.extend(''.join(diff).splitlines())
    report.append('')
    report.append(f'{len(prepared)} extraction(s), '
                  f'{sum(len(i["body_lines"]) + len(i["epilogue"]) for i in prepared)} lines moved into helpers, '
                  f'node --check OK on every helper and on the rewritten file')
    return new, '\n'.join(report)


def selftest() -> int:
    tmp = tempfile.mkdtemp(prefix='extract-js-block-')
    src_path = os.path.join(tmp, 'sample.js')
    with open(src_path, 'w', encoding='utf-8') as handle:
        handle.write(
            'const theme = { floor: "#fff" };\n'
            'function helper(a) { return a * 2; }\n'
            'function big(b) {\n'
            '  const localParam = b + 1;\n'
            '  const doubled = helper(localParam);\n'
            '  const shade = color => ({ x: color.floor, z: localParam });\n'
            '  return doubled + shade(theme).z;\n'
            '}\n'
        )
    base = {
        'file': src_path,
        'function': 'big',
        'extractions': [{
            'id': 'makeShade',
            'lines': [6, 6],
            'as': 'makeShade',
            'params': ['centerZ'],
            'rename': {'localParam': 'centerZ', 'shade': 'resolveShade'},
            'epilogue': ['return resolveShade;'],
            'replaceWith': ['const shade = makeShade(localParam);'],
        }],
    }
    ok = True

    def expect_refusal(label: str, mutate) -> None:
        nonlocal ok
        variant = json.loads(json.dumps(base))
        mutate(variant)
        try:
            run(variant)
            print(f'selftest {label}: FAIL (accepted)')
            ok = False
        except Refused as exc:
            print(f'selftest {label}: PASS ({str(exc)[:72]})')

    new, _ = run(base)
    checks = [
        ('helper inserted', 'function makeShade(centerZ) {' in new),
        ('epilogue kept', 'return resolveShade;' in new),
        ('call site rewritten', 'const shade = makeShade(localParam);' in new),
        ('helper above caller', new.index('function makeShade') < new.index('function big')),
        ('block gone', 'const shade = color =>' not in new),
    ]
    for label, condition in checks:
        print(f'selftest {label}: {"PASS" if condition else "FAIL"}')
        ok &= bool(condition)

    expect_refusal('refuses unknown rename', lambda p: p['extractions'][0]['rename'].update({'nope': 'nope2'}))
    expect_refusal('refuses member-access rename', lambda p: p['extractions'][0]['rename'].update({'floor': 'ground'}))
    expect_refusal('refuses object-key rename', lambda p: p['extractions'][0]['rename'].update({'x': 'x2'}))
    expect_refusal('refuses unbound epilogue name', lambda p: p['extractions'][0].update({'epilogue': ['return missingName;']}))
    expect_refusal('refuses unbound call-site read', lambda p: p['extractions'][0].update({'replaceWith': ['const shade = makeShade(notBoundAnywhere);']}))
    expect_refusal('refuses partial range', lambda p: p['extractions'][0].update({'lines': [2, 6]}))

    run_plan = json.loads(json.dumps(base))
    run_plan['extractions'] = [{
        'id': 'computeDoubledAndShade',
        'lines': [5, 6],
        'as': 'computeDoubledAndShade',
        'params': ['b'],
        'rename': {'localParam': 'b', 'doubled': 'doubledValue', 'shade': 'resolveShade'},
        'epilogue': ['return { doubledValue, resolveShade };'],
        'replaceWith': ['const { doubled, shade } = computeDoubledAndShade(b);'],
    }]
    moved, _ = run(run_plan)
    checks.append(('two-block run extracted', 'return { doubledValue, resolveShade };' in moved
                   and 'const { doubled, shade } = computeDoubledAndShade(b);' in moved))
    for label, condition in checks[-1:]:
        print(f'selftest {label}: {"PASS" if condition else "FAIL"}')
        ok &= bool(condition)
    expect_refusal('refuses param write', lambda p: p['extractions'][0].update({
        'params': ['centerZ', 'counter'],
        'epilogue': ['counter = 1;', 'return resolveShade;'],
    }))
    return 0 if ok else 1


def main() -> int:
    if '--selftest' in sys.argv:
        return selftest()
    parser = argparse.ArgumentParser(description='extract a top-level block of a giant function into a helper')
    parser.add_argument('plan', nargs='?')
    parser.add_argument('--apply', action='store_true', help='write the file (default: dry run)')
    parser.add_argument('--report', help='write the report to this file')
    args = parser.parse_args()
    if not args.plan:
        parser.error('a plan path is required')
    plan = json.load(open(args.plan, encoding='utf-8'))
    try:
        new, report = run(plan)
    except Refused as exc:
        print(f'REFUSED: {exc}')
        return 1
    print(report)
    if args.report:
        with open(args.report, 'w', encoding='utf-8') as handle:
            handle.write(report)
    if args.apply:
        with open(plan['file'], 'w', encoding='utf-8') as handle:
            handle.write(new)
        print(f'APPLIED to {plan["file"]}')
    else:
        print('(dry run; pass --apply to write)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
