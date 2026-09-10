import { MeshoptSimplifier } from "../vendor/meshoptimizer/1.2.0/meshopt_simplifier.module.js";
export async function simplifyReflection({
  indices,
  positions,
  attributes,
  stride,
  weights,
  error
}) {
  await MeshoptSimplifier.ready;
  return MeshoptSimplifier.simplifyWithAttributes(indices, positions, 3, attributes, stride, weights, null, Math.floor(indices.length * 0.45 / 3) * 3, error, ["ErrorAbsolute", "LockBorder"])[0];
}
if (typeof self !== "undefined" && typeof document === "undefined") {
  self.onmessage = async ({
    data: message
  }) => {
    try {
      const simplifiedIndices = await simplifyReflection(message);
      self.postMessage({
        id: message.id,
        indices: simplifiedIndices
      }, [simplifiedIndices.buffer]);
    } catch {
      self.postMessage({
        id: message.id,
        failed: true
      });
    }
  };
}
