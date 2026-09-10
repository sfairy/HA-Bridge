import { MeshoptSimplifier } from "../vendor/meshoptimizer/0.25/meshopt_simplifier.module.js";
export async function simplifyReflection({
  indices: length,
  positions: arg,
  attributes: arg2,
  stride: arg3,
  weights: arg4,
  error: arg5
}) {
  await MeshoptSimplifier.ready;
  return MeshoptSimplifier.simplifyWithAttributes(length, arg, 3, arg2, arg3, arg4, null, Math.floor(length.length * 0.45 / 3) * 3, arg5, ["ErrorAbsolute", "LockBorder"])[0];
}
if (typeof self !== "undefined" && typeof document === "undefined") {
  self.onmessage = async ({
    data: id
  }) => {
    try {
      const indices = await simplifyReflection(id);
      self.postMessage({
        id: id.id,
        indices
      }, [indices.buffer]);
    } catch {
      self.postMessage({
        id: id.id,
        failed: true
      });
    }
  };
}
