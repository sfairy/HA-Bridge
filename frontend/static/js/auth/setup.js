const form = document.querySelector("#setup-form");
const message = document.querySelector("#message");
const submit = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "";
  message.hidden = true;
  const data = new FormData(form);
  const password = String(data.get("password") || "");
  const passwordConfirmation = String(data.get("passwordConfirmation") || "");
  if (password !== passwordConfirmation) {
    message.textContent = "两次输入的密码不一致。";
    message.hidden = false;
    return;
  }
  submit.disabled = true;
  try {
    const response = await fetch("/api/v1/setup/admin", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        username: String(data.get("username") || ""),
        password,
        passwordConfirmation
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail?.[0]?.msg || payload.detail || "初始化失败。");
    }
    window.location.assign("/");
  } catch (error) {
    message.textContent = error.message;
    message.hidden = false;
    submit.disabled = false;
  }
});
