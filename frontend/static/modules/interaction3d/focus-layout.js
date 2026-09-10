const canvasSessions = new WeakMap();
const hideDurationMs = 560;
const hideEasing = "cubic-bezier(.22,.61,.36,1)";
function sharedComponentIdsForOwner(owner) {
  return (owner.context.document?.pages?.find(page => page.id === owner.context.page?.id) || owner.context.page)?.sharedComponentIds || [];
}
function finishHideRecord(session, element, record) {
  for (const animation of record.animations) {
    animation.cancel();
  }
  element.inert = record.inert;
  if (record.ariaHidden === null) {
    element.removeAttribute("aria-hidden");
  } else {
    element.setAttribute("aria-hidden", record.ariaHidden);
  }
  if (record.visibility) {
    const {
      value,
      priority
    } = record.visibility;
    if (value) {
      element.style.setProperty("visibility", value, priority);
    } else {
      element.style.removeProperty("visibility");
    }
  }
  session.records.delete(element);
  if (!session.owners.size && !session.records.size && canvasSessions.get(session.canvas) === session) {
    canvasSessions.delete(session.canvas);
  }
}
function revealElement(session, element, record, immediate = false) {
  if (!!record.hidden || !!immediate) {
    record.hidden = false;
    if (immediate || record.duration === 0 || !record.animations.length) {
      finishHideRecord(session, element, record);
      return;
    }
    for (const animation of record.animations) {
      animation.reverse();
    }
  }
}
function hideElement(session, element, animate) {
  let record = session.records.get(element);
  if (record) {
    if (record.hidden) {
      return;
    }
    record.hidden = true;
    for (const animation of record.animations) {
      animation.updatePlaybackRate(1);
      animation.play();
    }
    return;
  }
  const view = element.ownerDocument.defaultView;
  const canvasRect = session.canvas.getBoundingClientRect();
  const scaleX = canvasRect.width / session.canvas.clientWidth || 1;
  const slideDistance = Math.max(24, (element.getBoundingClientRect().right - canvasRect.left) / scaleX + 24);
  const duration = view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : hideDurationMs;
  record = {
    hidden: true,
    animations: [],
    duration,
    inert: element.inert,
    ariaHidden: element.getAttribute("aria-hidden")
  };
  session.records.set(element, record);
  element.inert = true;
  element.setAttribute("aria-hidden", "true");
  if (typeof element.animate != "function") {
    record.visibility = {
      value: element.style.getPropertyValue("visibility"),
      priority: element.style.getPropertyPriority("visibility")
    };
    element.style.setProperty("visibility", "hidden", "important");
    return;
  }
  const translateAnimation = element.animate([{
    translate: "0px 0px"
  }, {
    translate: -slideDistance + "px 0px"
  }], {
    duration,
    easing: hideEasing,
    fill: "forwards",
    composite: "add"
  });
  const opacityAnimation = element.animate([{
    opacity: view.getComputedStyle(element).opacity
  }, {
    opacity: 0
  }], {
    duration,
    easing: hideEasing,
    fill: "forwards"
  });
  record.animations.push(translateAnimation, opacityAnimation);
  opacityAnimation.onfinish = () => {
    if (!record.hidden && session.records.get(element) === record) {
      finishHideRecord(session, element, record);
    }
  };
  if (!animate || duration === 0) {
    for (const animation of record.animations) {
      animation.finish();
    }
  }
}
function syncSession(session, animate = true) {
  const owners = [...session.owners];
  const sharedIds = new Set(owners.flatMap(sharedComponentIdsForOwner));
  const targets = new Set([...session.canvas.children].filter(child => {
    const componentId = child.dataset?.componentId || child.dataset?.effectFor || child.dataset?.airflowFor;
    return sharedIds.has(componentId) && !owners.some(owner => child.contains(owner.root));
  }));
  for (const [element, record] of session.records) {
    if (!targets.has(element)) {
      revealElement(session, element, record, element.parentElement !== session.canvas);
    }
  }
  for (const element of targets) {
    hideElement(session, element, animate);
  }
}
function acquireSession(canvas, owner) {
  let session = canvasSessions.get(canvas);
  if (!session) {
    session = {
      canvas,
      owners: new Set(),
      records: new Map(),
      observer: null
    };
    const MutationObserverCtor = canvas.ownerDocument.defaultView.MutationObserver;
    session.observer = new MutationObserverCtor(() => syncSession(session, false));
    canvasSessions.set(canvas, session);
  }
  if (!session.owners.size) {
    session.observer.observe(canvas, {
      childList: true
    });
  }
  session.owners.add(owner);
  syncSession(session);
  return session;
}
function releaseSession(session, owner, immediate) {
  session.owners.delete(owner);
  if (session.owners.size) {
    syncSession(session);
    return;
  }
  session.observer.disconnect();
  for (const [element, record] of session.records) {
    revealElement(session, element, record, immediate);
  }
  if (!session.records.size && canvasSessions.get(session.canvas) === session) {
    canvasSessions.delete(session.canvas);
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
    if (!active || disposed || context.editable) {
      return;
    }
    const canvas = root.closest(".hb-renderer-canvas");
    if (session?.canvas !== canvas) {
      if (session) {
        releaseSession(session, owner, true);
      }
      session = canvas ? acquireSession(canvas, owner) : null;
    } else if (session) {
      if (session.owners.has(owner)) {
        syncSession(session);
      } else {
        session = acquireSession(canvas, owner);
      }
    }
  };
  return {
    setActive(nextActive) {
      if (!disposed && !context.editable) {
        active = nextActive === true;
        if (active) {
          refresh();
        } else if (session) {
          releaseSession(session, owner, false);
        }
      }
    },
    refresh,
    dispose() {
      if (!disposed) {
        disposed = true;
        active = false;
        if (session) {
          releaseSession(session, owner, true);
        }
        session = null;
      }
    }
  };
}
