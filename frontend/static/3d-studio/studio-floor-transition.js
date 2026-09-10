export function createFloorTransition({
  THREE: Vector3,
  getRoot: arg16,
  dispose: arg17,
  release: arg18 = () => false,
  suspendReflections: arg19 = () => {},
  invalidate: arg20 = () => {}
}) {
  let push = [];
  let value14 = false;
  let from2 = null;
  const value15 = decompose2 => {
    const position = new Vector3.Vector3();
    const quaternion = new Vector3.Quaternion();
    const scale = new Vector3.Vector3();
    decompose2.decompose(position, quaternion, scale);
    return {
      position,
      quaternion,
      scale
    };
  };
  function capture(map2, arg4, arg5) {
    const children = arg16();
    children.updateMatrixWorld(true);
    return map2.map(id4 => {
      const userData2 = new Vector3.Group();
      userData2.name = "floor-transition-" + id4;
      userData2.userData.floorId = userData2.userData.regionFloorId = id4;
      const value5 = arg5 ? children.children.filter(userData => userData.userData.floorId === id4) : [...children.children];
      children.add(userData2);
      for (const value2 of value5) {
        userData2.attach(value2);
      }
      const ground = {
        id: id4,
        node: userData2,
        baseFrame: arg4(id4),
        ground: [],
        groundAlpha: 1
      };
      userData2.traverse(material => {
        if (!material.material || !["background", "grid", "contact-shadow"].includes(material.userData?.exportRole)) {
          return;
        }
        const map = material.material;
        const value = clone => {
          const onBeforeCompile = clone.clone();
          onBeforeCompile.onBeforeCompile = clone.onBeforeCompile;
          onBeforeCompile.customProgramCacheKey = clone.customProgramCacheKey.bind(clone);
          onBeforeCompile.transparent = true;
          onBeforeCompile.depthWrite = false;
          return onBeforeCompile;
        };
        material.material = Array.isArray(map) ? map.map(value) : value(map);
        ground.ground.push({
          node: material,
          followsFloor: material.userData.exportRole === "contact-shadow",
          original: map,
          materials: Array.isArray(material.material) ? material.material : [material.material],
          opacity: (Array.isArray(map) ? map : [map]).map(opacity => opacity.opacity)
        });
      });
      return ground;
    });
  }
  function fn(node5) {
    node5.node.updateMatrix();
    return node5.node.matrix.clone().multiply(node5.baseFrame);
  }
  function fn2(ground2) {
    for (const node of ground2.ground) {
      node.node.material = node.original;
      for (const dispose of node.materials) {
        dispose.dispose();
      }
    }
    ground2.ground = [];
  }
  function fn3(node6, arg6 = true) {
    fn2(node6);
    node6.node.removeFromParent();
    if (!node6.transferred && (!arg6 || !arg18(node6))) {
      arg17(node6.node);
    }
  }
  function reuse(node7, clone3) {
    fn2(node7);
    const length = [...node7.node.children];
    let userData3;
    if (length.length === 1 && length[0].userData.floorId === node7.id) {
      userData3 = length[0];
      node7.node.remove(userData3);
    } else {
      userData3 = new Vector3.Group();
      userData3.name = "floor-" + node7.id;
      userData3.userData.floorId = userData3.userData.regionFloorId = node7.id;
      for (const value6 of length) {
        node7.node.remove(value6);
        userData3.add(value6);
      }
    }
    userData3.applyMatrix4(clone3.clone().multiply(node7.baseFrame.clone().invert()));
    arg16().add(userData3);
    userData3.updateMatrixWorld(true);
    node7.transferred = true;
    return userData3;
  }
  function take(arg7, arg8, arg9) {
    const value10 = value14 ? push : capture(arg7, arg8, arg9);
    for (const frame2 of value10) {
      frame2.frame = fn(frame2);
      frame2.node.removeFromParent();
    }
    push = [];
    value14 = false;
    from2 = null;
    return value10;
  }
  function begin(map3, map4, indexOf, spread, arg10 = false, arg11 = null) {
    const add = arg16();
    const items = new Map(map3.map(id => [id.id, id]));
    const has = new Map(map4.map(id2 => [id2.id, id2]));
    const id6 = map4.find(id3 => items.has(id3.id)) || map4[0];
    const id7 = items.get(id6.id) || map3[0];
    const value11 = arg2 => indexOf.indexOf(arg2);
    const value12 = (clone2, arg3) => {
      const elements = clone2.clone();
      const value7 = (arg10 ? Math.sign(arg3) : arg3) * spread;
      const x = arg10 && arg11 ? arg11 : new Vector3.Vector3(0, 1, 0);
      elements.elements[12] += x.x * value7;
      elements.elements[13] += x.y * value7;
      elements.elements[14] += x.z * value7;
      return elements;
    };
    push = [];
    for (const node2 of map4) {
      const frame = items.get(node2.id);
      const decompose = (frame?.frame || value12(id7.frame, value11(node2.id) - value11(id7.id))).clone().multiply(node2.baseFrame.clone().invert());
      decompose.decompose(node2.node.position, node2.node.quaternion, node2.node.scale);
      node2.from = value15(decompose);
      node2.to = value15(new Vector3.Matrix4());
      node2.keep = true;
      node2.groundFrom = frame?.groundAlpha ?? 0;
      node2.groundTo = 1;
      push.push(node2);
      if (frame) {
        fn3(frame, false);
      }
    }
    for (const id5 of map3) {
      if (has.has(id5.id)) {
        continue;
      }
      add.add(id5.node);
      const multiply = value12(id6.baseFrame, value11(id5.id) - value11(id6.id));
      id5.from = value15(id5.node.matrix);
      id5.to = value15(multiply.multiply(id5.baseFrame.clone().invert()));
      id5.keep = false;
      id5.groundFrom = id5.groundAlpha;
      id5.groundTo = 0;
      push.push(id5);
    }
    from2 = arg10 ? {
      direction: Math.sign(value11(id6.id) - value11(id7.id)),
      spread
    } : null;
    value14 = true;
    arg19(true);
    sample(0);
  }
  function finish() {
    if (!value14 && !push.length) {
      return;
    }
    const attach = arg16();
    for (const node3 of push) {
      if (node3.keep && node3.node.parent === attach) {
        node3.node.position.set(0, 0, 0);
        node3.node.quaternion.identity();
        node3.node.scale.set(1, 1, 1);
        node3.node.updateMatrixWorld(true);
        fn2(node3);
        for (const value3 of [...node3.node.children]) {
          attach.attach(value3);
        }
        node3.node.removeFromParent();
      } else {
        fn3(node3);
      }
    }
    push = [];
    value14 = false;
    from2 = null;
    arg19(false);
    arg20(true);
  }
  const value16 = position2 => {
    const value8 = new Vector3.Vector3().fromArray(position2.position);
    const value9 = new Vector3.Vector3().fromArray(position2.target);
    return new Vector3.Matrix4().lookAt(value8, value9, new Vector3.Vector3().fromArray(position2.up || [0, 1, 0])).setPosition(value8);
  };
  function setSlideCameras(arg12, arg13) {
    if (from2) {
      from2.from = value16(arg12).invert();
      from2.to = value16(arg13).invert();
      for (const from of push) {
        from.slideBase = from.keep ? new Vector3.Matrix4() : new Vector3.Matrix4().compose(from.from.position, from.from.quaternion, from.from.scale);
      }
    }
  }
  function sample(arg14, arg15 = null) {
    if (!value14) {
      return;
    }
    if (push.some(keep => keep.keep && keep.node.parent !== arg16())) {
      finish();
      return;
    }
    const value13 = Math.max(0, Math.min(1, arg14));
    for (const node4 of push) {
      if (from2?.from && arg15) {
        const value4 = from2.direction * from2.spread * (node4.keep ? 1 - value13 : -value13);
        value16(arg15).multiply(new Vector3.Matrix4().makeTranslation(0, value4, 0)).multiply(node4.keep ? from2.to : from2.from).multiply(node4.slideBase).decompose(node4.node.position, node4.node.quaternion, node4.node.scale);
      } else {
        node4.node.position.lerpVectors(node4.from.position, node4.to.position, value13);
        node4.node.quaternion.slerpQuaternions(node4.from.quaternion, node4.to.quaternion, value13);
        node4.node.scale.lerpVectors(node4.from.scale, node4.to.scale, value13);
      }
      node4.node.updateMatrixWorld(true);
      node4.groundAlpha = node4.groundFrom + (node4.groundTo - node4.groundFrom) * value13;
      for (const materials of node4.ground) {
        materials.materials.forEach((opacity2, arg) => {
          opacity2.opacity = materials.opacity[arg] * (materials.followsFloor ? 1 : node4.groundAlpha);
        });
      }
    }
    arg20(false);
    if (value13 === 1) {
      finish();
    }
  }
  return {
    capture,
    take,
    reuse,
    begin,
    sample,
    setSlideCameras,
    finish,
    get active() {
      return value14;
    },
    get records() {
      return push;
    }
  };
}
