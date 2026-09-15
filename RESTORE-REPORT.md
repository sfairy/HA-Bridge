# HA Bridge 反混淆还原报告

本报告记录将发布包中经过 PyArmor 加固的 Python 后端与 obfuscator.io 混淆的前端
JavaScript 还原为可读、可运行源代码的完整过程、依据与验证结果。

- 版本：`0.5.4`（见 `VERSION`）
- 还原对象：`backend/app/**`（66 个 Python 文件，含 `migrations/`）
- 还原对象：`frontend/**`（165 个 JavaScript 文件，其中 126 个曾被混淆）

---

## 1. 交付结果

| 项目 | 还原前 | 还原后 |
| --- | --- | --- |
| 后端 Python | `.1shot.seq`（PyArmor 加密字节码）+ `.1shot.das` + `.1shot.cdc.py` | 66 个真实 `.py` 源文件，无混淆残留 |
| Alembic 迁移 | `alembic_runtime/` 壳 + `sourceless = true` | 14 个真实迁移脚本，直接从 `migrations/` 加载 |
| 前端 JavaScript | 126 个文件带字符串数组 / 解码器 / 控制流平坦化 / `_0x` 标识符 | 165 个文件全部可读，零混淆残留 |
| 前端命名 | 27 748 个机械名 / 短名（`value1234`、`arg56`、`Kc`），分布在 152 个文件 | 全部替换为语义名，残留 0 |
| 前端格式 | 28 个单行压缩文件、7 个单行 HTML、`renderer.js` 里一条 1 941 字符的 import 行 | 全部经 Prettier 展开并保持合规（第 15 项门禁；2 个文件待另一会话提交后补齐，见第 7 节） |

后端与前端均已通过**真实运行时验证**（见第 5 节），项目可直接启动。
前端另有**浏览器端运行时验证**：登录页、已登录看板与 3D 工作台均在真实浏览器中
加载并完成交互（见 5.4）。

---

## 2. 还原依据：为什么以 `.das` 为准

发布包对每个模块提供了三种产物：

| 产物 | 内容 | 可靠性 |
| --- | --- | --- |
| `.1shot.seq` | PyArmor 加密的字节码 | 无法直接还原 |
| `.1shot.cdc.py` | `pycdc` 反编译出的 Python 文本 | **有损**：丢失 `with`/`try` 结构、多行 `lambda` 体、装饰器参数，并产生 `return None`、`None(None, content)`、`<NODE:n>` 等噪声 |
| `.1shot.das` | `pycdas` 完整反汇编 | **精确**：逐条指令、`[Names]`、`[Constants]`、异常表齐全 |

因此还原策略是：**以 `.das` 为结构和语义的唯一真相来源，`.cdc.py` 仅用于辅助确认表达式写法。**

### 2.1 关键发现：相对导入层级

`pycdas` 与 `pycdc` 都会把相对导入的点号抹掉——`from .schema import X` 与
`from schema import X` 在两种产物中都显示为 `from schema import X`。层级只存在于
字节码中，`IMPORT_NAME` 之前压栈的两个常量才是真相：

```
LOAD_CONST    4: 1                                  <- 相对层级 level
LOAD_CONST    5: ('PanelDocument', ...)             <- fromlist
IMPORT_NAME   2: schema
IMPORT_FROM   3: PanelDocument
```

据此判定：**原工程是标准的 `backend.app` 包，包内一律使用相对导入，仅标准库与
第三方使用绝对导入。** 例如 `backend/app/main.py` 的 24 个项目内导入全部是
`level=1`（`from .api.auth import ...`）。

这一判断至关重要——若按"扁平绝对导入"理解，`backend/app/panel/__init__.py` 会
写成 `from schema import ...`，而 `schema.py` 并不在 `backend/app` 根下，模块会
直接导入失败。

`tools/verify_imports.py` 实现了对该层级的自动还原与校验，共修正 **131 处**导入
（首次 122 处 / 29 个文件，二次补漏 9 处）。

---

## 3. 后端还原

### 3.1 自动化通道

`tools/restore_backend.py` 完成主体重建：

1. 剥离 `__pyarmor_enter__` / `__pyarmor_exit__` / `<COAddr>` 等加固标记；
2. 清除 `pycdc` 噪声（`None(None, content)`、冗余 `return None`、`<NODE:n>` 占位）；
3. 把 `pycdc` 用来表示函数体的 `lambda` 结构还原为真正的 `def`——这一步用
   `tokenize` + 动态规划在 token 边界上切分语句，避免把
   `cursor = connection.cursor()cursor.execute(...)` 这类拼接语句切碎；
4. 对无法解析的行注释为 `# TODO(restore)`，并补齐空块所需的 `pass`，最后用
   `compile()` 迭代修复直至全部可编译。

### 3.2 手工重建

对 `pycdc` 丢失结构的函数，按 `.das` 逐条指令重建。重点文件包括
`ha/service.py`、`license/service.py`、`api/assets.py`、`main.py`、
`dependencies.py`、`ha/client.py`、`api/studio3d.py`、`api/projects.py` 等。
典型修复类型：

- `_atomic_json_write` 中被 `pycdc` 展平成 `with None: ...` 的 `try/finally`；
- `api/studio3d.py` 中跨 2000 余行 `.das` 的双层 `try/finally` 与其异常处理器；
- `_folder_name` 中 `pycdc` 输出为 `and` 链、实为 `or` 链的校验条件；
- `dependencies.py` 的 `viewer_entity_ids` 里被丢失的实体匹配项
  （`'water_heater'`、`'button'`、`'cleaning_mode'`、`'battery'`、`'电量'`）。

**当前状态：66 个文件中 `# TODO(restore)` 标记数为 0，PyArmor 残留为 0。**

### 3.3 Alembic

- 删除 `alembic_runtime/`——它只是 `sourceless = true` 时代的加载壳，真实脚本已
  还原到 `migrations/`；
- 移除 `alembic.ini` 中的 `sourceless = true`；
- 14 个迁移脚本的 `revision` / `down_revision` 构成完整线性链条
  （`0001 → 0014`）。

### 3.4 运行时验证发现并修复的真实缺陷

以下问题静态检查无法发现，是在真实启动应用时暴露的：

1. **Alembic 把遗留的 `.1shot.cdc.py` 当作迁移脚本加载。** Alembic 会 glob
   `migrations/versions/*.py`，命中了反编译产物，并在其第 51 行
   `return None` 处抛出 `SyntaxError: 'return' outside function`，导致**应用完全
   无法启动**。这是必须清除全部 `.1shot.*` 产物的直接原因。
2. **`GlobalLogStore.append` 的关键字参数被当作位置参数传入**（`main.py` 两处：
   响应错误中间件与异常处理）。`.das` 中该调用的 `KW_NAMES ('context','details')`
   表明 `context` 是 keyword-only 参数；误传位置参数会在任何 4xx/5xx 响应上抛出
   `TypeError`。已按字节码修正。

---

## 4. 前端反混淆

分三轮完成，均由脚本驱动：

### 第一轮：`webcrack`
`tools/deobfuscate_frontend.mjs` 移除字符串数组、`_0x` 解码函数与控制流平坦化，
并保留 `?v=...` 缓存串。

### 第二轮：导入别名还原
`tools/rename_frontend_identifiers.mjs` 依据 `import { realName as _0xAlias }` 中
未受影响的导出名，还原导入别名。

### 第三轮：局部绑定重命名
`tools/rename_frontend_locals.mjs` 处理剩余的**函数内局部变量**。先量化问题：
126 个文件、110 424 处 `_0x` 出现、24 418 个唯一绑定，且其中
**作为成员属性名 0 处、作为对象/类属性键 0 处、出现在字符串字面量中 0 处**——
即每一个都是真正的词法绑定，因此可以用作用域感知的重命名 100% 安全清除。

重命名器的设计要点：

- 通过 Babel 作用域解析绑定，按字节区间改写，注释、缩进、`?v=` 串逐字节保留；
- 新名字在**整个文件范围内唯一**（候选名集合预置文件内所有已出现标识符），
  从根本上排除碰撞与意外遮蔽；
- 不触碰非计算成员属性、非计算属性键、导入的 `imported` 侧与导出的 `exported` 侧；
- 对象简写 `{ _0xabc }` 改写为 `{ _0xabc: value1 }`，保留属性名、只改变量名；
- 按声明形态给出可读角色名（`fn`/`arg`/`error`/`element`/`map`/`set`/`list`/
  `object`/`text`/`value` + 序号）。

**结果：110 424 处全部重命名，`_0x` 残留 0，字节数净减 227 296。**

> 实现过程中曾出现一个自伤缺陷：`new _0x359b04(...)` 这类语句会把被混淆的构造器名
> 当作"角色"名，从而生成 `_0x359b04` + `1` 这样的**新**混淆名。已加两道防护
> （角色名不得匹配混淆模式；候选名同样受限），并在每次运行后断言输出中不含
> `_0x[0-9a-f]{4,}`。

### 第四轮：语义化重命名

前三轮把 `_0x` 混淆彻底清除，代价是每个词法绑定都变成了「角色名 + 序号」
（`value1234`、`arg56`、`fn7`）或 `webcrack` 时期的一两字符名（`m`、`qe`、`KC`）。
代码已无混淆、可解析、可运行，但**不可读**。第四轮解决可读性。

起点（实测于基线提交，用与终点相同的分类器）：**152 个文件共 27 748 个残留绑定**
（24 302 个机械名 + 3 446 个短名）。

做法是「模型决定叫什么，机器负责精确替换」，而不是让模型重写文件：

1. **产出映射。** 对每个文件（超大文件按**绑定数**切块，边界落在语句起始行）
   产出一份 JSON：`{"文件": {"旧名@声明行[:列号]": "新名"}}`。
   键带行号用于区分不同作用域里各自独立的 `value1`；同一行出现两个同名绑定时再补列号。
2. **核对覆盖度。** `tools/verify_map_coverage.mjs` 从 AST 重数一遍残留，
   确认映射**恰好**覆盖它被分配的区间——既不漏（漏掉的会变成日后的门禁回归），
   也不越界（越界的属于同文件邻块，会与邻块抢改同一个名字）。
3. **套用。** `tools/apply_frontend_renames.mjs` 按字节区间改写。
   导出名、`obj.prop` 成员、`{ key: v }` / `class { key }` 的键、import 导入侧
   一律拒绝改写；对象简写与 import 说明符改写为展开形式以保住属性名
   （`{ value1 }` → `{ value1: response }`）；新名字不得与文件内任何绑定冲突、
   不得遮蔽文件引用到的全局；**任何一条失败都不会写入任何文件**。
4. **验证与提交。** `tools/verify_frontend_batch.sh` 与 `HEAD` 逐项比对后提交。

**结果：残留绑定清零。** `home.js`、`studio-app.js`、`renderer.js` 三个两万行级
文件占工作量六成以上，各按绑定数切块、同文件内严格串行（后一块能看到前一块
选用的名字，文件内唯一性断言因此自然成立）；不同文件之间并行推进。

#### 可重放性：不靠信任，可独立复算

模型参与命名会带来一个隐患：产出难以复核，也无人能重做。因此第四轮**不把
映射当作实施细节，而是当作交付物**保留在 `tools/rename-maps/`（41 份、26 577 条），
并用 `tools/replay_frontend_rename.sh` 证明它们**足以重建结果**：

```bash
tools/replay_frontend_rename.sh
# 已按序套用 41 份映射
# 试点批补入 frontend/static/3d-studio/studio-television-poster.js
# ...
# 已重跑 Prettier
# PASS  重放结果与 HEAD 逐字节相同（HEAD=a080e3e）
```

该脚本从「格式已定、改名未始」的提交出发（`b837d93`，Prettier 提交——所有映射
的行号都是在格式化后的树上算出来的，拿更早的树做基准会整批报「未在该行声明」），
按**首次提交时间顺序**套用映射，叠加试点批的 6 个文件，再重跑一次 Prettier，
最后与 `HEAD` 逐字节比对。

最后那步 Prettier 不是多余的：格式化阶段排在改名之前，而语义名更长会使部分行
越出 `printWidth=100`，所以「基线 → 映射 → 试点批」得到的是**改名后、尚未重排**的树，
只差这一步才等于最终态。这也正是第 15 项门禁要守的东西。

由此固化两条只有实践才会暴露的约束：

1. **重放顺序是承载语义的，不可颠倒。** 同文件第 N+1 块的取名，是在避开第 N 块
   已占用名字之后才定下的；顺序颠倒会撞名并被整批拒绝。这个顺序只存在于提交
   历史里，故显式记录在 `tools/rename-maps/README.md`。
2. **试点批没有映射。** 最早那批（`e99b232`，6 个文件、125 个绑定）是在
   `apply_frontend_renames.mjs` 诞生之前手工完成的，故无映射可套。重放脚本对该批
   直接取其提交版本作为终态。这也是「起点 27 748 = 试点批 125 + 映射 26 577 +
   最后一块 1 046」这一恒等式的由来——映射并非覆盖全部改名，缺口是**已知且封闭**的，
   不是遗漏。

---

## 5. 验证

一键校验：`tools/verify_all.sh`。当前**全部 16 项断言通过**（15 个 section，
其中第 14 项含「自测」与「主检」两次断言）：

| # | 检查项 | 结果 |
| --- | --- | --- |
| 1 | PyArmor 产物已清除 | `0` 个 `.1shot.*`、`0` 个 `pyarmor_runtime_*` |
| 2 | Python 语法 | `66/66` 编译通过 |
| 3 | 后端导入（含相对层级）与 `.das` 一致 | `clean=66 with-differences=0` |
| 4 | 后端标识符/字符串常量与 `.das` 一致 | `clean=66 with-differences=0 errors=0` |
| 5 | JavaScript 语法 | `165` 个文件全部可解析 |
| 6 | 混淆残留 | 无 `_0x` 标识符、无字符串数组解码器 |
| 7 | 前端模块图 | `235` 个 import 说明符 `unresolved=0 bare=0` |
| 8 | 前端字符串保真（对照原始混淆源） | `126/126` 文件、`16 724` 次解码器调用 `lost-strings=0` |
| 9 | 应用启动与请求流 | 14 个迁移全部执行、lifespan 启动、建号/登录/鉴权行为符合预期 |
| 10 | 残留机械名（非回归门禁） | `mechanical=0 short=0`，上限同为 0 |
| 11 | 格式敏感契约 | `3d-studio.html` 的 `</head>` / `<body>` 注入锚点各恰好 1 处 |
| 12 | 前端公共 API 冻结 | `frozen=153 present=153 drifted=0` |
| 13 | 命名分类器自检 | `30` 例通过（锁住「过窄」与「过宽」两个方向） |
| 14 | 经典脚本全局耦合 | 自测 `4/4` + 主检 `vanished globals=0 dangling-references=0` |
| 15 | 前端格式仍符合 Prettier | `2` 个文件偏离（上限同为 2，见下）— 其余 151 个合规 |

> 第 10–15 项是第四轮新增的门禁，都是**防回归**而非一次性检查。第 10 项的上限
> 随每批下调，最终钉死在 0——它曾经形同虚设：声明「只增不减」，上限却是 9970，
> 而实际残留 2675，等于一次错误套用可以回退上千个改名而照样通过。
> 第 13、14 项自带自测，因为这两类失败都是**静默**的：一个永远只会报 PASS 的
> 检查比没有检查更糟，它会凭空制造信心。

**第 15 项是补上的一个真实缺口。** 格式化阶段排在改名之前，而语义名普遍比机械名长
（`responseBody` 比 `value1234` 长），原先正好卡在 `printWidth=100` 的行被迫重新折行——
改名因此把 153 个文件中的 140 个**带出了 Prettier 规范**，而当时无人发现。原因是本套
校验**刻意**对空白不敏感：alpha-等价比较 token 流、公共 API 只读名字、字符串保真只读字面量。
这对每个单项都是正确的设计，但合起来让整个套件对「代码被排版得面目全非」完全失明。

这不是假设：用基线快照做对照实验，`b837d93`（格式化提交当时）全部合规，
而改名之后 140 个文件不合规。修法是重跑一次 Prettier（纯空白变更，已由 alpha-等价
证明 `mismatched=0`），并把「仍符合 Prettier」变成第 15 项门禁。

其中 `2` 个文件（`studio-app.js`、`studio-shadow-atlas.js`）被另一个会话持有做**功能**修改
（阴影烘焙冻结修复及其 `?v=` 缓存串），重跑格式化会覆盖其工作，因此本次有意跳过，
上限暂定 2 而非 0；待其提交后再格式化并清空该上限。`tools/replay_frontend_rename.sh`
的 `HB_REPLAY_SKIP` 是同一原因，两者应一并归零。

### 5.1 语义等价证明（前端）

`tools/verify_frontend_rename.mjs` 不满足于"能解析"，而是证明**重命名保语义**：
把前后两个版本各自渲染为规范 token 流，其中每个受绑定标识符都被替换为
**它所解析到的绑定身份**（按源码顺序确定的稳定编号），而非它的名字；同时原样保留
字符串字面量、非计算属性名与未解析的全局名。两份文件渲染结果一致即表示二者
**仅在绑定变量命名上不同（alpha-等价）**。

```
# byte-identical=39 alpha-equivalent=126 mismatched=0 missing-or-extra=0
```

### 5.2 运行时验证

使用项目自带的 `.venv-store`（Python 3.14.7）做真实导入与请求：

- 以官方方式 `uvicorn backend.app.main:app` 启动，注册 33 条路由；
- `GET /health/ready` → `200`，版本 `0.5.4`；
- `POST /api/v1/setup/admin` → `201`（argon2 口令哈希），
  `POST /api/v1/auth/login` → `200` 并下发会话 Cookie，`GET /api/v1/auth/me` → `200`；
- 未授权访问返回 `401`，授权门禁返回 `403 LICENSE_RESTRICTED`（符合产品预期）；
- `/`、`/login`、`/setup`、`/license`、`/3d-studio` 等页面均 `200`。

> 说明：`/component-lab` 与 `/template-assets/*` 返回 `404` 是**设计行为**——其处理器
> 分别命名为 `removed_component_lab` / `removed_template_assets`，是有意保留的占位路由。

### 5.3 字符串保真校验（前端）

`verify_frontend_rename.mjs` 只能证明**第三轮重命名**保语义（它比对的是重命名前后两棵
树），无法发现 `webcrack` 阶段本身改坏的内容。为此补了
`tools/verify_frontend_strings.mjs`，直接回到**原始混淆源码**取证：

1. 在沙箱中执行原文的字符串数组函数、解码器与旋转 IIFE（即混淆运行时的加载过程）；
2. 把原文每一处 `_0xDECODER(0xNNN)` 调用解析成它真正返回的字符串；
3. 要求这些字符串在反混淆产物中全部存在。

结果：`126/126` 文件、`16 724` 次解码器调用、`lost-strings=0`。

**该检查已用反向对照验证有效性**：把 `renderer.js` 中一个解码器产出的字符串
（`"userAgentData"`）篡改为哨兵值后，工具立即报
`LOST static/renderer/renderer.js :: 1/851`，随后已还原。

实现中有三处极易踩空、且会导致**结论看起来正常但实际失效**的陷阱，已在工具内注释说明：

- 数组函数与解码器会**自替换**（`_0xf03e = function(){return arr;}`）。若在模块体执行**前**
  捕获它们，调用到的是替换前的函数，每次都会新建一个**未旋转**的数组，于是解码出
  看似合理、实则错误的字符串（数组中用于参与校验运算的种子串）。
- 因此模块体必须在**脚本顶层**执行（不能包进 `try{}` 或 IIFE）——一旦包进块，
  `function _0xf03e(){}` 会变成块级声明，自替换只作用于块内绑定；
  并用旋转语句后的注入标记确认旋转**确实执行过**，否则标记为不可校验而非给出假结论。
- 混淆器会在每个函数作用域内**再次别名化**解码器（`const _0x2f697c = _0xb34e;`），
  必须做作用域感知的别名链解析，否则绝大多数调用点都取不到真值
  （修正前后可解析调用数：`338` → `16 724`）。

### 5.4 前端浏览器运行时验证

静态校验再全也证明不了页面能加载：alpha-等价只说明改名没改变程序语义，推不出
「这些模块在浏览器里跑得起来」——中间还隔着模块加载顺序、全局耦合与脚本契约。
因此改名推进期间用真实浏览器过了三处：

- **登录页**（`login.js`）：点「显示密码」后按钮文案翻转为「隐藏密码」、密码值显形；
  提交错误凭据后 URL 不变、按钮恢复可用、页面渲染出「账号或密码错误。」——
  证明提交与错误分支都执行到位。
- **已登录看板**（`home.js`，改动最多的文件）：完整初始化出 6 个标签、168 张实体卡、
  1173 个按钮，「HA 未配置」变为「HA 已连接 · 2026.9.2」、授权有效、`HomeOS` 看板加载；
  全局日志面板显示 `200 / 10839` 条，覆盖采集→队列→localStorage→flush 全链路。
- **3D 工作台**（`studio-app.js`，改名最多的文件）：221 个引用 / 93 个可交互元素全部就位，
  含 69 个家具按钮；WebGL 画布被 `setSize` 到非默认尺寸 `636x364`；点「顶视」后
  相机模式由「自由」切到「顶视」——走通改名后的相机路径。

**收尾时的终验**（改名全部落盘后，重新硬加载，不看旧缓存）：

- **服务端下发的就是改名后的代码。** 在已鉴权页面内 `fetch` 后算 `SHA-256`，
  与本地 `frontend/static/` 逐一比对，四项全部吻合：`home.js` `34806fb2…`、
  `studio-app.js` `7faa6c4f…`、`studio-shadow-atlas.js` `01bf9eed…`、
  `client-log.js` `6276278998…`。这一步排除了「本地改了、服务端仍供旧文件」
  这种会让全部前端验证变成空转的情形。
- **零运行时错误。** 在页面加载前注入 `error` / `unhandledrejection` / `console.error`
  收集器，再硬加载看板与 3D 工作台：二者均为 `errorCount=0`。看板重新初始化出
  `HomeOS` 看板、6 个标签、618 个 SVG 元素，并恢复「HA 已连接 · 2026.9.2 / 授权有效」；
  `window.HABridgeLog` 正常发布为对象。
- **交互后仍无错误。** 依次切到「主页面」「仪表盘」视图（页面列表渲染出 `7-2-502`），
  并打开 3D 舞台 `stage.html`——`1435×1139` 的 **WebGL 上下文成功创建**（three.js
  渲染器真正起来了，而非停在静态 HTML）。

> 判定「页面正常」看的是**交互后**的状态，不是截图。本应用页面内容大量是静态标记，
> 光看渲染结果会把「HTML/CSS 完好」误当成「JS 执行了」。
> 另：应用对静态资源做了鉴权，`curl` 取到 `401` 只是没有会话 Cookie，浏览器是已鉴权的，
> 受限脚本照常加载；对已鉴权上下文重新探测，先前日志里报「网络连接失败」的端点
> 全部返回 `200`。

---

## 6. 工具链

所有脚本均可用，且以 `.das` 参考包为输入。参考包为
`tools/reference/1shot-das.tar.gz`（970 KB，含 66 个 `.das` + 66 个 `.cdc.py`），
首次运行校验脚本时自动解压到 `tools/reference/.extracted/`（可安全删除，会按需重建）。
也可用环境变量 `HB_1SHOT_REF` 指向别处的解压目录。

前端字符串校验另需原混淆源码，已同样固化为
`tools/reference/frontend-orig.tar.gz`（1.0 MB，含 126 个被混淆文件），
由 `tools/verify_frontend_strings.mjs` 按需解压；也可用 `HB_FRONTEND_ORIG` 覆盖。

| 脚本 | 用途 |
| --- | --- |
| `tools/restore_backend.py` | `.cdc.py` + `.das` → 真实 Python 源码（去加固标记、去 `pycdc` 噪声、`lambda`→`def`） |
| `tools/das_view.py` | 按代码对象查看 `.das` 反汇编 |
| `tools/fix_import_levels.py` | 依据字节码恢复相对导入层级 |
| `tools/verify_imports.py` | 校验导入层级与名称 |
| `tools/verify_restore.py` | 保真度校验：比对 `.das` 的字符串常量与标识符 |
| `tools/deobfuscate_frontend.mjs` | `webcrack` 反混淆（字符串数组 / 解码器 / 控制流平坦化） |
| `tools/rename_frontend_identifiers.mjs` | 还原 `import` 别名 |
| `tools/rename_frontend_locals.mjs` | 作用域感知重命名局部绑定 |
| `tools/verify_frontend_rename.mjs` | 证明前端重命名 alpha-等价 |
| `tools/verify_frontend_strings.mjs` | 对照原混淆源校验前端字符串保真（含反向对照） |
| `tools/verify_frontend_imports.mjs` | 校验前端 ES 模块图（含 `/bridge-static` 与 `/api/v1/modules/interaction3d/` 映射） |
| `tools/verify_frontend_format_equiv.mjs` | 证明 Prettier 格式化只改了空白（归一化 CSS 可选分号、`.5`/`0.5`、HTML 自闭合等语义等价写法） |

第四轮（语义化重命名）新增：

| 脚本 | 用途 |
| --- | --- |
| `tools/report_frontend_names.mjs` | 统计残留机械名/短名，**本身就是进度清单**（处理完的文件不再出现） |
| `tools/plan_frontend_rename_ranges.mjs` | 按**绑定数**把超大文件均衡切块，边界落在语句起始行；输出「声明行范围」为权威区间 |
| `tools/verify_map_coverage.mjs` | 从 AST 重数残留，确认映射**恰好**覆盖被分配区间（不漏、不越界） |
| `tools/apply_frontend_renames.mjs` | 按字节区间套用映射，强制导出名冻结、防遮蔽、简写展开等硬断言 |
| `tools/verify_frontend_public_api.mjs` | 用接口锁 `frontend-public-api.json` 冻结导出名与 import 说明符 |
| `tools/verify_frontend_globals.mjs` | 守卫经典脚本的全局耦合（单文件检查结构上看不见的那类破坏） |
| `tools/lib/name-buckets.mjs` | 「什么算残留」的唯一定义，供上述工具共享 |
| `tools/verify_frontend_batch.sh` | 单批校验：与 `HEAD` 比对后跑全套 |
| `tools/rename-maps/README.md` | 41 份映射的**权威重放顺序**与逐份清单（顺序承载语义，不可颠倒） |
| `tools/replay_frontend_rename.sh` | 只用映射重建前端并与 `HEAD` 逐字节比对，证明本轮**可重放** |

| `tools/verify_all.sh` | 一键跑全部 16 项断言 |

> `rename_frontend_*.mjs` 依赖 npx 缓存中的 Babel：默认
> `/Users/sfairy/.npm/_npx/6da011cd7208f74f/node_modules`，可用 `BABEL_ROOT` 覆盖。

---

## 7. 已知限制与后续建议

1. **命名是「合理」而非「原样」。** 第四轮已把全部 27 748 个机械名/短名替换为语义名，
   但原作者的命名无从恢复：`value1234` 现在叫 `responseBody` 或 `targetCamera`，
   是**依据用途推断**的结果，不是当年那个名字。改名工具保证不改变程序语义
   （alpha-等价），但不保证与原作者意图逐字一致。若需进一步贴近，可在此可读基线上人工润色。
   此外，判定「某名字是否残留」只有一处定义（`tools/lib/name-buckets.mjs`），
   该表若漏了某个前缀，对应名字既不计入统计、也被套用工具拒绝改名——
   这类盲点已用自检锁住，但新增前缀时仍需按该文件注释实测穷尽。
2. **`.das` 是唯一真相来源但非源码。** 极端情形下（例如依赖 `pycdc` 未能表达的
   编译期常量折叠）仍可能有行为等价但写法不同的地方。第 5 节的运行时验证覆盖了
   启动、鉴权、授权门禁与页面渲染，未覆盖需要真实 Home Assistant 实例与有效许可证
   才能触发的路径。
3. **前端存在两份目录树，且两份都在服务**：`frontend/static/modules/...` 经
   `/bridge-static` 静态挂载对外提供；`frontend/modules/...` 则由
   `backend/app/modules/interaction3d/api.py` 的 `GET /api/v1/modules/interaction3d/{filename}`
   路由（许可证门禁）提供——`interaction3d/editor.js` 里
   `await import('/api/v1/modules/interaction3d/config-editor.js?v=...')` 正是指向后者。
   两份都已反混淆；`tools/verify_frontend_imports.mjs` 已把该路由纳入挂载映射，
   动态 `import()` 也一并校验（新增 25 个说明符，其中 6 个为该路由）。
4. **建议补充回归测试。** 目前验证依赖"能否启动 + 关键请求断言"，建议为
   `ha/service.py`、`license/service.py`、`api/studio3d.py` 等重建量最大的模块补
   单元测试，以固化行为。
5. **两个文件暂缓格式化（临时，有明确收敛条件）。** `studio-app.js` 与
   `studio-shadow-atlas.js` 被另一个会话持有做功能修改（阴影烘焙冻结修复），
   本次重跑 Prettier 时有意跳过，以免覆盖其未提交的工作。因此
   `verify_all.sh` 第 15 项的上限暂定 `HB_MAX_UNFORMATTED=2`、
   `tools/replay_frontend_rename.sh` 的 `HB_REPLAY_SKIP` 也暂列这两个文件名。
   待该会话提交后，对二者重跑 Prettier，并把上限归零、清空 `HB_REPLAY_SKIP`——
   这两处是同一件事的两面，必须一起改，否则重放会与 `HEAD` 失配。
