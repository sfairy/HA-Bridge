from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND_APP = ROOT / 'backend' / 'app'
if str(BACKEND_APP) not in sys.path:
    sys.path.insert(0, str(BACKEND_APP))

REGISTER = ROOT / 'register'
if str(REGISTER) not in sys.path:
    sys.path.insert(0, str(REGISTER))
