export function formatLocalTime(options, date = new Date()) {
  const isSecondsVisible = options.showSeconds === true;
  const isHour12 = options.hour12 === true;
  let hour = date.getHours();
  let periodSuffix = "";
  if (isHour12) {
    periodSuffix = hour >= 12 ? "PM" : "AM";
    hour %= 12;
    hour ||= 12;
  }
  const timeParts = [String(hour).padStart(2, "0"), String(date.getMinutes()).padStart(2, "0")];
  if (isSecondsVisible) {
    timeParts.push(String(date.getSeconds()).padStart(2, "0"));
  }
  return {
    value: timeParts.join(":"),
    suffix: periodSuffix
  };
}
export function formatLocalDate(displayOptions, dateValue = new Date()) {
  const dateText =
    dateValue.getFullYear() +
    "-" +
    String(dateValue.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(dateValue.getDate()).padStart(2, "0");
  if (displayOptions.showWeekday === false) {
    return dateText;
  } else {
    return dateText + " 星期" + "日一二三四五六"[dateValue.getDay()];
  }
}
export function formatLunarDate(dateSource = new Date()) {
  try {
    const lunarText = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
      month: "long",
      day: "numeric"
    })
      .format(dateSource)
      .replace(/\s+/g, "");
    if (lunarText) {
      return "农历" + lunarText.replace(/^农历/, "");
    } else {
      return "";
    }
  } catch {
    return "";
  }
}
