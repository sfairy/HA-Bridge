const controllersBySelect = new Map();
let openController = null;
function closeStudioSelect(targetController = openController) {
  if (targetController) {
    targetController.wrapper.classList.remove("open");
    targetController.trigger.setAttribute("aria-expanded", "false");
    targetController.menu.hidden = true;
    if (openController === targetController) {
      openController = null;
    }
  }
}
export function syncStudioSelect(selectElement) {
  const selectController = controllersBySelect.get(selectElement);
  if (!selectController) {
    return;
  }
  const selectedOptionElement =
    selectElement.selectedOptions?.[0] ||
    selectElement.options[selectElement.selectedIndex] ||
    selectElement.options[0];
  selectController.trigger.textContent = selectedOptionElement?.textContent || "请选择";
  selectController.trigger.disabled = selectElement.disabled;
  selectController.trigger.setAttribute("aria-disabled", String(selectElement.disabled));
  selectController.menu.replaceChildren(
    ...[...selectElement.options].map(optionElement => {
      const optionButtonElement = document.createElement("button");
      optionButtonElement.type = "button";
      optionButtonElement.className = "studio-select-option";
      optionButtonElement.textContent = optionElement.textContent;
      optionButtonElement.dataset.value = optionElement.value;
      optionButtonElement.disabled = optionElement.disabled;
      optionButtonElement.setAttribute("role", "option");
      optionButtonElement.setAttribute(
        "aria-selected",
        String(optionElement.value === selectElement.value)
      );
      optionButtonElement.classList.toggle("selected", optionElement.value === selectElement.value);
      optionButtonElement.addEventListener("click", optionClickEvent => {
        optionClickEvent.preventDefault();
        optionClickEvent.stopPropagation();
        if (!optionElement.disabled) {
          selectElement.value = optionElement.value;
          syncStudioSelect(selectElement);
          closeStudioSelect(selectController);
          selectElement.dispatchEvent(
            new Event("change", {
              bubbles: true
            })
          );
          selectController.trigger.focus();
        }
      });
      return optionButtonElement;
    })
  );
  if (selectElement.disabled) {
    closeStudioSelect(selectController);
  }
}
export function enhanceStudioSelect(hostSelectElement) {
  if (!hostSelectElement || controllersBySelect.has(hostSelectElement)) {
    return;
  }
  const wrapperElement = document.createElement("div");
  wrapperElement.className = "studio-select";
  hostSelectElement.before(wrapperElement);
  wrapperElement.append(hostSelectElement);
  hostSelectElement.classList.add("studio-native-select");
  hostSelectElement.tabIndex = -1;
  hostSelectElement.setAttribute("aria-hidden", "true");
  const triggerElement = document.createElement("button");
  triggerElement.type = "button";
  triggerElement.className = "studio-select-trigger";
  triggerElement.setAttribute("aria-haspopup", "listbox");
  triggerElement.setAttribute("aria-expanded", "false");
  const menuElement = document.createElement("div");
  menuElement.className = "studio-select-menu";
  menuElement.id =
    (hostSelectElement.id || "studio-select-" + (controllersBySelect.size + 1)) + "-menu";
  menuElement.setAttribute("role", "listbox");
  menuElement.hidden = true;
  triggerElement.setAttribute("aria-controls", menuElement.id);
  wrapperElement.append(triggerElement, menuElement);
  const controllerRecord = {
    select: hostSelectElement,
    wrapper: wrapperElement,
    trigger: triggerElement,
    menu: menuElement
  };
  controllersBySelect.set(hostSelectElement, controllerRecord);
  triggerElement.addEventListener("click", triggerClickEvent => {
    triggerClickEvent.preventDefault();
    triggerClickEvent.stopPropagation();
    if (!hostSelectElement.disabled) {
      if (openController === controllerRecord) {
        closeStudioSelect(controllerRecord);
        return;
      }
      closeStudioSelect();
      syncStudioSelect(hostSelectElement);
      wrapperElement.classList.add("open");
      triggerElement.setAttribute("aria-expanded", "true");
      menuElement.hidden = false;
      openController = controllerRecord;
    }
  });
  hostSelectElement.addEventListener("change", () => syncStudioSelect(hostSelectElement));
  new MutationObserver(() => syncStudioSelect(hostSelectElement)).observe(hostSelectElement, {
    childList: true,
    subtree: true,
    attributes: true
  });
  syncStudioSelect(hostSelectElement);
}
export function initializeStudioSelects(rootElement = document) {
  for (const discoveredSelect of rootElement.querySelectorAll("select")) {
    enhanceStudioSelect(discoveredSelect);
  }
  rootElement.addEventListener("pointerdown", pointerEvent => {
    if (openController && !openController.wrapper.contains(pointerEvent.target)) {
      closeStudioSelect();
    }
  });
  rootElement.addEventListener("keydown", keydownEvent => {
    if (keydownEvent.key !== "Escape" || !openController) {
      return;
    }
    keydownEvent.preventDefault();
    keydownEvent.stopPropagation();
    const triggerToFocus = openController.trigger;
    closeStudioSelect();
    triggerToFocus.focus();
  });
}
function syncStepperButtonsDisabled(stepperInput, stepperButtons) {
  const isStepperDisabled = stepperInput.disabled || stepperInput.readOnly;
  for (const stepperButton of stepperButtons) {
    stepperButton.disabled = isStepperDisabled;
  }
  stepperInput.closest(".number-stepper")?.classList.toggle("is-disabled", isStepperDisabled);
}
export function enhanceNumberInput(numberInput) {
  if (!numberInput || numberInput.closest(".number-stepper")) {
    return;
  }
  const stepperWrapperElement = document.createElement("span");
  stepperWrapperElement.className = "number-stepper";
  numberInput.before(stepperWrapperElement);
  stepperWrapperElement.append(numberInput);
  const stepperButtonsContainer = document.createElement("span");
  stepperButtonsContainer.className = "number-stepper-buttons";
  const stepperButtonDefinitions = [
    {
      direction: "up",
      label: "增加数值"
    },
    {
      direction: "down",
      label: "减小数值"
    }
  ].map(({ direction: stepDirection, label: buttonLabel }) => {
    const stepperButtonElement = document.createElement("button");
    stepperButtonElement.type = "button";
    stepperButtonElement.className = "number-stepper-button number-stepper-" + stepDirection;
    stepperButtonElement.setAttribute("aria-label", buttonLabel);
    stepperButtonElement.title = buttonLabel;
    const stepOnce = () => {
      if (numberInput.disabled || numberInput.readOnly) {
        return false;
      }
      const previousValue = numberInput.value;
      try {
        if (stepDirection === "up") {
          numberInput.stepUp();
        } else {
          numberInput.stepDown();
        }
      } catch {
        return false;
      }
      if (numberInput.value === previousValue) {
        return false;
      } else {
        numberInput.dispatchEvent(
          new Event("input", {
            bubbles: true
          })
        );
        return true;
      }
    };
    stepperButtonElement.addEventListener("click", buttonClickEvent => {
      buttonClickEvent.preventDefault();
      buttonClickEvent.stopPropagation();
    });
    stepperButtonElement.addEventListener("pointerdown", pointerDownEvent => {
      if (pointerDownEvent.button !== 0 || numberInput.disabled || numberInput.readOnly) {
        return;
      }
      pointerDownEvent.preventDefault();
      pointerDownEvent.stopPropagation();
      numberInput.focus({
        preventScroll: true
      });
      let didStep = stepOnce();
      let isPointerReleased = false;
      let repeatTimerId = window.setTimeout(() => {
        repeatTimerId = window.setInterval(() => {
          didStep = stepOnce() || didStep;
        }, 55);
      }, 320);
      const handleRepeatEnd = () => {
        if (!isPointerReleased) {
          isPointerReleased = true;
          window.clearTimeout(repeatTimerId);
          window.clearInterval(repeatTimerId);
          stepperButtonElement.removeEventListener("pointerup", handleRepeatEnd);
          stepperButtonElement.removeEventListener("pointercancel", handleRepeatEnd);
          stepperButtonElement.removeEventListener("lostpointercapture", handleRepeatEnd);
          if (didStep) {
            numberInput.dispatchEvent(
              new Event("change", {
                bubbles: true
              })
            );
          }
        }
      };
      stepperButtonElement.addEventListener("pointerup", handleRepeatEnd);
      stepperButtonElement.addEventListener("pointercancel", handleRepeatEnd);
      stepperButtonElement.addEventListener("lostpointercapture", handleRepeatEnd);
      try {
        stepperButtonElement.setPointerCapture(pointerDownEvent.pointerId);
      } catch {}
    });
    stepperButtonsContainer.append(stepperButtonElement);
    return stepperButtonElement;
  });
  stepperWrapperElement.append(stepperButtonsContainer);
  new MutationObserver(() =>
    syncStepperButtonsDisabled(numberInput, stepperButtonDefinitions)
  ).observe(numberInput, {
    attributes: true,
    attributeFilter: ["disabled", "readonly"]
  });
  syncStepperButtonsDisabled(numberInput, stepperButtonDefinitions);
}
export function initializeNumberInputs(containerElement = document) {
  for (const numberInputElement of containerElement.querySelectorAll('input[type="number"]')) {
    enhanceNumberInput(numberInputElement);
  }
}
