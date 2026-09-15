const form = document.querySelector("#login-form"),
  message = document.querySelector("#message"),
  submit = form.querySelector('button[type="submit"]');
function loginDestination() {
  const destinationPath = new URLSearchParams(window.location.search).get("next") || "/";
  return destinationPath.startsWith("/") && !destinationPath.startsWith("//")
    ? destinationPath
    : "/";
}
form.addEventListener("submit", async submitEvent => {
  (submitEvent.preventDefault(), (message.textContent = ""), (message.hidden = !0));
  const formData = new FormData(form);
  submit.disabled = !0;
  try {
    const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: String(formData.get("username") || ""),
          password: String(formData.get("password") || "")
        })
      }),
      responseBody = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(responseBody.detail || "\u767B\u5F55\u5931\u8D25\u3002");
    window.location.assign(loginDestination());
  } catch (error) {
    ((message.textContent = error.message), (message.hidden = !1), (submit.disabled = !1));
  }
});
