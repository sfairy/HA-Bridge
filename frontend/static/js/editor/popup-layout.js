const MIN_COLUMNS = 2;
const MAX_COLUMNS = 4;
const DEFAULT_COLUMNS = 3;
const MODULE_WIDTH = 420;
const MODULE_HEIGHT = 470;
const MODULE_GAP = 14;
const GRID_PADDING = 28;
const POPUP_CHROME = 88;
export function popupLayoutColumns(popup) {
  const columns = Number(popup?.columns);
  if (columns >= MIN_COLUMNS && columns <= MAX_COLUMNS) {
    return columns;
  } else {
    return DEFAULT_COLUMNS;
  }
}
export function popupModuleColumnSpan(component) {
  const type = typeof component == "string" ? component : component?.type;
  const deviceType =
    typeof component == "object"
      ? component?.deviceType || component?.properties?.deviceType
      : "";
  if (
    type === "electric-bed" ||
    deviceType === "electric-bed" ||
    [
      "climate",
      "air-purifier",
      "water-heater",
      "media-player",
      "camera",
      "line-chart",
    ].includes(type)
  ) {
    return 2;
  } else {
    return 1;
  }
}
export function popupModuleRowSpan(component) {
  return 1;
}
function packModulePlacements(modules, columns) {
  const placements = [];
  const occupied = [];
  for (const module of modules || []) {
    const width = popupModuleColumnSpan(module);
    const height = popupModuleRowSpan(module);
    if (width > columns) {
      return null;
    }
    let placement = null;
    const maxRows = Math.max(4, (modules?.length || 0) * 2 + 1);
    for (let row = 0; row < maxRows && !placement; row += 1) {
      for (let column = 0; column <= columns - width; column += 1) {
        const fits = Array.from({ length: height }, (_, rowOffset) =>
          Array.from(
            { length: width },
            (_, columnOffset) =>
              !occupied[row + rowOffset]?.[column + columnOffset],
          ).every(Boolean),
        ).every(Boolean);
        if (!fits) {
          continue;
        }
        placement = {
          x: column,
          y: row,
          width,
          height,
        };
        for (let rowOffset = 0; rowOffset < height; rowOffset += 1) {
          occupied[row + rowOffset] ||= [];
          for (let columnOffset = 0; columnOffset < width; columnOffset += 1) {
            occupied[row + rowOffset][column + columnOffset] = true;
          }
        }
        break;
      }
    }
    if (!placement) {
      return null;
    }
    placements.push(placement);
  }
  return placements;
}
export function packPopupModules(modules, popup) {
  const columns = popupLayoutColumns(popup);
  const placements = packModulePlacements(modules, columns) || [];
  const usedRows = Math.max(
    1,
    placements.reduce(
      (maxRow, placement) => Math.max(maxRow, placement.y + placement.height),
      0,
    ),
  );
  return {
    rows: Math.min(usedRows, 3),
    columns,
    placements,
    fits: usedRows <= 3,
  };
}
export function popupLayoutMetrics(modules, popup) {
  const packed = packPopupModules(modules, popup);
  const gridWidth =
    GRID_PADDING * 2 +
    packed.columns * MODULE_WIDTH +
    (packed.columns - 1) * MODULE_GAP;
  const gridHeight =
    GRID_PADDING * 2 +
    packed.rows * MODULE_HEIGHT +
    (packed.rows - 1) * MODULE_GAP;
  return {
    ...packed,
    gridWidth,
    gridHeight,
    popupWidth: gridWidth,
    popupHeight: POPUP_CHROME + gridHeight,
  };
}
