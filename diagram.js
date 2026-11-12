/**
 * Interactive Ikigai diagram — hover/focus + cursor parallax.
 * Does not touch Explore form, API, or rate-limit behavior.
 */
(function initIkigaiDiagram() {
  const diagram = document.querySelector(".ikigai-diagram");
  if (!diagram) return;

  const svg = diagram.querySelector(".ikigai-diagram-svg");
  const circles = Array.from(diagram.querySelectorAll(".diagram-circle"));
  if (!svg || !circles.length) return;

  const labelByKey = {
    love: diagram.querySelector(".label-love"),
    good: diagram.querySelector(".label-good"),
    world: diagram.querySelector(".label-world"),
    paid: diagram.querySelector(".label-paid")
  };
  const centerLabel = diagram.querySelector(".diagram-center");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Max push in SVG viewBox units (viewBox is 0..100). */
  const MAX_PUSH = 5.8;
  /** Distance (viewBox units) where repulsion falls to zero. */
  const INFLUENCE_RADIUS = 48;
  /** Lerp factor per frame toward target offsets. */
  const EASE = 0.18;
  /** Rest-position radius used for hit-testing (matches SVG r). */
  const HIT_RADIUS = 29;

  const state = circles.map((el) => ({
    el,
    key: el.getAttribute("data-circle"),
    cx: Number(el.getAttribute("cx")) || 50,
    cy: Number(el.getAttribute("cy")) || 50,
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    scale: 1,
    tScale: 1
  }));

  let pointerInside = false;
  let activeKey = null;
  let focusedEl = null;
  let rafId = 0;

  function setInteracting(active) {
    diagram.classList.toggle("is-interacting", Boolean(active));
  }

  function setActiveByKey(key) {
    activeKey = key;
    for (const item of state) {
      item.el.classList.toggle("is-active", item.key === key);
    }
    setInteracting(Boolean(key) || pointerInside || Boolean(focusedEl));
  }

  function clientToSvg(clientX, clientY) {
    const ctm = svg.getScreenCTM();
    if (!ctm) {
      const box = svg.getBoundingClientRect();
      return {
        x: ((clientX - box.left) / box.width) * 100,
        y: ((clientY - box.top) / box.height) * 100
      };
    }
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const local = point.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }

  /** Prefer the nearest rest-center under the cursor (exclusive crescents win). */
  function hitTest(px, py) {
    let best = null;
    let bestDist = Infinity;
    for (const item of state) {
      const dist = Math.hypot(item.cx - px, item.cy - py);
      if (dist <= HIT_RADIUS && dist < bestDist) {
        best = item;
        bestDist = dist;
      }
    }
    return best;
  }

  function computeTargets(px, py) {
    let avgX = 0;
    let avgY = 0;

    for (const item of state) {
      const dx = item.cx - px;
      const dy = item.cy - py;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const t = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
      const influence = t * t * (3 - 2 * t);
      const push = MAX_PUSH * influence;
      item.tx = (dx / dist) * push;
      item.ty = (dy / dist) * push;
      item.tScale = 1 + influence * 0.04 - (1 - influence) * 0.008;
      avgX += item.tx;
      avgY += item.ty;
    }

    return {
      centerX: -(avgX / state.length) * 0.35,
      centerY: -(avgY / state.length) * 0.35
    };
  }

  function resetTargets() {
    for (const item of state) {
      item.tx = 0;
      item.ty = 0;
      item.tScale = 1;
    }
    return { centerX: 0, centerY: 0 };
  }

  let centerTarget = { x: 0, y: 0 };
  let centerCurrent = { x: 0, y: 0 };

  function viewBoxToPixels() {
    const box = svg.getBoundingClientRect();
    return {
      x: box.width / 100,
      y: box.height / 100
    };
  }

  function applyTransforms() {
    const unit = viewBoxToPixels();
    for (const item of state) {
      item.el.style.setProperty("--parallax-x", `${(item.x * unit.x).toFixed(2)}px`);
      item.el.style.setProperty("--parallax-y", `${(item.y * unit.y).toFixed(2)}px`);
      item.el.style.setProperty("--parallax-scale", item.scale.toFixed(4));

      const label = labelByKey[item.key];
      if (label) {
        label.style.setProperty("--parallax-x", `${item.x.toFixed(3)}%`);
        label.style.setProperty("--parallax-y", `${item.y.toFixed(3)}%`);
      }
    }

    if (centerLabel) {
      centerLabel.style.setProperty("--parallax-x", `${centerCurrent.x.toFixed(3)}%`);
      centerLabel.style.setProperty("--parallax-y", `${centerCurrent.y.toFixed(3)}%`);
    }
  }

  function tick() {
    rafId = 0;
    if (reduceMotion.matches) {
      for (const item of state) {
        item.x = 0;
        item.y = 0;
        item.scale = 1;
      }
      centerCurrent.x = 0;
      centerCurrent.y = 0;
      applyTransforms();
      diagram.classList.remove("is-parallaxing");
      return;
    }

    let moving = false;
    for (const item of state) {
      item.x += (item.tx - item.x) * EASE;
      item.y += (item.ty - item.y) * EASE;
      item.scale += (item.tScale - item.scale) * EASE;
      if (
        Math.abs(item.tx - item.x) > 0.02 ||
        Math.abs(item.ty - item.y) > 0.02 ||
        Math.abs(item.tScale - item.scale) > 0.002
      ) {
        moving = true;
      }
    }

    centerCurrent.x += (centerTarget.x - centerCurrent.x) * EASE;
    centerCurrent.y += (centerTarget.y - centerCurrent.y) * EASE;
    if (
      Math.abs(centerTarget.x - centerCurrent.x) > 0.02 ||
      Math.abs(centerTarget.y - centerCurrent.y) > 0.02
    ) {
      moving = true;
    }

    applyTransforms();
    diagram.classList.toggle("is-parallaxing", pointerInside || moving);

    if (moving || pointerInside) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function scheduleTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function updateFromPointer(clientX, clientY) {
    const svgPoint = clientToSvg(clientX, clientY);
    const hit = hitTest(svgPoint.x, svgPoint.y);

    if (focusedEl) {
      // Keyboard focus wins while an element is focused.
      setActiveByKey(focusedEl.getAttribute("data-circle"));
    } else {
      setActiveByKey(hit ? hit.key : null);
    }

    if (reduceMotion.matches) return;

    const center = computeTargets(svgPoint.x, svgPoint.y);
    centerTarget.x = center.centerX;
    centerTarget.y = center.centerY;
    scheduleTick();
  }

  diagram.addEventListener("pointerenter", (event) => {
    pointerInside = true;
    diagram.classList.add("is-parallaxing");
    updateFromPointer(event.clientX, event.clientY);
  });

  diagram.addEventListener("pointermove", (event) => {
    pointerInside = true;
    updateFromPointer(event.clientX, event.clientY);
  });

  diagram.addEventListener("pointerleave", () => {
    pointerInside = false;
    const center = resetTargets();
    centerTarget.x = center.centerX;
    centerTarget.y = center.centerY;
    if (!focusedEl) setActiveByKey(null);
    scheduleTick();
  });

  circles.forEach((circle) => {
    circle.addEventListener("focus", () => {
      focusedEl = circle;
      setActiveByKey(circle.getAttribute("data-circle"));
    });
    circle.addEventListener("blur", () => {
      if (focusedEl === circle) focusedEl = null;
      if (!pointerInside) setActiveByKey(null);
    });
    circle.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      focusedEl = circle;
      setActiveByKey(circle.getAttribute("data-circle"));
    });
  });

  function clearParallaxStyles() {
    for (const item of state) {
      item.el.style.removeProperty("--parallax-x");
      item.el.style.removeProperty("--parallax-y");
      item.el.style.removeProperty("--parallax-scale");
      const label = labelByKey[item.key];
      if (label) {
        label.style.removeProperty("--parallax-x");
        label.style.removeProperty("--parallax-y");
      }
    }
    if (centerLabel) {
      centerLabel.style.removeProperty("--parallax-x");
      centerLabel.style.removeProperty("--parallax-y");
    }
    diagram.classList.remove("is-parallaxing");
  }

  function syncMotionPreference() {
    diagram.classList.toggle("reduce-motion", reduceMotion.matches);
    if (reduceMotion.matches) {
      pointerInside = false;
      resetTargets();
      for (const item of state) {
        item.x = 0;
        item.y = 0;
        item.scale = 1;
      }
      centerCurrent.x = 0;
      centerCurrent.y = 0;
      clearParallaxStyles();
      if (!focusedEl) setActiveByKey(null);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }
  }

  syncMotionPreference();
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", syncMotionPreference);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(syncMotionPreference);
  }
})();
