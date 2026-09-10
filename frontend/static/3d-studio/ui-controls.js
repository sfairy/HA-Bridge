export function syncControlValue(control, value, activeElement = globalThis.document?.activeElement) {
  if (!control || activeElement === control) {
    return false;
  }
  const next = String(value);
  if (control.value === next) {
    return false;
  }
  control.value = next;
  return true;
}
