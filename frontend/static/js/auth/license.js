const form = document.querySelector("#license-form");
const message = document.querySelector("#message");
const statusText = document.querySelector("#license-status-text");
const submit = form.querySelector('button[type="submit"]');
const logout = document.querySelector("#logout");
const STATUS_COPY = {
  UNACTIVATED: "当前设备尚未激活，激活后才能进入编辑器。",
  LEASE_EXPIRED: "授权租约已经到期，请恢复网络后重新激活。",
  INSTANCE_MISMATCH: "当前安装 UUID 与授权记录不一致，请联系授权管理员。",
  CLOCK_ROLLBACK: "检测到系统时间回拨，请校准时间后重新验证。",
  STARTUP_VALIDATION_REQUIRED: "无法连接本机授权店，请确认授权店已启动后重新激活。",
  INVALID: "本地授权凭证无效，请重新激活。",
  REVOKED: "此授权已失效，请输入新的激活码。"
};
let activationPending = false;
let navigating = false;
let statusTimer = null;
function enterEditor() {
  if (navigating) {
    return;
  }
  navigating = true;
  if (statusTimer !== null) {
    window.clearInterval(statusTimer);
  }
  window.location.replace("/");
}
function errorMessage(payload, fallback) {
  if (typeof payload?.detail == "string") {
    return payload.detail;
  }
  if (typeof payload?.detail?.message == "string") {
    return payload.detail.message;
  }
  return fallback;
}
async function loadStatus() {
  const response = await fetch("/api/v1/license/status", {
    cache: "no-store"
  });
  if (response.status === 401) {
    window.location.replace("/login");
    return;
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(errorMessage(payload, "无法读取授权状态。"));
  }
  if (payload.editorAllowed) {
    enterEditor();
    return;
  }
  if (payload.allowed) {
    statusText.textContent = "当前授权有效，但未包含编辑器权益，请联系授权管理员。";
    return;
  }
  statusText.textContent = STATUS_COPY[payload.status] || "当前授权不可用，请输入激活码。";
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (activationPending || navigating) {
    return;
  }
  activationPending = true;
  message.hidden = true;
  submit.disabled = true;
  try {
    const data = new FormData(form);
    const response = await fetch("/api/v1/license/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: String(data.get("email") || "").trim(),
        activationCode: String(data.get("activationCode") || "").trim()
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(errorMessage(payload, "激活失败。"));
    }
    if (!payload.editorAllowed) {
      throw new Error(payload.allowed ? "激活成功，但当前商品未包含编辑器权益。" : "激活后授权状态尚未生效，请稍后重试。");
    }
    enterEditor();
  } catch (error) {
    message.textContent = error.message;
    message.hidden = false;
    submit.disabled = false;
    activationPending = false;
  }
});
logout.addEventListener("click", async () => {
  await fetch("/api/v1/auth/logout", {
    method: "POST"
  }).catch(() => {});
  window.location.replace("/login");
});
loadStatus().catch(error => {
  statusText.textContent = error.message;
  submit.disabled = false;
});
statusTimer = window.setInterval(() => {
  if (activationPending || navigating) {
    return;
  }
  loadStatus().catch(error => {
    statusText.textContent = error.message;
  });
}, 5000);
