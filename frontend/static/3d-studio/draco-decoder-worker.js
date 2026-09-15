let decoderPending = null;
self.onmessage = event => {
  const payload = event.data || {};
  if (payload.type === "init") {
    decoderPending = initializeDecoder(payload);
    return;
  }
  if (payload.type !== "decode") {
    return;
  }
  (decoderPending || Promise.reject(new Error("Draco decoder is not initialized")))
    .then(({ draco: dracoModule }) => {
      const dracoDecoder = new dracoModule.Decoder();
      try {
        const geometryPayload = decodeGeometry(
          dracoModule,
          dracoDecoder,
          new Int8Array(payload.buffer),
          payload.taskConfig
        );
        const transferables = geometryPayload.attributes.map(attribute => attribute.array.buffer);
        if (geometryPayload.index) {
          transferables.push(geometryPayload.index.array.buffer);
        }
        self.postMessage(
          {
            type: "decode",
            id: payload.id,
            geometry: geometryPayload
          },
          transferables
        );
      } catch (decodeError) {
        self.postMessage({
          type: "error",
          id: payload.id,
          error: decodeError?.message || String(decodeError)
        });
      } finally {
        dracoModule.destroy(dracoDecoder);
      }
    })
    .catch(workerError => {
      self.postMessage({
        type: "error",
        id: payload.id,
        error: workerError?.message || String(workerError)
      });
    });
};
function initializeDecoder(options) {
  const decoderPath = String(options.decoderPath || "");
  const decoderConfig = {
    ...(options.decoderConfig || {})
  };
  const wrapperFileName =
    decoderConfig.type === "js" ? "draco_decoder.js" : "draco_wasm_wrapper.js";
  try {
    self.importScripts("" + decoderPath + wrapperFileName);
  } catch (importError) {
    return Promise.reject(importError);
  }
  decoderConfig.locateFile = fileName =>
    "" + decoderPath + (fileName === "draco_decoder_gltf.wasm" ? "draco_decoder.wasm" : fileName);
  return new Promise((resolve, reject) => {
    let isModuleLoaded = false;
    decoderConfig.onModuleLoaded = module => {
      isModuleLoaded = true;
      resolve({
        draco: module
      });
    };
    try {
      const modulePromise = self.DracoDecoderModule(decoderConfig);
      if (modulePromise && typeof modulePromise.then == "function") {
        modulePromise.then(dracoInstance => {
          if (!isModuleLoaded) {
            resolve({
              draco: dracoInstance
            });
          }
        }, reject);
      }
    } catch (moduleError) {
      reject(moduleError);
    }
  });
}
function decodeGeometry(draco, decoder, encodedData, taskConfig) {
  const attributeIds = taskConfig.attributeIDs;
  const attributeTypes = taskConfig.attributeTypes;
  let dracoGeometry;
  let decodeResult;
  const geometryType = decoder.GetEncodedGeometryType(encodedData);
  if (geometryType === draco.TRIANGULAR_MESH) {
    dracoGeometry = new draco.Mesh();
    decodeResult = decoder.DecodeArrayToMesh(encodedData, encodedData.byteLength, dracoGeometry);
  } else if (geometryType === draco.POINT_CLOUD) {
    dracoGeometry = new draco.PointCloud();
    decodeResult = decoder.DecodeArrayToPointCloud(
      encodedData,
      encodedData.byteLength,
      dracoGeometry
    );
  } else {
    throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
  }
  if (!decodeResult.ok() || dracoGeometry.ptr === 0) {
    throw new Error("THREE.DRACOLoader: Decoding failed: " + decodeResult.error_msg());
  }
  const geometryData = {
    index: null,
    attributes: []
  };
  for (const attributeKey in attributeIds) {
    const attributeType = self[attributeTypes[attributeKey]];
    let dracoAttribute;
    if (taskConfig.useUniqueIDs) {
      dracoAttribute = decoder.GetAttributeByUniqueId(dracoGeometry, attributeIds[attributeKey]);
    } else {
      const attributeId = decoder.GetAttributeId(dracoGeometry, draco[attributeIds[attributeKey]]);
      if (attributeId === -1) {
        continue;
      }
      dracoAttribute = decoder.GetAttribute(dracoGeometry, attributeId);
    }
    const decodedAttribute = decodeAttribute(
      draco,
      decoder,
      dracoGeometry,
      attributeKey,
      attributeType,
      dracoAttribute
    );
    if (attributeKey === "color") {
      decodedAttribute.vertexColorSpace = taskConfig.vertexColorSpace;
    }
    geometryData.attributes.push(decodedAttribute);
  }
  if (geometryType === draco.TRIANGULAR_MESH) {
    geometryData.index = decodeIndex(draco, decoder, dracoGeometry);
  }
  draco.destroy(dracoGeometry);
  return geometryData;
}
function decodeIndex(dracoLib, meshDecoder, mesh) {
  const indexCount = mesh.num_faces() * 3;
  const indexByteLength = indexCount * 4;
  const indexPointer = dracoLib._malloc(indexByteLength);
  meshDecoder.GetTrianglesUInt32Array(mesh, indexByteLength, indexPointer);
  const indexArray = new Uint32Array(dracoLib.HEAPF32.buffer, indexPointer, indexCount).slice();
  dracoLib._free(indexPointer);
  return {
    array: indexArray,
    itemSize: 1
  };
}
function decodeAttribute(
  dracoApi,
  attributeDecoder,
  meshOrPointCloud,
  attributeName,
  arrayType,
  sourceAttribute
) {
  const pointCount = meshOrPointCloud.num_points();
  const componentCount = sourceAttribute.num_components();
  const dracoDataType = getDracoDataType(dracoApi, arrayType);
  const componentByteLength = componentCount * arrayType.BYTES_PER_ELEMENT;
  const alignedByteLength = Math.ceil(componentByteLength / 4) * 4;
  const alignedComponentCount = alignedByteLength / arrayType.BYTES_PER_ELEMENT;
  const dataByteLength = pointCount * componentByteLength;
  const paddedByteLength = pointCount * alignedByteLength;
  const dataPointer = dracoApi._malloc(dataByteLength);
  attributeDecoder.GetAttributeDataArrayForAllPoints(
    meshOrPointCloud,
    sourceAttribute,
    dracoDataType,
    dataByteLength,
    dataPointer
  );
  const rawAttributeArray = new arrayType(
    dracoApi.HEAPF32.buffer,
    dataPointer,
    dataByteLength / arrayType.BYTES_PER_ELEMENT
  );
  let packedAttributeArray;
  if (componentByteLength === alignedByteLength) {
    packedAttributeArray = rawAttributeArray.slice();
  } else {
    packedAttributeArray = new arrayType(paddedByteLength / arrayType.BYTES_PER_ELEMENT);
    let targetOffset = 0;
    for (
      let sourceOffset = 0;
      sourceOffset < rawAttributeArray.length;
      sourceOffset += componentCount
    ) {
      for (let componentIndex = 0; componentIndex < componentCount; componentIndex += 1) {
        packedAttributeArray[targetOffset + componentIndex] =
          rawAttributeArray[sourceOffset + componentIndex];
      }
      targetOffset += alignedComponentCount;
    }
  }
  dracoApi._free(dataPointer);
  return {
    name: attributeName,
    count: pointCount,
    itemSize: componentCount,
    array: packedAttributeArray,
    stride: alignedComponentCount
  };
}
function getDracoDataType(dracoNamespace, arrayConstructor) {
  if (arrayConstructor === Float32Array) {
    return dracoNamespace.DT_FLOAT32;
  }
  if (arrayConstructor === Int8Array) {
    return dracoNamespace.DT_INT8;
  }
  if (arrayConstructor === Int16Array) {
    return dracoNamespace.DT_INT16;
  }
  if (arrayConstructor === Int32Array) {
    return dracoNamespace.DT_INT32;
  }
  if (arrayConstructor === Uint8Array) {
    return dracoNamespace.DT_UINT8;
  }
  if (arrayConstructor === Uint16Array) {
    return dracoNamespace.DT_UINT16;
  }
  if (arrayConstructor === Uint32Array) {
    return dracoNamespace.DT_UINT32;
  }
  throw new Error("THREE.DRACOLoader: Unsupported attribute array type.");
}
