# HA Bridge

面向 [Home Assistant](https://www.home-assistant.io/) 的本机仪表盘与中控平台，当前版本 **0.5.0**。

提供可视化编辑器、3D 户型工作室、全屏展示页和中控配对。后端是 FastAPI，前端是原生 HTML / CSS / JavaScript，数据默认落在本机 SQLite。

本仓库是可本地运行的源码树。授权校验仍然开启，激活只走仓库内的本机授权店。

## 功能

- 仪表盘编辑：页面、控件、实体绑定、弹窗、主题（默认 `ui.base`）
- 正式展示：`/display/{项目ID}` 或 `/habridge/{项目名称}` 打开全屏中控页
- 中控配对：6 位固定配对码，适合墙面平板或独立浏览器
- 3D 户型：建模、导入、按楼层或全楼自动导图并回写到仪表盘
- 3D 交互：仪表盘控件嵌入户型舞台；从工作室草稿快照场景，在舞台里开关已绑定的灯和开关；展示页用 iframe 打开同一舞台
- Home Assistant：HTTP / WebSocket 同步实体与状态，代理摄像头和媒体
- 全局日志：按级别、分类和关键词筛选，导出时遮盖敏感信息
- 本机授权店：邮箱领取激活码，签发含全部基础能力的本地租约

## 仓库结构

工程在仓库根目录，不再套一层 `app/`。

```text
HA-Bridge/
├── backend/app/            # FastAPI 应用（PYTHONPATH 指向这里）
│   ├── api/                # 认证、项目、HA、资源、3D、日志、中控
│   ├── ha/                 # HA 客户端、同步、状态推送
│   ├── panel/              # 仪表盘文档与校验
│   ├── modules/            # 增量能力（3D 交互）
│   ├── license/            # 授权校验（本机店租约）
│   └── main.py
├── frontend/               # 页面与静态资源
│   ├── *.html
│   ├── modules/            # 3D 交互舞台与配置编辑器（经 /api/v1/modules/interaction3d 下发）
│   └── static/             # 挂载为 /bridge-static
│       ├── js/             # auth / editor / display / shared
│       ├── css/
│       ├── assets/         # 品牌图、manifest
│       ├── renderer/       # 仪表盘运行时
│       ├── 3d-studio/
│       ├── modules/        # 3D 交互编辑器桥接、封面、定义
│       ├── utils/          # 户型工作室与 3D 交互共用工具
│       └── vendor/         # three.js、hls.js、MDI
├── register/               # 本机授权店（默认 18082）
├── migrations/             # Alembic 迁移 0001–0013
├── image/                  # 内置素材目录（当前为空，可自行放入）
├── data/                   # 运行时数据（不入库）
├── requirements.txt
├── alembic.ini
├── VERSION
├── start.py                # 本地一键启动
└── container_entrypoint.py
```

不要删除 `frontend/`。内置素材目录 `image/` 可为空，编辑器里可改用用户上传图片。

`data/`、`register/data/`、`.venv/`、`*.db`、`原项目/` 已写入 `.gitignore`。

## 环境

- Python 3.11+（本地已在 3.14 验证）
- 本机同时跑两个进程：主应用 **18081**、授权店 **18082**
- 连接 Home Assistant 时，主应用需要能访问 HA 的 HTTP 与 WebSocket

依赖见 [requirements.txt](requirements.txt)：FastAPI、SQLAlchemy、Alembic、httpx、Pillow、argon2、cryptography 等。

## 本地启动

仓库根目录一条命令：

```bash
python3 start.py
```

首次运行会自动创建 `.venv` 并安装依赖。之后会同时拉起主应用 **18081** 和授权店 **18082**。打开 <http://127.0.0.1:18081/setup>。

数据库迁移在主应用启动时自动执行。需要手工升级时：

```bash
APP_DATA_DIR=./data PYTHONPATH=backend/app alembic upgrade head
```

## 首次使用

1. 打开 `/setup`，创建管理员（用户名 3–64 个字符，密码至少 8 位）。
2. 登录后进入 `/license`。另开 <http://127.0.0.1:18082/>，用邮箱领取激活码，再回到授权页激活。
3. 在编辑器里配置 Home Assistant 的地址和长期访问令牌，然后创建空白仪表盘。
4. 使用 3D 交互：先在 `/3d-studio` 保存户型，再在编辑器添加「3D 交互」控件并载入户型快照，绑定 `light.*` / `switch.*` 后即可在舞台里开关。
5. 墙面中控：在编辑器生成 6 位配对码，设备打开 `/pair` 完成配对。

未初始化时任意页面都会跳到 `/setup`。未激活时编辑器跳到 `/license`，展示页和受保护静态资源返回 401 / 403。

忘记管理员账号或密码：停掉进程，删除 `data/admin-account.json` 再启动。系统回到设置页。户型、HA 配置、授权和中控配对不会被删。

本机店签发的租约包含：`api`、`assets`、`editor`、`display`、`ha.sync`、`ha.configure`、`ha.control`、`projects.write`、`runtime.websocket`、`ui.base`、`module.3d_interaction`。已开通编辑器的本地租约即可使用 3D 交互，不必重新领取激活码。不连接官方授权云。

## 页面与接口

| 路径 | 说明 |
| --- | --- |
| `/setup` | 首次安装或重置管理员 |
| `/login` | 管理员登录 |
| `/license` | 用本机店激活码激活 |
| `/` | 仪表盘编辑器 |
| `/3d-studio` | 3D 户型工作室 |
| `/pair` | 中控设备配对 |
| `/display/{project_id}` | 按项目 ID 打开展示页 |
| `/habridge/{project_name}` | 按项目名称打开展示页 |
| `/health/live` | 进程存活 |
| `/health/ready` | 数据库就绪 |
| `/api/v1/*` | 业务 API |
| `/api/v1/modules/interaction3d/*` | 3D 交互：场景快照、舞台页、灯光缓存、配置编辑脚本 |
| `/api/v1/ws/runtime` | 实时状态 WebSocket |
| `/bridge-static/*` | 前端静态资源 |

授权店（18082）：

| 路径 | 说明 |
| --- | --- |
| `/` | 领取激活码 |
| `/lookup` | 按邮箱查询激活码 |
| `/api/v1/store/register` | 注册订单 |
| `/api/v1/store/activate` | 为主应用签发租约 |
| `/api/v1/store/public-key` | 本机店验签公钥 |

登录、设置、配对、授权页的脚本和样式可匿名访问。编辑器、展示页、3D 工作室和大部分静态资源需要登录或已配对，并且当前授权允许对应能力。

## 运行时数据

`APP_DATA_DIR` 默认是仓库下的 `data/`。

| 路径 | 说明 |
| --- | --- |
| `app.db` | SQLite 主库 |
| `admin-account.json` | 独立管理员账号 |
| `instance-id` | 安装 UUID |
| `secrets/` | HA、配对、授权、本机店公钥缓存 |
| `assets/` | 用户上传图片 |
| `studio3d/` | 3D 草稿 |
| `modules/interaction3d/` | 3D 交互场景快照与灯光渲染缓存 |
| `exports/` | 3D 导出 |
| `logs/` | 全局事件日志 |
| `cache/effect-variants/` | 灯光效果变体缓存 |
| `upgrade-backups/` | 升级前数据库备份 |

授权店数据在 `register/data/`：`license-store.db` 和自动生成的 Ed25519 密钥。不要提交这些文件。

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `APP_DATA_DIR` | `<仓库>/data` | 运行时数据目录 |
| `APP_BASE_URL` | 空 | 对外访问根地址；反代时建议设置，供 WebSocket 校验 Origin |
| `APP_PORT` | `18081` | 容器监听端口 |
| `APP_SESSION_MAX_AGE_SECONDS` | `28800` | 登录会话时长 |
| `APP_COOKIE_SECURE` | `false` | HTTPS 下设为 `true` |
| `APP_HA_REQUEST_TIMEOUT_SECONDS` | `10` | 调用 HA 的超时 |
| `APP_HA_RECONCILE_INTERVAL_SECONDS` | `1800` | HA 全量对账间隔 |
| `APP_HA_WEBSOCKET_MAX_SIZE_BYTES` | `67108864` | HA WebSocket 最大消息 |
| `APP_LICENSE_STORE_URL` | `http://127.0.0.1:18082` | 本机授权店地址，仅允许本机 host |
| `APP_LICENSE_REQUEST_TIMEOUT_SECONDS` | `10` | 授权请求超时 |
| `APP_HA_CREDENTIAL_FILE` | 数据目录内默认路径 | HA 凭据密钥文件 |
| `APP_DISPLAY_PAIRING_KEY_FILE` | 数据目录内默认路径 | 中控配对密钥文件 |
| `APP_LICENSE_CREDENTIAL_FILE` | 数据目录内默认路径 | 授权密钥文件 |
| `REGISTER_DATA_DIR` | `register/data` | 授权店数据库和密钥目录 |

授权校验始终开启，不能通过环境变量关闭。激活只连接本机授权店，不再访问官方授权云。

## Docker

官方镜像监听 **18081**，数据和密钥分卷挂载。容器启动后访问 `http://<主机>:18081/setup`。容器内默认路径：

| 用途 | 路径 |
| --- | --- |
| 数据目录 | `/data` |
| HA 凭据密钥 | `/run/secrets/ha_credentials.key` |
| 中控配对密钥 | `/run/secrets/display_pairing_codes.key` |
| 授权密钥 | `/run/secrets/license_credentials.key` |

`container_entrypoint.py` 在 root 启动时校正目录属主，再降权为 `ha-bridge` 用户运行。

反向代理请转发 WebSocket（`/api/v1/ws/runtime`）以及 `/api/hls/`、`/api/camera_proxy/` 等媒体路径。站点走 HTTPS 时设置 `APP_COOKIE_SECURE=true`。

升级时不要清空 `/data`。应用会在迁移前备份数据库，失败则回滚。

从运行中的容器导出应用目录：

```bash
docker exec ha-bridge tar -czf /tmp/app.tar.gz -C /app .
docker cp ha-bridge:/tmp/app.tar.gz ~/Desktop/
docker exec ha-bridge rm /tmp/app.tar.gz
```

## 开发注意

- 修改业务 JavaScript 后，保留 HTML / `import` 里的 `?v=` 缓存标记。`home.js` 与 `renderer.js` 必须使用同一条 `registry.js?v=`，否则会出现两份控件注册表。
- 不要改 `frontend/static/vendor/` 下的 three.js、hls.js、OrbitControls 等第三方文件。
- 界面中文文案保持原词。
- `migrations/env.py` 必须从 `backend/app` 导入 `database` 和 `models`，不要写成 `from backend.app import models`，否则会重复注册表。
- 旧扁平静态路径（如 `/bridge-static/home.js`）已改为 `js/`、`css/`、`assets/`。户型工作室与 3D 交互还会引用 `/bridge-static/utils/`（与 dump 0.4.8 一致）。
- 3D 交互舞台脚本由 `/api/v1/modules/interaction3d/{filename}` 下发，需要已登录或已配对，且当前授权允许编辑器。

## 更新日志

### v0.5.0

新增

- 3D 交互扩展：空调、窗帘、电视、NAS、在场感应、扫地机地图等运行时面板与环境效果。
- 户型工作室：地面反射、楼层洞口/过渡、Plan2 区域光与接触阴影、反射细节与家具运行时模块。
- 栖光 UI Pack 预览轮播与仪表盘模板资源。
- meshoptimizer 轻量化支持（反射细节管线）。

优化

- 3D `/control` 按模型绑定与 HA 能力校验窗帘、空调、电视控制。
- 控件配置契约扩展环境、设备、反射、楼层与页面行为字段。

说明

- 授权仍使用本机 `register` 商店（`APP_LICENSE_STORE_URL`），不接入官方授权云。

### v0.4.8

新增

- 3D 交互控件：从户型工作室草稿生成场景快照，仪表盘与展示页用 iframe 嵌入同一舞台；舞台内仅控制已绑定的灯和开关。
- 3D 灯光配置编辑器：绑定实体、灯光按钮、聚焦视角与进阶光照，图层 PNG 缓存走本机数据目录。
- 本机授权将 3D 交互计入基础能力。已开通编辑器的旧租约可直接使用；不接入官方授权云与商城付费墙。

### v0.4.6

新增

- 自动户型图支持选择全楼或指定楼层生成。
- 管理员账号改为独立存储，删除账号文件并重启后可重新设置账号密码，原有户型、HA 配置、授权及中控数据不受影响。

优化

- 优化 3D 灯光预加载，减少首次开灯时的卡顿。
- 完善全局日志、完整导出和故障诊断，问题排查更加准确。

修复

- 修复部分反向代理环境下 3D 家具和家电模型无法加载的问题。
- 修复全楼预览工具栏在较窄窗口中超出边界的问题。
- 修复空调和浴霸选项显示不合理的问题，可放下时显示按钮，放不下时自动使用下拉菜单。
- 修复户型外家具、汽车和灯具等物件导致 3D 旋转中心偏移的问题。
- 完善旧版本数据库升级兼容性。

### v0.4.5

新增

- 摄像头新增“实时/快照”显示模式，支持自定义快照刷新间隔；切到后台后自动暂停，返回页面立即恢复。
- 新增全局运行日志，可按级别、分类和关键词筛选，支持刷新、清空和导出；自动遮盖敏感信息。
- 新增户型图自动导图功能，可直接根据当前 3D 视角生成仪表盘底图、户型图、灯光、电视和汽车图层。
- 自动导图重新生成时，可保留已有实体绑定、按钮位置、图标和样式。
- 图片管理支持直接删除自动导图文件夹，并优化图片名称和文件夹切换显示。
- 3D 新增进阶光照设置，可调整主光方向、保存当前光照并恢复默认设置。
- 折线图新增自动阈值模式，可根据不同实体的实际数值范围自动分色，同时保留手动阈值。
- 空调弹窗根据实体实际功能展示运行模式、预设模式、风速和摆风选项；选项较多或文字较长时自动使用下拉菜单。
- 空调关机状态现在会在运行模式中正确显示“关闭”。
- 3D 模型库新增二级分类筛选，查找家具和电器更加方便。
- 同步更新当前默认仪表盘模板及相关控件封面。

优化

- 大幅优化 3D 模型加载与交互性能：模型按需加载、分批调度、材质复用、重复模型批量绘制和静态几何合并。
- 完成家居、电器、门窗、栏杆等模型轻量化，并保留加载失败时的原模型回退。
- 优化 3D 相机拖动阻尼、关闭灯光时的帧率、楼层模型加载范围和地面网格渐隐效果。
- 优化多灯光场景：静态阴影缓存、灯组独立缓存、实时阴影按需更新，减少重复计算。
- 提升自动导图预览与导出清晰度，按照仪表盘原始分辨率生成高清图片。
- 优化自动导图按钮布局、底图排序和逐层导出流程。
- 加快首次进入仪表盘时实体状态和摄像头画面的加载速度。
- 页面进入后台后自动暂停摄像头、扫地机器人地图和历史数据请求，回到前台后自动恢复。
- 摄像头快照刷新时保留上一帧，减少空白和画面闪烁。
- 优化实体列表分页、搜索与统计查询，减少大型实体目录的加载压力。
- 实时状态消息只发送给实际订阅相关实体的页面，降低多页面运行压力。
- 编辑器修改普通属性和折线图属性时改用局部刷新，减少整个画布重复重建。
- 优化控件模板弹窗布局，小窗口下无需反复滚动。
- 统一整理空调、热水器、空气净化器、灯光、窗帘、摄像头、媒体播放器、扫地机器人、电动床、传感器等设备弹窗的显示与动画。
- 优化吸顶灯亮度表现、多灯连续开关延迟以及灯光效果首帧稳定性。

修复

- 修复实时状态消息过多时可能丢失最新状态，以及实体被删除后页面继续显示旧状态的问题。
- 修复仪表盘可能自动使用其他相似实体的问题，现在始终使用用户实际绑定的实体。
- 修复首次进入页面时部分实体状态和摄像头加载较慢的问题。
- 修复摄像头流长时间占用数据库连接，可能导致连接池耗尽的问题。
- 修复摄像头弹窗扫描动画结束后画面短暂卡顿的问题。
- 修复扫地机器人地图首次加载失败后不再重试的问题。
- 修复成组设备和成组摄像头可能无法点击的问题。
- 修复隐藏控件选择框尺寸异常、选择框位置不一致以及实体和图片选择末行被遮挡的问题。
- 修复图标按钮灯光效果闪灭、首帧跳变、层级遮挡以及成组后层级异常的问题。
- 修复电视和汽车导图无法分别生成独立透明图层的问题。
- 修复自动导图预览偶发重建、首次加载超时、取消添加行为和返回页面后预览未恢复的问题。
- 修复自动导图生成图片不够清晰、按钮布局拥挤以及部分图层导出不完整的问题。
- 修复 3D 界面无法加载、轻量模型加载失败和模型分类切换挤压画面的问题。
- 修复 3D 灯光阴影条纹、透明墙体灯光穿透和 WebGL 纹理数量超限问题。
- 修复 3D 平面编辑、移动墙体和调整设置时的卡顿问题。
- 修复空调组合弹窗文字裁剪、长摆风选项显示不全、下拉选择后状态未及时同步的问题。
- 修复热水器关联参数显示不全、空气净化器动画不一致、媒体弹窗标题和选择器尺寸不统一等问题。
- 完善历史版本升级保护：升级前自动备份数据库并生成校验信息，迁移失败时自动恢复，覆盖现有全部历史版本升级。
