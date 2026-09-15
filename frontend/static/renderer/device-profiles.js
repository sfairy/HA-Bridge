const XIAOMI_PLATFORMS = new Set(["xiaomi_miot", "xiaomi_home"]);
function entitySearchText(...searchParts) {
  return searchParts
    .flat()
    .map(part => String(part || "").trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
function entityIsUsable(candidateEntity) {
  return (
    !!candidateEntity?.entityId &&
    !candidateEntity.disabledBy &&
    candidateEntity.status !== "missing" &&
    candidateEntity.status !== "disabled"
  );
}
function scoreEntityForRole(entity, entityRole) {
  const domain = String(entity?.domain || entity?.entityId || "").split(".", 1)[0];
  const roleSearchText = entitySearchText(
    entity?.entityId,
    entity?.name,
    entity?.originalName,
    entity?.translationKey,
    entity?.uniqueId
  );
  const originalNameLower = String(entity?.originalName || "")
    .trim()
    .toLowerCase();
  if (entityRole === "climate") {
    if (domain === "climate") {
      return 100 + (/ptc.?bath|bath.?heater|浴霸|风暖/.test(roleSearchText) ? 40 : 0);
    } else {
      return -1;
    }
  }
  if (entityRole === "cover") {
    if (domain === "cover") {
      return 100;
    } else {
      return -1;
    }
  }
  if (entityRole === "fan") {
    if (domain === "fan") {
      return 100 + (/air.?purifier|airp|空气净化/.test(roleSearchText) ? 20 : 0);
    } else {
      return -1;
    }
  }
  if (entityRole === "light") {
    if (domain !== "light") {
      return -1;
    }
    let lightScore = 100;
    if (String(entity.translationKey || "").toLowerCase() === "light") {
      lightScore += 80;
    }
    if (["灯", "灯光", "照明"].includes(originalNameLower)) {
      lightScore += 70;
    }
    if (/(?:^|[_\s-])s_?2(?:[_\s-]|$)/.test(roleSearchText)) {
      lightScore += 25;
    }
    if (/indicator|ambient|night.?light|指示灯|氛围灯|夜灯/.test(roleSearchText)) {
      lightScore -= 140;
    }
    return lightScore;
  }
  if (entityRole === "power") {
    if (["switch", "input_boolean"].includes(domain)) {
      return (
        100 +
        (/(?:^|[_\s-])(on|power|heating)(?:[_\s-]|$)|开关|取暖|加热/.test(roleSearchText) ? 35 : 0)
      );
    } else {
      return -1;
    }
  } else if (entityRole === "mode") {
    if (domain !== "select") {
      return -1;
    } else {
      return 100 + (/mode|preset|模式|档位/.test(roleSearchText) ? 35 : 0);
    }
  } else if (entityRole === "temperature") {
    if (["sensor", "number"].includes(domain)) {
      if (/temperature|target.?temp|温度/.test(roleSearchText)) {
        return 130;
      } else {
        return 20;
      }
    } else {
      return -1;
    }
  } else if (entityRole === "humidity") {
    if (domain === "sensor" && /humidity|湿度/.test(roleSearchText)) {
      return 130;
    } else {
      return -1;
    }
  } else if (entityRole === "pm25") {
    if (domain === "sensor" && /pm.?2[._ ]?5|pm25|particulate|颗粒物/.test(roleSearchText)) {
      return 140;
    } else {
      return -1;
    }
  } else if (entityRole === "hcho") {
    if (
      domain !== "sensor" ||
      !/hcho|formaldehyde|甲醛/.test(roleSearchText) ||
      /original|raw|tag|serial|(?:^|[_\s-])sn(?:[_\s-]|$)|原始|标签|流水号|编号/.test(
        roleSearchText
      )
    ) {
      return -1;
    } else if (/density|concentration|密度|浓度/.test(roleSearchText)) {
      return 190;
    } else {
      return 160;
    }
  } else if (entityRole === "pm10") {
    if (domain === "sensor" && /pm.?10|粉尘/.test(roleSearchText)) {
      return 150;
    } else {
      return -1;
    }
  } else if (entityRole === "filterLeftTime") {
    if (domain !== "sensor" || /used|elapsed|已使用/.test(roleSearchText)) {
      return -1;
    } else if (
      /filter.*(?:left|remaining).*(?:time|hour)|(?:left|remaining).*(?:time|hour).*filter|滤芯.*(?:剩余时间|剩余时长)/.test(
        roleSearchText
      )
    ) {
      return 180;
    } else {
      return -1;
    }
  } else if (entityRole === "filterLife") {
    if (
      domain !== "sensor" ||
      /serial|factory|product|tag|date|(?:^|[_\s-])sn(?:[_\s-]|$)|used|time|hour|流水号|工厂|生产|标签|类型码|已使用|剩余时间|剩余时长/.test(
        roleSearchText
      )
    ) {
      return -1;
    } else if (
      /filter.*(?:life|level)|(?:life|level).*filter|滤芯.*寿命|剩余寿命/.test(roleSearchText)
    ) {
      return 180;
    } else if (/滤芯/.test(roleSearchText)) {
      return 135;
    } else {
      return -1;
    }
  } else if (
    entityRole === "airQuality" &&
    domain === "sensor" &&
    /air.?quality|aqi|空气质量/.test(roleSearchText)
  ) {
    return 130;
  } else {
    return -1;
  }
}
function pickBestEntityForRole(entityList, targetRole) {
  return (
    entityList
      .map(scoredEntityInput => ({
        entity: scoredEntityInput,
        score: scoreEntityForRole(scoredEntityInput, targetRole)
      }))
      .filter(scoredEntry => scoredEntry.score >= 0)
      .sort(
        (leftScoredEntry, rightScoredEntry) =>
          rightScoredEntry.score - leftScoredEntry.score ||
          String(leftScoredEntry.entity.entityId || "").length -
            String(rightScoredEntry.entity.entityId || "").length ||
          String(leftScoredEntry.entity.entityId || "").localeCompare(
            String(rightScoredEntry.entity.entityId || "")
          )
      )[0]?.entity || null
  );
}
function pickBestBedControlEntity(entities, role) {
  return (
    entities
      .filter(bedEntity => {
        const bedEntityDomain = String(bedEntity?.domain || bedEntity?.entityId || "").split(
          ".",
          1
        )[0];
        const bedEntitySearchText = entitySearchText(
          bedEntity?.entityId,
          bedEntity?.name,
          bedEntity?.originalName,
          bedEntity?.translationKey,
          bedEntity?.uniqueId
        );
        if (role === "backrest") {
          return bedEntityDomain === "number" && /backrest|靠背/.test(bedEntitySearchText);
        } else if (role === "leg") {
          return bedEntityDomain === "number" && /leg|腿部|腿/.test(bedEntitySearchText);
        } else if (role === "waist") {
          return bedEntityDomain === "number" && /waist|腰部|腰/.test(bedEntitySearchText);
        } else if (role === "mode") {
          return (
            bedEntityDomain === "select" &&
            /mode|模式/.test(bedEntitySearchText) &&
            !/memory|记忆|姿势/.test(bedEntitySearchText)
          );
        } else if (role === "memory") {
          return (
            ["button", "select"].includes(bedEntityDomain) &&
            /memory|记忆|姿势/.test(bedEntitySearchText)
          );
        } else {
          return false;
        }
      })
      .sort((leftEntity, rightEntity) =>
        String(leftEntity.entityId || "").localeCompare(String(rightEntity.entityId || ""))
      )[0] || null
  );
}
export function xiaomiIntegration(entityMetadata) {
  const platform = String(entityMetadata?.platform || "")
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
  entitiesById = new Map(),
  devicesById = new Map(),
  statesByEntityId = new Map()
) {
  const primaryEntity = entitiesById?.get?.(entityId) || null;
  const integration = xiaomiIntegration(primaryEntity);
  if (!primaryEntity || !integration) {
    return null;
  }
  const deviceId = String(primaryEntity.deviceId || "");
  const deviceMetadata = (deviceId && devicesById?.get?.(deviceId)) || null;
  const deviceEntities = [...(entitiesById?.values?.() || [])].filter(
    sameDeviceCandidate =>
      entityIsUsable(sameDeviceCandidate) &&
      (deviceId
        ? sameDeviceCandidate.deviceId === deviceId
        : sameDeviceCandidate.entityId === entityId) &&
      xiaomiIntegration(sameDeviceCandidate) === integration
  );
  if (
    !deviceEntities.some(candidate => candidate.entityId === primaryEntity.entityId) &&
    entityIsUsable(primaryEntity)
  ) {
    deviceEntities.push(primaryEntity);
  }
  const stateEntry = statesByEntityId?.get?.(entityId);
  const stateObject = stateEntry?.newState || stateEntry || {};
  const searchText = entitySearchText(
    integration,
    deviceMetadata?.name,
    deviceMetadata?.manufacturer,
    deviceMetadata?.model,
    stateObject?.attributes?.friendly_name,
    deviceEntities.flatMap(profileCandidate => [
      profileCandidate.entityId,
      profileCandidate.name,
      profileCandidate.originalName,
      profileCandidate.translationKey,
      profileCandidate.uniqueId
    ])
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
      "airQuality"
    ]
      .map(roleKey => [roleKey, pickBestEntityForRole(deviceEntities, roleKey)?.entityId || ""])
      .filter(([, resolvedEntityId]) => resolvedEntityId)
  );
  const bedControlEntityIds = {
    backrest: pickBestBedControlEntity(deviceEntities, "backrest")?.entityId || "",
    leg: pickBestBedControlEntity(deviceEntities, "leg")?.entityId || "",
    waist: pickBestBedControlEntity(deviceEntities, "waist")?.entityId || "",
    mode: pickBestBedControlEntity(deviceEntities, "mode")?.entityId || ""
  };
  const selectEntities = deviceEntities
    .filter(
      selectEntity =>
        String(selectEntity?.domain || selectEntity?.entityId || "").split(".", 1)[0] === "select"
    )
    .sort((leftSelectEntity, rightSelectEntity) =>
      String(leftSelectEntity.entityId || "").localeCompare(
        String(rightSelectEntity.entityId || "")
      )
    );
  if (selectEntities.length) {
    const scoreSelectEntity = rankedSelectEntity => {
      const selectSearchText = entitySearchText(
        rankedSelectEntity.entityId,
        rankedSelectEntity.name,
        rankedSelectEntity.originalName,
        rankedSelectEntity.translationKey,
        rankedSelectEntity.uniqueId
      );
      const selectOptions = statesByEntityId?.get?.(rankedSelectEntity.entityId)?.attributes
        ?.options;
      const modeScoreBonus = /mode|模式|工作模式|operation|function/.test(selectSearchText)
        ? 320
        : 0;
      const memoryScorePenalty = /memory|记忆|姿势/.test(selectSearchText) ? -520 : 0;
      return (
        modeScoreBonus + memoryScorePenalty + Math.min(80, Number(selectOptions?.length || 0) * 8)
      );
    };
    const nonMemorySelects = selectEntities.filter(
      filteredSelectEntity =>
        !/memory|记忆|姿势/.test(
          entitySearchText(
            filteredSelectEntity.entityId,
            filteredSelectEntity.name,
            filteredSelectEntity.originalName,
            filteredSelectEntity.translationKey,
            filteredSelectEntity.uniqueId
          )
        )
    );
    const rankedSelects = (nonMemorySelects.length ? nonMemorySelects : selectEntities).sort(
      (leftRankedSelect, rightRankedSelect) =>
        scoreSelectEntity(rightRankedSelect) - scoreSelectEntity(leftRankedSelect) ||
        String(leftRankedSelect.entityId || "").localeCompare(
          String(rightRankedSelect.entityId || "")
        )
    );
    bedControlEntityIds.mode = rankedSelects[0]?.entityId || bedControlEntityIds.mode;
  }
  const memoryEntities = deviceEntities
    .filter(memoryEntity => {
      const memoryDomain = String(memoryEntity?.domain || memoryEntity?.entityId || "").split(
        ".",
        1
      )[0];
      const memorySearchText = entitySearchText(
        memoryEntity?.entityId,
        memoryEntity?.name,
        memoryEntity?.originalName,
        memoryEntity?.translationKey,
        memoryEntity?.uniqueId
      );
      return (
        ["button", "select"].includes(memoryDomain) && /memory|记忆|姿势/.test(memorySearchText)
      );
    })
    .sort((leftMemoryEntity, rightMemoryEntity) =>
      String(leftMemoryEntity.entityId || "").localeCompare(
        String(rightMemoryEntity.entityId || "")
      )
    );
  const buttonEntities = deviceEntities
    .filter(
      buttonEntity =>
        String(buttonEntity?.domain || buttonEntity?.entityId || "").split(".", 1)[0] === "button"
    )
    .sort((leftButtonEntity, rightButtonEntity) =>
      String(leftButtonEntity.entityId || "").localeCompare(
        String(rightButtonEntity.entityId || "")
      )
    );
  const remainingSelectEntities = deviceEntities
    .filter(
      remainingSelectEntity =>
        String(remainingSelectEntity?.domain || remainingSelectEntity?.entityId || "").split(
          ".",
          1
        )[0] === "select" && remainingSelectEntity.entityId !== bedControlEntityIds.mode
    )
    .sort((leftRemainingSelect, rightRemainingSelect) =>
      String(leftRemainingSelect.entityId || "").localeCompare(
        String(rightRemainingSelect.entityId || "")
      )
    );
  const buttonOrSelectEntities = buttonEntities.length ? buttonEntities : remainingSelectEntities;
  const memoryCandidateEntities = memoryEntities.length ? memoryEntities : buttonOrSelectEntities;
  bedControlEntityIds.memory1 = memoryCandidateEntities[0]?.entityId || "";
  bedControlEntityIds.memory2 = memoryCandidateEntities[1]?.entityId || "";
  const isElectricBed = /electric.?bed|smart.?bed|bed\.\d+|milan|电动床|智能床/.test(searchText);
  const hasAllBedControls =
    !!bedControlEntityIds.backrest &&
    !!bedControlEntityIds.leg &&
    !!bedControlEntityIds.waist &&
    !!bedControlEntityIds.mode;
  const primaryDomain = String(primaryEntity.domain || primaryEntity.entityId || "").split(
    ".",
    1
  )[0];
  const isBathHeater = /bath.?heater|ptc.?bath|(?:^|[._-])bhf(?:[._-]|$)|浴霸|风暖|暖风机/.test(
    searchText
  );
  const isAirConditioner = /air.?condition|aircondition|aircon|空调/.test(searchText);
  const isAirPurifier = /air.?purifier|(?:^|[._-])airp(?:[._-]|$)|空气净化/.test(searchText);
  let deviceType = "generic";
  if (isElectricBed || hasAllBedControls) {
    deviceType = "electric-bed";
  } else if (isBathHeater && (roleEntityIds.climate || roleEntityIds.fan)) {
    deviceType = "bath-heater";
  } else if (isAirConditioner && roleEntityIds.climate) {
    deviceType = "air-conditioner";
  } else if (roleEntityIds.cover) {
    deviceType = "cover";
  } else if (isAirPurifier && roleEntityIds.fan) {
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
    roleEntityIds.cover && /airer|clothes.?rack|laundry.?rack|晾衣机|晾衣架/.test(searchText)
      ? "airer"
      : roleEntityIds.cover && /dream|vertical|novo\.curtain|梦幻|竖帘|垂直帘/.test(searchText)
        ? "dream"
        : roleEntityIds.cover
          ? "standard"
          : "";
  return {
    integration: integration,
    integrationLabel: integration === "xiaomi_home" ? "Xiaomi Home" : "Xiaomi Miot",
    deviceId: deviceId,
    deviceName: String(
      deviceMetadata?.name ||
        stateObject?.attributes?.friendly_name ||
        primaryEntity.name ||
        entityId
    ),
    manufacturer: String(deviceMetadata?.manufacturer || ""),
    model: String(deviceMetadata?.model || ""),
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
      ...(deviceType === "electric-bed" ? bedControlEntityIds : {})
    },
    entityIds: deviceEntities.map(deviceEntity => deviceEntity.entityId),
    confidence: deviceType === "generic" ? "standard-fallback" : "xiaomi-profile"
  };
}
export function applyXiaomiDeviceProfile(component, profile) {
  if (!component || !profile) {
    return component;
  }
  const nextProperties = {
    ...(component.properties || {})
  };
  if (
    (!nextProperties.deviceType || nextProperties.deviceType === "auto") &&
    ["air-conditioner", "bath-heater"].includes(profile.deviceType)
  ) {
    nextProperties.deviceType = profile.deviceType;
  }
  if ((!nextProperties.coverKind || nextProperties.coverKind === "auto") && profile.coverKind) {
    nextProperties.coverKind = profile.coverKind;
  }
  return {
    ...component,
    properties: nextProperties
  };
}
