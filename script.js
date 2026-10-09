(() => {
  'use strict';

  // Values still shaped like [[TODO:...]] are treated as "not configured".
  const CONFIG = {
    kakaoJsKey: '[[TODO:KAKAO_JS_KEY]]',
    siteUrl: '[[TODO:SITE_URL]]',
    kakaoSdkUrl: 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js',
  };

  const HERO_DECODE_TIMEOUT = 1500;
  const HERO_TOP_DELAY = 400;
  const HERO_BOTTOM_DELAY = 700;
  const COPY_LABEL_HOLD = 2000;
  const BGM_VOLUME = 0.6;
  const BGM_FADE_IN = 1500;
  const BGM_FADE_OUT = 400;

  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const isPlaceholder = (value) => !value || value.startsWith('[[TODO:');
  const delay = (ms) => (reducedMotion.matches ? 0 : ms);

  // Reads a duration token from :root so CSS and JS share one value.
  const token = (name) =>
    reducedMotion.matches ? 0 : parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const statusRegion = document.getElementById('copy-status');
  function announce(message) {
    statusRegion.textContent = '';
    setTimeout(() => { statusRegion.textContent = message; }, 50);
  }

  function shareUrl() {
    if (!isPlaceholder(CONFIG.siteUrl)) return CONFIG.siteUrl.replace(/\/?$/, '/');
    return location.href.split('#')[0];
  }

  /* ---------- Hero settle + text reveal (spec 2-1, 3-8) ---------- */

  function initHero() {
    const photo = document.querySelector('.hero__photo');
    const [topBlock, bottomBlock] = document.querySelectorAll('.hero-reveal');
    const scrollHint = document.querySelector('.hero__scroll');
    let started = false;

    function start(withSettle) {
      if (started) return;
      started = true;
      if (withSettle && !reducedMotion.matches) {
        photo.style.willChange = 'transform';
        photo.addEventListener('transitionend', () => { photo.style.willChange = ''; }, { once: true });
        photo.classList.add('is-settling');
      } else {
        photo.classList.add('is-static');
      }
      setTimeout(() => topBlock.classList.add('is-visible'), delay(HERO_TOP_DELAY));
      setTimeout(() => {
        bottomBlock.classList.add('is-visible');
        scrollHint.classList.add('is-visible');
      }, delay(HERO_BOTTOM_DELAY));
    }

    if (reducedMotion.matches) {
      start(false);
    } else {
      // A photo that decodes late would visibly zoom out on arrival; show it static instead.
      const fallback = setTimeout(() => start(false), HERO_DECODE_TIMEOUT);
      const decoded = typeof photo.decode === 'function' ? photo.decode() : Promise.resolve();
      decoded.then(
        () => { clearTimeout(fallback); start(true); },
        () => { clearTimeout(fallback); start(false); },
      );
      reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) start(false);
      });
    }

    function hideHintOnScroll() {
      if (window.scrollY <= 24) return;
      scrollHint.classList.add('is-hidden');
      window.removeEventListener('scroll', hideHintOnScroll);
    }
    window.addEventListener('scroll', hideHintOnScroll, { passive: true });
  }

  /* ---------- Section reveal (spec 2-0) ---------- */

  function initReveal() {
    const sections = document.querySelectorAll('.section');
    const show = (section) =>
      section.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));

    if (!('IntersectionObserver' in window)) {
      sections.forEach(show);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- D-day (spec 3-5) ---------- */

  function initDday() {
    const box = document.getElementById('dday');
    const count = document.getElementById('dday-count');
    const message = document.getElementById('dday-message');
    const [year, month, day] = box.dataset.weddingDate.split('-').map(Number);
    const weddingUtc = Date.UTC(year, month - 1, day);

    function render() {
      const kstNow = new Date(Date.now() + 9 * 3600e3);
      const todayUtc = Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate());
      const days = Math.round((weddingUtc - todayUtc) / 864e5);

      count.hidden = days < 0;
      if (days > 0) {
        count.textContent = `D-${days}`;
        message.textContent = `인혁 · 유민의 결혼식이 ${days}일 남았습니다.`;
      } else if (days === 0) {
        count.textContent = 'D-DAY';
        message.textContent = '오늘, 인혁 · 유민이 부부가 됩니다.';
      } else {
        message.textContent = '인혁 · 유민의 결혼식에 함께해 주셔서 감사합니다.';
      }
      box.hidden = false;
    }

    render();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') render();
    });
  }

  /* ---------- Copy buttons (spec 3-3) ---------- */

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.append(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        return copied;
      } catch {
        return false;
      }
    }
  }

  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach((button) => {
      const labels = button.querySelectorAll('.copy-btn__label');
      const setLabel = (state) =>
        labels.forEach((label) => label.classList.toggle('is-active', label.dataset.state === state));
      let resetTimer = 0;

      button.addEventListener('click', async () => {
        const target = button.dataset.copyTarget && document.querySelector(button.dataset.copyTarget);
        const text = button.hasAttribute('data-copy-url') ? shareUrl() : target.textContent.trim();
        const copied = await copyText(text);

        setLabel(copied ? 'done' : 'fail');
        if (copied) {
          announce(button.dataset.status);
          navigator.vibrate?.(10);
        } else {
          announce('복사하지 못했습니다');
          if (target) window.getSelection()?.selectAllChildren(target);
        }
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => setLabel('idle'), COPY_LABEL_HOLD);
      });
    });
  }

  /* ---------- Music toggle (spec 3-4) ---------- */

  function initMusic() {
    const button = document.getElementById('music-toggle');
    const audio = document.getElementById('bgm');
    // iOS Safari ignores writes to volume, so fades are skipped there.
    const canFadeVolume = (() => {
      const probe = document.createElement('audio');
      probe.volume = 0.5;
      return probe.volume === 0.5;
    })();
    let fadeFrame = 0;
    let resumeWhenVisible = false;

    function fadeVolume(to, duration, onDone) {
      cancelAnimationFrame(fadeFrame);
      if (!canFadeVolume || duration === 0) {
        if (canFadeVolume) audio.volume = to;
        onDone?.();
        return;
      }
      const from = audio.volume;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        audio.volume = from + (to - from) * progress;
        if (progress < 1) fadeFrame = requestAnimationFrame(step);
        else onDone?.();
      };
      fadeFrame = requestAnimationFrame(step);
    }

    function showOff() {
      button.setAttribute('aria-pressed', 'false');
      button.removeAttribute('aria-busy');
      button.classList.remove('is-playing');
    }

    async function turnOn() {
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-busy', 'true');
      if (audio.paused && canFadeVolume) audio.volume = 0;
      try {
        await audio.play();
        fadeVolume(BGM_VOLUME, BGM_FADE_IN);
      } catch {
        showOff();
      }
    }

    function turnOff() {
      showOff();
      fadeVolume(0, BGM_FADE_OUT, () => audio.pause());
    }

    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') turnOff();
      else turnOn();
    });

    audio.addEventListener('playing', () => {
      button.removeAttribute('aria-busy');
      if (button.getAttribute('aria-pressed') === 'true') button.classList.add('is-playing');
    });
    audio.addEventListener('pause', () => button.classList.remove('is-playing'));

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (!audio.paused && button.getAttribute('aria-pressed') === 'true') {
          resumeWhenVisible = true;
          cancelAnimationFrame(fadeFrame);
          audio.pause();
        }
      } else if (resumeWhenVisible) {
        resumeWhenVisible = false;
        audio.play().catch(showOff);
      }
    });
  }

  /* ---------- Lightbox: swipe, pinch zoom, double-tap (spec 3-2) ---------- */

  function createLightbox(items) {
    const dialog = document.getElementById('lightbox');
    const stage = document.getElementById('lightbox-stage');
    const track = document.getElementById('lightbox-track');
    const closeButton = document.getElementById('lightbox-close');
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');
    const counter = document.getElementById('lightbox-counter');
    const total = items.length;

    const SWIPE_DISTANCE = 50;
    const SWIPE_VELOCITY = 0.3;
    const DISMISS_DISTANCE = 80;
    const DISMISS_FADE_RANGE = 400;
    const DISMISS_MIN_OPACITY = 0.4;
    const EDGE_RESISTANCE = 0.3;
    const AXIS_LOCK_DISTANCE = 8;
    const TAP_MAX_MOVE = 10;
    const TAP_MAX_TIME = 300;
    const DOUBLE_TAP_GAP = 300;
    const MIN_SCALE = 1;
    const MAX_SCALE = 3;
    const PINCH_UNDERSHOOT = 0.8;
    const DOUBLE_TAP_SCALE = 2;
    const KEY_ZOOM_STEP = 1.5;

    const slides = items.map((item) => {
      const slide = document.createElement('div');
      slide.className = 'lightbox__slide';
      const img = document.createElement('img');
      img.dataset.src = item.dataset.full;
      img.width = Number(item.dataset.fullW);
      img.height = Number(item.dataset.fullH);
      img.alt = item.dataset.desc;
      img.decoding = 'async';
      img.draggable = false;
      img.addEventListener('load', () => img.classList.add('is-loaded'));
      slide.append(img);
      track.append(slide);
      return { slide, img };
    });

    let index = 0;
    let isOpen = false;
    let opener = null;
    let zoom = { scale: 1, x: 0, y: 0 };
    const pointers = new Map();
    let gesture = null;
    let lastTap = { time: 0, x: 0, y: 0 };

    const currentImg = () => slides[index].img;
    const stageWidth = () => stage.clientWidth;

    function setTrack(offset, duration) {
      track.style.transition = duration ? `transform ${duration}ms var(--ease-standard)` : 'none';
      track.style.transform = `translate3d(${-index * stageWidth() + offset}px, 0, 0)`;
    }

    function applyZoom(duration) {
      const img = currentImg();
      img.style.transition = duration
        ? `transform ${duration}ms var(--ease-standard), opacity var(--dur-base) var(--ease-out)`
        : 'opacity var(--dur-base) var(--ease-out)';
      const identity = zoom.scale === 1 && zoom.x === 0 && zoom.y === 0;
      img.style.transform = identity ? '' : `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`;
    }

    function resetZoom(slideIndex) {
      const { img } = slides[slideIndex];
      img.style.transition = '';
      img.style.transform = '';
      if (slideIndex === index) zoom = { scale: 1, x: 0, y: 0 };
    }

    // Layout box of the image before its transform, in stage coordinates.
    function baseRect() {
      const img = currentImg();
      return { left: img.offsetLeft, top: img.offsetTop, width: img.offsetWidth, height: img.offsetHeight };
    }

    function clampPan() {
      const base = baseRect();
      const fit = (offset, start, size, viewport) => {
        const scaled = size * zoom.scale;
        if (scaled <= viewport) return (viewport - scaled) / 2 - start;
        return clamp(offset, viewport - start - scaled, -start);
      };
      zoom.x = fit(zoom.x, base.left, base.width, stage.clientWidth);
      zoom.y = fit(zoom.y, base.top, base.height, stage.clientHeight);
    }

    // Changes scale while keeping the stage point (px, py) fixed on screen.
    function zoomAround(scale, px, py, duration) {
      const base = baseRect();
      const imageX = (px - base.left - zoom.x) / zoom.scale;
      const imageY = (py - base.top - zoom.y) / zoom.scale;
      zoom.scale = scale;
      zoom.x = px - base.left - scale * imageX;
      zoom.y = py - base.top - scale * imageY;
      if (scale === MIN_SCALE) zoom = { scale: 1, x: 0, y: 0 };
      else clampPan();
      applyZoom(duration);
    }

    function loadAround(center) {
      for (let i = center - 1; i <= center + 1; i += 1) {
        const slide = slides[i];
        if (slide && !slide.img.getAttribute('src')) slide.img.src = slide.img.dataset.src;
      }
    }

    function updateControls() {
      counter.textContent = `${index + 1} / ${total}`;
      prevButton.disabled = index === 0;
      nextButton.disabled = index === total - 1;
      if (document.activeElement?.disabled) {
        (prevButton.disabled ? nextButton : prevButton).focus();
      }
    }

    function go(targetIndex, animate = true) {
      if (targetIndex < 0 || targetIndex >= total) {
        setTrack(0, animate ? token('--dur-snap') : 0);
        return;
      }
      if (targetIndex !== index) resetZoom(index);
      index = targetIndex;
      zoom = { scale: 1, x: 0, y: 0 };
      loadAround(index);
      setTrack(0, animate ? token('--dur-snap') : 0);
      updateControls();
    }

    function open(startIndex, openerElement) {
      opener = openerElement;
      isOpen = true;
      dialog.hidden = false;
      dialog.classList.remove('is-closing');
      dialog.style.removeProperty('--backdrop-opacity');
      root.style.overflow = 'hidden';
      resetZoom(index);
      index = startIndex;
      go(startIndex, false);
      void dialog.offsetWidth;
      dialog.classList.add('is-open');
      closeButton.focus({ preventScroll: true });
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      pointers.clear();
      gesture = null;
      document.removeEventListener('keydown', onKeydown);
      dialog.classList.remove('is-open', 'is-dragging');
      dialog.classList.add('is-closing');
      setTimeout(() => {
        dialog.hidden = true;
        dialog.classList.remove('is-closing');
        slides[index].slide.style.transition = '';
        slides[index].slide.style.transform = '';
        resetZoom(index);
        root.style.overflow = '';
        opener?.focus({ preventScroll: true });
      }, token('--dur-short'));
    }

    function onKeydown(event) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          close();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          go(index - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          go(index + 1);
          break;
        case '+':
        case '=':
          zoomAround(clamp(zoom.scale * KEY_ZOOM_STEP, MIN_SCALE, MAX_SCALE),
            stage.clientWidth / 2, stage.clientHeight / 2, token('--dur-modal'));
          break;
        case '-':
          zoomAround(clamp(zoom.scale / KEY_ZOOM_STEP, MIN_SCALE, MAX_SCALE),
            stage.clientWidth / 2, stage.clientHeight / 2, token('--dur-modal'));
          break;
        case 'Tab': {
          const focusables = [closeButton, prevButton, nextButton].filter((el) => !el.disabled);
          const current = focusables.indexOf(document.activeElement);
          const step = event.shiftKey ? -1 : 1;
          const next = current === -1 ? 0 : (current + step + focusables.length) % focusables.length;
          event.preventDefault();
          focusables[next].focus();
          break;
        }
        default:
          break;
      }
    }

    /* Pointer gestures */

    function stagePoint(event) {
      const rect = stage.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function twoPointers() {
      const [a, b] = [...pointers.values()];
      return {
        distance: Math.hypot(b.x - a.x, b.y - a.y),
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
    }

    function settleSlideOffset() {
      const duration = token('--dur-modal');
      const { slide } = slides[index];
      slide.style.transition = duration ? `transform ${duration}ms var(--ease-standard)` : '';
      slide.style.transform = '';
      dialog.classList.remove('is-dragging');
      dialog.style.removeProperty('--backdrop-opacity');
      track.style.willChange = '';
    }

    function beginSingle(point) {
      const now = performance.now();
      gesture = {
        type: zoom.scale > 1 ? 'pan' : 'pending',
        start: point,
        last: point,
        startTime: now,
        samples: [{ x: point.x, time: now }],
        origin: { ...zoom },
        moved: false,
      };
    }

    function beginPinch() {
      if (gesture && (gesture.type === 'swipe' || gesture.type === 'dismiss')) {
        setTrack(0, 0);
        settleSlideOffset();
      }
      const { distance, mid } = twoPointers();
      const base = baseRect();
      gesture = {
        type: 'pinch',
        startDistance: distance || 1,
        // Image-space point under the initial midpoint stays under the fingers.
        anchor: {
          x: (mid.x - base.left - zoom.x) / zoom.scale,
          y: (mid.y - base.top - zoom.y) / zoom.scale,
        },
        origin: { ...zoom },
        base,
      };
    }

    function onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      stage.setPointerCapture(event.pointerId);
      const point = stagePoint(event);
      pointers.set(event.pointerId, point);
      if (pointers.size === 1) beginSingle(point);
      else if (pointers.size === 2) beginPinch();
    }

    function onPointerMove(event) {
      if (!pointers.has(event.pointerId) || !gesture) return;
      const point = stagePoint(event);
      pointers.set(event.pointerId, point);

      if (gesture.type === 'pinch') {
        if (pointers.size < 2) return;
        const { distance, mid } = twoPointers();
        const scale = clamp(gesture.origin.scale * (distance / gesture.startDistance), PINCH_UNDERSHOOT, MAX_SCALE);
        zoom.scale = scale;
        zoom.x = mid.x - gesture.base.left - scale * gesture.anchor.x;
        zoom.y = mid.y - gesture.base.top - scale * gesture.anchor.y;
        applyZoom(0);
        return;
      }

      const dx = point.x - gesture.start.x;
      const dy = point.y - gesture.start.y;
      gesture.last = point;
      if (Math.hypot(dx, dy) > TAP_MAX_MOVE) gesture.moved = true;
      const now = performance.now();
      gesture.samples.push({ x: point.x, time: now });
      while (gesture.samples.length > 2 && now - gesture.samples[0].time > 100) gesture.samples.shift();

      if (gesture.type === 'pan') {
        zoom.x = gesture.origin.x + dx;
        zoom.y = gesture.origin.y + dy;
        clampPan();
        applyZoom(0);
        return;
      }

      if (gesture.type === 'pending') {
        if (Math.hypot(dx, dy) < AXIS_LOCK_DISTANCE) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          gesture.type = 'swipe';
          track.style.willChange = 'transform';
        } else if (dy > 0) {
          gesture.type = 'dismiss';
          dialog.classList.add('is-dragging');
          slides[index].slide.style.transition = 'none';
        } else {
          gesture.type = 'none';
        }
      }

      if (gesture.type === 'swipe') {
        const atEdge = (index === 0 && dx > 0) || (index === total - 1 && dx < 0);
        setTrack(atEdge ? dx * EDGE_RESISTANCE : dx, 0);
      } else if (gesture.type === 'dismiss') {
        const pull = Math.max(0, dy);
        slides[index].slide.style.transform = `translate3d(0, ${pull}px, 0)`;
        dialog.style.setProperty('--backdrop-opacity',
          String(Math.max(DISMISS_MIN_OPACITY, 1 - pull / DISMISS_FADE_RANGE)));
      }
    }

    function finishZoom() {
      if (zoom.scale < MIN_SCALE + 0.01) {
        zoom = { scale: 1, x: 0, y: 0 };
      } else {
        clampPan();
      }
      applyZoom(token('--dur-modal'));
    }

    function handleTap(point, onImage) {
      const now = performance.now();
      const isDoubleTap = now - lastTap.time < DOUBLE_TAP_GAP
        && Math.hypot(point.x - lastTap.x, point.y - lastTap.y) < 40;

      if (onImage && isDoubleTap) {
        lastTap = { time: 0, x: 0, y: 0 };
        const targetScale = zoom.scale > 1 ? MIN_SCALE : DOUBLE_TAP_SCALE;
        zoomAround(targetScale, point.x, point.y, token('--dur-modal'));
        return;
      }
      lastTap = { time: now, x: point.x, y: point.y };
      if (!onImage) close();
    }

    function pointIsOnImage(event) {
      const rect = currentImg().getBoundingClientRect();
      return event.clientX >= rect.left && event.clientX <= rect.right
        && event.clientY >= rect.top && event.clientY <= rect.bottom;
    }

    function onPointerUp(event) {
      if (!pointers.has(event.pointerId)) return;
      pointers.delete(event.pointerId);
      if (!gesture) return;

      if (gesture.type === 'pinch') {
        if (pointers.size === 1) {
          if (zoom.scale <= MIN_SCALE) {
            finishZoom();
            gesture = null;
          } else {
            const [remaining] = pointers.values();
            beginSingle(remaining);
            gesture.moved = true;
          }
        } else if (pointers.size === 0) {
          finishZoom();
          gesture = null;
        }
        return;
      }
      if (pointers.size > 0) return;

      const finished = gesture;
      gesture = null;
      const dx = finished.last.x - finished.start.x;
      const dy = finished.last.y - finished.start.y;

      if (event.type === 'pointercancel') {
        if (finished.type === 'swipe') { setTrack(0, token('--dur-snap')); track.style.willChange = ''; }
        if (finished.type === 'dismiss') settleSlideOffset();
        return;
      }

      const elapsed = performance.now() - finished.startTime;
      if (!finished.moved && elapsed < TAP_MAX_TIME) {
        handleTap(finished.start, pointIsOnImage(event));
        return;
      }

      if (finished.type === 'swipe') {
        track.style.willChange = '';
        const first = finished.samples[0];
        const lastSample = finished.samples[finished.samples.length - 1];
        const velocity = (lastSample.x - first.x) / Math.max(1, lastSample.time - first.time);
        const passed = Math.abs(dx) >= SWIPE_DISTANCE || Math.abs(velocity) >= SWIPE_VELOCITY;
        if (passed && dx !== 0) go(index + (dx < 0 ? 1 : -1));
        else setTrack(0, token('--dur-snap'));
      } else if (finished.type === 'dismiss') {
        if (dy >= DISMISS_DISTANCE) close();
        else settleSlideOffset();
      }
    }

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('dragstart', (event) => event.preventDefault());

    closeButton.addEventListener('click', close);
    prevButton.addEventListener('click', () => go(index - 1));
    nextButton.addEventListener('click', () => go(index + 1));

    window.addEventListener('resize', () => {
      if (!isOpen) return;
      resetZoom(index);
      setTrack(0, 0);
    });

    return { open };
  }

  /* ---------- Gallery grid + "more" (spec 3-1) ---------- */

  function initGallery() {
    const grid = document.getElementById('gallery-grid');
    const moreButton = document.getElementById('gallery-more');
    const items = [...grid.querySelectorAll('.gallery__item')];
    const lightbox = createLightbox(items);

    items.forEach((item, i) => {
      const img = item.querySelector('img');
      const markLoaded = () => img.classList.add('is-loaded');
      if (img.complete && img.naturalWidth) markLoaded();
      else {
        img.addEventListener('load', markLoaded, { once: true });
        img.addEventListener('error', markLoaded, { once: true });
      }
      item.addEventListener('click', () => lightbox.open(i, item));
    });

    moreButton.addEventListener('click', () => {
      grid.classList.add('is-expanded');
      moreButton.hidden = true;
      grid.querySelector('.gallery__extra .gallery__item')?.focus();
    });
  }

  /* ---------- Kakao share (spec 3-6) ---------- */

  function initShare() {
    const kakaoButton = document.getElementById('share-kakao');
    const linkButton = document.getElementById('share-link');
    let kakaoReady = false;

    if (!isPlaceholder(CONFIG.kakaoJsKey)) {
      const script = document.createElement('script');
      script.src = CONFIG.kakaoSdkUrl;
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = () => {
        try {
          if (!window.Kakao.isInitialized()) window.Kakao.init(CONFIG.kakaoJsKey);
          kakaoReady = true;
        } catch {
          kakaoReady = false;
        }
      };
      document.head.append(script);
    }

    kakaoButton.addEventListener('click', () => {
      if (!kakaoReady) {
        linkButton.click();
        return;
      }
      const meta = (property) => document.querySelector(`meta[property="${property}"]`).content;
      const url = shareUrl();
      const link = { mobileWebUrl: url, webUrl: url };
      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: meta('og:title'),
            description: meta('og:description'),
            imageUrl: new URL('images/og-thumbnail.jpg', url).href,
            imageWidth: 1200,
            imageHeight: 630,
            link,
          },
          buttons: [{ title: '청첩장 보기', link }],
        });
      } catch {
        linkButton.click();
      }
    });
  }

  /* ---------- Guestbook form ---------- */

  function initForms() {
    document.querySelectorAll('form[data-async-form]').forEach((form) => {
      const result = form.querySelector('.form__result');
      const submit = form.querySelector('[type="submit"]');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const endpoint = form.getAttribute('action');
        if (isPlaceholder(endpoint)) {
          result.textContent = '지금은 방명록을 남길 수 없습니다. 축하의 말씀은 두 사람에게 직접 전해 주세요.';
          return;
        }
        submit.disabled = true;
        result.textContent = '';
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          form.reset();
          result.textContent = form.dataset.success;
        } catch {
          result.textContent = '전송하지 못했습니다. 잠시 후 다시 시도해 주세요.';
        } finally {
          submit.disabled = false;
        }
      });
    });
  }

  initHero();
  initReveal();
  initDday();
  initGallery();
  initCopyButtons();
  initMusic();
  initShare();
  initForms();
})();
