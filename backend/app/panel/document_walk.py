from __future__ import annotations

from collections.abc import Callable, Iterator
from typing import Any


def iter_nodes(value: Any) -> Iterator[Any]:
    '''Yield every nested dict/list node, then each leaf scalar.'''
    yield value
    if isinstance(value, dict):
        for item in value.values():
            yield from iter_nodes(item)
    elif isinstance(value, list):
        for item in value:
            yield from iter_nodes(item)


def walk(value: Any, visit: Callable[[Any], None]) -> None:
    '''Call visit(node) for every nested value in a panel document tree.'''
    for node in iter_nodes(value):
        visit(node)


def any_leaf(value: Any, predicate: Callable[[Any], bool]) -> bool:
    '''Return True if any non-container leaf matches predicate.'''
    if isinstance(value, dict):
        return any(any_leaf(item, predicate) for item in value.values())
    if isinstance(value, list):
        return any(any_leaf(item, predicate) for item in value)
    return predicate(value)
