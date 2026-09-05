const SOUND_ENABLED_KEY = "ha-bridge-dashboard-sound-enabled";
const BUTTON_CLICK_URL =
  "/bridge-static/audio/button-click.mp3?v=20260826-button-sound-v1";
function readSoundEnabled() {
  try {
    const stored = window.localStorage.getItem(SOUND_ENABLED_KEY);
    return stored === null ? true : stored !== "0";
  } catch {
    return true;
  }
}
export function createButtonSound() {
  let enabled = readSoundEnabled();
  const template = typeof Audio == "function" ? new Audio(BUTTON_CLICK_URL) : null;
  if (template) {
    template.preload = "auto";
    template.volume = 0.42;
  }
  return {
    isEnabled() {
      return enabled;
    },
    setEnabled(next) {
      enabled = !!next;
      try {
        window.localStorage.setItem(SOUND_ENABLED_KEY, enabled ? "1" : "0");
      } catch {}
      return enabled;
    },
    toggle() {
      return this.setEnabled(!enabled);
    },
    play() {
      if (!enabled || !template) {
        return;
      }
      const clip = template.cloneNode(true);
      clip.volume = template.volume;
      clip.currentTime = 0;
      clip.play().catch(() => {});
    },
  };
}
