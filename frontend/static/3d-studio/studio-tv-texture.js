import { drawTelevisionPoster } from "./studio-television-poster.js?v=0.5.3";
import * as THREE from "/bridge-static/vendor/three/0.186.0/three.module.min.js";

/** Build the default powered-on TV poster texture used by studio mesh builders. */
export function createTvScreenTexture(renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 540;
  const canvasCtx = canvas.getContext("2d");
  if (!canvasCtx) {
    return null;
  }
  drawTelevisionPoster(canvas, canvasCtx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  texture.needsUpdate = true;
  return texture;
}
