# 改名映射索引

本目录存放语义化重命名（第四轮）的映射文件。每份映射是一张
`{"文件路径": {"旧名@声明行[:列号]": "新名"}}` 表，由
`tools/apply_frontend_renames.mjs` 套用。**40 份映射、26 577 条改名**，
覆盖 152 个文件、27 748 个机械名/短名中的绝大部分（差额见文末）。

这些映射是**可重放**的：只要拿到基线提交（`baseline: pre-semantic-rename`）
的前端源码，按下表顺序逐份套用，就能逐字节重建出当前的可读版本。
这也是本目录存在的理由——没有它，这次改名无法被验证、审计或重做。

## 一、重放方法与顺序

```bash
BASE=baseline                # 或基线提交哈希
for map in <按下表 1→40 顺序>; do
  node tools/apply_frontend_renames.mjs "tools/rename-maps/$map"
done
```

**顺序不可颠倒**，原因有三个，都会真实地弄坏结果：

1. **同文件分块有依赖。** 第 N+1 块的取名是「避开第 N 块已占用的名字」之后选定的。
   先套用第 N+1 块再套用第 N 块，后者选的名字可能已被占用，套用工具会以
   「new name collides」整批拒绝，而不是静默写坏——但重放就此中断。
2. **映射的键是「改名前的名字」。** 套用一次后该名字在文件里已不存在，
   再套一次必然 `failed`。这是**正确行为**，不是回归。
3. **跨文件的映射彼此独立**，可以任意顺序；但为可复现，一律按下表顺序。

套用前建议先核对覆盖度，确认映射恰好覆盖它被分配的区间：

```bash
node tools/verify_map_coverage.mjs tools/rename-maps/<map>.json <声明起始行> <声明结束行>
```

区间取 `tools/plan_frontend_rename_ranges.mjs` 输出的**声明行范围**（authoritative），
不是那个更宽的 span。分块映射的声明行范围见下表「区间」列。

每套用若干份后跑一次批次校验：

```bash
tools/verify_frontend_batch.sh
```

## 二、映射清单（按重放顺序）

「批」列是历史上的提交批次；同一批内的映射对应同一次提交。
`7 个文件` 这类表示该映射覆盖多个小文件（`tail-*` 系列把长尾小文件分组打包，
避免为几十行代码各开一份文档）。

| 序 | 映射 | 条数 | 目标 | 批 |
| --- | --- | --- | --- | --- |
|  1 | `config-editor.json` | 723 | `config-editor.js` | 1 |
|  2 | `editor.json` | 434 | `editor.js` | 1 |
|  3 | `geometry.json` | 765 | `geometry.js` | 1 |
|  4 | `light-range-editor.json` | 409 | `light-range-editor.js` | 1 |
|  5 | `plan2-contact-shadows.json` | 302 | `studio-plan2-contact-shadows.js` | 1 |
|  6 | `plan2-region-lights.json` | 306 | `studio-plan2-region-lights.js` | 1 |
|  7 | `registry.json` | 994 | `registry.js` | 1 |
|  8 | `runtime.json` | 302 | `runtime.js` | 1 |
|  9 | `stage.json` | 888 | `stage.js` | 1 |
| 10 | `curtain-motion.json` | 236 | `curtain-motion.js` | 2 |
| 11 | `environment-scene.json` | 223 | `environment-scene.js` | 2 |
| 12 | `home-1.json` | 1001 | `home.js`（声明行 136-1181） | 2 |
| 13 | `renderer-1.json` | 1000 | `renderer.js`（247-4003） | 2 |
| 14 | `security-editor.json` | 228 | `security-editor.js` | 2 |
| 15 | `studio-app-1.json` | 1000 | `studio-app.js`（143-3792） | 2 |
| 16 | `studio-external-models.json` | 238 | `studio-external-models.js` | 2 |
| 17 | `studio-floor-transition.json` | 221 | `studio-floor-transition.js` | 2 |
| 18 | `studio-ground-reflections.json` | 228 | `studio-ground-reflections.js` | 2 |
| 19 | `tail-i3d-env-light.json` | 545 | 7 个文件 | 3 |
| 20 | `tail-i3d-panels.json` | 692 | 12 个文件 | 3 |
| 21 | `tail-i3d-presence.json` | 583 | 5 个文件 | 3 |
| 22 | `tail-i3d-static.json` | 467 | 13 个文件 | 3 |
| 23 | `tail-i3d-vacuum-camera.json` | 866 | 6 个文件 | 3 |
| 24 | `tail-renderer-a.json` | 780 | 6 个文件 | 3 |
| 25 | `tail-renderer-b.json` | 397 | 11 个文件 | 3 |
| 26 | `tail-scene-helpers.json` | 319 | 16 个文件 | 3 |
| 27 | `tail-static-editor.json` | 730 | 16 个文件 | 3 |
| 28 | `tail-static-pages.json` | 706 | 22 个文件 | 3 |
| 29 | `tail-studio-large.json` | 952 | 12 个文件 | 3 |
| 30 | `tail-studio-small.json` | 251 | 12 个文件 | 3 |
| 31 | `renderer-2.json` | 1000 | `renderer.js`（4006-7762） | 4 |
| 32 | `studio-app-2.json` | 997 | `studio-app.js`（3810-9220） | 4 |
| 33 | `home-2.json` | 999 | `home.js`（1182-4423） | 5 |
| 34 | `renderer-3.json` | 1000 | `renderer.js`（7773-11987） | 5 |
| 35 | `studio-app-3.json` | 1000 | `studio-app.js`（9221-13709） | 5 |
| 36 | `home-3.json` | 1050 | `home.js`（4433-8345） | 6 |
| 37 | `renderer-4.json` | 797 | `renderer.js`（11995-15681） | 6 |
| 38 | `studio-app-4.json` | 1050 | `studio-app.js`（3344-20732） | 6 |
| 39 | `home-4.json` | 1100 | `home.js`（8346-14905） | 7 |
| 40 | `studio-app-5.json` | 798 | `studio-app.js`（20743-24525） | 7 |

> 未带区间的映射键多为裸名（该名字在文件内只绑定一次，无需行号消歧），
> 覆盖整个文件；带区间的为分块映射。`studio-app-4` 的区间格外宽，因为它的
> 1050 个绑定是分类器扩宽后**新暴露的遗漏**，散落在已改名的区间里。

## 三、注意事项

- **映射必须在产出它的任务宣告完成后才能套用**，并在套用前后各取一次哈希比对。
  曾发生：一份映射在被套用期间仍被其产出任务改写，导致首次 dry-run 的名字与
  最终落盘的名字不是同一套。若代码与映射不能互相复现，任何一次重放都会失控。
- **不要用已套用过的映射做回归测试**：旧名字早已不存在，工具报 `failed` 是正确行为。
- **40 份映射 ≠ 全部残留。** 表内条数合计 26 577，与起点 27 748 的差额来自两处：
  一是分类器扩宽前的盲点名字最初不在任何计划内、后由后续块补齐（已计入）；
  二是 152 个文件中约 170 个名字经人工判定为**真语义名**而**有意保留**
  （如 `sha256`、`alignTo16`、SHA-256 规范词汇 `temp1`/`word15`——
  它们被判为语义名而非残留，详见 `tools/lib/name-buckets.selftest.mjs`）。
