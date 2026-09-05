export function formatLocalTime(component, now = new Date()) {
  const showSeconds = component.showSeconds === true;
  const hour12 = component.hour12 === true;
  let hours = now.getHours();
  let suffix = "";
  if (hour12) {
    suffix = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours ||= 12;
  }
  const parts = [
    String(hours).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ];
  if (showSeconds) {
    parts.push(String(now.getSeconds()).padStart(2, "0"));
  }
  return {
    value: parts.join(":"),
    suffix,
  };
}
export function formatLocalDate(component, now = new Date()) {
  const date =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");
  if (component.showWeekday === false) {
    return date;
  } else {
    return date + " 星期" + "日一二三四五六"[now.getDay()];
  }
}
export function formatLunarDate(now = new Date()) {
  try {
    const formatted = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
      month: "long",
      day: "numeric",
    })
      .format(now)
      .replace(/\s+/g, "");
    if (formatted) {
      return "农历" + formatted.replace(/^农历/, "");
    } else {
      return "";
    }
  } catch {
    return "";
  }
}
