#!/usr/bin/env python3
from __future__ import annotations

import os
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VENV_PYTHON = ROOT / '.venv' / 'bin' / 'python'
REGISTER_PORT = '18082'
APP_PORT = '18081'


def ensure_venv() -> None:
    if Path(sys.executable).resolve() == VENV_PYTHON.resolve():
        return
    if not VENV_PYTHON.is_file():
        subprocess.check_call([sys.executable, '-m', 'venv', str(ROOT / '.venv')])
        subprocess.check_call([str(VENV_PYTHON), '-m', 'pip', 'install', '-r', str(ROOT / 'requirements.txt')])
    os.execv(str(VENV_PYTHON), [str(VENV_PYTHON), str(ROOT / 'start.py'), *sys.argv[1:]])


def spawn(command: list[str], environment: dict[str, str]) -> subprocess.Popen:
    return subprocess.Popen(command, cwd=ROOT, env=environment)


def main() -> None:
    ensure_venv()
    environment = os.environ.copy()
    environment['APP_DATA_DIR'] = str(ROOT / 'data')
    environment['REGISTER_DATA_DIR'] = str(ROOT / 'register' / 'data')
    environment['PYTHONPATH'] = str(ROOT / 'backend' / 'app')
    python = sys.executable
    processes = [
        spawn(
            [python, '-m', 'uvicorn', 'register.app:app', '--host', '127.0.0.1', '--port', REGISTER_PORT],
            environment,
        ),
        spawn(
            [
                python,
                '-m',
                'uvicorn',
                'backend.app.main:app',
                '--host',
                '127.0.0.1',
                '--port',
                APP_PORT,
                '--reload',
            ],
            environment,
        ),
    ]

    def stop(_signum=None, _frame=None) -> None:
        for process in processes:
            if process.poll() is None:
                process.send_signal(signal.SIGTERM)

    signal.signal(signal.SIGINT, stop)
    signal.signal(signal.SIGTERM, stop)
    print(f'主应用  http://127.0.0.1:{APP_PORT}/setup')
    print(f'授权店  http://127.0.0.1:{REGISTER_PORT}/')
    try:
        while all(process.poll() is None for process in processes):
            time.sleep(0.4)
    finally:
        stop()
        for process in processes:
            process.wait()


if __name__ == '__main__':
    main()
