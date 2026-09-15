const characters = document.querySelector(".home-characters");
function passwordInputs() {
  return [...document.querySelectorAll('input[type="password"], input[data-password-field]')];
}
function syncPasswordState() {
  const passwordFields = passwordInputs(),
    hasPassword = passwordFields.some(field => field.value.length > 0),
    isPasswordVisible = passwordFields.some(
      visibleInput => visibleInput.value.length > 0 && visibleInput.type === "text"
    );
  (characters.classList.toggle("has-password", hasPassword),
    characters.classList.toggle("is-password-visible", isPasswordVisible));
}
function scheduleBlink(blinkClass) {
  window.setTimeout(
    () => {
      (characters.classList.add(blinkClass),
        window.setTimeout(() => {
          (characters.classList.remove(blinkClass), scheduleBlink(blinkClass));
        }, 150));
    },
    Math.random() * 4e3 + 3e3
  );
}
(scheduleBlink("is-purple-blinking"),
  scheduleBlink("is-dark-blinking"),
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      (characters.classList.add("is-ready"),
        window.setTimeout(() => {
          (characters.classList.remove("is-ready"), characters.classList.add("is-entered"));
        }, 1250));
    })
  ));
for (const toggleButton of document.querySelectorAll("[data-toggle-password]"))
  toggleButton.addEventListener("click", () => {
    const passwordInput = document.querySelector(`#${toggleButton.dataset.togglePassword}`),
      isVisible = passwordInput.type === "text";
    ((passwordInput.type = isVisible ? "password" : "text"),
      (passwordInput.dataset.passwordField = "true"),
      toggleButton.setAttribute(
        "aria-label",
        isVisible ? "\u663E\u793A\u5BC6\u7801" : "\u9690\u85CF\u5BC6\u7801"
      ),
      (toggleButton.title = isVisible ? "\u663E\u793A\u5BC6\u7801" : "\u9690\u85CF\u5BC6\u7801"),
      syncPasswordState());
  });
for (const formInput of document.querySelectorAll(".auth-form input"))
  (formInput.addEventListener("focus", () => {
    formInput.name === "username" && characters.classList.add("is-account-typing");
  }),
    formInput.addEventListener("blur", () => {
      formInput.name === "username" && characters.classList.remove("is-account-typing");
    }),
    formInput.addEventListener("input", syncPasswordState));
(document.addEventListener("pointermove", pointerEvent => {
  const bounds = characters.getBoundingClientRect(),
    lookX = Math.max(
      -1,
      Math.min(1, (pointerEvent.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2))
    ),
    lookY = Math.max(
      -1,
      Math.min(1, (pointerEvent.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2))
    );
  (characters.style.setProperty("--look-x", lookX.toFixed(2)),
    characters.style.setProperty("--look-y", lookY.toFixed(2)));
}),
  syncPasswordState());
