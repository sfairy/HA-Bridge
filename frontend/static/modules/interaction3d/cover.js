export function createInteraction3dCover({ showTitle = false } = {}) {
  const root = document.createElement("span");
  root.className = "interaction3d-cover";
  const image = document.createElement("img");
  image.src =
    "/bridge-static/component-thumbnails/interaction3d.png?v=20260907-interaction3d-cover-v1";
  image.alt = "";
  image.decoding = "async";
  const title = document.createElement("span");
  title.className = "interaction3d-cover-title";
  const message = document.createElement("span");
  message.className = "interaction3d-cover-message";
  const label = document.createElement("span");
  label.textContent = "3D 交互";
  message.append(label);
  title.append(message);
  title.hidden = !showTitle;
  root.append(image, title);
  return root;
}
