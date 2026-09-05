const form = document.querySelector("#lookup-form");
const message = document.querySelector("#message");
const submit = form.querySelector('button[type="submit"]');
const emptyNote = document.querySelector("#empty-note");
const list = document.querySelector("#order-list");

function errorMessage(payload, fallback) {
  if (typeof payload?.detail == "string") {
    return payload.detail;
  }
  if (typeof payload?.detail?.[0]?.msg == "string") {
    return payload.detail[0].msg;
  }
  return fallback;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.hidden = true;
  emptyNote.hidden = true;
  list.hidden = true;
  list.replaceChildren();
  submit.disabled = true;
  try {
    const email = String(new FormData(form).get("email") || "").trim();
    const response = await fetch(
      `/api/v1/store/orders?email=${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(errorMessage(payload, "查询失败。"));
    }
    if (!payload.orders?.length) {
      emptyNote.textContent = "这个邮箱还没有激活码。";
      emptyNote.hidden = false;
      return;
    }
    for (const order of payload.orders) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `/issued/${order.id}`;
      link.textContent = order.activationCode;
      const stamp = document.createElement("span");
      stamp.textContent = `${order.productName} · ${order.createdAt}`;
      item.append(link, stamp);
      list.append(item);
    }
    list.hidden = false;
  } catch (error) {
    message.textContent = error.message;
    message.hidden = false;
  } finally {
    submit.disabled = false;
  }
});
