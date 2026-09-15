export function nasGroups(statusSource) {
  const GROUP_LABELS = {
    system: "系统",
    storage: "存储",
    network: "网络",
    health: "健康"
  };
  return [...new Set([...(statusSource?.groupOrder || []), ...Object.keys(GROUP_LABELS)])]
    .filter(candidateGroup => Object.hasOwn(GROUP_LABELS, candidateGroup))
    .map(groupName => [groupName, GROUP_LABELS[groupName]]);
}
export function nasMetricValue(metric, state) {
  const stateObject = state?.newState || state || {};
  const stateValue = String(stateObject.state ?? "").trim();
  if (
    stateObject.available === false ||
    ["", "unknown", "unavailable", "none"].includes(stateValue.toLowerCase())
  ) {
    return {
      text: "—",
      available: false
    };
  }
  if (metric.kind === "problem") {
    if (["on", "off"].includes(stateValue)) {
      return {
        text: stateValue === "on" ? "有告警" : "正常",
        available: true,
        warning: stateValue === "on"
      };
    } else {
      return {
        text: stateValue,
        available: true
      };
    }
  }
  if (metric.kind === "timestamp") {
    const parsedTimestamp = Date.parse(stateValue);
    return {
      text: Number.isFinite(parsedTimestamp)
        ? new Date(parsedTimestamp).toLocaleString("zh-CN", {
            hour12: false
          })
        : stateValue,
      available: true
    };
  }
  if (metric.kind === "status") {
    return {
      text:
        {
          normal: "正常",
          healthy: "健康",
          good: "良好",
          ok: "正常",
          warning: "警告",
          critical: "严重",
          crashed: "故障",
          degraded: "降级"
        }[stateValue.toLowerCase()] || stateValue,
      available: true,
      warning: /warning|critical|crashed|degraded|fail/i.test(stateValue)
    };
  }
  const numericValue = Number(stateValue);
  const unit = String(stateObject.attributes?.unit_of_measurement || "");
  return {
    text: Number.isFinite(numericValue)
      ? "" +
        new Intl.NumberFormat("zh-CN", {
          maximumFractionDigits: 1
        }).format(numericValue) +
        (unit ? " " + unit : "")
      : stateValue,
    available: true,
    percent:
      Number.isFinite(numericValue) && unit === "%"
        ? Math.max(0, Math.min(100, numericValue))
        : null
  };
}
export function createNasPanel() {
  const createElement = (tagName, className, textContent = "") => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = textContent;
    return element;
  };
  const rootElement = createElement("div", "i3d-nas-panel");
  const headingElement = createElement("div", "i3d-nas-heading");
  const titleElement = createElement("h3", "");
  const statusElement = createElement("p", "i3d-nas-status");
  const metricsElement = createElement("div", "i3d-nas-metrics");
  const metaElement = createElement("p", "i3d-nas-meta");
  headingElement.append(titleElement, metaElement);
  rootElement.append(headingElement, statusElement, metricsElement);
  rootElement.hidden = true;
  let layoutSignature = "";
  let metricCards = [];
  function update({ item: item, states: states = {} }) {
    const sourceConfig = item.statusSource;
    const visibleMetricIds = sourceConfig?.visibleMetrics && new Set(sourceConfig.visibleMetrics);
    const metrics = (sourceConfig?.metrics || []).filter(
      configuredMetric => !visibleMetricIds || visibleMetricIds.has(configuredMetric.entityId)
    );
    const groups = nasGroups(sourceConfig);
    const nextSignature = JSON.stringify([metrics, groups]);
    titleElement.textContent = item.label || sourceConfig?.name || "NAS";
    titleElement.title = titleElement.textContent;
    if (layoutSignature !== nextSignature) {
      layoutSignature = nextSignature;
      metricsElement.replaceChildren();
      metricCards = [];
      for (const [groupKey, groupLabel] of groups) {
        const groupMetrics = metrics.filter(metricEntry => metricEntry.group === groupKey);
        if (!groupMetrics.length) {
          continue;
        }
        const groupElement = createElement("section", "i3d-nas-group");
        const gridElement = createElement("div", "i3d-nas-grid");
        groupElement.append(createElement("h4", "", groupLabel), gridElement);
        for (const metricConfig of groupMetrics) {
          const cardElement = createElement("div", "i3d-nas-metric");
          const valueElement = createElement("strong", "");
          const barElement = createElement("i", "i3d-nas-bar");
          cardElement.classList.toggle("is-wide", metricConfig.kind === "timestamp");
          cardElement.title = metricConfig.entityId;
          cardElement.append(
            createElement("span", "", metricConfig.label),
            valueElement,
            barElement
          );
          gridElement.append(cardElement);
          metricCards.push({
            metric: metricConfig,
            value: valueElement,
            bar: barElement,
            card: cardElement
          });
        }
        metricsElement.append(groupElement);
      }
    }
    let latestUpdateMs = 0;
    for (const metricCard of metricCards) {
      const metricState =
        states instanceof Map
          ? states.get(metricCard.metric.entityId)
          : states[metricCard.metric.entityId];
      const display = nasMetricValue(metricCard.metric, metricState);
      metricCard.card.title = metricCard.metric.label + "：" + display.text;
      metricCard.value.textContent = display.text;
      metricCard.card.classList.toggle("is-warning", !!display.warning);
      metricCard.card.classList.toggle("is-unavailable", !display.available);
      metricCard.bar.hidden = display.percent == null;
      metricCard.bar.style.width = (display.percent ?? 0) + "%";
      const updatedAt = Date.parse(metricState?.updatedAt || metricState?.last_updated || "");
      if (Number.isFinite(updatedAt)) {
        latestUpdateMs = Math.max(latestUpdateMs, updatedAt);
      }
    }
    statusElement.hidden = metricCards.length > 0;
    statusElement.textContent = sourceConfig
      ? sourceConfig.metrics?.length
        ? "未选择显示内容"
        : "已关联 NAS，暂无状态指标。请启用指标并同步目录后重新匹配数据来源。"
      : "请在“配置设备”中选择 NAS 数据来源。";
    metaElement.textContent =
      "状态更新于 " +
      (latestUpdateMs
        ? new Date(latestUpdateMs).toLocaleTimeString("zh-CN", {
            hour12: false
          })
        : "—");
  }
  return {
    root: rootElement,
    update: update,
    dispose() {
      rootElement.remove();
    }
  };
}
