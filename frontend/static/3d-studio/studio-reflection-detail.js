export function createReflectionDetail({
  THREE,
  requestFrame = () => {},
  makeWorker = () => new Worker(new URL("./studio-reflection-detail-worker.js", import.meta.url), {
    type: "module"
  })
}) {
  const entriesByGeometry = new Map();
  const pendingById = new Map();
  let worker;
  let nextId = 0;
  let disposed = false;
  let workerFailed = false;
  const stats = {
    prepared: 0,
    pending: 0,
    failed: 0,
    sourceTriangles: 0,
    detailTriangles: 0,
    bytes: 0
  };
  const maxBytes = 16777216;
  const geometrySignature = geometry => [["index", geometry.index], ...Object.entries(geometry.attributes)].map(([name, attribute]) => ({
    name,
    attribute,
    version: attribute.version,
    dataVersion: attribute.data?.version,
    count: attribute.count
  }));
  const signatureMatches = entry => entry.signature.every(part => {
    const attribute = part.name === "index" ? entry.source.index : entry.source.attributes[part.name];
    return attribute === part.attribute && attribute.version === part.version && attribute.data?.version === part.dataVersion && attribute.count === part.count;
  });
  const isSimplifiable = mesh => {
    const material = mesh.material;
    return mesh.userData?.reflectionSimplifiable && material && !Array.isArray(material) && !material.transparent && !material.alphaTest && !material.displacementMap && !(material.transmission > 0);
  };
  function releaseEntry(geometry) {
    const entry = entriesByGeometry.get(geometry);
    if (entry) {
      geometry.removeEventListener("dispose", entry.release);
      entriesByGeometry.delete(geometry);
      pendingById.delete(entry.id);
      if (entry.geometry) {
        entry.geometry.dispose();
        stats.bytes -= entry.bytes;
        stats.prepared--;
        stats.sourceTriangles -= entry.sourceTriangles;
        stats.detailTriangles -= entry.detailTriangles;
      }
      stats.pending = pendingById.size;
    }
  }
  function ensureWorker() {
    if (!worker && !workerFailed) {
      try {
        worker = makeWorker();
        worker.onerror = () => {
          workerFailed = true;
          stats.failed += pendingById.size;
          pendingById.clear();
          stats.pending = 0;
          worker.terminate();
          worker = null;
        };
        worker.onmessage = ({
          data: message
        }) => {
          const entry = pendingById.get(message.id);
          pendingById.delete(message.id);
          stats.pending = pendingById.size;
          if (!entry || disposed) {
            return;
          }
          if (!signatureMatches(entry)) {
            releaseEntry(entry.source);
            return;
          }
          if (message.failed) {
            stats.failed++;
            return;
          }
          if (message.indices.length >= entry.source.index.count * 0.9) {
            return;
          }
          const simplified = entry.source.clone();
          simplified.setIndex(new THREE.BufferAttribute(message.indices, 1));
          const bytes = Object.values(simplified.attributes).reduce((total, attribute) => total + attribute.array.byteLength, simplified.index.array.byteLength);
          if (stats.bytes + bytes > maxBytes) {
            simplified.dispose();
            return;
          }
          entry.geometry = simplified;
          entry.bytes = bytes;
          stats.bytes += bytes;
          stats.prepared++;
          entry.sourceTriangles = entry.source.index.count / 3;
          entry.detailTriangles = message.indices.length / 3;
          stats.sourceTriangles += entry.sourceTriangles;
          stats.detailTriangles += entry.detailTriangles;
          requestFrame();
        };
      } catch {
        workerFailed = true;
        stats.failed++;
      }
    }
  }
  function prepare(root) {
    if (!disposed && !workerFailed) {
      root.traverse(mesh => {
        const geometry = mesh.geometry;
        if (!isSimplifiable(mesh) || !geometry?.index || !geometry.attributes.position || geometry.index.count < 900) {
          return;
        }
        const existing = entriesByGeometry.get(geometry);
        if (existing && !signatureMatches(existing)) {
          releaseEntry(geometry);
        }
        if (entriesByGeometry.has(geometry) || (ensureWorker(), !worker)) {
          return;
        }
        const attributeNames = ["position", "normal", "color", "uv"].filter(name => geometry.attributes[name]);
        const attributeArrays = Object.fromEntries(attributeNames.map(name => {
          const attribute = geometry.attributes[name];
          const array = new Float32Array(attribute.count * attribute.itemSize);
          const getters = ["getX", "getY", "getZ", "getW"];
          for (let vertexIndex = 0; vertexIndex < attribute.count; vertexIndex++) {
            for (let component = 0; component < attribute.itemSize; component++) {
              array[vertexIndex * attribute.itemSize + component] = attribute[getters[component]](vertexIndex);
            }
          }
          return [name, array];
        }));
        const extraNames = attributeNames.filter(name => name !== "position");
        const stride = extraNames.reduce((total, name) => total + geometry.attributes[name].itemSize, 0);
        const packedAttributes = new Float32Array(geometry.attributes.position.count * stride);
        const weights = [];
        let attributeOffset = 0;
        for (const name of extraNames) {
          const itemSize = geometry.attributes[name].itemSize;
          for (let component = 0; component < itemSize; component++) {
            weights.push(name === "normal" ? 0.2 : name === "color" ? 1 : 2);
          }
          for (let vertexIndex = 0; vertexIndex < geometry.attributes.position.count; vertexIndex++) {
            packedAttributes.set(attributeArrays[name].subarray(vertexIndex * itemSize, (vertexIndex + 1) * itemSize), vertexIndex * stride + attributeOffset);
          }
          attributeOffset += itemSize;
        }
        const id = ++nextId;
        const entry = {
          id,
          source: geometry,
          signature: geometrySignature(geometry),
          geometry: null,
          bytes: 0,
          release: () => releaseEntry(geometry)
        };
        geometry.addEventListener("dispose", entry.release);
        entriesByGeometry.set(geometry, entry);
        pendingById.set(id, entry);
        stats.pending = pendingById.size;
        const indices = new Uint32Array(geometry.index.array);
        const positions = attributeArrays.position;
        const worldScale = new THREE.Vector3();
        mesh.getWorldScale(worldScale);
        try {
          worker.postMessage({
            id,
            indices,
            positions,
            attributes: packedAttributes,
            stride,
            weights,
            error: 0.01 / Math.max(Math.abs(worldScale.x), Math.abs(worldScale.y), Math.abs(worldScale.z), 0.001)
          }, [indices.buffer, positions.buffer, packedAttributes.buffer]);
        } catch {
          pendingById.delete(id);
          stats.pending = pendingById.size;
          stats.failed++;
        }
      });
    }
  }
  return {
    stats,
    prepare,
    get: mesh => {
      if (!isSimplifiable(mesh)) {
        return null;
      }
      const entry = entriesByGeometry.get(mesh.geometry);
      if (entry && signatureMatches(entry)) {
        return entry.geometry;
      } else {
        return null;
      }
    },
    dispose() {
      disposed = true;
      worker?.terminate();
      for (const geometry of [...entriesByGeometry.keys()]) {
        releaseEntry(geometry);
      }
    }
  };
}
