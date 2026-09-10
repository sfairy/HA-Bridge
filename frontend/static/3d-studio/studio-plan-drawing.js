export function drawTrackedText(context, text, x, y, letterSpacing, maxWidth) {
  const characters = [...String(text || "")];
  if (!characters.length) {
    return 0;
  }
  const widths = characters.map(character => context.measureText(character).width);
  const naturalWidth = widths.reduce((sum, width) => sum + width, 0) + Math.max(characters.length - 1, 0) * letterSpacing;
  const scale = naturalWidth > 0 ? Math.min(1, maxWidth / naturalWidth) : 1;
  context.save();
  context.translate(x, y);
  context.scale(scale, 1);
  context.textAlign = "left";
  context.textBaseline = "middle";
  let cursorX = 0;
  characters.forEach((character, index) => {
    context.fillText(character, cursorX, 0);
    cursorX += widths[index] + (index < characters.length - 1 ? letterSpacing : 0);
  });
  context.restore();
  return naturalWidth * scale;
}
export function createPlanDrawingTools({
  context,
  planToScreen,
  screenToPlan,
  pixelsPerMeter,
  getCanvasSize,
  getViewZoom
}) {
  function drawMetricGrid() {
    const ppm = pixelsPerMeter();
    if (!ppm) {
      return;
    }
    const {
      width,
      height
    } = getCanvasSize();
    const zoom = getViewZoom();
    let step = ppm * 0.5;
    while (step * zoom < 18) {
      step *= 2;
    }
    while (step * zoom > 100) {
      step /= 2;
    }
    const corners = [{
      x: 0,
      y: 0
    }, {
      x: width,
      y: 0
    }, {
      x: width,
      y: height
    }, {
      x: 0,
      y: height
    }].map(screenToPlan);
    const minX = Math.min(...corners.map(point => point.x));
    const maxX = Math.max(...corners.map(point => point.x));
    const minY = Math.min(...corners.map(point => point.y));
    const maxY = Math.max(...corners.map(point => point.y));
    context.save();
    context.lineWidth = 1;
    for (let gridX = Math.floor(minX / step) * step; gridX <= maxX; gridX += step) {
      const start = planToScreen({
        x: gridX,
        y: minY
      });
      const end = planToScreen({
        x: gridX,
        y: maxY
      });
      const halfMeterIndex = Math.round(gridX / ppm * 2);
      context.strokeStyle = halfMeterIndex % 2 === 0 ? "rgba(91, 119, 139, .13)" : "rgba(91, 119, 139, .065)";
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
    for (let gridY = Math.floor(minY / step) * step; gridY <= maxY; gridY += step) {
      const start = planToScreen({
        x: minX,
        y: gridY
      });
      const end = planToScreen({
        x: maxX,
        y: gridY
      });
      const halfMeterIndex = Math.round(gridY / ppm * 2);
      context.strokeStyle = halfMeterIndex % 2 === 0 ? "rgba(91, 119, 139, .13)" : "rgba(91, 119, 139, .065)";
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
    context.restore();
  }
  function drawLine(from, to, options = {}) {
    const start = planToScreen(from);
    const end = planToScreen(to);
    context.save();
    context.strokeStyle = options.color || "#fff";
    context.lineWidth = options.width || 1;
    context.lineCap = options.cap || "round";
    if (options.dash) {
      context.setLineDash(options.dash);
    }
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    context.restore();
  }
  function drawPoint(point, color, radius = 4) {
    const screen = planToScreen(point);
    context.save();
    context.fillStyle = "#0e151b";
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }
  function drawOpenEndpointWarning(point) {
    const screen = planToScreen(point);
    context.save();
    context.globalAlpha = 1;
    context.shadowColor = "rgba(255, 84, 76, .75)";
    context.shadowBlur = 12;
    context.fillStyle = "rgba(255, 84, 76, .18)";
    context.strokeStyle = "#ff6258";
    context.lineWidth = 2.5;
    context.beginPath();
    context.arc(screen.x, screen.y, 9, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.shadowBlur = 0;
    context.fillStyle = "#ff6258";
    context.beginPath();
    context.arc(screen.x, screen.y, 3.2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  function drawFloatingLabel(point, text, color = "#dce3e8") {
    if (!text) {
      return;
    }
    const screen = planToScreen(point);
    context.save();
    context.font = "600 10px ui-monospace, monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    const labelWidth = context.measureText(text).width + 12;
    context.fillStyle = "rgba(8, 13, 18, .88)";
    context.strokeStyle = "rgba(255, 255, 255, .11)";
    context.lineWidth = 1;
    context.beginPath();
    context.roundRect(screen.x - labelWidth / 2, screen.y - 25, labelWidth, 18, 5);
    context.fill();
    context.stroke();
    context.fillStyle = color;
    context.fillText(text, screen.x, screen.y - 16);
    context.restore();
  }
  return {
    drawMetricGrid,
    drawLine,
    drawPoint,
    drawOpenEndpointWarning,
    drawFloatingLabel
  };
}
