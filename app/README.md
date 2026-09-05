# HA Bridge

HA Bridge 是面向 Home Assistant 的本机仪表盘与中控平台，当前版本 **0.4.6**。

它提供可视化编辑器、3D 户型工作室、正式展示页和中控设备配对。后端是 FastAPI，前端是原生 HTML / CSS / JavaScript，数据默认落在本机 SQLite。

## 功能概览

- 仪表盘编辑：页面、控件、实体绑定、弹窗和主题
- 正式展示：按项目 ID 或项目名称打开全屏中控页
- 中控配对：6 位固定配对码，适合墙面平板或独立浏览器
- 3D 户型：建模、导入、自动导图并回写到仪表盘
- Home Assistant：HTTP / WebSocket 同步实体、状态和媒体代理
- 授权：安装激活后才能使用编辑器、展示页和受保护资源
- 全局日志：按级别、分类和关键词筛选，导出时会遮盖敏感信息

## 目录结构

```text
app/
├── backend/app/          # FastAPI 应用（导入根目录）
├── frontend/             # 页面与静态资源
│   ├── *.html            # 各路由页面
│   └── static/           # /bridge-static 挂载目录
│       ├── js/           # auth / editor / display / shared
│       ├── css/          # 与 js 对应的样式
│       ├── assets/       # brand、manifests
│       ├── renderer/     # 仪表盘运行时
│       ├── 3d-studio/    # 3D 工作室
│       └── vendor/       # 第三方库
├── migrations/           # Alembic 数据库迁移
├── image/                # 内置素材
├── keys/                 # 授权验签公钥
├── dashboard_templates/  # 仪表盘模板
├── container_entrypoint.py
├── alembic.ini
├── requirements.txt
├── VERSION
└── data/                 # 本地运行时数据（默认，不入库）
```

请保留 `frontend/`、`image/`、`keys/`、`dashboard_templates/`、`container_entrypoint.py`、`VERSION`、`release-manifest.json` 和 `sbom.cdx.json`。删除公钥或素材会导致授权校验或内置资源失败。

## 环境要求

- Python 3.11+（本地开发已在 3.14 验证）
- 可访问授权服务器的网络
- 生产环境建议使用 Docker 与持久化卷

## 开发环境

在 `app` 目录下创建虚拟环境并安装依赖：

```bash
cd /path/to/HA-Bridge/app
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

启动开发服务：

```bash
APP_DATA_DIR=./data PYTHONPATH=backend/app \
  uvicorn backend.app.main:app --host 127.0.0.1 --port 18080 --reload
```

打开 <http://127.0.0.1:18080/setup>。

`PYTHONPATH=backend/app` 必须设置，后端按 `from database import Base`、`from ha.client import ...` 这种方式导入。

常用检查：

```bash
curl -s http://127.0.0.1:18080/health/live
curl -s http://127.0.0.1:18080/health/ready
```

数据库迁移由应用启动时自动执行，一般不必单独跑 Alembic。需要手工执行时：

```bash
APP_DATA_DIR=./data PYTHONPATH=backend/app alembic upgrade head
```

## 首次使用

1. 打开 `/setup`，创建管理员账号（用户名 3–64 个字符，密码至少 8 位）。
2. 登录后进入 `/license`，用购买授权时的邮箱和激活码完成本机激活。
3. 在编辑器中配置 Home Assistant 连接，创建或导入仪表盘。
4. 需要墙面中控时，在编辑器里生成 6 位配对码，设备打开 `/pair` 完成配对。

未初始化时访问任意页面都会跳到 `/setup`。未激活时编辑器会跳到 `/license`，展示页和受保护静态资源会返回 401 / 403。

忘记管理员账号或密码时：停止进程，删除数据目录中的 `admin-account.json`，再启动。系统会回到设置页。户型、HA 配置、授权和中控配对数据不会被删除。

## 生产部署

仓库上一级目录提供 `docker-compose.yml`，镜像监听 **18080**，数据与密钥分开挂载。

```yaml
name: ha-bridge

services:
  ha-bridge:
    image: crpi-w1apw3w3zzp43y80.cn-shanghai.personal.cr.aliyuncs.com/weidaye1122/ha_bridge:latest
    container_name: ha-bridge
    user: root
    restart: unless-stopped
    ports:
      - "18080:18080"
    environment:
      APP_PORT: 18080
    volumes:
      - ha-bridge-data:/data
      - ha-bridge-secrets:/run/secrets

volumes:
  ha-bridge-data:
  ha-bridge-secrets:
```

在包含该文件的目录执行：

```bash
docker compose up -d
```

容器启动后访问 `http://<主机>:18080/setup`，后续流程与开发环境相同。

容器内默认路径：

| 用途 | 路径 |
| --- | --- |
| 数据目录 | `/data` |
| HA 凭据密钥 | `/run/secrets/ha_credentials.key` |
| 中控配对密钥 | `/run/secrets/display_pairing_codes.key` |
| 授权密钥 | `/run/secrets/license_credentials.key` |

`container_entrypoint.py` 会在 root 启动时校正这些目录的属主，再降权为 `ha-bridge` 用户运行。

反向代理时请转发 WebSocket（实时状态）以及 `/api/hls/`、`/api/camera_proxy/` 等媒体路径。若站点走 HTTPS，设置 `APP_COOKIE_SECURE=true`。

升级时不要清空 `/data`。应用会在迁移前自动备份数据库；迁移失败会回滚到备份。

## 页面与接口

| 路径 | 说明 |
| --- | --- |
| `/setup` | 首次安装或重置管理员 |
| `/login` | 管理员登录 |
| `/license` | 激活授权 |
| `/` | 仪表盘编辑器 |
| `/3d-studio` | 3D 户型工作室 |
| `/pair` | 中控设备配对 |
| `/display/{project_id}` | 按项目 ID 打开展示页 |
| `/habridge/{project_name}` | 按项目名称打开展示页 |
| `/health/live` | 进程存活 |
| `/health/ready` | 数据库就绪 |
| `/api/v1/*` | 业务 API |
| `/bridge-static/*` | 前端静态资源 |

登录、设置、配对、授权页使用的脚本和样式可匿名访问。编辑器、展示页、3D 工作室和大部分静态资源需要登录或已配对，并且当前授权允许对应能力。

## 运行时数据

`APP_DATA_DIR` 默认是项目下的 `data/`。其中常见文件：

| 路径 | 说明 |
| --- | --- |
| `app.db` | SQLite 主库 |
| `admin-account.json` | 独立管理员账号 |
| `instance-id` | 安装 UUID |
| `secrets/` | HA、配对、授权相关本地密钥 |
| `assets/` | 用户上传图片 |
| `studio3d/` | 3D 草稿 |
| `exports/` | 3D 导出 |
| `logs/` | 全局事件日志 |
| `upgrade-backups/` | 升级前数据库备份 |

`data/`、`.venv/`、`*.db` 和 `upgrade-backups/` 已写入 `.gitignore`，不要提交密钥或数据库。

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `APP_DATA_DIR` | `<项目>/data` | 运行时数据目录 |
| `APP_BASE_URL` | 空 | 对外访问根地址 |
| `APP_PORT` | `18080` | 容器监听端口 |
| `APP_SESSION_MAX_AGE_SECONDS` | `28800` | 登录会话时长 |
| `APP_COOKIE_SECURE` | `false` | HTTPS 下设为 `true` |
| `APP_HA_REQUEST_TIMEOUT_SECONDS` | `10` | 调用 HA 的超时 |
| `APP_HA_RECONCILE_INTERVAL_SECONDS` | `1800` | HA 全量对账间隔 |
| `APP_HA_WEBSOCKET_MAX_SIZE_BYTES` | `67108864` | HA WebSocket 最大消息 |
| `APP_LICENSE_REQUEST_TIMEOUT_SECONDS` | `10` | 授权请求超时 |
| `APP_HA_CREDENTIAL_FILE` | 数据目录内默认路径 | HA 凭据密钥文件 |
| `APP_DISPLAY_PAIRING_KEY_FILE` | 数据目录内默认路径 | 中控配对密钥文件 |
| `APP_LICENSE_CREDENTIAL_FILE` | 数据目录内默认路径 | 授权密钥文件 |

授权校验始终开启，不能通过环境变量关闭。

## 本地开发注意

- 修改业务 JavaScript 后，保留 HTML / `import` 里的 `?v=` 缓存标记，否则浏览器可能继续用旧文件。
- 不要改 `frontend/static/vendor/` 下的 three.js、hls.js、OrbitControls 等第三方文件。
- 界面中文文案需要保持原词，不要意译替换。
- Alembic 的 `migrations/env.py` 必须从 `backend/app` 导入 `database` 和 `models`，不要写成 `from backend.app import models`，否则会重复注册表。
