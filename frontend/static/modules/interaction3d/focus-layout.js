const canvasSessions = new WeakMap();
const animationMsPerUnit = 580;
const minSlideDistance = 24;
const interactiveHostSelector = ".hb-interaction3d-host, iframe, video, audio, object, embed";
const animatedStyleProps = ["translate", "opacity", "transition", "willChange", "pointerEvents"];
const focusableSelector = "a[href], area[href], button, input, select, textarea, [tabindex], [contenteditable], summary";
const guardEvents = ["pointerdown", "click", "dblclick", "contextmenu", "keydown", "focusin"];
function sharedComponentIdsForOwner(owner) {
  return (owner.context.document?.pages?.find(page => page.id === owner.context.page?.id) || owner.context.page)?.sharedComponentIds || [];
}
function easeAmount(value) {
  let guess = value;
  for (let index = 0; index < 8; index++) {
    guess = Math.max(0, Math.min(1, guess - (0.6 * guess - 0.6 * guess * guess + guess * guess * guess - value) / (0.6 - 1.2 * guess + 3 * guess * guess)));
  }
  return guess * guess * (3 - 2 * guess);
}
function splitTranslate(value) {
  return !value || value === "none" ? ["0px", "0px"] : value.match(/(?:calc\([^)]*\)|[^\s])+/g) || ["0px", "0px"];
}
function addTabStops(element, record) {
  for (const node of [element, ...element.querySelectorAll(focusableSelector)]) {
    if (node.tabIndex >= 0 && !record.tabStops.has(node)) {
      record.tabStops.set(node, node.getAttribute("tabindex"));
      node.setAttribute("tabindex", "-1");
    }
  }
}
function applyHidden(element, record, hidden) {
  if (record.hidden === hidden) {
    return;
  }
  record.hidden = hidden;
  if (hidden) {
    addTabStops(element, record);
    if (element.contains(element.ownerDocument.activeElement)) {
      element.ownerDocument.activeElement.blur();
    }
    element.style.pointerEvents = "none";
  } else {
    for (const [node, tabindex] of record.tabStops) {
      tabindex === null ? node.removeAttribute("tabindex") : node.setAttribute("tabindex", tabindex);
    }
    record.tabStops.clear();
    element.style.pointerEvents = record.style.pointerEvents;
  }
  const ariaHidden = hidden ? "true" : record.ariaHidden;
  if (element.getAttribute("aria-hidden") !== ariaHidden) {
    ariaHidden === null ? element.removeAttribute("aria-hidden") : element.setAttribute("aria-hidden", ariaHidden);
  }
}
function applyTransform(session, element, record, amount) {
  const [translateX, translateY = "0px", translateZ] = record.translate;
  element.style.translate = "calc(" + translateX + " - " + session.distance * amount + "px) " + translateY + (translateZ ? " " + translateZ : "");
  element.style.opacity = String(record.opacity * (1 - amount));
  applyHidden(element, record, amount > 0 || session.owners.size > 0 && session.targets.has(element));
}
function resetRecord(session, element, record) {
  for (const prop of animatedStyleProps) {
    element.style[prop] = record.style[prop];
  }
  applyHidden(element, record, false);
  session.members.delete(element);
  session.targets.delete(element);
}
function cancelFrame(session) {
  if (session.frame !== null) {
    session.view.cancelAnimationFrame(session.frame);
  }
  session.frame = null;
}
function paintTargets(session) {
  for (const element of session.targets) {
    const record = session.members.get(element);
    if (record) {
      applyTransform(session, element, record, session.amount);
    }
  }
}
function animateAmount(session, to, animate = true) {
  if (session.to === to && (animate && session.frame !== null || session.amount === to)) {
    paintTargets(session);
    return;
  }
  cancelFrame(session);
  const from = session.amount;
  session.to = to;
  if (!animate || session.view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    session.amount = to;
    paintTargets(session);
    return;
  }
  const startedAt = session.view.performance.now();
  const duration = animationMsPerUnit * Math.abs(to - from);
  const step = now => {
    session.frame = null;
    const progress = duration ? Math.max(0, Math.min(1, (now - startedAt) / duration)) : 1;
    session.amount = from + (to - from) * easeAmount(progress);
    paintTargets(session);
    if (progress < 1) {
      session.frame = session.view.requestAnimationFrame(step);
    }
  };
  session.frame = session.view.requestAnimationFrame(step);
}
function syncSession(session) {
  const clients = [...session.clients];
  const sharedIds = new Set(clients.flatMap(sharedComponentIdsForOwner));
  const ownerIds = new Set([...session.owners].flatMap(sharedComponentIdsForOwner));
  const candidates = [...session.canvas.children].filter(child => {
    const componentId = child.dataset?.componentId || child.dataset?.effectFor || child.dataset?.airflowFor;
    return sharedIds.has(componentId) && !clients.some(client => child.contains(client.root)) && !child.matches?.(interactiveHostSelector) && !child.querySelector?.(interactiveHostSelector);
  });
  const nextTargets = new Set(candidates);
  for (const [element, record] of session.members) {
    if (!nextTargets.has(element)) {
      resetRecord(session, element, record);
    }
  }
  const canvasRect = session.canvas.getBoundingClientRect();
  const scale = canvasRect.width / session.canvas.clientWidth || 1;
  let distance = minSlideDistance;
  for (const element of candidates) {
    let record = session.members.get(element);
    const rect = element.getBoundingClientRect();
    distance = Math.max(distance, (rect.right - canvasRect.left) / scale + minSlideDistance + (record && session.targets.has(element) ? session.distance * session.amount : 0));
    if (!record) {
      const computed = session.view.getComputedStyle(element);
      record = {
        style: Object.fromEntries(animatedStyleProps.map(prop => [prop, element.style[prop] || ""])),
        opacity: Number(computed.opacity),
        translate: splitTranslate(computed.translate),
        hidden: false,
        tabStops: new Map(),
        ariaHidden: element.getAttribute("aria-hidden")
      };
      session.members.set(element, record);
      element.style.transition = "none";
      element.style.willChange = [record.style.willChange, "opacity", "translate"].filter(value => value && value !== "auto").join(",");
      applyTransform(session, element, record, 0);
    }
  }
  session.distance = distance;
  if (session.owners.size) {
    const ownerTargets = new Set(candidates.filter(element => ownerIds.has(element.dataset.componentId || element.dataset.effectFor || element.dataset.airflowFor)));
    for (const element of session.targets) {
      if (!ownerTargets.has(element) && session.members.has(element)) {
        session.targets.delete(element);
        applyTransform(session, element, session.members.get(element), 0);
      }
    }
    session.targets = ownerTargets;
  }
  paintTargets(session);
}
function detachSession(session, owner) {
  session.owners.delete(owner);
  session.clients.delete(owner);
  if (session.clients.size) {
    syncSession(session);
    animateAmount(session, session.owners.size ? 1 : 0, false);
  } else {
    cancelFrame(session);
    session.observer.disconnect();
    for (const eventName of guardEvents) {
      session.canvas.removeEventListener(eventName, session.guard, true);
    }
    for (const [element, record] of session.members) {
      resetRecord(session, element, record);
    }
    if (canvasSessions.get(session.canvas) === session) {
      canvasSessions.delete(session.canvas);
    }
  }
}
export function createInteraction3dFocusLayout(root, context = {}) {
  const owner = {
    root,
    context
  };
  let session = null;
  let active = false;
  let disposed = false;
  const refresh = () => {
    if (disposed || context.editable) {
      return;
    }
    const canvas = root.closest(".hb-renderer-canvas");
    if (session?.canvas !== canvas) {
      if (session) {
        detachSession(session, owner);
      }
      session = null;
      if (!canvas) {
        return;
      }
      session = canvasSessions.get(canvas);
      if (!session) {
        const view = canvas.ownerDocument.defaultView;
        session = {
          canvas,
          view,
          clients: new Set(),
          owners: new Set(),
          members: new Map(),
          targets: new Set(),
          frame: null,
          amount: 0,
          to: 0,
          distance: minSlideDistance
        };
        const capturedSession = session;
        session.guard = event => {
          for (const [element, record] of capturedSession.members) {
            if (record.hidden && element.contains(event.target)) {
              event.preventDefault();
              event.stopImmediatePropagation();
              if (event.type === "focusin") {
                event.target.blur();
              }
              return;
            }
          }
        };
        for (const eventName of guardEvents) {
          canvas.addEventListener(eventName, session.guard, true);
        }
        session.observer = new view.MutationObserver(records => {
          if (records.some(record => record.target === canvas)) {
            syncSession(capturedSession);
          }
          for (const [element, record] of capturedSession.members) {
            if (record.hidden) {
              addTabStops(element, record);
            }
          }
        });
        session.observer.observe(canvas, {
          childList: true,
          subtree: true
        });
        canvasSessions.set(canvas, session);
      }
      session.clients.add(owner);
    }
    if (session) {
      active ? session.owners.add(owner) : session.owners.delete(owner);
      syncSession(session);
      animateAmount(session, session.owners.size ? 1 : 0);
    }
  };
  return {
    refresh,
    setActive(nextActive) {
      if (!disposed && !context.editable) {
        active = nextActive === true;
        refresh();
      }
    },
    dispose() {
      if (!disposed) {
        disposed = true;
        if (session) {
          detachSession(session, owner);
        }
        session = null;
      }
    }
  };
}
