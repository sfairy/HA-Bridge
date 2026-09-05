const form = document.querySelector("#login-form");
const message = document.querySelector("#message");
const submit = form.querySelector('button[type="submit"]');
function loginDestination() {
  const next = new URLSearchParams(window.location.search).get("next") || "/";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.hidden = true;
  const data = new FormData(form);
  submit.disabled = true;
  try {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: String(data.get("username") || ""),
        password: String(data.get("password") || ""),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || "登录失败。");
    }
    window.location.assign(loginDestination());
  } catch (error) {
    message.textContent = error.message;
    message.hidden = false;
    submit.disabled = false;
  }
});
