const bag = new Set(["xiaomi_miot", "xiaomi_home"]);
function normalizeMatchText(...value) {
  return value
    .flat()
    .map((value2) => String(value2 || "").trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
function fn2(metadata) {
  return (
    !!metadata?.entityId &&
    !metadata.disabledBy &&
    metadata.status !== "missing" &&
    metadata.status !== "disabled"
  );
}
function entityMatchScore(metadata, value2) {
  const value3 = String(metadata?.domain || metadata?.entityId || "").split(
    ".",
    1,
  )[0];
  const value4 = normalizeMatchText(
    metadata?.entityId,
    metadata?.name,
    metadata?.originalName,
    metadata?.translationKey,
    metadata?.uniqueId,
  );
  const value5 = String(metadata?.originalName || "")
    .trim()
    .toLowerCase();
  if (value2 === "climate") {
    if (value3 === "climate") {
      return 100 + (/ptc.?bath|bath.?heater|浴霸|风暖/.test(value4) ? 40 : 0);
    } else {
      return -1;
    }
  }
  if (value2 === "cover") {
    if (value3 === "cover") {
      return 100;
    } else {
      return -1;
    }
  }
  if (value2 === "fan") {
    if (value3 === "fan") {
      return 100 + (/air.?purifier|airp|空气净化/.test(value4) ? 20 : 0);
    } else {
      return -1;
    }
  }
  if (value2 === "light") {
    if (value3 !== "light") {
      return -1;
    }
    let value6 = 100;
    if (String(metadata.translationKey || "").toLowerCase() === "light") {
      value6 += 80;
    }
    if (["灯", "灯光", "照明"].includes(value5)) {
      value6 += 70;
    }
    if (/(?:^|[_\s-])s_?2(?:[_\s-]|$)/.test(value4)) {
      value6 += 25;
    }
    if (/indicator|ambient|night.?light|指示灯|氛围灯|夜灯/.test(value4)) {
      value6 -= 140;
    }
    return value6;
  }
  if (value2 === "power") {
    if (["switch", "input_boolean"].includes(value3)) {
      return (
        100 +
        (/(?:^|[_\s-])(on|power|heating)(?:[_\s-]|$)|开关|取暖|加热/.test(
          value4,
        )
          ? 35
          : 0)
      );
    } else {
      return -1;
    }
  } else if (value2 === "mode") {
    if (value3 !== "select") {
      return -1;
    } else {
      return 100 + (/mode|preset|模式|档位/.test(value4) ? 35 : 0);
    }
  } else if (value2 === "temperature") {
    if (["sensor", "number"].includes(value3)) {
      if (/temperature|target.?temp|温度/.test(value4)) {
        return 130;
      } else {
        return 20;
      }
    } else {
      return -1;
    }
  } else if (value2 === "humidity") {
    if (value3 === "sensor" && /humidity|湿度/.test(value4)) {
      return 130;
    } else {
      return -1;
    }
  } else if (value2 === "pm25") {
    if (
      value3 === "sensor" &&
      /pm.?2[._ ]?5|pm25|particulate|颗粒物/.test(value4)
    ) {
      return 140;
    } else {
      return -1;
    }
  } else if (value2 === "hcho") {
    if (
      value3 !== "sensor" ||
      !/hcho|formaldehyde|甲醛/.test(value4) ||
      /original|raw|tag|serial|(?:^|[_\s-])sn(?:[_\s-]|$)|原始|标签|流水号|编号/.test(
        value4,
      )
    ) {
      return -1;
    } else if (/density|concentration|密度|浓度/.test(value4)) {
      return 190;
    } else {
      return 160;
    }
  } else if (value2 === "pm10") {
    if (value3 === "sensor" && /pm.?10|粉尘/.test(value4)) {
      return 150;
    } else {
      return -1;
    }
  } else if (value2 === "filterLeftTime") {
    if (value3 !== "sensor" || /used|elapsed|已使用/.test(value4)) {
      return -1;
    } else if (
      /filter.*(?:left|remaining).*(?:time|hour)|(?:left|remaining).*(?:time|hour).*filter|滤芯.*(?:剩余时间|剩余时长)/.test(
        value4,
      )
    ) {
      return 180;
    } else {
      return -1;
    }
  } else if (value2 === "filterLife") {
    if (
      value3 !== "sensor" ||
      /serial|factory|product|tag|date|(?:^|[_\s-])sn(?:[_\s-]|$)|used|time|hour|流水号|工厂|生产|标签|类型码|已使用|剩余时间|剩余时长/.test(
        value4,
      )
    ) {
      return -1;
    } else if (
      /filter.*(?:life|level)|(?:life|level).*filter|滤芯.*寿命|剩余寿命/.test(
        value4,
      )
    ) {
      return 180;
    } else if (/滤芯/.test(value4)) {
      return 135;
    } else {
      return -1;
    }
  } else if (
    value2 === "airQuality" &&
    value3 === "sensor" &&
    /air.?quality|aqi|空气质量/.test(value4)
  ) {
    return 130;
  } else {
    return -1;
  }
}
function selectBestMatchedEntity(value, value2) {
  return (
    value
      .map((entity) => ({
        entity: entity,
        score: entityMatchScore(entity, value2),
      }))
      .filter((value3) => value3.score >= 0)
      .sort(
        (value3, value4) =>
          value4.score - value3.score ||
          String(value3.entity.entityId || "").length -
            String(value4.entity.entityId || "").length ||
          String(value3.entity.entityId || "").localeCompare(
            String(value4.entity.entityId || ""),
          ),
      )[0]?.entity || null
  );
}
function fn3(value, value2) {
  return (
    value
      .filter((metadata) => {
        const value4 = String(
          metadata?.domain || metadata?.entityId || "",
        ).split(".", 1)[0];
        const value5 = normalizeMatchText(
          metadata?.entityId,
          metadata?.name,
          metadata?.originalName,
          metadata?.translationKey,
          metadata?.uniqueId,
        );
        if (value2 === "backrest") {
          return value4 === "number" && /backrest|靠背/.test(value5);
        } else if (value2 === "leg") {
          return value4 === "number" && /leg|腿部|腿/.test(value5);
        } else if (value2 === "waist") {
          return value4 === "number" && /waist|腰部|腰/.test(value5);
        } else if (value2 === "mode") {
          return (
            value4 === "select" &&
            /mode|模式/.test(value5) &&
            !/memory|记忆|姿势/.test(value5)
          );
        } else if (value2 === "memory") {
          return (
            ["button", "select"].includes(value4) &&
            /memory|记忆|姿势/.test(value5)
          );
        } else {
          return false;
        }
      })
      .sort((value3, value4) =>
        String(value3.entityId || "").localeCompare(
          String(value4.entityId || ""),
        ),
      )[0] || null
  );
}
export function xiaomiIntegration(value) {
  const value2 = String(value?.platform || "")
    .trim()
    .toLowerCase();
  if (bag.has(value2)) {
    return value2;
  } else {
    return "";
  }
}
export function resolveXiaomiDeviceProfile(
  value,
  value2 = new Map(),
  value3 = new Map(),
  value4 = new Map(),
) {
  const metadata = value2?.get?.(value) || null;
  const integration = xiaomiIntegration(metadata);
  if (!metadata || !integration) {
    return null;
  }
  const deviceId = String(metadata.deviceId || "");
  const value6 = (deviceId && value3?.get?.(deviceId)) || null;
  const value7 = [...(value2?.values?.() || [])].filter(
    (metadata2) =>
      fn2(metadata2) &&
      (deviceId
        ? metadata2.deviceId === deviceId
        : metadata2.entityId === value) &&
      xiaomiIntegration(metadata2) === integration,
  );
  if (
    !value7.some((value25) => value25.entityId === metadata.entityId) &&
    fn2(metadata)
  ) {
    value7.push(metadata);
  }
  const value8 = value4?.get?.(value);
  const value9 = value8?.newState || value8 || {};
  const value10 = normalizeMatchText(
    integration,
    value6?.name,
    value6?.manufacturer,
    value6?.model,
    value9?.attributes?.friendly_name,
    value7.flatMap((value25) => [
      value25.entityId,
      value25.name,
      value25.originalName,
      value25.translationKey,
      value25.uniqueId,
    ]),
  );
  const value11 = Object.fromEntries(
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
      .map((value25) => [value25, selectBestMatchedEntity(value7, value25)?.entityId || ""])
      .filter(([, value25]) => value25),
  );
  const value12 = {
    backrest: fn3(value7, "backrest")?.entityId || "",
    leg: fn3(value7, "leg")?.entityId || "",
    waist: fn3(value7, "waist")?.entityId || "",
    mode: fn3(value7, "mode")?.entityId || "",
  };
  const value13 = value7
    .filter(
      (metadata2) =>
        String(metadata2?.domain || metadata2?.entityId || "").split(
          ".",
          1,
        )[0] === "select",
    )
    .sort((value25, value26) =>
      String(value25.entityId || "").localeCompare(
        String(value26.entityId || ""),
      ),
    );
  if (value13.length) {
    const fn4 = (value27) => {
      const value28 = normalizeMatchText(
        value27.entityId,
        value27.name,
        value27.originalName,
        value27.translationKey,
        value27.uniqueId,
      );
      const options = value4?.get?.(value27.entityId)?.attributes?.options;
      const value29 = /mode|模式|工作模式|operation|function/.test(value28)
        ? 320
        : 0;
      const value30 = /memory|记忆|姿势/.test(value28) ? -520 : 0;
      return value29 + value30 + Math.min(80, Number(options?.length || 0) * 8);
    };
    const value25 = value13.filter(
      (value27) =>
        !/memory|记忆|姿势/.test(
          normalizeMatchText(
            value27.entityId,
            value27.name,
            value27.originalName,
            value27.translationKey,
            value27.uniqueId,
          ),
        ),
    );
    const value26 = (value25.length ? value25 : value13).sort(
      (value27, value28) =>
        fn4(value28) - fn4(value27) ||
        String(value27.entityId || "").localeCompare(
          String(value28.entityId || ""),
        ),
    );
    value12.mode = value26[0]?.entityId || value12.mode;
  }
  const value14 = value7
    .filter((metadata2) => {
      const value26 = String(
        metadata2?.domain || metadata2?.entityId || "",
      ).split(".", 1)[0];
      const value27 = normalizeMatchText(
        metadata2?.entityId,
        metadata2?.name,
        metadata2?.originalName,
        metadata2?.translationKey,
        metadata2?.uniqueId,
      );
      return (
        ["button", "select"].includes(value26) &&
        /memory|记忆|姿势/.test(value27)
      );
    })
    .sort((value25, value26) =>
      String(value25.entityId || "").localeCompare(
        String(value26.entityId || ""),
      ),
    );
  const value15 = value7
    .filter(
      (metadata2) =>
        String(metadata2?.domain || metadata2?.entityId || "").split(
          ".",
          1,
        )[0] === "button",
    )
    .sort((value25, value26) =>
      String(value25.entityId || "").localeCompare(
        String(value26.entityId || ""),
      ),
    );
  const value16 = value7
    .filter(
      (metadata2) =>
        String(metadata2?.domain || metadata2?.entityId || "").split(
          ".",
          1,
        )[0] === "select" && metadata2.entityId !== value12.mode,
    )
    .sort((value25, value26) =>
      String(value25.entityId || "").localeCompare(
        String(value26.entityId || ""),
      ),
    );
  const value17 = value15.length ? value15 : value16;
  const value18 = value14.length ? value14 : value17;
  value12.memory1 = value18[0]?.entityId || "";
  value12.memory2 = value18[1]?.entityId || "";
  const value19 = /electric.?bed|smart.?bed|bed\.\d+|milan|电动床|智能床/.test(
    value10,
  );
  const value20 =
    !!value12.backrest && !!value12.leg && !!value12.waist && !!value12.mode;
  const value21 = String(metadata.domain || metadata.entityId || "").split(
    ".",
    1,
  )[0];
  const value22 =
    /bath.?heater|ptc.?bath|(?:^|[._-])bhf(?:[._-]|$)|浴霸|风暖|暖风机/.test(
      value10,
    );
  const value23 = /air.?condition|aircondition|aircon|空调/.test(value10);
  const value24 = /air.?purifier|(?:^|[._-])airp(?:[._-]|$)|空气净化/.test(
    value10,
  );
  let deviceType = "generic";
  if (value19 || value20) {
    deviceType = "electric-bed";
  } else if (value22 && (value11.climate || value11.fan)) {
    deviceType = "bath-heater";
  } else if (value23 && value11.climate) {
    deviceType = "air-conditioner";
  } else if (value11.cover) {
    deviceType = "cover";
  } else if (value24 && value11.fan) {
    deviceType = "air-purifier";
  } else if (value11.climate) {
    deviceType = value21 === "climate" ? "air-conditioner" : "generic";
  } else if (value11.fan) {
    deviceType = "fan";
  } else if (value11.light && value21 === "light") {
    deviceType = "light";
  } else if (value11.power && ["switch", "input_boolean"].includes(value21)) {
    deviceType = "switch";
  }
  const coverKind =
    value11.cover &&
    /airer|clothes.?rack|laundry.?rack|晾衣机|晾衣架/.test(value10)
      ? "airer"
      : value11.cover &&
          /dream|vertical|novo\.curtain|梦幻|竖帘|垂直帘/.test(value10)
        ? "dream"
        : value11.cover
          ? "standard"
          : "";
  return {
    integration: integration,
    integrationLabel:
      integration === "xiaomi_home" ? "Xiaomi Home" : "Xiaomi Miot",
    deviceId: deviceId,
    deviceName: String(
      value6?.name ||
        value9?.attributes?.friendly_name ||
        metadata.name ||
        value,
    ),
    manufacturer: String(value6?.manufacturer || ""),
    model: String(value6?.model || ""),
    deviceType: deviceType,
    coverKind: coverKind,
    roles: {
      primary:
        value11.climate ||
        value11.cover ||
        value11.fan ||
        value11.light ||
        value11.power ||
        value,
      ...value11,
      ...(deviceType === "electric-bed" ? value12 : {}),
    },
    entityIds: value7.map((entityIds) => entityIds.entityId),
    confidence:
      deviceType === "generic" ? "standard-fallback" : "xiaomi-profile",
  };
}
export function applyXiaomiDeviceProfile(component, value) {
  if (!component || !value) {
    return component;
  }
  const properties = {
    ...(component.properties || {}),
  };
  if (
    (!properties.deviceType || properties.deviceType === "auto") &&
    ["air-conditioner", "bath-heater"].includes(value.deviceType)
  ) {
    properties.deviceType = value.deviceType;
  }
  if (
    (!properties.coverKind || properties.coverKind === "auto") &&
    value.coverKind
  ) {
    properties.coverKind = value.coverKind;
  }
  return {
    ...component,
    properties: properties,
  };
}
