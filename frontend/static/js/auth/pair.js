const form = document.querySelector("#pair-form");
const message = document.querySelector("#message");
const codeInput = form.elements.code;
function pairDestination(target) {
  // Only ever follow a same-origin absolute path, never a scheme-relative or external URL.
  const value = typeof target === "string" ? target : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
});
form.addEventListener("submit", async event => {
  event.preventDefault();
  message.hidden = true;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    const response = await fetch("/api/v1/displays/pair", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: codeInput.value
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || "配对失败，请检查配对码。");
    }
    window.location.replace(pairDestination(payload.targetUrl));
  } catch (error) {
    message.textContent = error.message;
    message.hidden = false;
    submit.disabled = false;
  }
});
