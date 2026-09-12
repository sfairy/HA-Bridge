export function floorNavigationChoices(floors, overrides = {}) {
  const parseChineseNumber = text => {
    if (/^\d+$/.test(text)) {
      return Number(text);
    }
    const digits = {
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
    if (text.includes("十")) {
      const [tensPart, onesPart] = text.split("十");
      return (digits[tensPart] || 1) * 10 + (digits[onesPart] || 0);
    }
    return digits[text] || 0;
  };
  const ranked = [...floors].sort((a, b) => (Number(a.elevation) || 0) - (Number(b.elevation) || 0)).map(floor => {
    const name = String(floor.name || "").trim();
    const basementMatch = name.match(/^(?:B|地下|负|[-−])\s*([0-9一二两三四五六七八九十]+)(?:F|楼|层)?$/i);
    const floorMatch = name.match(/^([0-9一二两三四五六七八九十]+)(?:F|楼|层)$/i);
    return {
      floor,
      basement: !!basementMatch || !floorMatch && Number(floor.elevation) < 0,
      explicit: parseChineseNumber((basementMatch || floorMatch)?.[1] || "")
    };
  });
  let remainingBasementIndex = ranked.filter(entry => entry.basement).length;
  let nextFloorIndex = 0;
  return [...ranked.map(({
    floor,
    basement,
    explicit
  }) => {
    const sequentialLevel = basement ? remainingBasementIndex-- : ++nextFloorIndex;
    const override = overrides[floor.id];
    if (Number.isInteger(override) && override !== 0 && Math.abs(override) <= 99) {
      return [floor.id, override < 0 ? "B" + -override : override + "F", floor.name || "未命名楼层"];
    } else {
      return [floor.id, basement ? "B" + (explicit || sequentialLevel) : (explicit || sequentialLevel) + "F", floor.name || "未命名楼层"];
    }
  }).reverse(), ...(floors.length > 1 ? [["all", "ALL", "全部楼层"]] : [])];
}
