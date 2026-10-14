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
  // Guestbook (design 08 section 6, spec 4-8-1). The whole list is fetched one screen ahead, like the map,
  // FETCH entries per request (the web app's maximum), and shown PAGE entries at a time.
  const GB = Object.freeze({
    PAGE: 5, FETCH: 50, PAGE_LINKS: 5, FOLD_LINES: 3,
    TIMEOUT: 15000, NEAR_MARGIN: '100% 0px', PASSWORD_MIN: 4,
  });

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

  // Small garden lights for zones: hero, calendar, closing (spec 1, option B 2026-10-12).
  const BOKEH = Object.freeze({
    ZONES: { hero: 8, calendar: 8, closing: 8 },        // living-light slots per zone (<= 8)
    MAX_TOTAL_MOBILE: 12, MAX_TOTAL_WIDE: 16,            // wide = (min-width: 768px)
    SIZE_MIX: [[0.50, 5, 6], [0.35, 6, 7.5], [0.15, 7.5, 9]], // [share, min, max] core diameter px
    HALO: 3.6,                                           // halo radius / core radius
    RGB: { core: '255,252,248', glow: '235,203,148' },   // on_accent #FFFCF8, glow #EBCB94
    // Radial profile [radius in core radii, color, alpha]; gradient offset = radius / HALO.
    PROFILE: [[0, 'core', 1], [0.75, 'core', 1], [1.1, 'glow', 0.9], [1.6, 'glow', 0.5],
              [1.98, 'glow', 0.2], [2.88, 'glow', 0.06], [3.6, 'glow', 0]],
    LIFE: [9, 16], FADE: 1.2, GAP: [0.4, 1.6],           // s
    TWINKLE_DEPTH: 0.5, TWINKLE_PERIOD: [2.4, 4.8],      // brightness 1 <-> 0.5, s (<= 0.42 Hz)
    RISE: [0, 3], SWAY: [2, 5], SWAY_PERIOD: [6, 10],    // px/s, px, s
    BOX_GAP: 10, EXCLUDE_MARGIN: 8, TRIES: 14, STILL_AFTER: 8, RETRY: 0.4,
    FPS: 30, DPR_MAX: 2, ZONE_FADE: 600, INTRO_FADE: 1200, INTRO_DELAY: 600, SETTLE_DEBOUNCE: 100,
    STATIC_COUNT: 7, STATIC_SEED: 5, STATIC_ALPHA: 0.85, // reduced-motion still picture (hero)
  });
  const BOKEH_DPR = Math.min(window.devicePixelRatio || 1, BOKEH.DPR_MAX);

  const overlaps = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

  // Seeded PRNG: the reduced-motion picture is the same on every load at the same layout.
  function mulberry32(seed) {
    return () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // One sprite (core + halo) per core diameter rounded to 0.1px, rendered at the canvas DPR.
  const bokehSprites = new Map();
  function makeSprite(d) {
    const key = Math.round(d * 10) / 10;
    let s = bokehSprites.get(key);
    if (s) return s;
    const R = (key / 2) * BOKEH.HALO;
    const px = Math.ceil(R * 2 * BOKEH_DPR) + 2;
    const c = document.createElement('canvas');
    c.width = c.height = px;
    const ctx = c.getContext('2d');
    ctx.translate(px / 2, px / 2);
    ctx.scale(BOKEH_DPR, BOKEH_DPR);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    BOKEH.PROFILE.forEach(([k, color, a]) => g.addColorStop(k / BOKEH.HALO, `rgba(${BOKEH.RGB[color]},${a})`));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
    s = { c, size: px / BOKEH_DPR };
    bokehSprites.set(key, s);
    return s;
  }

  function pickDiameter(rng) {
    let x = rng();
    for (const [share, lo, hi] of BOKEH.SIZE_MIX) {
      if ((x -= share) <= 0) return lo + rng() * (hi - lo);
    }
    const [, lo, hi] = BOKEH.SIZE_MIX[BOKEH.SIZE_MIX.length - 1];
    return lo + rng() * (hi - lo);
  }

  // A light's whole-life path box (sway, rise, halo, half gap) must fit the canvas and miss
  // exclusions and every other living light's box. rng is seeded only for the still picture.
  function spawn(zone, preseed, rng = Math.random) {
    const { W, H } = zone;
    const rr = (a, b) => a + rng() * (b - a);
    const half = BOKEH.BOX_GAP / 2;
    for (let k = 0; k < BOKEH.TRIES; k++) {
      const d = pickDiameter(rng);
      const R = (d / 2) * BOKEH.HALO;
      const A = rr(...BOKEH.SWAY);
      const T = rr(...BOKEH.LIFE);
      const v = k >= BOKEH.STILL_AFTER ? 0 : rr(...BOKEH.RISE);
      const x0 = rr(R + A + half, W - R - A - half);
      const y0 = rr(R + v * T + half, H - R - half);
      const box = { l: x0 - A - R - half, r: x0 + A + R + half, t: y0 - v * T - R - half, b: y0 + R + half };
      if (box.l < 0 || box.r > W || box.t < 0 || box.b > H) continue;
      if (zone.excludes.some((e) => overlaps(box, e))) continue;
      if (zone.particles.some((p) => p && overlaps(box, p.box))) continue;
      return {
        x0, y0, d, R, A, v, T, box, sprite: makeSprite(d),
        P: rr(...BOKEH.SWAY_PERIOD), phi: rr(0, Math.PI * 2),
        tw: rr(...BOKEH.TWINKLE_PERIOD), tphi: rr(0, Math.PI * 2),
        age: preseed ? rr(0, T) : 0,
      };
    }
    return null;
  }

  // Fade in, hold, fade out (smoothstep over FADE), times a twinkle between 1 and 1 - TWINKLE_DEPTH.
  function brightness(p) {
    const f = BOKEH.FADE;
    const e = p.age < f ? p.age / f : p.age > p.T - f ? (p.T - p.age) / f : 1;
    const tw = 1 - BOKEH.TWINKLE_DEPTH * (0.5 - 0.5 * Math.cos((2 * Math.PI * p.age) / p.tw + p.tphi));
    return e * e * (3 - 2 * e) * tw;
  }
  const lightX = (p) => p.x0 + p.A * Math.sin((2 * Math.PI * p.age) / p.P + p.phi);
  const lightY = (p) => p.y0 - p.v * p.age;

  function drawLight(zone, sprite, x, y, alpha) {
    const s = sprite.size;
    zone.ctx.globalAlpha = alpha;
    zone.ctx.drawImage(sprite.c, x - s / 2, y - s / 2, s, s);
    zone.dirty.push([x - s / 2 - 1, y - s / 2 - 1, s + 2, s + 2]);
  }

  function clearAll(zone) {
    zone.ctx.clearRect(0, 0, zone.W, zone.H);
    zone.dirty.length = 0;
    zone.still = [];
  }

  function step(zone, dt, canSpawn) {
    const { ctx } = zone;
    zone.dirty.forEach(([x, y, w, h]) => ctx.clearRect(x, y, w, h)); // only last frame's sprites
    zone.dirty.length = 0;
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
      drawLight(zone, p.sprite, lightX(p), lightY(p), brightness(p));
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

  // Exclusion boxes in zone coordinates, before the margin. data-bokeh-exclude="text": one box per
  // rendered text line; no value: the element box. Hero only: the fixed BGM toggle where it sits at scroll 0.
  function excludeRects(zone) {
    const base = zone.el.getBoundingClientRect();
    const rects = [];
    const push = (r, dy) => rects.push({ l: r.left - base.left, r: r.right - base.left, t: r.top - base.top - dy, b: r.bottom - base.top - dy });
    const range = document.createRange();
    zone.el.querySelectorAll('[data-bokeh-exclude]').forEach((ex) => {
      const dy = pendingShift(ex);
      if (ex.dataset.bokehExclude !== 'text') { push(ex.getBoundingClientRect(), dy); return; }
      const walker = document.createTreeWalker(ex, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent.trim() || n.parentElement.closest('.sr-only')) continue;
        range.selectNodeContents(n);
        [...range.getClientRects()].forEach((r) => { if (r.width && r.height) push(r, dy); });
      }
    });
    const bgm = zone.name === 'hero' && document.querySelector('.bgm-toggle');
    if (bgm) push(bgm.getBoundingClientRect(), window.scrollY);
    return rects;
  }

  function initBokeh() {
    const els = [...document.querySelectorAll('[data-bokeh]')];
    if (!els.length || !('IntersectionObserver' in window)) return null;

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
        W: 0, H: 0, excludes: [], dirty: [], still: [],
        particles: new Array(slots).fill(null), wait: new Array(slots).fill(0),
        inBand: false, live: false, offTimer: 0, roTimer: 0, settleTimer: 0,
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
      const m = BOKEH.EXCLUDE_MARGIN;
      zone.excludes = excludeRects(zone).map((r) => ({ l: r.l - m, r: r.r + m, t: r.t - m, b: r.b + m }));
    }

    // After a layout change: drop lights whose path box now leaves the canvas or meets an exclusion.
    function dropBlocked(zone) {
      zone.particles.forEach((p, i) => {
        if (!p || (p.box.r <= zone.W && p.box.b <= zone.H && !zone.excludes.some((e) => overlaps(p.box, e)))) return;
        zone.particles[i] = null;
        zone.wait[i] = BOKEH.RETRY;
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

    // Reduced motion (spec 1-6): STATIC_COUNT still lights, same placement rules, fixed seed.
    function drawStatic(zone) {
      clearAll(zone);
      const rng = mulberry32(BOKEH.STATIC_SEED);
      const scratch = { W: zone.W, H: zone.H, excludes: zone.excludes, particles: [] };
      for (let i = 0; i < BOKEH.STATIC_COUNT * 3 && scratch.particles.length < BOKEH.STATIC_COUNT; i++) {
        const p = spawn(scratch, false, rng);
        if (p) scratch.particles.push(p);
      }
      zone.still = scratch.particles;
      zone.still.forEach((p) => drawLight(zone, p.sprite, p.x0, p.y0, BOKEH.STATIC_ALPHA));
      zone.ctx.globalAlpha = 1;
    }

    function resize(zone, force) {
      const W = zone.el.clientWidth;
      const H = zone.el.clientHeight;
      const reseed = force || W !== zone.W || Math.abs(H - zone.H) > 40;
      zone.W = W;
      zone.H = H;
      const cw = Math.round(W * BOKEH_DPR);
      const ch = Math.round(H * BOKEH_DPR);
      if (zone.canvas.width !== cw) zone.canvas.width = cw;
      if (zone.canvas.height !== ch) zone.canvas.height = ch;
      zone.ctx.setTransform(BOKEH_DPR, 0, 0, BOKEH_DPR, 0, 0);
      clearAll(zone);
      measureExcludes(zone);
      if (reseed) seed(zone);
      else dropBlocked(zone);
      if (isReduced() && zone === heroZone) drawStatic(zone);
    }

    function loop(now) {
      rafId = requestAnimationFrame(loop);
      if (now - last < frameMs) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      zones.forEach((z) => { if (z.live) step(z, dt, canSpawn); });
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

    // Boxes move with font swaps, the hero photo load and every reveal or scale-in (scroll cue).
    const remeasure = (zone) => {
      measureExcludes(zone);
      dropBlocked(zone);
      if (isReduced() && zone === heroZone) drawStatic(zone);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => zones.forEach(remeasure));
    const heroPhoto = heroZone && heroZone.el.querySelector('.hero__photo');
    if (heroPhoto && !heroPhoto.complete) heroPhoto.addEventListener('load', () => remeasure(heroZone), { once: true });
    zones.forEach((z) => z.el.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'transform' || !e.target.matches('.reveal, [data-bokeh-exclude]')) return;
      clearTimeout(z.settleTimer);
      z.settleTimer = setTimeout(() => remeasure(z), BOKEH.SETTLE_DEBOUNCE);
    }));

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
        clearAll(z);
      });
      kick();
      if (heroZone) drawStatic(heroZone);
    }

    function toLive() {
      zones.forEach((z) => {
        clearAll(z);
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
      // QA (spec 1-7): drawn squares (center +- R) of running and still lights against freshly measured exclusions.
      stats() {
        const out = {
          living: livingTotal(), zones: {}, still: 0,
          running: rafId ? zones.filter((z) => z.live).map((z) => z.name) : [],
          excludeHits: 0, pairHits: 0, minExcludeGap: null,
        };
        zones.forEach((z) => {
          out.zones[z.name] = livingIn(z);
          out.still += z.still.length;
          const lights = (z.live ? z.particles.filter(Boolean).map((p) => [lightX(p), lightY(p), p.R]) : [])
            .concat(z.still.map((p) => [p.x0, p.y0, p.R]))
            .map(([x, y, R]) => ({ l: x - R, r: x + R, t: y - R, b: y + R }));
          const raw = excludeRects(z);
          lights.forEach((a, i) => {
            raw.forEach((e) => {
              if (overlaps(a, e)) out.excludeHits++;
              const gap = Math.hypot(Math.max(e.l - a.r, a.l - e.r, 0), Math.max(e.t - a.b, a.t - e.b, 0));
              out.minExcludeGap = out.minExcludeGap === null ? gap : Math.min(out.minExcludeGap, gap);
            });
            lights.slice(i + 1).forEach((b) => { if (overlaps(a, b)) out.pairHits++; });
          });
        });
        if (out.minExcludeGap !== null) out.minExcludeGap = Math.round(out.minExcludeGap * 10) / 10;
        return out;
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

  /* ---------- Guestbook: form, public list, self-delete (design 08, spec 4-8, 4-8-1) ---------- */

  // The Apps Script web app answers 200 for everything; the outcome is the body's { ok, error }.
  // POST bodies go as text/plain: application/json would trigger a CORS preflight the web app cannot answer.
  // Resolves to the parsed body; rejects on a network error, a non-JSON reply or GB.TIMEOUT.
  async function guestbookRequest(endpoint, payload) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GB.TIMEOUT);
    const init = { credentials: 'omit', cache: 'no-store', signal: controller.signal };
    try {
      const res = payload.action === 'list'
        ? await fetch(`${endpoint}?${new URLSearchParams(payload)}`, init)
        : await fetch(endpoint, { ...init, method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Guestbook endpoint responded ${res.status}`);
      const data = await res.json();
      if (!data || typeof data !== 'object') throw new Error('Guestbook endpoint sent no object');
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function initGuestbook() {
    const section = document.getElementById('guestbook');
    const form = section?.querySelector('.gb-form');
    const board = section?.querySelector('.gb-board');
    const endpoint = metaContent('meta[name="guestbook-endpoint"]');
    if (!form || !board || !endpoint) return;
    const fields = form.elements;
    const submit = form.querySelector('.gb-submit');
    const status = form.querySelector('.gb-status');
    const idleLabel = submit.textContent;
    const title = board.querySelector('.gb-list-title');
    const state = board.querySelector('.gb-list-state');
    const stateText = state.querySelector('.gb-list-state__text');
    const retry = state.querySelector('.gb-list-retry');
    const list = board.querySelector('.gb-list');
    const pager = board.querySelector('.gb-pager');
    const pages = pager.querySelector('.gb-pager__pages');
    const prev = pager.querySelector('.gb-pager__prev');
    const next = pager.querySelector('.gb-pager__next');
    const pageStatus = board.querySelector('.gb-page-status');
    const foldTemplate = board.querySelector('.gb-fold-template').content.firstElementChild;
    const CREATE_ERRORS = { rate_limited: 'gb-error-rate-limited', duplicate: 'gb-error-duplicate', closed: 'gb-error-closed' };
    const DELETE_ERRORS = { wrong_password: 'gb-error-wrong-password', too_many_attempts: 'gb-error-too-many-attempts' };

    let entries = [];          // the whole fetched list, newest first; pages are slices of it
    let page = 1;
    let listSeq = 0;           // bumped by every full load; replies to older loads are dropped
    let stateKey = '';
    let openDelete = null;     // { item, toggle, panel }: at most one panel is open
    let panelCount = 0;
    let itemCount = 0;
    let pageStatusTimer = 0;
    let formShownAt = 0;       // elapsed (bot check) counts from the form's first appearance on screen
    const foldTimers = new WeakMap();

    const request = (payload) => guestbookRequest(endpoint, payload).catch(() => null);
    const el = (tag, className, content) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (content !== undefined) node.textContent = content; // guest text is never parsed as HTML
      return node;
    };
    // A focused button that turns disabled leaves focus on <body>; put it back on that control.
    const keepFocus = (control) => {
      if (!document.activeElement || document.activeElement === document.body) control.focus({ preventScroll: true });
    };

    function say(key) {
      status.classList.remove('is-shown');
      status.textContent = text(key);
      requestAnimationFrame(() => requestAnimationFrame(() => status.classList.add('is-shown')));
    }

    function setState(key, withRetry = false) {
      stateKey = key;
      state.hidden = true;
      if (!key) return;
      void state.offsetWidth; // restarts the fade-in when one message replaces another
      stateText.replaceChildren(richText(key));
      retry.hidden = !withRetry;
      state.hidden = false;
    }

    // "2026. 12. 1." in KST on screen; the gb-date-sr sentence for screen readers (they read the dots).
    function dateFor(iso) {
      const t = Date.parse(iso);
      if (Number.isNaN(t)) return null;
      const kst = new Date(t + 9 * 3600e3);
      const [y, m, d] = [kst.getUTCFullYear(), kst.getUTCMonth() + 1, kst.getUTCDate()];
      const time = el('time', 'gb-item__date');
      time.dateTime = iso;
      const visible = el('span', null, `${y}. ${m}. ${d}.`);
      visible.setAttribute('aria-hidden', 'true');
      time.append(visible, el('span', 'sr-only', text('gb-date-sr', { y, m, d })));
      return time;
    }

    // Entries without an id cannot be deleted or told apart, so they are not shown.
    const entryFrom = (e) => (e && typeof e.id === 'string' && e.id
      ? { id: e.id, name: String(e.name ?? ''), message: String(e.message ?? ''), createdAt: String(e.createdAt ?? '') }
      : null);

    // Reading order: name, date, message, fold arrow, then the delete button (placed top right by CSS).
    function itemFor(entry) {
      const item = el('li', 'gb-item');
      item.tabIndex = -1;
      item.dataset.id = entry.id;
      const head = el('div', 'gb-item__head');
      head.append(el('p', 'gb-item__name', entry.name));
      const date = dateFor(entry.createdAt);
      if (date) head.append(date);
      const message = el('p', 'gb-item__message', entry.message);
      message.id = `gb-message-${++itemCount}`;
      const fold = foldTemplate.cloneNode(true);
      fold.setAttribute('aria-controls', message.id);
      fold.setAttribute('aria-label', text('gb-expand-aria', { name: entry.name }));
      const toggle = el('button', 'gb-item__delete', text('gb-delete'));
      toggle.type = 'button';
      toggle.setAttribute('aria-label', text('gb-delete-aria', { name: entry.name }));
      toggle.setAttribute('aria-expanded', 'false');
      item.append(head, message, fold, toggle);
      return item;
    }

    /* Long message fold (spec 4-8-1): only text longer than GB.FOLD_LINES lines folds */

    function labelFold(item, open) {
      const fold = item.querySelector('.gb-fold');
      fold.setAttribute('aria-expanded', String(open));
      fold.setAttribute('aria-label', text(open ? 'gb-collapse-aria' : 'gb-expand-aria', { name: item.querySelector('.gb-item__name').textContent }));
    }

    // Re-measured on every render, after fonts load and when the list width changes.
    // An open message stays open; one that now fits loses the fold.
    function measureFold(item) {
      const message = item.querySelector('.gb-item__message');
      const fold = item.querySelector('.gb-fold');
      const limit = parseFloat(getComputedStyle(message).lineHeight) * GB.FOLD_LINES;
      const foldable = message.scrollHeight > limit + 1;
      if (foldable === !fold.hidden) return;
      fold.hidden = !foldable;
      message.classList.toggle('is-foldable', foldable);
      if (foldable) return;
      clearTimeout(foldTimers.get(message));
      message.classList.remove('is-open');
      message.style.height = '';
      labelFold(item, false);
    }
    const measureFolds = () => list.querySelectorAll('.gb-item').forEach(measureFold);

    // Height moves between the CSS 3-line clamp and the measured text height (the one height animation,
    // user decision). A press during the move turns it around from the current height.
    function toggleFold(item) {
      const message = item.querySelector('.gb-item__message');
      const open = !message.classList.contains('is-open');
      clearTimeout(foldTimers.get(message));
      if (open) {
        message.classList.add('is-open');
        message.style.height = `${message.scrollHeight}px`;
        // A timer, not transitionend: a 0ms transition (reduced motion) fires no event.
        foldTimers.set(message, setTimeout(() => { message.style.height = 'auto'; }, token('--dur-snap') + 50));
      } else {
        // Read before folding: after a long read the item top is above the screen and would vanish with it.
        alignToSafeLine(item);
        message.style.height = `${message.getBoundingClientRect().height}px`;
        void message.offsetHeight;
        message.classList.remove('is-open');
        message.style.height = '';
      }
      labelFold(item, open);
    }

    /* Pages */

    const pageCount = () => Math.max(1, Math.ceil(entries.length / GB.PAGE));

    // Spec 4-8-1 safe line: the element's scroll-margin-top, just below the fixed BGM toggle.
    // Measured after the DOM change; scrolls (instantly) only when the top is above the line.
    function alignToSafeLine(target) {
      const line = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      if (target.getBoundingClientRect().top < line) target.scrollIntoView({ block: 'start' });
    }

    // Up to GB.PAGE_LINKS numbers, centred on the current page where the ends allow.
    function renderPager() {
      const total = pageCount();
      pager.hidden = total < 2;
      const first = clamp(page - Math.floor(GB.PAGE_LINKS / 2), 1, Math.max(1, total - GB.PAGE_LINKS + 1));
      const numbers = [];
      for (let n = first; n <= Math.min(total, first + GB.PAGE_LINKS - 1); n++) {
        const button = el('button', 'gb-pager__page', String(n));
        button.type = 'button';
        button.dataset.page = n;
        button.setAttribute('aria-label', text('gb-page-number-aria', { n }));
        if (n === page) button.setAttribute('aria-current', 'page');
        numbers.push(button);
      }
      pages.replaceChildren(...numbers);
      prev.setAttribute('aria-disabled', String(page === 1));
      next.setAttribute('aria-disabled', String(page === total));
    }

    // Shows page n. Items already on screen stay in place with their fold, panel and focus; items being
    // deleted stay until their fade ends. fade: true fades every item added here, an entry id only that one.
    function renderPage(n, fade = true) {
      page = clamp(n, 1, pageCount());
      // Only a turn says which page this is; any other render (new entry, delete, reload) must not leave
      // an old "page n of m" in the hidden status line.
      clearTimeout(pageStatusTimer);
      pageStatus.textContent = '';
      const slice = entries.slice((page - 1) * GB.PAGE, page * GB.PAGE);
      const ids = new Set(slice.map((e) => e.id));
      if (openDelete && !ids.has(openDelete.item.dataset.id)) closeDelete(false);
      [...list.children].forEach((li) => {
        if (!ids.has(li.dataset.id) && !li.classList.contains('is-leaving')) li.remove();
      });
      let at = list.firstElementChild;
      slice.forEach((entry) => {
        while (at?.classList.contains('is-leaving')) at = at.nextElementSibling;
        if (at?.dataset.id === entry.id) {
          at = at.nextElementSibling;
          return;
        }
        const item = itemFor(entry);
        item.classList.toggle('is-new', fade === true || fade === entry.id);
        list.insertBefore(item, at);
        measureFold(item);
      });
      renderPager();
      document.fonts?.ready.then(measureFolds);
    }

    // Page turn (spec 4-8-1): the new page fades in, then the list title is aligned and focused so the
    // next read starts at the first entry; the status line says which page this is.
    function turnPage(n) {
      renderPage(n);
      alignToSafeLine(title);
      title.focus({ preventScroll: true });
      pageStatusTimer = setTimeout(() => { pageStatus.textContent = text('gb-page-status', { n: page, total: pageCount() }); }, 50);
    }

    const validPage = (reply) => reply && reply.ok === true && Array.isArray(reply.entries);

    // The whole list in GB.FETCH-sized requests, then page 1 (also the retry and the reload after
    // "duplicate"). Any failed request fails the load. The web app gives no total, so this runs until
    // nextCursor is null; a cursor that does not move forward also ends it.
    async function loadAll() {
      const seq = ++listSeq;
      setState('gb-list-loading');
      const fetched = [];
      const ids = new Set();     // a write between two requests shifts the list and repeats an entry
      let cursor = 0;
      while (cursor !== null) {
        const reply = await request({ action: 'list', limit: GB.FETCH, cursor });
        if (seq !== listSeq) return false;
        if (!validPage(reply)) {
          setState('gb-list-failed', true);
          return false;
        }
        reply.entries.forEach((e) => {
          const entry = entryFrom(e);
          if (!entry || ids.has(entry.id)) return;
          ids.add(entry.id);
          fetched.push(entry);
        });
        cursor = Number.isInteger(reply.nextCursor) && reply.nextCursor > cursor ? reply.nextCursor : null;
      }
      closeDelete(false);
      entries = fetched;
      list.replaceChildren();
      renderPage(1);
      setState(entries.length ? '' : 'gb-list-empty');
      return true;
    }

    /* New entry */

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = fields.password.value;
      const checks = [
        [fields.name, !fields.name.value.trim() && 'gb-name-empty'],
        [fields.message, !fields.message.value.trim() && 'gb-message-empty'],
        [fields.password, !password ? 'gb-password-empty' : password.length < GB.PASSWORD_MIN && 'gb-password-short'],
      ];
      checks.forEach(([field]) => field.removeAttribute('aria-invalid'));
      const invalid = checks.find(([, key]) => key);
      if (invalid) {
        invalid[0].setAttribute('aria-invalid', 'true');
        invalid[0].focus();
        say(invalid[1]);
        return;
      }

      submit.disabled = true;
      submit.textContent = text('gb-sending');
      const reply = await request({
        action: 'create',
        name: fields.name.value,
        message: fields.message.value,
        password,
        website: fields.gb_extra.value,
        elapsed: Math.round(performance.now() - formShownAt),
      });
      submit.disabled = false;
      submit.textContent = idleLabel;
      keepFocus(submit);

      if (!reply || reply.ok !== true) {
        say(CREATE_ERRORS[reply?.error] || 'gb-failed');
        // The first send may have been saved with its reply lost; the list shows whether it was.
        if (reply?.error === 'duplicate') loadAll();
        return;
      }
      form.reset();
      say('gb-success');
      // entry is null when the web app quietly dropped the post as a bot (trap field or under 3 s).
      const entry = entryFrom(reply.entry);
      if (!entry || entries.some((e) => e.id === entry.id)) return;
      entries.unshift(entry);
      renderPage(1, entry.id); // only the new entry fades; no scroll, focus stays on the button
      if (stateKey === 'gb-list-empty') setState('');
    });

    /* Self-delete: one inline panel per entry, built on first open */

    function panelFor(item, toggle) {
      const n = ++panelCount;
      const panel = el('form', 'gb-del');
      panel.noValidate = true;
      panel.id = `gb-del-${n}`;
      const label = el('label', 'gb-label', text('gb-delete-password-label'));
      label.htmlFor = `gb-del-password-${n}`;
      const input = el('input', 'gb-input');
      Object.assign(input, { type: 'password', id: label.htmlFor, name: 'password', autocomplete: 'current-password', maxLength: 20 });
      const error = el('p', 'gb-del__error');
      error.id = `gb-del-error-${n}`;
      input.setAttribute('aria-describedby', error.id);
      const cancel = el('button', 'btn btn--secondary gb-del__cancel', text('gb-delete-cancel'));
      cancel.type = 'button';
      const confirm = el('button', 'btn btn--secondary gb-del__confirm', text('gb-delete-confirm'));
      confirm.type = 'submit';
      const actions = el('div', 'gb-del__actions');
      actions.append(cancel, confirm);
      panel.append(label, input, error, actions);
      item.append(panel);
      toggle.setAttribute('aria-controls', panel.id);
      return panel;
    }

    function showDeleteError(panel, key, invalid) {
      const input = panel.elements.password;
      const error = panel.querySelector('.gb-del__error');
      if (invalid) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      error.textContent = '';
      void error.offsetWidth; // the same message again still fades in
      error.textContent = text(key);
      if (openDelete?.panel !== panel) return;
      // Submitting with Enter leaves focus in the field, and a changed description alone is not read out.
      if (document.activeElement === input) announce(error.textContent);
      else input.focus();
    }

    // Closing is instant (spec 4-8-1): a fade-out would leave an empty band that then snaps shut.
    function closeDelete(refocus) {
      if (!openDelete) return;
      const { toggle, panel } = openDelete;
      openDelete = null;
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (refocus) toggle.focus();
    }

    function toggleDelete(item) {
      if (openDelete?.item === item) {
        closeDelete(true);
        return;
      }
      closeDelete(false);
      const toggle = item.querySelector('.gb-item__delete');
      const panel = item.querySelector('.gb-del') || panelFor(item, toggle);
      panel.reset();
      panel.elements.password.removeAttribute('aria-invalid');
      panel.querySelector('.gb-del__error').textContent = '';
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      openDelete = { item, toggle, panel };
      panel.elements.password.focus();
    }

    // Fades the entry out, then drops it. The page refills from the next one at once (only the pulled-in
    // entry fades) and focus moves to the next entry, or the list title after the last. A page left empty
    // turns back to the previous one once the fade ends.
    function removeItem(item, key, done) {
      if (openDelete?.item === item) openDelete = null;
      entries = entries.filter((e) => e.id !== item.dataset.id);
      item.inert = true;
      item.classList.add('is-leaving');
      const emptied = page > pageCount();
      if (emptied) {
        title.focus({ preventScroll: true });
      } else {
        renderPage(page);
        let after = item.nextElementSibling;
        while (after && after.classList.contains('is-leaving')) after = after.nextElementSibling;
        (after || title).focus();
      }
      setTimeout(() => {
        item.remove();
        if (emptied && page > pageCount()) turnPage(page - 1);
        else if (!entries.length) setState('gb-list-empty');
      }, token('--dur-fast'));
      notify(text(key), done);
    }

    async function confirmDelete(item) {
      const panel = item.querySelector('.gb-del');
      const password = panel.elements.password.value;
      // Shorter than the minimum can never match, so it is not sent (copy sheet guestbook_delete).
      if (!password) { showDeleteError(panel, 'gb-delete-password-empty', true); return; }
      if (password.length < GB.PASSWORD_MIN) { showDeleteError(panel, 'gb-error-wrong-password', true); return; }

      const buttons = panel.querySelectorAll('button');
      const confirm = panel.querySelector('.gb-del__confirm');
      const confirmLabel = confirm.textContent;
      buttons.forEach((b) => { b.disabled = true; });
      confirm.textContent = text('gb-deleting');
      const reply = await request({ action: 'delete', id: item.dataset.id, password });
      buttons.forEach((b) => { b.disabled = false; });
      confirm.textContent = confirmLabel;
      if (!item.isConnected) {
        // The page turned or the list reloaded meanwhile: still forget an entry that is gone.
        if (reply?.ok === true || reply?.error === 'not_found') {
          entries = entries.filter((e) => e.id !== item.dataset.id);
          renderPage(page);
          if (!entries.length) setState('gb-list-empty');
          notify(text(reply.ok ? 'gb-delete-success' : 'gb-error-not-found'), reply.ok === true);
        }
        return;
      }

      if (reply?.ok === true) {
        removeItem(item, 'gb-delete-success', true);
      } else if (reply?.error === 'not_found') {
        // Already deleted by the guest or hidden by the couple in the sheet.
        removeItem(item, 'gb-error-not-found', false);
      } else {
        const key = DELETE_ERRORS[reply?.error];
        if (key) panel.elements.password.value = '';
        showDeleteError(panel, key || 'gb-delete-failed', Boolean(key));
      }
    }

    list.addEventListener('click', (e) => {
      const toggle = e.target.closest('.gb-item__delete');
      if (toggle) toggleDelete(toggle.closest('.gb-item'));
      else if (e.target.closest('.gb-del__cancel')) closeDelete(true);
      else if (e.target.closest('.gb-fold')) toggleFold(e.target.closest('.gb-item'));
      // The text block is a pointer shortcut for the arrow; selecting text (drag, double click) is not a press.
      else if (e.target.closest('.gb-item__message.is-foldable') && e.detail < 2 && window.getSelection()?.isCollapsed !== false) {
        toggleFold(e.target.closest('.gb-item'));
      }
    });
    list.addEventListener('submit', (e) => {
      e.preventDefault();
      confirmDelete(e.target.closest('.gb-item'));
    });
    list.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openDelete?.panel.contains(e.target)) closeDelete(true);
    });
    pager.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button || button.getAttribute('aria-disabled') === 'true' || button.hasAttribute('aria-current')) return;
      turnPage(button === prev ? page - 1 : button === next ? page + 1 : Number(button.dataset.page));
    });
    retry.addEventListener('click', async () => {
      title.focus(); // the retry button hides while loading
      if (!(await loadAll())) retry.focus();
    });
    // Only a width change can change how many lines a message takes; a fold moving changes the height.
    if ('ResizeObserver' in window) {
      let listWidth = 0;
      new ResizeObserver(([entry]) => {
        if (entry.contentRect.width === listWidth) return;
        listWidth = entry.contentRect.width;
        measureFolds();
      }).observe(list);
    }

    // No request to the web app until the section is about one screen away (spec: lazy, like the venue map).
    if ('IntersectionObserver' in window) {
      const near = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        loadAll();
      }, { rootMargin: GB.NEAR_MARGIN });
      near.observe(section);
      const seen = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        seen.disconnect();
        formShownAt = performance.now();
      });
      seen.observe(form);
    } else {
      formShownAt = performance.now();
      loadAll();
    }

    form.hidden = false;
    board.hidden = false;
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
