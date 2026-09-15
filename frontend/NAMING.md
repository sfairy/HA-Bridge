# 前端命名规范

约束 `frontend/**` 的标识符命名。

## 不可违反

| 项目 | 说明 |
| --- | --- |
| 导出名 | `export` 的公开名字；被其他模块、HTML、动态 `import()` 消费 |
| 导入说明符 | `import { X as Y }` 的 `X` 侧 |
| 成员属性 / 对象键 | `obj.prop`、`{ key: v }`、`class { key() {} }` |
| 字符串与模板 | 含 `?v=…` 与中文文案 |
| 程序结构 | 只改名，不做提升、重排、内联、提取或合并 |

## 取名习惯

从业务语义出发：`entityId`、`cameraTarget`、`panelElement`、`retryDelayMs`。

| 种类 | 约定 |
| --- | --- |
| 布尔 | `is` / `has` / `should` / `can` |
| DOM | `xxxElement` |
| Map / Set | `xxxById`、`xxxSet` |
| 回调 | 外部 `onEvent`，内部 `handleEvent` |
| 常量 | `UPPER_SNAKE_CASE` |
| 带单位 | `durationMs`、`widthPx`、`angleRad` |

文件内名字唯一；不要为「统一风格」去改已经语义清楚的名字。

缓存戳统一用 `tools/bump_static_cache_versions.mjs`（`YYYYMMDDHHMMSS`）。
