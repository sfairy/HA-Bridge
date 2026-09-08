from __future__ import annotations

import os
from pathlib import Path

from cryptography.fernet import Fernet


def load_or_create_fernet_key(path: Path, *, empty_message: str) -> bytes:
    '''Load a Fernet key from disk, creating a mode-384 file on first use.'''
    path.parent.mkdir(parents=True, exist_ok=True, mode=448)
    try:
        os.chmod(path.parent, 448)
    except OSError:
        pass
    if path.exists():
        key = path.read_bytes().strip()
        if not key:
            raise ValueError(empty_message)
        return key
    key = Fernet.generate_key()
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 384)
    with os.fdopen(descriptor, 'wb') as key_file:
        key_file.write(key + b'\n')
    return key
