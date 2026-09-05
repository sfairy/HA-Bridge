from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from secrets import choice
from uuid import uuid4

CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
PRODUCT_ID = 'ha-bridge'
PRODUCT_NAME = '基础版'
PRODUCT_TYPE = 'base'
BASE_FEATURES = (
    'api',
    'assets',
    'editor',
    'display',
    'ha.sync',
    'ui.base',
    'ha.control',
    'ha.configure',
    'projects.write',
    'runtime.websocket',
)


@dataclass(frozen=True)
class LicenseOrder:
    id: str
    email: str
    contact_name: str
    product: str
    product_name: str
    product_type: str
    activation_code: str
    created_at: str

    def payload(self) -> dict[str, str]:
        return {
            'id': self.id,
            'email': self.email,
            'contactName': self.contact_name,
            'product': self.product,
            'productName': self.product_name,
            'productType': self.product_type,
            'activationCode': self.activation_code,
            'createdAt': self.created_at,
        }


def _connect(database_path: Path) -> sqlite3.Connection:
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    connection.execute(
        '''
        CREATE TABLE IF NOT EXISTS license_orders (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            contact_name TEXT NOT NULL DEFAULT '',
            product TEXT NOT NULL,
            product_name TEXT NOT NULL,
            product_type TEXT NOT NULL,
            activation_code TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL
        )
        '''
    )
    connection.execute(
        'CREATE INDEX IF NOT EXISTS ix_license_orders_email ON license_orders (email)'
    )
    columns = {
        row['name']
        for row in connection.execute('PRAGMA table_info(license_orders)').fetchall()
    }
    if 'instance_id' not in columns:
        connection.execute('ALTER TABLE license_orders ADD COLUMN instance_id TEXT')
    if 'lease_sequence' not in columns:
        connection.execute('ALTER TABLE license_orders ADD COLUMN lease_sequence INTEGER NOT NULL DEFAULT 0')
    return connection


def normalize_email(value: str) -> str:
    return value.strip().lower()


def generate_activation_code() -> str:
    groups = [''.join(choice(CODE_ALPHABET) for _ in range(4)) for _ in range(3)]
    return f'HB-{"-".join(groups)}'


def create_order(database_path: Path, *, email: str, contact_name: str) -> LicenseOrder:
    normalized = normalize_email(email)
    if len(normalized) < 3 or '@' not in normalized:
        raise ValueError('请输入购买授权时使用的邮箱。')
    if len(normalized) > 255:
        raise ValueError('邮箱长度不能超过 255 个字符。')
    name = contact_name.strip()
    if len(name) > 64:
        raise ValueError('联系人姓名不能超过 64 个字符。')
    created_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    with _connect(database_path) as connection:
        for _ in range(8):
            order = LicenseOrder(
                id=str(uuid4()),
                email=normalized,
                contact_name=name,
                product=PRODUCT_ID,
                product_name=PRODUCT_NAME,
                product_type=PRODUCT_TYPE,
                activation_code=generate_activation_code(),
                created_at=created_at,
            )
            try:
                connection.execute(
                    '''
                    INSERT INTO license_orders (
                        id, email, contact_name, product, product_name, product_type,
                        activation_code, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ''',
                    (
                        order.id,
                        order.email,
                        order.contact_name,
                        order.product,
                        order.product_name,
                        order.product_type,
                        order.activation_code,
                        order.created_at,
                    ),
                )
                connection.commit()
                return order
            except sqlite3.IntegrityError:
                continue
    raise RuntimeError('无法生成可用的激活码，请重试。')


def find_order(database_path: Path, *, email: str, activation_code: str) -> LicenseOrder | None:
    normalized = normalize_email(email)
    code = activation_code.strip().upper()
    with _connect(database_path) as connection:
        row = connection.execute(
            'SELECT * FROM license_orders WHERE email = ? AND activation_code = ?',
            (normalized, code),
        ).fetchone()
    return _row_to_order(row)


def bind_order(database_path: Path, order_id: str, instance_id: str) -> int:
    with _connect(database_path) as connection:
        row = connection.execute(
            'SELECT instance_id, lease_sequence FROM license_orders WHERE id = ?',
            (order_id,),
        ).fetchone()
        if row is None:
            raise ValueError('激活码无效或已停用。')
        bound = str(row['instance_id'] or '')
        if bound and bound != instance_id:
            raise ValueError('该激活码已绑定其他安装。')
        sequence = int(row['lease_sequence'] or 0) + 1
        connection.execute(
            '''
            UPDATE license_orders
            SET instance_id = ?, lease_sequence = ?
            WHERE id = ?
            ''',
            (instance_id, sequence, order_id),
        )
        connection.commit()
        return sequence


def get_order(database_path: Path, order_id: str) -> LicenseOrder | None:
    with _connect(database_path) as connection:
        row = connection.execute(
            'SELECT * FROM license_orders WHERE id = ?', (order_id,)
        ).fetchone()
    return _row_to_order(row)


def list_orders(database_path: Path, email: str) -> list[LicenseOrder]:
    normalized = normalize_email(email)
    if len(normalized) < 3 or '@' not in normalized:
        raise ValueError('请输入购买授权时使用的邮箱。')
    with _connect(database_path) as connection:
        rows = connection.execute(
            'SELECT * FROM license_orders WHERE email = ? ORDER BY created_at DESC',
            (normalized,),
        ).fetchall()
    return [_row_to_order(row) for row in rows if row is not None]


def _row_to_order(row: sqlite3.Row | None) -> LicenseOrder | None:
    if row is None:
        return None
    return LicenseOrder(
        id=str(row['id']),
        email=str(row['email']),
        contact_name=str(row['contact_name'] or ''),
        product=str(row['product']),
        product_name=str(row['product_name']),
        product_type=str(row['product_type']),
        activation_code=str(row['activation_code']),
        created_at=str(row['created_at']),
    )
