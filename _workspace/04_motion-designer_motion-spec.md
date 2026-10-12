---
motion_mood: "dreamy-soft"          # 카탈로그 C(별빛/반딧불이)를 크고 흐린 보케로 변형. 컨셉 시트 motion_direction 지시
density: "minimal"
background_animation: "bokeh-canvas" # 구간별 Canvas 2D 3개(hero, calendar, share). 꽃잎·컨페티·하트 파티클 없음
performance_budget:
  particles_max: 12                  # 화면 폭 768px 미만: 모든 구간 합산 동시 생존 보케 상한
  particles_max_wide: 16             # 768px 이상
  particles_per_zone_max: 8
  zone_counts: { hero: 8, calendar: 6, share: 6 }
  bokeh_alpha_max: { glow: 0.28, primary: 0.18 }   # 합성 후 픽셀 최대 불투명도. 입자끼리 겹치지 않으므로 이 값이 곧 상한
  bokeh_rise_max_px_s: 8
  bokeh_sway_max_px: 12
  bokeh_breath_period_s: [5, 9]
  bokeh_render_fps: 30               # 보케만 30fps로 그린다. 스크롤·제스처는 60fps 유지
  canvas_dpr: 1                      # 컨셉 상한 2 이내. 완전히 흐린 원이라 해상도 손실이 보이지 않는다
  infinite_loops: ["bokeh (구간별, 조건부)", "string-lights 전구 호흡 (calendar 화면 안일 때만)", "BGM glow 링 (재생 중일 때만)", "hero 스크롤 큐 (첫 스크롤 전까지만)"]
  concurrent_loops_max: 3
  animated_props: ["transform", "opacity", "stroke-dashoffset (장식 SVG 단발 1회)", "canvas drawImage"]
  forbidden_props: ["width", "height", "top", "left", "margin", "padding", "filter", "box-shadow", "backdrop-filter", "background-position"]
  fps_target: 60
  reduced_motion_strategy: "static-only"   # 루프·트랜지션 전부 정지 또는 즉시. 손가락으로 직접 조작하는 드래그·핀치만 유지
concept_alignment:
  - "무드 '겨울 오후에 켜진 정원의 전구': 화면 가장자리에서 빛망울이 숨 쉬듯 밝아졌다 어두워진다. 이동보다 밝기 변화가 주된 움직임"
  - "모든 보케 상한(개수·불투명도·속도·구간)은 컨셉 시트 motion_direction 값 그대로이거나 그보다 낮다"
  - "섹션 진입은 fade + translateY(12px→0) 800ms ease-out 하나로 통일. 예외는 컨셉이 지정한 hero 시퀀스, 디바이더 stroke-draw, 전구 호흡, BGM 링뿐"
  - "꽃잎·컨페티·하트 파티클, 패럴랙스, hero 확대·Ken Burns, 터치 반응 파티클, 사진 위 오버레이 효과 없음"
---

# Motion Specification: "Petal & Glow"

> **frontend-developer에게**: 이 문서의 수치는 그대로 구현 대상입니다. 6장 토큰을 먼저 `:root`에 넣고 모든 CSS 모션이 토큰을 참조하게 하세요. 1장 보케 상수는 코드에 `BOKEH` 객체로 같은 이름·값으로 옮겨야 QA가 grep으로 대조할 수 있습니다. 각 항목의 `reduced-motion` 줄은 CSS `@media (prefers-reduced-motion: reduce)`와 JS `matchMedia` 분기 양쪽에 구현합니다.
>
> **2026-10-10 변경 (갤러리 캐러셀)**: 3x5 썸네일 그리드를 한 장씩 옆으로 넘기는 캐러셀로 바꿨다(사용자 결정, `00_user-input.md` "갤러리 방식 변경"). 바뀐 곳은 2-5, 4-1(전면 교체), 4-2, 5, 6, 7, 8, 10이고 각 위치에 "(2026-10-10 갤러리 캐러셀로 변경)"을 붙였다. 나머지 절은 그대로다.

## 0. 모션 무드 결정

| 항목 | 결정 | 근거 |
|---|---|---|
| motion_mood | `dreamy-soft` | 첫 키워드 '로맨틱'의 기본값은 `romantic-lush`(꽃잎 24~40개)지만, 컨셉 시트가 꽃잎을 금지하고 카탈로그 C(빛)를 보케로 바꿔 쓰라고 지시했다. 카탈로그 C의 무드는 `dreamy-soft`다 |
| density | `minimal` | 컨셉 시트 지정. 구간당 6~8개, 모바일 합산 12개 이하 |
| 배경 모션 종류 | 1종 (보케) | 장식 SVG 연출(디바이더 그리기, 전구 호흡)은 배경이 아니라 장식 요소에 붙는 모션이다 |
| 움직임의 성격 | 밝기 호흡 > 위치 이동 | 입자 하나가 한 번 숨 쉬는 동안(5~9초) 최대 72px만 떠오른다. 눈이 따라가는 이동이 아니라 빛이 켜졌다 꺼지는 결로 읽히게 한다 |
| 피하는 것 | 사진과 겹치는 파티클 | 07(컨페티), 04·05(비눗방울) 사진과 화면 파티클이 겹쳐 보이는 문제 때문에 꽃잎을 쓰지 않는다(컨셉 시트) |

---

## 1. 애니메이션 배경: 보케 (Must)

### 1-1. 구조

| 항목 | 값 |
|---|---|
| 방식 | 구간 섹션마다 `<canvas class="bokeh" aria-hidden="true">` 1개. 섹션 `position: relative; isolation: isolate`, 캔버스 `position: absolute; inset: 0; z-index: 0; pointer-events: none`, 섹션의 나머지 자식은 `position: relative; z-index: 1` |
| 구간 | `data-bokeh="hero"`, `data-bokeh="calendar"`, `data-bokeh="share"` 세 섹션만. 다른 섹션에는 캔버스를 두지 않는다 |
| 이 구조를 고른 이유 | 캔버스가 섹션 안에 갇혀서 ① 다른 섹션·surface(카드, 사진 매트)·데스크톱 컬럼 바깥 면에 보케가 나갈 수 없고 ② hero 사진(불투명 JPEG, z-index 1)이 항상 보케 앞에 온다. fixed 전체 화면 캔버스는 구간 경계 계산과 마스킹이 따로 필요하다 |
| 해상도 | `canvas.width = section.clientWidth`, `canvas.height = section.clientHeight` (DPR 1 고정). 390x664 hero 기준 약 1.0MB 메모리 |
| 그리기 | 색별 스프라이트 2장(128x128 오프스크린 캔버스, 방사형 그라데이션)을 미리 만들고 매 프레임 `drawImage`로 크기만 바꿔 찍는다. 프레임마다 `createRadialGradient`를 만들지 않는다 |
| 프레임 | rAF 루프에서 33ms 미만 간격의 프레임은 건너뛴다(30fps). 8px/s 이하 이동이라 30fps에서도 프레임당 0.27px 이하로 매끄럽다 |
| dt | `dt = min((now - last) / 1000, 0.05)`. 재개 직후나 끊김 뒤에도 입자가 순간 이동하지 않는다 |

### 1-2. 입자 파라미터

| 파라미터 | 값 | 컨셉 상한 |
|---|---|---|
| 구간별 슬롯 수 | hero 8, calendar 6, share 6 | 구간당 8 이하 |
| 합산 동시 생존 상한 | 768px 미만 12, 768px 이상 16. 새 입자는 전체 생존 수가 상한 미만일 때만 생긴다 | 12 / 16 |
| 지름 | 12~56px. 작은 것 50%(12~24), 중간 35%(24~40), 큰 것 15%(40~56) | 12~56 |
| 가로 위치 | 75%는 가장자리 띠(구간 폭의 왼쪽 0~28%, 오른쪽 72~100%), 25%는 가운데 띠(28~72%). 가운데 띠는 지름 28px 이하만 | "화면 가장자리에서" |
| 큰 입자 | 지름 40px 이상은 가장자리 띠에서만 | |
| 색 | 70% glow `#EBCB94`(235,203,148), 30% primary `#C9A09F`(201,160,159). 생성할 때마다 확률로 고른다 | glow 70 / primary 30, 그 밖의 색 금지 |
| 최대 불투명도(peak) | 지름에 반비례. glow: 12px에서 0.28 → 56px에서 0.18. primary: 12px에서 0.18 → 56px에서 0.10. `peak = hi - (hi - lo) * (d - 12) / 44` | glow 0.28, primary 0.18 |
| 수명 | 한 번 숨 쉬는 시간 T = 5~9초(입자마다 랜덤). 수명이 끝나면 0.6~2.4초 쉬었다가 다른 자리에서 다시 생긴다 | 호흡 주기 5~9초 |
| 밝기 곡선 | `alpha = peak * sin²(π * age / T)`. 0에서 시작해 T/2에 peak, T에 다시 0. 생성·소멸 순간 모두 0이라 깜빡임이 없다 | 1초에 1회 넘는 깜빡임 금지 (최대 0.2Hz) |
| 상승 | 속도 v = 3~8px/s, `y = y0 - v * age`. 수명 동안 15~72px 떠오른다 | 8px/s 이하 |
| 좌우 흔들림 | 진폭 A = 4~12px, 주기 P = 8~14초, `x = x0 + A * sin(2π * age / P + φ)`. 최대 가로 속도 9.4px/s | ±12px |
| 스프라이트 그라데이션 | 중심에서 반지름 비율 0 → 알파 1.0, 0.35 → 0.85, 0.7 → 0.35, 1.0 → 0. 가장자리가 0으로 끝나 하드 엣지가 없다 | 하드 엣지·스파클 금지 |

### 1-3. 겹침 방지 (불투명도 상한을 구조로 보장)

입자 둘이 겹치면 알파가 쌓여 상한을 넘는다. 그래서 **입자의 수명 전체 궤적 사각형끼리 겹치지 않게** 생성 시점에 자리를 고른다.

| 항목 | 값 |
|---|---|
| 궤적 사각형 | 가로 `x0 - A - r` ~ `x0 + A + r`, 세로 `y0 - v*T - r` ~ `y0 + r`, 사방에 3px 여유(BOX_GAP 6px의 절반) |
| 생성 조건 | ① 사각형이 캔버스 안에 완전히 들어간다(구간 경계에서 원이 잘려 직선 모서리가 생기지 않게) ② 살아 있는 다른 입자의 사각형과 겹치지 않는다 ③ 제외 영역과 겹치지 않는다 |
| 시도 | 슬롯당 최대 10회 랜덤 시도. 6회째부터는 v = 0(제자리 호흡)으로 사각형 높이를 줄인다. 10회 모두 실패하면 0.4초 뒤 다시 시도 |
| 결과 | 한 픽셀 위에는 입자가 최대 1개뿐이고, 캔버스 CSS opacity는 1 이하이므로 합성 후 픽셀 불투명도는 그 입자의 peak를 넘지 않는다 |

**제외 영역**: 구간 섹션 안에서 `[data-bokeh-exclude]`가 붙은 요소의 사각형(섹션 기준 좌표)에 사방 12px을 더한 영역.

| 구간 | `data-bokeh-exclude`를 붙일 요소 |
|---|---|
| hero | hero 사진 `<img>` (사진 위아래 여백에만 보케가 생긴다. 사진이 fade-in 중일 때도 사진 뒤가 비어 있다) |
| calendar | string-lights 인라인 SVG (전구 후광과 보케가 겹쳐 뭉개지지 않게) |
| share | sprig-divider 인라인 SVG, wreath `<img>` |
| 공통 | 나중에 이 세 섹션 안에 surface 카드가 들어오면 그 카드에도 붙인다 |

### 1-4. 실행·정지 조건

| 상태 | 조건 | 동작 |
|---|---|---|
| 활성 | 섹션이 뷰포트 가운데 70% 띠와 겹침: `IntersectionObserver`, `rootMargin: '-15% 0px -15% 0px'`, `threshold: 0` | 캔버스에 `.is-on` → CSS `opacity 0→1` 600ms(`--dur-zone-fade`, linear), rAF 시작 |
| 구간 이탈 | 위 띠에서 벗어남 (다른 구간으로 스크롤) | `.is-on` 제거 → `opacity 1→0` 600ms, 600ms 뒤 rAF 정지. 그 사이 다시 들어오면 타이머 취소 |
| 탭 숨김 | `document.visibilityState === 'hidden'` | 즉시 rAF 정지(페이드 없음). 보이면 활성 구간만 재개 |
| 라이트박스 열림 | 4-2 lightbox `open` | 즉시 rAF 정지. 닫히면 재개 |
| reduced-motion | `matchMedia('(prefers-reduced-motion: reduce)')` | 루프를 만들지 않는다. 1-6 정적 대체 |
| 정지 중 상태 | 입자 배열과 나이(age)를 그대로 둔다 | 재개하면 이어서 숨 쉰다 |

정지 사유는 `Set`(예: `'hidden'`, `'lightbox'`)으로 관리하고, `활성 && 사유 없음 && !reduced`일 때만 rAF를 돌린다.

### 1-5. 시작·크기 변경

| 항목 | 값 |
|---|---|
| 초기 배치 | 슬롯마다 입자를 바로 만들고 나이를 `0 ~ T` 사이 랜덤으로 둔다(pre-seed). 켜지는 순간 이미 여러 단계의 호흡이 섞여 있다 |
| hero 첫 등장 | 2-1 시퀀스 600ms 시점부터 hero 캔버스 `opacity 0→1`을 1200ms(`--dur-bokeh-intro`)로. 첫 등장이 끝나면 일반 600ms 페이드로 바꾼다 |
| 크기 변경 | 섹션에 `ResizeObserver`, 150ms 디바운스. 캔버스 크기와 제외 영역을 다시 잰다. 폭이 바뀌었거나 높이가 40px 넘게 바뀌면 입자를 모두 새로 pre-seed한다 |
| 제외 영역 재측정 | 위 경우 + `document.fonts.ready` 후 1회 + hero 사진 `load` 후 1회 (폰트 교체로 hero 내용이 몇 px 움직여도 사진 위로 보케가 들어가지 않게) |
| 창 resize 이벤트 | 쓰지 않는다. iOS 주소창 표시·숨김마다 발생해서 불필요하게 재배치된다 |

### 1-6. prefers-reduced-motion 정적 대체

- calendar, share 캔버스는 숨긴다(`display: none`). 보케 없음.
- hero 캔버스에 **정지한 흐린 점 5개**를 한 번만 그린다(크기 변경 시 다시 그림). 루프·페이드 없음, 캔버스 `opacity: 1`.
- 위치는 사진 위 여백 띠(섹션 위 ~ 사진 위 -12px)와 아래 여백 띠(사진 아래 +12px ~ 섹션 아래) 기준 비율이다. 점이 띠를 벗어나면 반지름만큼 안쪽으로 clamp한다.

| # | 띠 | x (폭 비율) | y (띠 높이 비율) | 지름 | 색 | 알파 |
|---|---|---|---|---|---|---|
| 1 | 위 | 0.12 | 0.42 | 44px | glow | 0.24 |
| 2 | 위 | 0.88 | 0.62 | 28px | primary | 0.16 |
| 3 | 아래 | 0.10 | 0.66 | 36px | primary | 0.15 |
| 4 | 아래 | 0.90 | 0.30 | 52px | glow | 0.22 |
| 5 | 아래 | 0.80 | 0.80 | 20px | glow | 0.26 |

390x664(위 띠 186px, 아래 띠 194px)와 375x548 압축 규칙(위 띠 148px, 아래 띠 126px) 모두에서 5개가 clamp 없이 띠 안에 들어가고 서로 겹치지 않는 것을 계산으로 확인한 배치다. 큰 점(1, 3, 4)은 좌우 가장자리 12% 안쪽에 있다. 알파는 모두 컨셉 상한 이하다.

- 런타임에 설정이 바뀌면(`change` 이벤트) 새로고침하지 않고 전환한다: reduce로 바뀌면 모든 루프 정지 → 캔버스 지움 → 정적 점 그리기. 반대면 정적 점 지움 → 시스템 시작. BGM 재생이 끊기지 않게 하기 위해서다.

### 1-7. 참고 구현 (frontend가 옮길 기준 코드)

```js
// Bokeh background for zones: hero, calendar, share.
const BOKEH = Object.freeze({
  ZONES: { hero: 8, calendar: 6, share: 6 },          // living-particle slots per zone (<= 8)
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

const rand = (a, b) => a + Math.random() * (b - a);
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
}
// Zone controller (IntersectionObserver, ResizeObserver, pause reasons, 30fps rAF gate)
// follows the tables in 1-4 and 1-5. canSpawn() returns true while the sum of living
// particles across running zones is below MAX_TOTAL_MOBILE / MAX_TOTAL_WIDE.
```

**QA 확인용 훅 (Should)**: `window.__bokeh = { config: BOKEH, stats() }`. `stats()`는 `{ living, zones: { hero, calendar, share }, maxPeak: { glow, primary }, running: [...] }`를 반환한다(maxPeak는 현재 살아 있는 입자 peak의 최댓값). 읽기 전용이며 페이지 동작에 영향이 없다.

### 1-8. 보케 성능 예산

| 항목 | 예산 |
|---|---|
| 프레임당 작업 | `clearRect` 1회 + `drawImage` 최대 8회. 스크립트 시간 프레임당 1ms 이하 (Chrome DevTools Performance, CPU 4x throttle 기준 목표) |
| 동시에 도는 캔버스 | 평소 1개. 세로가 아주 긴 창에서만 hero + calendar 2개(합산 상한이 입자 수를 제한) |
| 메모리 | 캔버스 3개 합계 약 3.5MB (DPR 1) |
| 금지 | 캔버스에 `filter: blur()`, `ctx.filter`, `shadowBlur` 사용 금지. 흐림은 스프라이트 그라데이션으로만 |

**명세 검증 (1-7 코드를 node로 300초씩 시뮬레이션, 30fps)**:

| 구간 크기 (제외 영역) | 최대 생존 | 평균 생존 | 평균 가시(알파 > 0.05) | 최대 알파 glow / primary | 원 겹침 | 경계 이탈 | 제외 영역 침범 | glow 비율 |
|---|---|---|---|---|---|---|---|---|
| hero 390x664 (사진 y 198~458) | 8 | 6.56 | 4.45 | 0.2798 / 0.1798 | 0 | 0 | 0 | 0.70 |
| hero 375x548 (사진 y 160~410) | 8 | 6.51 | 4.38 | 0.2799 / 0.1797 | 0 | 0 | 0 | 0.64 |
| calendar 390x760 (전구 SVG) | 6 | 4.95 | 3.36 | 0.2794 / 0.1798 | 0 | 0 | 0 | 0.72 |
| share 390x620 (디바이더, wreath) | 6 | 4.94 | 3.32 | 0.2799 / 0.1798 | 0 | 0 | 0 | 0.74 |

평소 눈에 띄는 빛망울은 hero에서 4개 남짓, calendar·share에서 3개 남짓이다. density `minimal`에 맞는 양이다.

---

## 2. 스크롤 시퀀스

### 2-0. 공통 섹션 reveal (Must)

**효과는 하나**: `opacity 0→1` + `translateY(12px→0)`, 800ms(`--dur-reveal`), `--ease-out`.

| 항목 | 값 |
|---|---|
| 트리거 | 그룹 요소마다 `IntersectionObserver`, `threshold: 0.15`, `rootMargin: '0px 0px -10% 0px'` |
| 반복 | 1회. 보이면 `unobserve`. 위로 다시 스크롤해도 숨기지 않는다 |
| 단위 | 섹션당 최대 3그룹(`.reveal`). 글자·단락·그리드 칸 단위로 쪼개지 않는다 |
| stagger | 한 콜백에서 함께 들어온 그룹을 문서 순서로 정렬해 `--i = 0, 1, 2`(최대 2)를 주고 `transition-delay: calc(var(--i) * var(--stagger))`(120ms) |
| 게이트 | 숨김 상태는 `html.js`일 때만. `<head>` 첫 인라인 스크립트에서 `document.documentElement.classList.add('js')` |
| 안전장치 | `IntersectionObserver` 미지원이면 모든 `.reveal`에 즉시 `.is-visible`. 페이지 끝까지 스크롤했는데(`scrollY + innerHeight >= scrollHeight - 2`) 남은 `.reveal`이 있으면 모두 표시 |
| will-change | 쓰지 않는다 |

```css
.js .reveal {
  opacity: 0;
  transform: translateY(var(--reveal-distance));
  transition: opacity var(--dur-reveal) var(--ease-out), transform var(--dur-reveal) var(--ease-out);
  transition-delay: calc(var(--i, 0) * var(--stagger));
}
.js .reveal.is-visible { opacity: 1; transform: none; }
```

- **reduced-motion**: `--dur-reveal: 0ms`, `--reveal-distance: 0px`, `--stagger: 0ms`로 즉시 표시.

### 2-1. Hero 로드 시퀀스 (Must)

스크롤 트리거가 아니라 페이지 로드 시 1회. 시작점 t0 = `DOMContentLoaded` 후 `Promise.race([document.fonts.ready, 500ms 타이머])`.

| t (ms) | 요소 | 효과 | Duration | Easing |
|---|---|---|---|---|
| 0 | 위 텍스트 그룹 (eyebrow, "2027 · 01 · 03", "SUNDAY · 3 PM") | 공통 reveal (fade + 12px) | 800 | `--ease-out` |
| 0 | BGM 토글 | opacity 0→1만 | 400 | `--ease-out` |
| 300 | hero 사진 | **opacity 0→1만**. translate·scale 없음 | 900 (`--dur-photo`) | `--ease-out` |
| 600 | hero 보케 캔버스 | opacity 0→1 (1-5) | 1200 | linear |
| 900 | 아래 텍스트 그룹 (이름, 한글 일시, 장소) | 공통 reveal | 800 | `--ease-out` |
| 1700 | 스크롤 큐 | 4-9 등장 | 600 | `--ease-out` |

- 사진이 300ms 시점에 아직 로드되지 않았으면 `img.decode()` 완료 시점에 페이드를 시작한다. **텍스트는 사진을 기다리지 않는다.**
- hero 사진에 `<link rel="preload" as="image" href="images/photos/hero.jpg" fetchpriority="high">`. 227KB.
- 전체 시퀀스는 약 2.3초에 끝난다.
- **reduced-motion**: 모든 요소 즉시 표시, 보케는 1-6 정적 점 5개, 스크롤 큐는 정지한 선.

### 2-2. Greeting

- 그룹 ① eyebrow + 제목 ② 인사말 본문 전체 ③ 혼주 표기.
- 섹션 끝(greeting과 couple-intro 사이)의 sprig-divider는 reveal 대상이 아니라 3-1 stroke-draw로 등장한다.
- **reduced-motion**: 즉시 표시.

### 2-3. Couple-intro

- 그룹 ① 헤더 ② 신랑·신부 블록 두 개를 한 그룹으로(좌우 슬라이드인 없음) ③ 연락 버튼 등 부가 요소.
- **reduced-motion**: 즉시 표시.

### 2-4. Calendar (보케 구간)

- 그룹 ① string-lights + eyebrow + 제목 ② 2027년 1월 달력 ③ D-day 줄.
- 그룹 ①이 `.is-visible`가 되는 순간 string-lights 점등 시퀀스(3-2)를 시작한다.
- 3일 셀(지름 36px accent 원 + on_accent 숫자)은 **정적**이다. 펄스·scale·발광 없음. 이 구간에는 이미 보케와 전구 호흡 두 가지가 움직이므로 세 번째 움직임을 더하지 않는다.
- **reduced-motion**: 즉시 표시.

### 2-5. Gallery (2026-10-10 갤러리 캐러셀로 변경)

- 섹션 헤더 위 sprig-divider는 3-1 stroke-draw.
- 그룹 ① 헤더(eyebrow, 제목, 안내 문구) ② 캐러셀 전체(`.g-carousel`: 사진 뷰포트 + 이전·카운터·다음 줄)를 한 덩어리로. 슬라이드 개별 등장·stagger 없음. 처음 보이는 것은 현재 장과 양옆 peek뿐이다.
- 슬라이드 이미지 로드 페이드와 전환은 4-1.
- reveal(800ms) 도중에도 스와이프·버튼은 바로 동작한다. reveal은 `.g-carousel`의 opacity·transform, 슬라이드 이동은 안쪽 `.g-track`의 transform이라 서로 덮어쓰지 않는다.
- **reduced-motion**: 즉시 표시.

### 2-6. Venue / Account / Guestbook

- 공통 reveal, 섹션당 최대 3그룹. 예: venue ① 헤더 ② 장소명·주소·주소 복사(2026-10-12 카드 없음) ③ 지도·길찾기 버튼·교통편 / account ① 헤더 ② 신랑측 ③ 신부측 / guestbook ① 헤더 ② 폼 ③ 안내.
- 보케 구간(hero, calendar, share)이 아니라 보케 없음.
- **reduced-motion**: 즉시 표시.

### 2-7. Share (보케 구간, 마지막 섹션)

- 상단 sprig-divider는 3-1 stroke-draw.
- 그룹 ① wreath 모노그램 ② 'Thank you' + 맺음말 ③ 공유 버튼.
- 마지막 섹션이므로 2-0의 페이지 끝 안전장치가 여기서 작동한다.
- **reduced-motion**: 즉시 표시.

---

## 3. 장식 SVG 연출

### 3-1. sprig-divider stroke-draw (Must)

| 항목 | 값 |
|---|---|
| 위치 | 컨셉 지정 3곳: greeting 하단, gallery 헤더 위, share 상단. 표시 폭 120px |
| 삽입 방식 | **인라인 SVG** 3벌(`<img>`로는 내부 path에 CSS를 걸 수 없다). 원본은 `images/deco/sprig-divider.svg`. 각 루트 `<svg class="sprig" aria-hidden="true" focusable="false">` |
| 트리거 | `IntersectionObserver`, `threshold: 0.5`, `rootMargin: '0px 0px -10% 0px'`, 1회 → `.is-drawn` |
| 원리 | 모든 선 path에 `pathLength="1"` → `stroke-dasharray: 1 1; stroke-dashoffset: 1` → 0 |
| 총 길이 | 2400ms(`--dur-draw`). 끝나면 정지 |

시퀀스 (가운데 꽃 → 줄기가 바깥으로 자람 → 잎이 안쪽부터 돋음 → 점):

| 요소 (클래스) | 시작 | 길이 | Easing | 효과 |
|---|---|---|---|---|
| `.sp-flower` 꽃잎 윤곽 | 0 | 900 | `--ease-draw` | stroke-draw |
| `.sp-dot--center` 꽃 중심 점 | 600 | 300 | `--ease-out` | opacity 0→1 |
| `.sp-stem` 좌우 줄기 | 300 | 1200 | `--ease-draw` | stroke-draw (꽃 쪽에서 바깥으로) |
| `.sp-leaf--1` 안쪽 잎 쌍 | 700 | 700 | `--ease-draw` | stroke-draw |
| `.sp-leaf--2` 가운데 잎 쌍 | 1000 | 700 | `--ease-draw` | stroke-draw |
| `.sp-leaf--3` 바깥 잎 쌍 | 1300 | 700 | `--ease-draw` | stroke-draw |
| `.sp-dot--end` 줄기 끝 점 | 2000 | 400 | `--ease-out` | opacity 0→1 |

```css
.js .sprig :is(.sp-flower, .sp-stem, .sp-leaf) { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
.js .sprig .sp-dot { opacity: 0; }
.sprig.is-drawn .sp-flower      { animation: sp-draw 900ms var(--ease-draw) 0ms forwards; }
.sprig.is-drawn .sp-stem        { animation: sp-draw 1200ms var(--ease-draw) 300ms forwards; }
.sprig.is-drawn .sp-leaf--1     { animation: sp-draw 700ms var(--ease-draw) 700ms forwards; }
.sprig.is-drawn .sp-leaf--2     { animation: sp-draw 700ms var(--ease-draw) 1000ms forwards; }
.sprig.is-drawn .sp-leaf--3     { animation: sp-draw 700ms var(--ease-draw) 1300ms forwards; }
.sprig.is-drawn .sp-dot--center { animation: sp-dot 300ms var(--ease-out) 600ms forwards; }
.sprig.is-drawn .sp-dot--end    { animation: sp-dot 400ms var(--ease-out) 2000ms forwards; }
@keyframes sp-draw { to { stroke-dashoffset: 0; } }
@keyframes sp-dot  { to { opacity: 1; } }
```

- **SVG에 `sp-*` 클래스가 없을 때**: frontend가 인라인 복사본에 path 순서를 보고 직접 클래스를 붙인다. 그것도 어렵다면 대체 규칙: 모든 선 `path`를 0~2400ms 동시에 그리고, 채움 점(`circle`)은 1800ms에 400ms 페이드.
- 잎 시작 시점(700/1000/1300ms)은 줄기가 33%·58%·83% 그려진 시점이라, 줄기가 지나간 자리에서 잎이 돋는 것처럼 보인다.
- **reduced-motion / JS 꺼짐**: 처음부터 완성 상태(`stroke-dashoffset: 0`, 점 `opacity: 1`, `animation: none`).

### 3-2. string-lights 전구 (Must: 호흡 / Should: 점등 시퀀스)

| 항목 | 값 |
|---|---|
| 위치 | calendar 섹션 헤더 위 1곳. 표시 폭 200px. **인라인 SVG** (컨셉 지정), `aria-hidden="true"`, `data-bokeh-exclude` |
| 대상 | `<g class="bulb">` 7개(전구 원 + 후광 원이 한 그룹). 그룹 opacity를 바꾸므로 후광도 함께 숨 쉰다 |
| 점등 시퀀스 (Should) | 전구는 `opacity: 0.3`(꺼진 듯한 상태)에서 대기 → calendar 그룹 ① reveal 시점에 왼쪽부터 `0.3→1`, 각 500ms, 140ms 간격(`--bulb-stagger`). 마지막 전구까지 1340ms |
| 호흡 (Must) | 점등이 끝난 전구부터 `opacity 1 → 0.65 → 1`, 전구마다 주기가 다르다(아래 표). `--ease-in-out`, 무한 |
| 엇갈림 | 시작 시점(140ms 간격)과 주기 차이로 몇 사이클 안에 서로 완전히 어긋난다. 0.65가 바닥이라 꺼지는 느낌 없이 빛의 세기만 출렁인다 |
| 정지 | calendar 섹션이 뷰포트 밖(`IntersectionObserver`, rootMargin 0, threshold 0 → `.in-view` 토글)이거나 라이트박스가 열리면 `animation-play-state: paused` |

| 전구 (`--i`) | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| 호흡 주기 `--cycle` | 4.6s | 5.4s | 4.2s | 5.8s | 4.8s | 6.0s | 5.0s |

```css
.bulb[data-i="0"] { --i: 0; --cycle: 4.6s; }  /* ... repeat for 1-6 with the table values */
.js .lights .bulb { opacity: 0.3; }
.lights.is-on .bulb {
  animation:
    bulb-on 500ms var(--ease-out) calc(var(--i) * var(--bulb-stagger)) both,
    bulb-breathe var(--cycle) var(--ease-in-out) calc(500ms + var(--i) * var(--bulb-stagger)) infinite;
}
@keyframes bulb-on { from { opacity: 0.3; } to { opacity: 1; } }
@keyframes bulb-breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
.calendar:not(.in-view) .bulb,
html.lb-open .bulb { animation-play-state: paused; }
```

- 점등 시퀀스를 구현하지 않는 경우: `.js .lights .bulb { opacity: 0.3 }` 규칙과 `bulb-on`을 빼고, 호흡 delay를 `calc(var(--i) * -0.7s)`(음수)로 바꿔 처음부터 엇갈린 상태로 시작한다.
- 주기 4.2~6.0초 = 0.17~0.24Hz. 광과민성 기준(3Hz)과 컨셉의 "1초에 1회" 기준 모두 크게 밑돈다.
- **reduced-motion / JS 꺼짐**: 전구 7개 모두 `opacity: 1`, `animation: none`. 켜진 정지 상태.

---

## 4. 인터랙티브 요소

### 4-1. 갤러리 캐러셀 (Must: 구조·스와이프·버튼·접근성·lightbox 연결·로딩 창 / Should: 이미지 로드 페이드·이웃 탭 / Nice: 전환 중 잡기·트랙패드 가로 휠) (2026-10-10 갤러리 캐러셀로 변경)

3x5 썸네일 그리드를 대체한다. 이 결정은 컨셉 시트의 갤러리 그리드 명세(3열, 2:3 셀, 행 단위 챕터)보다 우선한다. 사진 순서(2026-10-12부터 파일 번호순 01~15, `_workspace/00_user-input.md` "갤러리 순서를 파일 번호순으로"), alt, 슬라이드 버튼 이름("사진 {n} / 15 크게 보기: {alt}", 카피 시트 gallery_controls)은 그대로 쓴다. 한 화면에 사진 1장, 좌우 스와이프와 이전/다음 버튼으로 넘긴다. 썸네일 목록 없음, 자동 넘김 없음.

#### 4-1-1. 프레임 비율

390px 화면, 프레임 폭 342px 기준 비교:

| 후보 | 프레임 | 세로 13장 | 가로 02 / 15 | 판단 |
|---|---|---|---|---|
| **2:3, 세로 cover + 가로 contain** | 342 x 513 | 원본 비율 그대로, 잘림 0 | 잘림 0. 342 x 255 / 342 x 228로 프레임 세로 가운데, 위아래 surface 매트 129 / 143px | **채택** |
| 2:3, 모두 cover | 342 x 513 | 잘림 0 | 가로 폭의 50% / 44%만 보인다 | 탈락. "가로 사진이 지나치게 잘리지 않게" 조건 위반 |
| 4:5, 모두 contain | 342 x 428 | 285 x 428(폭 17% 축소), 좌우 매트 29px | 위아래 매트 86 / 100px | 탈락. 2장의 매트를 줄이려고 13장을 작게 만든다 |
| 4:5, 세로 cover | 342 x 428 | 높이 17% 잘림. 전신 컷(06, 07, 09, 11)의 발끝·머리 위 장식이 잘린다 | 60% / 53%만 보인다 | 탈락. 컨셉 시트가 전신 구도를 지키려고 2:3을 고른 이유와 충돌 |
| 슬라이드마다 높이가 다름 | — | — | — | 탈락. 넘길 때마다 아래 섹션이 위아래로 밀린다(CLS) |

- 15장 중 13장이 정확히 2:3이라 프레임을 2:3으로 두면 대부분이 잘림·여백 없이 프레임을 채운다. 가로 2장은 자르지 않고 매트 위에 올린다. hero가 가로 사진을 위아래 여백과 함께 보여 주는 "액자 속 사진 한 장" 구도와 같은 방식이다.
- 세로 사진은 `object-fit: cover`. 1066x1600(0.66625)과 2:3(0.6667)의 차이는 342px 프레임에서 0.2px라 잘림이 보이지 않고, contain이면 생길 수 있는 매트 머리카락선이 생기지 않는다.
- 가로 사진(02, 15)은 `object-fit: contain`(슬라이드에 `.g-slide--landscape`). 기존 `object-position`(70% 50%, 54% 50%)은 쓰지 않는다.
- (2026-10-12) 순서가 파일 번호순(01~15)으로 바뀌어 첫 장은 세로 사진 01이다. 가로 사진은 2번(02)과 15번(15)이다.

#### 4-1-2. 레이아웃과 치수

| 항목 | 값 |
|---|---|
| 구조 | `.g-carousel` > `.g-viewport`(보이는 창) > `.g-track`(가로 줄) > `.g-slide` 15개. 그 아래 `.g-controls` 줄(이전 · 카운터 · 다음), 시각적으로 숨긴 `.g-status` |
| 뷰포트 폭 | 컬럼 전체 폭(390px 화면이면 390, 데스크톱 컬럼 480). 갤러리 섹션의 16px 거터를 `.g-carousel { margin-inline: calc(-1 * var(--gutter-gallery)) }`로 상쇄해 화면(컬럼) 가장자리까지 닿게 한다. 이웃 사진이 가장자리까지 보이게 하려는 것 |
| 프레임 폭 `--g-w` | `min(100vw − 48px, 480px − 48px, (100svh − 112px) × 2/3)` (6장 토큰). 보통은 화면 가장자리에서 24px(`--g-side`) 안쪽. 세로가 짧은 화면에서는 프레임 + 버튼 줄이 한 화면에 들어오도록 높이 기준으로 줄어든다. 112px = 버튼 줄 44 + 간격 12 + 뷰포트 위아래 패딩 8 + 위아래 숨 쉴 여백 48. `svh`라 iOS 주소창이 접히고 펴져도 크기가 바뀌지 않는다 |
| 프레임 | 슬라이드 = `flex: 0 0 var(--g-w); aspect-ratio: 2 / 3`. 안쪽 버튼 `.g-open`이 프레임 면: 모서리 4px(`--radius-cell`), 배경 surface `#F3EAE3`(가로 사진 매트 + 로딩 자리 표시), `overflow: hidden`. 테두리·그림자 없음. `overflow: hidden`을 슬라이드가 아니라 버튼에 둬서 버튼 포커스 링이 잘리지 않게 한다 |
| 슬라이드 간격 `--g-gap` | 8px |
| 이웃 미리보기(peek) | **있음.** 현재 프레임 좌우로 이웃 사진이 `--g-side − --g-gap` = 16px 보인다(짧은 화면에서는 더 넓다). 이웃은 원래 톤 그대로다. 흐리게·작게·불투명도 낮추기 없음(컨셉: 사진 위 오버레이·톤 변경 금지). 1번과 15번에서는 빈 쪽에 페이지 background가 보인다 |
| peek를 두는 이유 | "옆으로 넘긴다"는 단서를 글 없이 준다. 16px는 한 장이 주인공이라는 인상을 해치지 않는 폭이다 |
| 세로 패딩 | 뷰포트 `padding-block: 4px`. 현재 슬라이드 포커스 링(2px + offset 2px)이 뷰포트 클립에 잘리지 않게 한다. 헤더와 캐러셀 사이 간격은 기존 헤더-그리드 간격을 그대로 쓴다 |
| 버튼 줄 | 프레임 아래 12px(뷰포트 패딩 포함 16px). 가운데 정렬 한 덩어리: [이전] 8px [카운터] 8px [다음], 높이 44px. 한 손 엄지가 닿는 가운데에 모은다 |
| 이전/다음 버튼 | 터치 영역 44x44. 보이는 원 지름 40px(`::before`, inset 2px), 1px accent `#8E5558` 테두리(2026-10-12 디자인 통일: 원형 버튼 윤곽선은 accent, BGM 토글과 같은 모양), 면 투명. 아이콘은 lightbox와 같은 chevron 인라인 SVG(`M15 5l-7 7 7 7` / `M9 5l7 7-7 7`, viewBox 24) 20px, stroke accent `#8E5558` 1.4px(bg 대비 5.45, 비텍스트 3:1 충족), `aria-hidden="true"` |
| 사진 위 버튼 금지 | 좌우 화살표를 사진 위에 얹지 않는다. 컨셉이 사진 위 글자·버튼·그라데이션을 금지한다 |
| 끝에서 버튼 | 1번의 이전, 15번의 다음: `aria-disabled="true"`, opacity 0.3, `cursor: default`, 누름 scale 없음. `disabled` 속성은 쓰지 않는다(누르던 버튼이 비활성되며 포커스가 body로 빠지는 것을 막는다) |
| 카운터 | "3 / 15". Cormorant Garamond 400 16px, letter-spacing 0.1em, line-height 1(lightbox 카운터와 같은 글꼴·크기). 현재 번호 text `#3B2D2A`(12.26), " / 15" muted `#75655E`(5.17). `font-variant-numeric: lining-nums tabular-nums`, `min-width: 4.5em`, 가운데 정렬(1자리↔2자리로 바뀌어도 버튼이 움직이지 않게). `lang="en"`, `aria-hidden="true"`(낭독은 `.g-status`가 맡는다) |
| 커서 (마우스) | 뷰포트 `grab`, 현재 슬라이드 버튼 `zoom-in`, 드래그 중 `grabbing` |

화면별 계산값 (QA 확인용):

| 화면 (폭 x svh) | 프레임 | peek | 프레임 + 버튼 줄 높이 |
|---|---|---|---|
| 390 x 664 (iPhone 14 Safari) | 342 x 513 | 16px | 577px |
| 375 x 548 (iPhone SE Safari) | 291 x 436 (높이 기준으로 줄어듦) | 34px | 500px |
| 360 x 700 (Android) | 312 x 468 | 16px | 532px |
| 430 x 750 | 382 x 573 | 16px | 637px |
| 데스크톱, 컬럼 480, 창 높이 900 | 432 x 648 | 16px | 712px |

#### 4-1-3. 구현 방식: transform 트랙 (scroll-snap 아님)

| 기준 | transform 트랙 (채택) | CSS scroll-snap |
|---|---|---|
| 넘김 임계값·전환 시간 | 직접 정한다. lightbox와 같은 값(8px 축 판정, 50px 또는 0.3px/ms, 350ms) | 브라우저 몫. 천천히 끌면 폭의 절반(약 175px)을 넘어야 넘어간다. 버튼 이동(`scrollTo` smooth)의 시간·곡선은 브라우저마다 다르다 |
| 양 끝 | 0.3배 저항 후 제자리(lightbox와 같음) | 브라우저 기본 오버스크롤 |
| 세로 스크롤 공존 | `touch-action: pan-y pinch-zoom`. 세로 이동은 브라우저가 페이지를 스크롤하고 가로 이동만 JS에 온다 | 브라우저가 처리(장점) |
| 성능 | 메인 스레드에서 transform만 쓴다. 갤러리 구간은 보케가 꺼져 있고 전구는 멈춰 있어 메인 스레드가 비어 있다 | 합성 스레드 스크롤(장점) |
| iOS Safari | Pointer Events와 `touch-action: pan-y`는 iOS 13부터 지원. 위치가 `--g-i`와 CSS `calc`로만 정해져서 회전·크기 변경에 재계산 코드가 없다 | smooth `scrollTo`는 iOS 15.4부터. 회전·폭 변경 뒤 스냅 위치가 어긋나는 경우를 따로 바로잡아야 하고, 현재 번호를 스크롤 위치에서 거꾸로 계산해야 한다 |
| 현재 번호의 출처 | JS `index` 한 곳 | 스크롤 위치(카운터·lightbox 동기화가 어긋날 여지) |
| reduced-motion | `--dur-snap: 0ms` 하나로 끝 | 버튼 이동만 즉시로 바꿀 수 있고, 손을 뗀 뒤의 스냅 애니메이션은 끌 수 없다 |
| lightbox와의 제스처 | lightbox는 `showModal` 모달이라 열린 동안 캐러셀은 inert다. 겹치는 제스처는 없고, 여닫는 경계(4-1-6)만 처리한다. 손 감각이 lightbox와 같다 | 겹침은 없지만 캐러셀과 lightbox의 손 감각이 다르다 |
| JS 꺼짐 | 폴백으로 scroll-snap을 쓴다(4-1-9) | 그대로 동작(장점) |
| 기존 명세 | — | 5장 "쓰지 않는 것"의 `scroll-behavior: smooth`와 충돌 |

**결정: transform 트랙.** 갤러리와 lightbox의 넘김 판정·시간을 같게 맞추고, 현재 번호를 JS 한 곳에서만 들고 있어서 카운터·낭독·lightbox 동기화가 서로 어긋나지 않게 하려는 것이다. scroll-snap의 장점(JS 없이 동작)은 JS 꺼짐 폴백으로만 가져온다.

**기존 lightbox 제스처 코드 재사용 판단**:
- 재사용한다: `LB` 상수 중 `AXIS_LOCK 8`, `SWIPE_DIST 50`, `SWIPE_VELOCITY 0.3`, `EDGE_RESIST 0.3`, `VELOCITY_WINDOW 100`과 `finishSwipe`의 넘김 판정식. 판정식은 순수 함수 `swipeTarget(index, total, dx, samples)`로 빼서 lightbox와 캐러셀이 함께 쓴다. 값과 식을 복제하지 않으므로 QA는 한 곳만 대조하면 된다.
- 재사용하지 않는다: lightbox `stage`의 pointer 핸들러 전체. ① `touch-action: none`, pointerdown `preventDefault`, 즉시 `setPointerCapture`는 페이지 세로 스크롤과 탭(click)을 막는다. ② 핀치·팬·끌어 닫기·더블탭 분기가 캐러셀에는 필요 없다. ③ `setTrack`의 `-100% * index`는 슬라이드 폭이 무대 폭과 같다는 전제라 peek가 있는 캐러셀에 맞지 않는다.

#### 4-1-4. 스와이프

| 항목 | 값 |
|---|---|
| 입력 | Pointer Events, `.g-viewport`에 등록. `e.isPrimary`만, 마우스는 왼쪽 버튼만. 드래그 중 두 번째 손가락이 닿으면(페이지 핀치 확대) 손을 뗀 것처럼 제자리로 되돌리고 그 제스처는 무시 |
| touch-action | `.js .g-viewport { touch-action: pan-y pinch-zoom; }`. 세로 스크롤과 페이지 확대(WCAG 1.4.4)는 브라우저에 남긴다 |
| 방향 판정 | 처음 8px(`LB.AXIS_LOCK`) 이동에서 `abs(dx) > abs(dy)`이면 가로(스와이프), 아니면 세로. 세로면 손을 뗄 때까지 아무것도 하지 않는다(브라우저가 페이지를 스크롤하고 `pointercancel`을 보낸다). 판정 전에는 트랙을 움직이지 않는다 |
| 포인터 캡처 | 가로로 판정된 순간에만 `setPointerCapture`. pointerdown에서 바로 캡처하거나 `preventDefault`하지 않는다. 그래야 탭이 버튼 click으로 이어진다(캡처하면 click 대상이 뷰포트로 바뀐다) |
| 드래그 | 손가락 1:1(트랜지션 없음, `.is-dragging`). 드래그 중에만 트랙 `will-change: transform`. 세로 성분은 무시 |
| 넘김 판정 | 손을 뗄 때 `abs(dx) ≥ 50px`(`LB.SWIPE_DIST`), 또는 마지막 100ms 속도 `≥ 0.3px/ms`(`LB.SWIPE_VELOCITY`)이면서 dx와 같은 방향이면 한 장 이동. 아니면 제자리. 한 제스처에 한 장만 넘어간다 |
| 양 끝 | **멈춤, 순환 없음.** 1번에서 오른쪽, 15번에서 왼쪽으로 끌면 이동량의 0.3배(`LB.EDGE_RESIST`)만 따라오고 놓으면 제자리. 이유: ① 순서가 오프닝(02)에서 피날레(15)로 가는 이야기라 피날레 다음에 오프닝이 오면 흐름이 끊긴다 ② lightbox도 순환하지 않는다 ③ 순환하려면 복제 슬라이드가 필요해 스크린리더에 같은 사진이 두 번 잡힌다 |
| 전환 | 350ms(`--dur-snap`) `--ease-standard`. 손을 뗀 위치에서 목표까지. 버튼·키보드·이웃 탭도 같은 값 |
| 카운터·낭독 갱신 | 목표가 정해지는 순간(전환 시작). 전환이 끝나기를 기다리지 않는다 |
| 연속 입력 | 전환 중 버튼을 또 누르면 목표만 바뀐다. CSS transition이 지금 위치에서 이어 간다 |
| 전환 중 잡기 (Nice) | 전환 중 pointerdown이면 `getComputedStyle(track).transform`의 x 이동값과 목표 위치의 차이를 초기 dx로 삼아 그 자리에서 이어 끈다. 구현하지 않으면 손가락을 대는 순간 목표 위치로 짧게 점프한다(지금 lightbox와 같은 동작) |
| click 억제 | 가로 스와이프로 판정된 제스처, 또는 이웃 탭으로 이동한 제스처 뒤의 click 1회를 뷰포트 캡처 단계에서 `preventDefault` + `stopPropagation`. ① 마우스로 끌고 놓았을 때 lightbox가 열리지 않게 ② 이웃을 탭하면 `pointerup`에서 이미 그 장이 현재가 되므로, 뒤따르는 click이 새 현재 슬라이드 버튼에 떨어져 lightbox가 열리지 않게 한다(시험 페이지에서 확인된 문제). 플래그는 다음 pointerdown에서 초기화 |
| 이미지 끌기·선택 | img `draggable="false"`, 뷰포트 `user-select: none`. 길게 눌러 사진 저장하는 iOS 메뉴(`-webkit-touch-callout`)는 막지 않는다. 하객이 사진을 저장할 수 있게 둔다 |
| 햅틱 | 없음(lightbox와 같음) |
| 자동 넘김 | 없음. 그래서 정지 버튼도 두지 않는다 |
| iOS 가장자리 뒤로가기 | 화면 왼쪽 끝에서 시작한 오른쪽 스와이프는 Safari·카카오톡 인앱 브라우저가 '뒤로 가기'로 가져간다. 막을 수 없고 막지 않는다. 프레임이 가장자리에서 24px 안쪽이라 사진 위에서 시작한 스와이프는 해당하지 않는다 |

#### 4-1-5. 버튼, 이웃 탭, 키보드

| 입력 | 동작 |
|---|---|
| 이전/다음 버튼 | 한 장 이동(350ms). 끝에서는 `aria-disabled="true"`라 눌러도 아무 일 없음. 포커스는 누른 버튼에 그대로 남는다 |
| 현재 프레임 탭 | 슬라이드 버튼 click → lightbox(4-1-6) |
| 이웃 peek 탭 (Should) | 현재 프레임 바깥(왼쪽·오른쪽)을 탭(이동 8px 미만)하면 그쪽으로 한 장 이동. 비현재 슬라이드는 `inert` + `pointer-events: none`이라 탭이 뷰포트로 떨어진다. pointerup의 `clientX`를 현재 슬라이드 사각형과 비교해 판정한다. 이동하면 뒤따르는 click 1회를 억제한다(4-1-4 click 억제) |
| ← / → | 포커스가 `.g-carousel` 안(현재 슬라이드 버튼, 이전·다음 버튼)에 있을 때 한 장 이동, `preventDefault`. 문서 전체에 키 리스너를 걸지 않는다(다른 섹션에서 화살표 키 스크롤을 빼앗지 않게) |
| Home / End | 쓰지 않는다 |
| 트랙패드 가로 휠 (Nice) | `wheel`(passive: false)에서 `abs(deltaX) > abs(deltaY)`일 때만 `preventDefault`(두 손가락 가로 쓸기로 브라우저 '뒤로 가기'가 일어나지 않게)하고 deltaX를 누적, ±40을 넘으면 한 장 이동 후 450ms 동안 추가 입력을 버린다. 세로 휠은 건드리지 않는다 |

#### 4-1-6. lightbox 연결

| 항목 | 값 |
|---|---|
| 열기 | 현재 슬라이드 버튼 click(탭, Enter, Space) → 캐러셀과 **같은 번호**로 lightbox `open(index, button)`. 이웃 슬라이드는 inert라 열리지 않는다(탭하면 그쪽으로 넘어갈 뿐) |
| 여는 순간의 사진 | lightbox 현재 슬라이드의 첫 `src`는 캐러셀 같은 번호 img의 `currentSrc`(이미 받아 캐시됨). 4-2 이미지 로딩 |
| 열려 있는 동안 | 캐러셀은 움직이지 않는다(배경은 `showModal`로 inert). 보이지 않는 곳에서 transform·이미지 로딩을 하지 않으려는 것 |
| 닫을 때 동기화 | 닫기 모션이 시작될 때(`requestClose`)와 `close` 이벤트 두 곳에서 `carousel.goTo(lbIndex, { animate: false, announce: false })`. 같은 번호면 아무것도 하지 않는다. 그래서 0.96 scrim이 200ms 동안 걷힐 때 캐러셀은 이미 **lightbox에서 마지막으로 보던 사진**에 와 있다. `close`에서도 부르는 이유: 브라우저가 `cancel` 없이 dialog를 바로 닫는 경우가 있다(4-2 Esc) |
| 포커스 복귀 | 동기화 뒤 **캐러셀 현재 슬라이드 버튼**으로 `focus({ preventScroll: true })`. 처음 연 버튼이 아니라 지금 번호의 버튼이다. 번호가 바뀌었으면 처음 연 버튼은 inert라 포커스를 받을 수 없다 |
| 낭독 | 동기화 때는 `.g-status`를 갱신하지 않는다. 포커스가 옮겨 간 버튼 이름("사진 n / 15 크게 보기: …")이 위치를 알려 준다 |
| 동기화 뒤 로딩 | `goTo`가 새 번호 기준으로 로딩 창(4-1-7)을 채운다. lightbox가 같은 원본을 이미 받았으면 캐시에서 온다 |
| 페이지 스크롤 | lightbox가 열린 동안 `html.lb-open`으로 잠겨 있으므로 닫은 뒤 캐러셀은 같은 화면 위치에 있다 |
| lightbox 슬라이드 생성 | 기존 `.g-cell` 대신 캐러셀 슬라이드 버튼(`.g-open`)의 `data-full`, `data-w`, `data-h`와 img alt로 만든다 |

#### 4-1-7. 이미지 로딩

| 항목 | 값 |
|---|---|
| 파일 | `srcset`으로 썸네일과 원본을 함께 준다. 세로: `thumb/{f} 600w, {f} 1066w`(14번은 `1067w`). 02: `thumb/02.jpg 804w, 02.jpg 1600w`. 15: `thumb/15.jpg 900w, 15.jpg 1600w`. `src`는 원본 |
| sizes | `(min-width: 480px) 432px, calc(100vw - 48px)` = 프레임 폭. 가로 사진도 프레임 폭을 꽉 채우므로 값이 같다. 짧은 화면에서 프레임이 더 좁아지면 실제보다 큰 파일을 고를 뿐 흐려지지 않는다 |
| 실제 선택 | 390px 폰은 DPR 2에서 684px, DPR 3에서 1026px가 필요해 세로 사진은 원본(1066w)을 받는다. 썸네일(600w)은 DPR 2에서도 모자라 흐리다. 가로 02·15는 DPR 2에서 썸네일(804w·900w)로 충분하고, DPR 1 데스크톱은 썸네일을 받는다 |
| 크기 속성 | `width`/`height` = 원본 픽셀(세로 1066x1600, 14번 1067x1600, 02 1600x1194, 15 1600x1066). 프레임 크기는 슬라이드 `aspect-ratio`가 정하므로 CLS 0 |
| HTML 기본 | 15장 모두 실제 `src`/`srcset`/`sizes`와 `loading="lazy"`, `decoding="async"`. 갤러리는 페이지 중간이라 첫 장도 페이지 로드 때 받지 않는다. 현재 장과 peek로 보이는 이웃은 갤러리가 가까워지면 브라우저 lazy 로딩이 받는다. `inert`·`aria-hidden`은 HTML에 쓰지 않는다(4-1-8) |
| 로딩 창 (JS) | 캐러셀이 화면 한 개 거리 안에 처음 들어오면(`IntersectionObserver`, `rootMargin: '100% 0px'`, 1회) 그때부터, 그리고 `goTo` 때마다 `index − 1` ~ `index + 2` 슬라이드 img의 `loading`을 `'eager'`로 바꾼다(앞으로 2장, 뒤로 1장). 바꾼 값은 되돌리지 않는다. 나머지는 `lazy`로 둔다. IO 미지원이면 처음부터 창을 채운다 |
| `data-src`를 쓰지 않는 이유 | JS 꺼짐 폴백(4-1-9)에서도 모든 사진이 보여야 한다. 클립된 뷰포트 밖 lazy 이미지를 언제 받을지는 브라우저마다 달라서, 다음 장은 `eager` 전환으로 확실히 미리 받는다. `eager` 전환으로 로딩이 시작되지 않는 브라우저도 다음 장이 peek로 보이는 순간 받기 시작하므로, 최악의 경우에도 한 장 늦게 뜨는 정도다 |
| 로드 페이드 (Should) | 슬라이드 img가 `complete`가 아니면 `.is-loading`(opacity 0)에서 시작해 `load`(또는 `error`)에 opacity 1, 300ms(`--dur-base`) `--ease-out`. 로딩 중에는 프레임 surface 면만 보인다. 스피너 없음. 기존 `initThumbs`의 대상 선택자만 슬라이드 img로 바꿔 쓰면 된다 |
| 예산 | 갤러리 첫 화면(현재 + 이웃 + 미리 받기 = 01, 02, 03, 2026-10-12 파일 번호순)은 DPR 3에서 약 1.0MB, DPR 2에서 약 0.8MB. 15장을 끝까지 넘기면 원본 합계 약 3.7MB. 썸네일 15장(1.48MB)을 한꺼번에 받던 그리드보다 첫 비용은 낮고, 끝까지 보는 하객만 더 받는다 |
| 레이어 | 트랙은 15장 너비(약 5,250px)지만 디코딩된 이미지는 로딩 창 안의 4장 남짓이다. 브라우저는 큰 레이어를 타일로 나눠 보이는 부분만 래스터한다 |

#### 4-1-8. 접근성 구조

```html
<div class="g-carousel reveal" role="group" aria-roledescription="슬라이드" aria-label="웨딩 사진 15장">
  <div class="g-viewport">
    <div class="g-track" id="g-track">
      <div class="g-slide">
        <button type="button" class="g-open" aria-haspopup="dialog"
                data-full="images/photos/01.jpg" data-w="1066" data-h="1600"
                aria-label="사진 1 / 15 크게 보기: {alt}">
          <img src="images/photos/01.jpg"
               srcset="images/photos/thumb/01.jpg 600w, images/photos/01.jpg 1066w"
               sizes="(min-width: 480px) 432px, calc(100vw - 48px)"
               width="1066" height="1600" loading="lazy" decoding="async" draggable="false" alt="{alt}">
        </button>
      </div>
      <!-- 14 more slides in file-number order (01-15); landscape slides 02 and 15 add the g-slide--landscape modifier -->
    </div>
  </div>
  <div class="g-controls">
    <button type="button" class="g-nav g-prev" aria-label="이전 사진" aria-controls="g-track" aria-disabled="true"><!-- chevron svg --></button>
    <p class="g-counter" lang="en" aria-hidden="true"><span class="g-counter__now">1</span><span class="g-counter__total"> / 15</span></p>
    <button type="button" class="g-nav g-next" aria-label="다음 사진" aria-controls="g-track"><!-- chevron svg --></button>
  </div>
  <p class="sr-only g-status" aria-live="polite" aria-atomic="true"></p>
</div>
```

| 항목 | 값 |
|---|---|
| 캐러셀 묶음 | `role="group"` + `aria-roledescription="슬라이드"` + `aria-label="웨딩 사진 15장"`. `role="region"`을 쓰지 않는 이유: 바깥 `<section aria-labelledby="gallery-title">`이 이미 '사진첩' 영역(landmark)이라 같은 내용의 landmark를 하나 더 만들지 않는다 |
| 슬라이드 | `<div class="g-slide">`. 슬라이드마다 `role="group"`을 붙이지 않는다. 한 번에 현재 슬라이드 하나만 노출되고, 그 안의 유일한 버튼 이름("사진 n / 15 크게 보기: {alt}")이 위치와 내용을 이미 말한다. 슬라이드 그룹 이름을 따로 주면 같은 번호를 두 번 듣게 된다 |
| 비현재 슬라이드 | `inert` + `aria-hidden="true"` + `.is-current` 없음. JS가 초기화 때 붙인다(HTML에 쓰면 JS 꺼짐 폴백에서 사진이 숨는다). `inert` 미지원 브라우저(iOS 15.4 이하)에서는 그 슬라이드 버튼에 `tabindex="-1"`도 준다 |
| 탭 순서 | 현재 슬라이드 버튼 → 이전 → 다음. 비현재 14장은 탭 순서에 없다 |
| 버튼 이름 | "이전 사진", "다음 사진"(카피 시트 gallery_controls, lightbox와 같은 문구). `aria-controls="g-track"` |
| 끝 표시 | `aria-disabled="true"`. 스크린리더가 '흐리게 표시됨/사용할 수 없음'으로 읽는다. 보이는 표시는 opacity 0.3 |
| 위치 낭독 | `.g-status`(`aria-live="polite"`, `aria-atomic="true"`)에 "15장 중 4번째 사진, {alt}"(카피 키 `lb-counter` + 쉼표 + 그 사진 alt)를 넣는다. 이전·다음 버튼, 스와이프, 이웃 탭으로 번호가 바뀔 때만. 보이는 카운터는 `aria-hidden` |
| 낭독 중복 방지 | 번호가 바뀔 때 포커스가 현재 슬라이드 버튼에 있었으면(←/→ 사용) `.g-status`를 갱신하지 않고, 새 현재 슬라이드 버튼으로 포커스를 옮긴다(`preventScroll: true`). 포커스 이동이 새 버튼 이름을 읽어 준다 |
| 포커스 유실 방지 | `goTo` 순서: 새 현재 슬라이드의 `inert`를 먼저 푼다 → (필요하면) 그 버튼으로 포커스 → 나머지 슬라이드에 `inert`. 포커스가 든 슬라이드가 먼저 inert가 되면 포커스가 body로 빠진다. 이전·다음 버튼은 끝에서도 `disabled`가 아니라 포커스가 남는다 |
| 포커스 링 | 전역 규칙(2px accent, offset 2px). 현재 슬라이드 버튼의 링은 뷰포트 `padding-block: 4px` 안에 그려진다 |
| 뷰포트가 스크롤되지 않게 | 뷰포트 `overflow: clip`(미지원 브라우저는 `overflow: hidden`). clip이면 포커스 이동으로 뷰포트가 스크롤될 수 없다. hidden 폴백에 대비해 `goTo` 끝에서 `viewport.scrollLeft = 0` |
| 페이지 확대 | `touch-action`에 `pinch-zoom`을 넣어 캐러셀 위에서도 페이지 확대가 된다. viewport meta는 바꾸지 않는다 |

카피 메모: "웨딩 사진 15장"(묶음 이름), "슬라이드"(roledescription), 낭독 문장의 조합 방식은 모션 명세의 기본값이다. copy-writer 카피 시트에 같은 항목이 생기면 그쪽을 쓴다.

#### 4-1-9. JS 꺼짐 폴백

- `html.js`가 없으면 `.g-viewport`는 `overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: none`, 슬라이드는 `scroll-snap-align: center; scroll-snap-stop: always`. 트랙의 `padding-inline`이 같아서 첫 장과 끝 장도 가운데에 선다. 손가락 스크롤로 15장을 모두 볼 수 있다.
- 버튼 줄과 `.g-status`는 숨긴다. lightbox는 열리지 않는다(기존과 같은 한계).
- JS가 켜지면 `.js .g-viewport`에서 스크롤을 끄고 transform 트랙으로 바뀐다(4-1-11 CSS).

#### 4-1-10. reduced-motion

| 항목 | 기본 | reduced |
|---|---|---|
| 버튼·키·이웃 탭·스와이프를 놓은 뒤 전환 | 350ms `--ease-standard` | 0ms, 즉시 바뀐다(`--dur-snap: 0ms`) |
| 드래그 중 따라오기 | 손가락 1:1 | 유지. 사용자가 직접 움직이는 것이라 lightbox 드래그와 같은 원칙 |
| 양 끝 저항 뒤 복귀 | 350ms | 즉시 |
| 이미지 로드 페이드 | 300ms | 즉시(`--dur-base: 0ms`) |
| 이전/다음 버튼 누름 | scale 0.97 | scale 없음, `opacity: 0.85` 즉시(5장) |
| 런타임 설정 변경 | — | 토큰만 바뀌므로 새로고침 없이 반영된다. 캐러셀 JS에는 reduced 분기가 없다 |

#### 4-1-11. 참고 CSS

```css
/* Gallery carousel (motion spec 4-1). Tokens --g-w, --g-gap: section 6. */
.gallery .g-carousel { margin-inline: calc(-1 * var(--gutter-gallery)); }

.g-viewport {
  padding-block: 4px;                       /* room for the current slide's focus ring */
  overflow-x: auto;                         /* no-JS fallback: native scroll-snap */
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}
.g-viewport::-webkit-scrollbar { display: none; }
.g-track {
  display: flex;
  gap: var(--g-gap);
  width: max-content;
  padding-inline: calc(50% - var(--g-w) / 2);   /* % = viewport width: centers the current slide */
}
.g-slide {
  flex: 0 0 var(--g-w);
  aspect-ratio: 2 / 3;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
.g-open {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--radius-cell);
  overflow: hidden;                         /* on the button, so its own outline is not clipped */
  background: var(--color-surface);         /* mat for landscape photos + loading placeholder */
  cursor: zoom-in;
  -webkit-tap-highlight-color: transparent;
}
.g-open img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity var(--dur-base) var(--ease-out);
}
.g-slide--landscape img { object-fit: contain; }
.g-open img.is-loading { opacity: 0; }

.js .g-viewport {
  overflow: hidden;
  overflow: clip;                           /* not scrollable, so focus can never scroll it */
  scroll-snap-type: none;
  touch-action: pan-y pinch-zoom;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
}
.js .g-track {
  transform: translate3d(calc(var(--g-i, 0) * -1 * (var(--g-w) + var(--g-gap)) + var(--g-dx, 0px)), 0, 0);
  transition: transform var(--dur-snap) var(--ease-standard);
}
.js .g-track.is-dragging { transition: none; will-change: transform; cursor: grabbing; }
.js .g-track.no-anim { transition: none; }
.js .g-slide:not(.is-current) { pointer-events: none; }

.g-controls { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; }
html:not(.js) .g-controls { display: none; }
.g-nav {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: none;
}
.g-nav::before {
  content: "";
  position: absolute;
  inset: 2px;
  border: 1px solid var(--color-accent); /* 2026-10-12 design unification */
  border-radius: 50%;
}
.g-nav[aria-disabled="true"] { opacity: 0.3; cursor: default; }
.g-nav[aria-disabled="true"]:active { transform: none; }
@media (hover: hover) and (pointer: fine) {
  .g-nav:not([aria-disabled="true"]):hover::before { background: rgb(142 85 88 / 0.06); }
}
.g-counter {
  min-width: 4.5em;
  margin: 0;
  text-align: center;
  font: 400 16px/1 var(--font-en-serif);
  letter-spacing: 0.1em;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--color-muted);
}
.g-counter__now { color: var(--color-text); }
```

이전/다음 버튼의 `:active` scale 0.97과 reduced-motion 대체는 5장 "모든 버튼" 규칙을 그대로 따른다.

#### 4-1-12. 참고 JS

```js
// Gallery carousel (motion spec 4-1). Swipe thresholds are shared with the lightbox via LB.
const GAL = Object.freeze({ BEHIND: 1, AHEAD: 2, NEAR_MARGIN: '100% 0px' });

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
  const root = document.querySelector('.g-carousel');
  if (!root) return null;
  const viewport = root.querySelector('.g-viewport');
  const track = root.querySelector('.g-track');
  const slides = [...track.querySelectorAll('.g-slide')];
  const buttons = slides.map((s) => s.querySelector('.g-open'));
  const imgs = slides.map((s) => s.querySelector('img'));
  const btnPrev = root.querySelector('.g-prev');
  const btnNext = root.querySelector('.g-next');
  const now = root.querySelector('.g-counter__now');
  const status = root.querySelector('.g-status');
  const total = slides.length;
  let index = 0;
  let near = false;

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
  root.addEventListener('keydown', (e) => {
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
    if (!suppressClick) return;
    suppressClick = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);
  viewport.addEventListener('dragstart', (e) => e.preventDefault());

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries, obs) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      near = true;
      preload();
      obs.disconnect();
    }, { rootMargin: GAL.NEAR_MARGIN }).observe(root);
  } else {
    near = true;
  }

  goTo(0, { animate: false, announce: false });
  return { goTo, get index() { return index; }, button: (k) => buttons[k], img: (k) => imgs[k] };
}
// Init order: const carousel = initCarousel(); initLightbox(bokeh, carousel);
// Lightbox: buttons open(i, carousel.button(i)); on close start and on 'close':
//   carousel.goTo(lbIndex, { animate: false, announce: false });
//   'close' handler then focuses carousel.button(carousel.index) with preventScroll.
```

QA 확인값:
- 390px 폭 창에서 프레임 342x513, 이웃 peek 16px.
- 다음 버튼 14번 → 카운터 "15 / 15", 다음 버튼 `aria-disabled="true"`, 포커스는 다음 버튼에 남는다.
- 네트워크: hero에 머무는 동안 갤러리 사진 요청 0건. 갤러리 근처에서 01, 02, 03만 요청(DPR에 따라 원본 또는 썸네일). 4번째 이후는 넘기기 전까지 요청되지 않는다. 브라우저가 클립 밖 lazy 이미지를 더 일찍 받으면 1~2장 더 보일 수 있으며 FAIL로 보지 않는다.
- 4번째 슬라이드에서 lightbox를 열어 7번째까지 넘기고 닫으면 카운터 "7 / 15", `document.activeElement`가 7번째 슬라이드 버튼.
- 세로로 쓸어 올리면 캐러셀 위에서 시작해도 페이지가 스크롤되고 트랙은 움직이지 않는다.

### 4-2. 갤러리 Lightbox (Must)

라이브러리 없음. Pointer Events 하나로 터치·마우스·펜을 처리한다.

**구조와 레이아웃**

| 항목 | 값 |
|---|---|
| 요소 | `<dialog class="lightbox" aria-label="사진 크게 보기">` + `showModal()`. 모달이 열리면 배경이 inert가 되어 Tab 포커스가 lightbox 안에서만 돈다(포커스 트랩) |
| 배경 | dialog 전체 면 `rgb(28 21 20 / 0.96)` (lightbox_scrim `#1C1514`, 불투명도 0.96). `::backdrop`은 투명 |
| 3단 레이아웃 | 위 바(높이 56px + `env(safe-area-inset-top)`): 오른쪽 닫기 버튼 / 가운데 무대(`flex: 1; overflow: hidden; touch-action: none`) / 아래 바(높이 64px + `env(safe-area-inset-bottom)`): 이전 버튼, "n / 15" 카운터, 다음 버튼 |
| 사진 표시 | 무대 안에서 `object-fit: contain`, 원본 비율. 사진 위에는 글자·버튼·그라데이션을 얹지 않는다(컨셉). 확대해도 무대가 `overflow: hidden`이라 위아래 바를 덮지 않는다 |
| 트랙 | 가로 트랙에 15개 슬라이드, `transform: translate3d(calc(-100% * index + dragX px), 0, 0)` |
| 카운터 | "3 / 15", Cormorant Garamond 16px, letter-spacing 0.1em, 색 `#FBF6F1`(scrim 대비 약 16:1), `aria-live="polite"` |
| 버튼 | 닫기·이전·다음 각 44x44, 인라인 SVG 아이콘 stroke `#FBF6F1` 1.4px, 면 투명. 양 끝에서 이전/다음 `disabled`(opacity 0.3) |
| 포커스 링 | lightbox 안에서는 2px `#FBF6F1`, offset 2px (accent는 어두운 scrim 위에서 약 3:1로 경계값이라 쓰지 않는다) |
| 사진 alt | 슬라이드 `<img alt>` = 컨셉 시트 desc |

**열기 / 닫기**

| 항목 | 값 |
|---|---|
| 열기 | 캐러셀 현재 슬라이드 탭(또는 Enter·Space) → 캐러셀과 같은 index로 `showModal()` → dialog `opacity 0→1` 250ms(`--dur-modal`) `--ease-out`. scale·blur 없음. 4-1-6 (2026-10-10 갤러리 캐러셀로 변경) |
| 열 때 처리 | `html.lb-open` 클래스(스크롤 잠금 `overflow: hidden` + 전구·스크롤 큐 일시정지), 보케 정지 사유 `'lightbox'` 추가. 첫 포커스는 닫기 버튼 |
| 닫기 수단 | 닫기 버튼, `Esc`, 사진 밖 빈 무대 탭(scale 1일 때), 아래로 끌어내리기(Should), Android 뒤로가기(Should) |
| 닫기 모션 | `opacity 1→0` 200ms `--ease-in` → `dialog.close()` |
| Esc | `cancel` 이벤트에서 `preventDefault()` 후 닫기 모션 → `close()`. 브라우저가 cancel 없이 바로 닫는 경우가 있으므로 정리 작업(아래)은 `close` 이벤트에서 한다 |
| 닫은 뒤 정리 | `html.lb-open` 제거, 보케 `'lightbox'` 사유 제거(재개), 확대 상태 초기화, **캐러셀을 lightbox에서 마지막으로 보던 index로 즉시 맞춘 뒤 그 슬라이드 버튼으로 포커스 복귀**. 캐러셀 동기화는 닫기 모션 시작 시점에도 한 번 한다(4-1-6) (2026-10-10 갤러리 캐러셀로 변경) |
| 아래로 끌어 닫기 (Should) | scale 1이고 세로 이동이 가로보다 클 때. 사진이 손가락을 따라 `translateY`, dialog 배경 opacity `0.96 * (1 - dy / 400)`(최저 0.4). 80px 이상에서 놓으면 닫기, 미만이면 250ms에 원위치 |
| Android 뒤로가기 (Should) | 열 때 `history.pushState({ lb: 1 }, '')`, `popstate`에서 열려 있으면 닫기. UI로 닫을 때는 `history.state?.lb`이면 `history.back()`으로 기록을 되돌린다(이중 닫기 방지 플래그) |

**스와이프 (scale === 1일 때만)**

| 항목 | 값 |
|---|---|
| 축 판정 | 처음 8px 이동에서 가로·세로를 정한다. 가로면 스와이프, 세로면 끌어 닫기 |
| 드래그 | 손가락을 1:1로 따라간다(트랜지션 없음). 드래그 중에만 트랙 `will-change: transform`, 놓으면 제거 |
| 전환 판정 | `|dx| ≥ 50px` 또는 속도 `≥ 0.3px/ms` |
| 스냅 | 350ms(`--dur-snap`) `--ease-standard` |
| 양 끝 | 순환하지 않는다. 1번에서 오른쪽·15번에서 왼쪽으로 끌면 이동량의 0.3배만 따라오고 놓으면 제자리 |
| 키보드 | `←` / `→` 이동(스냅 모션 동일), `Esc` 닫기 |
| 전환 시 | 떠나는 슬라이드의 확대를 scale 1로 초기화 |
| 자동 재생·햅틱 | 없음. 넘길 때마다 진동이 오는 것은 사진 감상에 방해가 된다 |

**핀치 줌 / 더블탭 / 팬**

| 항목 | 값 |
|---|---|
| 범위 | scale 1~3 |
| 기준점 | `transform-origin: 0 0`, `transform: translate(tx, ty) scale(s)`. 두 손가락 중점 (mx, my)가 고정되도록 `tx' = mx - (mx - tx) * (s' / s)`, `ty'`도 같은 식 |
| 더블탭 | 300ms 안에 두 번 탭, 이동 10px 이하. scale 1이면 탭 지점 기준 2배, 1보다 크면 1로. 250ms `--ease-standard` |
| 한 번 탭 | 사진 위 한 번 탭은 아무 동작 없음(더블탭과 구분). 사진 밖 빈 무대 한 번 탭만 닫기 |
| 팬 | scale > 1에서 한 손가락 드래그. 사진 가장자리가 무대 안쪽으로 들어오지 않게 clamp: `tx ∈ [stageW - imgW*s, 0]`. 확대한 사진이 무대보다 작은 축은 가운데 고정 |
| 1 미만 | 핀치로 1 아래로 줄였다 놓으면 250ms에 1로 복귀 |
| 확대 중 | 스와이프·끌어 닫기 비활성 |
| 페이지 확대 | viewport meta에 `user-scalable=no`, `maximum-scale=1` **금지**. 무대의 `touch-action: none`만으로 lightbox 안 제스처를 가져온다 |
| 키보드 줌 (Nice) | `+` / `-`로 1.5배씩, `0`으로 1배 |
| 트랙패드 (Nice) | `ctrl + wheel`로 줌 |

**이미지 로딩**

| 항목 | 값 |
|---|---|
| 초기 | 15개 슬라이드 `<img>`는 캐러셀 슬라이드 버튼의 `data-full`(원본)·`data-w`·`data-h`와 img alt로 만들고 `src`는 비운다 (2026-10-10 갤러리 캐러셀로 변경) |
| 현재 슬라이드 | 먼저 `src` = 캐러셀 같은 번호 img의 `currentSrc`(캐러셀이 이미 받아 캐시됨, 같은 비율. DPR 2 이상 폰의 세로 사진은 대개 원본 자체라 교체가 생략된다). `currentSrc`가 원본과 다르면(절대 URL로 비교) `new Image()`로 원본을 받아 `decode()`가 끝나면 교체. 캐러셀 img가 아직 로드 전이면(`!complete` 또는 `naturalWidth === 0`) 처음부터 원본을 `src`로. 비율이 같아 레이아웃 변화·깜빡임이 없다 (2026-10-10 갤러리 캐러셀로 변경) |
| 이웃 | 현재 ±1 슬라이드에 원본 `src`를 채운다. 한 번 채운 `src`는 유지 |
| 원본 크기 | 긴 변 1600px, 121~651KB. 09(651KB), 08(490KB), 10(486KB), 02(374KB)가 크다 |
| 로딩 중 | 캐러셀에서도 아직 받지 않은 사진(lightbox 안에서 키보드로 이웃 밖까지 건너뛴 경우)은 scrim 면만 보이다가 `load` 후 `opacity 0→1` 300ms. 스피너 없음 (2026-10-10 갤러리 캐러셀로 변경) |

- **reduced-motion**: 열기·닫기 페이드, 스냅, 더블탭 줌 전환, 원위치 복귀 모두 0ms(즉시). 손가락을 그대로 따라가는 드래그·핀치·팬은 사용자가 직접 조작하는 것이므로 유지한다.

### 4-3. BGM 토글 (Must: 토글·상태 / Should: glow 링·볼륨 페이드)

| 항목 | 값 |
|---|---|
| 음원 | `<audio id="bgm" src="audio/bgm.mp3" loop preload="none">` (4.09MB, MP3 192kbps, 약 2분 50초). 켜기 전에는 내려받지 않는다 |
| 자동재생 | **하지 않는다.** 로드 시 `play()` 호출 없음. 첫 스크롤·첫 탭으로 시작하는 것도 하지 않는다. 토글 버튼으로만 켠다 |
| 위치 | `position: fixed; top: max(16px, env(safe-area-inset-top)); right: max(16px, calc((100vw - 480px) / 2 + 16px)); z-index: 50`. 데스크톱에서도 480px 컬럼 안 우상단에 머문다 |
| 크기 | 시각 원 40px, 터치 영역 44x44(`::before`로 사방 2px 확장) |
| 면 | 배경 `rgb(251 246 241 / 0.92)`, 1px accent `#8E5558` 테두리(2026-10-12 디자인 통일). 그림자·backdrop-filter 없음 |
| 꺼짐 아이콘 | 음표 + 대각선 사선(왼쪽 위 → 오른쪽 아래). 인라인 SVG, stroke accent `#8E5558` 1.4px, 18px |
| 켜짐 아이콘 | 음표(사선 없음) + glow 링 |
| 아이콘 전환 | 두 아이콘을 겹쳐 두고 opacity 크로스페이드 200ms(`--dur-fast`) |
| glow 링 (Should) | 버튼 뒤(z-index -1) `.bgm-ring`, 버튼보다 사방 6px 큰 원(52px). 배경 `radial-gradient(closest-side, transparent 70%, rgb(235 203 148 / 0.7) 84%, transparent 100%)`. 켜짐: 링 컨테이너 `opacity 0→1` 400ms 후, 안쪽 `::before`가 `opacity 0.45↔1` + `scale(0.97↔1.05)`로 3000ms 주기(`--dur-ring`) `--ease-in-out` 무한. 꺼짐: 컨테이너 `opacity →0` 300ms 후 애니메이션 제거 |
| 로딩 상태 | 탭 후 `playing` 이벤트 전까지 `aria-busy="true"`, 아이콘 opacity 0.5. 회전 스피너 없음 |
| 볼륨 페이드 (Should) | 켤 때 `audio.volume = 0.6 * t²`(t: 0→1, 1500ms, rAF). 끌 때 `volume * (1 - t)²`(400ms) 후 `pause()`, volume을 0.6으로 되돌림. **iOS Safari는 volume이 읽기 전용이라 페이드 없이 즉시 재생·정지**된다. Web Audio로 우회하지 않는다 |
| 탭 숨김 | `visibilitychange` hidden → 일시정지. visible → 숨기기 직전 재생 중이었을 때만 재개. `aria-pressed`는 바꾸지 않는다 |
| 재생 실패 | `play()` reject 또는 `error` 이벤트 → 꺼짐 상태로 되돌리고 `aria-pressed="false"`, `aria-busy` 제거. 오류 문구 없음 |
| 라이트박스 | 음악은 계속 재생. 토글은 dialog(top layer) 아래에 깔린다 |
| 접근성 | `<button type="button" class="bgm-toggle" aria-pressed="false" aria-label="배경 음악">`. 상태는 `aria-pressed`로 전달하고 라벨 문구는 고정. Enter/Space는 `<button>` 기본 동작. 포커스 링 2px accent, offset 2px |
| 햅틱 | 없음 |
| reduced-motion | 링 호흡 없음: 켜짐이면 링 `opacity: 0.8`, `transform: none`으로 정지 표시. 아이콘은 즉시 교체. 볼륨 페이드는 시각 모션이 아니므로 유지 |

### 4-4. 복사 피드백: 계좌·주소·링크 공용 (Must)

| 항목 | 값 |
|---|---|
| 대상 | account 섹션 계좌마다 "복사" 버튼, venue 섹션 "주소 복사", share 섹션 "링크 복사". 모두 같은 함수 `copyText(value, kind)` |
| 동작 | `navigator.clipboard.writeText(value)` → 실패 시 화면 밖 `<textarea>` + `document.execCommand('copy')` 재시도 |
| 버튼 피드백 | 성공 시 버튼에 `.is-copied` 1600ms: 라벨 "복사" → 체크 아이콘(인라인 SVG, `aria-hidden`) + "복사됨". 라벨 opacity 크로스 120ms. 버튼에 "복사됨" 기준 `min-width`를 줘서 행 너비가 변하지 않게(CLS 0). 1600ms 안에 다시 누르면 다시 복사하고 타이머만 재시작 |
| 토스트 | 화면 하단 가운데 알약. `position: fixed; left: 50%; bottom: calc(24px + env(safe-area-inset-bottom)); z-index: 120`, 면 text `#3B2D2A`, 글자 `#FBF6F1`(12.26:1), Pretendard 500 14px, padding 12px 20px, 모서리 999px, `max-width: min(320px, calc(100vw - 48px))` |
| 토스트 모션 | 등장 `opacity 0→1` + `translate(-50%, 8px) → translate(-50%, 0)`, 200ms `--ease-out`. 1800ms 유지. 퇴장 200ms `--ease-in` 후 `visibility: hidden`. 보이는 중에 또 복사하면 문구만 바꾸고 타이머 재시작(다시 튀어나오지 않음) |
| 낭독 | 시각 토스트는 `aria-hidden="true"`. 페이지에 시각적으로 숨긴 `<p class="sr-only" role="status" aria-live="polite">` 1개를 처음부터 두고 같은 문구를 넣는다. 같은 문구를 연속으로 넣을 때는 비웠다가 50ms 뒤 다시 넣어 재낭독되게 한다 |
| 햅틱 | 성공 시 `navigator.vibrate?.(12)`. iOS Safari는 미지원이라 조용히 무시된다 |
| 실패 폴백 | 두 방식 모두 실패하면 토스트·낭독 "복사하지 못했습니다. 길게 눌러 직접 복사해 주세요" + 해당 텍스트 노드를 `Selection`으로 선택해 둔다 |
| 계좌 접기 | 신랑측/신부측 접기를 쓰면 `<details>/<summary>`. 높이 애니메이션 금지. 열린 내용 `opacity 0→1` 250ms, summary 화살표 `rotate(0→180deg)` 200ms |
| reduced-motion | 라벨·토스트·펼침 즉시 표시/숨김(위치 이동 없음), 화살표 회전 즉시 |

기본 문구 (copy-writer 카피 파일에 같은 항목이 있으면 그쪽을 쓴다):

| kind | 토스트·낭독 |
|---|---|
| account | 계좌번호를 복사했습니다 |
| address | 주소를 복사했습니다 |
| link | 청첩장 링크를 복사했습니다 |
| kakao 폴백 | 링크를 복사했습니다. 카카오톡 대화창에 붙여 넣어 주세요 |

### 4-5. D-day (Must: 계산 / 모션 없음)

| 항목 | 값 |
|---|---|
| 계산 | 한국 시간 날짜 기준 일수 차. `const kst = new Date(Date.now() + 9 * 3600e3); const today = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()); const days = Math.round((Date.UTC(2027, 0, 3) - today) / 864e5);` |
| 표기 | `days > 0`: "D-85" + copy-writer의 안내 문장 / `days === 0`: "D-DAY" / `days < 0`: D-day 줄 숨김(달력은 유지) |
| 확인값 | 2026-10-10 기준 **D-85**. 2027-01-03은 일요일 |
| 갱신 | 로드 시 1회 + `visibilitychange`로 다시 보일 때 1회. 타이머 없음 |
| 모션 | **카운트업 없음.** 0부터 올라가는 동안 잘못된 숫자가 보이고 스크린리더가 중간값을 읽을 수 있으며, calendar 구간에는 이미 보케와 전구가 움직인다. 숫자는 그룹 ③ reveal과 함께 나타날 뿐이다 |
| reduced-motion | 해당 없음(원래 정적) |

### 4-6. 카카오톡 공유 / 링크 복사 (Should)

| 항목 | 값 |
|---|---|
| 카카오 | Kakao JS SDK `Kakao.Share.sendDefault`(feed). SDK 로드나 공유 호출이 실패하면 4-4 링크 복사(kakao 폴백 문구)로 동작 |
| 링크 복사 | 4-4 그대로 |
| 모션 | 5장 버튼 공통 누름 상태만 |
| reduced-motion | 누름 scale 없음(`opacity: 0.85` 즉시). 링크 복사 피드백은 4-4 reduced 규칙 |

### 4-7. 길찾기 버튼 (Should)

- 카카오맵·네이버 지도·티맵 외부 링크(`target="_blank" rel="noopener"`). 모션은 5장 버튼 공통 누름 상태만.
- 지도 임베드가 들어가면 `loading="lazy"`. 지도 위에 모션 없음.
- **reduced-motion**: 누름 scale 없음(`opacity: 0.85` 즉시).

### 4-8. 방명록 폼 (Should)

| 항목 | 값 |
|---|---|
| 입력 포커스 | 2px accent 외곽선, offset 2px. 애니메이션 없음 |
| 제출 중 | 버튼 `disabled`, 라벨 "보내는 중"(스피너 없음) |
| 결과 | 폼 아래 상태 문구 `role="status"`, `opacity 0→1` 200ms. 성공 시 입력값 초기화, 실패·접수 주소 미설정 시 입력값 유지 |
| reduced-motion | 상태 문구 즉시 표시 |

### 4-9. hero 스크롤 큐 (Should)

| 항목 | 값 |
|---|---|
| 모양 | 컨셉 지정 1px x 28px 세로선. 바탕 선 primary 35%(`rgb(201 160 159 / 0.35)`), 그 안에서 primary 100% 조각이 흐른다 |
| 등장 | 2-1의 1700ms에 `opacity 0→1` + `scaleY(0→1)`(transform-origin top), 600ms `--ease-out` |
| 루프 | `::after`(선과 같은 크기, primary)가 `translateY(-100%) → translateY(100%)`. 2400ms 주기(`--dur-cue`) 중 앞 60% 동안 흐르고 40%는 쉰다. `--ease-in-out`, 무한. 부모 `overflow: hidden` |
| 사라짐 | `scrollY > 24`가 되면 `opacity → 0` 400ms 후 애니메이션 제거. 다시 나타나지 않는다. scroll 리스너는 `{ passive: true }`, 숨긴 뒤 즉시 해제 |
| 압축 화면 | `@media (max-height: 640px)`에서는 컨셉대로 스크롤 큐를 숨긴다(루프도 없음) |
| reduced-motion | primary 100% 정지 선. 스크롤하면 즉시 숨김 |

---

## 5. 트랜지션 & 디테일

| 요소 | 상태 | 변화 | Duration | Easing | reduced-motion |
|---|---|---|---|---|---|
| 모든 버튼(주·보조·복사·공유·길찾기·캐러셀 이전/다음. 2026-10-10 캐러셀 버튼 추가) | `:active` | `transform: scale(0.97)` (캐러셀 버튼이 `aria-disabled="true"`이면 없음) | 120ms | `--ease-standard` | scale 없음, `opacity: 0.85` 즉시 |
| 주 버튼(accent 면) | `:hover` (`(hover: hover) and (pointer: fine)`일 때만) | `opacity: 0.92` | 200ms | `--ease-standard` | 즉시 |
| 보조 버튼(accent 테두리) | `:hover` (같은 조건) | 배경 `rgb(142 85 88 / 0.06)` | 200ms | `--ease-standard` | 즉시 |
| 텍스트 링크 | `:hover` | `text-decoration-color` transparent → accent | 200ms | `--ease-standard` | 즉시 |
| 모든 포커스 가능 요소 | `:focus-visible` | `outline: 2px solid var(--color-accent); outline-offset: 2px` (lightbox 안은 `#FBF6F1`) | 0 | — | 동일 |
| 캐러셀 트랙 (2026-10-10 갤러리 캐러셀로 변경) | 버튼·←/→·이웃 탭·스와이프 놓음 | `translate3d` 한 장 이동 / 끝에서 제자리 복귀 | 350ms | `--ease-standard` | 즉시. 드래그 중 손가락 따라가기는 유지 |
| 캐러셀 슬라이드 이미지 (2026-10-10 갤러리 캐러셀로 변경) | load | opacity 0→1 | 300ms | `--ease-out` | 즉시 |
| hero 사진 | 로드 시퀀스 | opacity 0→1 (scale·translate 없음) | 900ms | `--ease-out` | 즉시 |
| sprig-divider | 진입 | stroke-draw 시퀀스 | 2400ms | `--ease-draw` | 완성 상태 |
| string-lights | 진입 / 루프 | 점등 0.3→1, 호흡 1↔0.65 | 500ms / 4.2~6.0s | `--ease-out` / `--ease-in-out` | 정지, opacity 1 |
| lightbox | 열기 / 닫기 | dialog opacity | 250ms / 200ms | `--ease-out` / `--ease-in` | 즉시 |
| lightbox | 스냅 / 줌 / 원위치 | transform | 350ms / 250ms / 250ms | `--ease-standard` | 즉시 |
| 복사 버튼 라벨 | 성공·복귀 | 라벨 opacity 크로스 | 120ms + 120ms | `--ease-standard` | 즉시 교체 |
| 토스트 | 등장 / 퇴장 | opacity + translateY 8px | 200ms / 200ms | `--ease-out` / `--ease-in` | 즉시 |
| BGM 아이콘 | 토글 | 꺼짐 ↔ 켜짐 opacity | 200ms | `--ease-standard` | 즉시 |
| BGM 링 | 재생 중 | opacity 0.45↔1 + scale 0.97↔1.05 | 3000ms | `--ease-in-out` | 정지(opacity 0.8) |
| 보케 캔버스 | 구간 진입·이탈 | 캔버스 opacity | 600ms (hero 첫 등장 1200ms) | linear | 정적 점 5개(hero만) |

**쓰지 않는 것 (QA 확인용)**: 꽃잎·컨페티·하트 파티클, 터치·클릭 반응 파티클, 패럴랙스, hero 사진 scale·Ken Burns, 사진 위 색 오버레이·그라데이션·filter, 마스킹 텍스트 리빌, split char, 카운트업, 달력 펄스·발광, 갤러리 자동 슬라이드, 슬라이드 전환 햅틱, 캐러셀 순환·스와이프 힌트 흔들기·이웃 사진 흐리게/축소·사진 위 화살표 (2026-10-10 갤러리 캐러셀로 변경), 클릭 ripple, hover lift + 그림자, 첫 화면 게이트(봉투 열기), BGM 자동재생, `box-shadow`·`filter`·`backdrop-filter` 애니메이션, 캔버스 `shadowBlur`·`ctx.filter`, `scroll-behavior: smooth`.

---

## 6. CSS 변수 / 토큰 (Must)

```css
:root {
  /* Easing */
  --ease-out:      cubic-bezier(0.33, 1, 0.68, 1);    /* reveal, photo fade, toast in, carousel image fade */
  --ease-in:       cubic-bezier(0.32, 0, 0.67, 0);    /* lightbox close, toast out */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);      /* press, slide snap (carousel + lightbox), zoom, label swap */
  --ease-in-out:   cubic-bezier(0.37, 0, 0.63, 1);    /* breathing loops: bulbs, BGM ring, scroll cue */
  --ease-draw:     cubic-bezier(0.65, 0, 0.35, 1);    /* sprig stroke-draw, pen-like accel/decel */

  /* Duration */
  --dur-press:        120ms;
  --dur-fast:         200ms;
  --dur-modal:        250ms;
  --dur-base:         300ms;   /* carousel image load fade */
  --dur-snap:         350ms;   /* slide change: gallery carousel + lightbox */
  --dur-zone-fade:    600ms;   /* bokeh canvas fade on zone enter/leave */
  --dur-reveal:       800ms;
  --dur-photo:        900ms;   /* hero photo fade-in */
  --dur-bokeh-intro: 1200ms;   /* hero bokeh first fade-in */
  --dur-draw:        2400ms;   /* sprig-divider total */
  --dur-cue:         2400ms;   /* scroll cue loop */
  --dur-ring:        3000ms;   /* BGM glow ring breath */

  /* Distance & stagger */
  --reveal-distance: 12px;
  --stagger:        120ms;
  --bulb-stagger:   140ms;

  /* Gallery carousel geometry (4-1). --max-w is the existing 480px column token */
  --g-gap:    8px;     /* space between slides */
  --g-side:   24px;    /* column edge to current frame; the neighbour peeks 16px into it */
  --g-chrome: 112px;   /* height kept free for the controls row and breathing room */
  --g-w: min(calc(100vw - 2 * var(--g-side)), calc(var(--max-w) - 2 * var(--g-side)), calc((100vh - var(--g-chrome)) * 2 / 3));
}
@supports (height: 100svh) {
  :root { --g-w: min(calc(100vw - 2 * var(--g-side)), calc(var(--max-w) - 2 * var(--g-side)), calc((100svh - var(--g-chrome)) * 2 / 3)); }
}
/* Non-inherited, so changing them only restyles the track, not its 15 slides */
@property --g-i  { syntax: '<integer>'; inherits: false; initial-value: 0; }
@property --g-dx { syntax: '<length>';  inherits: false; initial-value: 0px; }

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-press: 0ms; --dur-fast: 0ms; --dur-modal: 0ms; --dur-base: 0ms; --dur-snap: 0ms;
    --dur-zone-fade: 0ms; --dur-reveal: 0ms; --dur-photo: 0ms; --dur-bokeh-intro: 0ms; --dur-draw: 0ms;
    --reveal-distance: 0px; --stagger: 0ms; --bulb-stagger: 0ms;
  }
  /* Infinite loops are switched off explicitly, not by a 0ms duration */
  .lights .bulb { opacity: 1; animation: none; }
  .bgm-ring::before { animation: none; transform: none; }
  .bgm-toggle[aria-pressed="true"] .bgm-ring { opacity: 0.8; }
  .scroll-cue::after { animation: none; transform: none; }
  .sprig :is(.sp-flower, .sp-stem, .sp-leaf) { stroke-dashoffset: 0; animation: none; }
  .sprig .sp-dot { opacity: 1; animation: none; }
  .bokeh-zone:not([data-bokeh="hero"]) .bokeh { display: none; }
}
```

**JS 쪽 분기**: `const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');`를 한 번 만들고, JS가 직접 쓰는 시간(lightbox 스냅·줌·열기/닫기, 보케 루프 시작 여부, hero 시퀀스 지연)은 `reducedMotion.matches`일 때 0 또는 생략한다. `change` 리스너로 런타임 전환을 새로고침 없이 반영한다(1-6).

**캐러셀 토큰 (2026-10-10 갤러리 캐러셀로 변경)**: 캐러셀 전환은 `--dur-snap`·`--ease-standard`, 이미지 로드 페이드는 `--dur-base`·`--ease-out`을 쓴다. 둘 다 위 reduce 블록에서 이미 0ms가 되므로 reduce 블록에 추가할 규칙은 없고, 캐러셀 JS에도 reduced 분기가 없다. `--g-*`는 모션 시간이 아니라 트랙 `transform` 계산에 쓰는 치수라 reduce에서도 그대로다. `@property`를 지원하지 않는 브라우저에서는 두 변수가 일반 상속 변수로 동작할 뿐 결과는 같다.

**토큰 사용 규칙**: 전역 `* { animation-duration: 0.01ms !important }` 같은 일괄 덮어쓰기는 쓰지 않는다. QA가 항목별로 대체안을 확인할 수 있도록 위처럼 토큰 0ms 재정의 + 루프별 개별 규칙으로 처리한다.

---

## 7. 구현 우선순위

| 우선순위 | 항목 |
|---|---|
| **Must** | 6 토큰 + reduced-motion CSS·JS 분기 + `html.js` 게이트 |
| **Must** | 1 보케 배경: 구간 3곳, 입자 상한, 겹침 방지, 정지 조건(구간 밖·탭 숨김·라이트박스), 1-6 정적 점 5개 |
| **Must** | 2-0 공통 섹션 reveal (안전장치 포함) |
| **Must** | 2-1 hero 로드 시퀀스 (사진 scale 금지) |
| **Must** | 3-1 sprig-divider stroke-draw 3곳 |
| **Must** | 3-2 string-lights 전구 호흡 (점등 시퀀스 제외) + 화면 밖 일시정지 |
| **Must** | 4-1 갤러리 캐러셀: 2:3 프레임(세로 cover, 가로 02·15 contain + surface 매트), peek 16px, transform 트랙(`--g-i`·`--g-dx`), 스와이프(8px 축 판정, 50px 또는 0.3px/ms, 양 끝 정지·저항 0.3, 350ms), `touch-action: pan-y pinch-zoom`, 이전/다음 버튼(`aria-disabled`) + "n / 15" 카운터, ←/→, click 억제, 접근성 구조(group·roledescription·inert·`.g-status` 낭독·포커스 이동), lightbox 같은 번호로 열기·닫으면 lightbox 번호로 동기화·포커스 복귀, `srcset`/`sizes` + 로딩 창(index −1 ~ +2), JS 꺼짐 scroll-snap 폴백 (2026-10-10 갤러리 캐러셀로 변경) |
| **Must** | 4-2 lightbox: 스와이프(판정식 `swipeTarget`을 캐러셀과 공유), 핀치 줌 1~3, 더블탭, 팬 clamp, 키보드(←/→/Esc), `showModal` 포커스 트랩, 캐러셀 현재 슬라이드로 포커스 복귀, 스크롤 잠금, 캐러셀 `currentSrc`→원본 교체·±1 로딩, 보케 정지 (2026-10-10 갤러리 캐러셀로 변경) |
| **Must** | 4-3 BGM 토글: 자동재생 없음, `preload="none"`, 꺼짐/켜짐 아이콘, `aria-pressed`, 탭 숨김 시 일시정지, 재생 실패 복구 |
| **Must** | 4-4 복사 피드백(계좌·주소·링크 공용): 버튼 라벨 전환 + 토스트 + `role="status"` 낭독 + execCommand·Selection 폴백 |
| **Must** | 4-5 D-day 한국 시간 계산과 표기 분기 |
| Should | 3-2 전구 점등 시퀀스 |
| Should | 4-3 BGM glow 링, 볼륨 페이드 |
| Should | 4-1 슬라이드 이미지 로드 페이드, 이웃(peek) 탭으로 이동 (2026-10-10 갤러리 캐러셀로 변경) |
| Should | 4-2 아래로 끌어 닫기, Android 뒤로가기 닫기 |
| Should | 4-4 계좌 접기 |
| Should | 4-6 카카오 공유 폴백, 4-7 길찾기, 4-8 방명록 상태 문구 |
| Should | 4-9 hero 스크롤 큐 |
| Should | 1-7 `window.__bokeh` QA 훅 |
| Nice-to-have | 4-2 `+`/`-`/`0` 키 줌, `ctrl + wheel` 줌 |
| Nice-to-have | 4-1 전환 중 잡기, 트랙패드 가로 휠 (2026-10-10 갤러리 캐러셀로 변경) |

---

## 8. 성능 예산 요약

| 무한 루프 | 도는 조건 | 멈추는 조건 | 방식 |
|---|---|---|---|
| 보케 hero / calendar / share | 구간이 뷰포트 가운데 70% 띠 안, 탭 보임, lightbox 닫힘, reduced 아님 | 하나라도 어긋나면 정지(구간 이탈만 600ms 페이드 후) | Canvas 2D 30fps, DPR 1 |
| 전구 호흡 | calendar가 뷰포트와 겹침, lightbox 닫힘 | `animation-play-state: paused` | CSS opacity (SVG `<g>` 7개) |
| BGM 링 | `aria-pressed="true"` | 끄면 제거 | CSS transform + opacity |
| 스크롤 큐 | 첫 `scrollY > 24` 전, lightbox 닫힘 | 스크롤 후 제거 | CSS transform |

- 한 화면에서 동시에 도는 루프는 최대 3개(hero: 보케 + 스크롤 큐 + BGM 링 / calendar: 보케 + 전구 + BGM 링).
- scroll 이벤트 리스너는 스크롤 큐 1개뿐(passive, 1회 후 해제). 나머지는 전부 IntersectionObserver·ResizeObserver.
- `will-change`는 lightbox·캐러셀 드래그 중 각 트랙에만 잠깐. 그 밖에는 쓰지 않는다. (2026-10-10 갤러리 캐러셀로 변경: 캐러셀 트랙 추가. 캐러셀은 무한 루프가 아니라 위 표에 넣지 않는다)
- 목표: Lighthouse Mobile Performance 90 이상, LCP 2.5초 이하(hero 227KB preload), CLS 0.05 이하, INP 200ms 이하, 보케 구간 스크롤 중 60fps 유지(DevTools 4x throttle에서 드롭 프레임 5% 이하).

---

## 9. 자산 협의 (image-artist)

보케는 Canvas에서 그리므로 **보케·꽃잎 이미지 자산은 필요 없다.** wreath는 애니메이션하지 않으므로 구조 요구가 없다. 아래 두 SVG만 구조를 맞춰 주면 된다. (작성 시점에 image-artist에게 직접 메시지를 보내지 못했으므로 오케스트레이터가 전달해야 한다.)

**sprig-divider** (`images/deco/sprig-divider.svg`, 3-1 시퀀스용):

1. 선으로 그리는 요소는 전부 `<path>`로 쓰고 `pathLength="1"`을 넣는다. `<circle>`·`<ellipse>`로 그린 윤곽선은 구형 Safari에서 `pathLength`가 무시되어 그리기가 중간에 끊긴다.
2. 클래스: 꽃잎 윤곽 `sp-flower`, 좌우 줄기 `sp-stem`, 잎 `sp-leaf sp-leaf--1`(꽃에 가장 가까운 쌍) / `sp-leaf sp-leaf--2` / `sp-leaf sp-leaf--3`(가장 바깥 쌍), 꽃 중심 점 `sp-dot sp-dot--center`, 줄기 끝 점 `sp-dot sp-dot--end`. 채움 점(`circle`)에는 `pathLength`가 필요 없다.
3. 줄기 path는 꽃 쪽에서 시작해 바깥 끝에서 끝나게 그린다(왼쪽 줄기도 가운데에서 왼쪽 끝으로). 그래야 가운데에서 바깥으로 자라는 모양이 된다.
4. `stroke-dasharray`·`stroke-dashoffset`·`style` 속성·`<style>` 블록은 넣지 않는다. CSS가 덮어써야 한다.

**string-lights** (`images/deco/string-lights.svg`, 3-2용):

1. 컨셉 시트대로 전구 그룹 7개에 `class="bulb"`. 전구 원과 후광 원이 같은 `<g class="bulb">` 안에 있어야 함께 숨 쉰다.
2. 7개 그룹은 같은 부모 아래 형제로 왼쪽부터 순서대로 두고, `data-i="0"`~`"6"`을 붙인다.
3. 그룹이나 원에 `opacity` 속성을 넣지 않는다(후광 원의 `fill-opacity="0.25"`는 괜찮다). 그룹 opacity는 CSS가 제어한다.

---

## 10. 접근성 체크리스트 (QA용)

- [ ] `prefers-reduced-motion: reduce`에서: 보케는 hero 정적 점 5개만(calendar·share 캔버스 숨김), 섹션·hero 즉시 표시, 디바이더 완성 상태, 전구 opacity 1 정지, BGM 링 정지, 스크롤 큐 정지 선, lightbox 전환 즉시, 캐러셀 전환·이미지 페이드 즉시(드래그 중 따라오기만 유지), 토스트·라벨 즉시 (2026-10-10 갤러리 캐러셀로 변경: 캐러셀 추가)
- [ ] 설정을 런타임에 바꿔도 새로고침 없이 전환되고 BGM이 끊기지 않는다
- [ ] JS가 꺼져도 모든 콘텐츠가 보이고 디바이더·전구가 완성 상태다(`html.js` 게이트)
- [ ] BGM이 로드·스크롤·첫 탭으로 시작되지 않고 토글로만 시작된다. 켜기 전 `bgm.mp3` 요청이 없다
- [ ] BGM 토글 `aria-pressed`가 실제 재생 상태와 일치하고, 꺼짐(사선 음표)과 켜짐(음표 + 링)이 모양으로 구분된다
- [ ] 3Hz 이상 점멸 없음. 가장 빠른 주기는 스크롤 큐 2.4초, 전구 4.2초, 보케 호흡 5초
- [ ] lightbox: `showModal` 포커스 트랩, Esc 닫기, 닫은 뒤 캐러셀이 lightbox에서 마지막으로 보던 번호로 맞춰지고 그 슬라이드 버튼으로 포커스 복귀, ←/→ 이동, "n / 15" `aria-live`, 슬라이드 alt, 포커스 링 `#FBF6F1` (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 구조: `.g-carousel`에 `role="group"` + `aria-roledescription="슬라이드"` + `aria-label`. 현재 슬라이드만 노출되고 나머지 14장은 `inert` + `aria-hidden="true"`(JS 꺼짐에서는 붙지 않음). 탭 순서는 현재 슬라이드 버튼 → 이전 → 다음 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 조작: 버튼 이름 "이전 사진"·"다음 사진", 처음·끝에서 `aria-disabled="true"`이고 포커스가 사라지지 않는다. 포커스가 캐러셀 안에 있을 때 ←/→로 이동한다. 버튼·스와이프로 바뀌면 `.g-status`가 "15장 중 n번째 사진, {alt}"를 읽는다. 슬라이드 버튼에서 ←/→를 누르면 포커스가 새 슬라이드 버튼으로 옮겨 가고 같은 내용을 두 번 읽지 않는다 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 제스처: 자동 넘김 없음. 캐러셀 위에서 시작한 세로 스크롤이 막히지 않는다(`touch-action: pan-y pinch-zoom`). 캐러셀 위에서도 페이지 핀치 확대가 된다. 마우스로 끌고 놓아도 lightbox가 열리지 않는다 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 시각: 사진 위에 화살표·글자·오버레이 없음, 이웃 사진 흐리게·축소 없음, 가로 사진 02·15 잘림 없음(contain), 이전/다음 버튼 터치 영역 44x44 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] viewport meta에 `user-scalable=no`·`maximum-scale=1` 없음
- [ ] 복사 성공·실패가 `role="status"` 영역으로 낭독된다(시각 토스트는 `aria-hidden`)
- [ ] 모든 아이콘 버튼 `aria-label`, 터치 영역 44x44 이상
- [ ] 장식 SVG·캔버스 모두 `aria-hidden="true"`

**보케 상한 자동 확인 (QA 참고)**: Playwright에서 hero·calendar·share 구간마다 10초씩 머물며 250ms 간격으로 `__bokeh.stats()`를 수집한다. `living ≤ 12`(768px 미만) / `≤ 16`, 구간별 수 ≤ 8, `maxPeak.glow ≤ 0.28`, `maxPeak.primary ≤ 0.18`, greeting·gallery·guestbook에 머무는 동안 `running`이 빈 배열인지, lightbox를 연 동안 `running`이 빈 배열인지 확인한다. 코드에서는 `BOKEH` 상수를 1-7 값과 grep으로 대조한다.

---

## 11. 한 줄 정리

배경은 hero·calendar·share의 background 위에서만 숨 쉬는 흐린 전구빛 보케(겹침 없음, glow 0.28·primary 0.18 이하, 모바일 12개 이하, 화면 밖·탭 숨김·라이트박스에서 정지)이고, 그 밖의 모션은 섹션 fade-in 하나와 디바이더 그리기·전구 호흡·BGM 링뿐이다. prefers-reduced-motion에서는 hero 여백의 정지한 점 5개만 남고 나머지는 모두 즉시 표시된다.
