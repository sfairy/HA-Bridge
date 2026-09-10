const characters = document.querySelector(".home-characters");
function passwordInputs() {
  return [...document.querySelectorAll('input[type="password"], input[data-password-field]')];
}
function syncPasswordState() {
  if (!characters) {
    return;
  }
  const inputs = passwordInputs();
  const hasPassword = inputs.some(input => input.value.length > 0);
  const passwordVisible = inputs.some(input => input.value.length > 0 && input.type === "text");
  characters.classList.toggle("has-password", hasPassword);
  characters.classList.toggle("is-password-visible", passwordVisible);
}
function scheduleBlink(className) {
  if (!characters) {
    return;
  }
  window.setTimeout(() => {
    characters.classList.add(className);
    window.setTimeout(() => {
      characters.classList.remove(className);
      scheduleBlink(className);
    }, 150);
  }, Math.random() * 4000 + 3000);
}
if (characters) {
  scheduleBlink("is-purple-blinking");
  scheduleBlink("is-dark-blinking");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    characters.classList.add("is-ready");
    window.setTimeout(() => {
      characters.classList.remove("is-ready");
      characters.classList.add("is-entered");
    }, 1250);
  }));
}
for (const toggle of document.querySelectorAll("[data-toggle-password]")) {
  toggle.addEventListener("click", () => {
    const input = document.querySelector(`#${toggle.dataset.togglePassword}`);
    if (!input) {
      return;
    }
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    input.dataset.passwordField = "true";
    toggle.setAttribute("aria-label", visible ? "显示密码" : "隐藏密码");
    toggle.title = visible ? "显示密码" : "隐藏密码";
    syncPasswordState();
  });
}
for (const input of document.querySelectorAll(".auth-form input")) {
  input.addEventListener("focus", () => {
    if (input.name === "username") {
      characters?.classList.add("is-account-typing");
    }
  });
  input.addEventListener("blur", () => {
    if (input.name === "username") {
      characters?.classList.remove("is-account-typing");
    }
  });
  input.addEventListener("input", syncPasswordState);
}
document.addEventListener("pointermove", event => {
  if (!characters) {
    return;
  }
  const box = characters.getBoundingClientRect();
  const lookX = Math.max(-1, Math.min(1, (event.clientX - box.left - box.width / 2) / (box.width / 2)));
  const lookY = Math.max(-1, Math.min(1, (event.clientY - box.top - box.height / 2) / (box.height / 2)));
  characters.style.setProperty("--look-x", lookX.toFixed(2));
  characters.style.setProperty("--look-y", lookY.toFixed(2));
});
syncPasswordState();
