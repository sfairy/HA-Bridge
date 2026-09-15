import { normalizeGroundReflection as normalizeReflection } from "./reflection-settings.js";
export function performanceWarnings(currentProperties, pendingProperties) {
  const warningList = [];
  if (
    (currentProperties.lightingMode === "region" &&
      pendingProperties.lightingMode === "standard" &&
      warningList.push(
        "\u6807\u51C6\u5149\u5F71\u9700\u8981\u8BA1\u7B97\u66F4\u591A\u5B9E\u65F6\u5149\u7167\u4E0E\u9634\u5F71\u3002"
      ),
    pendingProperties.renderScale > 1 &&
      pendingProperties.renderScale > (currentProperties.renderScale ?? 1) &&
      warningList.push(
        "\u9AD8\u6E05\u6E32\u67D3\u9700\u8981\u5904\u7406\u66F4\u591A\u753B\u9762\u50CF\u7D20\u3002"
      ),
    pendingProperties.motionRenderScale >= 0.8 &&
      pendingProperties.motionRenderScale > (currentProperties.motionRenderScale ?? 0) &&
      warningList.push(
        "\u8F83\u9AD8\u7684\u8F6C\u52A8\u5206\u8FA8\u7387\u4F1A\u589E\u52A0\u65CB\u8F6C\u548C\u805A\u7126\u8FC7\u6E21\u65F6\u7684\u7ED8\u5236\u5F00\u9500\u3002"
      ),
    pendingProperties.groundReflection)
  ) {
    const currentReflection = normalizeReflection(currentProperties.groundReflection),
      pendingReflection = normalizeReflection(pendingProperties.groundReflection),
      reflectionCost = reflection =>
        reflection.strength === 0 || reflection.mode === "off"
          ? 0
          : reflection.mode === "all"
            ? 2
            : 1,
      currentReflectionCost = reflectionCost(currentReflection),
      pendingReflectionCost = reflectionCost(pendingReflection);
    (pendingReflectionCost > currentReflectionCost &&
      warningList.push(
        pendingReflectionCost === 2
          ? "\u5BA4\u5185\u548C\u5BA4\u5916\u540C\u65F6\u53CD\u5C04\uFF0C\u9700\u8981\u989D\u5916\u7ED8\u5236\u4E24\u7EC4\u5012\u5F71\u3002"
          : "\u5730\u9762\u53CD\u5C04\u9700\u8981\u989D\u5916\u7ED8\u5236\u5012\u5F71\u3002"
      ),
      pendingReflectionCost &&
        pendingReflection.resolution > 512 &&
        (pendingReflection.resolution > currentReflection.resolution || !currentReflectionCost) &&
        warningList.push(
          "\u9AD8\u53CD\u5C04\u6E05\u6670\u5EA6\u4F1A\u589E\u52A0\u5012\u5F71\u7684\u7ED8\u5236\u5F00\u9500\u548C\u663E\u5B58\u5360\u7528\u3002"
        ));
  }
  return warningList;
}
export function confirmPerformanceWarning(
  warnings,
  { document: documentRef = document, signal: signal } = {}
) {
  return warnings.length
    ? signal?.aborted
      ? Promise.resolve(!1)
      : new Promise(resolve => {
          const dialogElement = documentRef.createElement("dialog");
          ((dialogElement.className = "settings-dialog i3d-performance-dialog"),
            dialogElement.setAttribute("aria-labelledby", "i3d-performance-title"),
            dialogElement.setAttribute("aria-describedby", "i3d-performance-description"));
          const titleElement = documentRef.createElement("h2");
          ((titleElement.id = "i3d-performance-title"),
            (titleElement.textContent = "\u753B\u8D28\u4E0E\u6D41\u7545\u5EA6\u63D0\u793A"));
          const descriptionElement = documentRef.createElement("div");
          descriptionElement.id = "i3d-performance-description";
          for (const warning of warnings) {
            const paragraphElement = documentRef.createElement("p");
            ((paragraphElement.textContent = warning), descriptionElement.append(paragraphElement));
          }
          const noteElement = documentRef.createElement("p");
          ((noteElement.className = "i3d-performance-note"),
            (noteElement.textContent =
              "\u624B\u673A\u3001iPad \u6216\u6027\u80FD\u8F83\u4F4E\u7684\u8BBE\u5907\u53EF\u80FD\u51FA\u73B0\u6389\u5E27\u3001\u53D1\u70ED\u6216\u8017\u7535\u589E\u52A0\u3002\u5982\u679C\u4E0D\u591F\u6D41\u7545\uFF0C\u53EF\u4EE5\u964D\u4F4E\u753B\u8D28\u6216\u5173\u95ED\u53CD\u5C04\u3002"),
            descriptionElement.append(noteElement));
          const actionsElement = documentRef.createElement("div");
          actionsElement.className = "dialog-actions";
          const cancelButtonElement = documentRef.createElement("button"),
            confirmButtonElement = documentRef.createElement("button");
          ((cancelButtonElement.type = confirmButtonElement.type = "button"),
            (cancelButtonElement.textContent = "\u53D6\u6D88"),
            (confirmButtonElement.textContent = "\u7EE7\u7EED\u5E94\u7528"),
            (confirmButtonElement.className = "primary"),
            actionsElement.append(cancelButtonElement, confirmButtonElement),
            dialogElement.append(titleElement, descriptionElement, actionsElement));
          let isSettled = !1;
          const settle = result => {
              isSettled ||
                ((isSettled = !0),
                signal?.removeEventListener("abort", handleCancel),
                dialogElement.close(),
                dialogElement.remove(),
                resolve(result));
            },
            handleCancel = () => settle(!1);
          (cancelButtonElement.addEventListener("click", handleCancel),
            confirmButtonElement.addEventListener("click", () => settle(!0)),
            dialogElement.addEventListener("cancel", event => {
              (event.preventDefault(), settle(!1));
            }),
            dialogElement.addEventListener("close", () => settle(!1)),
            signal?.addEventListener("abort", handleCancel, { once: !0 }),
            documentRef.body.append(dialogElement),
            dialogElement.showModal(),
            cancelButtonElement.focus());
        })
    : Promise.resolve(!0);
}
