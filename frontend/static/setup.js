const form = document.querySelector("#setup-form"),
  message = document.querySelector("#message"),
  submit = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async submitEvent => {
  (submitEvent.preventDefault(), (message.textContent = ""), (message.hidden = !0));
  const formData = new FormData(form),
    password = String(formData.get("password") || ""),
    passwordConfirmation = String(formData.get("passwordConfirmation") || "");
  if (password !== passwordConfirmation) {
    ((message.textContent = "\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4\u3002"),
      (message.hidden = !1));
    return;
  }
  submit.disabled = !0;
  try {
    const response = await fetch("/api/v1/setup/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: String(formData.get("username") || ""),
          password: password,
          passwordConfirmation: passwordConfirmation
        })
      }),
      payload = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(
        payload.detail?.[0]?.msg || payload.detail || "\u521D\u59CB\u5316\u5931\u8D25\u3002"
      );
    window.location.assign("/");
  } catch (caughtError) {
    ((message.textContent = caughtError.message), (message.hidden = !1), (submit.disabled = !1));
  }
});
