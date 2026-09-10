const LOG_LEVEL_LABELS = {
  info: "信息",
  success: "成功",
  warning: "警告",
  error: "错误",
};
function formatLogTime(value) {
  const value2 = new Date(value);
  if (Number.isNaN(value2.getTime())) {
    return "时间未知";
  } else {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(value2)
      .replace(/\//g, "-");
  }
}
export function setupGlobalLog({ api: fn }) {
  const globalLogOpen = document.querySelector("#global-log-open");
  const globalLogDialog = document.querySelector("#global-log-dialog");
  if (
    !globalLogOpen ||
    !globalLogDialog ||
    globalLogOpen.dataset.globalLogReady === "true"
  ) {
    return null;
  }
  globalLogOpen.dataset.globalLogReady = "true";
  const globalLogClose = globalLogDialog.querySelector("#global-log-close");
  const globalLogCloseFooter = globalLogDialog.querySelector(
    "#global-log-close-footer",
  );
  const globalLogRefresh = globalLogDialog.querySelector("#global-log-refresh");
  const globalLogExport = globalLogDialog.querySelector("#global-log-export");
  const globalLogClear = globalLogDialog.querySelector("#global-log-clear");
  const globalLogMore = globalLogDialog.querySelector("#global-log-more");
  const globalLogLevel = globalLogDialog.querySelector("#global-log-level");
  const globalLogCategory = globalLogDialog.querySelector(
    "#global-log-category",
  );
  const globalLogSearch = globalLogDialog.querySelector("#global-log-search");
  const globalLogList = globalLogDialog.querySelector("#global-log-list");
  const globalLogStatus = globalLogDialog.querySelector("#global-log-status");
  let value = [];
  let value2 = false;
  let value3 = null;
  let value4 = null;
  let value5 = null;
  let value6 = false;
  const value7 = 200;
  function fn2(value8) {
    globalLogList.replaceChildren();
    if (!value8.length) {
      const element14 = document.createElement("div");
      element14.className = "global-log-empty";
      element14.textContent = "当前筛选条件下没有日志。";
      globalLogList.append(element14);
      return;
    }
    const value9 = document.createDocumentFragment();
    for (const value10 of value8) {
      const value11 = document.createElement("article");
      value11.className = "global-log-item " + (value10.level || "info");
      const value12 = document.createElement("i");
      value12.setAttribute("aria-hidden", "true");
      const value13 = document.createElement("div");
      const element14 = document.createElement("strong");
      element14.textContent = value10.message || "未提供说明";
      const element15 = document.createElement("span");
      const value14 = value10.clientTimestamp
        ? "客户端发生 " +
          formatLogTime(value10.clientTimestamp) +
          " · 接收 " +
          formatLogTime(value10.timestamp)
        : formatLogTime(value10.timestamp);
      element15.textContent =
        value14 +
        " · " +
        (value10.source || "系统后台") +
        " · " +
        (value10.category || "系统");
      value13.append(element14, element15);
      if (value10.details || Object.keys(value10.context || {}).length) {
        const value15 = document.createElement("details");
        const element17 = document.createElement("summary");
        element17.textContent = "查看详情";
        const element18 = document.createElement("pre");
        element18.textContent = [
          ...Object.entries(value10.context || {}).map(
            ([value16, value17]) => value16 + ": " + value17,
          ),
          value10.details || "",
        ]
          .filter(Boolean)
          .join("\n");
        value15.append(element17, element18);
        value13.append(value15);
      }
      if (Number(value10.repeatCount || 1) > 1) {
        const element17 = document.createElement("span");
        element17.textContent =
          "重复 " +
          value10.repeatCount +
          " 次 · 最近" +
          (value10.lastClientTimestamp ? "发生" : "接收") +
          " " +
          formatLogTime(
            value10.lastClientTimestamp ||
              value10.lastTimestamp ||
              value10.timestamp,
          );
        value13.append(element17);
      }
      const element16 = document.createElement("b");
      element16.textContent = LOG_LEVEL_LABELS[value10.level] || "信息";
      value11.append(value12, value13, element16);
      value9.append(value11);
    }
    globalLogList.append(value9);
  }
  function fn3(value8) {
    const value9 = globalLogCategory.value;
    globalLogCategory.replaceChildren(new Option("全部分类", ""));
    for (const value10 of value8 || []) {
      globalLogCategory.add(new Option(value10, value10));
    }
    globalLogCategory.value = [...globalLogCategory.options].some(
      (element14) => element14.value === value9,
    )
      ? value9
      : "";
  }
  function fn4() {
    const value8 = new URLSearchParams();
    if (globalLogLevel.value) {
      value8.set("level", globalLogLevel.value);
    }
    if (globalLogCategory.value) {
      value8.set("category", globalLogCategory.value);
    }
    if (globalLogSearch.value.trim()) {
      value8.set("search", globalLogSearch.value.trim());
    }
    return value8;
  }
  async function refresh({ append: value8 = false } = {}) {
    if (value2) {
      if (!value8) {
        value6 = true;
      }
      return;
    }
    value2 = true;
    globalLogRefresh.disabled = true;
    globalLogMore.disabled = true;
    if (!value8) {
      value = [];
      value5 = null;
      globalLogMore.hidden = true;
    }
    globalLogStatus.textContent = "正在读取全局日志…";
    try {
      const value9 = fn4();
      value9.set("limit", String(value7));
      value9.set("offset", String((value8 && value5) || 0));
      const value10 = await fn("/logs?" + value9);
      const value11 = value10?.items || [];
      value = value8
        ? [
            ...new Map(
              [...value, ...value11].map((value17) => [value17.id, value17]),
            ).values(),
          ]
        : value11;
      value5 = value10?.hasMore ? value10.nextOffset : null;
      fn3(value10?.categories || []);
      fn2(value);
      const value12 = value10?.storage || {};
      const value13 = value12.maxBytes
        ? " / " + (value12.maxBytes / 1024 / 1024).toFixed(0) + " MB 上限"
        : "";
      const value14 = value.length > value7 ? " · 查看历史时暂停自动刷新" : "";
      const value15 =
        value12.healthy === false
          ? " · 日志存储异常：" +
            (value12.lastError || "写入失败") +
            "（待写 " +
            (value12.pendingEvents || 0) +
            "，丢弃 " +
            (value12.droppedEvents || 0) +
            "）"
          : "";
      const value16 =
        value12.healthy !== false &&
        (value12.writeFailures > 0 || value12.droppedEvents > 0)
          ? " · 历史写入失败 " +
            (value12.writeFailures || 0) +
            " 次，丢弃 " +
            (value12.droppedEvents || 0) +
            " 条"
          : "";
      globalLogStatus.textContent =
        "已显示 " +
        value.length +
        " / " +
        (value10?.total ?? value.length) +
        " 条 · 自动保留最近 " +
        (value12.retentionDays || value10?.retentionDays || 7) +
        " 天" +
        value13 +
        value14 +
        value15 +
        value16;
      globalLogMore.hidden = value5 == null;
    } catch (error) {
      globalLogStatus.textContent = error.message || "日志读取失败。";
      if (!value8) {
        fn2([]);
      }
    } finally {
      value2 = false;
      globalLogRefresh.disabled = false;
      globalLogMore.disabled = false;
      if (value6) {
        value6 = false;
        refresh();
      }
    }
  }
  function fn5() {
    if (value3) {
      window.clearInterval(value3);
    }
    value3 = null;
  }
  async function open() {
    if (!globalLogDialog.open) {
      globalLogDialog.showModal();
    }
    await refresh();
    fn5();
    value3 = window.setInterval(() => {
      if (
        value.length <= value7 &&
        !globalLogList.querySelector("details[open]")
      ) {
        refresh();
      }
    }, 10000);
  }
  function fn6() {
    fn5();
    if (globalLogDialog.open) {
      globalLogDialog.close();
    }
  }
  globalLogOpen.addEventListener("click", open);
  globalLogClose.addEventListener("click", fn6);
  globalLogCloseFooter.addEventListener("click", fn6);
  globalLogRefresh.addEventListener("click", refresh);
  globalLogMore.addEventListener("click", () =>
    refresh({
      append: true,
    }),
  );
  globalLogLevel.addEventListener("change", refresh);
  globalLogCategory.addEventListener("change", refresh);
  globalLogSearch.addEventListener("input", () => {
    window.clearTimeout(value4);
    value4 = window.setTimeout(refresh, 250);
  });
  globalLogDialog.addEventListener("close", fn5);
  globalLogExport.addEventListener("click", () => {
    const value8 = document.createElement("a");
    const value9 = fn4();
    value8.href = "/api/v1/logs/export" + (value9.size ? "?" + value9 : "");
    value8.download =
      "ha-bridge-global-log-" + new Date().toISOString().slice(0, 10) + ".txt";
    document.body.append(value8);
    value8.click();
    value8.remove();
  });
  globalLogClear.addEventListener("click", async () => {
    if (window.confirm("确定清空当前全局日志吗？清空后无法恢复。")) {
      globalLogClear.disabled = true;
      try {
        await fn("/logs", {
          method: "DELETE",
        });
        await refresh();
      } catch (error) {
        globalLogStatus.textContent = error.message || "日志清空失败。";
      } finally {
        globalLogClear.disabled = false;
      }
    }
  });
  return {
    open: open,
    refresh: refresh,
  };
}
