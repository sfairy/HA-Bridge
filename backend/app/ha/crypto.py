from __future__ import annotations

from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken

from secure_key_file import load_or_create_fernet_key


class CredentialCipherError(RuntimeError):
    pass


class CredentialCipher:
    def __init__(self, key_path: Path) -> None:
        self.key_path = key_path

    def _load_or_create_key(self) -> bytes:
        try:
            return load_or_create_fernet_key(self.key_path, empty_message='凭证密钥文件为空。')
        except ValueError as error:
            raise CredentialCipherError(str(error)) from error

    def encrypt(self, plaintext: str) -> str:
        if not plaintext:
            raise CredentialCipherError('Home Assistant Token 不能为空。')
        return Fernet(self._load_or_create_key()).encrypt(plaintext.encode('utf-8')).decode('ascii')

    def decrypt(self, ciphertext: str) -> str:
        try:
            return Fernet(self._load_or_create_key()).decrypt(ciphertext.encode('ascii')).decode('utf-8')
        except (InvalidToken, UnicodeError, ValueError) as error:
            raise CredentialCipherError('无法解密 Home Assistant 凭证。') from error
