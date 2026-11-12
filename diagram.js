/**
 * Interactive Ikigai diagram — 3D tilt parallax + idle bell shakes.
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

  /** Max planar parting in viewBox units (kept modest — tilt carries the 3D feel). */
  const MAX_PUSH = 2.4;
  /** Max tilt toward / away from the cursor (deg). Tasteful card-tilt range. */
  const MAX_TILT = 14;
  /** Max depth sink when the cursor is near (px). */
  const MAX_Z = 28;
  /** Distance (viewBox units) where influence falls to zero. */
  const INFLUENCE_RADIUS = 48;
  /** Lerp factor per frame toward targets. */
  const EASE = 0.2;
  /** Rest-position radius used for hit-testing (matches SVG r). */
  const HIT_RADIUS = 29;

  /** Idle “bell” shake: one circle, ~500ms, ~3s between (with light jitter). */
  const SHAKE_MS = 500;
  const SHAKE_GAP_MIN_MS = 2600;
  const SHAKE_GAP_MAX_MS = 3600;
  const SHAKE_START_DELAY_MS = 2200;

  const state = circles.map((el) => ({
    el,
    key: el.getAttribute("data-circle"),
    cx: Number(el.getAttribute("cx")) || 50,
    cy: Number(el.getAttribute("cy")) || 50,
    x: 0,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    scale: 1,
    tx: 0,
    ty: 0,
    tz: 0,
    tRx: 0,
    tRy: 0,
    tScale: 1
  }));

  let pointerInside = false;
  let activeKey = null;
  let focusedEl = null;
  let rafId = 0;
  let shakeTimer = 0;
  let shakingKey = null;
  let lastShakeKey = null;
  let shakeStartedAt = 0;

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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /**
   * Cursor-driven 3D response: circles incline as if the pointer passes through
   * them in depth — near edge sinks back, face tilts toward the path, slight part.
   */
  function computeTargets(px, py) {
    let avgX = 0;
    let avgY = 0;

    for (const item of state) {
      const dx = item.cx - px; // center ← cursor (push-away axis)
      const dy = item.cy - py;
      const ox = px - item.cx; // cursor relative to center (tilt axis)
      const oy = py - item.cy;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const t = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
      // Smoothstep falloff — stronger when the pointer is on the disc.
      const influence = t * t * (3 - 2 * t);

      item.tx = (dx / dist) * MAX_PUSH * influence;
      item.ty = (dy / dist) * MAX_PUSH * influence;
      // Sink back in Z as the cursor moves through the circle.
      item.tz = -MAX_Z * influence;

      // Incline: edge nearest the cursor tips away (making space in depth).
      const tilt = influence * MAX_TILT;
      item.tRy = clamp((-ox / HIT_RADIUS) * tilt, -MAX_TILT, MAX_TILT);
      item.tRx = clamp((oy / HIT_RADIUS) * tilt, -MAX_TILT, MAX_TILT);

      // Slight scale: nearer (more influence) reads a touch smaller (farther in Z).
      item.tScale = 1 - influence * 0.035;

      avgX += item.tx;
      avgY += item.ty;
    }

    return {
      centerX: -(avgX / state.length) * 0.25,
      centerY: -(avgY / state.length) * 0.25
    };
  }

  function resetTargets() {
    for (const item of state) {
      item.tx = 0;
      item.ty = 0;
      item.tz = 0;
      item.tRx = 0;
      item.tRy = 0;
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

  function shakeSample(now) {
    if (!shakingKey) return { x: 0, y: 0, rz: 0 };
    const elapsed = now - shakeStartedAt;
    if (elapsed >= SHAKE_MS) return { x: 0, y: 0, rz: 0 };
    const p = elapsed / SHAKE_MS;
    // Decaying oscillation — struck-bell envelope (ease-out amplitude).
    const envelope = Math.pow(1 - p, 2);
    const waves = Math.sin(p * Math.PI * 6);
    return {
      x: waves * envelope * 0.55,
      y: -Math.cos(p * Math.PI * 5) * envelope * 0.35,
      rz: waves * envelope * 1.6
    };
  }

  function applyTransforms(now = performance.now()) {
    const unit = viewBoxToPixels();
    const shake = shakeSample(now);

    for (const item of state) {
      const isShaking = item.key === shakingKey;
      const sx = isShaking ? shake.x : 0;
      const sy = isShaking ? shake.y : 0;
      const srz = isShaking ? shake.rz : 0;

      item.el.style.setProperty("--parallax-x", `${(item.x * unit.x + sx).toFixed(2)}px`);
      item.el.style.setProperty("--parallax-y", `${(item.y * unit.y + sy).toFixed(2)}px`);
      item.el.style.setProperty("--parallax-z", `${item.z.toFixed(2)}px`);
      item.el.style.setProperty("--parallax-rx", `${item.rx.toFixed(2)}deg`);
      item.el.style.setProperty("--parallax-ry", `${item.ry.toFixed(2)}deg`);
      item.el.style.setProperty("--parallax-rz", `${srz.toFixed(2)}deg`);
      item.el.style.setProperty("--parallax-scale", item.scale.toFixed(4));
      item.el.classList.toggle("is-shaking", isShaking);

      const label = labelByKey[item.key];
      if (label) {
        label.style.setProperty("--parallax-x", `${(item.x + sx * 0.15).toFixed(3)}%`);
        label.style.setProperty("--parallax-y", `${(item.y + sy * 0.15).toFixed(3)}%`);
        label.style.setProperty("--parallax-z", `${(item.z * 0.35).toFixed(2)}px`);
        label.style.setProperty("--parallax-rx", `${item.rx.toFixed(2)}deg`);
        label.style.setProperty("--parallax-ry", `${item.ry.toFixed(2)}deg`);
        label.style.setProperty("--parallax-rz", `${(srz * 0.5).toFixed(2)}deg`);
        label.classList.toggle("is-shaking", isShaking);
      }
    }

    if (centerLabel) {
      centerLabel.style.setProperty("--parallax-x", `${centerCurrent.x.toFixed(3)}%`);
      centerLabel.style.setProperty("--parallax-y", `${centerCurrent.y.toFixed(3)}%`);
    }
  }

  function tick(now) {
    rafId = 0;
    if (reduceMotion.matches) {
      for (const item of state) {
        item.x = 0;
        item.y = 0;
        item.z = 0;
        item.rx = 0;
        item.ry = 0;
        item.scale = 1;
      }
      centerCurrent.x = 0;
      centerCurrent.y = 0;
      shakingKey = null;
      applyTransforms(now);
      diagram.classList.remove("is-parallaxing");
      return;
    }

    let moving = false;
    for (const item of state) {
      item.x += (item.tx - item.x) * EASE;
      item.y += (item.ty - item.y) * EASE;
      item.z += (item.tz - item.z) * EASE;
      item.rx += (item.tRx - item.rx) * EASE;
      item.ry += (item.tRy - item.ry) * EASE;
      item.scale += (item.tScale - item.scale) * EASE;
      if (
        Math.abs(item.tx - item.x) > 0.02 ||
        Math.abs(item.ty - item.y) > 0.02 ||
        Math.abs(item.tz - item.z) > 0.2 ||
        Math.abs(item.tRx - item.rx) > 0.05 ||
        Math.abs(item.tRy - item.ry) > 0.05 ||
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

    if (shakingKey && now - shakeStartedAt < SHAKE_MS) {
      moving = true;
    } else if (shakingKey && now - shakeStartedAt >= SHAKE_MS) {
      shakingKey = null;
      for (const item of state) {
        item.el.classList.remove("is-shaking");
        const label = labelByKey[item.key];
        if (label) label.classList.remove("is-shaking");
      }
    }

    applyTransforms(now);
    diagram.classList.toggle("is-parallaxing", pointerInside || moving);

    if (moving || pointerInside || shakingKey) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function scheduleTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function idleAllowed() {
    return (
      !reduceMotion.matches &&
      !pointerInside &&
      !focusedEl &&
      !document.hidden &&
      !diagram.classList.contains("is-interacting")
    );
  }

  function clearShakeTimer() {
    if (shakeTimer) {
      clearTimeout(shakeTimer);
      shakeTimer = 0;
    }
  }

  function randomGap() {
    return SHAKE_GAP_MIN_MS + Math.random() * (SHAKE_GAP_MAX_MS - SHAKE_GAP_MIN_MS);
  }

  function pickShakeTarget() {
    const keys = state.map((item) => item.key);
    if (keys.length <= 1) return keys[0] || null;
    let next = keys[Math.floor(Math.random() * keys.length)];
    // Avoid striking the same circle twice in a row (less mechanical).
    if (next === lastShakeKey) {
      next = keys[(keys.indexOf(next) + 1 + Math.floor(Math.random() * (keys.length - 1))) % keys.length];
    }
    return next;
  }

  function scheduleIdleShake(delay = randomGap()) {
    clearShakeTimer();
    if (reduceMotion.matches) return;
    shakeTimer = window.setTimeout(() => {
      shakeTimer = 0;
      if (!idleAllowed()) {
        scheduleIdleShake(randomGap());
        return;
      }
      const key = pickShakeTarget();
      if (!key) {
        scheduleIdleShake(randomGap());
        return;
      }
      lastShakeKey = key;
      shakingKey = key;
      shakeStartedAt = performance.now();
      scheduleTick();
      // Queue the next strike after this shake finishes + gap.
      scheduleIdleShake(SHAKE_MS + randomGap());
    }, delay);
  }

  function pauseIdleShakes() {
    clearShakeTimer();
    shakingKey = null;
    for (const item of state) {
      item.el.classList.remove("is-shaking");
      const label = labelByKey[item.key];
      if (label) label.classList.remove("is-shaking");
    }
  }

  function updateFromPointer(clientX, clientY) {
    const svgPoint = clientToSvg(clientX, clientY);
    const hit = hitTest(svgPoint.x, svgPoint.y);

    if (focusedEl) {
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
    pauseIdleShakes();
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
    scheduleIdleShake(randomGap());
  });

  circles.forEach((circle) => {
    circle.addEventListener("focus", () => {
      focusedEl = circle;
      pauseIdleShakes();
      setActiveByKey(circle.getAttribute("data-circle"));
    });
    circle.addEventListener("blur", () => {
      if (focusedEl === circle) focusedEl = null;
      if (!pointerInside) {
        setActiveByKey(null);
        scheduleIdleShake(randomGap());
      }
    });
    circle.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      focusedEl = circle;
      pauseIdleShakes();
      setActiveByKey(circle.getAttribute("data-circle"));
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseIdleShakes();
    } else if (idleAllowed()) {
      scheduleIdleShake(SHAKE_START_DELAY_MS);
    }
  });

  function clearParallaxStyles() {
    for (const item of state) {
      [
        "--parallax-x",
        "--parallax-y",
        "--parallax-z",
        "--parallax-rx",
        "--parallax-ry",
        "--parallax-rz",
        "--parallax-scale"
      ].forEach((prop) => item.el.style.removeProperty(prop));
      item.el.classList.remove("is-shaking");
      const label = labelByKey[item.key];
      if (label) {
        [
          "--parallax-x",
          "--parallax-y",
          "--parallax-z",
          "--parallax-rx",
          "--parallax-ry",
          "--parallax-rz"
        ].forEach((prop) => label.style.removeProperty(prop));
        label.classList.remove("is-shaking");
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
      pauseIdleShakes();
      resetTargets();
      for (const item of state) {
        item.x = 0;
        item.y = 0;
        item.z = 0;
        item.rx = 0;
        item.ry = 0;
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
    } else if (idleAllowed()) {
      scheduleIdleShake(SHAKE_START_DELAY_MS);
    }
  }

  syncMotionPreference();
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", syncMotionPreference);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(syncMotionPreference);
  }

  // Expose a tiny test hook for Playwright (non-enumerable-ish on diagram dataset).
  diagram.dataset.diagramMotion = "3d-tilt-bell-shake";
  diagram._ikigaiDiagramTest = {
    triggerShake(key) {
      if (reduceMotion.matches) return false;
      pauseIdleShakes();
      shakingKey = key || pickShakeTarget();
      lastShakeKey = shakingKey;
      shakeStartedAt = performance.now();
      scheduleTick();
      scheduleIdleShake(SHAKE_MS + randomGap());
      return Boolean(shakingKey);
    },
    getShakeKey: () => shakingKey,
    getTiltSample: () =>
      state.map((item) => ({
        key: item.key,
        rx: item.rx,
        ry: item.ry,
        z: item.z
      }))
  };
})();
