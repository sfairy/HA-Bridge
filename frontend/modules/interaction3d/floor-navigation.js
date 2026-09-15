export function floorNavigationChoices(floors, floorNumbers = {}) {
  const parseFloorNumber = floorNameText => {
    if (/^\d+$/.test(floorNameText)) {
      return Number(floorNameText);
    }
    const CHINESE_DIGITS = {
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
    if (floorNameText.includes("十")) {
      const [tensCharacter, onesCharacter] = floorNameText.split("十");
      return (CHINESE_DIGITS[tensCharacter] || 1) * 10 + (CHINESE_DIGITS[onesCharacter] || 0);
    }
    return CHINESE_DIGITS[floorNameText] || 0;
  };
  const floorEntries = [...floors]
    .sort(
      (firstEntry, secondEntry) =>
        (Number(firstEntry.elevation) || 0) - (Number(secondEntry.elevation) || 0)
    )
    .map(floor => {
      const rawName = String(floor.name || "").trim();
      const basementMatch = rawName.match(
        /^(?:B|地下|负|[-−])\s*([0-9一二两三四五六七八九十]+)(?:F|楼|层)?$/i
      );
      const numberedMatch = rawName.match(/^([0-9一二两三四五六七八九十]+)(?:F|楼|层)$/i);
      return {
        floor: floor,
        basement: !!basementMatch || (!numberedMatch && Number(floor.elevation) < 0),
        explicit: parseFloorNumber((basementMatch || numberedMatch)?.[1] || "")
      };
    });
  let remainingBasementCount = floorEntries.filter(entry => entry.basement).length;
  let nextFloorNumber = 0;
  return [
    ...floorEntries
      .map(({ floor: floorEntry, basement: isBasement, explicit: explicitNumber }) => {
        const assignedNumber = isBasement ? remainingBasementCount-- : ++nextFloorNumber;
        const overrideNumber = floorNumbers[floorEntry.id];
        if (
          Number.isInteger(overrideNumber) &&
          overrideNumber !== 0 &&
          Math.abs(overrideNumber) <= 99
        ) {
          return [
            floorEntry.id,
            overrideNumber < 0 ? "B" + -overrideNumber : overrideNumber + "F",
            floorEntry.name || "未命名楼层"
          ];
        } else {
          return [
            floorEntry.id,
            isBasement
              ? "B" + (explicitNumber || assignedNumber)
              : (explicitNumber || assignedNumber) + "F",
            floorEntry.name || "未命名楼层"
          ];
        }
      })
      .reverse(),
    ...(floors.length > 1 ? [["all", "ALL", "全部楼层"]] : [])
  ];
}
