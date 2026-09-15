const layoutStateByCanvas = new WeakMap();
const ANIMATION_MS_PER_UNIT = 580;
const BASE_DISTANCE_PX = 24;
const EXCLUDED_CONTENT_SELECTOR = ".hb-interaction3d-host, iframe, video, audio, object, embed";
const TRACKED_STYLE_PROPS = ["translate", "opacity", "transition", "willChange", "pointerEvents"];
function getSharedComponentIds(layoutClient) {
  return (
    (
      layoutClient.context.document?.pages?.find(
        contextPage => contextPage.id === layoutClient.context.page?.id
      ) || layoutClient.context.page
    )?.sharedComponentIds || []
  );
}
function easeProgress(progress) {
  let curveParam = progress;
  for (let iterationIndex = 0; iterationIndex < 8; iterationIndex++) {
    curveParam = Math.max(
      0,
      Math.min(
        1,
        curveParam -
          (curveParam * 0.6 -
            curveParam * 0.6 * curveParam +
            curveParam * curveParam * curveParam -
            progress) /
            (0.6 - curveParam * 1.2 + curveParam * 3 * curveParam)
      )
    );
  }
  return curveParam * curveParam * (3 - curveParam * 2);
}
function parseTranslateValue(translateValue) {
  if (!translateValue || translateValue === "none") {
    return ["0px", "0px"];
  } else {
    return translateValue.match(/(?:calc\([^)]*\)|[^\s])+/g) || ["0px", "0px"];
  }
}
const FOCUSABLE_SELECTOR =
  "a[href], area[href], button, input, select, textarea, [tabindex], [contenteditable], summary";
const GUARD_EVENT_TYPES = ["pointerdown", "click", "dblclick", "contextmenu", "keydown", "focusin"];
function suspendTabStops(subtreeRootElement, memberState) {
  const tabbableElements = [
    subtreeRootElement,
    ...subtreeRootElement.querySelectorAll(FOCUSABLE_SELECTOR)
  ];
  for (const tabbableElement of tabbableElements) {
    if (tabbableElement.tabIndex >= 0 && !memberState.tabStops.has(tabbableElement)) {
      memberState.tabStops.set(tabbableElement, tabbableElement.getAttribute("tabindex"));
      tabbableElement.setAttribute("tabindex", "-1");
    }
  }
}
function applyHiddenState(memberElement, memberRecord, isHidden) {
  if (memberRecord.hidden === isHidden) {
    return;
  }
  memberRecord.hidden = isHidden;
  if (isHidden) {
    suspendTabStops(memberElement, memberRecord);
    if (memberElement.contains(memberElement.ownerDocument.activeElement)) {
      memberElement.ownerDocument.activeElement.blur();
    }
    memberElement.style.pointerEvents = "none";
  } else {
    for (const [tabStopElement, previousTabIndex] of memberRecord.tabStops) {
      if (previousTabIndex === null) {
        tabStopElement.removeAttribute("tabindex");
      } else {
        tabStopElement.setAttribute("tabindex", previousTabIndex);
      }
    }
    memberRecord.tabStops.clear();
    memberElement.style.pointerEvents = memberRecord.style.pointerEvents;
  }
  const ariaHiddenValue = isHidden ? "true" : memberRecord.ariaHidden;
  if (memberElement.getAttribute("aria-hidden") !== ariaHiddenValue) {
    if (ariaHiddenValue === null) {
      memberElement.removeAttribute("aria-hidden");
    } else {
      memberElement.setAttribute("aria-hidden", ariaHiddenValue);
    }
  }
}
function applyMemberMotion(layoutState, motionElement, memberSnapshot, amount) {
  const [translateX, translateY = "0px", translateZ] = memberSnapshot.translate;
  motionElement.style.translate =
    "calc(" +
    translateX +
    " - " +
    layoutState.distance * amount +
    "px) " +
    translateY +
    (translateZ ? " " + translateZ : "");
  motionElement.style.opacity = String(memberSnapshot.opacity * (1 - amount));
  applyHiddenState(
    motionElement,
    memberSnapshot,
    amount > 0 || (layoutState.owners.size > 0 && layoutState.targets.has(motionElement))
  );
}
function detachMember(layout, detachedElement, detachedMemberState) {
  for (const styleProperty of TRACKED_STYLE_PROPS) {
    detachedElement.style[styleProperty] = detachedMemberState.style[styleProperty];
  }
  applyHiddenState(detachedElement, detachedMemberState, false);
  layout.members.delete(detachedElement);
  layout.targets.delete(detachedElement);
}
function cancelMotionFrame(frameOwner) {
  if (frameOwner.frame !== null) {
    frameOwner.view.cancelAnimationFrame(frameOwner.frame);
  }
  frameOwner.frame = null;
}
function renderMembers(renderingLayout) {
  for (const renderedElement of renderingLayout.targets) {
    const renderedMemberState = renderingLayout.members.get(renderedElement);
    if (renderedMemberState) {
      applyMemberMotion(
        renderingLayout,
        renderedElement,
        renderedMemberState,
        renderingLayout.amount
      );
    }
  }
}
function animateAmount(animatingLayout, targetAmount, shouldAnimate = true) {
  if (
    animatingLayout.to === targetAmount &&
    ((shouldAnimate && animatingLayout.frame !== null) || animatingLayout.amount === targetAmount)
  ) {
    renderMembers(animatingLayout);
    return;
  }
  cancelMotionFrame(animatingLayout);
  const fromAmount = animatingLayout.amount;
  animatingLayout.to = targetAmount;
  if (
    !shouldAnimate ||
    animatingLayout.view.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    animatingLayout.amount = targetAmount;
    renderMembers(animatingLayout);
    return;
  }
  const startTimeMs = animatingLayout.view.performance.now();
  const durationMs = ANIMATION_MS_PER_UNIT * Math.abs(targetAmount - fromAmount);
  const advanceMotion = timestampMs => {
    animatingLayout.frame = null;
    const elapsedFraction = durationMs
      ? Math.max(0, Math.min(1, (timestampMs - startTimeMs) / durationMs))
      : 1;
    animatingLayout.amount =
      fromAmount + (targetAmount - fromAmount) * easeProgress(elapsedFraction);
    renderMembers(animatingLayout);
    if (elapsedFraction < 1) {
      animatingLayout.frame = animatingLayout.view.requestAnimationFrame(advanceMotion);
    }
  };
  animatingLayout.frame = animatingLayout.view.requestAnimationFrame(advanceMotion);
}
function updateLayout(canvasLayout) {
  const clientList = [...canvasLayout.clients];
  const clientComponentIds = new Set(clientList.flatMap(getSharedComponentIds));
  const ownerComponentIds = new Set([...canvasLayout.owners].flatMap(getSharedComponentIds));
  const componentElements = [...canvasLayout.canvas.children].filter(canvasChild => {
    const componentId =
      canvasChild.dataset?.componentId ||
      canvasChild.dataset?.effectFor ||
      canvasChild.dataset?.airflowFor;
    return (
      clientComponentIds.has(componentId) &&
      !clientList.some(clientEntry => canvasChild.contains(clientEntry.root)) &&
      !canvasChild.matches?.(EXCLUDED_CONTENT_SELECTOR) &&
      !canvasChild.querySelector?.(EXCLUDED_CONTENT_SELECTOR)
    );
  });
  const componentElementSet = new Set(componentElements);
  for (const [trackedElement, trackedMemberState] of canvasLayout.members) {
    if (!componentElementSet.has(trackedElement)) {
      detachMember(canvasLayout, trackedElement, trackedMemberState);
    }
  }
  const canvasRect = canvasLayout.canvas.getBoundingClientRect();
  const canvasScale = canvasRect.width / canvasLayout.canvas.clientWidth || 1;
  let distancePx = BASE_DISTANCE_PX;
  for (const childElement of componentElements) {
    let childMemberState = canvasLayout.members.get(childElement);
    const childRect = childElement.getBoundingClientRect();
    distancePx = Math.max(
      distancePx,
      (childRect.right - canvasRect.left) / canvasScale +
        BASE_DISTANCE_PX +
        (childMemberState && canvasLayout.targets.has(childElement)
          ? canvasLayout.distance * canvasLayout.amount
          : 0)
    );
    if (!childMemberState) {
      const computedStyle = canvasLayout.view.getComputedStyle(childElement);
      childMemberState = {
        style: Object.fromEntries(
          TRACKED_STYLE_PROPS.map(trackedProperty => [
            trackedProperty,
            childElement.style[trackedProperty] || ""
          ])
        ),
        opacity: Number(computedStyle.opacity),
        translate: parseTranslateValue(computedStyle.translate),
        hidden: false,
        tabStops: new Map(),
        ariaHidden: childElement.getAttribute("aria-hidden")
      };
      canvasLayout.members.set(childElement, childMemberState);
      childElement.style.transition = "none";
      childElement.style.willChange = [childMemberState.style.willChange, "opacity", "translate"]
        .filter(styleValue => styleValue && styleValue !== "auto")
        .join(",");
      applyMemberMotion(canvasLayout, childElement, childMemberState, 0);
    }
  }
  canvasLayout.distance = distancePx;
  if (canvasLayout.owners.size) {
    const newTargetSet = new Set(
      componentElements.filter(ownerComponentElement =>
        ownerComponentIds.has(
          ownerComponentElement.dataset.componentId ||
            ownerComponentElement.dataset.effectFor ||
            ownerComponentElement.dataset.airflowFor
        )
      )
    );
    for (const staleTarget of canvasLayout.targets) {
      if (!newTargetSet.has(staleTarget) && canvasLayout.members.has(staleTarget)) {
        canvasLayout.targets.delete(staleTarget);
        applyMemberMotion(canvasLayout, staleTarget, canvasLayout.members.get(staleTarget), 0);
      }
    }
    canvasLayout.targets = newTargetSet;
  }
  renderMembers(canvasLayout);
}
function releaseLayout(releasedLayout, clientRegistration) {
  releasedLayout.owners.delete(clientRegistration);
  releasedLayout.clients.delete(clientRegistration);
  if (releasedLayout.clients.size) {
    updateLayout(releasedLayout);
    animateAmount(releasedLayout, releasedLayout.owners.size ? 1 : 0, false);
  } else {
    cancelMotionFrame(releasedLayout);
    releasedLayout.observer.disconnect();
    for (const eventName of GUARD_EVENT_TYPES) {
      releasedLayout.canvas.removeEventListener(eventName, releasedLayout.guard, true);
    }
    for (const [releasedElement, releasedMemberState] of releasedLayout.members) {
      detachMember(releasedLayout, releasedElement, releasedMemberState);
    }
    if (layoutStateByCanvas.get(releasedLayout.canvas) === releasedLayout) {
      layoutStateByCanvas.delete(releasedLayout.canvas);
    }
  }
}
export function createInteraction3dFocusLayout(rootElement, context = {}) {
  const registration = {
    root: rootElement,
    context: context
  };
  let activeLayout = null;
  let isActive = false;
  let isDisposed = false;
  const refreshLayout = () => {
    if (isDisposed || context.editable) {
      return;
    }
    const canvasElement = rootElement.closest(".hb-renderer-canvas");
    if (activeLayout?.canvas !== canvasElement) {
      if (activeLayout) {
        releaseLayout(activeLayout, registration);
      }
      activeLayout = null;
      if (!canvasElement) {
        return;
      }
      activeLayout = layoutStateByCanvas.get(canvasElement);
      if (!activeLayout) {
        const canvasView = canvasElement.ownerDocument.defaultView;
        activeLayout = {
          canvas: canvasElement,
          view: canvasView,
          clients: new Set(),
          owners: new Set(),
          members: new Map(),
          targets: new Set(),
          frame: null,
          amount: 0,
          to: 0,
          distance: BASE_DISTANCE_PX
        };
        const capturedLayout = activeLayout;
        activeLayout.guard = event => {
          for (const [blockedElement, blockingMemberState] of capturedLayout.members) {
            if (blockingMemberState.hidden && blockedElement.contains(event.target)) {
              event.preventDefault();
              event.stopImmediatePropagation();
              if (event.type === "focusin") {
                event.target.blur();
              }
              return;
            }
          }
        };
        for (const eventType of GUARD_EVENT_TYPES) {
          canvasElement.addEventListener(eventType, activeLayout.guard, true);
        }
        activeLayout.observer = new canvasView.MutationObserver(mutationRecords => {
          if (mutationRecords.some(mutationRecord => mutationRecord.target === canvasElement)) {
            updateLayout(capturedLayout);
          }
          for (const [hiddenElement, hiddenMemberState] of capturedLayout.members) {
            if (hiddenMemberState.hidden) {
              suspendTabStops(hiddenElement, hiddenMemberState);
            }
          }
        });
        activeLayout.observer.observe(canvasElement, {
          childList: true,
          subtree: true
        });
        layoutStateByCanvas.set(canvasElement, activeLayout);
      }
      activeLayout.clients.add(registration);
    }
    if (activeLayout) {
      if (isActive) {
        activeLayout.owners.add(registration);
      } else {
        activeLayout.owners.delete(registration);
      }
      updateLayout(activeLayout);
      animateAmount(activeLayout, activeLayout.owners.size ? 1 : 0);
    }
  };
  return {
    refresh: refreshLayout,
    setActive(shouldActivate) {
      if (!isDisposed && !context.editable) {
        isActive = shouldActivate === true;
        refreshLayout();
      }
    },
    dispose() {
      if (!isDisposed) {
        isDisposed = true;
        if (activeLayout) {
          releaseLayout(activeLayout, registration);
        }
        activeLayout = null;
      }
    }
  };
}
