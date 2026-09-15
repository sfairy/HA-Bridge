export function drawTelevisionPoster(canvasSize, context) {
  context.save();
  context.scale(canvasSize.width / 960, canvasSize.height / 540);
  context.fillStyle = "#07111d";
  context.fillRect(0, 0, 960, 540);
  context.fillStyle = "#0f2031";
  context.fillRect(0, 0, 510, 540);
  context.fillStyle = "#ff9f36";
  context.fillRect(54, 54, 12, 54);
  context.fillStyle = "#f4f8fb";
  context.font = "700 42px Arial, sans-serif";
  context.fillText("HomeOS", 88, 92);
  context.fillStyle = "#7f93a6";
  context.font = "600 15px Arial, sans-serif";
  context.fillText("SMART HOME, SIMPLY CONNECTED", 88, 119);
  context.fillStyle = "#ffffff";
  context.font = "700 48px sans-serif";
  context.fillText("让全屋设备", 54, 224);
  context.fillText("自然协作", 54, 286);
  context.fillStyle = "#9cafbf";
  context.font = "400 20px sans-serif";
  context.fillText("一张图，连接灯光、环境与家庭场景", 56, 331);
  [
    {
      label: "LIGHT",
      color: "#ff9f36"
    },
    {
      label: "CLIMATE",
      color: "#32c59b"
    },
    {
      label: "SECURITY",
      color: "#5c9dff"
    }
  ].forEach((legendItem, legendIndex) => {
    const legendX = 54 + legendIndex * 142;
    context.fillStyle = "#172d40";
    context.beginPath();
    context.roundRect(legendX, 398, 126, 54, 8);
    context.fill();
    context.fillStyle = legendItem.color;
    context.fillRect(legendX + 14, 414, 8, 22);
    context.fillStyle = "#dbe5ed";
    context.font = "700 13px Arial, sans-serif";
    context.fillText(legendItem.label, legendX + 32, 432);
  });
  context.fillStyle = "#0a1624";
  context.fillRect(510, 0, 450, 540);
  context.fillStyle = "#15283a";
  context.beginPath();
  context.roundRect(552, 44, 366, 164, 12);
  context.fill();
  context.fillStyle = "#8295a6";
  context.font = "600 14px Arial, sans-serif";
  context.fillText("HOME STATUS", 578, 76);
  context.fillStyle = "#f5f8fb";
  context.font = "700 58px Arial, sans-serif";
  context.fillText("24°", 578, 148);
  context.fillStyle = "#32c59b";
  context.beginPath();
  context.arc(856, 118, 31, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#07111d";
  context.font = "700 17px Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("ON", 856, 124);
  context.textAlign = "left";
  context.fillStyle = "#91a4b5";
  context.font = "400 15px Arial, sans-serif";
  context.fillText("COMFORT MODE · ALL SYSTEMS READY", 578, 181);
  const statusCards = [
    {
      x: 552,
      y: 230,
      color: "#ff9f36",
      value: "8",
      label: "LIGHTS"
    },
    {
      x: 742,
      y: 230,
      color: "#5c9dff",
      value: "4",
      label: "ROOMS"
    },
    {
      x: 552,
      y: 360,
      color: "#32c59b",
      value: "92%",
      label: "AIR"
    },
    {
      x: 742,
      y: 360,
      color: "#ef6580",
      value: "SAFE",
      label: "HOME"
    }
  ];
  for (const card of statusCards) {
    context.fillStyle = "#15283a";
    context.beginPath();
    context.roundRect(card.x, card.y, 176, 108, 10);
    context.fill();
    context.fillStyle = card.color;
    context.fillRect(card.x + 18, card.y + 18, 30, 5);
    context.fillStyle = "#f4f8fb";
    context.font = "700 29px Arial, sans-serif";
    context.fillText(card.value, card.x + 18, card.y + 66);
    context.fillStyle = "#8295a6";
    context.font = "600 12px Arial, sans-serif";
    context.fillText(card.label, card.x + 18, card.y + 89);
  }
  context.restore();
}
