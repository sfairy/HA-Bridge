const MIN_POPUP_COLUMNS = 2;
const MAX_POPUP_COLUMNS = 4;
const DEFAULT_POPUP_COLUMNS = 3;
const POPUP_COLUMN_WIDTH_PX = 420;
const POPUP_ROW_HEIGHT_PX = 470;
const POPUP_GRID_GAP_PX = 14;
const POPUP_CELL_PADDING_PX = 28;
const POPUP_HEADER_HEIGHT_PX = 88;
export function popupLayoutColumns(options) {
  const columns = Number(options?.columns);
  if (columns >= 2 && columns <= 4) {
    return columns;
  } else {
    return 3;
  }
}
export function popupModuleColumnSpan(moduleSpec) {
  const type = typeof moduleSpec == "string" ? moduleSpec : moduleSpec?.type;
  const deviceType =
    typeof moduleSpec == "object"
      ? moduleSpec?.deviceType || moduleSpec?.properties?.deviceType
      : "";
  if (
    type === "electric-bed" ||
    deviceType === "electric-bed" ||
    ["climate", "air-purifier", "water-heater", "media-player", "camera", "line-chart"].includes(
      type
    )
  ) {
    return 2;
  } else {
    return 1;
  }
}
export function popupModuleRowSpan(rowModuleSpec) {
  const moduleType = typeof rowModuleSpec == "string" ? rowModuleSpec : rowModuleSpec?.type;
  const resolvedDeviceType =
    typeof rowModuleSpec == "object"
      ? rowModuleSpec?.deviceType || rowModuleSpec?.properties?.deviceType
      : "";
  return 1;
}
function placeModules(modules, columnLimit) {
  const placements = [];
  const occupied = [];
  for (const module of modules || []) {
    const columnSpan = popupModuleColumnSpan(module);
    const rowSpan = popupModuleRowSpan(module);
    if (columnSpan > columnLimit) {
      return null;
    }
    let placement = null;
    const maxRows = Math.max(4, (modules?.length || 0) * 2 + 1);
    for (let row = 0; row < maxRows && !placement; row += 1) {
      for (let column = 0; column <= columnLimit - columnSpan; column += 1) {
        if (
          Array.from(
            {
              length: rowSpan
            },
            (unusedRowIndex, rowOffset) =>
              Array.from(
                {
                  length: columnSpan
                },
                (unusedColumnIndex, columnOffset) =>
                  !occupied[row + rowOffset]?.[column + columnOffset]
              ).every(Boolean)
          ).every(Boolean)
        ) {
          placement = {
            x: column,
            y: row,
            width: columnSpan,
            height: rowSpan
          };
          for (let rowIndex = 0; rowIndex < rowSpan; rowIndex += 1) {
            occupied[row + rowIndex] ||= [];
            for (let columnIndex = 0; columnIndex < columnSpan; columnIndex += 1) {
              occupied[row + rowIndex][column + columnIndex] = true;
            }
          }
          break;
        }
      }
    }
    if (!placement) {
      return null;
    }
    placements.push(placement);
  }
  return placements;
}
export function packPopupModules(moduleList, columnTotal) {
  const columnCount = popupLayoutColumns(columnTotal);
  const packedPlacements = placeModules(moduleList, columnCount) || [];
  const rowCount = Math.max(
    1,
    packedPlacements.reduce(
      (maxRow, packedPlacement) => Math.max(maxRow, packedPlacement.y + packedPlacement.height),
      0
    )
  );
  return {
    rows: Math.min(rowCount, 3),
    columns: columnCount,
    placements: packedPlacements,
    fits: rowCount <= 3
  };
}
export function popupLayoutMetrics(moduleSpecs, layoutOptions) {
  const layout = packPopupModules(moduleSpecs, layoutOptions);
  const gridWidth = 56 + layout.columns * 420 + (layout.columns - 1) * 14;
  const gridHeight = 56 + layout.rows * 470 + (layout.rows - 1) * 14;
  return {
    ...layout,
    gridWidth: gridWidth,
    gridHeight: gridHeight,
    popupWidth: gridWidth,
    popupHeight: 88 + gridHeight
  };
}
