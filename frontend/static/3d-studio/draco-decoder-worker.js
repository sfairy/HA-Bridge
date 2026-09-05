let decoderPending = null;
self.onmessage = (value) => {
  const value2 = value.data || {};
  if (value2.type === "init") {
    decoderPending = initializeDecoder(value2);
    return;
  }
  if (value2.type !== "decode") {
    return;
  }
  (
    decoderPending ||
    Promise.reject(new Error("Draco decoder is not initialized"))
  )
    .then(({ draco: value3 }) => {
      const value4 = new value3.Decoder();
      try {
        const geometry = decodeGeometry(
          value3,
          value4,
          new Int8Array(value2.buffer),
          value2.taskConfig,
        );
        const value5 = geometry.attributes.map((value6) => value6.array.buffer);
        if (geometry.index) {
          value5.push(geometry.index.array.buffer);
        }
        self.postMessage(
          {
            type: "decode",
            id: value2.id,
            geometry: geometry,
          },
          value5,
        );
      } catch (error) {
        self.postMessage({
          type: "error",
          id: value2.id,
          error: error?.message || String(error),
        });
      } finally {
        value3.destroy(value4);
      }
    })
    .catch((value3) => {
      self.postMessage({
        type: "error",
        id: value2.id,
        error: value3?.message || String(value3),
      });
    });
};
function initializeDecoder(value) {
  const text = String(value.decoderPath || "");
  const value2 = {
    ...(value.decoderConfig || {}),
  };
  const value3 =
    value2.type === "js" ? "draco_decoder.js" : "draco_wasm_wrapper.js";
  try {
    self.importScripts("" + text + value3);
  } catch (error) {
    return Promise.reject(error);
  }
  value2.locateFile = (value4) =>
    "" +
    text +
    (value4 === "draco_decoder_gltf.wasm" ? "draco_decoder.wasm" : value4);
  return new Promise((fn, fn2) => {
    let value4 = false;
    value2.onModuleLoaded = (draco) => {
      value4 = true;
      fn({
        draco: draco,
      });
    };
    try {
      const value5 = self.DracoDecoderModule(value2);
      if (value5 && typeof value5.then == "function") {
        value5.then((draco) => {
          if (!value4) {
            fn({
              draco: draco,
            });
          }
        }, fn2);
      }
    } catch (error) {
      fn2(error);
    }
  });
}
function decodeGeometry(value, value2, value3, value4) {
  const attributeIDs = value4.attributeIDs;
  const attributeTypes = value4.attributeTypes;
  let value5;
  let value6;
  const value7 = value2.GetEncodedGeometryType(value3);
  if (value7 === value.TRIANGULAR_MESH) {
    value5 = new value.Mesh();
    value6 = value2.DecodeArrayToMesh(value3, value3.byteLength, value5);
  } else if (value7 === value.POINT_CLOUD) {
    value5 = new value.PointCloud();
    value6 = value2.DecodeArrayToPointCloud(value3, value3.byteLength, value5);
  } else {
    throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
  }
  if (!value6.ok() || value5.ptr === 0) {
    throw new Error(
      "THREE.DRACOLoader: Decoding failed: " + value6.error_msg(),
    );
  }
  const value8 = {
    index: null,
    attributes: [],
  };
  for (const value9 in attributeIDs) {
    const value10 = self[attributeTypes[value9]];
    let value11;
    if (value4.useUniqueIDs) {
      value11 = value2.GetAttributeByUniqueId(value5, attributeIDs[value9]);
    } else {
      const value13 = value2.GetAttributeId(
        value5,
        value[attributeIDs[value9]],
      );
      if (value13 === -1) {
        continue;
      }
      value11 = value2.GetAttribute(value5, value13);
    }
    const value12 = decodeAttribute(
      value,
      value2,
      value5,
      value9,
      value10,
      value11,
    );
    if (value9 === "color") {
      value12.vertexColorSpace = value4.vertexColorSpace;
    }
    value8.attributes.push(value12);
  }
  if (value7 === value.TRIANGULAR_MESH) {
    value8.index = decodeIndex(value, value2, value5);
  }
  value.destroy(value5);
  return value8;
}
function decodeIndex(value, value2, value3) {
  const value4 = value3.num_faces() * 3;
  const value5 = value4 * 4;
  const value6 = value._malloc(value5);
  value2.GetTrianglesUInt32Array(value3, value5, value6);
  const array = new Uint32Array(value.HEAPF32.buffer, value6, value4).slice();
  value._free(value6);
  return {
    array: array,
    itemSize: 1,
  };
}
function decodeAttribute(value, value2, value3, name, value4, value5) {
  const count = value3.num_points();
  const itemSize = value5.num_components();
  const value6 = getDracoDataType(value, value4);
  const value7 = itemSize * value4.BYTES_PER_ELEMENT;
  const value8 = Math.ceil(value7 / 4) * 4;
  const stride = value8 / value4.BYTES_PER_ELEMENT;
  const value9 = count * value7;
  const value10 = count * value8;
  const value11 = value._malloc(value9);
  value2.GetAttributeDataArrayForAllPoints(
    value3,
    value5,
    value6,
    value9,
    value11,
  );
  const value12 = new value4(
    value.HEAPF32.buffer,
    value11,
    value9 / value4.BYTES_PER_ELEMENT,
  );
  let array;
  if (value7 === value8) {
    array = value12.slice();
  } else {
    array = new value4(value10 / value4.BYTES_PER_ELEMENT);
    let value13 = 0;
    for (let value14 = 0; value14 < value12.length; value14 += itemSize) {
      for (let value15 = 0; value15 < itemSize; value15 += 1) {
        array[value13 + value15] = value12[value14 + value15];
      }
      value13 += stride;
    }
  }
  value._free(value11);
  return {
    name: name,
    count: count,
    itemSize: itemSize,
    array: array,
    stride: stride,
  };
}
function getDracoDataType(value, value2) {
  if (value2 === Float32Array) {
    return value.DT_FLOAT32;
  }
  if (value2 === Int8Array) {
    return value.DT_INT8;
  }
  if (value2 === Int16Array) {
    return value.DT_INT16;
  }
  if (value2 === Int32Array) {
    return value.DT_INT32;
  }
  if (value2 === Uint8Array) {
    return value.DT_UINT8;
  }
  if (value2 === Uint16Array) {
    return value.DT_UINT16;
  }
  if (value2 === Uint32Array) {
    return value.DT_UINT32;
  }
  throw new Error("THREE.DRACOLoader: Unsupported attribute array type.");
}
