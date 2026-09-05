export function runtimeDialogUsesStableMotion({
  userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent || "",
} = {}) {
  const text = String(userAgent || "");
  return (
    /AppleWebKit/i.test(text) &&
    /Safari/i.test(text) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|OPiOS|FxiOS/i.test(text)
  );
}
export function playStableRuntimeDialogEntrance(overlay, dialog) {
  if (!runtimeDialogUsesStableMotion()) {
    return [];
  }
  const targets = overlay.classList.contains("hb-runtime-simplified-motion")
    ? [overlay, dialog, ...dialog.querySelectorAll("*")]
    : [overlay, dialog];
  for (const target of targets) {
    for (const animation of target.getAnimations?.() || []) {
      if (animation.effect?.getTiming?.().iterations === 1) {
        animation.cancel();
      }
    }
  }
  const firstElementChild = dialog.firstElementChild;
  const animations = [];
  if (firstElementChild?.animate) {
    animations.push(
      firstElementChild.animate(
        [
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        ],
        {
          duration: 240,
          easing: "cubic-bezier(.22,.61,.36,1)",
          fill: "both",
        },
      ),
    );
  } else if (firstElementChild) {
    firstElementChild.style.opacity = "1";
  }
  return animations;
}
export function playMediaSpeakerEntrance(element) {
  if (
    !element ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  } else {
    return element.animate(
      [
        {
          opacity: 0,
          transform: "translate3d(148px,0,0) scale(.78) rotate(10deg)",
          offset: 0,
        },
        {
          opacity: 1,
          transform: "translate3d(-8px,0,0) scale(1.035) rotate(-1deg)",
          offset: 0.68,
        },
        {
          opacity: 0.96,
          transform: "translate3d(3px,0,0) scale(.992) rotate(0)",
          offset: 0.84,
        },
        {
          opacity: 0.94,
          transform: "translate3d(0,0,0) scale(1) rotate(0)",
          offset: 1,
        },
      ],
      {
        duration: 720,
        delay: 140,
        easing: "cubic-bezier(.18,.78,.24,1)",
        fill: "both",
      },
    );
  }
}
export function playFixedDeviceDropEntrance(
  element,
  { distance = 150, delay = 90 } = {},
) {
  if (
    !element ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  } else {
    return element.animate(
      [
        {
          filter: "blur(2px)",
          translate: "0 -" + distance + "px",
          offset: 0,
        },
        {
          filter: "blur(0)",
          translate: "0 7px",
          offset: 0.7,
        },
        {
          filter: "blur(0)",
          translate: "0 -3px",
          offset: 0.86,
        },
        {
          filter: "blur(0)",
          translate: "0 0",
          offset: 1,
        },
      ],
      {
        duration: 660,
        delay,
        easing: "cubic-bezier(.2,.78,.28,1)",
        fill: "both",
      },
    );
  }
}
