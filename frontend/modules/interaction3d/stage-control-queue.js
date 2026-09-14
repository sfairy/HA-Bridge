export function handleControlResult(sceneUpdating, queueControlCommand, lightPreviewController, value, previewToken) {
  const next = [...sceneUpdating.values()].find(entry => entry.entityId === value.entityId);
  if (!next) {
    return queueControlCommand(value, previewToken);
  }
  const service = next.next?.command || next.command;
  if (service.service === "turn_on" && value.service === "turn_on") {
    const brightness = {
      ...service.data
    };
    if ("brightness" in value.data || "brightness_pct" in value.data) {
      delete brightness.brightness;
      delete brightness.brightness_pct;
    }
    value = {
      ...value,
      data: {
        ...brightness,
        ...value.data
      }
    };
  }
  next.next = {
    command: value,
    previewToken: previewToken
  };
  lightPreviewController.hold(value.entityId, previewToken);
}
