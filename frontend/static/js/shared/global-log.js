const LOG_LEVEL_LABELS = {
  info: "信息",
  success: "成功",
  warning: "警告",
  error: "错误",
};
function formatLogTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
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
      .format(date)
      .replace(/\//g, "-");
  }
}
export function setupGlobalLog({ api }) {
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
  let logEntries = [];
  let refreshing = false;
  let autoRefreshTimer = null;
  let searchDebounceTimer = null;
  let nextOffset = null;
  let refreshQueued = false;
  const pageLimit = 200;
  function renderLogList(entries) {
    globalLogList.replaceChildren();
    if (!entries.length) {
      const empty = document.createElement("div");
      empty.className = "global-log-empty";
      empty.textContent = "当前筛选条件下没有日志。";
      globalLogList.append(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const entry of entries) {
      const item = document.createElement("article");
      item.className = "global-log-item " + (entry.level || "info");
      const icon = document.createElement("i");
      icon.setAttribute("aria-hidden", "true");
      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = entry.message || "未提供说明";
      const meta = document.createElement("span");
      const timeLabel = entry.clientTimestamp
        ? "客户端发生 " +
          formatLogTime(entry.clientTimestamp) +
          " · 接收 " +
          formatLogTime(entry.timestamp)
        : formatLogTime(entry.timestamp);
      meta.textContent =
        timeLabel +
        " · " +
        (entry.source || "系统后台") +
        " · " +
        (entry.category || "系统");
      body.append(title, meta);
      if (entry.details || Object.keys(entry.context || {}).length) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "查看详情";
        const pre = document.createElement("pre");
        pre.textContent = [
          ...Object.entries(entry.context || {}).map(
            ([key, contextValue]) => key + ": " + contextValue,
          ),
          entry.details || "",
        ]
          .filter(Boolean)
          .join("\n");
        details.append(summary, pre);
        body.append(details);
      }
      if (Number(entry.repeatCount || 1) > 1) {
        const repeat = document.createElement("span");
        repeat.textContent =
          "重复 " +
          entry.repeatCount +
          " 次 · 最近" +
          (entry.lastClientTimestamp ? "发生" : "接收") +
          " " +
          formatLogTime(
            entry.lastClientTimestamp ||
              entry.lastTimestamp ||
              entry.timestamp,
          );
        body.append(repeat);
      }
      const levelBadge = document.createElement("b");
      levelBadge.textContent = LOG_LEVEL_LABELS[entry.level] || "信息";
      item.append(icon, body, levelBadge);
      fragment.append(item);
    }
    globalLogList.append(fragment);
  }
  function syncCategoryOptions(categories) {
    const previous = globalLogCategory.value;
    globalLogCategory.replaceChildren(new Option("全部分类", ""));
    for (const category of categories || []) {
      globalLogCategory.add(new Option(category, category));
    }
    globalLogCategory.value = [...globalLogCategory.options].some(
      (option) => option.value === previous,
    )
      ? previous
      : "";
  }
  function buildQueryParams() {
    const params = new URLSearchParams();
    if (globalLogLevel.value) {
      params.set("level", globalLogLevel.value);
    }
    if (globalLogCategory.value) {
      params.set("category", globalLogCategory.value);
    }
    if (globalLogSearch.value.trim()) {
      params.set("search", globalLogSearch.value.trim());
    }
    return params;
  }
  async function refresh({ append = false } = {}) {
    if (refreshing) {
      if (!append) {
        refreshQueued = true;
      }
      return;
    }
    refreshing = true;
    globalLogRefresh.disabled = true;
    globalLogMore.disabled = true;
    if (!append) {
      logEntries = [];
      nextOffset = null;
      globalLogMore.hidden = true;
    }
    globalLogStatus.textContent = "正在读取全局日志…";
    try {
      const params = buildQueryParams();
      params.set("limit", String(pageLimit));
      params.set("offset", String((append && nextOffset) || 0));
      const payload = await api("/logs?" + params);
      const items = payload?.items || [];
      logEntries = append
        ? [
            ...new Map(
              [...logEntries, ...items].map((entry) => [entry.id, entry]),
            ).values(),
          ]
        : items;
      nextOffset = payload?.hasMore ? payload.nextOffset : null;
      syncCategoryOptions(payload?.categories || []);
      renderLogList(logEntries);
      const storage = payload?.storage || {};
      const maxBytesLabel = storage.maxBytes
        ? " / " + (storage.maxBytes / 1024 / 1024).toFixed(0) + " MB 上限"
        : "";
      const historyPauseLabel =
        logEntries.length > pageLimit ? " · 查看历史时暂停自动刷新" : "";
      const storageErrorLabel =
        storage.healthy === false
          ? " · 日志存储异常：" +
            (storage.lastError || "写入失败") +
            "（待写 " +
            (storage.pendingEvents || 0) +
            "，丢弃 " +
            (storage.droppedEvents || 0) +
            "）"
          : "";
      const writeFailureLabel =
        storage.healthy !== false &&
        (storage.writeFailures > 0 || storage.droppedEvents > 0)
          ? " · 历史写入失败 " +
            (storage.writeFailures || 0) +
            " 次，丢弃 " +
            (storage.droppedEvents || 0) +
            " 条"
          : "";
      globalLogStatus.textContent =
        "已显示 " +
        logEntries.length +
        " / " +
        (payload?.total ?? logEntries.length) +
        " 条 · 自动保留最近 " +
        (storage.retentionDays || payload?.retentionDays || 7) +
        " 天" +
        maxBytesLabel +
        historyPauseLabel +
        storageErrorLabel +
        writeFailureLabel;
      globalLogMore.hidden = nextOffset == null;
    } catch (error) {
      globalLogStatus.textContent = error.message || "日志读取失败。";
      if (!append) {
        renderLogList([]);
      }
    } finally {
      refreshing = false;
      globalLogRefresh.disabled = false;
      globalLogMore.disabled = false;
      if (refreshQueued) {
        refreshQueued = false;
        refresh();
      }
    }
  }
  function stopAutoRefresh() {
    if (autoRefreshTimer) {
      window.clearInterval(autoRefreshTimer);
    }
    autoRefreshTimer = null;
  }
  async function open() {
    if (!globalLogDialog.open) {
      globalLogDialog.showModal();
    }
    await refresh();
    stopAutoRefresh();
    autoRefreshTimer = window.setInterval(() => {
      if (
        logEntries.length <= pageLimit &&
        !globalLogList.querySelector("details[open]")
      ) {
        refresh();
      }
    }, 10000);
  }
  function closeDialog() {
    stopAutoRefresh();
    if (globalLogDialog.open) {
      globalLogDialog.close();
    }
  }
  globalLogOpen.addEventListener("click", open);
  globalLogClose.addEventListener("click", closeDialog);
  globalLogCloseFooter.addEventListener("click", closeDialog);
  globalLogRefresh.addEventListener("click", refresh);
  globalLogMore.addEventListener("click", () =>
    refresh({
      append: true,
    }),
  );
  globalLogLevel.addEventListener("change", refresh);
  globalLogCategory.addEventListener("change", refresh);
  globalLogSearch.addEventListener("input", () => {
    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = window.setTimeout(refresh, 250);
  });
  globalLogDialog.addEventListener("close", stopAutoRefresh);
  globalLogExport.addEventListener("click", () => {
    const link = document.createElement("a");
    const params = buildQueryParams();
    link.href = "/api/v1/logs/export" + (params.size ? "?" + params : "");
    link.download =
      "ha-bridge-global-log-" + new Date().toISOString().slice(0, 10) + ".txt";
    document.body.append(link);
    link.click();
    link.remove();
  });
  globalLogClear.addEventListener("click", async () => {
    if (window.confirm("确定清空当前全局日志吗？清空后无法恢复。")) {
      globalLogClear.disabled = true;
      try {
        await api("/logs", {
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
