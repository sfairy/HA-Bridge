# 前端命名规范

本文件约束 `frontend/**` 的标识符命名。反混淆流水线（`webcrack` → 导入别名还原
→ 作用域感知局部重命名）已经清除了全部 `_0x` 混淆，但把每个词法绑定都机械地
命名成了「角色名 + 序号」（`value1234`、`arg56`、`fn7`），并留下一批 `webcrack`
时期的一两字符名（`m`、`qe`、`KC`）。当前残留量可以随时用

```bash
node tools/report_frontend_names.mjs
```

查看——该脚本逐文件列出仍未处理的名字与数量，本身就是进度清单；处理完的文件
因为不再出现在输出里，无需额外维护清单文件。

## 一、不可违反的约束

**只允许改动词法绑定的名字。** 以下内容必须逐字节保持不变：

| 项目 | 说明 |
| --- | --- |
| 导出名 | `export const/function/class X`、`export { X as Y }` 的 `Y`、`export default`。这是公共 API，被其他模块、HTML 入口 `<script>` 和动态 `import()` 消费 |
| 导入说明符 | `import { X as Y }` 的 `X` 侧（模块导出名） |
| 非计算成员属性 | `obj.prop`、`obj[prop]` 中的属性名 |
| 对象/类属性键 | `{ key: v }`、`class { key() {} }` 的键 |
| 字符串与模板内容 | 含 `?v=…` 缓存串与全部中文文案 |
| 程序结构 | 只改名，不做提升、重排、内联、提取或合并 |

> 导出名冻结是硬性要求。Alpha-等价性校验**看不见**导出名改名——导出名本身
> 是一个绑定，模块内部一致改名后两个文件依然 alpha-等价，但所有消费方会在
> 运行时断裂。该风险由 `tools/frontend-public-api.json` 接口锁与
> `verify_all.sh` 第 12 项守卫。

## 二、命名规则

### 2.1 从语义出发，而不是从类型出发

先读懂这个绑定**代表什么业务概念**，再取名；不要因为它是 `Object` 就叫
`object3`。参考领域词汇：

| 领域 | 示例名字 |
| --- | --- |
| Home Assistant | `entityId`、`stateAttributes`、`serviceData`、`entityRegistry` |
| 3D 场景 | `sceneGroup`、`cameraTarget`、`lightMesh`、`floorPlanPoints` |
| DOM | `panelElement`、`hostElement`、`canvasElement` |
| 网络 | `response`、`requestBody`、`abortController`、`retryDelayMs` |
| 几何/数学 | `clamp`、`roundTo`、`deepClone`、`lerp`、`normalizeVector` |
| 持久化 | `cachedLayout`、`storedSettings`、`historyEntries` |

### 2.2 按种类施加约定

| 种类 | 约定 | 示例 |
| --- | --- | --- |
| 布尔 | `is` / `has` / `should` / `can` 前缀 | `isReady`、`hasLoaded`、`shouldReflow` |
| DOM 节点 | `xxxElement` 后缀 | `popupElement`、`statusElement` |
| Map / Set | `xxxByUuid`、`xxxSet` | `viewsByProjectId`、`pendingSet` |
| 回调 | `onEvent` 用于外部传入，`handleEvent` 用于内部实现 | `onFocusChange`、`handlePointerDown` |
| 数值常量 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`、`DEFAULT_POPUP_RATIO` |
| 计数器 | `xxxCount` | `retryCount`、`frameCount` |
| 单位敏感的量 | 名字带单位 | `durationMs`、`widthPx`、`angleRad` |
| 单字母/缩写 | 只保留公认缩写，且需有语义 | `uv`、`url` 可；`a`、`b`、`x1` 不可 |

### 2.3 名字必须在文件内唯一

沿用改名器既有做法：候选名集合预置文件内已出现的全部标识符，新名字不得与之
冲突。这从根本上排除意外遮蔽，也让审阅 diff 更容易。

### 2.4 不要动这些名字

- **导出名**——即使它有更好的名字。
- **已经是语义化的名字**——`report_frontend_names.mjs` 归入 `semantic` 桶的名字
  不再改动。不要为了「统一风格」去重命名它们。

> 「什么算残留」只有一处定义：`tools/lib/name-buckets.mjs`。三个工具都 import
> 它，`verify_all.sh` 第 13 项用自检锁住两个方向——前缀表漏了会让门禁虚高并让
> 残留名字永远动不了（`weakMap1`、`resizeObserver1` 就曾如此），形态规则放宽
> 则会误伤 `sha256`（导出 API）和 `alignTo16`（数字是语义的一部分）。要新增前缀
> 请按该文件注释里的办法实测穷尽，不要改成形态匹配。
- **字符串、中文文案、`?v=…` 缓存串**。

## 三、每批的处理与验证流程

改名**不手写重写文件**，而是先产出映射、再由工具套用：

1. **产出映射。** 读目标文件，输出一个 JSON：

   ```json
   {
     "frontend/static/renderer/entity-metadata.js": {
       "arg1@1": "metadata",
       "value3": "responseBody"
     }
   }
   ```

   键是 `名字`（仅当该文件只绑定这一个同名绑定时可用）或 `名字@行号`（行号＝声明该
   绑定的标识符所在行，用于区分不同作用域里各自独立的 `value1`）。同一行里同名绑定
   出现两次时（`arr.map(t => …).sort((t, b) => …)`），行号不够用，再补列号：
   `名字@行号:列号`。值是新名字。
   写成文件，例如 `tools/rename-maps/batch-a.json`。

2. **核对映射覆盖度。** 套用前先确认这份映射**恰好**覆盖它被分配的区间：

   ```bash
   node tools/verify_map_coverage.mjs tools/rename-maps/batch-a.json <声明起始行> <声明结束行>
   ```

   `apply_frontend_renames.mjs` 只能验证**每一条**能解析，验证不了**集合**是否完整——
   它不知道这个区间本该覆盖哪些名字。两个方向都会静默失败：**漏掉**的绑定会留成残留，
   当下无人报错，直到日后门禁把它当成「回归」；**越界**的绑定属于同文件的邻块，
   在这里改它等于两个任务抢改同一个名字，后一个会失败或落下一个已被占用的名字。
   区间用 `plan_frontend_rename_ranges.mjs` 输出的**声明行范围**（authoritative），
   不是那个更宽的 span。

3. **套用。**

   ```bash
   node tools/apply_frontend_renames.mjs tools/rename-maps/batch-a.json --report
   ```

   该工具改用字节区间编辑，注释、缩进、引号风格、`?v=…` 缓存串全部逐字节保留。
   下面这些曾经真的弄坏过代码的情形，都是**硬断言**而不是提示词约定：

   - 导出名一律拒绝改名（它就是公共 API）；
   - `obj.prop` 形式的成员属性、`{ key: v }` / `class { key }` 的键、以及 import
     的**导入侧**永不改写；
   - 简写会展开而不是改名，从而保住属性名 / 导入名：
     `{ value1 }` → `{ value1: response }`，`import { x }` → `import { x as rate }`；
   - 新名字不得与文件内任何绑定冲突，也不得遮蔽文件引用到的全局；
   - 映射里每一条都必须解析成功；有歧义或对不上的条目会让整次运行失败，
     而不是被静默跳过（**任何一条失败都不会写入任何文件**）。

4. **验证批次。**

   ```bash
   tools/verify_frontend_batch.sh
   ```

   它会与 `HEAD` 比对，依次确认：全部文件可解析、alpha-等价、公共 API 未变、
   模块图可解析、字符串无丢失，最后跑一遍 `verify_all.sh` 全量校验。

> **静态校验再全，也证明不了页面能真正加载。** Alpha-等价只说明改名没有改变
> 程序语义，却推不出「这些模块在浏览器里跑得起来」——两者之间隔着模块加载顺序、
> 全局耦合、缓存串、HTML 与脚本的契约。上面每一项检查都只读单个文件，因此
> 它们**结构上**看不见跨文件耦合：`verify_all.sh` 第 14 项就是为这类盲区补的。
>
> 所以每推进几批，用真实浏览器过一遍：登录页（未鉴权也公开）、已登录看板
> （`home.js`）、3D 工作台（`/3d-studio`，`studio-app.js`）。
> 应用对静态资源做了鉴权——`curl` 拿到的 `401` 只是**没有会话 cookie**，
> 浏览器是已鉴权的，受限脚本在那里照常加载，因此这些页面都能真实测到。
> 判定「页面正常」要看**交互后**的状态（按钮文案变化、请求后的错误文案、
> WebGL 画布被 `setSize` 到非默认尺寸），而不是「HTML 渲染出来了」——
> 这个项目的页面内容大量是静态标记，光看截图会把「HTML/CSS 完好」误当成
> 「JS 执行了」。

5. 全绿后提交该批次。任何一项失败就整批回退重做，不要部分提交。

> **映射必须在任务宣告完成后才能套用，并在套用前后各取一次哈希。**
> 曾经发生：一次 `--dry` 通过后开始套用，同时产出该映射的任务仍在运行并改写了它——
> 于是首次 dry-run 的名字与最终落盘的名字**不是同一套**（`camera` 变成了
> `targetCamera`）。提交捕获到的恰好是修订后的版本，所以代码与映射仍然自洽，
> 但如果那天运气差一点，就会得到「映射复现不出代码」的死局。
>
> 两道工序可以消除这个风险：套用前确认映射文件已静止（`mtime` 不再前进、
> 无进程持有），套用前后各算一次 `shasum` 并比对。映射与代码必须能互相复现，
> 否则后续任何一次重放都会失控。
>
> 另外，**不要用已套用过的旧映射做「回归测试」**：旧名字在文件里早已不存在，
> 工具报 `failed` 是正确行为，不是回归。

6. 重命名推进后，下调 `verify_all.sh` 第 10 项的上限：

   ```bash
   HB_MAX_MECHANICAL=<新剩余数> HB_MAX_SHORT=<新剩余数> bash tools/verify_all.sh
   ```

   并把新数值写回 `tools/verify_all.sh` 中该检查的默认值，使其成为非回归门禁。

## 四、超大文件的分片处理

`home.js`（22k 行）、`studio-app.js`（24k 行）、`renderer.js`（15k 行）三个文件
占了剩余工作量的六成以上，单个映射任务放不下——一次读几万行、连续编几千个名字，
既慢又容易前后不一致。改为按**绑定数**而非行数切片：

```bash
node tools/plan_frontend_rename_ranges.mjs frontend/static/home.js --target 1000
```

该工具按声明行把残留绑定均衡切块，边界落在**语句起始行**（任意嵌套层级），
默认切点只取顶层语句是不够的：`renderer.js` 整个包在一个 IIFE 里，顶层只有
一个语句，切点退化成第 1 行、后几个区间全空——工具末尾的自检会直接报错，
阻止这种无效计划被当成任务发出去。

分片后按三条规则调度：

- **同文件内串行**：第 N+1 块必须等第 N 块套用完成后才开始。后续块的任务因此
  能看到前一块已经改好的名字，改名器的「新名字不得与文件内任何绑定冲突」
  断言自然生效，也就不需要人工分配名字空间。
- **跨文件并行**：不同文件之间互不影响，可以同时进行。
- **只改本区间**：每个任务只收录声明行落在自己区间内的绑定，但允许读全文件以
  判断用法与查重。

## 五、为什么不用「让模型重写整个文件」

重写整个文件是错误发生的地方：容易顺手重排、顺手改格式、漏掉某个引用导致
`ReferenceError`。把工作拆成「人/模型决定叫什么」＋「机器精确替换」之后，
引用一致性由 AST 保证，格式由字节区间编辑保证，而导出名冻结、防遮蔽这些规则
由工具强制。模型输出的映射只有几十行，审阅成本也低得多。
