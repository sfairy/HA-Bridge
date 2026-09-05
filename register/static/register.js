const form = document.querySelector("#register-form");
const message = document.querySelector("#message");
const submit = form.querySelector('button[type="submit"]');

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
  submit.disabled = true;
  try {
    const data = new FormData(form);
    const response = await fetch("/api/v1/store/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: String(data.get("email") || "").trim(),
        contactName: String(data.get("contactName") || "").trim(),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(errorMessage(payload, "注册失败。"));
    }
    window.location.assign(`/issued/${payload.id}`);
  } catch (error) {
    message.textContent = error.message;
    message.hidden = false;
    submit.disabled = false;
  }
});
