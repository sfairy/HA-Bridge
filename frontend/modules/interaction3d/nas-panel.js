export function nasGroups(groupOrder) {
  const value9 = {
    system: "系统",
    storage: "存储",
    network: "网络",
    health: "健康"
  };
  return [...new Set([...(groupOrder?.groupOrder || []), ...Object.keys(value9)])].filter(arg => Object.hasOwn(value9, arg)).map(arg2 => [arg2, value9[arg2]]);
}
export function nasMetricValue(kind2, newState) {
  const state = newState?.newState || newState || {};
  const toLowerCase = String(state.state ?? "").trim();
  if (state.available === false || ["", "unknown", "unavailable", "none"].includes(toLowerCase.toLowerCase())) {
    return {
      text: "—",
      available: false
    };
  }
  if (kind2.kind === "problem") {
    if (["on", "off"].includes(toLowerCase)) {
      return {
        text: toLowerCase === "on" ? "有告警" : "正常",
        available: true,
        warning: toLowerCase === "on"
      };
    } else {
      return {
        text: toLowerCase,
        available: true
      };
    }
  }
  if (kind2.kind === "timestamp") {
    const value5 = Date.parse(toLowerCase);
    return {
      text: Number.isFinite(value5) ? new Date(value5).toLocaleString("zh-CN", {
        hour12: false
      }) : toLowerCase,
      available: true
    };
  }
  if (kind2.kind === "status") {
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
      }[toLowerCase.toLowerCase()] || toLowerCase,
      available: true,
      warning: /warning|critical|crashed|degraded|fail/i.test(toLowerCase)
    };
  }
  const value10 = Number(toLowerCase);
  const value11 = String(state.attributes?.unit_of_measurement || "");
  return {
    text: Number.isFinite(value10) ? "" + new Intl.NumberFormat("zh-CN", {
      maximumFractionDigits: 1
    }).format(value10) + (value11 ? " " + value11 : "") : toLowerCase,
    available: true,
    percent: Number.isFinite(value10) && value11 === "%" ? Math.max(0, Math.min(100, value10)) : null
  };
}
export function createNasPanel() {
  const value12 = (arg3, element, element2 = "") => {
    const className = document.createElement(arg3);
    className.className = element;
    className.textContent = element2;
    return className;
  };
  const append3 = value12("div", "i3d-nas-panel");
  const append4 = value12("div", "i3d-nas-heading");
  const textContent = value12("h3", "");
  const hidden = value12("p", "i3d-nas-status");
  const replaceChildren = value12("div", "i3d-nas-metrics");
  const textContent2 = value12("p", "i3d-nas-meta");
  append4.append(textContent, textContent2);
  append3.append(append4, hidden, replaceChildren);
  append3.hidden = true;
  let value13 = "";
  let push = [];
  function update({
    item: statusSource,
    states: get = {}
  }) {
    const visibleMetrics = statusSource.statusSource;
    const has = visibleMetrics?.visibleMetrics && new Set(visibleMetrics.visibleMetrics);
    const filter = (visibleMetrics?.metrics || []).filter(entityId => !has || has.has(entityId.entityId));
    const value6 = nasGroups(visibleMetrics);
    const value7 = JSON.stringify([filter, value6]);
    textContent.textContent = statusSource.label || visibleMetrics?.name || "NAS";
    textContent.title = textContent.textContent;
    if (value13 !== value7) {
      value13 = value7;
      replaceChildren.replaceChildren();
      push = [];
      for (const [value2, value3] of value6) {
        const length = filter.filter(group => group.group === value2);
        if (!length.length) {
          continue;
        }
        const append = value12("section", "i3d-nas-group");
        const append2 = value12("div", "i3d-nas-grid");
        append.append(value12("h4", "", value3), append2);
        for (const kind of length) {
          const classList = value12("div", "i3d-nas-metric");
          const value = value12("strong", "");
          const bar = value12("i", "i3d-nas-bar");
          classList.classList.toggle("is-wide", kind.kind === "timestamp");
          classList.title = kind.entityId;
          classList.append(value12("span", "", kind.label), value, bar);
          append2.append(classList);
          push.push({
            metric: kind,
            value,
            bar,
            card: classList
          });
        }
        replaceChildren.append(append);
      }
    }
    let value8 = 0;
    for (const metric of push) {
      const updatedAt = get instanceof Map ? get.get(metric.metric.entityId) : get[metric.metric.entityId];
      const text = nasMetricValue(metric.metric, updatedAt);
      metric.card.title = metric.metric.label + "：" + text.text;
      metric.value.textContent = text.text;
      metric.card.classList.toggle("is-warning", !!text.warning);
      metric.card.classList.toggle("is-unavailable", !text.available);
      metric.bar.hidden = text.percent == null;
      metric.bar.style.width = (text.percent ?? 0) + "%";
      const value4 = Date.parse(updatedAt?.updatedAt || updatedAt?.last_updated || "");
      if (Number.isFinite(value4)) {
        value8 = Math.max(value8, value4);
      }
    }
    hidden.hidden = push.length > 0;
    hidden.textContent = visibleMetrics ? "未选择显示内容" : "请在“配置设备”中选择 NAS 数据来源。";
    textContent2.textContent = "状态更新于 " + (value8 ? new Date(value8).toLocaleTimeString("zh-CN", {
      hour12: false
    }) : "—");
  }
  return {
    root: append3,
    update,
    dispose() {
      append3.remove();
    }
  };
}
