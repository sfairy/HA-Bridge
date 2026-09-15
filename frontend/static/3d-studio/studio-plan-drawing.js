export function drawTrackedText(textContext, text, originX, originY, trackingPx, maxWidthPx) {
  const characters = [...String(text || "")];
  if (!characters.length) {
    return 0;
  }
  const glyphWidths = characters.map(glyph => textContext.measureText(glyph).width);
  const totalWidth =
    glyphWidths.reduce((accumulatedWidth, glyphWidth) => accumulatedWidth + glyphWidth, 0) +
    Math.max(characters.length - 1, 0) * trackingPx;
  const widthScale = totalWidth > 0 ? Math.min(1, maxWidthPx / totalWidth) : 1;
  textContext.save();
  textContext.translate(originX, originY);
  textContext.scale(widthScale, 1);
  textContext.textAlign = "left";
  textContext.textBaseline = "middle";
  let cursorX = 0;
  characters.forEach((character, characterIndex) => {
    textContext.fillText(character, cursorX, 0);
    cursorX +=
      glyphWidths[characterIndex] + (characterIndex < characters.length - 1 ? trackingPx : 0);
  });
  textContext.restore();
  return totalWidth * widthScale;
}
export function createPlanDrawingTools({
  context: context,
  planToScreen: planToScreen,
  screenToPlan: screenToPlan,
  pixelsPerMeter: pixelsPerMeter,
  getCanvasSize: getCanvasSize,
  getViewZoom: getViewZoom
}) {
  function drawMetricGrid() {
    const meterScale = pixelsPerMeter();
    if (!meterScale) {
      return;
    }
    const { width: canvasWidth, height: canvasHeight } = getCanvasSize();
    const zoom = getViewZoom();
    let gridStep = meterScale * 0.5;
    while (gridStep * zoom < 18) {
      gridStep *= 2;
    }
    while (gridStep * zoom > 100) {
      gridStep /= 2;
    }
    const canvasCorners = [
      {
        x: 0,
        y: 0
      },
      {
        x: canvasWidth,
        y: 0
      },
      {
        x: canvasWidth,
        y: canvasHeight
      },
      {
        x: 0,
        y: canvasHeight
      }
    ].map(screenToPlan);
    const minPlanX = Math.min(...canvasCorners.map(cornerForMinX => cornerForMinX.x));
    const maxPlanX = Math.max(...canvasCorners.map(cornerForMaxX => cornerForMaxX.x));
    const minPlanY = Math.min(...canvasCorners.map(cornerForMinY => cornerForMinY.y));
    const maxPlanY = Math.max(...canvasCorners.map(cornerForMaxY => cornerForMaxY.y));
    context.save();
    context.lineWidth = 1;
    for (
      let gridX = Math.floor(minPlanX / gridStep) * gridStep;
      gridX <= maxPlanX;
      gridX += gridStep
    ) {
      const screenTop = planToScreen({
        x: gridX,
        y: minPlanY
      });
      const screenBottom = planToScreen({
        x: gridX,
        y: maxPlanY
      });
      const halfMeterIndexX = Math.round((gridX / meterScale) * 2);
      context.strokeStyle =
        halfMeterIndexX % 2 === 0 ? "rgba(91, 119, 139, .13)" : "rgba(91, 119, 139, .065)";
      context.beginPath();
      context.moveTo(screenTop.x, screenTop.y);
      context.lineTo(screenBottom.x, screenBottom.y);
      context.stroke();
    }
    for (
      let gridY = Math.floor(minPlanY / gridStep) * gridStep;
      gridY <= maxPlanY;
      gridY += gridStep
    ) {
      const screenLeft = planToScreen({
        x: minPlanX,
        y: gridY
      });
      const screenRight = planToScreen({
        x: maxPlanX,
        y: gridY
      });
      const halfMeterIndexY = Math.round((gridY / meterScale) * 2);
      context.strokeStyle =
        halfMeterIndexY % 2 === 0 ? "rgba(91, 119, 139, .13)" : "rgba(91, 119, 139, .065)";
      context.beginPath();
      context.moveTo(screenLeft.x, screenLeft.y);
      context.lineTo(screenRight.x, screenRight.y);
      context.stroke();
    }
    context.restore();
  }
  function drawLine(fromPlan, toPlan, lineOptions = {}) {
    const fromScreen = planToScreen(fromPlan);
    const toScreen = planToScreen(toPlan);
    context.save();
    context.strokeStyle = lineOptions.color || "#fff";
    context.lineWidth = lineOptions.width || 1;
    context.lineCap = lineOptions.cap || "round";
    if (lineOptions.dash) {
      context.setLineDash(lineOptions.dash);
    }
    context.beginPath();
    context.moveTo(fromScreen.x, fromScreen.y);
    context.lineTo(toScreen.x, toScreen.y);
    context.stroke();
    context.restore();
  }
  function drawPoint(planPoint, strokeColor, radiusPx = 4) {
    const screenPoint = planToScreen(planPoint);
    context.save();
    context.fillStyle = "#0e151b";
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(screenPoint.x, screenPoint.y, radiusPx, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }
  function drawOpenEndpointWarning(endpointPlan) {
    const endpointScreen = planToScreen(endpointPlan);
    context.save();
    context.globalAlpha = 1;
    context.shadowColor = "rgba(255, 84, 76, .75)";
    context.shadowBlur = 12;
    context.fillStyle = "rgba(255, 84, 76, .18)";
    context.strokeStyle = "#ff6258";
    context.lineWidth = 2.5;
    context.beginPath();
    context.arc(endpointScreen.x, endpointScreen.y, 9, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.shadowBlur = 0;
    context.fillStyle = "#ff6258";
    context.beginPath();
    context.arc(endpointScreen.x, endpointScreen.y, 3.2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  function drawFloatingLabel(anchorPlan, labelText, labelColor = "#dce3e8") {
    if (!labelText) {
      return;
    }
    const anchorScreen = planToScreen(anchorPlan);
    context.save();
    context.font = "600 10px ui-monospace, monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    const labelWidth = context.measureText(labelText).width + 12;
    context.fillStyle = "rgba(8, 13, 18, .88)";
    context.strokeStyle = "rgba(255, 255, 255, .11)";
    context.lineWidth = 1;
    context.beginPath();
    context.roundRect(anchorScreen.x - labelWidth / 2, anchorScreen.y - 25, labelWidth, 18, 5);
    context.fill();
    context.stroke();
    context.fillStyle = labelColor;
    context.fillText(labelText, anchorScreen.x, anchorScreen.y - 16);
    context.restore();
  }
  return {
    drawMetricGrid: drawMetricGrid,
    drawLine: drawLine,
    drawPoint: drawPoint,
    drawOpenEndpointWarning: drawOpenEndpointWarning,
    drawFloatingLabel: drawFloatingLabel
  };
}
