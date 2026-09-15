# 语义重命名：子任务规范

本文件是「给一批文件产出重命名映射」这一任务的完整规范。派发任务时只需声明
**范围**（哪些文件）与**输出路径**（写到哪个 JSON），其余按本文件执行。

背景：前端曾被 obfuscator.io 混淆，随后被反混淆。反混淆清除了全部 `_0x`，但把每个
词法绑定机械命名成了「角色名+序号」（`value1234`、`arg56`、`fn7`）或 webcrack
时期的一两个字符名（`r`、`KC`、`wm`）。你的工作是读懂代码、起好名字、产出一个
**映射 JSON**。

「机械名」不只是 `value1234` 这类固定角色名。改名器用构造函数名派生角色，所以
下面这些同样是残留、同样要改：

```
weakMap1  resizeObserver1  uint8Array1  float32Array1  abortController1
uRL1  uRLSearchParams1  date1  image1  dataView1  option1  orbitControls1
webSocket1  formData1  blob1  promise1  weakSet1  hc1  uint32Array1 ...
```

（`uRL` 这种难看的大小写是原作者那趟只把首字母小写造成的。）反例：`sha256` 是
导出函数、`alignTo16` 的数字是语义的一部分，这类不是残留，不要改。

**不要自己改目标文件。** 改写由一个独立工具按字节区间完成。

## 一、产出

一个 JSON 对象，以仓库相对路径为键：

```json
{
  "frontend/static/renderer/climate.js": {
    "arg1@42": "componentConfig",
    "value509@88": "normalizedState",
    "S@120": "renderQueue"
  }
}
```

- 键是 `名字` 或 `名字@行号`。当文件内只绑定该名字一次时可用 `名字`；否则必须用
  `名字@行号` 消歧，行号＝**声明该绑定的标识符所在行**（1 起始）。
- 若**同一行**声明了两次同名绑定（`arr.map(t => …).sort((t, b) => …)` 里两个 `t`
  同在第 2 行），行号无法区分，需再加列号：`名字@行号:列号`。
- 行号与列号都是严格校验的：写错会整次失败，不会静默错改。歧义时报错会直接给出
  各候选的 `行:列` 与可行的消歧写法。

## 二、唯一硬规则

1. **绝不改名**：导出名（`export function f` / `export const f` / `export { f }`）、
   import 的**导入侧**、对象字面量与类的键、`obj.prop` 形式的成员属性、字符串与
   模板字面量的内容（含 `?v=…` 缓存串与中文文案）。
2. **不重构**：不增删、不重排、不改格式。你的唯一产出是 JSON。
3. **新名字必须在整个文件内唯一**。工具会拒绝与文件内任何绑定冲突的名字，也会
   拒绝遮蔽文件引用到的全局（`document`、`window`、`Math`、`JSON`、`THREE`…）。
   查重要针对**整个文件**，不只是你负责的范围。
4. 已经是语义化的名字不要动。import 进来的名字不要动。
5. 尽量把范围内能判断清楚的机械名/短名都覆盖掉；确实无法判断的少数可以留下，
   但要在汇报里列出并说明原因。

## 三、命名约定

详见 `frontend/NAMING.md`。要点：

| 种类 | 约定 | 示例 |
| --- | --- | --- |
| DOM 节点 | `xxxElement` | `popupElement`、`statusElement` |
| 布尔 | `is` / `has` / `should` / `can` 前缀 | `isReady`、`hasLoaded` |
| Map / Set | `xxxByUuid`、`xxxByEntityId` | `viewsByProjectId` |
| 回调参数 | `onEvent` | `onFocusChange`、`onSaveConfig` |
| 内部处理函数 | `handleEvent` | `handlePointerDown` |
| 常量 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`、`FADE_DURATION_MS` |
| 计数 | `xxxCount` | `retryCount`、`frameCount` |
| 带单位的量 | 名字带单位 | `durationMs`、`widthPx`、`angleRad` |
| three.js 对象 | `xxxMesh`/`xxxGeometry`/`xxxMaterial`/`xxxTexture`/`xxxGroup` | `groundMesh` |
| 网络 | `...Response`/`...Payload`/`...Body` | `stateResponse` |
| 临时向量 | `scratchVector3`、`temporaryMatrix4` | |

词汇从代码本身取：DOM id 与 class、selectors、对象键、事件名、请求/响应字段、
调用栈里已有的函数名、HA 的实体属性名。**不要**因为它是 `Object` 就叫 `object3`。

`THREE: arg1` 这种解构注入很常见，直接叫 `THREE`（先确认文件内没有别的绑定叫
`THREE`）。

## 四、验证（必须做）

```bash
node tools/apply_frontend_renames.mjs <你的映射文件> --dry
```

必须输出 `failed=0`。不通过就迭代：报冲突就换个名字，报「not declared on line」
就修正行号，报「no binding named」说明名字写错或该绑定不存在。

然后确认目标文件未被改动：

```bash
git status --short <目标文件>
```

应无输出。

想把「残留名字降到多少」量出来，可以在**临时副本**上试算，不要动真实文件：

```bash
node tools/report_frontend_names.mjs <文件路径>
```

## 五、汇报格式

1. 映射文件路径与条目数。
2. 每个文件的残留量前后对比（`机械名/短名`，在临时副本上测得）。
3. 5~10 个有代表性的改名，各附一句从代码里引用的理由。
4. 明确保留没动的名字与原因。
5. 确认 `--dry` 为 `failed=0`，且目标文件未被改动。
