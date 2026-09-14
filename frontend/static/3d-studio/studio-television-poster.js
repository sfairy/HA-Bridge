export function drawTelevisionPoster(canvas, ctx) {
  ctx.save();
  ctx.scale(canvas.width / 960, canvas.height / 540);
  ctx.fillStyle = '#07111d';
  ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = '#0f2031';
  ctx.fillRect(0, 0, 510, 540);
  ctx.fillStyle = '#ff9f36';
  ctx.fillRect(54, 54, 12, 54);
  ctx.fillStyle = '#f4f8fb';
  ctx.font = '700 42px Arial, sans-serif';
  ctx.fillText('HA BRIDGE', 88, 92);
  ctx.fillStyle = '#7f93a6';
  ctx.font = '600 15px Arial, sans-serif';
  ctx.fillText('SMART HOME, SIMPLY CONNECTED', 88, 119);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 48px sans-serif';
  ctx.fillText('让全屋设备', 54, 224);
  ctx.fillText('自然协作', 54, 286);
  ctx.fillStyle = '#9cafbf';
  ctx.font = '400 20px sans-serif';
  ctx.fillText('一张图，连接灯光、环境与家庭场景', 56, 331);
  [
    { label: 'LIGHT', color: '#ff9f36' },
    { label: 'CLIMATE', color: '#32c59b' },
    { label: 'SECURITY', color: '#5c9dff' }
  ].forEach((chip, index) => {
    const x = 54 + index * 142;
    ctx.fillStyle = '#172d40';
    ctx.beginPath();
    ctx.roundRect(x, 398, 126, 54, 8);
    ctx.fill();
    ctx.fillStyle = chip.color;
    ctx.fillRect(x + 14, 414, 8, 22);
    ctx.fillStyle = '#dbe5ed';
    ctx.font = '700 13px Arial, sans-serif';
    ctx.fillText(chip.label, x + 32, 432);
  });
  ctx.fillStyle = '#0a1624';
  ctx.fillRect(510, 0, 450, 540);
  ctx.fillStyle = '#15283a';
  ctx.beginPath();
  ctx.roundRect(552, 44, 366, 164, 12);
  ctx.fill();
  ctx.fillStyle = '#8295a6';
  ctx.font = '600 14px Arial, sans-serif';
  ctx.fillText('HOME STATUS', 578, 76);
  ctx.fillStyle = '#f5f8fb';
  ctx.font = '700 58px Arial, sans-serif';
  ctx.fillText('24°', 578, 148);
  ctx.fillStyle = '#32c59b';
  ctx.beginPath();
  ctx.arc(856, 118, 31, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#07111d';
  ctx.font = '700 17px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ON', 856, 124);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#91a4b5';
  ctx.font = '400 15px Arial, sans-serif';
  ctx.fillText('COMFORT MODE · ALL SYSTEMS READY', 578, 181);
  const cards = [
    { x: 552, y: 230, color: '#ff9f36', value: '8', label: 'LIGHTS' },
    { x: 742, y: 230, color: '#5c9dff', value: '4', label: 'ROOMS' },
    { x: 552, y: 360, color: '#32c59b', value: '92%', label: 'AIR' },
    { x: 742, y: 360, color: '#ef6580', value: 'SAFE', label: 'HOME' }
  ];
  for (const card of cards) {
    ctx.fillStyle = '#15283a';
    ctx.beginPath();
    ctx.roundRect(card.x, card.y, 176, 108, 10);
    ctx.fill();
    ctx.fillStyle = card.color;
    ctx.fillRect(card.x + 18, card.y + 18, 30, 5);
    ctx.fillStyle = '#f4f8fb';
    ctx.font = '700 29px Arial, sans-serif';
    ctx.fillText(card.value, card.x + 18, card.y + 66);
    ctx.fillStyle = '#8295a6';
    ctx.font = '600 12px Arial, sans-serif';
    ctx.fillText(card.label, card.x + 18, card.y + 89);
  }
  ctx.restore();
}
