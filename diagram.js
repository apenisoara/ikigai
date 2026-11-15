/**
 * Interactive Ikigai diagram — 3D tilt parallax + idle bell shakes + bee swarm.
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

  /**
   * Click bee-swarm (~4s): wander → Reynolds “arrive” home with turbulence.
   * Kinematics (pos/vel) are fully reset every trigger so re-clicks stay clean.
   * Noise uses swarm-local time (not wall-clock) — avoids phase bleed across runs.
   * Tuned from seek/arrive + dual turbulence practice (≈3 Hz + ≈7 Hz wiggle).
   * Skipped entirely when prefers-reduced-motion is set.
   */
  const SWARM_MS = 4000;
  /** Burst outward at the start of free flight. */
  const SWARM_SCATTER_END = 0.12;
  /** Switch from wander to arrive-home (≈2s + ≈2s). */
  const SWARM_ARRIVE_START = 0.48;
  /** Soft clamp so bees stay inside the diagram region (viewBox units). */
  const SWARM_AMP = 14;
  const SWARM_RZ_DEG = 7;
  /** ViewBox units / second — lively but readable on the diagram. */
  const SWARM_MAX_SPEED = 30;
  /** ViewBox units / second² — turny enough to look insect-like, not ballistic. */
  const SWARM_MAX_FORCE = 95;
  /** Arrival braking radius (Reynolds): speed scales down inside this distance. */
  const SWARM_ARRIVE_RADIUS = 13;
  /** Dual turbulence layers (Hz) — irregular bee flight without vibration. */
  const SWARM_NOISE1_HZ = 3.1;
  const SWARM_NOISE2_HZ = 7.2;
  const SWARM_NOISE1_FORCE = 22;
  const SWARM_NOISE2_FORCE = 10;

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
    tScale: 1,
    swarmRz: 0
  }));

  let pointerInside = false;
  let lastPointer = null;
  let activeKey = null;
  let focusedEl = null;
  let rafId = 0;
  let shakeTimer = 0;
  let shakingKey = null;
  let lastShakeKey = null;
  let shakeStartedAt = 0;
  let swarming = false;
  let swarmStartedAt = 0;
  let swarmLastTickAt = 0;
  /**
   * Per-bee kinematics for the active swarm only. Recreated in startSwarm();
   * never shared with tilt/shake state.
   * @type {null | Array<{vx:number,vy:number,wanderAngle:number,scatterDir:number,phase1:number,phase2:number,phaseR:number,freq1:number,freq2:number,freqR:number,noiseAmp1:number,noiseAmp2:number}>}
   */
  let swarmBees = null;
  let centerTarget = { x: 0, y: 0 };
  let centerCurrent = { x: 0, y: 0 };

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

  function easeOutCubic(t) {
    const p = clamp(t, 0, 1);
    return 1 - Math.pow(1 - p, 3);
  }

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  /** True when a viewBox point sits in the four-circle cluster (generous padding). */
  function inCirclesRegion(px, py) {
    if (hitTest(px, py)) return true;
    // Soft envelope around the overlapping cluster so edge clicks still count.
    const dist = Math.hypot(px - 50, py - 50);
    return dist <= 46;
  }

  function truncate(x, y, max) {
    const mag = Math.hypot(x, y);
    if (mag <= max || mag < 1e-6) return { x, y };
    const s = max / mag;
    return { x: x * s, y: y * s };
  }

  /** Fresh per-bee kinematics — called on every trigger (fixes re-click phase bleed). */
  function buildSwarmBees() {
    return state.map((item) => {
      const outward = Math.atan2(item.cy - 50, item.cx - 50) + randRange(-0.85, 0.85);
      return {
        vx: Math.cos(outward) * randRange(6, 14),
        vy: Math.sin(outward) * randRange(6, 14),
        wanderAngle: outward + randRange(-Math.PI, Math.PI),
        scatterDir: outward,
        phase1: randRange(0, Math.PI * 2),
        phase2: randRange(0, Math.PI * 2),
        phaseR: randRange(0, Math.PI * 2),
        freq1: SWARM_NOISE1_HZ * randRange(0.85, 1.2),
        freq2: SWARM_NOISE2_HZ * randRange(0.85, 1.25),
        freqR: 4.2 * randRange(0.8, 1.25),
        noiseAmp1: SWARM_NOISE1_FORCE * randRange(0.85, 1.15),
        noiseAmp2: SWARM_NOISE2_FORCE * randRange(0.85, 1.15)
      };
    });
  }

  function resetSwarmVisualPose() {
    for (const item of state) {
      item.x = 0;
      item.y = 0;
      item.z = 0;
      item.rx = 0;
      item.ry = 0;
      item.scale = 1;
      item.swarmRz = 0;
    }
    centerCurrent.x = 0;
    centerCurrent.y = 0;
  }

  /**
   * Integrate one swarm frame. Uses swarm-local seconds for noise so the 2nd
   * click in a session does not inherit wall-clock phase from the first run.
   */
  function stepSwarm(now) {
    if (!swarmBees) return;
    const elapsedMs = now - swarmStartedAt;
    const progress = elapsedMs / SWARM_MS;
    let dt = (now - swarmLastTickAt) / 1000;
    swarmLastTickAt = now;
    // Clamp dt so a tab-throttle hitch cannot explode velocities.
    dt = clamp(dt, 1 / 240, 1 / 20);
    const tSec = elapsedMs / 1000;

    state.forEach((item, index) => {
      const bee = swarmBees[index];
      let forceX = 0;
      let forceY = 0;

      // Dual turbulence (independent layers ≈3 Hz + ≈7 Hz).
      const n1x = Math.sin(Math.PI * 2 * bee.freq1 * tSec + bee.phase1);
      const n1y = Math.cos(Math.PI * 2 * bee.freq1 * tSec + bee.phase1 * 1.37);
      const n2x = Math.sin(Math.PI * 2 * bee.freq2 * tSec + bee.phase2);
      const n2y = Math.cos(Math.PI * 2 * bee.freq2 * tSec + bee.phase2 * 0.71);

      if (progress < SWARM_ARRIVE_START) {
        // --- Free flight: scatter burst + wander ---
        const scatterT = Math.min(1, progress / SWARM_SCATTER_END);
        const burst = (1 - easeOutCubic(scatterT)) * 70;
        forceX += Math.cos(bee.scatterDir) * burst;
        forceY += Math.sin(bee.scatterDir) * burst;

        // Reynolds-style wander: slowly yaw the steering heading.
        bee.wanderAngle +=
          Math.sin(Math.PI * 2 * 0.55 * tSec + bee.phase2) * 4.5 * dt +
          randRange(-1.8, 1.8) * dt;
        const wanderForce = 58;
        forceX += Math.cos(bee.wanderAngle) * wanderForce;
        forceY += Math.sin(bee.wanderAngle) * wanderForce;

        forceX += n1x * bee.noiseAmp1 + n2x * bee.noiseAmp2;
        forceY += n1y * bee.noiseAmp1 + n2y * bee.noiseAmp2;
      } else {
        // --- Arrive home (0,0): seek with braking radius + fading turbulence ---
        const settleT =
          (progress - SWARM_ARRIVE_START) / (1 - SWARM_ARRIVE_START);
        const px = item.x;
        const py = item.y;
        const dist = Math.hypot(px, py);

        if (dist > 0.02) {
          // desiredSpeed shrinks inside arrive radius (classic Reynolds arrive).
          const desiredSpeed =
            SWARM_MAX_SPEED * Math.min(1, dist / SWARM_ARRIVE_RADIUS);
          const desiredVx = (-px / dist) * desiredSpeed;
          const desiredVy = (-py / dist) * desiredSpeed;
          forceX += (desiredVx - bee.vx) * 5.5;
          forceY += (desiredVy - bee.vy) * 5.5;
        } else {
          bee.vx *= 0.6;
          bee.vy *= 0.6;
        }

        // Turbulence stays alive while far, fades as they land (still bee-like).
        const turb =
          Math.min(1, dist / SWARM_ARRIVE_RADIUS) * Math.pow(1 - settleT, 0.55);
        forceX += (n1x * bee.noiseAmp1 + n2x * bee.noiseAmp2) * turb;
        forceY += (n1y * bee.noiseAmp1 + n2y * bee.noiseAmp2) * turb;

        // Late soft spring so they always finish at rest without a hard snap.
        if (settleT > 0.65) {
          const k = (settleT - 0.65) / 0.35;
          forceX += -px * (12 * k);
          forceY += -py * (12 * k);
          bee.vx *= 1 - 0.15 * k;
          bee.vy *= 1 - 0.15 * k;
        }
      }

      const steered = truncate(forceX, forceY, SWARM_MAX_FORCE);
      bee.vx += steered.x * dt;
      bee.vy += steered.y * dt;

      const maxSpeed =
        progress < SWARM_ARRIVE_START ? SWARM_MAX_SPEED : SWARM_MAX_SPEED * 0.92;
      const capped = truncate(bee.vx, bee.vy, maxSpeed);
      bee.vx = capped.x;
      bee.vy = capped.y;

      item.x = clamp(item.x + bee.vx * dt, -SWARM_AMP * 1.3, SWARM_AMP * 1.3);
      item.y = clamp(item.y + bee.vy * dt, -SWARM_AMP * 1.3, SWARM_AMP * 1.3);

      const rzFade =
        progress < SWARM_ARRIVE_START
          ? 1
          : Math.max(
              0,
              1 - (progress - SWARM_ARRIVE_START) / (1 - SWARM_ARRIVE_START)
            );
      item.swarmRz =
        Math.sin(Math.PI * 2 * bee.freqR * tSec + bee.phaseR) *
        SWARM_RZ_DEG *
        (0.45 + 0.55 * rzFade);

      item.z += (0 - item.z) * EASE;
      item.rx += (0 - item.rx) * EASE;
      item.ry += (0 - item.ry) * EASE;
      item.scale += (1 - item.scale) * EASE;
    });

    centerCurrent.x += (0 - centerCurrent.x) * EASE;
    centerCurrent.y += (0 - centerCurrent.y) * EASE;
  }

  function startSwarm() {
    // Respect prefers-reduced-motion: skip flight (CSS also freezes transforms).
    if (reduceMotion.matches) return false;

    pauseIdleShakes();
    // Full kinematic + visual reset every trigger (no cross-run / cross-phase reuse).
    swarmBees = buildSwarmBees();
    // centerCurrent exists later in the file via let — ensure startSwarm runs after init only.
    resetSwarmVisualPose();
    swarming = true;
    swarmStartedAt = performance.now();
    swarmLastTickAt = swarmStartedAt;
    diagram.classList.add("is-swarming");
    setInteracting(true);
    resetTargets();
    centerTarget.x = 0;
    centerTarget.y = 0;
    scheduleTick();
    return true;
  }

  function endSwarm() {
    swarming = false;
    swarmBees = null;
    swarmLastTickAt = 0;
    diagram.classList.remove("is-swarming");
    for (const item of state) {
      item.x = 0;
      item.y = 0;
      item.swarmRz = 0;
      item.tx = 0;
      item.ty = 0;
      item.tz = 0;
      item.tRx = 0;
      item.tRy = 0;
      item.tScale = 1;
      item.el.classList.remove("is-swarming");
      const label = labelByKey[item.key];
      if (label) label.classList.remove("is-swarming");
    }
    setInteracting(Boolean(activeKey) || pointerInside || Boolean(focusedEl));
    if (pointerInside && lastPointer && !reduceMotion.matches) {
      updateFromPointer(lastPointer.x, lastPointer.y);
    } else if (idleAllowed()) {
      scheduleIdleShake(randomGap());
    }
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
      const isShaking = !swarming && item.key === shakingKey;
      const sx = isShaking ? shake.x : 0;
      const sy = isShaking ? shake.y : 0;
      const srz = isShaking ? shake.rz : item.swarmRz;

      item.el.style.setProperty("--parallax-x", `${(item.x * unit.x + sx).toFixed(2)}px`);
      item.el.style.setProperty("--parallax-y", `${(item.y * unit.y + sy).toFixed(2)}px`);
      item.el.style.setProperty("--parallax-z", `${item.z.toFixed(2)}px`);
      item.el.style.setProperty("--parallax-rx", `${item.rx.toFixed(2)}deg`);
      item.el.style.setProperty("--parallax-ry", `${item.ry.toFixed(2)}deg`);
      item.el.style.setProperty("--parallax-rz", `${srz.toFixed(2)}deg`);
      item.el.style.setProperty("--parallax-scale", item.scale.toFixed(4));
      item.el.classList.toggle("is-shaking", isShaking);
      item.el.classList.toggle("is-swarming", swarming);

      const label = labelByKey[item.key];
      if (label) {
        label.style.setProperty("--parallax-x", `${(item.x + sx * 0.15).toFixed(3)}%`);
        label.style.setProperty("--parallax-y", `${(item.y + sy * 0.15).toFixed(3)}%`);
        label.style.setProperty("--parallax-z", `${(item.z * 0.35).toFixed(2)}px`);
        label.style.setProperty("--parallax-rx", `${item.rx.toFixed(2)}deg`);
        label.style.setProperty("--parallax-ry", `${item.ry.toFixed(2)}deg`);
        label.style.setProperty("--parallax-rz", `${(srz * 0.5).toFixed(2)}deg`);
        label.classList.toggle("is-shaking", isShaking);
        label.classList.toggle("is-swarming", swarming);
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
        item.swarmRz = 0;
      }
      centerCurrent.x = 0;
      centerCurrent.y = 0;
      shakingKey = null;
      applyTransforms(now);
      diagram.classList.remove("is-parallaxing");
      return;
    }

    let moving = false;

    if (swarming && swarmBees) {
      const progress = (now - swarmStartedAt) / SWARM_MS;
      if (progress >= 1) {
        resetSwarmVisualPose();
        applyTransforms(now);
        endSwarm();
        // Continue one more frame if pointer/idle needs the loop.
        if (pointerInside || shakingKey) {
          rafId = requestAnimationFrame(tick);
        } else {
          diagram.classList.toggle("is-parallaxing", false);
        }
        return;
      }

      stepSwarm(now);
      moving = true;
    } else {
      for (const item of state) {
        item.swarmRz = 0;
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
    }

    applyTransforms(now);
    diagram.classList.toggle("is-parallaxing", pointerInside || moving || swarming);

    if (moving || pointerInside || shakingKey || swarming) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function scheduleTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function idleAllowed() {
    return (
      !reduceMotion.matches &&
      !swarming &&
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
    lastPointer = { x: clientX, y: clientY };
    const svgPoint = clientToSvg(clientX, clientY);
    const hit = hitTest(svgPoint.x, svgPoint.y);

    if (focusedEl) {
      setActiveByKey(focusedEl.getAttribute("data-circle"));
    } else {
      setActiveByKey(hit ? hit.key : null);
    }

    if (reduceMotion.matches || swarming) return;

    const center = computeTargets(svgPoint.x, svgPoint.y);
    centerTarget.x = center.centerX;
    centerTarget.y = center.centerY;
    scheduleTick();
  }

  diagram.addEventListener("pointerenter", (event) => {
    pointerInside = true;
    lastPointer = { x: event.clientX, y: event.clientY };
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
    lastPointer = null;
    if (!swarming) {
      const center = resetTargets();
      centerTarget.x = center.centerX;
      centerTarget.y = center.centerY;
    }
    if (!focusedEl) setActiveByKey(null);
    scheduleTick();
    if (!swarming) scheduleIdleShake(randomGap());
  });

  // Click in the circles region → brief bee-swarm, then settle home.
  diagram.addEventListener("click", (event) => {
    const svgPoint = clientToSvg(event.clientX, event.clientY);
    if (!inCirclesRegion(svgPoint.x, svgPoint.y)) return;
    startSwarm();
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
      if (swarming) {
        swarming = false;
        swarmBees = null;
        swarmLastTickAt = 0;
        diagram.classList.remove("is-swarming");
      }
      resetTargets();
      for (const item of state) {
        item.x = 0;
        item.y = 0;
        item.z = 0;
        item.rx = 0;
        item.ry = 0;
        item.scale = 1;
        item.swarmRz = 0;
        item.el.classList.remove("is-swarming");
        const label = labelByKey[item.key];
        if (label) label.classList.remove("is-swarming");
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
  diagram.dataset.diagramMotion = "3d-tilt-bell-shake-bee-swarm";
  diagram._ikigaiDiagramTest = {
    triggerShake(key) {
      if (reduceMotion.matches || swarming) return false;
      pauseIdleShakes();
      shakingKey = key || pickShakeTarget();
      lastShakeKey = shakingKey;
      shakeStartedAt = performance.now();
      scheduleTick();
      scheduleIdleShake(SHAKE_MS + randomGap());
      return Boolean(shakingKey);
    },
    triggerSwarm() {
      return startSwarm();
    },
    isSwarming: () => swarming,
    getSwarmSample: () =>
      state.map((item) => ({
        key: item.key,
        x: item.x,
        y: item.y,
        rz: item.swarmRz
      })),
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
