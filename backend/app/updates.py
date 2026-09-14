'''Optional release discovery, isolated from licensing and editor startup.'''

from __future__ import annotations

import asyncio
import json
import os
import random
import re
import time
from datetime import UTC, datetime
from pathlib import Path
from uuid import UUID

import httpx
from dependencies import CurrentUser
from fastapi import APIRouter, Request, Response

router = APIRouter()

RELEASE_ENDPOINTS = (
    'https://pay.habridge.cn/store/v1/updates/latest',
    'https://pay2.habridge.cn/store/v1/updates/latest',
)
WIKI_URL = 'https://wiki.habridge.cn/updates.html'
CHECK_INTERVAL = 21600
MAX_CACHE_AGE = 86400
MAX_RESPONSE_BYTES = 32768
_VERSION_PART = r'(0|[1-9][0-9]{0,8})'
_VERSION_RE = re.compile(rf'^v?{_VERSION_PART}(?:\.{_VERSION_PART}){{2,3}}$')
_CHANNELS = frozenset({'docker', 'addon'})


def stable_version(value: object) -> tuple[int, ...] | None:
    if not isinstance(value, str) or not _VERSION_RE.fullmatch(value):
        return None
    parts = tuple(int(part) for part in value.removeprefix('v').split('.'))
    if len(parts) == 3:
        return (*parts, 0)
    return parts


def release_value(payload: object, channel: str) -> dict[str, str] | None:
    if (
        not isinstance(payload, dict)
        or payload.get('product') != 'ha-bridge'
        or payload.get('channel') != channel
        or 'release' not in payload
    ):
        raise ValueError('Unexpected release response')
    release = payload['release']
    if release is None:
        return None
    if not isinstance(release, dict) or stable_version(release.get('version')) is None:
        raise ValueError('Invalid release version')
    entry_id = str(UUID(release['id']))
    return {'id': entry_id, 'version': release['version']}


class UpdateChecker:
    def __init__(
        self,
        data_dir: Path,
        version: str,
        channel: str,
        *,
        enabled: bool = True,
        transport: httpx.AsyncBaseTransport | None = None,
        endpoints: tuple[str, ...] = RELEASE_ENDPOINTS,
        clock=time.time,
    ) -> None:
        self.version = version
        self.channel = channel if channel in _CHANNELS else 'docker'
        self.enabled = enabled
        self.transport = transport
        self.endpoints = endpoints
        self.clock = clock
        self.path = data_dir / 'cache' / 'update-check.json'
        self.release: dict[str, str] | None = None
        self.checked_at = 0.0
        self.task: asyncio.Task[None] | None = None
        self.lock = asyncio.Lock()
        try:
            if self.path.is_file() and self.path.stat().st_size <= MAX_RESPONSE_BYTES:
                payload = json.loads(self.path.read_text(encoding='utf-8'))
                checked = float(payload['checkedAt'])
                age = self.clock() - checked
                if 0 <= age <= MAX_CACHE_AGE and payload.get('channel') == self.channel:
                    release = release_value(payload, self.channel)
                    self.release = release
                    self.checked_at = checked
        except (OSError, ValueError, KeyError, TypeError, AttributeError):
            pass

    def start(self) -> None:
        if not self.enabled or self.task is not None:
            return
        if self.channel not in _CHANNELS:
            return
        self.task = asyncio.create_task(self._run(), name='release-update-check')

    async def stop(self) -> None:
        task = self.task
        self.task = None
        if task is None:
            return
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

    async def _run(self) -> None:
        while True:
            try:
                await self.check_once()
            except asyncio.CancelledError:
                raise
            except Exception:
                pass
            delay = CHECK_INTERVAL + random.uniform(0, 600)
            await asyncio.sleep(delay)

    async def check_once(self) -> None:
        if not self.enabled:
            return
        async with self.lock:
            async with httpx.AsyncClient(
                timeout=5,
                transport=self.transport,
                follow_redirects=False,
            ) as client:
                for endpoint in self.endpoints:
                    try:
                        async with client.stream(
                            'GET',
                            endpoint,
                            params={'channel': self.channel},
                            headers={'Accept': 'application/json'},
                        ) as response:
                            response.raise_for_status()
                            body = bytearray()
                            async for chunk in response.aiter_bytes():
                                body.extend(chunk)
                                if len(body) > MAX_RESPONSE_BYTES:
                                    raise ValueError('Release response too large')
                            release = release_value(json.loads(bytes(body)), self.channel)
                            self.release = release
                            self.checked_at = self.clock()
                            self._save_cache()
                            return
                    except (
                        httpx.HTTPError,
                        ValueError,
                        KeyError,
                        TypeError,
                        AttributeError,
                        OSError,
                        json.JSONDecodeError,
                    ):
                        continue

    def _save_cache(self) -> None:
        temporary = self.path.with_suffix('.tmp')
        self.path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            'product': 'ha-bridge',
            'channel': self.channel,
            'release': self.release,
            'checkedAt': self.checked_at,
        }
        try:
            descriptor = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
            with os.fdopen(descriptor, 'w', encoding='utf-8') as output:
                json.dump(data, output)
            os.replace(temporary, self.path)
        except OSError:
            try:
                temporary.unlink(missing_ok=True)
            except OSError:
                pass

    def status(self) -> dict[str, object]:
        age = self.clock() - self.checked_at if self.checked_at else None
        fresh = age is not None and 0 <= age <= MAX_CACHE_AGE
        release = self.release if fresh else None
        current = stable_version(self.version)
        latest = stable_version(release['version']) if release else None
        available = bool(current is not None and latest is not None and latest > current)
        if available and release is not None:
            log_url = f'{WIKI_URL}?release={release["id"]}#changelog'
        else:
            log_url = f'{WIKI_URL}#changelog'
        return {
            'currentVersion': self.version,
            'channel': self.channel,
            'updateAvailable': available,
            'latestVersion': release['version'] if release and available else None,
            'checkedAt': (
                datetime.fromtimestamp(self.checked_at, UTC).isoformat() if fresh else None
            ),
            'logUrl': log_url,
        }


@router.get('/updates')
def update_status(request: Request, response: Response, _user: CurrentUser) -> dict[str, object]:
    response.headers['Cache-Control'] = 'no-store'
    return request.app.state.update_checker.status()
