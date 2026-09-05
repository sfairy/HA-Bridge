export function drawTrackedText(value, value2, value3, value4, value5, value6) {
  const value7 = [...String(value2 || "")];
  if (!value7.length) {
    return 0;
  }
  const value8 = value7.map((value12) => value.measureText(value12).width);
  const value9 =
    value8.reduce((value12, value13) => value12 + value13, 0) +
    Math.max(value7.length - 1, 0) * value5;
  const value10 = value9 > 0 ? Math.min(1, value6 / value9) : 1;
  value.save();
  value.translate(value3, value4);
  value.scale(value10, 1);
  value.textAlign = "left";
  value.textBaseline = "middle";
  let value11 = 0;
  value7.forEach((value12, value13) => {
    value.fillText(value12, value11, 0);
    value11 += value8[value13] + (value13 < value7.length - 1 ? value5 : 0);
  });
  value.restore();
  return value9 * value10;
}
export function createPlanDrawingTools({
  context: planDrawingTools,
  planToScreen: planDrawingTools2,
  screenToPlan: planDrawingTools3,
  pixelsPerMeter: planDrawingTools4,
  getCanvasSize: planDrawingTools5,
  getViewZoom: planDrawingTools6,
}) {
  function drawMetricGrid() {
    const value3 = planDrawingTools4();
    if (!value3) {
      return;
    }
    const { width: value4, height: value5 } = planDrawingTools5();
    const value6 = planDrawingTools6();
    let value7 = value3 * 0.5;
    while (value7 * value6 < 18) {
      value7 *= 2;
    }
    while (value7 * value6 > 100) {
      value7 /= 2;
    }
    const value8 = [
      {
        x: 0,
        y: 0,
      },
      {
        x: value4,
        y: 0,
      },
      {
        x: value4,
        y: value5,
      },
      {
        x: 0,
        y: value5,
      },
    ].map(planDrawingTools3);
    const value9 = Math.min(...value8.map((value11) => value11.x));
    const count = Math.max(...value8.map((value11) => value11.x));
    const value10 = Math.min(...value8.map((value11) => value11.y));
    const count2 = Math.max(...value8.map((value11) => value11.y));
    planDrawingTools.save();
    planDrawingTools.lineWidth = 1;
    for (
      let value11 = Math.floor(value9 / value7) * value7;
      value11 <= count;
      value11 += value7
    ) {
      const value12 = planDrawingTools2({
        x: value11,
        y: value10,
      });
      const value13 = planDrawingTools2({
        x: value11,
        y: count2,
      });
      const rounded = Math.round((value11 / value3) * 2);
      planDrawingTools.strokeStyle =
        rounded % 2 === 0
          ? "rgba(91, 119, 139, .13)"
          : "rgba(91, 119, 139, .065)";
      planDrawingTools.beginPath();
      planDrawingTools.moveTo(value12.x, value12.y);
      planDrawingTools.lineTo(value13.x, value13.y);
      planDrawingTools.stroke();
    }
    for (
      let value11 = Math.floor(value10 / value7) * value7;
      value11 <= count2;
      value11 += value7
    ) {
      const value12 = planDrawingTools2({
        x: value9,
        y: value11,
      });
      const value13 = planDrawingTools2({
        x: count,
        y: value11,
      });
      const rounded = Math.round((value11 / value3) * 2);
      planDrawingTools.strokeStyle =
        rounded % 2 === 0
          ? "rgba(91, 119, 139, .13)"
          : "rgba(91, 119, 139, .065)";
      planDrawingTools.beginPath();
      planDrawingTools.moveTo(value12.x, value12.y);
      planDrawingTools.lineTo(value13.x, value13.y);
      planDrawingTools.stroke();
    }
    planDrawingTools.restore();
  }
  function drawLine(value3, value4, value5 = {}) {
    const value6 = planDrawingTools2(value3);
    const value7 = planDrawingTools2(value4);
    planDrawingTools.save();
    planDrawingTools.strokeStyle = value5.color || "#fff";
    planDrawingTools.lineWidth = value5.width || 1;
    planDrawingTools.lineCap = value5.cap || "round";
    if (value5.dash) {
      planDrawingTools.setLineDash(value5.dash);
    }
    planDrawingTools.beginPath();
    planDrawingTools.moveTo(value6.x, value6.y);
    planDrawingTools.lineTo(value7.x, value7.y);
    planDrawingTools.stroke();
    planDrawingTools.restore();
  }
  function drawPoint(value3, value4, value5 = 4) {
    const value6 = planDrawingTools2(value3);
    planDrawingTools.save();
    planDrawingTools.fillStyle = "#0e151b";
    planDrawingTools.strokeStyle = value4;
    planDrawingTools.lineWidth = 2;
    planDrawingTools.beginPath();
    planDrawingTools.arc(value6.x, value6.y, value5, 0, Math.PI * 2);
    planDrawingTools.fill();
    planDrawingTools.stroke();
    planDrawingTools.restore();
  }
  function drawOpenEndpointWarning(value3) {
    const value4 = planDrawingTools2(value3);
    planDrawingTools.save();
    planDrawingTools.globalAlpha = 1;
    planDrawingTools.shadowColor = "rgba(255, 84, 76, .75)";
    planDrawingTools.shadowBlur = 12;
    planDrawingTools.fillStyle = "rgba(255, 84, 76, .18)";
    planDrawingTools.strokeStyle = "#ff6258";
    planDrawingTools.lineWidth = 2.5;
    planDrawingTools.beginPath();
    planDrawingTools.arc(value4.x, value4.y, 9, 0, Math.PI * 2);
    planDrawingTools.fill();
    planDrawingTools.stroke();
    planDrawingTools.shadowBlur = 0;
    planDrawingTools.fillStyle = "#ff6258";
    planDrawingTools.beginPath();
    planDrawingTools.arc(value4.x, value4.y, 3.2, 0, Math.PI * 2);
    planDrawingTools.fill();
    planDrawingTools.restore();
  }
  function drawFloatingLabel(value3, value4, value5 = "#dce3e8") {
    if (!value4) {
      return;
    }
    const value6 = planDrawingTools2(value3);
    planDrawingTools.save();
    planDrawingTools.font = "600 10px ui-monospace, monospace";
    planDrawingTools.textAlign = "center";
    planDrawingTools.textBaseline = "middle";
    const value7 = planDrawingTools.measureText(value4).width + 12;
    planDrawingTools.fillStyle = "rgba(8, 13, 18, .88)";
    planDrawingTools.strokeStyle = "rgba(255, 255, 255, .11)";
    planDrawingTools.lineWidth = 1;
    planDrawingTools.beginPath();
    planDrawingTools.roundRect(
      value6.x - value7 / 2,
      value6.y - 25,
      value7,
      18,
      5,
    );
    planDrawingTools.fill();
    planDrawingTools.stroke();
    planDrawingTools.fillStyle = value5;
    planDrawingTools.fillText(value4, value6.x, value6.y - 16);
    planDrawingTools.restore();
  }
  return {
    drawMetricGrid: drawMetricGrid,
    drawLine: drawLine,
    drawPoint: drawPoint,
    drawOpenEndpointWarning: drawOpenEndpointWarning,
    drawFloatingLabel: drawFloatingLabel,
  };
}
