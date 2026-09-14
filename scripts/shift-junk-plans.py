#!/usr/bin/env python3
"""Rebase the line ranges of the junk-name rename plans after an edit shifted lines.

Every plan in scripts/junk-plans/ records the *absolute* line range it was applied to
(`range`, `exclude`). Refactoring the file moves those lines, which makes
`rename-junk.py --plan ... --audit` (the dangling-reference guard) report false leftovers.

    shift-junk-plans.py --insert 15078 29 --apply
    shift-junk-plans.py --replace 15101 15104 1 --apply
    shift-junk-plans.py --insert 15078 -29 --apply      # undo the insertion

Each `--insert LINE COUNT` inserts COUNT lines before line LINE (negative = removal);
each `--replace START END COUNT` replaces the lines START..END by COUNT lines.
An endpoint maps through the cumulative delta of every edit that lies before it, so a
range becomes shorter when an edit inside it deletes lines. An endpoint that falls *inside*
a replaced region cannot be mapped unambiguously, so the tool refuses instead of guessing.
The rewritten text is validated against a JSON round trip, and everything outside the
`[a, b]` range literals is left byte-identical.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PLANS = os.path.join(HERE, 'junk-plans')


class Refused(Exception):
    pass


def map_line(line: int, edits: list[tuple]) -> int:
    shift = 0
    for kind, start, end, count in edits:
        if kind == 'insert':
            if line >= start:
                shift += count
        else:
            if start <= line <= end:
                raise Refused(f'line {line} is inside replaced range {start}-{end}')
            if line > end:
                shift += count - (end - start + 1)
    return line + shift


def walk(node):
    """Yield (container, key, ranges) for every line-range valued field."""
    if isinstance(node, dict):
        for key, value in node.items():
            if key == 'range' and isinstance(value, list) and len(value) == 2 and all(isinstance(x, int) for x in value):
                yield node, key, [value]
            elif key == 'exclude' and isinstance(value, list) and all(isinstance(x, list) and len(x) == 2 for x in value):
                yield node, key, value
            else:
                yield from walk(value)
    elif isinstance(node, list):
        for item in node:
            yield from walk(item)


def raw_ranges(plan) -> list[list[list[int]]]:
    return [[c[key]] if key == 'range' else c[key] for c, key, _ in walk(plan)]


def top_level_spans(text: str) -> list[tuple[int, int]]:
    """Character spans of the outer array's direct `{...}` children, in order."""
    spans: list[tuple[int, int]] = []
    depth = 0
    start = -1
    in_string = False
    escaped = False
    for index, char in enumerate(text):
        if in_string:
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char in '[{':
            if depth == 1 and char == '{':
                start = index
            depth += 1
        elif char in ']}':
            depth -= 1
            if depth == 1 and start >= 0:
                spans.append((start, index + 1))
                start = -1
    return spans


def retire_ranges(text: str, targets: list[list[int]]) -> tuple[str, list[str]]:
    """Drop the entries whose `range` is exactly one of `targets` (formatting preserved)."""
    retired: list[str] = []
    for start, end in reversed(top_level_spans(text)):
        entry = json.loads(text[start:end])
        if entry.get('range') not in targets:
            continue
        line_start = text.rfind('\n', 0, start) + 1
        cut_start = line_start if not text[line_start:start].strip() else start
        cut_end = end
        while cut_end < len(text) and text[cut_end] in ' \t':
            cut_end += 1
        if cut_end < len(text) and text[cut_end] == ',':
            cut_end += 1
        if cut_end < len(text) and text[cut_end] == '\n':
            cut_end += 1
        left, right = text[:cut_start], text[cut_end:]
        if left.rstrip().endswith(',') and right.lstrip().startswith(']'):
            cut_start = len(left.rstrip()) - 1
        text = text[:cut_start] + right
        retired.append(f'[{entry["range"][0]}, {entry["range"][1]}]')
    return text, retired


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--insert', nargs=2, type=int, action='append', default=[], metavar=('LINE', 'COUNT'))
    parser.add_argument('--replace', nargs=3, type=int, action='append', default=[], metavar=('START', 'END', 'COUNT'))
    parser.add_argument('--retire', nargs=2, type=int, action='append', default=[], metavar=('START', 'END'),
                        help='drop a plan entry whose whole range moved into an extracted helper')
    parser.add_argument('--only', action='append', default=[], metavar='NAME',
                        help='restrict to these plan file names (default: every plan)')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if not args.insert and not args.replace:
        parser.error('at least one --insert or --replace is required')
    edits: list[tuple] = [('insert', line, line, count) for line, count in args.insert]
    edits += [('replace', start, end, count) for start, end, count in args.replace]
    # An entry whose whole range sits inside a replaced region was moved into a helper: the
    # extraction plan already enforces those renames, so the stale entry is retired.
    manual = [list(pair) for pair in args.retire]
    replaced = [(start, end) for kind, start, end, _count in edits if kind == 'replace']

    def stale(range_pair: list[int]) -> bool:
        if any(range_pair == t for t in manual):
            return True
        return any(start <= range_pair[0] and range_pair[1] <= end for start, end in replaced)

    rebased: list[str] = []
    pattern = re.compile(r'\[\s*(\d+)\s*,\s*(\d+)\s*\]')
    for path in sorted(glob.glob(os.path.join(PLANS, 'plan-*.json'))):
        if args.only and os.path.basename(path) not in args.only:
            continue
        with open(path, encoding='utf-8') as handle:
            text = handle.read()
        original = json.loads(text)
        present = [e['range'] for e in original if 'range' in e]
        text, retired = retire_ranges(text, [r for r in present if stale(r)])
        if retired:
            pruned = json.loads(text)
            surviving = [e for e in original if not (e.get('range') and stale(e['range']))]
            if pruned != surviving:
                raise SystemExit(f'{path}: retirement changed surviving entries -- refusing')
            print(f'{os.path.basename(path)}: retired extracted range(s) {", ".join(retired)}')
        before = raw_ranges(json.loads(text))
        try:
            expected = [[[map_line(a, edits), map_line(b, edits)] for a, b in group] for group in before]
        except Refused as exc:
            print(f'{os.path.basename(path)}: {exc}')
            continue
        if expected == before:
            # a retirement alone still has to be written
            if retired:
                rebased.append(os.path.basename(path))
                if args.apply:
                    with open(path, 'w', encoding='utf-8') as handle:
                        handle.write(text)
            continue
        touched = [False]

        def sub(match: re.Match) -> str:
            a, b = map_line(int(match.group(1)), edits), map_line(int(match.group(2)), edits)
            text_a, text_b = match.group(1), match.group(2)
            if (a, b) == (int(text_a), int(text_b)):
                return match.group(0)
            touched[0] = True
            return f'[{a}, {b}]'

        new_text = pattern.sub(sub, text)
        if not touched[0]:
            continue
        got = raw_ranges(json.loads(new_text))
        if got != expected:
            raise SystemExit(f'{path}: text edit does not match the structural shift -- refusing\n  got      {got}\n  expected {expected}')
        rebased.append(os.path.basename(path))
        if args.apply:
            with open(path, 'w', encoding='utf-8') as handle:
                handle.write(new_text)
    print(f'{len(rebased)} plan file(s): ' + ', '.join(rebased) + ('' if args.apply else ' (dry run)'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
