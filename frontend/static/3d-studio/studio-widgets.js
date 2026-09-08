const selectRegistry = new Map();
let openSelectState = null;
function closeStudioSelect(state = openSelectState) {
  if (state) {
    state.wrapper.classList.remove("open");
    state.trigger.setAttribute("aria-expanded", "false");
    state.menu.hidden = true;
    if (openSelectState === state) {
      openSelectState = null;
    }
  }
}
export function syncStudioSelect(select) {
  const state = selectRegistry.get(select);
  if (!state) {
    return;
  }
  const selectedOption =
    select.selectedOptions?.[0] ||
    select.options[select.selectedIndex] ||
    select.options[0];
  state.trigger.textContent = selectedOption?.textContent || "请选择";
  state.trigger.disabled = select.disabled;
  state.trigger.setAttribute("aria-disabled", String(select.disabled));
  state.menu.replaceChildren(
    ...[...select.options].map((option) => {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.className = "studio-select-option";
      optionButton.textContent = option.textContent;
      optionButton.dataset.value = option.value;
      optionButton.disabled = option.disabled;
      optionButton.setAttribute("role", "option");
      optionButton.setAttribute(
        "aria-selected",
        String(option.value === select.value),
      );
      optionButton.classList.toggle("selected", option.value === select.value);
      optionButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!option.disabled) {
          select.value = option.value;
          syncStudioSelect(select);
          closeStudioSelect(state);
          select.dispatchEvent(
            new Event("change", {
              bubbles: true,
            }),
          );
          state.trigger.focus();
        }
      });
      return optionButton;
    }),
  );
  if (select.disabled) {
    closeStudioSelect(state);
  }
}
export function enhanceStudioSelect(select) {
  if (!select || selectRegistry.has(select)) {
    return;
  }
  const wrapper = document.createElement("div");
  wrapper.className = "studio-select";
  select.before(wrapper);
  wrapper.append(select);
  select.classList.add("studio-native-select");
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "studio-select-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  const menu = document.createElement("div");
  menu.className = "studio-select-menu";
  menu.id =
    (select.id || "studio-select-" + (selectRegistry.size + 1)) + "-menu";
  menu.setAttribute("role", "listbox");
  menu.hidden = true;
  trigger.setAttribute("aria-controls", menu.id);
  wrapper.append(trigger, menu);
  const state = {
    select: select,
    wrapper: wrapper,
    trigger: trigger,
    menu: menu,
  };
  selectRegistry.set(select, state);
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!select.disabled) {
      if (openSelectState === state) {
        closeStudioSelect(state);
        return;
      }
      closeStudioSelect();
      syncStudioSelect(select);
      wrapper.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      menu.hidden = false;
      openSelectState = state;
    }
  });
  select.addEventListener("change", () => syncStudioSelect(select));
  new MutationObserver(() => syncStudioSelect(select)).observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
  });
  syncStudioSelect(select);
}
export function initializeStudioSelects(root = document) {
  for (const select of root.querySelectorAll("select")) {
    enhanceStudioSelect(select);
  }
  root.addEventListener("pointerdown", (event) => {
    if (openSelectState && !openSelectState.wrapper.contains(event.target)) {
      closeStudioSelect();
    }
  });
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !openSelectState) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const trigger = openSelectState.trigger;
    closeStudioSelect();
    trigger.focus();
  });
}
function syncStepperDisabled(input, buttons) {
  const isDisabled = input.disabled || input.readOnly;
  for (const button of buttons) {
    button.disabled = isDisabled;
  }
  input.closest(".number-stepper")?.classList.toggle("is-disabled", isDisabled);
}
export function enhanceNumberInput(input) {
  if (!input || input.closest(".number-stepper")) {
    return;
  }
  const stepper = document.createElement("span");
  stepper.className = "number-stepper";
  input.before(stepper);
  stepper.append(input);
  const buttonGroup = document.createElement("span");
  buttonGroup.className = "number-stepper-buttons";
  const buttons = [
    {
      direction: "up",
      label: "增加数值",
    },
    {
      direction: "down",
      label: "减小数值",
    },
  ].map(({ direction, label }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "number-stepper-button number-stepper-" + direction;
    button.setAttribute("aria-label", label);
    button.title = label;
    const stepOnce = () => {
      if (input.disabled || input.readOnly) {
        return false;
      }
      const previousValue = input.value;
      try {
        if (direction === "up") {
          input.stepUp();
        } else {
          input.stepDown();
        }
      } catch {
        return false;
      }
      if (input.value === previousValue) {
        return false;
      } else {
        input.dispatchEvent(
          new Event("input", {
            bubbles: true,
          }),
        );
        return true;
      }
    };
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || input.disabled || input.readOnly) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      input.focus({
        preventScroll: true,
      });
      let didStep = stepOnce();
      let released = false;
      let repeatTimer = window.setTimeout(() => {
        repeatTimer = window.setInterval(() => {
          didStep = stepOnce() || didStep;
        }, 55);
      }, 320);
      const release = () => {
        if (!released) {
          released = true;
          window.clearTimeout(repeatTimer);
          window.clearInterval(repeatTimer);
          button.removeEventListener("pointerup", release);
          button.removeEventListener("pointercancel", release);
          button.removeEventListener("lostpointercapture", release);
          if (didStep) {
            input.dispatchEvent(
              new Event("change", {
                bubbles: true,
              }),
            );
          }
        }
      };
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
      try {
        button.setPointerCapture(event.pointerId);
      } catch {}
    });
    buttonGroup.append(button);
    return button;
  });
  stepper.append(buttonGroup);
  new MutationObserver(() => syncStepperDisabled(input, buttons)).observe(
    input,
    {
      attributes: true,
      attributeFilter: ["disabled", "readonly"],
    },
  );
  syncStepperDisabled(input, buttons);
}
export function initializeNumberInputs(root = document) {
  for (const input of root.querySelectorAll('input[type="number"]')) {
    enhanceNumberInput(input);
  }
}
