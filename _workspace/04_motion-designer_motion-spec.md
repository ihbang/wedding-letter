---
motion_mood: "dreamy-soft"          # 카탈로그 C(별빛/반딧불이)를 작은 전구 불빛으로 변형 (2026-10-12 보케 B안)
density: "minimal"
background_animation: "bokeh-canvas" # 구간별 Canvas 2D 3개(hero, calendar, closing). 꽃잎·컨페티·하트 파티클 없음 (2026-10-12 보케 B안: share → closing)
performance_budget:              # (2026-10-12 보케 B안) 보케 항목 전면 교체. 값은 1장, 근거는 00_user-input.md "보케를 작은 전구 불빛으로"
  particles_max: 12                  # 화면 폭 768px 미만: 모든 구간 합산 동시 생존 불빛 상한
  particles_max_wide: 16             # 768px 이상
  particles_per_zone_max: 8
  zone_counts: { hero: 8, calendar: 8, closing: 8 }
  bokeh_core_diameter_px: [5, 9]     # 흰 심(#FFFCF8) 지름
  bokeh_halo_ratio: 3.6              # 후광 반지름 / 심 반지름. 스프라이트 지름 최대 32.4px
  bokeh_alpha_max: { core: 1.0, halo: 0.9 }   # 합성 후 최대 알파. 상한이 아니라 참고값이다. 글자 대비는 글자 영역 회피로 지킨다(1-3)
  bokeh_text_clearance_px: 13        # 그려진 불빛 정사각형과 제외 상자 사이 최소 거리 = EXCLUDE_MARGIN 8 + BOX_GAP 10 / 2
  bokeh_rise_max_px_s: 3
  bokeh_sway_max_px: 5
  bokeh_life_s: [9, 16]              # 앞뒤 1.2초 페이드 포함
  bokeh_twinkle: { depth: 0.5, period_s: [2.4, 4.8] }   # 밝기 1 <-> 0.5, 최대 0.42Hz
  bokeh_render_fps: 30               # 보케만 30fps로 그린다. 스크롤·제스처는 60fps 유지
  canvas_dpr: "min(devicePixelRatio, 2)"   # DPR 1 고정에서 변경. 심이 5~9px라 DPR 1이면 가장자리가 뭉개진다
  canvas_memory_mb_max: 14           # 캔버스 3개 합계, DPR 2. 실측 10.8~13.7MB(1-8)
  infinite_loops: ["bokeh (구간별, 조건부)", "string-lights 전구 호흡 (calendar 화면 안일 때만)", "BGM glow 링 (재생 중일 때만)", "hero 스크롤 큐 (첫 스크롤 전까지만)"]
  concurrent_loops_max: 3
  animated_props: ["transform", "opacity", "stroke-dashoffset (장식 SVG 단발 1회)", "canvas drawImage"]
  forbidden_props: ["width", "height", "top", "left", "margin", "padding", "filter", "box-shadow", "backdrop-filter", "background-position"]   # 예외: 방명록 긴 글 접기의 height 하나(4-8-1, 2026-10-14 사용자 결정)
  fps_target: 60
  reduced_motion_strategy: "static-only"   # 루프·트랜지션 전부 정지 또는 즉시. 손가락으로 직접 조작하는 드래그·핀치만 유지
concept_alignment:
  - "무드 '겨울 오후에 켜진 정원의 전구': 작은 전구 불빛이 거의 제자리에서 켜지고, 천천히 반짝이다가, 꺼진다. 이동보다 밝기 변화가 주된 움직임 (2026-10-12 보케 B안)"
  - "보케 수치는 00_user-input.md '보케를 작은 전구 불빛으로'(2026-10-12) 결정을 따른다. 이 결정은 컨셉 시트 motion_direction의 불투명도 상한·흰색 보케 금지·색 비율보다 우선한다. 개수(구간당 8, 합산 12/16)와 구간 수(3곳)는 컨셉 상한 안이다 (2026-10-12 보케 B안)"
  - "섹션 진입은 fade + translateY(12px→0) 800ms ease-out 하나로 통일. 예외는 컨셉이 지정한 hero 시퀀스, 디바이더 stroke-draw, 전구 호흡, BGM 링뿐"
  - "꽃잎·컨페티·하트 파티클, 패럴랙스, hero 확대·Ken Burns, 터치 반응 파티클, 사진 위 오버레이 효과 없음"
---

# Motion Specification: "Petal & Glow"

> **frontend-developer에게**: 이 문서의 수치는 그대로 구현 대상입니다. 6장 토큰을 먼저 `:root`에 넣고 모든 CSS 모션이 토큰을 참조하게 하세요. 1장 보케 상수는 코드에 `BOKEH` 객체로 같은 이름·값으로 옮겨야 QA가 grep으로 대조할 수 있습니다. 각 항목의 `reduced-motion` 줄은 CSS `@media (prefers-reduced-motion: reduce)`와 JS `matchMedia` 분기 양쪽에 구현합니다.
>
> **2026-10-10 변경 (갤러리 캐러셀)**: 3x5 썸네일 그리드를 한 장씩 옆으로 넘기는 캐러셀로 바꿨다(사용자 결정, `00_user-input.md` "갤러리 방식 변경"). 바뀐 곳은 2-5, 4-1(전면 교체), 4-2, 5, 6, 7, 8, 10이고 각 위치에 "(2026-10-10 갤러리 캐러셀로 변경)"을 붙였다. 나머지 절은 그대로다.
>
> **2026-10-12 변경 (보케 B안)**: 보케를 "작은 전구 불빛"(B안)으로 바꿨다(사용자 결정, `00_user-input.md` "보케를 작은 전구 불빛으로"). share/closing 분리(c6d4bdd)에 따라 보케 구간은 hero, calendar, closing이다. 글자 대비는 불투명도 상한 대신 글자 영역 회피(`data-bokeh-exclude="text"`)로 지킨다. 바뀐 곳은 frontmatter, 0, 1(전면 교체), 2-1, 2-6, 2-7, 2-8(신설), 3-1, 5, 7, 8, 10, 11이고 각 위치에 "(2026-10-12 보케 B안)"을 붙였다. 이 결정은 컨셉 시트 motion_direction의 보케 상한보다 우선한다.
>
> **2026-10-13 변경 (방명록 목록)**: 방명록에 공개 글 목록, 더보기, 본인 삭제가 생겼다(`_workspace/08_guestbook-list-design.md` 6장). 바뀐 곳은 2-6, 4-8-1(신설), 7이고 각 위치에 "(2026-10-13 방명록 목록)"을 붙였다.
>
> **2026-10-14 변경 (방명록 페이지 번호)**: 방명록 목록을 "말씀 더 보기"에서 한 페이지 5개 + 페이지 번호 방식으로 바꾸고, 3줄 넘는 글을 흐림 + 작은 화살표로 접어 글을 누르면 펼치게 했다(사용자 결정, `00_user-input.md` "방명록 목록을 페이지 번호 방식으로"). 긴 글 접기의 `height` 전환은 사용자가 원해 허용한 유일한 높이 애니메이션이다. 바뀐 곳은 frontmatter `forbidden_props` 주석과 4-8-1이고 바뀐 줄에 "(2026-10-14)"를 붙였다.

## 0. 모션 무드 결정

| 항목 | 결정 | 근거 |
|---|---|---|
| motion_mood | `dreamy-soft` | 첫 키워드 '로맨틱'의 기본값은 `romantic-lush`(꽃잎 24~40개)지만, 컨셉 시트가 꽃잎을 금지하고 카탈로그 C(빛)를 쓰라고 지시했다. 카탈로그 C의 무드는 `dreamy-soft`다. B안의 작은 전구 불빛은 카탈로그 C의 반짝이는 빛에 오히려 더 가깝다 (2026-10-12 보케 B안) |
| density | `minimal` | 구간당 8개, 모바일 합산 12개 이하. 불빛 하나의 심이 지름 5~9px라 화면에서 차지하는 면적은 이전 보케(지름 12~56px)보다 훨씬 작다 (2026-10-12 보케 B안) |
| 배경 모션 종류 | 1종 (보케: 작은 전구 불빛) | 장식 SVG 연출(디바이더 그리기, 전구 호흡)은 배경이 아니라 장식 요소에 붙는 모션이다 |
| 빛의 모양 | 바탕보다 밝은 흰 심 + glow 후광 | 이전 보케는 glow `#EBCB94`(L* 83)가 바탕 `#FBF6F1`(L* 97)보다 어두워서 빛을 그릴수록 바탕보다 어두운 얼룩이 생겼다. 사용자가 "디스플레이가 눌린 자국"이라고 한 원인이다. 심을 바탕보다 밝은 on_accent `#FFFCF8`로 채우고 그 둘레에만 glow를 둬야 빛으로 읽힌다 (2026-10-12 보케 B안) |
| 움직임의 성격 | 반짝임 > 위치 이동 | 불빛 하나가 9~16초 사는 동안 1.2초에 걸쳐 켜지고, 2.4~4.8초 주기로 밝기 1↔0.5를 오가다가, 1.2초에 걸쳐 꺼진다. 위로는 수명 내내 최대 48px, 좌우로는 ±5px만 움직여 거의 제자리다 (2026-10-12 보케 B안) |
| 글자 대비를 지키는 방법 | 글자 영역 회피 | 후광의 가장 진한 고리(glow 0.9) 위에서 muted 글자는 3.71:1이다. 불투명도를 낮춰 4.5:1을 맞추면 다시 흐린 얼룩이 된다. 그래서 상한 대신 불빛이 글자 줄 근처에 생기지 않게 한다(1-3) (2026-10-12 보케 B안) |
| 피하는 것 | 사진과 겹치는 파티클 | 07(컨페티), 04·05(비눗방울) 사진과 화면 파티클이 겹쳐 보이는 문제 때문에 꽃잎을 쓰지 않는다(컨셉 시트). hero 사진 위에도 불빛을 두지 않는다 |

---

## 1. 애니메이션 배경: 보케 (Must) (2026-10-12 보케 B안: 1장 전면 교체)

B안 "작은 전구 불빛"이다. 결정 기록은 `_workspace/00_user-input.md` "보케를 작은 전구 불빛으로", 시험 구현은 `scratchpad/bokeh-redesign/build/engine.js` + `build/cfg-b.js`에 있다. 1-7 코드는 시험 코드를 지금 `script.js` 구조에 맞춰 옮기고 시험에서 찾은 문제를 고친 것이며, 이 장의 수치는 모두 1-7 코드를 실제 페이지에 넣어 잰 값이다(1-8).

### 1-1. 구조

| 항목 | 값 |
|---|---|
| 방식 | 구간 섹션마다 `<canvas class="bokeh" aria-hidden="true">` 1개. 섹션 `position: relative; isolation: isolate`, 캔버스 `position: absolute; inset: 0; z-index: 0; pointer-events: none`, 섹션의 나머지 자식은 `position: relative; z-index: 1` (지금 CSS 그대로) |
| 구간 | `data-bokeh="hero"`, `data-bokeh="calendar"`, `data-bokeh="closing"` 세 섹션만. 공유하기(share)를 포함한 다른 섹션에는 캔버스를 두지 않는다 (2026-10-12 보케 B안: share → closing) |
| 이 구조를 고른 이유 | 캔버스가 섹션 안에 갇혀서 ① 다른 섹션·surface(카드, 사진 매트)·데스크톱 컬럼 바깥 면에 불빛이 나갈 수 없고 ② hero 사진(불투명 JPEG, z-index 1)이 항상 불빛 앞에 온다 |
| 해상도 | `BOKEH_DPR = min(devicePixelRatio, 2)`(로드 때 1회). `canvas.width = round(W × DPR)`, `canvas.height = round(H × DPR)`, `ctx.setTransform(DPR, 0, 0, DPR, 0, 0)` 뒤 CSS px 좌표로 그린다. CSS 크기는 섹션과 같다(`width/height: 100%`). DPR 1이면 5~9px 심의 가장자리가 뭉개지고, 3은 2와 눈으로 구분되지 않는데 메모리만 2.25배다 (2026-10-12 보케 B안: DPR 1 고정에서 변경) |
| 그리기 | 심 지름별 스프라이트(오프스크린 캔버스에 방사형 그라데이션 1회, 화면 DPR로 렌더, 지름 0.1px 단위로 캐시)를 `drawImage`로 찍는다. 프레임마다 `createRadialGradient`를 만들지 않는다 |
| 지우기 | 매 프레임 캔버스 전체가 아니라 직전 프레임에 찍은 스프라이트 사각형(사방 1px 여유)만 `clearRect`. 크기 변경, 정지 그림, 모드 전환 때만 전체를 지운다. DPR 2 캔버스(hero 780x1328 등)의 전체 지우기를 피하려는 것이다 |
| 프레임 | rAF 루프에서 33ms 미만 간격의 프레임은 건너뛴다(30fps). 가장 빠른 움직임이 가로 5.2px/s라 30fps에서 프레임당 0.17px 이하다 |
| dt | `dt = min((now - last) / 1000, 0.05)`. 재개 직후나 끊김 뒤에도 불빛이 순간 이동하지 않는다 |

### 1-2. 입자 파라미터

| 파라미터 | 값 | 이전 값 |
|---|---|---|
| 구간별 슬롯 수 | hero 8, calendar 8, closing 8 | hero 8, calendar 6, share 6 |
| 합산 동시 생존 상한 | 768px 미만 12, 768px 이상 16. 새 불빛은 전체 생존 수가 상한 미만일 때만 생긴다 | 같음 |
| 심 지름 d | 5~9px. 50%는 5~6, 35%는 6~7.5, 15%는 7.5~9 | 흐린 원 12~56px |
| 후광 반지름 R | `R = 3.6 × d / 2`. 최대 16.2px, 스프라이트 지름 최대 32.4px | 없음 |
| 그라데이션 | 중심에서 심 반지름 r의 배수로: 0~0.75r 심 `#FFFCF8` 알파 1 → 1.1r glow 0.9 → 1.6r glow 0.5 → 1.98r glow 0.2 → 2.88r glow 0.06 → 3.6r(=R) glow 0. 캔버스 color stop offset은 `배수 / 3.6`. R에서 알파 0이라 하드 엣지가 없다 | glow·primary 원 1.0 → 0 |
| 색 | 심 on_accent `#FFFCF8`(255,252,248), 후광 glow `#EBCB94`(235,203,148) 100%. primary 불빛은 없다 | glow 70 / primary 30 |
| 밝기 | `brightness = smoothstep(페이드) × 반짝임`, 최대 1. 캔버스 `globalAlpha`로 곱한다 | `peak × sin²`, peak 0.10~0.28 |
| 합성 후 최대 알파 | 심 1.0, 후광 0.9. **상한이 아니라 참고값**이다. 글자 대비는 1-3 회피로 지킨다 | glow 0.28 / primary 0.18 상한 |
| 수명 T | 9~16초(불빛마다 랜덤). 끝나면 0.4~1.6초 쉬었다가 다른 자리에서 다시 생긴다 | 호흡 5~9초, 쉼 0.6~2.4초 |
| 페이드 | 처음과 마지막 1.2초. `e = age / 1.2`(끝은 `(T − age) / 1.2`), `smoothstep = e²(3 − 2e)`. 생길 때와 사라질 때 밝기가 0이라 튀지 않는다 | sin² 곡선 |
| 반짝임 | `1 − 0.5 × (0.5 − 0.5 cos(2π · age / tw + φt))`, tw 2.4~4.8초. 밝기가 1과 0.5 사이를 오간다. 가장 빠른 것도 0.42Hz다 | 없음 |
| 상승 | v = 0~3px/s, `y = y0 − v × age`. 수명 동안 0~48px | 3~8px/s |
| 좌우 흔들림 | A = 2~5px, P = 6~10초, `x = x0 + A sin(2π · age / P + φ)`. 가로 최대 5.2px/s | 4~12px, 8~14초 |
| 가로 위치 | 구간 폭 전체에서 고르게 뽑는다. 가운데 글자 줄은 1-3 회피가 비운다 | 가장자리 띠 75% |

### 1-3. 겹침 방지와 글자 회피 (2026-10-12 보케 B안: 불투명도 상한 대신)

불빛 둘이 겹치면 진한 후광 고리가 겹쳐 얼룩이 되고, 글자 뒤에 고리가 오면 대비가 4.5:1 아래로 떨어진다(아래 대비 근거). 둘 다 **생성 시점에 수명 전체의 궤적 상자로 자리를 골라** 막는다.

| 항목 | 값 |
|---|---|
| 궤적 상자 | 가로 `x0 − A − R − 5` ~ `x0 + A + R + 5`, 세로 `y0 − v·T − R − 5` ~ `y0 + R + 5`. 5는 `BOX_GAP` 10의 절반 |
| 생성 조건 | ① 상자가 캔버스 안에 완전히 들어간다(구간 경계에서 후광이 잘리지 않게) ② 살아 있는 다른 불빛의 상자와 겹치지 않는다 ③ 제외 상자(사방 `EXCLUDE_MARGIN` 8px 확장)와 겹치지 않는다 |
| 시도 | 불빛 하나에 최대 14회 랜덤 시도. 9번째 시도(k ≥ 8)부터는 v = 0(제자리)으로 상자를 줄인다. 14회 모두 실패하면 0.4초 뒤 다시 |
| 최소 간격 | 그려진 불빛 정사각형(중심 ± R)끼리 10px 이상, 불빛 정사각형과 제외 상자 사이 13px 이상(8 + 5). 정사각형 가장자리에서 후광 알파는 이미 0이라 눈에 보이는 빛과 글자 사이는 이보다 넓다 |
| 결과 | 한 픽셀 위에 불빛은 최대 1개이고, 글자 줄 상자 위에는 불빛이 없다. 글자 대비는 바탕 위 값 그대로다 |

**제외 상자**: 구간 섹션 안 `[data-bokeh-exclude]` 요소를 섹션 기준 좌표로 잰다. reveal 대기 중인 요소는 `pendingShift`로 이동분(12px)을 빼고 최종 위치로 잰다.

| 대상 | 제외 상자 |
|---|---|
| `data-bokeh-exclude="text"` (새 값) | 요소 안 텍스트 노드마다 `Range.getClientRects()`가 주는 줄 상자. 공백뿐인 노드와 `.sr-only` 안 글자는 뺀다. 그래서 가운데 정렬된 짧은 줄 양옆 여백에는 불빛이 생길 수 있다 |
| `data-bokeh-exclude` (값 없음) | 요소의 `getBoundingClientRect()` 전체 |
| BGM 토글 (속성을 붙이지 않고 코드가 처리) | hero 구간만. 고정 버튼이 스크롤 0일 때 hero 위에 놓이는 자리: 버튼 사각형의 세로 위치에서 `scrollY`를 뺀다(`r.top − base.top − scrollY`). 첫 화면에서 버튼 뒤로 불빛이 비치지 않게 한다. calendar·closing에서는 버튼이 스크롤을 따라 움직여서 제외하지 않는다. 버튼 면이 불투명도 0.92라 뒤로 지나가는 불빛은 가려진다 |

**HTML에 붙일 속성** (구간 3곳, 모두 12개. 기존 3개(`.hero__photo`, `.lights`, closing `.sprig`)는 그대로 두고, wreath `<img>`의 속성은 `.monogram`으로 옮기고, 8개를 새로 붙인다):

| 구간 | 요소 | 속성 | 이유 |
|---|---|---|---|
| hero | `.hero__top` | `data-bokeh-exclude="text"` | eyebrow, 날짜, 요일·시간 줄 |
| hero | `.hero__photo` | `data-bokeh-exclude` (기존) | 사진 위 불빛 금지(컨셉) |
| hero | `.hero__bottom` | `data-bokeh-exclude="text"` | 이름, 한글 일시, 장소 줄 |
| hero | `.scroll-cue` | `data-bokeh-exclude` | 1px 선과 불빛이 겹치지 않게. 세로 640px 이하에서는 `display: none`이라 상자가 생기지 않는다 |
| calendar | `.section-head[data-lights-trigger]` | `data-bokeh-exclude="text"` | THE DAY, 예식일 |
| calendar | `.lights` | `data-bokeh-exclude` (기존) | 전구 후광과 불빛이 뭉개지지 않게 |
| calendar | `.calendar__when` | `data-bokeh-exclude="text"` | 한글 일시 |
| calendar | `.cal` | `data-bokeh-exclude` | 표는 칸 사이에 불빛이 끼지 않게 상자 전체로 뺀다 |
| calendar | `.dday` | `data-bokeh-exclude="text"` | 문장과 카운터. init 뒤 JS가 채우므로 1-5 재측정이 잡는다 |
| closing | `.sprig` | `data-bokeh-exclude` (기존) | 꽃가지 장식 |
| closing | `.monogram` | `data-bokeh-exclude` | wreath와 I & Y 전체. wreath `<img>`에 있던 속성은 `.monogram`으로 옮긴다 |
| closing | `.closing__thanks` | `data-bokeh-exclude="text"` | Thank you, 날짜, 이름 |
| 공통 | 나중에 세 구간에 들어오는 요소 | 글자 묶음은 `"text"`, 사진·카드·장식은 값 없음 | |

**대비 근거: 글자 영역 회피 + 겹친다고 가정한 최악값 (참고)**: 첫 줄이 회피로 보장되는 실제 값이고, 나머지 줄은 불빛이 글자 뒤에 **겹친다고 가정했을 때**의 값이다. 합성 색은 glow를 background `#FBF6F1` 위에 해당 알파로 섞은 색이다.

| 글자 뒤 픽셀 | 합성 색 | text | muted | accent | sage_deep |
|---|---|---|---|---|---|
| 바탕만 (회피 결과, 실제 값) | `#FBF6F1` | 12.26 | 5.17 | 5.45 | 5.44 |
| 심 (알파 1) | `#FFFCF8` | 12.87 | 5.43 | 5.72 | 5.71 |
| 후광 가장 진한 고리, 반짝임 최대 (1.1r, glow 0.9) | `#EDCF9D` | 8.80 | **3.71** | **3.91** | **3.90** |
| 같은 고리, 반짝임 최저 (0.9 × 0.5) | `#F4E3C7` | 10.42 | **4.40** | 4.63 | 4.62 |
| 1.6r (glow 0.5) | `#F3E1C3` | 10.23 | **4.32** | 4.54 | 4.54 |
| 1.98r (glow 0.2) | `#F8EDDE` | 11.41 | 4.82 | 5.07 | 5.06 |
| reduced 정지 그림의 고리 (0.9 × 0.85) | `#EFD5AA` | 9.26 | **3.91** | **4.11** | **4.11** |

- 굵은 값이 4.5:1 미달이다. muted·accent·sage_deep 글자가 후광 안쪽(1.6r 안)에 걸리면 기준에 못 미친다.
- 불투명도로 맞추려면 고리 알파를 muted 기준 0.39, accent 기준 0.52 아래로 낮춰야 한다. 그러면 B안의 빛이 사라지고 이전 보케의 흐린 얼룩으로 돌아간다. 그래서 상한 대신 회피로 지킨다.
- 심은 바탕보다 밝아서 겹치더라도 대비가 오히려 오른다.
- 이전 표(불투명도 상한 glow 0.28 / primary 0.18에서 muted 4.68 / 4.56)는 폐기한다.

### 1-4. 실행·정지 조건

| 상태 | 조건 | 동작 |
|---|---|---|
| 활성 | 섹션이 뷰포트 가운데 70% 띠와 겹침: `IntersectionObserver`, `rootMargin: '-15% 0px -15% 0px'`, `threshold: 0` | 캔버스에 `.is-on` → CSS `opacity 0→1` 600ms(`--dur-zone-fade`, linear), rAF 시작 |
| 구간 이탈 | 위 띠에서 벗어남 (다른 구간으로 스크롤) | `.is-on` 제거 → `opacity 1→0` 600ms, 600ms 뒤 rAF 정지. 그 사이 다시 들어오면 타이머 취소 |
| 탭 숨김 | `document.visibilityState === 'hidden'` | 즉시 rAF 정지(페이드 없음). 보이면 활성 구간만 재개 |
| 라이트박스 열림 | 4-2 lightbox `open` | 즉시 rAF 정지. 닫히면 재개 |
| reduced-motion | `matchMedia('(prefers-reduced-motion: reduce)')` | 루프를 만들지 않는다. 1-6 정지 그림 |
| 정지 중 상태 | 불빛 배열과 나이(age)를 그대로 둔다 | 재개하면 이어서 반짝인다 |

정지 사유는 `Set`(`'hidden'`, `'lightbox'`)으로 관리하고, `활성 && 사유 없음 && !reduced`일 때만 rAF를 돌린다.

- couple 섹션을 보는 동안 calendar가, 공유하기 섹션을 보는 동안 closing이 켜질 수 있다. 두 섹션이 짧아서 다음 보케 구간이 가운데 70% 띠에 들어오기 때문이고, 의도한 동작이다. 세로 844px 이상 화면에서는 greeting 아래쪽을 볼 때도 calendar가 켜진다 (2026-10-12 보케 B안: 실측)

### 1-5. 시작·크기 변경

| 항목 | 값 |
|---|---|
| 초기 배치 | 슬롯마다 불빛을 바로 만들고 나이를 `0 ~ T` 사이 랜덤으로 둔다(pre-seed). 켜지는 순간 이미 여러 단계의 불빛이 섞여 있다 |
| hero 첫 등장 | 2-1 시퀀스 600ms 시점부터 hero 캔버스 `opacity 0→1`을 1200ms(`--dur-bokeh-intro`)로. 첫 등장이 끝나면 일반 600ms 페이드로 바꾼다 |
| 크기 변경 | 섹션에 `ResizeObserver`, 150ms 디바운스. 캔버스 픽셀 크기를 DPR로 다시 맞추고, 전체를 지우고, 제외 상자를 다시 잰다. 폭이 바뀌었거나 높이가 40px 넘게 바뀌면 불빛을 모두 새로 pre-seed하고, 아니면 캔버스 밖으로 나가거나 제외 상자에 닿는 불빛만 지운다(`dropBlocked`) |
| 제외 상자 재측정 | 위 경우 + `document.fonts.ready` 후 1회 + hero 사진 `load` 후 1회 + 구간 안 `.reveal`이나 `[data-bokeh-exclude]` 요소의 **transform 전환이 끝날 때**(`transitionend`, `propertyName === 'transform'`, 구간별 100ms 디바운스 `SETTLE_DEBOUNCE`). 재측정 뒤 제외 상자에 닿는 불빛은 지우고 0.4초 뒤 다른 자리에 새로 만든다 (2026-10-12 보케 B안) |
| reveal 뒤 재측정을 `transitionend`로 하는 이유 | 시험 코드는 `revealed` 이벤트 900ms 뒤에 쟀다. 그런데 스크롤 큐는 reveal이 아니라 2-1의 1700ms에 `scaleY(0→1)`로 600ms 동안 펼쳐지고, 처음 잴 때는 높이가 0이다. 이 때문에 390x664 hero 300초 시뮬레이션에서 불빛이 스크롤 큐 상자를 288프레임 침범했고, `transitionend` 재측정으로 바꾼 뒤 0이 됐다. D-day 줄은 init 뒤 JS가 채우므로 `ResizeObserver`와 이 재측정이 함께 잡는다 |
| 창 resize 이벤트 | 쓰지 않는다. iOS 주소창 표시·숨김마다 발생해서 불필요하게 재배치된다 |

### 1-6. prefers-reduced-motion 정지 그림 (2026-10-12 보케 B안: 정적 점 5개 → 정지 불빛 7개)

- calendar, closing 캔버스는 숨긴다(`display: none`, 6장 CSS 그대로). 보케 없음.
- hero 캔버스에 **정지한 불빛 7개**(`STATIC_COUNT`)를 한 번 그린다. 루프·페이드·반짝임 없음, 캔버스 `opacity: 1`.
- 배치는 1-2·1-3과 같은 규칙(궤적 상자, 제외 상자, 최소 간격)으로 `spawn`을 부르되, 난수를 고정 시드 PRNG `mulberry32(5)`(`STATIC_SEED`)에서 받는다. 7개가 찰 때까지 최대 21번(7 × 3) 부른다. 각 불빛은 궤적 시작점 (x0, y0)에 밝기 0.85(`STATIC_ALPHA`)로 찍는다.
- 다시 그리는 때: 크기 변경, 제외 상자 재측정(폰트, 사진, 전환 끝). 그릴 때마다 시드를 처음부터 다시 쓰므로 **같은 레이아웃이면 새로고침해도 픽셀 단위로 같은 그림**이다. 스프라이트를 반올림한 지름으로 렌더하는 것도 이 때문이다(1-7).
- 정지 그림도 글자를 피한다. 정지 고리(0.9 × 0.85)가 글자에 걸리면 muted가 3.91이 된다(1-3 대비 근거).
- 이전 배치표(점 5개, `BOKEH_STATIC`)는 폐기한다.
- 런타임에 설정이 바뀌면(`change` 이벤트) 새로고침하지 않고 전환한다. reduce로 바뀌면 모든 루프 정지 → 캔버스 지움 → 정지 그림. 반대면 정지 그림 지움 → 시스템 시작. BGM 재생이 끊기지 않게 하기 위해서다.
- 시험 결과(1-8의 6개 화면): 모두 7개, 제외 상자 침범 0, 제외 상자까지 최소 13.2~24.7px. 두 번 로드한 hero 캔버스의 픽셀이 같았고, reduce → no-preference → reduce 전환 뒤에도 같은 그림이었다.

### 1-7. 참고 구현 (frontend가 옮길 기준 코드)

`script.js`의 보케 블록, 즉 `/* ---------- Bokeh background (spec 1) ---------- */`부터 `/* ---------- Section reveal (spec 2-0) ---------- */` 바로 앞까지를 아래 코드로 통째로 바꾼다. 함수 이름과 `initBokeh()`가 돌려주는 API(`pause`, `resume`, `openHeroGate`, `toStatic`, `toLive`, `stats`)가 지금 코드와 같아서 `initHero`, `initLightbox`, 부트 순서, `window.__bokeh` 줄은 고치지 않는다. 헬퍼 `rand`, `clamp`, `isReduced`는 파일 위쪽의 기존 것을 쓴다.

```js
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
```

**지금 `script.js`에서 바뀌는 것**

| 구분 | 내용 |
|---|---|
| `BOKEH` 값이 바뀌는 키 | `ZONES` `{ hero: 8, calendar: 8, closing: 8 }`, `SIZE_MIX` `[[0.50, 5, 6], [0.35, 6, 7.5], [0.15, 7.5, 9]]`, `RGB` `{ core: '255,252,248', glow: '235,203,148' }`, `GAP` `[0.4, 1.6]`, `RISE` `[0, 3]`, `SWAY` `[2, 5]`, `SWAY_PERIOD` `[6, 10]`, `BOX_GAP` 10, `EXCLUDE_MARGIN` 8, `TRIES` 14, `STILL_AFTER` 8 |
| `BOKEH`에 새로 생기는 키 | `HALO` 3.6, `PROFILE`(7단 그라데이션), `LIFE` `[9, 16]`, `FADE` 1.2, `TWINKLE_DEPTH` 0.5, `TWINKLE_PERIOD` `[2.4, 4.8]`, `DPR_MAX` 2, `SETTLE_DEBOUNCE` 100, `STATIC_COUNT` 7, `STATIC_SEED` 5, `STATIC_ALPHA` 0.85 |
| `BOKEH`에서 없어지는 키 | `D_MIN`, `D_MAX`, `CENTER_D_MAX`, `EDGE_BIAS`, `EDGE_BAND`, `GLOW_RATIO`, `ALPHA`, `BREATH`(→ `LIFE`), `DPR`(→ `DPR_MAX`) |
| 그대로인 키 | `MAX_TOTAL_MOBILE` 12, `MAX_TOTAL_WIDE` 16, `RETRY` 0.4, `FPS` 30, `ZONE_FADE` 600, `INTRO_FADE` 1200, `INTRO_DELAY` 600 |
| 없어지는 것 | `BOKEH_STATIC` 배열, `initBokeh` 안의 `sprites` 객체, primary 색 불빛 |
| 새 함수·상수 | `BOKEH_DPR`, `mulberry32`, `bokehSprites`, `brightness`, `lightX`, `lightY`, `drawLight`, `clearAll`, `excludeRects`, `initBokeh` 안 `dropBlocked` |
| 시그니처가 바뀌는 함수 | `makeSprite(rgb)` → `makeSprite(d)`, `pickDiameter(center)` → `pickDiameter(rng)`, `spawn(zone, preseed)` → `spawn(zone, preseed, rng = Math.random)`, `step(zone, dt, sprites, canSpawn)` → `step(zone, dt, canSpawn)` |
| 내용이 바뀌는 함수 | `measureExcludes`(→ `excludeRects`), `drawStatic`, `resize`, `remeasure`, `toStatic`, `toLive`, `stats` |
| HTML | 1-3 표의 속성 8개 추가, wreath `<img>`의 속성을 `.monogram`으로 이동 |
| CSS | 바꿀 것 없음 |

시험 코드(`build/engine.js` + `build/cfg-b.js`)와 다른 점: ① 스타일 분기(A·C안), 가랜드, 테스트 훅을 뺐다 ② 정지 그림용 PRNG를 전역 `rnd` 교체 대신 `spawn`의 `rng` 인자로 넘긴다 ③ reveal 뒤 재측정을 `revealed` + 900ms에서 `transitionend`로 바꿨다(1-5) ④ BGM 자리에 `scrollY` 보정을 넣었다(시험 코드는 스크롤 0에서만 맞았다) ⑤ 정지 불빛 7개를 최대 21번 시도해 채운다(7번만 시도하면 390x664에서 6개만 놓였다) ⑥ 스프라이트를 반올림한 지름으로 렌더한다(시험 코드는 처음 만든 불빛의 지름을 써서 새로고침마다 정지 그림 픽셀이 조금씩 달랐다) ⑦ 크기 변경 때 캔버스 전체를 지운다(지울 목록만 비우면 캔버스 크기가 그대로일 때 잔상이 남는다) ⑧ `.sr-only` 글자를 제외 대상에서 뺐다 ⑨ `stats()`에 회피 검증값을 넣었다.

**QA 확인용 훅 (Must)**: 부트의 `window.__bokeh = Object.freeze({ config: BOKEH, stats: () => bokeh.stats() })` 줄은 그대로 둔다. 글자 대비를 상수가 아니라 실행 중 회피로 지키므로, 이 훅이 회피를 자동으로 확인하는 유일한 방법이라 Must로 올린다. `stats()`가 돌려주는 값:

| 키 | 뜻 | 기대값 |
|---|---|---|
| `living` | 활성 구간에 살아 있는 불빛 수 | 768px 미만 12 이하, 이상 16 이하 |
| `zones` | `{ hero, calendar, closing }` 구간별 살아 있는 수 | 각 8 이하 |
| `still` | reduced 정지 그림의 불빛 수 | reduced에서 7, 아니면 0 |
| `running` | rAF가 그리고 있는 구간 이름 | 1-4 조건에 맞는 구간만 |
| `excludeHits` | 그려진 불빛 정사각형(중심 ± R)과 **호출 시점에 새로 잰** 제외 상자(여유 없음)가 겹친 쌍의 수 | 0 |
| `pairHits` | 불빛 정사각형끼리 겹친 쌍의 수 | 0 |
| `minExcludeGap` | 불빛 정사각형과 제외 상자 사이 최소 거리(px, 소수 첫째 자리). 불빛이 없으면 `null` | 13.0 이상 |

### 1-8. 보케 성능 예산 (2026-10-12 보케 B안)

| 항목 | 예산 | 실측 |
|---|---|---|
| 프레임당 작업 | 직전 자리 `clearRect` 최대 8회 + `drawImage` 최대 8회. 스크립트 시간 프레임당 1ms 이하(CPU 4x throttle) | 390 x 664(DPR 3 → 2)에서 평균 0.05ms 이하, 최대 0.2ms(1x), 0.7ms(4x), 1.5ms(6x). 모든 경우 30fps 유지 |
| 동시에 도는 캔버스 | 평소 1개. 두 구간이 동시에 띠 안에 들어와도 합산 상한이 불빛 수를 제한 | 6개 화면 모두 한 번에 1개 |
| 캔버스 메모리 | 3개 합계 DPR 2에서 14MB 이하 | 아래 표. 10.8~13.7MB |
| 스프라이트 메모리 | 0.3MB 이하 | 19~24장, 0.07~0.21MB |
| 금지 | 캔버스에 `filter: blur()`, `ctx.filter`, `shadowBlur` 사용 금지. 빛 번짐은 스프라이트 그라데이션으로만 | — |

캔버스 메모리(픽셀 크기 × 4바이트). DPR은 2에서 자른다:

| 화면 (CSS px, 기기 DPR) | hero | calendar | closing | 합계 |
|---|---|---|---|---|
| 390 x 664, DPR 3 (iPhone 14 Safari) | 780x1328, 3.95MB | 780x1684, 5.01MB | 780x986, 2.93MB | 11.9MB |
| 375 x 548, DPR 2 (iPhone SE Safari) | 750x1096, 3.14MB | 750x1684, 4.82MB | 750x986, 2.82MB | 10.8MB |
| 360 x 700, DPR 3 (Android) | 720x1400, 3.85MB | 720x1684, 4.63MB | 720x986, 2.71MB | 11.2MB |
| 430 x 750, DPR 3 | 860x1500, 4.92MB | 860x1684, 5.52MB | 860x986, 3.23MB | 13.7MB |
| 데스크톱 1280 x 900, DPR 1 (컬럼 480) | 480x900, 1.65MB | 480x842, 1.54MB | 480x493, 0.90MB | 4.1MB |

DPR 1 고정이던 이전 명세는 약 3.5MB였다. DPR 3을 자르지 않으면 430 x 750에서 30.8MB가 된다.

**명세 검증**: 1-7 코드와 1-3 속성을 지금 `index.html`·`script.js`·`style.css`에 넣은 시험 사이트를 headless Chrome에서 잰 값이다(2026-10-12). "실제 페이지"는 각 구간에서 10초 동안 250ms마다 `__bokeh.stats()`를 40번 읽은 결과, "시뮬레이션"은 같은 페이지에서 잰 제외 상자로 구간마다 300초(30fps, 9000프레임)를 돌린 결과다.

| 화면 | 구간 (크기, 제외 상자 수) | 최대 생존 | 평균 생존 | 평균 가시(밝기 > 0.3) | 제외 상자 침범 | 불빛끼리 겹침 | 경계 이탈 | 제외 상자까지 최소 | 불빛 사이 최소 |
|---|---|---|---|---|---|---|---|---|---|
| 390 x 664 | hero (390x664, 11) | 8 | 7.32 | 6.65 | 0 | 0 | 0 | 13.6px | 11.2px |
| 390 x 664 | calendar (390x842, 7) | 8 | 7.36 | 6.70 | 0 | 0 | 0 | 13.5px | 11.4px |
| 390 x 664 | closing (390x493, 5) | 8 | 7.41 | 6.75 | 0 | 0 | 0 | 13.1px | 10.4px |
| 375 x 548 | hero (375x548, 11) | 8 | 7.07 | 6.45 | 0 | 0 | 0 | 13.1px | 10.2px |
| 375 x 548 | calendar (375x842, 7) | 8 | 7.41 | 6.77 | 0 | 0 | 0 | 13.0px | 10.9px |
| 375 x 548 | closing (375x493, 5) | 8 | 7.41 | 6.76 | 0 | 0 | 0 | 13.3px | 12.3px |
| 360 x 700, 430 x 750, 390 x 844, 데스크톱 480 | 세 구간 모두 | 8 | 7.36~7.41 | 6.71~6.75 | 0 | 0 | 0 | 13.0~14.8px | 10.7~14.6px |

- 실제 페이지 샘플링(6개 화면 × 3구간): 구간별 최대 8, `excludeHits` 0, `pairHits` 0, `minExcludeGap` 13.5~34.7px, `running`은 그 구간 하나.
- `running`이 `[]`였던 위치(6개 화면 모두): greeting 머리, gallery·venue·notice·account·guestbook 머리와 머리 + 200px. lightbox를 연 동안과 탭을 숨긴 동안도 `[]`이고 그 사이 그린 프레임은 0이며, 닫거나 다시 보이면 `["hero"]`로 돌아온다(390 x 664에서 확인).
- 평소 눈에 띄는 불빛은 구간마다 6~7개다. 이전 보케(눈에 띄는 3~4개, 지름 12~56px)보다 개수는 많지만 하나하나가 작아서 density `minimal` 범위다.

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
- **reduced-motion**: 모든 요소 즉시 표시, 보케는 1-6 정지 불빛 7개(2026-10-12 보케 B안), 스크롤 큐는 정지한 선.

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

- 공통 reveal, 섹션당 최대 3그룹. 예: venue ① 헤더 ② 장소명·주소·주소 복사(2026-10-12 카드 없음) ③ 지도·길찾기 버튼·교통편 / account ① 헤더 ② 신랑측 ③ 신부측 / guestbook ① 헤더 ② 폼 + 공개 안내 ③ 목록 머리(제목 + 상태 문구). 목록 항목은 reveal 대상이 아니다(4-8-1) (2026-10-13 방명록 목록).
- 보케 구간(hero, calendar, closing)이 아니라 보케 없음 (2026-10-12 보케 B안).
- **reduced-motion**: 즉시 표시.

### 2-7. 공유하기 (보케 없음) (2026-10-12 보케 B안: share/closing 분리)

- 그룹 ① 헤더(eyebrow "SHARE", 제목 "공유하기", 안내 문구) ② 카카오톡 공유·링크 복사 버튼.
- 보케 구간이 아니다. 섹션이 짧아서 이 섹션을 보는 동안 바로 아래 맺음 섹션이 가운데 70% 띠에 들어와 closing 불빛이 켜질 수 있다(1-4). 이 섹션 안에는 불빛이 그려지지 않는다(캔버스가 맺음 섹션 안에 갇혀 있다).
- 버튼 누름은 5장, 복사 피드백은 4-4, 카카오 공유는 4-6.
- **reduced-motion**: 즉시 표시.

### 2-8. 맺음 (보케 구간, 마지막 섹션) (2026-10-12 보케 B안: share/closing 분리)

- 상단 sprig-divider는 3-1 stroke-draw.
- 그룹 ① 모노그램(wreath + "I & Y") ② "Thank you"(제목) + "2027.01.03" + "Inhyeok & Yumin". 맺음말 문장은 없다.
- 불빛은 꽃가지 장식, 모노그램, 글자 줄을 피해 그 둘레 여백에만 생긴다(1-3 제외 대상: `.sprig`, `.monogram`, `.closing__thanks`).
- 마지막 섹션이므로 2-0의 페이지 끝 안전장치(`.reveal-sentinel`)가 여기서 작동한다.
- **reduced-motion**: 즉시 표시. 이 구간 캔버스는 숨긴다(1-6).

---

## 3. 장식 SVG 연출

### 3-1. sprig-divider stroke-draw (Must)

| 항목 | 값 |
|---|---|
| 위치 | 컨셉 지정 3곳: greeting 하단, gallery 헤더 위, 맺음(closing) 상단(2026-10-12 보케 B안: share/closing 분리로 맺음 섹션으로 옮겨 갔다). 표시 폭 120px |
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

#### 4-8-1. 방명록 목록 (Should) (2026-10-13 방명록 목록, 2026-10-14 페이지 번호 방식)

설계 `08_guestbook-list-design.md` 6장의 목록·본인 삭제와 `00_user-input.md` "방명록 목록을 페이지 번호 방식으로"(한 페이지 5개, 페이지 번호 줄, 3줄 접기)에 붙는 모션이다. 기준은 설계 6-3: 나타날 때는 `opacity`만 바꾸고, 높이·위치 애니메이션은 쓰지 않는다(예외: 아래 "긴 글 접기"의 `height`, 2026-10-14 사용자 결정). 스크롤은 모두 즉시이고 부드러운 스크롤은 쓰지 않는다(5장 "쓰지 않는 것"). 새 토큰은 없다.

**안전선 (2026-10-14)**: 목록 제목과 항목에 `scroll-margin-top: calc(max(16px, env(safe-area-inset-top)) + 56px)`(보통 72px). 고정 머리글은 없고, 위에 고정된 것은 BGM 버튼(위 끝 `max(16px, safe-area)`, 높이 40)뿐이라 그 아래로 16px 띄운 선이다. 아래 표의 "안전선에 맞춘다"는 DOM을 바꾼 **뒤에** 요소의 `getBoundingClientRect().top`을 재서 이 값보다 작을 때만 `el.scrollIntoView({ block: 'start' })`(기본 동작이라 즉시)를 부르는 것이다. 안전선 아래에 보이면 스크롤하지 않는다. 바꾼 뒤에 재야 Chrome scroll anchoring이 먼저 위치를 옮겨도 결과가 같다. 글 접기만 접기를 시작할 때 잰다(높이가 350ms 동안 줄어들고, 항목 위 끝은 자기 높이와 상관없다).

| 상황 | 모션 | reduced-motion |
|---|---|---|
| 목록 도착 (2026-10-14) | 전체를 다 받은 뒤 1페이지 5건을 한 번에 넣고, 목록과 페이지 번호 줄(2페이지 이상일 때만 보임)을 함께 `opacity 0→1` 250ms(`--dur-modal`, `--ease-out`). **순차 등장 없음**: 5건이면 2-0의 stagger 상한(`--i` 2)을 넘고, 페이지를 넘길 때마다 반복되어 읽기를 늦춘다. 스크롤·포커스 이동 없음 | 즉시 표시 |
| 페이지 넘김: 번호, 이전·다음 (2026-10-14) | 기존 항목을 즉시 빼고 새 페이지 `li` 5개를 모두 `.is-new`로 넣어 함께 250ms 페이드. 퇴장 페이드·순차 등장·가로 슬라이드 없음. 새 페이지 항목은 모두 접힌 상태이고, 열려 있던 삭제 펼침은 버린다. 그다음 **목록 제목을 안전선에 맞춘다**(아래쪽 번호를 누른 사람이 새 페이지 첫 글부터 읽게). 포커스는 목록 제목(`tabindex="-1"`)으로 `focus({ preventScroll: true })`: 스크롤 위치와 포커스 위치가 같아지고, 스크린 리더는 새 목록 맨 앞부터 읽는다. 몇 페이지인지는 지금 `.gb-more-status` 자리의 `role="status"` 문구로 알린다(문구는 copy-writer). 현재 번호 표시와 번호 창(최대 5개) 이동은 즉시 바뀐다(움직이는 밑줄·슬라이드 없음). 이전·다음 비활성은 R6대로 `opacity 0.3` 정지 + `aria-disabled`, 누름 scale 없음(캐러셀 버튼과 같음) | 페이드 즉시. 스크롤·포커스는 같음 |
| 페이지마다 다른 높이 (2026-10-14) | 페이지 번호 줄이 페이지마다 다른 높이에 오는 것은 그대로 둔다. 가장 긴 페이지에 맞춘 `min-height`는 마지막 페이지(1~4건)에 빈 띠를 남기고, 글을 펼치면 어차피 맞지 않는다. 넘긴 뒤에는 제목부터 다시 읽으므로 버튼을 같은 화면 위치에 붙잡아 둘 이유가 약하다 | 해당 없음 |
| 글 펼치기 (2026-10-14) | 접힌 글(아래 "긴 글 접기")의 글 블록이나 화살표 버튼을 누르면 `height`를 3줄 높이에서 `scrollHeight`px로 350ms(`--dur-snap`, `--ease-standard`). 같은 시간·이징으로 흐림 `opacity 1→0`, 화살표 `rotate(0→180deg)`(위를 가리켜 다시 누르면 접힌다는 표시). 끝나면 `height: auto`. 스크롤 없음. 포커스는 옮기지 않는다(버튼으로 열었으면 버튼에 그대로) | 즉시 펼침. 흐림·화살표는 상태만 바뀜 |
| 글 접기 (2026-10-14) | 펼친 글 블록이나 화살표를 다시 누르면, 시작하는 순간 항목 위 끝을 재서 **안전선 위에 있으면 먼저 즉시 안전선에 맞춘다**. 긴 글을 끝까지 읽고 아래쪽에서 누르면 항목 위 끝이 이미 화면 위에 있어, 그대로 접으면 항목이 통째로 화면 위로 사라지기 때문이다. 그다음 `height` 지금 px → 3줄, 흐림 `0→1`, 화살표 `180→0deg`를 같은 350ms로. 항목 위 끝은 자기 높이와 상관없어 접는 동안 움직이지 않는다. 안전선 아래에 보이면 스크롤 없음. 포커스 이동 없음(안전선에 맞춘 뒤에도 화살표는 화면 안에 있다) | 즉시 접힘. 안전선 스크롤은 같음 |
| 새 글 전송 성공 | 기존 규칙에 맞춘다: 받아 둔 목록 맨 앞에 넣고 1페이지로 다시 그리되 새 글 항목만 250ms 페이드(나머지 4건은 즉시). 스크롤·포커스 이동 없음(알림은 4-8 상태 문구). 배경 강조·깜빡임 없음 | 즉시 표시 |
| 삭제 펼침 열기 | 펼침 영역(비밀번호 칸, 확인·취소)의 `hidden`을 풀어 바로 자리를 차지하게 하고 내용만 `opacity 0→1` 250ms(`--dur-modal`, `--ease-out`). 4-4 계좌 접기와 같은 방식이다. 포커스는 비밀번호 칸, "삭제" 버튼은 `aria-expanded="true"`. 다른 항목의 펼침이 열려 있으면 그쪽은 즉시 닫는다(한 번에 하나) | 즉시 표시 |
| 삭제 펼침 닫기(취소) | 즉시 `hidden`. 페이드 아웃하면 빈 띠가 남았다가 한 번에 줄어들어 오히려 튄다. 포커스는 그 항목의 "삭제" 버튼으로 | 같음 |
| 삭제 요청 중·실패 | 요청 중에는 확인·취소 버튼 `disabled`, 스피너 없음. 실패 문구는 입력칸 아래에 `opacity 0→1` 200ms(`--dur-fast`, `--ease-out`, 4-8 결과 문구와 같음). 흔들기(shake) 없음 | 즉시 표시 |
| 삭제 성공 | 항목에 `inert`를 붙이고 `opacity 1→0` 200ms(`--dur-fast`, `--ease-in`, 토스트 퇴장과 같음), `token('--dur-fast')`ms 뒤 `li`를 제거한다. 아래 항목은 애니메이션 없이 한 번에 올라온다. (2026-10-14) 같은 페이지를 다시 채우며, 다음 페이지에서 당겨 온 항목만 250ms 페이드(`.is-new`), 스크롤 없음. 포커스는 다음 항목, 없으면 목록 제목(`tabindex="-1"`). 그 페이지가 비면 이전 페이지로 가며 "페이지 넘김" 행(페이드·안전선·포커스)을 그대로 따른다 | 0ms이므로 바로 제거·표시 |
| 목록 상태 문구(불러오는 중, 글 없음, 오류 + 다시 시도) | 나타날 때 `opacity 0→1` 200ms(`--dur-fast`, `--ease-out`), 사라질 때 즉시. **스피너·스켈레톤 없음**: 불러오는 중은 문구만 보인다(4-8 "보내는 중", 4-3 BGM 로딩과 같은 원칙). 그래서 이 절에는 무한 루프가 없다 | 즉시 표시 |

**긴 글 접기 (2026-10-14, 사용자 결정)**: 펼치기·접기 글자 버튼 대신 셋째 줄 흐림과 작은 아래 화살표로 글이 더 있다는 것을 알리고, 글을 누르면 펼친다. **이 항목에 한해 `height` 애니메이션을 허용한다**(사용자 결정. frontmatter `forbidden_props`와 이 절 머리의 "높이 애니메이션 없음"에 대한 유일한 예외).

| 항목 | 값 |
|---|---|
| 대상과 측정 | `p.scrollHeight > 3줄 높이 + 1`인 글만 `.is-foldable`. 3줄 이하 글에는 흐림·화살표·버튼·글 클릭이 모두 없다(버튼 `hidden`). 페이지를 그릴 때, `document.fonts.ready` 뒤 한 번, `.gb-list` **너비**가 바뀔 때(ResizeObserver. 펼치는 동안 높이 변화로 매 프레임 불리므로 너비만 비교) 다시 잰다. 다시 잴 때 펼친 글은 펼친 채 두고, 3줄 이하가 되면 접기 장치를 뗀다 |
| 접힌 높이 | `height: calc(3em * 1.7)`(14px / 1.7 세 줄 = 71.4px) + `overflow: hidden`. `-webkit-line-clamp`는 쓰지 않는다: 높이 전환이 되지 않고, 말줄임표가 흐림과 겹친다 |
| 흐림 | 말씀 `p`의 `::after`: 아래 끝 한 줄 높이(`1.7em`)에 `linear-gradient(transparent, var(--color-bg))`. 셋째 줄이 바탕으로 사라진다. 방명록 바탕이 background라(R1) 색이 맞는다. `filter: blur`·`backdrop-filter`는 쓰지 않는다(5장 금지, 번진 글자는 지난 보케처럼 화면 결함으로 읽힌다) |
| 화살표 버튼 | `<button type="button" class="gb-fold" aria-expanded="false" aria-controls="{말씀 p id}">`, 접근성 이름은 카피 키 `gb-expand-aria` / 펼친 뒤 `gb-collapse-aria`, 보이는 글자 없음. 인라인 SVG 16px(`viewBox="0 0 16 16"`, path `M3 6l5 5 5-5`), stroke accent 1.4px, round cap(BGM 아이콘과 같은 선). 글 아래 가운데. 버튼 상자 24x24에 `margin: 4px auto -4px`(화살표가 글 아래 8px, 항목 아래 선 위 16px), `::before { inset: -10px }`로 터치 영역 44x44(BGM 버튼과 같은 방식). accent는 bg 위 5.45:1(R9, 비텍스트 3:1 충족). 누름은 5장 공통 |
| 글 블록 클릭 | 말씀 `p`의 click이 같은 토글을 부른다. 포인터 사용자용 보조 경로이고, 탭 순서에는 화살표 버튼 하나뿐이다. 블록 안에 선택된 글자가 있거나(`!getSelection().isCollapsed`) `event.detail > 1`(더블클릭 단어 선택)이면 무시한다: 글자를 고르려는 드래그는 펼침으로 처리하지 않는다. `cursor: pointer`, `-webkit-tap-highlight-color: transparent`, 글 블록 누름 효과 없음(펼쳐지는 것이 피드백) |
| 높이 전환 구현 | 측정한 px로 `height` 전환을 권한다. 펼침: 인라인 `height`를 `scrollHeight`px로. 접힘: 지금 높이 px를 인라인으로 넣고 `offsetHeight`로 reflow한 뒤 인라인을 지워 3줄 높이로. 끝 처리(펼침 뒤 `height: auto`)는 `transitionend` 대신 `token('--dur-snap') + 50`ms 타이머로 한다(0ms 전환에는 이벤트가 오지 않는다). 전환 중에 다시 누르면 지금 높이에서 반대로 간다. `grid-template-rows: 0fr→1fr`는 0에서 시작하는 접기용이라 3줄에서 시작하는 이 경우에 맞지 않고, `interpolate-size`는 Safari가 지원하지 않는다. 매 프레임 레이아웃이 생기지만 한 번에 한 항목이고 아래쪽은 목록 4건 이하, 페이지 번호 줄, 짧은 섹션 2개뿐이다. `will-change` 없음 |
| reduced-motion | `--dur-snap` 0ms(6장 reduce 블록)라 높이·흐림·화살표가 즉시 바뀐다. 추가 규칙 없음 |

- **reveal과의 관계**: guestbook reveal 그룹은 ① 머리 ② 폼 + 공개 안내 ③ 목록 머리(제목 h3 + 상태 문구)다(2-6). `ul`과 페이지 번호 줄은 reveal 대상이 아니고 항목에도 `.reveal`을 붙이지 않는다(2026-10-14). reveal IO는 초기화 때 있던 그룹만 관찰하는데 목록은 나중에 채워지고 페이지마다 다시 그려지기 때문이다. 항목은 위 표의 페이드로만 나타난다. JS가 꺼지면 목록 자체를 숨기므로(설계 6-1) `html.js` 게이트는 따로 두지 않는다.
- reduced-motion: 6장 reduce 블록이 `--dur-modal`·`--dur-fast`·`--dur-snap`을 이미 0ms로 바꾸므로 추가 규칙이 없다. 스크롤은 원래 즉시라 두 모드가 같다(2026-10-14). 런타임 전환도 토큰을 따라간다.
- 포커스 이동과 안전선 스크롤은 접근성 요구사항이라 모션 우선순위(Should)와 상관없이 구현한다. 삭제 성공은 설계 6-2에 있고, 펼침 열기·닫기, 페이지 넘김, 글 접기는 이 절에서 정했다(2026-10-14).
- 버튼 누름(삭제, 확인, 취소, 페이지 번호, 이전·다음, 접기 화살표, 다시 시도)은 5장 공통 규칙을 따른다(2026-10-14). 바뀌는 속성은 opacity, 화살표 transform, 긴 글 접기의 height뿐이고 무한 루프가 늘지 않는다(8장 표 그대로). 방명록은 보케 구간이 아니다.

```css
/* Guestbook list (motion spec 4-8-1). Class names are examples. */
@keyframes gb-in { from { opacity: 0; } }
.gb-item.is-new, .gb-del:not([hidden]) { animation: gb-in var(--dur-modal) var(--ease-out); }
.gb-list-state:not([hidden]), .gb-del__error:not(:empty) { animation: gb-in var(--dur-fast) var(--ease-out); }
.gb-item.is-leaving { opacity: 0; transition: opacity var(--dur-fast) var(--ease-in); }

/* 2026-10-14 pagination and long-message fold */
.gb-pager:not([hidden]) { animation: gb-in var(--dur-modal) var(--ease-out); }
.gb-list-title, .gb-item { scroll-margin-top: calc(max(16px, env(safe-area-inset-top)) + 56px); } /* below the fixed BGM toggle */
.gb-item__message.is-foldable {
  position: relative;
  height: calc(3em * 1.7);            /* 3 lines at 14px / 1.7; script sets px while moving, auto when open */
  overflow: hidden;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: height var(--dur-snap) var(--ease-standard);
}
.gb-item__message.is-foldable::after { /* third line fades into the page background */
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1.7em;
  background: linear-gradient(transparent, var(--color-bg));
  pointer-events: none;
  transition: opacity var(--dur-snap) var(--ease-standard);
}
.gb-item__message.is-open::after { opacity: 0; }
.gb-fold {
  position: relative; display: block; width: 24px; height: 24px; margin: 4px auto -4px;
  padding: 4px; border: 0; background: none; color: var(--color-accent);
}
.gb-fold::before { content: ""; position: absolute; inset: -10px; } /* 44 x 44 hit area */
.gb-fold svg { display: block; width: 16px; height: 16px; transition: transform var(--dur-snap) var(--ease-standard); }
.gb-fold[aria-expanded="true"] svg { transform: rotate(180deg); }
```

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
| 보케 캔버스 | 구간 진입·이탈 | 캔버스 opacity | 600ms (hero 첫 등장 1200ms) | linear | 정지 불빛 7개(hero만) (2026-10-12 보케 B안) |
| 보케 불빛 (2026-10-12 보케 B안) | 생성·소멸 / 반짝임 | 캔버스 `globalAlpha`(밝기) | 페이드 1.2s / 주기 2.4~4.8s | smoothstep / cos | 정지 그림(밝기 0.85) |

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
| **Must** | 1 보케 배경 B안 (2026-10-12 보케 B안): 구간 3곳(hero·calendar·closing), 구간당 8·합산 12/16, 흰 심 + glow 후광 스프라이트, 페이드·반짝임, 궤적 상자 겹침 방지(`BOX_GAP` 10), 글자 회피(`data-bokeh-exclude="text"` 줄 상자 / 값 없는 요소 상자, 1-3의 속성 12개, hero BGM 자리, `transitionend` 재측정), 캔버스 DPR `min(dpr, 2)`, 정지 조건(구간 밖·탭 숨김·라이트박스), 1-6 정지 불빛 7개(고정 시드) |
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
| Should | 4-6 카카오 공유 폴백, 4-7 길찾기, 4-8 방명록 상태 문구, 4-8-1 방명록 목록 모션 (2026-10-13 방명록 목록) |
| Should | 4-9 hero 스크롤 큐 |
| **Must** | 1-7 `window.__bokeh` QA 훅과 `stats()`의 회피 검증값(`excludeHits`, `pairHits`, `minExcludeGap`, `still`). 대비를 실행 중 회피로 지키므로 Should에서 올렸다 (2026-10-12 보케 B안) |
| Nice-to-have | 4-2 `+`/`-`/`0` 키 줌, `ctrl + wheel` 줌 |
| Nice-to-have | 4-1 전환 중 잡기, 트랙패드 가로 휠 (2026-10-10 갤러리 캐러셀로 변경) |

---

## 8. 성능 예산 요약

| 무한 루프 | 도는 조건 | 멈추는 조건 | 방식 |
|---|---|---|---|
| 보케 hero / calendar / closing (2026-10-12 보케 B안) | 구간이 뷰포트 가운데 70% 띠 안, 탭 보임, lightbox 닫힘, reduced 아님 | 하나라도 어긋나면 정지(구간 이탈만 600ms 페이드 후) | Canvas 2D 30fps, DPR `min(dpr, 2)`, 직전 자리만 지우기 |
| 전구 호흡 | calendar가 뷰포트와 겹침, lightbox 닫힘 | `animation-play-state: paused` | CSS opacity (SVG `<g>` 7개) |
| BGM 링 | `aria-pressed="true"` | 끄면 제거 | CSS transform + opacity |
| 스크롤 큐 | 첫 `scrollY > 24` 전, lightbox 닫힘 | 스크롤 후 제거 | CSS transform |

- 한 화면에서 동시에 도는 루프는 최대 3개(hero: 보케 + 스크롤 큐 + BGM 링 / calendar: 보케 + 전구 + BGM 링).
- 보케 캔버스 메모리는 3개 합계 DPR 2에서 14MB 이하(실측 10.8~13.7MB), 보케 스크립트는 프레임당 1ms 이하(4x throttle 실측 최대 0.7ms). 자세한 값은 1-8 (2026-10-12 보케 B안).
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

- [ ] `prefers-reduced-motion: reduce`에서: 보케는 hero 정지 불빛 7개만(calendar·closing 캔버스 숨김, 2026-10-12 보케 B안), 섹션·hero 즉시 표시, 디바이더 완성 상태, 전구 opacity 1 정지, BGM 링 정지, 스크롤 큐 정지 선, lightbox 전환 즉시, 캐러셀 전환·이미지 페이드 즉시(드래그 중 따라오기만 유지), 토스트·라벨 즉시 (2026-10-10 갤러리 캐러셀로 변경: 캐러셀 추가)
- [ ] 설정을 런타임에 바꿔도 새로고침 없이 전환되고 BGM이 끊기지 않는다
- [ ] JS가 꺼져도 모든 콘텐츠가 보이고 디바이더·전구가 완성 상태다(`html.js` 게이트)
- [ ] BGM이 로드·스크롤·첫 탭으로 시작되지 않고 토글로만 시작된다. 켜기 전 `bgm.mp3` 요청이 없다
- [ ] BGM 토글 `aria-pressed`가 실제 재생 상태와 일치하고, 꺼짐(사선 음표)과 켜짐(음표 + 링)이 모양으로 구분된다
- [ ] 3Hz 이상 점멸 없음. 가장 빠른 주기는 보케 반짝임 2.4초(0.42Hz)와 스크롤 큐 2.4초, 그다음 전구 4.2초. 보케 페이드(1.2초)는 불빛마다 9~16초 수명에 한 번씩 켜지고 꺼지는 것이다 (2026-10-12 보케 B안)
- [ ] lightbox: `showModal` 포커스 트랩, Esc 닫기, 닫은 뒤 캐러셀이 lightbox에서 마지막으로 보던 번호로 맞춰지고 그 슬라이드 버튼으로 포커스 복귀, ←/→ 이동, "n / 15" `aria-live`, 슬라이드 alt, 포커스 링 `#FBF6F1` (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 구조: `.g-carousel`에 `role="group"` + `aria-roledescription="슬라이드"` + `aria-label`. 현재 슬라이드만 노출되고 나머지 14장은 `inert` + `aria-hidden="true"`(JS 꺼짐에서는 붙지 않음). 탭 순서는 현재 슬라이드 버튼 → 이전 → 다음 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 조작: 버튼 이름 "이전 사진"·"다음 사진", 처음·끝에서 `aria-disabled="true"`이고 포커스가 사라지지 않는다. 포커스가 캐러셀 안에 있을 때 ←/→로 이동한다. 버튼·스와이프로 바뀌면 `.g-status`가 "15장 중 n번째 사진, {alt}"를 읽는다. 슬라이드 버튼에서 ←/→를 누르면 포커스가 새 슬라이드 버튼으로 옮겨 가고 같은 내용을 두 번 읽지 않는다 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 제스처: 자동 넘김 없음. 캐러셀 위에서 시작한 세로 스크롤이 막히지 않는다(`touch-action: pan-y pinch-zoom`). 캐러셀 위에서도 페이지 핀치 확대가 된다. 마우스로 끌고 놓아도 lightbox가 열리지 않는다 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] 캐러셀 시각: 사진 위에 화살표·글자·오버레이 없음, 이웃 사진 흐리게·축소 없음, 가로 사진 02·15 잘림 없음(contain), 이전/다음 버튼 터치 영역 44x44 (2026-10-10 갤러리 캐러셀로 변경)
- [ ] viewport meta에 `user-scalable=no`·`maximum-scale=1` 없음
- [ ] 복사 성공·실패가 `role="status"` 영역으로 낭독된다(시각 토스트는 `aria-hidden`)
- [ ] 모든 아이콘 버튼 `aria-label`, 터치 영역 44x44 이상
- [ ] 장식 SVG·캔버스 모두 `aria-hidden="true"`
- [ ] 보케 제외 속성 12개가 1-3 표대로 붙어 있다: `document.querySelectorAll('[data-bokeh] [data-bokeh-exclude="text"]').length === 6`(`.hero__top`, `.hero__bottom`, calendar `.section-head`, `.calendar__when`, `.dday`, `.closing__thanks`), 값 없는 것 6개(`.hero__photo`, `.scroll-cue`, `.lights`, `.cal`, closing `.sprig`, `.monogram`). wreath `<img>`에는 없다 (2026-10-12 보케 B안)
- [ ] 보케 불빛이 글자 줄, hero 사진, 장식, 첫 화면의 BGM 버튼 위에 그려지지 않는다(아래 자동 확인의 `excludeHits === 0`) (2026-10-12 보케 B안)

**보케 상한·회피 자동 확인 (QA 참고) (2026-10-12 보케 B안)**: Playwright(또는 CDP)로 아래를 잰다. 화면은 최소 390 x 664(DPR 3)와 375 x 548(DPR 2) 두 가지, 가능하면 768px 이상 하나를 더한다. 확인값은 1-7 코드로 1-8에서 실제로 잰 값이다.

| # | 방법 | 통과 기준 |
|---|---|---|
| 1 | 로드 4.2초 뒤 hero(스크롤 0), calendar·closing(섹션 머리로 스크롤 후 2.6초)에서 10초 동안 250ms마다 `__bokeh.stats()` 40회 | 모든 샘플에서 `living ≤ 12`(768px 미만) / `≤ 16`, `zones`의 각 값 ≤ 8, `excludeHits === 0`, `pairHits === 0`, `minExcludeGap`이 `null`이거나 13.0 이상, `running`이 그 구간 이름 하나 |
| 2 | gallery·venue·notice·account·guestbook 머리, 그리고 머리 + 200px로 스크롤해 1.3초 뒤 `stats().running` | `[]`. couple을 볼 때 `["calendar"]`, 공유하기를 볼 때 `["closing"]`, 세로 844px 이상에서 greeting 아래쪽을 볼 때 `["calendar"]`는 의도한 동작이므로 FAIL이 아니다(1-4) |
| 3 | hero에서 lightbox 열기, 탭 숨김(`visibilitychange`) | 그동안 `running`이 `[]`, 닫거나 다시 보이면 `["hero"]` |
| 4 | 각 구간 캔버스의 `width`·`height` | `Math.round(섹션 clientWidth × Math.min(devicePixelRatio, 2))`, 높이도 같은 식. 390 x 664 DPR 3이면 hero 780 x 1328, calendar 780 x 1684, closing 780 x 986 |
| 5 | reduced-motion으로 로드 2.5초 뒤 `stats()` | `still === 7`, `running` `[]`, `excludeHits === 0`, `minExcludeGap ≥ 13`. calendar·closing 캔버스 `display: none`, hero 캔버스 `opacity: 1` |
| 6 | reduced-motion으로 같은 창 크기에서 두 번 로드해 hero 캔버스 `getImageData` 비교 | 픽셀이 같다(고정 시드) |
| 7 | 로드 뒤 reduce → no-preference → reduce 전환(새로고침 없이) | no-preference에서 `running` `["hero"]`·`still` 0, 다시 reduce에서 `still` 7이고 그림이 6번과 같다. BGM이 끊기지 않는다 |
| 8 | `script.js`의 `BOKEH`와 `__bokeh.config`를 1-7과 대조 | 1-7 "지금 `script.js`에서 바뀌는 것" 표의 키와 값이 그대로다. 없어진 키(`D_MIN`, `GLOW_RATIO`, `ALPHA`, `BREATH`, `DPR` 등)가 남아 있지 않다. 코드에 `primary` 불빛, `ctx.filter`, `shadowBlur`가 없다 |
| 9 | DevTools Performance, CPU 4x throttle, 각 구간 5초 | 보케 rAF 콜백이 프레임당 1ms 이하, 30fps 유지 |

---

## 11. 한 줄 정리

배경은 hero·calendar·closing의 background 위에서 거의 제자리에서 반짝이는 작은 전구 불빛(흰 심 + glow 후광, 구간당 8개, 모바일 합산 12개 이하, 서로 겹치지 않고 글자·사진·장식에서 13px 이상 떨어짐, 화면 밖·탭 숨김·라이트박스에서 정지)이고, 그 밖의 모션은 섹션 fade-in 하나와 디바이더 그리기·전구 호흡·BGM 링뿐이다. prefers-reduced-motion에서는 hero에 정지한 불빛 7개만 남고 나머지는 모두 즉시 표시된다. (2026-10-12 보케 B안)
