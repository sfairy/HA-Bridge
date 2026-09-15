const form = document.querySelector("#license-form"),
  message = document.querySelector("#message"),
  statusText = document.querySelector("#license-status-text"),
  submit = form.querySelector('button[type="submit"]'),
  logout = document.querySelector("#logout");
let activationPending = !1,
  navigating = !1,
  statusTimer = null;
function enterEditor() {
  navigating ||
    ((navigating = !0),
    statusTimer !== null && window.clearInterval(statusTimer),
    window.location.replace("/"));
}
function errorMessage(errorResponse, fallbackMessage) {
  return typeof errorResponse?.detail == "string"
    ? errorResponse.detail
    : typeof errorResponse?.detail?.message == "string"
      ? errorResponse.detail.message
      : fallbackMessage;
}
async function loadStatus() {
  const statusResponse = await fetch("/api/v1/license/status", { cache: "no-store" });
  if (statusResponse.status === 401) {
    window.location.replace("/login");
    return;
  }
  const statusPayload = await statusResponse.json().catch(() => ({}));
  if (!statusResponse.ok)
    throw new Error(
      errorMessage(statusPayload, "\u65E0\u6CD5\u8BFB\u53D6\u6388\u6743\u72B6\u6001\u3002")
    );
  if (statusPayload.editorAllowed) {
    enterEditor();
    return;
  }
  if (statusPayload.allowed) {
    statusText.textContent =
      "\u5F53\u524D\u6388\u6743\u6709\u6548\uFF0C\u4F46\u672A\u5305\u542B\u7F16\u8F91\u5668\u6743\u76CA\uFF0C\u8BF7\u8054\u7CFB\u6388\u6743\u7BA1\u7406\u5458\u3002";
    return;
  }
  const STATUS_MESSAGES = {
    UNACTIVATED:
      "\u5F53\u524D\u8BBE\u5907\u5C1A\u672A\u6FC0\u6D3B\uFF0C\u6FC0\u6D3B\u540E\u624D\u80FD\u8FDB\u5165\u7F16\u8F91\u5668\u3002",
    LEASE_EXPIRED:
      "\u6388\u6743\u79DF\u7EA6\u5DF2\u7ECF\u5230\u671F\uFF0C\u8BF7\u6062\u590D\u7F51\u7EDC\u540E\u91CD\u65B0\u6FC0\u6D3B\u3002",
    INSTANCE_MISMATCH:
      "\u5F53\u524D\u5B89\u88C5 UUID \u4E0E\u6388\u6743\u8BB0\u5F55\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u8054\u7CFB\u6388\u6743\u7BA1\u7406\u5458\u3002",
    CLOCK_ROLLBACK:
      "\u68C0\u6D4B\u5230\u7CFB\u7EDF\u65F6\u95F4\u56DE\u62E8\uFF0C\u8BF7\u6821\u51C6\u65F6\u95F4\u540E\u91CD\u65B0\u9A8C\u8BC1\u3002",
    STARTUP_VALIDATION_REQUIRED:
      "\u670D\u52A1\u91CD\u542F\u540E\u6B63\u5728\u7B49\u5F85\u6388\u6743\u540E\u53F0\u786E\u8BA4\uFF0C\u8BF7\u6062\u590D\u7F51\u7EDC\uFF1B\u6210\u529F\u540E\u4F1A\u81EA\u52A8\u8FDB\u5165\u7CFB\u7EDF\u3002",
    INVALID:
      "\u672C\u5730\u6388\u6743\u51ED\u8BC1\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u6FC0\u6D3B\u3002",
    REVOKED:
      "\u540E\u53F0\u5DF2\u5220\u9664\u6216\u64A4\u9500\u6B64\u6388\u6743\uFF0C\u8BF7\u8F93\u5165\u65B0\u7684\u6FC0\u6D3B\u7801\u3002"
  };
  statusText.textContent =
    STATUS_MESSAGES[statusPayload.status] ||
    "\u5F53\u524D\u6388\u6743\u4E0D\u53EF\u7528\uFF0C\u8BF7\u8F93\u5165\u6FC0\u6D3B\u7801\u3002";
}
(form.addEventListener("submit", async submitEvent => {
  if ((submitEvent.preventDefault(), !(activationPending || navigating))) {
    ((activationPending = !0), (message.hidden = !0), (submit.disabled = !0));
    try {
      const activateResponse = await fetch("/api/v1/license/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: String(new FormData(form).get("email") || "").trim(),
            activationCode: String(new FormData(form).get("activationCode") || "").trim()
          })
        }),
        activatePayload = await activateResponse.json().catch(() => ({}));
      if (!activateResponse.ok)
        throw new Error(errorMessage(activatePayload, "\u6FC0\u6D3B\u5931\u8D25\u3002"));
      if (!activatePayload.editorAllowed)
        throw new Error(
          activatePayload.allowed
            ? "\u6FC0\u6D3B\u6210\u529F\uFF0C\u4F46\u5F53\u524D\u5546\u54C1\u672A\u5305\u542B\u7F16\u8F91\u5668\u6743\u76CA\u3002"
            : "\u6FC0\u6D3B\u540E\u6388\u6743\u72B6\u6001\u5C1A\u672A\u751F\u6548\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"
        );
      enterEditor();
    } catch (caughtError) {
      ((message.textContent = caughtError.message),
        (message.hidden = !1),
        (submit.disabled = !1),
        (activationPending = !1));
    }
  }
}),
  logout.addEventListener("click", async () => {
    (await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => {}),
      window.location.replace("/login"));
  }),
  loadStatus().catch(loadError => {
    ((statusText.textContent = loadError.message), (submit.disabled = !1));
  }),
  (statusTimer = window.setInterval(() => {
    activationPending ||
      navigating ||
      loadStatus().catch(refreshError => {
        statusText.textContent = refreshError.message;
      });
  }, 5e3)));
