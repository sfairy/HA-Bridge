export function floorNavigationChoices(length, arg3 = {}) {
  const value8 = includes => {
    if (/^\d+$/.test(includes)) {
      return Number(includes);
    }
    const value7 = {
      一: 1,
      二: 2,
      两: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9
    };
    if (includes.includes("十")) {
      const [value, value2] = includes.split("十");
      return (value7[value] || 1) * 10 + (value7[value2] || 0);
    }
    return value7[includes] || 0;
  };
  const filter = [...length].sort((elevation, elevation2) => (Number(elevation.elevation) || 0) - (Number(elevation2.elevation) || 0)).map(name => {
    const match = String(name.name || "").trim();
    const value5 = match.match(/^(?:B|地下|负|[-−])\s*([0-9一二两三四五六七八九十]+)(?:F|楼|层)?$/i);
    const value6 = match.match(/^([0-9一二两三四五六七八九十]+)(?:F|楼|层)$/i);
    return {
      floor: name,
      basement: !!value5 || !value6 && Number(name.elevation) < 0,
      explicit: value8((value5 || value6)?.[1] || "")
    };
  });
  let value9 = filter.filter(basement => basement.basement).length;
  let value10 = 0;
  return [...(length.length > 1 ? [["all", "ALL", "全部楼层"]] : []), ...filter.map(({
    floor: id,
    basement: arg,
    explicit: arg2
  }) => {
    const value3 = arg ? value9-- : ++value10;
    const value4 = arg3[id.id];
    if (Number.isInteger(value4) && value4 !== 0 && Math.abs(value4) <= 99) {
      return [id.id, value4 < 0 ? "B" + -value4 : value4 + "F", id.name || "未命名楼层"];
    } else {
      return [id.id, arg ? "B" + (arg2 || value3) : (arg2 || value3) + "F", id.name || "未命名楼层"];
    }
  })];
}
