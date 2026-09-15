export function createReflectionDetail({
  THREE: THREE,
  requestFrame: requestFrame = () => {},
  makeWorker: makeWorker = () =>
    new Worker(new URL("./studio-reflection-detail-worker.js", import.meta.url), {
      type: "module"
    })
}) {
  const recordByGeometry = new Map();
  const recordById = new Map();
  let worker;
  let recordIdSequence = 0;
  let isDisposed = false;
  let isWorkerFailed = false;
  const stats = {
    prepared: 0,
    pending: 0,
    failed: 0,
    sourceTriangles: 0,
    detailTriangles: 0,
    bytes: 0
  };
  const MAX_DETAIL_BYTE_BUDGET = 16777216;
  const buildAttributeSignature = geometry =>
    [["index", geometry.index], ...Object.entries(geometry.attributes)].map(
      ([entryName, attribute]) => ({
        name: entryName,
        attribute: attribute,
        version: attribute.version,
        dataVersion: attribute.data?.version,
        count: attribute.count
      })
    );
  const isRecordCurrent = record =>
    record.signature.every(signatureEntry => {
      const signatureAttribute =
        signatureEntry.name === "index"
          ? record.source.index
          : record.source.attributes[signatureEntry.name];
      return (
        signatureAttribute === signatureEntry.attribute &&
        signatureAttribute.version === signatureEntry.version &&
        signatureAttribute.data?.version === signatureEntry.dataVersion &&
        signatureAttribute.count === signatureEntry.count
      );
    });
  const isSimplifiable = mesh => {
    const material = mesh.material;
    return (
      mesh.userData?.reflectionSimplifiable &&
      material &&
      !Array.isArray(material) &&
      !material.transparent &&
      !material.alphaTest &&
      !material.displacementMap &&
      !(material.transmission > 0)
    );
  };
  function releaseRecord(sourceGeometry) {
    const existingRecord = recordByGeometry.get(sourceGeometry);
    if (existingRecord) {
      sourceGeometry.removeEventListener("dispose", existingRecord.release);
      recordByGeometry.delete(sourceGeometry);
      recordById.delete(existingRecord.id);
      if (existingRecord.geometry) {
        existingRecord.geometry.dispose();
        stats.bytes -= existingRecord.bytes;
        stats.prepared--;
        stats.sourceTriangles -= existingRecord.sourceTriangles;
        stats.detailTriangles -= existingRecord.detailTriangles;
      }
      stats.pending = recordById.size;
    }
  }
  function ensureWorker() {
    if (!worker && !isWorkerFailed) {
      try {
        worker = makeWorker();
        worker.onerror = () => {
          isWorkerFailed = true;
          stats.failed += recordById.size;
          recordById.clear();
          stats.pending = 0;
          worker.terminate();
          worker = null;
        };
        worker.onmessage = ({ data: message }) => {
          const pendingRecord = recordById.get(message.id);
          recordById.delete(message.id);
          stats.pending = recordById.size;
          if (!pendingRecord || isDisposed) {
            return;
          }
          if (!isRecordCurrent(pendingRecord)) {
            releaseRecord(pendingRecord.source);
            return;
          }
          if (message.failed) {
            stats.failed++;
            return;
          }
          if (message.indices.length >= pendingRecord.source.index.count * 0.9) {
            return;
          }
          const simplifiedGeometry = pendingRecord.source.clone();
          simplifiedGeometry.setIndex(new THREE.BufferAttribute(message.indices, 1));
          const byteLength = Object.values(simplifiedGeometry.attributes).reduce(
            (accumulatedBytes, attributeArray) =>
              accumulatedBytes + attributeArray.array.byteLength,
            simplifiedGeometry.index.array.byteLength
          );
          if (stats.bytes + byteLength > MAX_DETAIL_BYTE_BUDGET) {
            simplifiedGeometry.dispose();
            return;
          }
          pendingRecord.geometry = simplifiedGeometry;
          pendingRecord.bytes = byteLength;
          stats.bytes += byteLength;
          stats.prepared++;
          pendingRecord.sourceTriangles = pendingRecord.source.index.count / 3;
          pendingRecord.detailTriangles = message.indices.length / 3;
          stats.sourceTriangles += pendingRecord.sourceTriangles;
          stats.detailTriangles += pendingRecord.detailTriangles;
          requestFrame();
        };
      } catch {
        isWorkerFailed = true;
        stats.failed++;
      }
    }
  }
  function prepare(root) {
    if (!isDisposed && !isWorkerFailed) {
      root.traverse(node => {
        const nodeGeometry = node.geometry;
        if (
          !isSimplifiable(node) ||
          !nodeGeometry?.index ||
          !nodeGeometry.attributes.position ||
          nodeGeometry.index.count < 900
        ) {
          return;
        }
        const staleRecord = recordByGeometry.get(nodeGeometry);
        if (staleRecord && !isRecordCurrent(staleRecord)) {
          releaseRecord(nodeGeometry);
        }
        if (recordByGeometry.has(nodeGeometry) || (ensureWorker(), !worker)) {
          return;
        }
        const attributeNames = ["position", "normal", "color", "uv"].filter(
          attributeName => nodeGeometry.attributes[attributeName]
        );
        const packedAttributes = Object.fromEntries(
          attributeNames.map(sourceAttributeName => {
            const sourceAttribute = nodeGeometry.attributes[sourceAttributeName];
            const packedData = new Float32Array(sourceAttribute.count * sourceAttribute.itemSize);
            const accessors = ["getX", "getY", "getZ", "getW"];
            for (
              let packedVertexIndex = 0;
              packedVertexIndex < sourceAttribute.count;
              packedVertexIndex++
            ) {
              for (
                let packedComponentIndex = 0;
                packedComponentIndex < sourceAttribute.itemSize;
                packedComponentIndex++
              ) {
                packedData[packedVertexIndex * sourceAttribute.itemSize + packedComponentIndex] =
                  sourceAttribute[accessors[packedComponentIndex]](packedVertexIndex);
              }
            }
            return [sourceAttributeName, packedData];
          })
        );
        const extraAttributeNames = attributeNames.filter(
          extraAttributeName => extraAttributeName !== "position"
        );
        const stride = extraAttributeNames.reduce(
          (accumulatedSize, extraName) =>
            accumulatedSize + nodeGeometry.attributes[extraName].itemSize,
          0
        );
        const interleavedAttributes = new Float32Array(
          nodeGeometry.attributes.position.count * stride
        );
        const weights = [];
        let attributeOffset = 0;
        for (const attributeKey of extraAttributeNames) {
          const itemSize = nodeGeometry.attributes[attributeKey].itemSize;
          for (let componentIndex = 0; componentIndex < itemSize; componentIndex++) {
            weights.push(attributeKey === "normal" ? 0.2 : attributeKey === "color" ? 1 : 2);
          }
          for (
            let vertexIndex = 0;
            vertexIndex < nodeGeometry.attributes.position.count;
            vertexIndex++
          ) {
            interleavedAttributes.set(
              packedAttributes[attributeKey].subarray(
                vertexIndex * itemSize,
                (vertexIndex + 1) * itemSize
              ),
              vertexIndex * stride + attributeOffset
            );
          }
          attributeOffset += itemSize;
        }
        const recordId = ++recordIdSequence;
        const recordEntry = {
          id: recordId,
          source: nodeGeometry,
          signature: buildAttributeSignature(nodeGeometry),
          geometry: null,
          bytes: 0,
          release: () => releaseRecord(nodeGeometry)
        };
        nodeGeometry.addEventListener("dispose", recordEntry.release);
        recordByGeometry.set(nodeGeometry, recordEntry);
        recordById.set(recordId, recordEntry);
        stats.pending = recordById.size;
        const indexArray = new Uint32Array(nodeGeometry.index.array);
        const positionData = packedAttributes.position;
        const worldScale = new THREE.Vector3();
        node.getWorldScale(worldScale);
        try {
          worker.postMessage(
            {
              id: recordId,
              indices: indexArray,
              positions: positionData,
              attributes: interleavedAttributes,
              stride: stride,
              weights: weights,
              error:
                0.01 /
                Math.max(
                  Math.abs(worldScale.x),
                  Math.abs(worldScale.y),
                  Math.abs(worldScale.z),
                  0.001
                )
            },
            [indexArray.buffer, positionData.buffer, interleavedAttributes.buffer]
          );
        } catch {
          recordById.delete(recordId);
          stats.pending = recordById.size;
          stats.failed++;
        }
      });
    }
  }
  return {
    stats: stats,
    prepare: prepare,
    get: candidateMesh => {
      if (!isSimplifiable(candidateMesh)) {
        return null;
      }
      const cachedRecord = recordByGeometry.get(candidateMesh.geometry);
      if (cachedRecord && isRecordCurrent(cachedRecord)) {
        return cachedRecord.geometry;
      } else {
        return null;
      }
    },
    dispose() {
      isDisposed = true;
      worker?.terminate();
      for (const cachedGeometry of [...recordByGeometry.keys()]) {
        releaseRecord(cachedGeometry);
      }
    }
  };
}
