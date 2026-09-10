export function nasGroups(statusSource) {
  const groupLabels = {
    system: "系统",
    storage: "存储",
    network: "网络",
    health: "健康"
  };
  return [...new Set([...(statusSource?.groupOrder || []), ...Object.keys(groupLabels)])].filter(key => Object.hasOwn(groupLabels, key)).map(key => [key, groupLabels[key]]);
}
export function nasMetricValue(metric, rawState) {
  const state = rawState?.newState || rawState || {};
  const raw = String(state.state ?? "").trim();
  if (state.available === false || ["", "unknown", "unavailable", "none"].includes(raw.toLowerCase())) {
    return {
      text: "—",
      available: false
    };
  }
  if (metric.kind === "problem") {
    if (["on", "off"].includes(raw)) {
      return {
        text: raw === "on" ? "有告警" : "正常",
        available: true,
        warning: raw === "on"
      };
    } else {
      return {
        text: raw,
        available: true
      };
    }
  }
  if (metric.kind === "timestamp") {
    const parsed = Date.parse(raw);
    return {
      text: Number.isFinite(parsed) ? new Date(parsed).toLocaleString("zh-CN", {
        hour12: false
      }) : raw,
      available: true
    };
  }
  if (metric.kind === "status") {
    return {
      text: {
        normal: "正常",
        healthy: "健康",
        good: "良好",
        ok: "正常",
        warning: "警告",
        critical: "严重",
        crashed: "故障",
        degraded: "降级"
      }[raw.toLowerCase()] || raw,
      available: true,
      warning: /warning|critical|crashed|degraded|fail/i.test(raw)
    };
  }
  const numeric = Number(raw);
  const unit = String(state.attributes?.unit_of_measurement || "");
  return {
    text: Number.isFinite(numeric) ? "" + new Intl.NumberFormat("zh-CN", {
      maximumFractionDigits: 1
    }).format(numeric) + (unit ? " " + unit : "") : raw,
    available: true,
    percent: Number.isFinite(numeric) && unit === "%" ? Math.max(0, Math.min(100, numeric)) : null
  };
}
export function createNasPanel() {
  const createEl = (tag, className, text = "") => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };
  const root = createEl("div", "i3d-nas-panel");
  const heading = createEl("div", "i3d-nas-heading");
  const titleEl = createEl("h3", "");
  const emptyStatus = createEl("p", "i3d-nas-status");
  const metricsEl = createEl("div", "i3d-nas-metrics");
  const metaEl = createEl("p", "i3d-nas-meta");
  heading.append(titleEl, metaEl);
  root.append(heading, emptyStatus, metricsEl);
  root.hidden = true;
  let layoutKey = "";
  let metricNodes = [];
  function update({
    item,
    states = {}
  }) {
    const statusSource = item.statusSource;
    const visibleSet = statusSource?.visibleMetrics && new Set(statusSource.visibleMetrics);
    const visibleMetrics = (statusSource?.metrics || []).filter(metric => !visibleSet || visibleSet.has(metric.entityId));
    const groups = nasGroups(statusSource);
    const nextLayoutKey = JSON.stringify([visibleMetrics, groups]);
    titleEl.textContent = item.label || statusSource?.name || "NAS";
    titleEl.title = titleEl.textContent;
    if (layoutKey !== nextLayoutKey) {
      layoutKey = nextLayoutKey;
      metricsEl.replaceChildren();
      metricNodes = [];
      for (const [groupId, groupLabel] of groups) {
        const metricsInGroup = visibleMetrics.filter(metric => metric.group === groupId);
        if (!metricsInGroup.length) {
          continue;
        }
        const groupSection = createEl("section", "i3d-nas-group");
        const grid = createEl("div", "i3d-nas-grid");
        groupSection.append(createEl("h4", "", groupLabel), grid);
        for (const metric of metricsInGroup) {
          const card = createEl("div", "i3d-nas-metric");
          const valueEl = createEl("strong", "");
          const bar = createEl("i", "i3d-nas-bar");
          card.classList.toggle("is-wide", metric.kind === "timestamp");
          card.title = metric.entityId;
          card.append(createEl("span", "", metric.label), valueEl, bar);
          grid.append(card);
          metricNodes.push({
            metric,
            value: valueEl,
            bar,
            card
          });
        }
        metricsEl.append(groupSection);
      }
    }
    let latestUpdatedAt = 0;
    for (const node of metricNodes) {
      const entityState = states instanceof Map ? states.get(node.metric.entityId) : states[node.metric.entityId];
      const display = nasMetricValue(node.metric, entityState);
      node.card.title = node.metric.label + "：" + display.text;
      node.value.textContent = display.text;
      node.card.classList.toggle("is-warning", !!display.warning);
      node.card.classList.toggle("is-unavailable", !display.available);
      node.bar.hidden = display.percent == null;
      node.bar.style.width = (display.percent ?? 0) + "%";
      const updatedAtMs = Date.parse(entityState?.updatedAt || entityState?.last_updated || "");
      if (Number.isFinite(updatedAtMs)) {
        latestUpdatedAt = Math.max(latestUpdatedAt, updatedAtMs);
      }
    }
    emptyStatus.hidden = metricNodes.length > 0;
    emptyStatus.textContent = statusSource ? "未选择显示内容" : "请在“配置设备”中选择 NAS 数据来源。";
    metaEl.textContent = "状态更新于 " + (latestUpdatedAt ? new Date(latestUpdatedAt).toLocaleTimeString("zh-CN", {
      hour12: false
    }) : "—");
  }
  return {
    root,
    update,
    dispose() {
      root.remove();
    }
  };
}
