const instrumentedObjects = new WeakSet();
export function cacheObjectTransforms(rootObject, objectPrototype) {
  let instrumentedCount = 0;
  rootObject?.traverse(traversedObject => {
    if (
      instrumentedObjects.has(traversedObject) ||
      traversedObject.updateMatrix !== objectPrototype.prototype.updateMatrix
    ) {
      return;
    }
    const originalUpdateMatrix = traversedObject.updateMatrix;
    let lastPositionX;
    let lastPositionY;
    let lastPositionZ;
    let lastQuaternionX;
    let lastQuaternionY;
    let lastQuaternionZ;
    let lastQuaternionW;
    let lastScaleX;
    let lastScaleY;
    let lastScaleZ;
    let lastParent;
    traversedObject.updateMatrix = function () {
      const position = this.position;
      const quaternion = this.quaternion;
      const scale = this.scale;
      if (
        position.x === lastPositionX &&
        position.y === lastPositionY &&
        position.z === lastPositionZ &&
        quaternion.x === lastQuaternionX &&
        quaternion.y === lastQuaternionY &&
        quaternion.z === lastQuaternionZ &&
        quaternion.w === lastQuaternionW &&
        scale.x === lastScaleX &&
        scale.y === lastScaleY &&
        scale.z === lastScaleZ
      ) {
        if (this.parent !== lastParent) {
          this.matrixWorldNeedsUpdate = true;
        }
        lastParent = this.parent;
        return;
      }
      originalUpdateMatrix.call(this);
      lastParent = this.parent;
      lastPositionX = position.x;
      lastPositionY = position.y;
      lastPositionZ = position.z;
      lastQuaternionX = quaternion.x;
      lastQuaternionY = quaternion.y;
      lastQuaternionZ = quaternion.z;
      lastQuaternionW = quaternion.w;
      lastScaleX = scale.x;
      lastScaleY = scale.y;
      lastScaleZ = scale.z;
    };
    instrumentedObjects.add(traversedObject);
    instrumentedCount++;
  });
  return instrumentedCount;
}
