export function syncControlValue(
  controlElement,
  nextValue,
  activeElement = globalThis.document?.activeElement
) {
  if (!controlElement || activeElement === controlElement) {
    return false;
  }
  const stringValue = String(nextValue);
  if (controlElement.value === stringValue) {
    return false;
  } else {
    controlElement.value = stringValue;
    return true;
  }
}
