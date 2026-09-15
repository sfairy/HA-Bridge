export function resolvePageBehavior(config = {}, deviceKind = "light") {
  const targetPage =
    {
      climate: "environment",
      cover: "environment",
      nas: "devices",
      television: "devices",
      "vacuum-shortcut": "vacuum"
    }[deviceKind] || deviceKind;
  const pageOverrides = config.behaviorScope === "page" ? config.pageBehaviors?.[targetPage] : null;
  const mergeSection = (sectionKey, defaults) => {
    const pageOverride = pageOverrides?.[sectionKey];
    return {
      ...defaults,
      ...config[sectionKey],
      ...(typeof pageOverride == "boolean"
        ? {
            enabled: pageOverride
          }
        : pageOverride || {})
    };
  };
  return {
    interaction: mergeSection("interaction", {
      rotationMode: config.camera?.rotationMode || "free",
      panEnabled: false,
      zoomEnabled: false
    }),
    autoRotate: mergeSection("autoRotate", {
      enabled: false,
      idleSeconds: 30,
      speed: 6,
      direction: "clockwise",
      returnToDefault: false
    }),
    idleExitFocus: mergeSection("idleExitFocus", {
      enabled: false,
      idleSeconds: 30
    }),
    idleHideIcons: mergeSection("idleHideIcons", {
      enabled: false,
      idleSeconds: 30
    }),
    hideIconsWhileRotating:
      typeof pageOverrides?.hideIconsWhileRotating == "boolean"
        ? pageOverrides.hideIconsWhileRotating
        : config.hideIconsWhileRotating === true
  };
}
