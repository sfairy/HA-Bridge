export function runtimeDialogUsesStableMotion({
  userAgent: userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent || ""
} = {}) {
  const userAgentText = String(userAgent || "");
  return (
    /AppleWebKit/i.test(userAgentText) &&
    /Safari/i.test(userAgentText) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|OPiOS|FxiOS/i.test(userAgentText)
  );
}
export function playStableRuntimeDialogEntrance(dialogElement, contentElement) {
  if (!runtimeDialogUsesStableMotion()) {
    return [];
  }
  const motionRoots = dialogElement.classList.contains("hb-runtime-simplified-motion")
    ? [dialogElement, contentElement, ...contentElement.querySelectorAll("*")]
    : [dialogElement, contentElement];
  for (const motionRoot of motionRoots) {
    for (const animation of motionRoot.getAnimations?.() || []) {
      if (animation.effect?.getTiming?.().iterations === 1) {
        animation.cancel();
      }
    }
  }
  const firstChildElement = contentElement.firstElementChild;
  const animations = [];
  if (firstChildElement?.animate) {
    animations.push(
      firstChildElement.animate(
        [
          {
            opacity: 0
          },
          {
            opacity: 1
          }
        ],
        {
          duration: 240,
          easing: "cubic-bezier(.22,.61,.36,1)",
          fill: "both"
        }
      )
    );
  } else if (firstChildElement) {
    firstChildElement.style.opacity = "1";
  }
  return animations;
}
export function playMediaSpeakerEntrance(speakerElement) {
  if (!speakerElement || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return null;
  } else {
    return speakerElement.animate(
      [
        {
          opacity: 0,
          transform: "translate3d(148px,0,0) scale(.78) rotate(10deg)",
          offset: 0
        },
        {
          opacity: 1,
          transform: "translate3d(-8px,0,0) scale(1.035) rotate(-1deg)",
          offset: 0.68
        },
        {
          opacity: 0.96,
          transform: "translate3d(3px,0,0) scale(.992) rotate(0)",
          offset: 0.84
        },
        {
          opacity: 0.94,
          transform: "translate3d(0,0,0) scale(1) rotate(0)",
          offset: 1
        }
      ],
      {
        duration: 720,
        delay: 140,
        easing: "cubic-bezier(.18,.78,.24,1)",
        fill: "both"
      }
    );
  }
}
export function playFixedDeviceDropEntrance(
  deviceElement,
  { distance: distancePx = 150, delay: delayMs = 90 } = {}
) {
  if (!deviceElement || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return null;
  } else {
    return deviceElement.animate(
      [
        {
          filter: "blur(2px)",
          translate: "0 -" + distancePx + "px",
          offset: 0
        },
        {
          filter: "blur(0)",
          translate: "0 7px",
          offset: 0.7
        },
        {
          filter: "blur(0)",
          translate: "0 -3px",
          offset: 0.86
        },
        {
          filter: "blur(0)",
          translate: "0 0",
          offset: 1
        }
      ],
      {
        duration: 660,
        delay: delayMs,
        easing: "cubic-bezier(.2,.78,.28,1)",
        fill: "both"
      }
    );
  }
}
