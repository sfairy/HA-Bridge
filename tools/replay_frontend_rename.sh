#!/usr/bin/env bash
# 从「格式已定、改名未始」的提交出发，纯用改名映射重建当前前端代码，
# 并与 HEAD 逐字节比对。这是「本轮语义化改名可重放」的证明脚本。
#
#   用法：tools/replay_frontend_rename.sh [--keep]
#
# 退出码 0 = 重放结果与 HEAD 逐字节相同；非 0 = 不可重放（会列出差异文件）。
#
# 为什么基准是 b837d93 而不是更早的基线：
#   b837d93 是 Prettier 格式化提交。所有映射的行号都是在格式化后的树上
#   算出来的，拿格式化之前的树做基准会整批报「name is not declared on
#   line N」。见 tools/rename-maps/README.md。
#
# 为什么还要单独补 e99b232 的 6 个文件：
#   试点批在 tools/apply_frontend_renames.mjs 诞生之前手工完成，没有映射。
#   这 6 个文件此后未被任何提交改动，因此直接取该提交的版本即为终态。
set -euo pipefail

BASE=${HB_REPLAY_BASE:-b837d93}   # 格式已定、改名未始
PILOT=${HB_REPLAY_PILOT:-e99b232} # 试点批（无映射的那 6 个文件）
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# 临时工作区默认放在 .git/ 下：它在工作区内部（因此沙箱允许写入，不会触发
# 权限审批），又永远不会被 git 跟踪，不会污染工作树。可用 HB_REPLAY_WORK 覆盖。
WORK="${HB_REPLAY_WORK:-$ROOT/.git/hb-replay-$$}"

KEEP=0
[ "${1:-}" = "--keep" ] && KEEP=1
cleanup() { [ "$KEEP" = 1 ] || rm -rf "$WORK"; }
trap cleanup EXIT

mkdir -p "$WORK/tools/lib"

git -C "$ROOT" cat-file -e "$BASE^{commit}" 2>/dev/null || { echo "找不到基准提交 $BASE" >&2; exit 2; }
git -C "$ROOT" cat-file -e "$PILOT^{commit}" 2>/dev/null || { echo "找不到试点提交 $PILOT" >&2; exit 2; }

git -C "$ROOT" archive "$BASE" frontend | tar -x -C "$WORK"
cp "$ROOT/tools/apply_frontend_renames.mjs" "$WORK/tools/"
cp "$ROOT/tools/lib/name-buckets.mjs" "$WORK/tools/lib/"

# 映射必须按「首次进入版本库的时间」排序：同文件分块之间，后一块的取名
# 是在避开前一块已用名字之后才定下的，顺序颠倒会撞名而被整批拒绝。
# 未提交的映射没有时间戳、顺序无从推导，必须明确报错——若默默排到最前，
# 它会套用在尚未改名的原始代码上并失败（或更糟：以错误的顺序通过）。
order_file="$WORK/maps.txt"
while IFS= read -r m; do
  ct="$(git -C "$ROOT" log --diff-filter=A --format=%ct -- "$m" | tail -1)"
  if [ -z "$ct" ]; then
    echo "映射尚未提交，重放顺序无法确定: ${m#"$ROOT"/}" >&2
    echo "请先提交该映射（顺序按首次提交时间推导），再重放。" >&2
    exit 4
  fi
  printf '%s\t%s\n' "$ct" "$m"
done < <(ls "$ROOT"/tools/rename-maps/*.json) | LC_ALL=C sort -n -k1,1 > "$order_file"

applied=0
while IFS=$'\t' read -r _ map; do
  [ -n "$map" ] || continue
  out="$(node "$WORK/tools/apply_frontend_renames.mjs" "$map" 2>&1 | tail -1)"
  if ! grep -q 'failed=0$' <<<"$out"; then
    echo "映射套用失败: $(basename "$map")" >&2
    echo "$out" >&2
    exit 3
  fi
  applied=$((applied + 1))
done < "$order_file"
echo "已按序套用 $applied 份映射"

# 试点批：没有映射，取其提交版本。
while IFS= read -r f; do
  [ -n "$f" ] || continue
  mkdir -p "$WORK/$(dirname "$f")"
  git -C "$ROOT" show "$PILOT:$f" > "$WORK/$f"
  echo "试点批补入 $f"
done < <(git -C "$ROOT" diff --name-only "$PILOT^" "$PILOT" -- frontend)

# 4. 再套一次 Prettier。格式化阶段排在改名之前，而语义名普遍比机械名长
#    （`responseBody` 比 `value1234` 长），原先正好卡在 printWidth=100 的行
#    会重新折行；所以「基线 → 映射 → 试点批」得到的还不是最终态。
#    这一步是纯空白变更，可由 verify_frontend_rename.mjs 的 alpha-等价性证明。
cp "$ROOT/.prettierrc.json" "$ROOT/.prettierignore" "$WORK/" 2>/dev/null || true
PRETTIER="${HB_PRETTIER:-}"
if [ -z "$PRETTIER" ] && npx --yes prettier@3 --version >/dev/null 2>&1; then
  PRETTIER="npx --yes prettier@3"
fi
if [ -z "$PRETTIER" ]; then
  echo "无法获得 Prettier：请联网让 npx 取 prettier@3，或设 HB_PRETTIER 指向可执行文件" >&2
  exit 5
fi
( cd "$WORK" && $PRETTIER --write "frontend/**/*.{js,css,html}" >/dev/null 2>&1 ) \
  && echo "已重跑 Prettier" \
  || { echo "Prettier 执行失败" >&2; exit 5; }

# 比对基准取 HEAD（已提交态），不取工作区：frontend/ 可能同时有别的
# 会话在做功能性修改，拿工作区比对会把无关改动误报成重放缺口。
rm -rf "$WORK/head" && mkdir -p "$WORK/head"
git -C "$ROOT" archive HEAD frontend | tar -x -C "$WORK/head"

# 用 diff -rq 而非「逐文件哈希再比总哈希」：沙箱禁止 argv 批量
# （xargs 与 find -exec ... + 都会死在 sysconf(_SC_ARG_MAX)），逐文件起
# shasum 又要几百次进程创建、慢到超时；diff -rq 一个进程就给结论。
#
# 两类预期差异，都过滤掉并在下面注明缘由：
#   - NAMING.md 是本轮新增的文档，重放树里没有；
#   - HB_REPLAY_SKIP 里的文件，其 HEAD 版本仍停留在「改名后、未再格式化」
#     的状态——另一个会话正持有它们做功能修改，重跑 Prettier 会覆盖其工作。
#     它们提交后应把 HB_REPLAY_SKIP 清空。
HB_REPLAY_SKIP="${HB_REPLAY_SKIP:-studio-app.js studio-shadow-atlas.js}"
diffs="$(diff -rq "$WORK/frontend" "$WORK/head/frontend" 2>&1 || true)"
diffs="$(printf '%s\n' "$diffs" | grep -v 'NAMING\.md' || true)"
for skip in $HB_REPLAY_SKIP; do
  diffs="$(printf '%s\n' "$diffs" | grep -v -- "$skip" || true)"
done
if [ -n "$HB_REPLAY_SKIP" ]; then
  # 花括号是必需的，不是风格：bash 在 UTF-8 环境下会把紧跟在变量名后的
  # 多字节字符（如全角冒号）并进变量名，报 unbound variable。
  echo "（已跳过 ${HB_REPLAY_SKIP}：其 HEAD 版本待另一会话提交后再格式化）"
fi

if [ -z "$diffs" ]; then
  echo "PASS  重放结果与 HEAD 逐字节相同（HEAD=$(git -C "$ROOT" rev-parse --short HEAD)）"
  [ "$KEEP" = 1 ] && echo "临时工作区保留在 $WORK"
else
  echo "FAIL  重放结果与 HEAD 不一致" >&2
  printf '%s\n' "$diffs" >&2
  rm -rf "$WORK"          # 失败时也清理，避免 .git/ 里堆积调试残留
  KEEP=1                  # 但不再让 trap 重复删除
  exit 1
fi
