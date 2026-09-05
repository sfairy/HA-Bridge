const index = new Map();
let o = null;
function fn(value = o) {
  if (value) {
    value.wrapper.classList.remove("open");
    value.trigger.setAttribute("aria-expanded", "false");
    value.menu.hidden = true;
    if (o === value) {
      o = null;
    }
  }
}
export function syncStudioSelect(element) {
  const value = index.get(element);
  if (!value) {
    return;
  }
  const element2 =
    element.selectedOptions?.[0] ||
    element.options[element.selectedIndex] ||
    element.options[0];
  value.trigger.textContent = element2?.textContent || "请选择";
  value.trigger.disabled = element.disabled;
  value.trigger.setAttribute("aria-disabled", String(element.disabled));
  value.menu.replaceChildren(
    ...[...element.options].map((element3) => {
      const element4 = document.createElement("button");
      element4.type = "button";
      element4.className = "studio-select-option";
      element4.textContent = element3.textContent;
      element4.dataset.value = element3.value;
      element4.disabled = element3.disabled;
      element4.setAttribute("role", "option");
      element4.setAttribute(
        "aria-selected",
        String(element3.value === element.value),
      );
      element4.classList.toggle("selected", element3.value === element.value);
      element4.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!element3.disabled) {
          element.value = element3.value;
          syncStudioSelect(element);
          fn(value);
          element.dispatchEvent(
            new Event("change", {
              bubbles: true,
            }),
          );
          value.trigger.focus();
        }
      });
      return element4;
    }),
  );
  if (element.disabled) {
    fn(value);
  }
}
export function enhanceStudioSelect(select) {
  if (!select || index.has(select)) {
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
  menu.id = (select.id || "studio-select-" + (index.size + 1)) + "-menu";
  menu.setAttribute("role", "listbox");
  menu.hidden = true;
  trigger.setAttribute("aria-controls", menu.id);
  wrapper.append(trigger, menu);
  const value = {
    select: select,
    wrapper: wrapper,
    trigger: trigger,
    menu: menu,
  };
  index.set(select, value);
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!select.disabled) {
      if (o === value) {
        fn(value);
        return;
      }
      fn();
      syncStudioSelect(select);
      wrapper.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      menu.hidden = false;
      o = value;
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
export function initializeStudioSelects(value = document) {
  for (const value2 of value.querySelectorAll("select")) {
    enhanceStudioSelect(value2);
  }
  value.addEventListener("pointerdown", (value2) => {
    if (o && !o.wrapper.contains(value2.target)) {
      fn();
    }
  });
  value.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !o) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const trigger = o.trigger;
    fn();
    trigger.focus();
  });
}
function fn2(value, value2) {
  const value3 = value.disabled || value.readOnly;
  for (const value4 of value2) {
    value4.disabled = value3;
  }
  value.closest(".number-stepper")?.classList.toggle("is-disabled", value3);
}
export function enhanceNumberInput(element) {
  if (!element || element.closest(".number-stepper")) {
    return;
  }
  const value = document.createElement("span");
  value.className = "number-stepper";
  element.before(value);
  value.append(element);
  const value2 = document.createElement("span");
  value2.className = "number-stepper-buttons";
  const value3 = [
    {
      direction: "up",
      label: "增加数值",
    },
    {
      direction: "down",
      label: "减小数值",
    },
  ].map(({ direction: value4, label: value5 }) => {
    const value6 = document.createElement("button");
    value6.type = "button";
    value6.className = "number-stepper-button number-stepper-" + value4;
    value6.setAttribute("aria-label", value5);
    value6.title = value5;
    const fn3 = () => {
      if (element.disabled || element.readOnly) {
        return false;
      }
      const value7 = element.value;
      try {
        if (value4 === "up") {
          element.stepUp();
        } else {
          element.stepDown();
        }
      } catch {
        return false;
      }
      if (element.value === value7) {
        return false;
      } else {
        element.dispatchEvent(
          new Event("input", {
            bubbles: true,
          }),
        );
        return true;
      }
    };
    value6.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    value6.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || element.disabled || element.readOnly) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      element.focus({
        preventScroll: true,
      });
      let value7 = fn3();
      let value8 = false;
      let value9 = window.setTimeout(() => {
        value9 = window.setInterval(() => {
          value7 = fn3() || value7;
        }, 55);
      }, 320);
      const value10 = () => {
        if (!value8) {
          value8 = true;
          window.clearTimeout(value9);
          window.clearInterval(value9);
          value6.removeEventListener("pointerup", value10);
          value6.removeEventListener("pointercancel", value10);
          value6.removeEventListener("lostpointercapture", value10);
          if (value7) {
            element.dispatchEvent(
              new Event("change", {
                bubbles: true,
              }),
            );
          }
        }
      };
      value6.addEventListener("pointerup", value10);
      value6.addEventListener("pointercancel", value10);
      value6.addEventListener("lostpointercapture", value10);
      try {
        value6.setPointerCapture(event.pointerId);
      } catch {}
    });
    value2.append(value6);
    return value6;
  });
  value.append(value2);
  new MutationObserver(() => fn2(element, value3)).observe(element, {
    attributes: true,
    attributeFilter: ["disabled", "readonly"],
  });
  fn2(element, value3);
}
export function initializeNumberInputs(value = document) {
  for (const value2 of value.querySelectorAll('input[type="number"]')) {
    enhanceNumberInput(value2);
  }
}
