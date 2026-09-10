export function createEnvironmentHalos({
  THREE: Vector3,
  modeAmount: haloMode
}) {
  const values = new Map();
  let traverse;
  let value9;
  let value10;
  let value11 = false;
  const value12 = (arg, arg2) => JSON.stringify([String(arg ?? ""), String(arg2 ?? "")]);
  const dispose = new Vector3.PlaneGeometry(1, 1);
  function fn2(arg4) {
    const union = new Vector3.Box3();
    function fn(geometry, arg3) {
      if (!geometry.userData?.environmentEffect && !geometry.userData?.curtainMotionRig && (geometry === arg4 || geometry.userData?.environmentModelId == null)) {
        if (geometry.isMesh && geometry.geometry?.attributes?.position) {
          if (!geometry.geometry.boundingBox) {
            geometry.geometry.computeBoundingBox();
          }
          union.union(geometry.geometry.boundingBox.clone().applyMatrix4(arg3));
        }
        for (const matrixAutoUpdate of geometry.children || []) {
          if (matrixAutoUpdate.matrixAutoUpdate) {
            matrixAutoUpdate.updateMatrix();
          }
          fn(matrixAutoUpdate, new Vector3.Matrix4().multiplyMatrices(arg3, matrixAutoUpdate.matrix));
        }
      }
    }
    fn(arg4, new Vector3.Matrix4());
    if (union.isEmpty()) {
      return null;
    } else {
      return union;
    }
  }
  function fn3(mesh3) {
    mesh3.mesh.removeFromParent();
    mesh3.mesh.material.dispose();
  }
  function sync(arg5, map, arg6, arg7) {
    const value7 = JSON.stringify(map.map(id => [id.id, id.floorId, id.modelId, id.visible]));
    if (traverse === arg5 && value9 === arg6 && value10 === value7) {
      return;
    }
    traverse = arg5;
    value9 = arg6;
    value10 = value7;
    const map2 = arg7 || new Map();
    if (!arg7 && map.length) {
      traverse?.traverse(userData2 => {
        if (userData2.userData?.environmentModelId == null) {
          return;
        }
        let value = userData2.userData.environmentFloorId;
        for (let parent = userData2.parent; value == null && parent; parent = parent.parent) {
          value = parent.userData.environmentFloorId;
        }
        map2.set(value12(value, userData2.userData.environmentModelId), userData2);
      });
    }
    const add = new Set();
    for (const id2 of map) {
      if (id2.visible === false) {
        continue;
      }
      const userData3 = map2.get(value12(id2.floorId, id2.modelId));
      if (!userData3) {
        continue;
      }
      const max = fn2(userData3);
      if (!max) {
        continue;
      }
      const z = max.getSize(new Vector3.Vector3());
      const center = max.getCenter(new Vector3.Vector3());
      const value3 = userData3.userData.environmentModelType === "airoutlet" && z.z > z.x;
      const width = value3 ? z.z : z.x;
      const height = z.y;
      if (!(width > 0) || !(height > 0)) {
        continue;
      }
      add.add(id2.id);
      let mesh = values.get(id2.id);
      if (mesh && mesh.model !== userData3) {
        fn3(mesh);
        values.delete(id2.id);
        mesh = null;
      }
      if (!mesh) {
        const value2 = new Vector3.ShaderMaterial({
          uniforms: {
            haloMode,
            haloColor: {
              value: new Vector3.Color(0, 0, 0)
            },
            haloSize: {
              value: new Vector3.Vector2()
            },
            haloFeather: {
              value: 0
            },
            haloRects: {
              value: Array.from({
                length: 3
              }, () => new Vector3.Vector4())
            },
            haloRectCount: {
              value: 1
            }
          },
          vertexShader: "varying vec2 vHaloUv; void main(){ vHaloUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
          fragmentShader: "varying vec2 vHaloUv;\n            uniform float haloMode, haloFeather;\n            uniform vec2 haloSize;\n            uniform vec3 haloColor;\n            uniform vec4 haloRects[3];\n            uniform int haloRectCount;\n            void main() {\n              vec2 p = (vHaloUv - 0.5) * (haloSize + vec2(haloFeather * 2.0));\n              float d = 10000.0;\n              for (int i = 0; i < 3; i++) {\n                if (i >= haloRectCount) break;\n                vec4 rect = haloRects[i];\n                float radius = min(rect.z, rect.w) * 0.18;\n                vec2 q = abs(p - rect.xy) - rect.zw + vec2(radius);\n                d = min(d, length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius);\n              }\n              float outer = 1.0 - smoothstep(0.0, haloFeather, max(d, 0.0));\n              // Fade monotonically away from the surface. A bright peak at\n              // the bounding edge reads as an illuminated frame, not soft spill.\n              float alpha = outer * outer * haloMode * 0.025;\n              if (alpha < 0.001) discard;\n              gl_FragColor = vec4(haloColor, alpha);\n              #include <colorspace_fragment>\n            }",
          transparent: true,
          blending: Vector3.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          side: Vector3.DoubleSide,
          forceSinglePass: true,
          toneMapped: false
        });
        const name = new Vector3.Mesh(dispose, value2);
        name.name = "environment-halo-" + id2.id;
        Object.assign(name.userData, {
          environmentEffect: true,
          environmentHalo: true,
          externalModelSharedGeometry: true,
          externalModelSharedMaterial: true
        });
        name.raycast = () => {};
        name.visible = false;
        userData3.add(name);
        mesh = {
          model: userData3,
          mesh: name
        };
        values.set(id2.id, mesh);
      }
      const element = Math.max(0.025, Math.min(0.07, Math.min(width, height) * 0.15));
      mesh.mesh.material.uniforms.haloSize.value.set(width, height);
      mesh.mesh.material.uniforms.haloFeather.value = element;
      mesh.mesh.scale.set(width + element * 2, height + element * 2, 1);
      mesh.mesh.position.copy(center);
      mesh.mesh.rotation.y = value3 ? Math.PI / 2 : 0;
      if (value3) {
        mesh.mesh.position.x = max.max.x + 0.006;
      } else {
        mesh.mesh.position.z = max.max.z + 0.006;
      }
      mesh.mesh.updateMatrix();
      mesh.center = center;
      mesh.bounds = max;
      mesh.width = width;
      mesh.height = height;
      mesh.panels = [];
      if (userData3.userData.environmentModelType === "curtain") {
        userData3.traverse(userData => {
          if (userData.userData.curtainMotionPanel) {
            mesh.panels.push(userData);
          }
        });
      }
      mesh.pose = null;
      fn4(mesh);
    }
    for (const [value4, value5] of values) {
      if (!add.has(value4)) {
        fn3(value5);
        values.delete(value4);
      }
    }
  }
  function fn4(panels2) {
    const pose = panels2.panels.map(visible => visible.visible + ":" + visible.scale.x).join("|");
    if (pose === panels2.pose) {
      return;
    }
    panels2.pose = pose;
    const haloRectCount = panels2.mesh.material.uniforms;
    const value8 = haloRectCount.haloRects.value;
    const length = panels2.panels.filter(visible2 => visible2.visible);
    if (!length.length) {
      haloRectCount.haloRectCount.value = 1;
      value8[0].set(0, 0, panels2.width / 2, panels2.height / 2);
      return;
    }
    let element2 = 0;
    for (const geometry2 of length.slice(0, 2)) {
      const unshift = [];
      for (let parent2 = geometry2; parent2 && parent2 !== panels2.model; parent2 = parent2.parent) {
        unshift.unshift(parent2);
      }
      const multiply = new Vector3.Matrix4();
      for (const matrixAutoUpdate2 of unshift) {
        if (matrixAutoUpdate2.matrixAutoUpdate) {
          matrixAutoUpdate2.updateMatrix();
        }
        multiply.multiply(matrixAutoUpdate2.matrix);
      }
      if (!geometry2.geometry.boundingBox) {
        geometry2.geometry.computeBoundingBox();
      }
      const getCenter = geometry2.geometry.boundingBox.clone().applyMatrix4(multiply);
      const x = getCenter.getCenter(new Vector3.Vector3());
      const x2 = getCenter.getSize(new Vector3.Vector3());
      value8[element2++].set(x.x - panels2.center.x, x.y - panels2.center.y, x2.x / 2, x2.y / 2);
    }
    haloRectCount.haloRectCount.value = element2;
  }
  function update() {
    if (value11) {
      for (const panels of values.values()) {
        if (panels.panels.length) {
          fn4(panels);
        }
      }
    }
  }
  function setColor(arg8, r2) {
    const mesh4 = values.get(arg8);
    if (mesh4) {
      mesh4.mesh.material.uniforms.haloColor.value.copy(r2);
      mesh4.mesh.visible = value11 && r2.r + r2.g + r2.b > 0;
    }
  }
  function setVisible(arg9) {
    value11 = arg9;
    for (const mesh2 of values.values()) {
      const r = mesh2.mesh.material.uniforms.haloColor.value;
      mesh2.mesh.visible = value11 && r.r + r.g + r.b > 0;
    }
  }
  function clear() {
    for (const value6 of values.values()) {
      fn3(value6);
    }
    values.clear();
    traverse = null;
    value9 = undefined;
    value10 = undefined;
  }
  return {
    sync,
    setColor,
    setVisible,
    clear,
    update,
    dispose() {
      clear();
      dispose.dispose();
    }
  };
}
