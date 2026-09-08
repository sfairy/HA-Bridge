const patched = new WeakSet();

export function cacheObjectTransforms(root, Object3D) {
  let count = 0;
  root?.traverse((object) => {
    if (
      patched.has(object) ||
      object.updateMatrix !== Object3D.prototype.updateMatrix
    ) {
      return;
    }
    const originalUpdateMatrix = object.updateMatrix;
    let px;
    let py;
    let pz;
    let qx;
    let qy;
    let qz;
    let qw;
    let sx;
    let sy;
    let sz;
    object.updateMatrix = function () {
      const { position, quaternion, scale } = this;
      if (
        position.x === px &&
        position.y === py &&
        position.z === pz &&
        quaternion.x === qx &&
        quaternion.y === qy &&
        quaternion.z === qz &&
        quaternion.w === qw &&
        scale.x === sx &&
        scale.y === sy &&
        scale.z === sz
      ) {
        this.matrixWorldNeedsUpdate = true;
        return;
      }
      originalUpdateMatrix.call(this);
      px = position.x;
      py = position.y;
      pz = position.z;
      qx = quaternion.x;
      qy = quaternion.y;
      qz = quaternion.z;
      qw = quaternion.w;
      sx = scale.x;
      sy = scale.y;
      sz = scale.z;
    };
    patched.add(object);
    count++;
  });
  return count;
}
