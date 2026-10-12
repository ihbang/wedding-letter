/* Petal & Glow invitation: motion and interactions.
   Vanilla JS, no dependencies. Numbers come from _workspace/04_motion-designer_motion-spec.md.
   All user-facing text lives in index.html (<template id="ui-text"> and the markup). */
(() => {
  'use strict';

  const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
  const KAKAO_MAP_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';

  const HERO_SEQ = Object.freeze({ FONT_WAIT: 500, PHOTO: 300, BOKEH: 600, BOTTOM: 900, CUE: 1700 }); // ms, spec 2-1
  const SCROLL_CUE_HIDE_Y = 24;   // spec 4-9
  const COPY_LABEL_MS = 1600;     // spec 4-4
  const TOAST_HOLD_MS = 1800;     // spec 4-4
  const BGM_VOLUME = 0.6;         // spec 4-3
  const BGM_FADE_IN_MS = 1500;
  const BGM_FADE_OUT_MS = 400;
  const LB = Object.freeze({      // spec 4-2
    AXIS_LOCK: 8, SWIPE_DIST: 50, SWIPE_VELOCITY: 0.3, EDGE_RESIST: 0.3,
    CLOSE_DIST: 80, CLOSE_FADE_RANGE: 400, SCRIM_ALPHA: 0.96, SCRIM_MIN: 0.4,
    ZOOM_MAX: 3, DOUBLE_TAP_ZOOM: 2, DOUBLE_TAP_MS: 300, TAP_SLOP: 10,
    PINCH_MIN: 0.6, KEY_ZOOM_STEP: 1.5, VELOCITY_WINDOW: 100,
  });
  // Gallery carousel (spec 4-1). Swipe thresholds are shared with the lightbox via LB.
  const GAL = Object.freeze({ BEHIND: 1, AHEAD: 2, NEAR_MARGIN: '100% 0px', WHEEL_STEP: 40, WHEEL_LOCK: 450 });
  // Venue map (spec 4-7). Level 4 is about 2 m per CSS px, so a 340 x 255 map spans about 680 x 510 m:
  // the streets around the venue and Munjeong station (3 minutes on foot). SDK fetch starts one screen ahead.
  const MAP = Object.freeze({ LEVEL: 4, NEAR_MARGIN: '100% 0px', TIMEOUT: 10000 });

  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => reducedMotion.matches;

  /* ---------- Helpers ---------- */

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const later = (ms) => (isReduced() ? 0 : ms);

  // Reads a duration token from :root (already 0ms under reduced motion), so CSS and JS share one value.
  const token = (name) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;

  function onMediaChange(mql, fn) {
    if (mql.addEventListener) mql.addEventListener('change', fn);
    else mql.addListener(fn);
  }

  function safe(name, fn) {
    try {
      return fn();
    } catch (err) {
      console.error(`[invitation] ${name} failed`, err);
      return null;
    }
  }

  const uiText = document.getElementById('ui-text');
  function textNode(key) {
    return uiText ? uiText.content.querySelector(`[data-key="${key}"]`) : null;
  }
  const fillVars = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : ''));
  function text(key, vars = {}) {
    const node = textNode(key);
    return node ? fillVars(node.textContent, vars) : '';
  }
  // Same as text() but keeps <br> line breaks from the template.
  function richText(key, vars = {}) {
    const frag = document.createDocumentFragment();
    const node = textNode(key);
    if (!node) return frag;
    node.childNodes.forEach((child) => {
      const copy = child.cloneNode(true);
      if (copy.nodeType === Node.TEXT_NODE) copy.textContent = fillVars(copy.textContent, vars);
      frag.append(copy);
    });
    return frag;
  }

  const metaContent = (selector) => document.querySelector(selector)?.getAttribute('content') || '';
  const siteUrl = () => metaContent('meta[property="og:url"]');
  const kakaoKey = () => metaContent('meta[name="kakao-js-key"]');

  /* ---------- Live region + toast (spec 4-4) ---------- */

  const liveStatus = document.getElementById('live-status');
  const toastEl = document.querySelector('.toast');
  const toastText = toastEl ? toastEl.querySelector('.toast__text') : null;
  let announceTimer = 0;
  let toastTimer = 0;

  function announce(message) {
    if (!liveStatus) return;
    clearTimeout(announceTimer);
    liveStatus.textContent = '';
    announceTimer = setTimeout(() => { liveStatus.textContent = message; }, 50);
  }

  // done: true only for a successful copy; it shows the check icon in front of the toast text.
  function notify(message, done = false) {
    if (toastEl && toastText) {
      toastText.textContent = message;
      toastEl.classList.toggle('is-done', done);
      toastEl.classList.add('is-shown');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('is-shown'), token('--dur-fast') + TOAST_HOLD_MS);
    }
    announce(message);
  }

  /* ---------- Bokeh background (spec 1) ---------- */

  // Bokeh background for zones: hero, calendar, closing.
  const BOKEH = Object.freeze({
    ZONES: { hero: 8, calendar: 6, closing: 6 },        // living-particle slots per zone (<= 8)
    MAX_TOTAL_MOBILE: 12, MAX_TOTAL_WIDE: 16,            // wide = (min-width: 768px)
    D_MIN: 12, D_MAX: 56,
    SIZE_MIX: [[0.50, 12, 24], [0.35, 24, 40], [0.15, 40, 56]], // [share, min, max]
    CENTER_D_MAX: 28, EDGE_BIAS: 0.75, EDGE_BAND: 0.28,
    GLOW_RATIO: 0.7,
    RGB: { glow: '235,203,148', primary: '201,160,159' },
    ALPHA: { glow: [0.28, 0.18], primary: [0.18, 0.10] }, // [at D_MIN, at D_MAX]
    RISE: [3, 8], SWAY: [4, 12], SWAY_PERIOD: [8, 14],   // px/s, px, s
    BREATH: [5, 9], GAP: [0.6, 2.4],                     // s
    BOX_GAP: 6, EXCLUDE_MARGIN: 12, TRIES: 10, STILL_AFTER: 5, RETRY: 0.4,
    FPS: 30, DPR: 1, ZONE_FADE: 600, INTRO_FADE: 1200, INTRO_DELAY: 600,
  });

  // Reduced-motion replacement: five still dots in the hero margins (spec 1-6).
  // [band, x (width ratio), y (band height ratio), diameter px, color, alpha]
  const BOKEH_STATIC = Object.freeze([
    ['top', 0.12, 0.42, 44, 'glow', 0.24],
    ['top', 0.88, 0.62, 28, 'primary', 0.16],
    ['bottom', 0.10, 0.66, 36, 'primary', 0.15],
    ['bottom', 0.90, 0.30, 52, 'glow', 0.22],
    ['bottom', 0.80, 0.80, 20, 'glow', 0.26],
  ]);

  const overlaps = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

  function makeSprite(rgb) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb},1)`);
    g.addColorStop(0.35, `rgba(${rgb},0.85)`);
    g.addColorStop(0.7, `rgba(${rgb},0.35)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return c;
  }

  function pickDiameter(center) {
    let r = Math.random();
    let d = rand(12, 24);
    for (const [share, lo, hi] of BOKEH.SIZE_MIX) {
      if ((r -= share) <= 0) { d = rand(lo, hi); break; }
    }
    return center ? Math.min(d, BOKEH.CENTER_D_MAX) : d;
  }

  function spawn(zone, preseed) {
    const { W, H } = zone;
    const half = BOKEH.BOX_GAP / 2;
    for (let k = 0; k < BOKEH.TRIES; k++) {
      const edge = Math.random() < BOKEH.EDGE_BIAS;
      const d = pickDiameter(!edge);
      const r = d / 2;
      const A = rand(...BOKEH.SWAY);
      const T = rand(...BOKEH.BREATH);
      const v = k >= BOKEH.STILL_AFTER ? 0 : rand(...BOKEH.RISE);
      const band = BOKEH.EDGE_BAND * W;
      const x0 = edge
        ? (Math.random() < 0.5 ? rand(r + A, Math.max(r + A, band)) : rand(Math.min(W - r - A, W - band), W - r - A))
        : rand(band, W - band);
      const y0 = rand(r + v * T + half, H - r - half);
      const box = { l: x0 - A - r - half, r: x0 + A + r + half, t: y0 - v * T - r - half, b: y0 + r + half };
      if (box.l < 0 || box.r > W || box.t < 0 || box.b > H) continue;
      if (zone.excludes.some((e) => overlaps(box, e))) continue;
      if (zone.particles.some((p) => p && overlaps(box, p.box))) continue;
      const color = Math.random() < BOKEH.GLOW_RATIO ? 'glow' : 'primary';
      const [hi, lo] = BOKEH.ALPHA[color];
      const peak = hi - (hi - lo) * (d - BOKEH.D_MIN) / (BOKEH.D_MAX - BOKEH.D_MIN);
      return { x0, y0, d, r, A, v, T, P: rand(...BOKEH.SWAY_PERIOD), phi: rand(0, Math.PI * 2),
               color, peak, box, age: preseed ? rand(0, T) : 0 };
    }
    return null;
  }

  function step(zone, dt, sprites, canSpawn) {
    const { ctx } = zone;
    ctx.clearRect(0, 0, zone.W, zone.H);
    zone.particles.forEach((p, i) => {
      if (!p) {
        zone.wait[i] -= dt;
        if (zone.wait[i] <= 0 && canSpawn()) {
          zone.particles[i] = spawn(zone, false);
          if (!zone.particles[i]) zone.wait[i] = BOKEH.RETRY;
        }
        return;
      }
      p.age += dt;
      if (p.age >= p.T) { zone.particles[i] = null; zone.wait[i] = rand(...BOKEH.GAP); return; }
      const s = Math.sin(Math.PI * p.age / p.T);
      const x = p.x0 + p.A * Math.sin((Math.PI * 2 * p.age) / p.P + p.phi);
      const y = p.y0 - p.v * p.age;
      ctx.globalAlpha = p.peak * s * s;   // never exceeds peak (<= 0.28 glow / 0.18 primary)
      ctx.drawImage(sprites[p.color], x - p.r, y - p.r, p.d, p.d);
    });
    ctx.globalAlpha = 1;
  }

  // Vertical offset a pending reveal transform adds to an element (so exclusions use the final position).
  function pendingShift(el) {
    const group = el.closest('.reveal');
    if (!group) return 0;
    const t = getComputedStyle(group).transform;
    if (!t || t === 'none' || typeof DOMMatrixReadOnly !== 'function') return 0;
    return new DOMMatrixReadOnly(t).m42;
  }

  function initBokeh() {
    const els = [...document.querySelectorAll('[data-bokeh]')];
    if (!els.length || !('IntersectionObserver' in window)) return null;

    const sprites = { glow: makeSprite(BOKEH.RGB.glow), primary: makeSprite(BOKEH.RGB.primary) };
    const wide = matchMedia('(min-width: 768px)');
    const pauses = new Set();          // 'hidden' | 'lightbox'
    const frameMs = 1000 / BOKEH.FPS - 1; // 30fps gate with 1ms tolerance for vsync jitter
    let rafId = 0;
    let last = 0;
    let heroGateOpen = false;

    const zones = els.map((el) => {
      const name = el.dataset.bokeh;
      const canvas = el.querySelector('canvas.bokeh');
      const slots = BOKEH.ZONES[name] || 0;
      return {
        name, el, canvas, ctx: canvas.getContext('2d'),
        W: 0, H: 0, excludes: [],
        particles: new Array(slots).fill(null), wait: new Array(slots).fill(0),
        inBand: false, live: false, offTimer: 0, roTimer: 0,
      };
    });
    const heroZone = zones.find((z) => z.name === 'hero');

    const maxTotal = () => (wide.matches ? BOKEH.MAX_TOTAL_WIDE : BOKEH.MAX_TOTAL_MOBILE);
    const livingIn = (z) => z.particles.reduce((n, p) => n + (p ? 1 : 0), 0);
    const livingTotal = () => zones.reduce((n, z) => n + (z.live ? livingIn(z) : 0), 0);
    const canSpawn = () => livingTotal() < maxTotal();

    function trimToCap(zone) {
      for (let i = zone.particles.length - 1; i >= 0 && livingTotal() > maxTotal(); i--) {
        if (!zone.particles[i]) continue;
        zone.particles[i] = null;
        zone.wait[i] = rand(...BOKEH.GAP);
      }
    }

    function measureExcludes(zone) {
      const base = zone.el.getBoundingClientRect();
      const m = BOKEH.EXCLUDE_MARGIN;
      zone.excludes = [...zone.el.querySelectorAll('[data-bokeh-exclude]')].map((ex) => {
        const r = ex.getBoundingClientRect();
        const dy = pendingShift(ex);
        return {
          l: r.left - base.left - m,
          r: r.right - base.left + m,
          t: r.top - base.top - dy - m,
          b: r.bottom - base.top - dy + m,
        };
      });
    }

    function seed(zone) {
      zone.particles.fill(null);
      zone.wait.fill(0);
      for (let i = 0; i < zone.particles.length; i++) {
        zone.particles[i] = spawn(zone, true);
        if (!zone.particles[i]) zone.wait[i] = BOKEH.RETRY;
      }
      if (zone.live) trimToCap(zone);
    }

    function drawStatic(zone) {
      const photo = zone.el.querySelector('.hero__photo');
      const { ctx, W, H } = zone;
      ctx.clearRect(0, 0, W, H);
      if (!photo) return;
      const base = zone.el.getBoundingClientRect();
      const pr = photo.getBoundingClientRect();
      const gap = BOKEH.EXCLUDE_MARGIN;
      const bands = { top: [0, pr.top - base.top - gap], bottom: [pr.bottom - base.top + gap, H] };
      BOKEH_STATIC.forEach(([band, fx, fy, d, color, alpha]) => {
        const [t, b] = bands[band];
        const r = d / 2;
        const x = clamp(fx * W, r, W - r);
        const y = clamp(t + fy * (b - t), t + r, b - r);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[color], x - r, y - r, d, d);
      });
      ctx.globalAlpha = 1;
    }

    function resize(zone, force) {
      const W = zone.el.clientWidth;
      const H = zone.el.clientHeight;
      const reseed = force || W !== zone.W || Math.abs(H - zone.H) > 40;
      zone.W = W;
      zone.H = H;
      if (zone.canvas.width !== W * BOKEH.DPR) zone.canvas.width = W * BOKEH.DPR;
      if (zone.canvas.height !== H * BOKEH.DPR) zone.canvas.height = H * BOKEH.DPR;
      measureExcludes(zone);
      if (reseed) seed(zone);
      else zone.particles.forEach((p, i) => { if (p && p.box.b > H) zone.particles[i] = null; });
      if (isReduced() && zone === heroZone) drawStatic(zone);
    }

    function loop(now) {
      rafId = requestAnimationFrame(loop);
      if (now - last < frameMs) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      zones.forEach((z) => { if (z.live) step(z, dt, sprites, canSpawn); });
    }

    function kick() {
      const run = !isReduced() && pauses.size === 0 && zones.some((z) => z.live);
      if (run && !rafId) {
        last = performance.now();
        rafId = requestAnimationFrame(loop);
      } else if (!run && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    const wants = (z) => z.inBand && !isReduced() && (z !== heroZone || heroGateOpen);

    function refresh(zone) {
      if (wants(zone)) {
        clearTimeout(zone.offTimer);
        zone.offTimer = 0;
        if (!zone.live) {
          zone.live = true;
          trimToCap(zone); // canvas is still at opacity 0, so dropping extras is invisible
        }
        zone.canvas.classList.add('is-on');
      } else if (zone.live && !zone.offTimer) {
        zone.canvas.classList.remove('is-on');
        zone.offTimer = setTimeout(() => {
          zone.offTimer = 0;
          zone.live = false;
          kick();
        }, BOKEH.ZONE_FADE);
      }
      kick();
    }

    zones.forEach((z) => resize(z, true));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const zone = zones.find((z) => z.el === entry.target);
        zone.inBand = entry.isIntersecting;
        if (!isReduced()) refresh(zone);
      });
    }, { rootMargin: '-15% 0px -15% 0px', threshold: 0 });
    zones.forEach((z) => io.observe(z.el));

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const zone = zones.find((z) => z.el === entry.target);
          clearTimeout(zone.roTimer);
          zone.roTimer = setTimeout(() => resize(zone, false), 150);
        });
      });
      zones.forEach((z) => ro.observe(z.el));
    }

    const remeasure = (zone) => {
      measureExcludes(zone);
      if (isReduced() && zone === heroZone) drawStatic(zone);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => zones.forEach(remeasure));
    const heroPhoto = heroZone && heroZone.el.querySelector('.hero__photo');
    if (heroPhoto && !heroPhoto.complete) heroPhoto.addEventListener('load', () => remeasure(heroZone), { once: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauses.add('hidden');
      else pauses.delete('hidden');
      kick();
    });

    function toStatic() {
      heroGateOpen = true;
      zones.forEach((z) => {
        clearTimeout(z.offTimer);
        z.offTimer = 0;
        z.live = false;
        z.canvas.classList.remove('is-intro');
        z.canvas.classList.toggle('is-on', z === heroZone);
        z.ctx.clearRect(0, 0, z.W, z.H);
      });
      kick();
      if (heroZone) drawStatic(heroZone);
    }

    function toLive() {
      zones.forEach((z) => {
        z.ctx.clearRect(0, 0, z.W, z.H);
        z.canvas.classList.remove('is-on');
        refresh(z);
      });
    }

    if (isReduced()) toStatic();

    return {
      pause(reason) { pauses.add(reason); kick(); },
      resume(reason) { pauses.delete(reason); kick(); },
      // Hero first appearance: 1200ms fade instead of the usual 600ms (spec 1-5).
      openHeroGate() {
        if (heroGateOpen || !heroZone) { heroGateOpen = true; return; }
        heroGateOpen = true;
        heroZone.canvas.classList.add('is-intro');
        refresh(heroZone);
        setTimeout(() => heroZone.canvas.classList.remove('is-intro'), BOKEH.INTRO_FADE);
      },
      toStatic,
      toLive,
      stats() {
        const perZone = {};
        const maxPeak = { glow: 0, primary: 0 };
        zones.forEach((z) => {
          perZone[z.name] = livingIn(z);
          if (!z.live) return;
          z.particles.forEach((p) => { if (p) maxPeak[p.color] = Math.max(maxPeak[p.color], p.peak); });
        });
        return {
          living: livingTotal(),
          zones: perZone,
          maxPeak,
          running: rafId ? zones.filter((z) => z.live).map((z) => z.name) : [],
        };
      },
    };
  }

  /* ---------- Section reveal (spec 2-0) ---------- */

  let revealAll = () => {};

  function initReveal() {
    const groups = [...document.querySelectorAll('.reveal:not([data-reveal="hero"])')];
    const show = (el, i = 0) => {
      if (el.classList.contains('is-visible')) return;
      el.style.setProperty('--i', String(i));
      el.classList.add('is-visible');
      el.dispatchEvent(new CustomEvent('revealed'));
    };
    revealAll = () => groups.forEach((g) => show(g));

    if (isReduced() || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((el, k) => {
          io.unobserve(el);
          show(el, Math.min(k, 2));
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    groups.forEach((g) => io.observe(g));

    // Safety net: once the end of the page is on screen, show anything still hidden.
    const sentinel = document.querySelector('.reveal-sentinel');
    if (sentinel) {
      const end = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        end.disconnect();
        groups.forEach((g) => { io.unobserve(g); show(g); });
      });
      end.observe(sentinel);
    }
  }

  /* ---------- Hero load sequence + scroll cue (spec 2-1, 4-9) ---------- */

  let finishHero = () => {};

  function initHero(bokeh) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const top = hero.querySelector('.hero__top');
    const bottom = hero.querySelector('.hero__bottom');
    const photo = hero.querySelector('.hero__photo');
    const cue = hero.querySelector('.scroll-cue');
    const toggle = document.querySelector('.bgm-toggle');
    const timers = [];

    const showPhoto = () => {
      const reveal = () => photo.classList.add('is-visible');
      // Text never waits for the photo; the photo fades in once it is decoded.
      if (photo.complete || typeof photo.decode !== 'function') reveal();
      else photo.decode().then(reveal, reveal);
    };
    const steps = [
      [0, () => { top.classList.add('is-visible'); toggle?.classList.add('is-ready'); }],
      [HERO_SEQ.PHOTO, showPhoto],
      [HERO_SEQ.BOKEH, () => bokeh?.openHeroGate()],
      [HERO_SEQ.BOTTOM, () => bottom.classList.add('is-visible')],
      [HERO_SEQ.CUE, () => cue?.classList.add('is-visible')],
    ];

    finishHero = () => {
      timers.forEach(clearTimeout);
      steps.forEach(([, fn]) => fn());
    };

    if (isReduced()) {
      finishHero();
    } else {
      const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      Promise.race([fontsReady, wait(HERO_SEQ.FONT_WAIT)]).then(() => {
        if (isReduced()) { finishHero(); return; }
        steps.forEach(([at, fn]) => timers.push(setTimeout(fn, later(at))));
      });
    }

    if (!cue) return;
    const onScroll = () => {
      if (window.scrollY <= SCROLL_CUE_HIDE_Y) return;
      window.removeEventListener('scroll', onScroll);
      cue.classList.add('is-gone');
      setTimeout(() => cue.classList.add('is-done'), token('--dur-fast') * 2);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Sprig-divider stroke-draw (spec 3-1) ---------- */

  function initSprigs() {
    const sprigs = document.querySelectorAll('.sprig');
    if (!('IntersectionObserver' in window)) {
      sprigs.forEach((s) => s.classList.add('is-drawn'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-drawn');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -10% 0px' });
    sprigs.forEach((s) => io.observe(s));
  }

  /* ---------- String-lights (spec 3-2) ---------- */

  function initLights() {
    const section = document.querySelector('.calendar');
    const lights = section?.querySelector('.lights');
    const trigger = section?.querySelector('[data-lights-trigger]');
    if (!lights || !trigger) return;
    const turnOn = () => lights.classList.add('is-on');
    if (trigger.classList.contains('is-visible')) turnOn();
    else trigger.addEventListener('revealed', turnOn, { once: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        section.classList.toggle('in-view', entry.isIntersecting);
      }, { threshold: 0 }).observe(section);
    } else {
      section.classList.add('in-view');
    }
  }

  /* ---------- D-day in KST (spec 4-5) ---------- */

  function initDday() {
    const box = document.getElementById('dday');
    const count = document.getElementById('dday-count');
    const message = document.getElementById('dday-message');
    if (!box || !count || !message) return;
    const [y, m, d] = box.dataset.weddingDate.split('-').map(Number);
    const target = Date.UTC(y, m - 1, d);

    function render() {
      const kst = new Date(Date.now() + 9 * 3600e3);
      const today = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate());
      const days = Math.round((target - today) / 864e5);
      // The counter is shown only before the wedding; the day itself and after show the message only.
      count.hidden = days <= 0;
      count.textContent = days > 0 ? `D - ${days}` : '';
      const key = days > 0 ? 'dday-before' : days === 0 ? 'dday-today' : 'dday-after';
      // After the wedding the wedding day counts as day 1, so the next day is day 2.
      message.replaceChildren(richText(key, { n: days > 0 ? days : 1 - days }));
      if (days > 0) {
        // The visual counter is aria-hidden ("D - n" reads poorly), so screen readers get this sentence.
        const sr = document.createElement('span');
        sr.className = 'sr-only';
        sr.append(' ', richText('dday-before-sr', { n: days }));
        message.append(sr);
      }
      box.hidden = false;
    }
    render();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  }

  /* ---------- Gallery carousel (spec 4-1) ---------- */

  // Shared with the lightbox's finishSwipe: at most one slide per gesture, no wrap.
  function swipeTarget(index, total, dx, samples) {
    const a = samples[0];
    const b = samples[samples.length - 1];
    const v = b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0;
    const flick = Math.abs(v) >= LB.SWIPE_VELOCITY && Math.sign(v) === Math.sign(dx);
    if (Math.abs(dx) < LB.SWIPE_DIST && !flick) return index;
    return clamp(dx < 0 ? index + 1 : index - 1, 0, total - 1);
  }

  function initCarousel() {
    const el = document.querySelector('.g-carousel');
    if (!el) return null;
    const viewport = el.querySelector('.g-viewport');
    const track = el.querySelector('.g-track');
    const slides = [...track.querySelectorAll('.g-slide')];
    const buttons = slides.map((s) => s.querySelector('.g-open'));
    const imgs = slides.map((s) => s.querySelector('img'));
    const btnPrev = el.querySelector('.g-prev');
    const btnNext = el.querySelector('.g-next');
    const now = el.querySelector('.g-counter__now');
    const status = el.querySelector('.g-status');
    const total = slides.length;
    const hasInert = 'inert' in HTMLElement.prototype;
    let index = 0;
    let near = false;

    // Loading window: index - 1 .. index + 2, switched to eager once the carousel is about a screen away.
    function preload() {
      if (!near) return;
      const lo = Math.max(0, index - GAL.BEHIND);
      const hi = Math.min(total - 1, index + GAL.AHEAD);
      for (let k = lo; k <= hi; k++) if (imgs[k].loading !== 'eager') imgs[k].loading = 'eager';
    }

    function setCurrent(k, current) {
      slides[k].inert = !current;
      slides[k].classList.toggle('is-current', current);
      if (current) slides[k].removeAttribute('aria-hidden');
      else slides[k].setAttribute('aria-hidden', 'true');
      if (!hasInert) { // iOS 15.4 and older: keep hidden slides out of the tab order
        if (current) buttons[k].removeAttribute('tabindex');
        else buttons[k].tabIndex = -1;
      }
    }

    function goTo(i, { animate = true, announce = true } = {}) {
      const next = clamp(i, 0, total - 1);
      const changed = next !== index;
      const moveFocus = changed && slides[index].contains(document.activeElement);
      if (!animate) track.classList.add('no-anim');
      index = next;
      track.style.setProperty('--g-i', String(index));
      track.style.setProperty('--g-dx', '0px');
      setCurrent(index, true);                         // un-inert the new slide before focusing it
      if (moveFocus) buttons[index].focus({ preventScroll: true });
      slides.forEach((_, k) => { if (k !== index) setCurrent(k, false); });
      now.textContent = String(index + 1);
      btnPrev.setAttribute('aria-disabled', String(index === 0));
      btnNext.setAttribute('aria-disabled', String(index === total - 1));
      viewport.scrollLeft = 0;                         // guard for the overflow: hidden fallback
      if (changed && announce && !moveFocus) {
        status.textContent = `${text('lb-counter', { n: index + 1, total })}, ${imgs[index].alt}`;
      }
      if (!animate) { void track.offsetWidth; track.classList.remove('no-anim'); }
      preload();
    }

    btnPrev.addEventListener('click', () => { if (index > 0) goTo(index - 1); });
    btnNext.addEventListener('click', () => { if (index < total - 1) goTo(index + 1); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    // Pointer gestures: pan-y keeps vertical page scroll with the browser.
    let g = null;
    let suppressClick = false;
    viewport.addEventListener('pointerdown', (e) => {
      if (!e.isPrimary) {                              // second finger: page pinch-zoom takes over
        if (g?.axis === 'x') { track.classList.remove('is-dragging'); goTo(index); }
        g = null;
        return;
      }
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      suppressClick = false;
      g = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, axis: null, samples: [{ t: e.timeStamp, x: e.clientX }] };
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!g || e.pointerId !== g.id) return;
      const dx = e.clientX - g.x0;
      const dy = e.clientY - g.y0;
      if (!g.axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < LB.AXIS_LOCK) return;
        g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (g.axis === 'y') return;                    // the browser scrolls the page
        viewport.setPointerCapture(e.pointerId);       // capture only once the gesture is horizontal
        track.classList.add('is-dragging');
      }
      if (g.axis !== 'x') return;
      const atEdge = (index === 0 && dx > 0) || (index === total - 1 && dx < 0);
      g.dx = dx;
      track.style.setProperty('--g-dx', `${atEdge ? dx * LB.EDGE_RESIST : dx}px`);
      g.samples.push({ t: e.timeStamp, x: e.clientX });
      while (g.samples.length > 2 && e.timeStamp - g.samples[0].t > LB.VELOCITY_WINDOW) g.samples.shift();
    });
    function onEnd(e) {
      if (!g || e.pointerId !== g.id) return;
      if (g.axis === 'x') {
        track.classList.remove('is-dragging');
        suppressClick = true;
        goTo(e.type === 'pointercancel' ? index : swipeTarget(index, total, g.dx, g.samples));
      } else if (!g.axis && e.type === 'pointerup') {
        const r = slides[index].getBoundingClientRect();   // tap on a peeking neighbour
        const step = e.clientX < r.left ? -1 : e.clientX > r.right ? 1 : 0;
        if (step) {
          suppressClick = true;    // the follow-up click would land on the new current slide and open the lightbox
          goTo(index + step);
        }
      }
      g = null;
    }
    viewport.addEventListener('pointerup', onEnd);
    viewport.addEventListener('pointercancel', onEnd);
    viewport.addEventListener('click', (e) => {
      // detail 0 = keyboard activation: a touch swipe fires no click, so the flag may still be set.
      if (!suppressClick || e.detail === 0) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);
    viewport.addEventListener('dragstart', (e) => e.preventDefault());

    // Trackpad horizontal swipe (Nice): one slide per 40px, then ignore input for 450ms.
    let wheelSum = 0;
    let wheelUntil = 0;
    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();                              // keeps the browser's two-finger "back" gesture away
      if (e.timeStamp < wheelUntil) return;
      wheelSum += e.deltaX;
      if (Math.abs(wheelSum) <= GAL.WHEEL_STEP) return;
      goTo(index + Math.sign(wheelSum));
      wheelSum = 0;
      wheelUntil = e.timeStamp + GAL.WHEEL_LOCK;
    }, { passive: false });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries, obs) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        near = true;
        preload();
        obs.disconnect();
      }, { rootMargin: GAL.NEAR_MARGIN }).observe(el);
    } else {
      near = true;
    }

    goTo(0, { animate: false, announce: false });
    return { goTo, get index() { return index; }, button: (k) => buttons[k] };
  }

  // Slide image load fade (spec 4-1-7, Should).
  function initPhotoFade() {
    document.querySelectorAll('.g-open img').forEach((img) => {
      if (img.complete) return;
      img.classList.add('is-loading');
      const done = () => img.classList.remove('is-loading');
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  /* ---------- Lightbox (spec 4-2) ---------- */

  function initLightbox(bokeh, carousel) {
    const dialog = document.getElementById('lightbox');
    const buttons = [...document.querySelectorAll('.g-open')];
    if (!dialog || !buttons.length) return;
    if (typeof dialog.showModal !== 'function') {
      buttons.forEach((btn) => btn.addEventListener('click', () => window.open(btn.dataset.full, '_blank', 'noopener')));
      return;
    }

    const stage = dialog.querySelector('.lb-stage');
    const track = dialog.querySelector('.lb-track');
    const scrim = dialog.querySelector('.lb-scrim');
    const btnClose = dialog.querySelector('.lb-close');
    const btnPrev = dialog.querySelector('.lb-prev');
    const btnNext = dialog.querySelector('.lb-next');
    const counterText = dialog.querySelector('.lb-counter__text');
    const counterSr = dialog.querySelector('.lb-counter__sr');
    const total = buttons.length;

    const slides = buttons.map((btn) => {
      const source = btn.querySelector('img');   // the carousel's image for this slide
      const li = document.createElement('li');
      li.className = 'lb-slide';
      const img = document.createElement('img');
      img.className = 'lb-img is-empty';
      img.alt = source.alt;
      img.width = Number(btn.dataset.w);
      img.height = Number(btn.dataset.h);
      img.decoding = 'async';
      img.draggable = false;
      img.addEventListener('load', () => img.classList.remove('is-empty'));
      li.append(img);
      track.append(li);
      return {
        li, img, source, full: btn.dataset.full, fullUrl: new URL(btn.dataset.full, document.baseURI).href,
        w: Number(btn.dataset.w), h: Number(btn.dataset.h), fw: 0, fh: 0, fullRequested: false,
      };
    });

    let index = 0;
    let closing = false;
    let closedByPop = false;
    let ignorePop = false;
    let W = 0;
    let H = 0;
    const zoom = { s: 1, tx: 0, ty: 0 };
    const cur = () => slides[index];

    function measure() {
      W = stage.clientWidth;
      H = stage.clientHeight;
      slides.forEach((sl) => {
        const k = Math.min(W / sl.w, H / sl.h);
        sl.fw = sl.w * k;
        sl.fh = sl.h * k;
        sl.img.style.width = `${sl.fw}px`;
        sl.img.style.height = `${sl.fh}px`;
      });
    }

    /* Zoom: transform-origin 0 0, translate(tx, ty) scale(s) on the fitted image. */
    const origin = () => ({ ox: (W - cur().fw) / 2, oy: (H - cur().fh) / 2 });

    function clampZoom(s, tx, ty) {
      const { ox, oy } = origin();
      const sw = cur().fw * s;
      const sh = cur().fh * s;
      return {
        s,
        tx: sw > W ? clamp(tx, W - ox - sw, -ox) : W / 2 - ox - sw / 2,
        ty: sh > H ? clamp(ty, H - oy - sh, -oy) : H / 2 - oy - sh / 2,
      };
    }

    function applyZoom(animate) {
      const { img } = cur();
      img.classList.toggle('is-zooming', Boolean(animate));
      const identity = zoom.s === 1 && zoom.tx === 0 && zoom.ty === 0;
      img.style.transform = identity ? '' : `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.s})`;
    }

    function resetZoom(animate) {
      Object.assign(zoom, { s: 1, tx: 0, ty: 0 });
      applyZoom(animate);
    }

    // Zoom to `next` while keeping stage point (px, py) fixed.
    function zoomAt(next, px, py, animate) {
      if (next <= 1) { resetZoom(animate); return; }
      const { ox, oy } = origin();
      const k = next / zoom.s;
      const tx = px - ox - (px - ox - zoom.tx) * k;
      const ty = py - oy - (py - oy - zoom.ty) * k;
      Object.assign(zoom, clampZoom(next, tx, ty));
      applyZoom(animate);
    }

    function setTrack(dx, animate) {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translate3d(calc(${-100 * index}% + ${dx}px), 0, 0)`;
    }

    // The current slide starts from the file the carousel already shows (cached, same ratio), then swaps
    // to the original once decoded. Neighbours and slides the carousel has not loaded get the original.
    function load(i, current = false) {
      const sl = slides[i];
      if (!sl || sl.fullRequested) return;
      sl.fullRequested = true;
      const { source } = sl;
      const shown = current && source.complete && source.naturalWidth > 0 ? source.currentSrc : '';
      if (!shown || shown === sl.fullUrl) { sl.img.src = sl.full; return; }
      sl.img.src = shown;
      const pre = new Image();
      pre.src = sl.full;
      const swap = () => { sl.img.src = sl.full; };
      (typeof pre.decode === 'function' ? pre.decode() : Promise.resolve()).then(swap, swap);
    }

    function show(i, animate = true) {
      const next = clamp(i, 0, total - 1);
      if (next !== index) resetZoom(false);
      index = next;
      setTrack(0, animate);
      slides.forEach((sl, k) => sl.li.setAttribute('aria-hidden', String(k !== index)));
      load(index, true);
      load(index - 1);
      load(index + 1);
      counterText.textContent = `${index + 1} / ${total}`;
      counterSr.textContent = text('lb-counter', { n: index + 1, total });
      btnPrev.disabled = index === 0;
      btnNext.disabled = index === total - 1;
      // Keep keyboard focus inside the dialog when the focused arrow button becomes disabled.
      if (document.activeElement === btnPrev && btnPrev.disabled) btnNext.focus();
      if (document.activeElement === btnNext && btnNext.disabled) btnPrev.focus();
    }

    // Carousel follows the photo last seen here (spec 4-1-6); no animation, no live announcement.
    const syncCarousel = () => carousel?.goTo(index, { animate: false, announce: false });

    function open(i) {
      closing = false;
      dialog.showModal();
      root.classList.add('lb-open');
      bokeh?.pause('lightbox');
      measure();
      index = i;
      resetZoom(false);
      show(i, false);
      history.pushState({ lb: 1 }, '');
      requestAnimationFrame(() => dialog.classList.add('is-open'));
      btnClose.focus();
    }

    function requestClose() {
      if (!dialog.open || closing) return;
      closing = true;
      syncCarousel();
      dialog.classList.remove('is-open');
      setTimeout(() => { if (dialog.open) dialog.close(); }, token('--dur-fast'));
    }

    // Cleanup runs on `close`, which also fires when the browser closes the dialog by itself.
    dialog.addEventListener('close', () => {
      closing = false;
      endGesture();
      dialog.classList.remove('is-open');
      root.classList.remove('lb-open');
      bokeh?.resume('lightbox');
      resetZoom(false);
      cur().li.style.transform = '';
      scrim.style.opacity = '';
      if (!closedByPop && history.state && history.state.lb) {
        ignorePop = true;
        history.back();
      }
      closedByPop = false;
      // Focus the carousel's current slide button, not the opener: if the number changed, the opener is inert.
      syncCarousel();
      carousel?.button(carousel.index).focus({ preventScroll: true });
    });
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); requestClose(); });
    window.addEventListener('popstate', () => {
      if (ignorePop) { ignorePop = false; return; }
      if (dialog.open) { closedByPop = true; requestClose(); }
    });

    buttons.forEach((btn, i) => btn.addEventListener('click', () => open(i)));
    btnClose.addEventListener('click', requestClose);
    btnPrev.addEventListener('click', () => show(index - 1));
    btnNext.addEventListener('click', () => show(index + 1));

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
      else if (e.key === '+' || e.key === '=') zoomAt(Math.min(LB.ZOOM_MAX, zoom.s * LB.KEY_ZOOM_STEP), W / 2, H / 2, true);
      else if (e.key === '-') zoomAt(zoom.s / LB.KEY_ZOOM_STEP, W / 2, H / 2, true);
      else if (e.key === '0') resetZoom(true);
    });

    stage.addEventListener('wheel', (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      zoomAt(clamp(zoom.s * Math.exp(-e.deltaY * 0.01), 1, LB.ZOOM_MAX), e.clientX - r.left, e.clientY - r.top, false);
    }, { passive: false });

    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        if (!dialog.open) return;
        measure();
        resetZoom(false);
        setTrack(0, false);
      }).observe(stage);
    }

    /* Gestures: one Pointer Events path for touch, mouse and pen. */
    const pointers = new Map();
    let g = null;          // active gesture
    let rect = null;       // stage rect cached per gesture
    let lastTap = null;

    const toStage = (e) => ({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    function endGesture() {
      pointers.clear();
      g = null;
      track.classList.remove('is-dragging');
    }

    function startPinch() {
      const [a, b] = [...pointers.values()];
      g = {
        type: 'pinch',
        d0: Math.hypot(b.x - a.x, b.y - a.y) || 1,
        s0: zoom.s, tx0: zoom.tx, ty0: zoom.ty,
        m0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      lastTap = null;
    }

    function settlePinch() {
      if (zoom.s < 1) resetZoom(true);
      else {
        Object.assign(zoom, clampZoom(zoom.s, zoom.tx, zoom.ty));
        applyZoom(true);
      }
    }

    function returnFromDrag() {
      const { li } = cur();
      li.classList.add('is-returning');
      scrim.classList.add('is-returning');
      li.style.transform = '';
      scrim.style.opacity = '';
      setTimeout(() => {
        li.classList.remove('is-returning');
        scrim.classList.remove('is-returning');
      }, token('--dur-modal') + 50);
    }

    stage.addEventListener('pointerdown', (e) => {
      if (closing || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault();
      if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
      if (!pointers.size) rect = stage.getBoundingClientRect();
      pointers.set(e.pointerId, toStage(e));

      if (pointers.size === 1) {
        const p = toStage(e);
        g = { type: 'pending', x0: p.x, y0: p.y, dx: 0, dy: 0, tx0: zoom.tx, ty0: zoom.ty, moved: false,
              samples: [{ t: e.timeStamp, x: p.x }] };
      } else if (pointers.size === 2) {
        if (g && g.type === 'swipe') { track.classList.remove('is-dragging'); setTrack(0, true); }
        if (g && g.type === 'dragclose') returnFromDrag();
        startPinch();
      }
    });

    stage.addEventListener('pointermove', (e) => {
      if (!g || !pointers.has(e.pointerId)) return;
      const p = toStage(e);
      pointers.set(e.pointerId, p);

      if (g.type === 'pinch') {
        if (pointers.size < 2) return;
        const [a, b] = [...pointers.values()];
        const s = clamp(g.s0 * (Math.hypot(b.x - a.x, b.y - a.y) / g.d0), LB.PINCH_MIN, LB.ZOOM_MAX);
        const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const { ox, oy } = origin();
        // Keep the image point that started under the fingers' midpoint under the current midpoint.
        const ux = (g.m0.x - ox - g.tx0) / g.s0;
        const uy = (g.m0.y - oy - g.ty0) / g.s0;
        const next = { s, tx: m.x - ox - ux * s, ty: m.y - oy - uy * s };
        Object.assign(zoom, s >= 1 ? clampZoom(s, next.tx, next.ty) : next);
        applyZoom(false);
        return;
      }

      const dx = p.x - g.x0;
      const dy = p.y - g.y0;
      g.dx = dx;
      g.dy = dy;
      if (Math.hypot(dx, dy) > LB.TAP_SLOP) g.moved = true;

      if (g.type === 'pending') {
        if (zoom.s > 1) g.type = 'pan';
        else if (Math.max(Math.abs(dx), Math.abs(dy)) >= LB.AXIS_LOCK) {
          g.type = Math.abs(dx) > Math.abs(dy) ? 'swipe' : 'dragclose';
          if (g.type === 'swipe') track.classList.add('is-dragging');
        } else return;
      }

      if (g.type === 'swipe') {
        const atEdge = (index === 0 && dx > 0) || (index === total - 1 && dx < 0);
        setTrack(atEdge ? dx * LB.EDGE_RESIST : dx, false);
        g.samples.push({ t: e.timeStamp, x: p.x });
        while (g.samples.length > 2 && e.timeStamp - g.samples[0].t > LB.VELOCITY_WINDOW) g.samples.shift();
      } else if (g.type === 'dragclose') {
        const down = Math.max(0, dy);
        cur().li.style.transform = down ? `translateY(${down}px)` : '';
        scrim.style.opacity = String(Math.max(LB.SCRIM_MIN, LB.SCRIM_ALPHA * (1 - down / LB.CLOSE_FADE_RANGE)));
      } else if (g.type === 'pan') {
        Object.assign(zoom, clampZoom(zoom.s, g.tx0 + dx, g.ty0 + dy));
        applyZoom(false);
      }
    });

    function finishSwipe() {
      track.classList.remove('is-dragging');
      show(swipeTarget(index, total, g.dx, g.samples), true);
    }

    function tap(p, t) {
      const sl = cur();
      const { ox, oy } = origin();
      const left = ox + zoom.tx;
      const topY = oy + zoom.ty;
      const onImage = p.x >= left && p.x <= left + sl.fw * zoom.s && p.y >= topY && p.y <= topY + sl.fh * zoom.s;
      if (!onImage && zoom.s === 1) { lastTap = null; requestClose(); return; }
      if (lastTap && t - lastTap.t <= LB.DOUBLE_TAP_MS && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) <= LB.TAP_SLOP) {
        lastTap = null;
        if (zoom.s > 1) resetZoom(true);
        else zoomAt(LB.DOUBLE_TAP_ZOOM, p.x, p.y, true);
      } else {
        lastTap = { t, x: p.x, y: p.y };
      }
    }

    function onPointerEnd(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (!g) return;
      const cancelled = e.type === 'pointercancel';

      if (g.type === 'pinch') {
        if (pointers.size === 1) {
          settlePinch();
          const [p] = [...pointers.values()];
          g = { type: zoom.s > 1 ? 'pan' : 'idle', x0: p.x, y0: p.y, dx: 0, dy: 0, tx0: zoom.tx, ty0: zoom.ty, moved: true, samples: [] };
        } else if (pointers.size === 0) {
          settlePinch();
          g = null;
        }
        return;
      }
      if (pointers.size > 0) return;

      if (g.type === 'swipe') finishSwipe();
      else if (g.type === 'dragclose') {
        if (!cancelled && g.dy >= LB.CLOSE_DIST) requestClose();
        else returnFromDrag();
      } else if ((g.type === 'pending' || g.type === 'pan') && !cancelled && !g.moved) {
        tap({ x: g.x0 + g.dx, y: g.y0 + g.dy }, e.timeStamp);
      }
      g = null;
    }
    stage.addEventListener('pointerup', onPointerEnd);
    stage.addEventListener('pointercancel', onPointerEnd);
  }

  /* ---------- BGM toggle (spec 4-3) ---------- */

  function initBgm() {
    const btn = document.querySelector('.bgm-toggle');
    const audio = document.getElementById('bgm');
    if (!btn || !audio) return;
    let on = false;
    let fadeId = 0;
    let ringTimer = 0;
    let resumeOnShow = false;

    function fade(ms, volumeAt, done) {
      cancelAnimationFrame(fadeId);
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / ms);
        audio.volume = clamp(volumeAt(t), 0, 1); // read-only on iOS Safari: silently ignored there
        if (t < 1) fadeId = requestAnimationFrame(tick);
        else { fadeId = 0; if (done) done(); }
      };
      fadeId = requestAnimationFrame(tick);
    }

    function setPressed(next) {
      on = next;
      btn.setAttribute('aria-pressed', String(next));
      clearTimeout(ringTimer);
      if (next) btn.classList.add('is-ringing');
      else ringTimer = setTimeout(() => btn.classList.remove('is-ringing'), token('--dur-base'));
    }

    function fail() {
      cancelAnimationFrame(fadeId);
      audio.pause();
      audio.volume = BGM_VOLUME;
      btn.removeAttribute('aria-busy');
      if (on) announce(text('bgm-failed'));
      setPressed(false);
    }

    async function start() {
      setPressed(true);
      btn.setAttribute('aria-busy', 'true');
      try {
        audio.volume = 0;
        await audio.play();
        if (!on) return;
        fade(BGM_FADE_IN_MS, (t) => BGM_VOLUME * t * t);
      } catch (err) {
        fail();
      }
    }

    function stop() {
      setPressed(false);
      btn.removeAttribute('aria-busy');
      const from = audio.volume;
      fade(BGM_FADE_OUT_MS, (t) => from * (1 - t) ** 2, () => {
        audio.pause();
        audio.volume = BGM_VOLUME;
      });
    }

    audio.addEventListener('playing', () => btn.removeAttribute('aria-busy'));
    audio.addEventListener('error', () => { if (on) fail(); });
    btn.addEventListener('click', () => (on ? stop() : start()));

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (on && !audio.paused) {
          resumeOnShow = true;
          cancelAnimationFrame(fadeId);
          audio.pause();
          audio.volume = BGM_VOLUME;
        }
      } else if (resumeOnShow) {
        resumeOnShow = false;
        if (on) audio.play().catch(fail);
      }
    });
  }

  /* ---------- Copy (account, address, link) (spec 4-4) ---------- */

  function legacyCopy(value) {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    ta.setSelectionRange(0, value.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    ta.remove();
    return ok;
  }

  async function writeClipboard(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (err) {
        // Fall through to the execCommand path.
      }
    }
    return legacyCopy(value);
  }

  function selectText(el) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      let timer = 0;
      btn.addEventListener('click', async () => {
        const kind = btn.dataset.copyKind;
        const source = btn.dataset.copyTarget ? document.querySelector(btn.dataset.copyTarget) : null;
        const value = kind === 'link' ? siteUrl() : (source ? source.textContent.trim() : '');

        const ok = await writeClipboard(value);
        btn.classList.toggle('is-copied', ok);
        btn.classList.toggle('is-failed', !ok);
        clearTimeout(timer);
        timer = setTimeout(() => btn.classList.remove('is-copied', 'is-failed'), COPY_LABEL_MS);
        if (ok) {
          if (navigator.vibrate) navigator.vibrate(12);
          notify(text(`copy-done-${kind}`), true);
        } else {
          notify(text('copy-failed'));
          if (source) selectText(source);
        }
      });
    });
  }

  /* ---------- Kakao share with link-copy fallback (spec 4-6) ---------- */

  function initKakao() {
    const btn = document.getElementById('share-kakao');
    if (!btn) return;
    const key = kakaoKey();
    let sdk = null;

    const loadSdk = () => {
      if (!sdk) {
        sdk = new Promise((resolve, reject) => {
          if (window.Kakao) { resolve(window.Kakao); return; }
          const s = document.createElement('script');
          s.src = KAKAO_SDK_URL;
          s.async = true;
          s.onload = () => (window.Kakao ? resolve(window.Kakao) : reject(new Error('Kakao SDK missing after load')));
          s.onerror = () => reject(new Error('Kakao SDK failed to load'));
          document.head.append(s);
        });
      }
      return sdk;
    };

    async function fallback() {
      const ok = await writeClipboard(siteUrl());
      if (ok && navigator.vibrate) navigator.vibrate(12);
      notify(ok ? text('kakao-fallback') : text('copy-failed'));
    }

    btn.addEventListener('click', async () => {
      try {
        const Kakao = await loadSdk();
        if (!Kakao.isInitialized()) Kakao.init(key);
        const url = siteUrl();
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: metaContent('meta[property="og:title"]'),
            description: metaContent('meta[property="og:description"]'),
            imageUrl: metaContent('meta[property="og:image"]'),
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [{ title: text('kakao-button'), link: { mobileWebUrl: url, webUrl: url } }],
        });
      } catch (err) {
        sdk = null;
        fallback();
      }
    });
  }

  /* ---------- Venue map (spec 4-7) ---------- */

  // Static Kakao map with one marker: no drag, zoom, tap or animation. Any failure (SDK load, 401/403 auth,
  // address lookup, a loader that never calls back) hides the box; the venue info and map buttons stay.
  function initVenueMap() {
    const box = document.getElementById('venue-map');
    if (!box) return;
    const canvas = box.querySelector('.venue__map-canvas');
    const address = document.getElementById('venue-address')?.textContent.trim();
    const key = kakaoKey();
    let settled = false;
    let timer = 0;

    const fail = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      box.hidden = true;
    };
    if (!canvas || !address || !key) { fail(); return; }

    function draw(maps) {
      new maps.services.Geocoder().addressSearch(address, (result, status) => {
        if (settled) return;
        try {
          if (status !== maps.services.Status.OK || !result.length) throw new Error(`Address lookup: ${status}`);
          const center = new maps.LatLng(result[0].y, result[0].x);
          const map = new maps.Map(canvas, {
            center,
            level: MAP.LEVEL,
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            keyboardShortcuts: false,
            tileAnimation: false,
          });
          new maps.Marker({ map, position: center });
          settled = true;
          clearTimeout(timer);
          // Kakao relayouts only on window resize; keep the venue centred whenever the box size changes (no animation).
          if ('ResizeObserver' in window) new ResizeObserver(() => { map.relayout(); map.setCenter(center); }).observe(canvas);
        } catch (err) {
          fail();
        }
      });
    }

    function load() {
      timer = setTimeout(fail, MAP.TIMEOUT);
      const s = document.createElement('script');
      s.src = `${KAKAO_MAP_SDK_URL}?appkey=${encodeURIComponent(key)}&autoload=false&libraries=services`;
      s.async = true;
      s.onerror = fail; // dapi.kakao.com answers 401/403 when the domain is not registered or Kakao Map is off
      s.onload = () => {
        if (typeof window.kakao?.maps?.load !== 'function') { fail(); return; }
        window.kakao.maps.load(() => {
          if (settled) return;
          try { draw(window.kakao.maps); } catch (err) { fail(); }
        });
      };
      document.head.append(s);
    }

    if (!('IntersectionObserver' in window)) { load(); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      load();
    }, { rootMargin: MAP.NEAR_MARGIN });
    io.observe(box);
  }

  /* ---------- Guestbook (spec 4-8) ---------- */

  function initGuestbook() {
    const form = document.querySelector('.gb-form');
    if (!form) return;
    const nameField = form.querySelector('#gb-name');
    const messageField = form.querySelector('#gb-message');
    const submit = form.querySelector('.gb-submit');
    const status = form.querySelector('.gb-status');
    const idleLabel = submit.textContent;

    function say(key) {
      status.classList.remove('is-shown');
      status.textContent = text(key);
      requestAnimationFrame(() => requestAnimationFrame(() => status.classList.add('is-shown')));
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const checks = [[nameField, 'gb-name-empty'], [messageField, 'gb-message-empty']];
      checks.forEach(([field]) => field.removeAttribute('aria-invalid'));
      const missing = checks.find(([field]) => !field.value.trim());
      if (missing) {
        missing[0].setAttribute('aria-invalid', 'true');
        missing[0].focus();
        say(missing[1]);
        return;
      }
      const endpoint = form.getAttribute('action');

      submit.disabled = true;
      submit.textContent = text('gb-sending');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`Guestbook endpoint responded ${res.status}`);
        form.reset();
        say('gb-success');
      } catch (err) {
        say('gb-failed');
      } finally {
        submit.disabled = false;
        submit.textContent = idleLabel;
      }
    });
  }

  /* ---------- Boot ---------- */

  const bokeh = safe('bokeh', initBokeh);
  safe('dday', initDday);
  safe('lights', initLights);
  safe('reveal', initReveal);
  safe('hero', () => initHero(bokeh));
  safe('sprigs', initSprigs);
  safe('photo-fade', initPhotoFade);
  const carousel = safe('carousel', initCarousel);
  safe('lightbox', () => initLightbox(bokeh, carousel));
  safe('bgm', initBgm);
  safe('copy', initCopyButtons);
  safe('kakao', initKakao);
  safe('venue-map', initVenueMap);
  safe('guestbook', initGuestbook);

  // Runtime switch of the OS setting: no reload, so BGM keeps playing (spec 1-6).
  onMediaChange(reducedMotion, () => {
    if (isReduced()) {
      revealAll();
      finishHero();
      bokeh?.toStatic();
    } else {
      bokeh?.toLive();
    }
  });

  // QA hook (read-only): window.__bokeh.stats()
  if (bokeh) window.__bokeh = Object.freeze({ config: BOKEH, stats: () => bokeh.stats() });
})();
