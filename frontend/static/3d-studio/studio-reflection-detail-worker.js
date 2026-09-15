import { MeshoptSimplifier } from "../vendor/meshoptimizer/0.25/meshopt_simplifier.module.js";
export async function simplifyReflection({
  indices: indexArray,
  positions: vertexPositions,
  attributes: vertexAttributes,
  stride: attributeStride,
  weights: attributeWeights,
  error: targetError
}) {
  await MeshoptSimplifier.ready;
  return MeshoptSimplifier.simplifyWithAttributes(
    indexArray,
    vertexPositions,
    3,
    vertexAttributes,
    attributeStride,
    attributeWeights,
    null,
    Math.floor((indexArray.length * 0.45) / 3) * 3,
    targetError,
    ["ErrorAbsolute", "LockBorder"]
  )[0];
}
if (typeof self !== "undefined" && typeof document === "undefined") {
  self.onmessage = async ({ data: messageData }) => {
    try {
      const simplifiedIndices = await simplifyReflection(messageData);
      self.postMessage(
        {
          id: messageData.id,
          indices: simplifiedIndices
        },
        [simplifiedIndices.buffer]
      );
    } catch {
      self.postMessage({
        id: messageData.id,
        failed: true
      });
    }
  };
}
