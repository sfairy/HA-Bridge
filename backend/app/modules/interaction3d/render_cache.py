'''Disposable, bounded light-image cache. No project or studio data is stored here.'''
from __future__ import annotations

import fcntl
import hashlib
import io
import os
import re
import time
from contextlib import contextmanager
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException
from PIL import Image, UnidentifiedImageError

MAX_ENTRY_BYTES = 10485760
MAX_PIXELS = 2097152
MAX_CACHE_BYTES = 268435456
MAX_ENTRIES = 2048
MAX_AGE_SECONDS = 2592000


def cache_path(data_dir: Path, scene_id: str, project_id: str, key: str) -> Path:
    if not re.fullmatch('[0-9a-f]{64}', key):
        raise HTTPException(422, detail='缓存标识无效。')
    scope = hashlib.sha256(f'{project_id}\x00{scene_id}'.encode()).hexdigest()
    return data_dir / 'modules' / 'interaction3d' / 'render-cache' / scope / f'{key}.png'


@contextmanager
def cache_lock(root: Path):
    root.mkdir(parents=True, exist_ok=True)
    lock_path = root / '.lock'
    with open(lock_path, 'a+', encoding='utf-8') as handle:
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(handle.fileno(), fcntl.LOCK_UN)


def read_cache(path: Path) -> bytes | None:
    root = path.parent.parent
    if not root.exists():
        return None
    with cache_lock(root):
        try:
            stat = path.stat()
        except FileNotFoundError:
            return None
        if time.time() - stat.st_mtime > MAX_AGE_SECONDS or stat.st_size > MAX_ENTRY_BYTES:
            path.unlink(missing_ok=True)
            return None
        content = path.read_bytes()
        if time.time() - stat.st_mtime > 60:
            os.utime(path, None)
        return content


def write_cache(path: Path, content: bytes) -> None:
    if not content or len(content) > MAX_ENTRY_BYTES:
        raise HTTPException(413, detail='缓存图层过大。')
    try:
        image = Image.open(io.BytesIO(content))
        if image.format != 'PNG' or image.width * image.height > MAX_PIXELS or getattr(image, 'is_animated', False):
            raise ValueError('invalid cache image')
        image.verify()
    except (ValueError, OSError, UnidentifiedImageError, Image.DecompressionBombError) as error:
        raise HTTPException(422, detail='缓存图层无效。') from error
    root = path.parent.parent
    temporary = path.with_suffix(f'.{uuid4().hex}.tmp')
    try:
        with cache_lock(root):
            path.parent.mkdir(parents=True, exist_ok=True)
            with temporary.open('xb') as output:
                output.write(content)
            temporary.chmod(384)
            os.replace(temporary, path)
            now = time.time()
            for candidate in root.glob('*/*.tmp'):
                try:
                    if now - candidate.stat().st_mtime > 3600:
                        candidate.unlink(missing_ok=True)
                except OSError:
                    continue
            entries = []
            for candidate in root.glob('*/*.png'):
                try:
                    stat = candidate.stat()
                except FileNotFoundError:
                    continue
                if now - stat.st_mtime > MAX_AGE_SECONDS:
                    candidate.unlink(missing_ok=True)
                    continue
                entries.append((stat.st_mtime, stat.st_size, candidate))
            count = len(entries)
            total = sum(size for _, size, _ in entries)
            for _, size, candidate in sorted(entries):
                if total <= MAX_CACHE_BYTES and count <= MAX_ENTRIES:
                    break
                candidate.unlink(missing_ok=True)
                total -= size
                count -= 1
            for directory in root.iterdir():
                if directory.is_dir():
                    try:
                        directory.rmdir()
                    except OSError:
                        continue
    except HTTPException:
        temporary.unlink(missing_ok=True)
        raise
    except OSError as error:
        temporary.unlink(missing_ok=True)
        raise HTTPException(422, detail='缓存图层无效。') from error
