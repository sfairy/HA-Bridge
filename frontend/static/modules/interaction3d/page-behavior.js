export function resolvePageBehavior(config = {}, pageKey = "light") {
  const behaviorKey = {
    climate: "environment",
    cover: "environment",
    nas: "devices",
    television: "devices",
    "vacuum-shortcut": "vacuum",
  }[pageKey] || pageKey;
  const pageBehavior =
    config.behaviorScope === "page" ? config.pageBehaviors?.[behaviorKey] : null;
  const mergeBehavior = (key, defaults) => {
    const override = pageBehavior?.[key];
    return {
      ...defaults,
      ...config[key],
      ...(typeof override == "boolean" ? { enabled: override } : override || {}),
    };
  };
  return {
    interaction: mergeBehavior("interaction", {
      rotationMode: config.camera?.rotationMode || "free",
      panEnabled: false,
      zoomEnabled: false,
    }),
    autoRotate: mergeBehavior("autoRotate", {
      enabled: false,
      idleSeconds: 30,
      speed: 6,
      direction: "clockwise",
      returnToDefault: false,
    }),
    idleExitFocus: mergeBehavior("idleExitFocus", {
      enabled: false,
      idleSeconds: 30,
    }),
    idleHideIcons: mergeBehavior("idleHideIcons", {
      enabled: false,
      idleSeconds: 30,
    }),
    hideIconsWhileRotating:
      typeof pageBehavior?.hideIconsWhileRotating == "boolean"
        ? pageBehavior.hideIconsWhileRotating
        : config.hideIconsWhileRotating === true,
  };
}
