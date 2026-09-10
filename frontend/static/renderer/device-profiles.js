const XIAOMI_PLATFORMS = new Set(["xiaomi_miot", "xiaomi_home"]);
function normalizeMatchText(...parts) {
  return parts
    .flat()
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
function entityIsAvailable(metadata) {
  return (
    !!metadata?.entityId &&
    !metadata.disabledBy &&
    metadata.status !== "missing" &&
    metadata.status !== "disabled"
  );
}
function entityMatchScore(metadata, role) {
  const domain = String(metadata?.domain || metadata?.entityId || "").split(
    ".",
    1,
  )[0];
  const matchText = normalizeMatchText(
    metadata?.entityId,
    metadata?.name,
    metadata?.originalName,
    metadata?.translationKey,
    metadata?.uniqueId,
  );
  const originalNameLower = String(metadata?.originalName || "")
    .trim()
    .toLowerCase();
  if (role === "climate") {
    if (domain === "climate") {
      return 100 + (/ptc.?bath|bath.?heater|浴霸|风暖/.test(matchText) ? 40 : 0);
    } else {
      return -1;
    }
  }
  if (role === "cover") {
    if (domain === "cover") {
      return 100;
    } else {
      return -1;
    }
  }
  if (role === "fan") {
    if (domain === "fan") {
      return 100 + (/air.?purifier|airp|空气净化/.test(matchText) ? 20 : 0);
    } else {
      return -1;
    }
  }
  if (role === "light") {
    if (domain !== "light") {
      return -1;
    }
    let score = 100;
    if (String(metadata.translationKey || "").toLowerCase() === "light") {
      score += 80;
    }
    if (["灯", "灯光", "照明"].includes(originalNameLower)) {
      score += 70;
    }
    if (/(?:^|[_\s-])s_?2(?:[_\s-]|$)/.test(matchText)) {
      score += 25;
    }
    if (/indicator|ambient|night.?light|指示灯|氛围灯|夜灯/.test(matchText)) {
      score -= 140;
    }
    return score;
  }
  if (role === "power") {
    if (["switch", "input_boolean"].includes(domain)) {
      return (
        100 +
        (/(?:^|[_\s-])(on|power|heating)(?:[_\s-]|$)|开关|取暖|加热/.test(
          matchText,
        )
          ? 35
          : 0)
      );
    } else {
      return -1;
    }
  } else if (role === "mode") {
    if (domain !== "select") {
      return -1;
    } else {
      return 100 + (/mode|preset|模式|档位/.test(matchText) ? 35 : 0);
    }
  } else if (role === "temperature") {
    if (["sensor", "number"].includes(domain)) {
      if (/temperature|target.?temp|温度/.test(matchText)) {
        return 130;
      } else {
        return 20;
      }
    } else {
      return -1;
    }
  } else if (role === "humidity") {
    if (domain === "sensor" && /humidity|湿度/.test(matchText)) {
      return 130;
    } else {
      return -1;
    }
  } else if (role === "pm25") {
    if (
      domain === "sensor" &&
      /pm.?2[._ ]?5|pm25|particulate|颗粒物/.test(matchText)
    ) {
      return 140;
    } else {
      return -1;
    }
  } else if (role === "hcho") {
    if (
      domain !== "sensor" ||
      !/hcho|formaldehyde|甲醛/.test(matchText) ||
      /original|raw|tag|serial|(?:^|[_\s-])sn(?:[_\s-]|$)|原始|标签|流水号|编号/.test(
        matchText,
      )
    ) {
      return -1;
    } else if (/density|concentration|密度|浓度/.test(matchText)) {
      return 190;
    } else {
      return 160;
    }
  } else if (role === "pm10") {
    if (domain === "sensor" && /pm.?10|粉尘/.test(matchText)) {
      return 150;
    } else {
      return -1;
    }
  } else if (role === "filterLeftTime") {
    if (domain !== "sensor" || /used|elapsed|已使用/.test(matchText)) {
      return -1;
    } else if (
      /filter.*(?:left|remaining).*(?:time|hour)|(?:left|remaining).*(?:time|hour).*filter|滤芯.*(?:剩余时间|剩余时长)/.test(
        matchText,
      )
    ) {
      return 180;
    } else {
      return -1;
    }
  } else if (role === "filterLife") {
    if (
      domain !== "sensor" ||
      /serial|factory|product|tag|date|(?:^|[_\s-])sn(?:[_\s-]|$)|used|time|hour|流水号|工厂|生产|标签|类型码|已使用|剩余时间|剩余时长/.test(
        matchText,
      )
    ) {
      return -1;
    } else if (
      /filter.*(?:life|level)|(?:life|level).*filter|滤芯.*寿命|剩余寿命/.test(
        matchText,
      )
    ) {
      return 180;
    } else if (/滤芯/.test(matchText)) {
      return 135;
    } else {
      return -1;
    }
  } else if (
    role === "airQuality" &&
    domain === "sensor" &&
    /air.?quality|aqi|空气质量/.test(matchText)
  ) {
    return 130;
  } else {
    return -1;
  }
}
function selectBestMatchedEntity(entities, role) {
  return (
    entities
      .map((entity) => ({
        entity: entity,
        score: entityMatchScore(entity, role),
      }))
      .filter((candidate) => candidate.score >= 0)
      .sort(
        (left, right) =>
          right.score - left.score ||
          String(left.entity.entityId || "").length -
            String(right.entity.entityId || "").length ||
          String(left.entity.entityId || "").localeCompare(
            String(right.entity.entityId || ""),
          ),
      )[0]?.entity || null
  );
}
function selectElectricBedEntity(entities, role) {
  return (
    entities
      .filter((metadata) => {
        const domain = String(
          metadata?.domain || metadata?.entityId || "",
        ).split(".", 1)[0];
        const matchText = normalizeMatchText(
          metadata?.entityId,
          metadata?.name,
          metadata?.originalName,
          metadata?.translationKey,
          metadata?.uniqueId,
        );
        if (role === "backrest") {
          return domain === "number" && /backrest|靠背/.test(matchText);
        } else if (role === "leg") {
          return domain === "number" && /leg|腿部|腿/.test(matchText);
        } else if (role === "waist") {
          return domain === "number" && /waist|腰部|腰/.test(matchText);
        } else if (role === "mode") {
          return (
            domain === "select" &&
            /mode|模式/.test(matchText) &&
            !/memory|记忆|姿势/.test(matchText)
          );
        } else if (role === "memory") {
          return (
            ["button", "select"].includes(domain) &&
            /memory|记忆|姿势/.test(matchText)
          );
        } else {
          return false;
        }
      })
      .sort((left, right) =>
        String(left.entityId || "").localeCompare(
          String(right.entityId || ""),
        ),
      )[0] || null
  );
}
export function xiaomiIntegration(metadata) {
  const platform = String(metadata?.platform || "")
    .trim()
    .toLowerCase();
  if (XIAOMI_PLATFORMS.has(platform)) {
    return platform;
  } else {
    return "";
  }
}
export function resolveXiaomiDeviceProfile(
  entityId,
  entityMetadataById = new Map(),
  deviceRegistryById = new Map(),
  entityStateById = new Map(),
) {
  const metadata = entityMetadataById?.get?.(entityId) || null;
  const integration = xiaomiIntegration(metadata);
  if (!metadata || !integration) {
    return null;
  }
  const deviceId = String(metadata.deviceId || "");
  const deviceRegistryEntry = (deviceId && deviceRegistryById?.get?.(deviceId)) || null;
  const relatedEntities = [...(entityMetadataById?.values?.() || [])].filter(
    (relatedMetadata) =>
      entityIsAvailable(relatedMetadata) &&
      (deviceId
        ? relatedMetadata.deviceId === deviceId
        : relatedMetadata.entityId === entityId) &&
      xiaomiIntegration(relatedMetadata) === integration,
  );
  if (
    !relatedEntities.some((related) => related.entityId === metadata.entityId) &&
    entityIsAvailable(metadata)
  ) {
    relatedEntities.push(metadata);
  }
  const entityStateEntry = entityStateById?.get?.(entityId);
  const entityState = entityStateEntry?.newState || entityStateEntry || {};
  const deviceMatchText = normalizeMatchText(
    integration,
    deviceRegistryEntry?.name,
    deviceRegistryEntry?.manufacturer,
    deviceRegistryEntry?.model,
    entityState?.attributes?.friendly_name,
    relatedEntities.flatMap((related) => [
      related.entityId,
      related.name,
      related.originalName,
      related.translationKey,
      related.uniqueId,
    ]),
  );
  const roleEntityIds = Object.fromEntries(
    [
      "climate",
      "cover",
      "fan",
      "light",
      "power",
      "mode",
      "temperature",
      "humidity",
      "pm25",
      "hcho",
      "pm10",
      "filterLife",
      "filterLeftTime",
      "airQuality",
    ]
      .map((role) => [role, selectBestMatchedEntity(relatedEntities, role)?.entityId || ""])
      .filter(([, matchedEntityId]) => matchedEntityId),
  );
  const electricBedRoles = {
    backrest: selectElectricBedEntity(relatedEntities, "backrest")?.entityId || "",
    leg: selectElectricBedEntity(relatedEntities, "leg")?.entityId || "",
    waist: selectElectricBedEntity(relatedEntities, "waist")?.entityId || "",
    mode: selectElectricBedEntity(relatedEntities, "mode")?.entityId || "",
  };
  const selectEntities = relatedEntities
    .filter(
      (relatedMetadata) =>
        String(relatedMetadata?.domain || relatedMetadata?.entityId || "").split(
          ".",
          1,
        )[0] === "select",
    )
    .sort((left, right) =>
      String(left.entityId || "").localeCompare(
        String(right.entityId || ""),
      ),
    );
  if (selectEntities.length) {
    const modeSelectScore = (selectEntity) => {
      const matchText = normalizeMatchText(
        selectEntity.entityId,
        selectEntity.name,
        selectEntity.originalName,
        selectEntity.translationKey,
        selectEntity.uniqueId,
      );
      const options = entityStateById?.get?.(selectEntity.entityId)?.attributes?.options;
      const modeBonus = /mode|模式|工作模式|operation|function/.test(matchText)
        ? 320
        : 0;
      const memoryPenalty = /memory|记忆|姿势/.test(matchText) ? -520 : 0;
      return modeBonus + memoryPenalty + Math.min(80, Number(options?.length || 0) * 8);
    };
    const nonMemorySelects = selectEntities.filter(
      (selectEntity) =>
        !/memory|记忆|姿势/.test(
          normalizeMatchText(
            selectEntity.entityId,
            selectEntity.name,
            selectEntity.originalName,
            selectEntity.translationKey,
            selectEntity.uniqueId,
          ),
        ),
    );
    const rankedSelects = (nonMemorySelects.length ? nonMemorySelects : selectEntities).sort(
      (left, right) =>
        modeSelectScore(right) - modeSelectScore(left) ||
        String(left.entityId || "").localeCompare(
          String(right.entityId || ""),
        ),
    );
    electricBedRoles.mode = rankedSelects[0]?.entityId || electricBedRoles.mode;
  }
  const memoryEntities = relatedEntities
    .filter((relatedMetadata) => {
      const domain = String(
        relatedMetadata?.domain || relatedMetadata?.entityId || "",
      ).split(".", 1)[0];
      const matchText = normalizeMatchText(
        relatedMetadata?.entityId,
        relatedMetadata?.name,
        relatedMetadata?.originalName,
        relatedMetadata?.translationKey,
        relatedMetadata?.uniqueId,
      );
      return (
        ["button", "select"].includes(domain) &&
        /memory|记忆|姿势/.test(matchText)
      );
    })
    .sort((left, right) =>
      String(left.entityId || "").localeCompare(
        String(right.entityId || ""),
      ),
    );
  const buttonEntities = relatedEntities
    .filter(
      (relatedMetadata) =>
        String(relatedMetadata?.domain || relatedMetadata?.entityId || "").split(
          ".",
          1,
        )[0] === "button",
    )
    .sort((left, right) =>
      String(left.entityId || "").localeCompare(
        String(right.entityId || ""),
      ),
    );
  const otherSelectEntities = relatedEntities
    .filter(
      (relatedMetadata) =>
        String(relatedMetadata?.domain || relatedMetadata?.entityId || "").split(
          ".",
          1,
        )[0] === "select" && relatedMetadata.entityId !== electricBedRoles.mode,
    )
    .sort((left, right) =>
      String(left.entityId || "").localeCompare(
        String(right.entityId || ""),
      ),
    );
  const buttonOrSelectFallback = buttonEntities.length ? buttonEntities : otherSelectEntities;
  const memoryCandidates = memoryEntities.length ? memoryEntities : buttonOrSelectFallback;
  electricBedRoles.memory1 = memoryCandidates[0]?.entityId || "";
  electricBedRoles.memory2 = memoryCandidates[1]?.entityId || "";
  const looksLikeElectricBed = /electric.?bed|smart.?bed|bed\.\d+|milan|电动床|智能床/.test(
    deviceMatchText,
  );
  const hasFullElectricBedRoles =
    !!electricBedRoles.backrest && !!electricBedRoles.leg && !!electricBedRoles.waist && !!electricBedRoles.mode;
  const primaryDomain = String(metadata.domain || metadata.entityId || "").split(
    ".",
    1,
  )[0];
  const looksLikeBathHeater =
    /bath.?heater|ptc.?bath|(?:^|[._-])bhf(?:[._-]|$)|浴霸|风暖|暖风机/.test(
      deviceMatchText,
    );
  const looksLikeAirConditioner = /air.?condition|aircondition|aircon|空调/.test(deviceMatchText);
  const looksLikeAirPurifier = /air.?purifier|(?:^|[._-])airp(?:[._-]|$)|空气净化/.test(
    deviceMatchText,
  );
  let deviceType = "generic";
  if (looksLikeElectricBed || hasFullElectricBedRoles) {
    deviceType = "electric-bed";
  } else if (looksLikeBathHeater && (roleEntityIds.climate || roleEntityIds.fan)) {
    deviceType = "bath-heater";
  } else if (looksLikeAirConditioner && roleEntityIds.climate) {
    deviceType = "air-conditioner";
  } else if (roleEntityIds.cover) {
    deviceType = "cover";
  } else if (looksLikeAirPurifier && roleEntityIds.fan) {
    deviceType = "air-purifier";
  } else if (roleEntityIds.climate) {
    deviceType = primaryDomain === "climate" ? "air-conditioner" : "generic";
  } else if (roleEntityIds.fan) {
    deviceType = "fan";
  } else if (roleEntityIds.light && primaryDomain === "light") {
    deviceType = "light";
  } else if (roleEntityIds.power && ["switch", "input_boolean"].includes(primaryDomain)) {
    deviceType = "switch";
  }
  const coverKind =
    roleEntityIds.cover &&
    /airer|clothes.?rack|laundry.?rack|晾衣机|晾衣架/.test(deviceMatchText)
      ? "airer"
      : roleEntityIds.cover &&
          /dream|vertical|novo\.curtain|梦幻|竖帘|垂直帘/.test(deviceMatchText)
        ? "dream"
        : roleEntityIds.cover
          ? "standard"
          : "";
  return {
    integration: integration,
    integrationLabel:
      integration === "xiaomi_home" ? "Xiaomi Home" : "Xiaomi Miot",
    deviceId: deviceId,
    deviceName: String(
      deviceRegistryEntry?.name ||
        entityState?.attributes?.friendly_name ||
        metadata.name ||
        entityId,
    ),
    manufacturer: String(deviceRegistryEntry?.manufacturer || ""),
    model: String(deviceRegistryEntry?.model || ""),
    deviceType: deviceType,
    coverKind: coverKind,
    roles: {
      primary:
        roleEntityIds.climate ||
        roleEntityIds.cover ||
        roleEntityIds.fan ||
        roleEntityIds.light ||
        roleEntityIds.power ||
        entityId,
      ...roleEntityIds,
      ...(deviceType === "electric-bed" ? electricBedRoles : {}),
    },
    entityIds: relatedEntities.map((related) => related.entityId),
    confidence:
      deviceType === "generic" ? "standard-fallback" : "xiaomi-profile",
  };
}
export function applyXiaomiDeviceProfile(component, profile) {
  if (!component || !profile) {
    return component;
  }
  const properties = {
    ...(component.properties || {}),
  };
  if (
    (!properties.deviceType || properties.deviceType === "auto") &&
    ["air-conditioner", "bath-heater"].includes(profile.deviceType)
  ) {
    properties.deviceType = profile.deviceType;
  }
  if (
    (!properties.coverKind || properties.coverKind === "auto") &&
    profile.coverKind
  ) {
    properties.coverKind = profile.coverKind;
  }
  return {
    ...component,
    properties: properties,
  };
}
