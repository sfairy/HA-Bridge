let decoderPending = null;
self.onmessage = (event) => {
  const message = event.data || {};
  if (message.type === "init") {
    decoderPending = initializeDecoder(message);
    return;
  }
  if (message.type !== "decode") {
    return;
  }
  (
    decoderPending ||
    Promise.reject(new Error("Draco decoder is not initialized"))
  )
    .then(({ draco }) => {
      const decoder = new draco.Decoder();
      try {
        const geometry = decodeGeometry(
          draco,
          decoder,
          new Int8Array(message.buffer),
          message.taskConfig,
        );
        const transferables = geometry.attributes.map(
          (attribute) => attribute.array.buffer,
        );
        if (geometry.index) {
          transferables.push(geometry.index.array.buffer);
        }
        self.postMessage(
          {
            type: "decode",
            id: message.id,
            geometry: geometry,
          },
          transferables,
        );
      } catch (error) {
        self.postMessage({
          type: "error",
          id: message.id,
          error: error?.message || String(error),
        });
      } finally {
        draco.destroy(decoder);
      }
    })
    .catch((error) => {
      self.postMessage({
        type: "error",
        id: message.id,
        error: error?.message || String(error),
      });
    });
};
function initializeDecoder(message) {
  const decoderPath = String(message.decoderPath || "");
  const decoderConfig = {
    ...(message.decoderConfig || {}),
  };
  const scriptName =
    decoderConfig.type === "js" ? "draco_decoder.js" : "draco_wasm_wrapper.js";
  try {
    self.importScripts("" + decoderPath + scriptName);
  } catch (error) {
    return Promise.reject(error);
  }
  decoderConfig.locateFile = (fileName) =>
    "" +
    decoderPath +
    (fileName === "draco_decoder_gltf.wasm" ? "draco_decoder.wasm" : fileName);
  return new Promise((resolve, reject) => {
    let resolvedFromCallback = false;
    decoderConfig.onModuleLoaded = (module) => {
      resolvedFromCallback = true;
      resolve({
        draco: module,
      });
    };
    try {
      const moduleOrPromise = self.DracoDecoderModule(decoderConfig);
      if (moduleOrPromise && typeof moduleOrPromise.then == "function") {
        moduleOrPromise.then((module) => {
          if (!resolvedFromCallback) {
            resolve({
              draco: module,
            });
          }
        }, reject);
      }
    } catch (error) {
      reject(error);
    }
  });
}
function decodeGeometry(draco, decoder, buffer, taskConfig) {
  const attributeIDs = taskConfig.attributeIDs;
  const attributeTypes = taskConfig.attributeTypes;
  let geometry;
  let decodingStatus;
  const geometryType = decoder.GetEncodedGeometryType(buffer);
  if (geometryType === draco.TRIANGULAR_MESH) {
    geometry = new draco.Mesh();
    decodingStatus = decoder.DecodeArrayToMesh(
      buffer,
      buffer.byteLength,
      geometry,
    );
  } else if (geometryType === draco.POINT_CLOUD) {
    geometry = new draco.PointCloud();
    decodingStatus = decoder.DecodeArrayToPointCloud(
      buffer,
      buffer.byteLength,
      geometry,
    );
  } else {
    throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
  }
  if (!decodingStatus.ok() || geometry.ptr === 0) {
    throw new Error(
      "THREE.DRACOLoader: Decoding failed: " + decodingStatus.error_msg(),
    );
  }
  const result = {
    index: null,
    attributes: [],
  };
  for (const attributeName in attributeIDs) {
    const attributeType = self[attributeTypes[attributeName]];
    let attribute;
    if (taskConfig.useUniqueIDs) {
      attribute = decoder.GetAttributeByUniqueId(
        geometry,
        attributeIDs[attributeName],
      );
    } else {
      const attributeId = decoder.GetAttributeId(
        geometry,
        draco[attributeIDs[attributeName]],
      );
      if (attributeId === -1) {
        continue;
      }
      attribute = decoder.GetAttribute(geometry, attributeId);
    }
    const decoded = decodeAttribute(
      draco,
      decoder,
      geometry,
      attributeName,
      attributeType,
      attribute,
    );
    if (attributeName === "color") {
      decoded.vertexColorSpace = taskConfig.vertexColorSpace;
    }
    result.attributes.push(decoded);
  }
  if (geometryType === draco.TRIANGULAR_MESH) {
    result.index = decodeIndex(draco, decoder, geometry);
  }
  draco.destroy(geometry);
  return result;
}
function decodeIndex(draco, decoder, geometry) {
  const indexCount = geometry.num_faces() * 3;
  const byteLength = indexCount * 4;
  const pointer = draco._malloc(byteLength);
  decoder.GetTrianglesUInt32Array(geometry, byteLength, pointer);
  const array = new Uint32Array(draco.HEAPF32.buffer, pointer, indexCount).slice();
  draco._free(pointer);
  return {
    array: array,
    itemSize: 1,
  };
}
function decodeAttribute(
  draco,
  decoder,
  geometry,
  attributeName,
  attributeType,
  attribute,
) {
  const numPoints = geometry.num_points();
  const numComponents = attribute.num_components();
  const dataType = getDracoDataType(draco, attributeType);
  const byteStride = numComponents * attributeType.BYTES_PER_ELEMENT;
  const alignedByteStride = Math.ceil(byteStride / 4) * 4;
  const alignedItemSize = alignedByteStride / attributeType.BYTES_PER_ELEMENT;
  const dataByteLength = numPoints * byteStride;
  const alignedByteLength = numPoints * alignedByteStride;
  const pointer = draco._malloc(dataByteLength);
  decoder.GetAttributeDataArrayForAllPoints(
    geometry,
    attribute,
    dataType,
    dataByteLength,
    pointer,
  );
  const packed = new attributeType(
    draco.HEAPF32.buffer,
    pointer,
    dataByteLength / attributeType.BYTES_PER_ELEMENT,
  );
  let array;
  if (byteStride === alignedByteStride) {
    array = packed.slice();
  } else {
    array = new attributeType(alignedByteLength / attributeType.BYTES_PER_ELEMENT);
    let writeOffset = 0;
    for (let readOffset = 0; readOffset < packed.length; readOffset += numComponents) {
      for (let component = 0; component < numComponents; component += 1) {
        array[writeOffset + component] = packed[readOffset + component];
      }
      writeOffset += alignedItemSize;
    }
  }
  draco._free(pointer);
  return {
    name: attributeName,
    count: numPoints,
    itemSize: numComponents,
    array: array,
    stride: alignedItemSize,
  };
}
function getDracoDataType(draco, attributeType) {
  if (attributeType === Float32Array) {
    return draco.DT_FLOAT32;
  }
  if (attributeType === Int8Array) {
    return draco.DT_INT8;
  }
  if (attributeType === Int16Array) {
    return draco.DT_INT16;
  }
  if (attributeType === Int32Array) {
    return draco.DT_INT32;
  }
  if (attributeType === Uint8Array) {
    return draco.DT_UINT8;
  }
  if (attributeType === Uint16Array) {
    return draco.DT_UINT16;
  }
  if (attributeType === Uint32Array) {
    return draco.DT_UINT32;
  }
  throw new Error("THREE.DRACOLoader: Unsupported attribute array type.");
}
