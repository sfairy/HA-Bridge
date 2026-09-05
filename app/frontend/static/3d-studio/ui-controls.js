export function syncControlValue(
  element,
  nextValue,
  activeElement = globalThis.document?.activeElement,
) {
  if (!element || activeElement === element) {
    return false;
  }
  const text = String(nextValue);
  if (element.value === text) {
    return false;
  } else {
    element.value = text;
    return true;
  }
}
