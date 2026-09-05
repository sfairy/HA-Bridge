const statusText = document.querySelector("#issued-status");
const body = document.querySelector("#issued-body");
const meta = document.querySelector("#issued-meta");
const codeNode = document.querySelector("#issued-code");
const copy = document.querySelector("#copy-code");
const message = document.querySelector("#message");
const orderId = window.location.pathname.split("/").filter(Boolean).at(-1) || "";

function errorMessage(payload, fallback) {
  if (typeof payload?.detail == "string") {
    return payload.detail;
  }
  return fallback;
}

async function loadOrder() {
  const response = await fetch(`/api/v1/store/orders/${orderId}`, {
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(errorMessage(payload, "无法读取激活码。"));
  }
  statusText.textContent = `${payload.productName}已登记。`;
  meta.textContent = `授权邮箱 ${payload.email}`;
  codeNode.textContent = payload.activationCode;
  copy.dataset.code = payload.activationCode;
  body.hidden = false;
}

copy.addEventListener("click", async () => {
  const value = copy.dataset.code || "";
  if (!value) {
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    copy.textContent = "已复制";
  } catch {
    copy.textContent = "复制失败";
  }
  window.setTimeout(() => {
    copy.textContent = "复制激活码";
  }, 1600);
});

loadOrder().catch((error) => {
  statusText.textContent = "无法读取该订单。";
  message.textContent = error.message;
  message.hidden = false;
});
