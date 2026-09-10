export function createReflectionDetail({
  THREE: BufferAttribute,
  requestFrame: arg7 = () => {},
  makeWorker: arg8 = () => new Worker(new URL("./studio-reflection-detail-worker.js", import.meta.url), {
    type: "module"
  })
}) {
  const items = new Map();
  const size = new Map();
  let terminate;
  let value12 = 0;
  let value13 = false;
  let value14 = false;
  const pending = {
    prepared: 0,
    pending: 0,
    failed: 0,
    sourceTriangles: 0,
    detailTriangles: 0,
    bytes: 0
  };
  const value15 = 16777216;
  const value16 = index => [["index", index.index], ...Object.entries(index.attributes)].map(([name, attribute]) => ({
    name,
    attribute,
    version: attribute.version,
    dataVersion: attribute.data?.version,
    count: attribute.count
  }));
  const value17 = source2 => source2.signature.every(name2 => {
    const version = name2.name === "index" ? source2.source.index : source2.source.attributes[name2.name];
    return version === name2.attribute && version.version === name2.version && version.data?.version === name2.dataVersion && version.count === name2.count;
  });
  const value18 = material => {
    const transparent = material.material;
    return material.userData?.reflectionSimplifiable && transparent && !Array.isArray(transparent) && !transparent.transparent && !transparent.alphaTest && !transparent.displacementMap && !(transparent.transmission > 0);
  };
  function fn(removeEventListener) {
    const geometry4 = items.get(removeEventListener);
    if (geometry4) {
      removeEventListener.removeEventListener("dispose", geometry4.release);
      items.delete(removeEventListener);
      size.delete(geometry4.id);
      if (geometry4.geometry) {
        geometry4.geometry.dispose();
        pending.bytes -= geometry4.bytes;
        pending.prepared--;
        pending.sourceTriangles -= geometry4.sourceTriangles;
        pending.detailTriangles -= geometry4.detailTriangles;
      }
      pending.pending = size.size;
    }
  }
  function fn2() {
    if (!terminate && !value14) {
      try {
        terminate = arg8();
        terminate.onerror = () => {
          value14 = true;
          pending.failed += size.size;
          size.clear();
          pending.pending = 0;
          terminate.terminate();
          terminate = null;
        };
        terminate.onmessage = ({
          data: indices
        }) => {
          const source = size.get(indices.id);
          size.delete(indices.id);
          pending.pending = size.size;
          if (!source || value13) {
            return;
          }
          if (!value17(source)) {
            fn(source.source);
            return;
          }
          if (indices.failed) {
            pending.failed++;
            return;
          }
          if (indices.indices.length >= source.source.index.count * 0.9) {
            return;
          }
          const setIndex = source.source.clone();
          setIndex.setIndex(new BufferAttribute.BufferAttribute(indices.indices, 1));
          const bytes = Object.values(setIndex.attributes).reduce((arg, array) => arg + array.array.byteLength, setIndex.index.array.byteLength);
          if (pending.bytes + bytes > value15) {
            setIndex.dispose();
            return;
          }
          source.geometry = setIndex;
          source.bytes = bytes;
          pending.bytes += bytes;
          pending.prepared++;
          source.sourceTriangles = source.source.index.count / 3;
          source.detailTriangles = indices.indices.length / 3;
          pending.sourceTriangles += source.sourceTriangles;
          pending.detailTriangles += source.detailTriangles;
          arg7();
        };
      } catch {
        value14 = true;
        pending.failed++;
      }
    }
  }
  function prepare(traverse) {
    if (!value13 && !value14) {
      traverse.traverse(geometry => {
        const attributes = geometry.geometry;
        if (!value18(geometry) || !attributes?.index || !attributes.attributes.position || attributes.index.count < 900) {
          return;
        }
        const value9 = items.get(attributes);
        if (value9 && !value17(value9)) {
          fn(attributes);
        }
        if (items.has(attributes) || (fn2(), !terminate)) {
          return;
        }
        const map = ["position", "normal", "color", "uv"].filter(arg3 => attributes.attributes[arg3]);
        const position = Object.fromEntries(map.map(arg2 => {
          const itemSize = attributes.attributes[arg2];
          const value3 = new Float32Array(itemSize.count * itemSize.itemSize);
          const value4 = ["getX", "getY", "getZ", "getW"];
          for (let value2 = 0; value2 < itemSize.count; value2++) {
            for (let value = 0; value < itemSize.itemSize; value++) {
              value3[value2 * itemSize.itemSize + value] = itemSize[value4[value]](value2);
            }
          }
          return [arg2, value3];
        }));
        const reduce = map.filter(arg4 => arg4 !== "position");
        const stride = reduce.reduce((arg5, arg6) => arg5 + attributes.attributes[arg6].itemSize, 0);
        const set = new Float32Array(attributes.attributes.position.count * stride);
        const push = [];
        let value10 = 0;
        for (const value8 of reduce) {
          const value7 = attributes.attributes[value8].itemSize;
          for (let value5 = 0; value5 < value7; value5++) {
            push.push(value8 === "normal" ? 0.2 : value8 === "color" ? 1 : 2);
          }
          for (let value6 = 0; value6 < attributes.attributes.position.count; value6++) {
            set.set(position[value8].subarray(value6 * value7, (value6 + 1) * value7), value6 * stride + value10);
          }
          value10 += value7;
        }
        const id = ++value12;
        const release = {
          id,
          source: attributes,
          signature: value16(attributes),
          geometry: null,
          bytes: 0,
          release: () => fn(attributes)
        };
        attributes.addEventListener("dispose", release.release);
        items.set(attributes, release);
        size.set(id, release);
        pending.pending = size.size;
        const indices2 = new Uint32Array(attributes.index.array);
        const positions = position.position;
        const x = new BufferAttribute.Vector3();
        geometry.getWorldScale(x);
        try {
          terminate.postMessage({
            id,
            indices: indices2,
            positions,
            attributes: set,
            stride,
            weights: push,
            error: 0.01 / Math.max(Math.abs(x.x), Math.abs(x.y), Math.abs(x.z), 0.001)
          }, [indices2.buffer, positions.buffer, set.buffer]);
        } catch {
          size.delete(id);
          pending.pending = size.size;
          pending.failed++;
        }
      });
    }
  }
  return {
    stats: pending,
    prepare,
    get: geometry2 => {
      if (!value18(geometry2)) {
        return null;
      }
      const geometry3 = items.get(geometry2.geometry);
      if (geometry3 && value17(geometry3)) {
        return geometry3.geometry;
      } else {
        return null;
      }
    },
    dispose() {
      value13 = true;
      terminate?.terminate();
      for (const value11 of [...items.keys()]) {
        fn(value11);
      }
    }
  };
}
