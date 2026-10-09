---
motion_mood: "calm-minimal"
density: "minimal"
background_animation: "none"                # 컨셉 시트 결정: 상시 배경 애니메이션(파티클·꽃잎·메시·반딧불이) 사용 안 함
performance_budget:
  particles_max: 0
  infinite_loops_max: 1                     # 음악 재생 중 이퀄라이저 3바만 허용. 그 외 무한 루프 없음
  concurrent_transitions_max: 4             # 동시에 진행되는 reveal 트랜지션 상한 (섹션 1개 분량)
  animated_props: ["transform", "opacity"]
  forbidden_props: ["width", "height", "top", "left", "margin", "padding", "filter", "box-shadow", "background-position"]
  fps_target: 60
  reduced_motion_strategy: "static-only"    # transform 전부 제거, 즉시 표시. 사용자가 직접 조작하는 제스처(스와이프·핀치)만 유지
concept_alignment:
  - "클래식·미니멀·차분한 → 움직임은 스크롤 진입 fade-in(opacity + translateY 16px→0, 800ms ease-out) 하나로 통일"
  - "사진이 주인공 → 히어로 사진 settle(scale 1.04→1.0, 2.4s) 1회 외에 사진 위 효과 없음. blur·색 오버레이·ken-burns 루프 금지"
  - "기능 위주 인터랙션 → lightbox 스와이프·핀치 줌, 계좌 복사 라벨 전환, 음악 토글. 카운트업·펄스·ripple·토스트 없음"
---

# Motion Specification: "Warm Paper & Ink"

> **frontend-developer에게**: 수치는 그대로 구현 대상이다. 5장의 CSS 토큰을 먼저 `:root`에 정의하고 모든 모션이 토큰을 참조하게 한다. 각 항목의 `reduced-motion` 줄은 `@media (prefers-reduced-motion: reduce)`와 JS `matchMedia` 분기 양쪽에서 구현한다.

### 모션 무드 결정 근거

- 스킬 매핑표 기준으로 첫 키워드 "클래식"은 `elegant-classic`(SVG stroke-draw + 마스킹 텍스트 리빌)이다. 그러나 컨셉 시트 `motion_mood_hint`가 "상시 배경 애니메이션 없음, 섹션 진입 fade-in 하나로 통일"을 명시하므로, 움직임의 양과 종류는 `calm-minimal`을 따른다.
- `calm-minimal`의 대표 배경인 그라디언트 메시도 쓰지 않는다. 바탕은 `--color-bg #F8F5F0` 단색이다.
- 마스킹 텍스트 리빌, split char, stroke-draw, stagger 6단계 이상, scale-in, blur reveal은 쓰지 않는다.

---

## 1. 애니메이션 배경

**사용하지 않는다.** 컨셉 시트 "모션 디자이너에게 가이드"의 결정을 따른다.

| 항목 | 값 |
|------|-----|
| Canvas / 파티클 | 없음. `<canvas>` 요소를 만들지 않는다 |
| 그라디언트 메시·패럴랙스 | 없음 |
| 페이지 바탕 | `body { background: var(--color-bg); }` 단색 |
| 히어로 텍스트 가독성 그라디언트 | 정적. `linear-gradient(to bottom, rgba(248,245,240,0.55) 0%, rgba(248,245,240,0) 38%)`를 히어로 사진 위 `::before`로 얹는다. 애니메이션 없음 |
| reduced-motion | 해당 없음 (정적이므로 동일) |

---

## 2. 스크롤 시퀀스

### 2-0. 공통 reveal 규칙 (모든 섹션)

**효과는 하나다**: `opacity 0→1` + `translateY(16px→0)`, `var(--dur-reveal)` 800ms, `var(--ease-out)`.

| 항목 | 값 |
|------|-----|
| 트리거 | `IntersectionObserver`, `threshold: 0.15`, `rootMargin: "0px 0px -10% 0px"` |
| 반복 | 1회. 진입 후 `unobserve`. 위로 다시 스크롤해도 숨기지 않는다 |
| 단위 | 섹션당 최대 3개 그룹: ① 섹션 라벨(영문) + 한글 제목 + 디바이더 ② 본문 ③ 버튼·부가 정보 |
| stagger | 그룹 간 `var(--stagger)` 120ms. `transition-delay: calc(var(--i) * var(--stagger))`, `--i`는 0~2 |
| 클래스 | 대상 요소 `.reveal`, 진입 시 `.is-visible` 부여 |
| will-change | 지정하지 않는다 (transform/opacity 단발 트랜지션이라 불필요) |

```css
.js .reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--dur-reveal) var(--ease-out),
    transform var(--dur-reveal) var(--ease-out);
  transition-delay: calc(var(--i, 0) * var(--stagger));
}
.js .reveal.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .js .reveal { opacity: 1; transform: none; transition: none; }
}
```

**안전장치 (Must)**:
- 숨김 상태는 `<html>`에 `js` 클래스가 있을 때만 적용한다. `<head>` 첫 인라인 스크립트에서 `document.documentElement.classList.add('js')`. JS가 꺼져 있거나 스크립트 오류가 나도 콘텐츠는 보인다.
- `IntersectionObserver` 미지원 브라우저에서는 모든 `.reveal`에 즉시 `.is-visible`를 붙인다.
- 로드 시점에 이미 화면 안에 있는 요소는 observer 첫 콜백에서 바로 보이게 된다(별도 처리 불필요).

### 2-1. Hero (페이지 로드, 스크롤 트리거 아님)

| Step | 요소 | 시작 | Duration | Easing | 효과 |
|------|------|------|----------|--------|------|
| 1 | 히어로 사진 `jo--8400.jpg` | 이미지 `decode()` 완료 직후 | 2400ms (`--dur-settle`) | `--ease-settle` | `transform: scale(1.04) → scale(1)` 1회. opacity는 처음부터 1 |
| 2 | 상단 텍스트 블록 ("Inhyeok & Yumin", "2027. 01. 03. SUN 3PM") | step 1 시작 + 400ms | 800ms | `--ease-out` | 공통 reveal과 동일 (opacity + translateY 16px→0) |
| 3 | 하단 텍스트 블록 ("방인혁 · 손유민", 예식장) | step 1 시작 + 700ms | 800ms | `--ease-out` | 공통 reveal과 동일 |

- 사진 settle은 `<img>`에 직접 적용하고 부모에 `overflow: hidden`을 둔다. `will-change: transform`은 settle 시작 시 부여하고 `transitionend`에서 제거한다.
- `decode()`가 1500ms 안에 끝나지 않으면 settle 없이 사진을 정적으로 두고 텍스트만 reveal한다(늦게 뜬 사진이 줌아웃되며 들어오는 어색함 방지).
- 히어로 높이는 `100svh`(미지원 시 `100vh`). 주소창 변화로 높이가 바뀌어도 애니메이션과 무관하다.
- **reduced-motion**: settle 없음(scale 1 고정), 텍스트 두 블록 즉시 표시.

### 2-2. Greeting

- 공통 reveal. 그룹 ① 라벨·제목 ② 인사말 본문 전체(단락 단위로 쪼개지 않는다) ③ 혼주 표기.
- **reduced-motion**: 즉시 표시.

### 2-3. Couple-intro

- 공통 reveal. 그룹 ① 라벨·제목 ② 신랑·신부 블록 두 개를 **하나의 그룹**으로 동시에(좌우 슬라이드인 없음) ③ 연락하기 버튼 등 부가 요소.
- **reduced-motion**: 즉시 표시.

### 2-4. Calendar + D-day

- 공통 reveal. 그룹 ① 라벨·제목 ② 2027년 1월 달력 그리드 ③ D-day 문구.
- 예식일(1월 3일 일요일) 셀 강조는 **정적**이다: 지름 36px 원, 배경 `--color-accent`, 글자 `#FFFFFF`(대비 8.27). 펄스·scale·glow 없음.
- D-day 숫자는 카운트업 없이 최종 값을 바로 렌더한다(3-5 참조).
- **reduced-motion**: 즉시 표시.

### 2-5. Gallery

- 공통 reveal. 그룹 ① 라벨·제목 ② 3열 그리드 전체를 **한 덩어리로**(9칸 개별 stagger 금지) ③ "더보기" 버튼.
- 썸네일 개별 로딩 표시는 3-1 참조.
- **reduced-motion**: 즉시 표시.

### 2-6. Venue / Account / RSVP / Guestbook / Share

- 공통 reveal, 그룹 구성은 2-0 규칙(최대 3그룹) 그대로.
- **reduced-motion**: 즉시 표시.

---

## 3. 인터랙티브 요소

### 3-1. 갤러리 그리드 + 사진 로딩 성능 (Must)

**구성**: 15장, 3열 정사각 크롭 그리드. 처음 9장 노출, "더보기" 탭 시 10~15번 6장 추가. 순서·파일명은 컨셉 시트 `photos.gallery_order` 그대로.

**로딩 명세**:

| 항목 | 값 |
|------|-----|
| 히어로 `jo--8400.jpg` (68KB) | `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, `<head>`에 `<link rel="preload" as="image" href="images/photos/jo--8400.jpg" fetchpriority="high">` |
| 그리드 1~9번 | `loading="lazy"`, `decoding="async"`, `width`/`height` 속성에 원본 크기 명시(아래 표). 셀은 `aspect-ratio: 1 / 1; object-fit: cover`로 CLS 0 |
| 그리드 10~15번 | 같은 속성 + 부모 `<li hidden>`. `display:none`인 lazy 이미지는 요청되지 않으므로 "더보기" 전까지 네트워크 0 |
| 셀 placeholder | 셀 배경 `--color-surface #EFEAE2`. 이미지가 `load`되기 전에는 이 면만 보인다 |
| 썸네일 등장 | `img.complete`가 아니면 `opacity: 0`에서 시작, `load` 이벤트에 `opacity 1` (`--dur-base` 300ms, `--ease-out`). 이미 캐시된 이미지는 즉시 1 |
| 썸네일 파일 | 현재는 원본(긴 변 1600px)을 그대로 쓴다. 3열 셀은 375px 기준 약 120 CSS px라 과대하지만, 이 환경에 리사이즈 도구(ImageMagick·PIL·vips)가 없다. 썸네일 생성은 6장 Should 항목 |
| 용량 참고 | 갤러리 15장 합계 약 2.6MB, 첫 9장 약 1.9MB, 10~15장 약 0.7MB. 가장 큰 파일 `op1789048062-02c.jpg` 432KB(8번) |

원본 크기 (`width`/`height` 속성 및 lightbox 비율 계산용):

| 번호 | 파일 | 크기 |
|------|------|------|
| 1, 2, 6~12, 14, 15 | jo--8670, jo--9213, op-05c, jo--9055, op-02c, jo--9115-mono, op-04c, jo--9716, op-07c, op-09c, op-11c | 1067x1600 |
| 3 | jo--8753 | 1600x1194 |
| 4, 5, 13 | op-01c, jo--9271, jo--9534-mono | 1600x1067 |

**"더보기" 동작**:
- 탭 → 10~15번 `<li>`의 `hidden` 제거. 높이 애니메이션 없음(layout 속성 금지). 새로 보인 6칸은 위 "썸네일 등장" 규칙으로만 페이드된다.
- 버튼은 펼친 뒤 사라진다(접기 없음). 키보드 사용자를 위해 포커스를 10번 칸의 버튼으로 옮긴다.
- **reduced-motion**: 썸네일 페이드 없이 즉시 표시.

**그리드 셀 접근성**: 각 셀은 `<button type="button" aria-label="사진 N / 15 크게 보기">` 안에 `<img alt="">`. 사진 설명은 버튼 `aria-label`이 맡는다(copy-writer가 사진별 설명을 주면 그 문구로 교체).

### 3-2. 갤러리 Lightbox: 스와이프 + 핀치 줌 (Must)

**라이브러리 없음.** Pointer Events 하나로 터치·마우스·펜을 함께 처리한다(iOS Safari 13+ 지원).

**열기/닫기**

| 항목 | 값 |
|------|-----|
| 열기 | 그리드 셀 탭 → `<dialog>` 또는 `role="dialog" aria-modal="true" aria-label="사진 크게 보기"` 컨테이너 표시. 배경 `rgba(43,39,35,0.94)` (text 색 기반) |
| 열기 모션 | 오버레이 `opacity 0→1`, 250ms `--ease-out`. scale·blur 없음 |
| 닫기 수단 | 우상단 닫기 버튼(44x44), `Esc`, 사진 밖 빈 영역 탭, **scale 1일 때** 아래로 끌어내리기 |
| 아래로 끌어 닫기 | 세로 이동량이 가로보다 크고 80px 이상이면 닫기. 끄는 동안 사진은 손가락을 따라 `translateY`, 오버레이 opacity는 `1 - dy/400`(최저 0.4). 80px 미만에서 놓으면 250ms에 원위치 |
| 닫기 모션 | 오버레이 `opacity 1→0`, 200ms `--ease-in` |
| 스크롤 잠금 | 열린 동안 `document.documentElement.style.overflow = 'hidden'`. 닫을 때 원복 |
| 포커스 | 열면 닫기 버튼에 포커스, Tab은 lightbox 안에서 순환(닫기·이전·다음). 닫으면 열었던 그리드 셀로 포커스 복귀 |
| 위치 표시 | 하단 중앙 "3 / 15" (Cormorant Garamond, `#F8F5F0`), `aria-live="polite"` |
| 다른 UI | 음악 토글은 lightbox 아래에 깔린다(z-index: lightbox 100 > 음악 토글 50) |

**스와이프 (scale === 1일 때만)**

| 항목 | 값 |
|------|-----|
| 구조 | 가로 트랙에 15개 슬라이드. 트랙 `transform: translate3d(calc(-100% * index + dragX px), 0, 0)` |
| 드래그 | 손가락을 1:1로 따라간다(트랜지션 없음) |
| 전환 판정 | `|dx| ≥ 50px` 또는 속도 `≥ 0.3px/ms`. 가로 이동이 세로보다 클 때만 가로 스와이프로 인식 |
| 스냅 | 350ms `--ease-standard` |
| 양 끝 | 순환하지 않는다. 1번에서 오른쪽, 15번에서 왼쪽으로 끌면 이동량의 0.3배만 따라오고(저항) 놓으면 제자리로 스냅 |
| 버튼 | 좌우 이전/다음 버튼(44x44, 반투명 `rgba(248,245,240,0.12)` 면 + 1px `rgba(248,245,240,0.4)` 테두리, 모서리 2px). 양 끝에서는 해당 버튼 `disabled` |
| 키보드 | `←` / `→` 이동, `Esc` 닫기 |
| 자동 재생 | 없음 |
| 슬라이드 전환 시 | 떠나는 슬라이드의 줌 상태를 scale 1로 초기화 |
| 햅틱 | 없음 (차분한 무드, iOS 미지원으로 경험 불일치) |

**핀치 줌**

| 항목 | 값 |
|------|-----|
| 대상 | 현재 슬라이드의 `<img>`. 슬라이드 영역에 `touch-action: none` (페이지 확대·스크롤 대신 직접 처리) |
| 범위 | min 1, max 3 |
| 중심 | 두 손가락 중점 기준. `transform: translate(tx, ty) scale(s)`, `transform-origin: 0 0`로 두고 중점이 고정되도록 tx/ty 보정 |
| 더블탭 | 300ms 안에 두 번 탭(이동 10px 이하) → scale 1이면 탭 지점 기준 2배, 1보다 크면 1로. 전환 250ms `--ease-standard` |
| 팬 | scale > 1일 때 한 손가락 드래그로 이동. 사진 가장자리가 화면 안쪽으로 들어오지 않게 clamp |
| scale < 1 | 손가락을 놓으면 250ms에 1로 복귀 |
| scale > 1인 동안 | 스와이프·아래로 끌어 닫기 비활성 |
| 키보드 | `+` / `-`로 1.5배씩(선택 구현, Should) |
| viewport meta | `user-scalable=no`·`maximum-scale=1` **금지**(접근성). lightbox 밖 페이지 확대는 그대로 허용 |

**lightbox 이미지 로딩 (Must)**

- 슬라이드 15개는 처음에 `<img data-src="..." width height>`만 두고 `src`를 비운다.
- 열 때 현재 번호 ±1 슬라이드에만 `src`를 채운다. 이동할 때마다 새 ±1을 채운다. 한 번 채운 `src`는 유지한다.
- 그리드와 같은 파일이므로 이미 본 사진은 캐시에서 즉시 뜬다.
- 아직 안 받은 사진은 `width`/`height` 비율로 자리를 잡은 `--color-text` 면 위에, `load` 후 `opacity 0→1` 300ms로 나타난다. 스피너는 쓰지 않는다.
- 사진 표시 크기: `max-width: 100vw; max-height: 100svh; object-fit: contain`. 원본 비율 그대로(가로 컷 4장 포함).

**reduced-motion**:
- 열기·닫기 페이드, 스냅, 더블탭 줌 전환, 원위치 복귀 모두 0ms(즉시).
- 손가락을 따라가는 드래그·핀치 자체는 사용자가 직접 조작하는 것이므로 유지한다.

### 3-3. 계좌번호 복사 (Must)

**토스트 없이 버튼 라벨 전환으로 피드백한다** (컨셉 시트 지시).

| 항목 | 값 |
|------|-----|
| 위치 | account 섹션 각 계좌 행 오른쪽 |
| 버튼 | 텍스트 버튼 "복사", Pretendard 14px, 글자 `--color-accent`, 1px `--color-secondary` 테두리, 모서리 2px, 최소 높이 44px |
| 동작 | `navigator.clipboard.writeText(계좌번호에서 하이픈 포함 원문)` |
| 성공 | 라벨 "복사" → **"복사되었습니다"**, 2000ms 유지 후 "복사"로 복귀 |
| 라벨 전환 모션 | 이전 라벨 `opacity 1→0` 120ms → 텍스트 교체 → `opacity 0→1` 120ms (`--dur-fast`) |
| 레이아웃 고정 | 버튼에 "복사되었습니다" 길이 기준 `min-width`를 줘서 라벨이 바뀌어도 행 너비가 변하지 않게 한다(CLS 방지) |
| 연타 | 2000ms 안에 다시 누르면 다시 복사하고 타이머만 재시작 |
| 실패 폴백 | clipboard API 실패(비 HTTPS, 권한 거부) → 숨긴 `<textarea>` + `document.execCommand('copy')` 재시도. 그래도 실패하면 라벨 "복사하지 못했습니다" 2000ms + 계좌번호 텍스트를 `Selection`으로 선택해 사용자가 길게 눌러 복사하게 한다 |
| 햅틱 | 성공 시 `navigator.vibrate?.(10)`. iOS Safari는 미지원이므로 조용히 무시된다 |
| 접근성 | 버튼 `aria-label="신랑 아버지 방주경 계좌번호 복사"`처럼 대상 명시. 페이지에 시각적으로 숨긴 `role="status" aria-live="polite"` 영역 1개를 두고 "계좌번호가 복사되었습니다"를 넣는다 |
| 계좌 묶음 접기 | copy-writer·frontend가 신랑측/신부측 접기를 쓰는 경우 `<details>/<summary>`로 구현하고 **높이 애니메이션은 하지 않는다**. 펼친 내용은 `opacity 0→1` 300ms만 |
| reduced-motion | 라벨 즉시 교체(페이드 없음), 펼침 페이드 없음 |

같은 패턴(라벨 → "복사되었습니다")을 venue 섹션 **주소 복사**와 share 섹션 **링크 복사**에도 그대로 쓴다.

### 3-4. 음악 토글 (Must, 자동재생 없음)

| 항목 | 값 |
|------|-----|
| 음원 | `<audio id="bgm" src="audio/bgm.mp3" loop preload="none">` (4.0MB, 192kbps, 약 2분 50초). `preload="none"`으로 사용자가 켜기 전에는 내려받지 않는다 |
| 자동재생 | **하지 않는다.** 로드 시 `play()`를 호출하지 않는다. 첫 스크롤·첫 탭 같은 "아무 인터랙션"으로 시작하는 것도 하지 않는다. 오직 토글 버튼으로만 켠다 |
| 위치 | `position: fixed; top: max(16px, env(safe-area-inset-top)); right: 16px; z-index: 50`. 페이지 전체에서 우상단에 고정 |
| 크기 | 시각 원 40px, 터치 영역 44x44px |
| 모양 | 원형(컨셉 시트가 지정한 유일한 원형 요소). 배경 `rgba(248,245,240,0.88)`, 1px `--color-secondary` 테두리, 아이콘 `--color-accent`. 그림자·backdrop-filter 없음 |
| 꺼짐 아이콘 | 음표(인라인 SVG, stroke 1.5px) |
| 켜짐 아이콘 | 이퀄라이저 3바(폭 2px, 간격 3px, 최대 높이 12px). 각 바 `transform: scaleY(0.35 ↔ 1)`, `transform-origin: bottom`, 1200ms `ease-in-out` `infinite alternate`, 바별 `animation-delay` 0 / -400ms / -800ms. 주기 1.2s라 점멸 기준(3Hz) 한참 아래 |
| 아이콘 전환 | 두 아이콘 겹쳐 두고 `opacity` 크로스페이드 200ms |
| 로딩 상태 | 탭 후 `playing` 이벤트 전까지 버튼 `aria-busy="true"`, 아이콘 opacity 0.5. 회전 스피너 없음 |
| 볼륨 페이드 | 켤 때 `audio.volume` 0 → 0.6을 1500ms 동안 rAF로 올림. 끌 때 현재 값 → 0을 400ms 후 `pause()`. **iOS Safari는 `volume`이 읽기 전용이라 페이드 없이 즉시 재생·정지된다.** 기능상 문제 없으므로 Web Audio로 우회하지 않는다 |
| 백그라운드 | `visibilitychange`로 탭이 숨겨지면 일시정지, 다시 보이면 "숨기기 직전에 재생 중이었던 경우에만" 재개 |
| 재생 실패 | `play()` Promise가 reject되면 꺼짐 상태로 되돌리고 `aria-pressed="false"`. 오류 문구는 띄우지 않는다 |
| 접근성 | `<button type="button" aria-pressed="false" aria-label="배경음악">`. `aria-pressed`로 상태 전달(라벨 문구는 고정). Enter/Space 동작은 `<button>` 기본. 포커스 링 2px `--color-accent`, offset 2px |
| reduced-motion | 이퀄라이저 애니메이션 없음. 켜짐 상태는 높이가 다른 정적 3바(scaleY 0.5 / 1 / 0.7)로 표시해 꺼짐(음표)과 구분된다. 크로스페이드·볼륨 페이드는 유지해도 된다(볼륨은 시각 모션이 아님) |

### 3-5. D-day 표시 (Should)

**카운트업·펄스·실시간 초 단위 카운트다운 없음.** 숫자를 정적으로 보여준다.

| 항목 | 값 |
|------|-----|
| 계산 기준 | 한국 시간(UTC+9) 날짜 기준 일수 차. `const now = new Date(Date.now() + 9*3600e3); const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()); const days = (Date.UTC(2027,0,3) - today) / 864e5;` |
| 표기 | `days > 0`: "D-86" + "결혼식까지 86일 남았습니다" 형태(문구는 copy-writer 기준) / `days === 0`: "D-DAY" / `days < 0`: D-day 줄 숨김(달력은 유지) |
| 갱신 | 로드 시 1회 + `visibilitychange`로 다시 보일 때 1회. 타이머 없음 |
| 서체 | 숫자 Cormorant Garamond 28px, `--color-primary`(24px 이상 디스플레이 허용 범위) |
| 확인용 | 2026-10-09 기준 D-86 |
| reduced-motion | 해당 없음(원래 정적). 섹션 reveal만 2-0 규칙대로 즉시 표시 |

### 3-6. 카카오톡 공유 / 링크 복사 (Should)

| 항목 | 값 |
|------|-----|
| 카카오톡 공유 | Kakao JS SDK `Kakao.Share.sendDefault`(feed). 앱 키가 placeholder이거나 SDK 로드 실패 시 버튼을 "링크 복사" 동작으로 폴백 |
| 링크 복사 | 3-3과 같은 라벨 전환 패턴 |
| 모션 | 4장 버튼 공통 active 상태만 |

### 3-7. 길찾기 버튼 (Should)

- 카카오맵·네이버 지도·티맵 외부 링크. 모션은 4장 버튼 공통 active 상태만.
- 지도 임베드(iframe/정적 지도)가 들어가면 `loading="lazy"`.

### 3-8. 히어로 스크롤 안내선 (Nice-to-have)

| 항목 | 값 |
|------|-----|
| 모양 | 히어로 하단 중앙, 1px x 32px 세로선(`--color-primary`) + 위에 "SCROLL" (Cormorant 11px, letter-spacing 0.2em, `--color-text`) |
| 모션 | **bounce 루프 없음.** 히어로 텍스트 step 3 이후 함께 나타나고, `scrollY > 24`가 되면 `opacity → 0` 400ms. 이후 다시 나타나지 않는다 |
| reduced-motion | 즉시 표시, 스크롤 시 즉시 숨김 |

---

## 4. 트랜지션 & 디테일

| 요소 | 상태 | 변화 | Duration | Easing | reduced-motion |
|------|------|------|----------|--------|----------------|
| 모든 버튼 | `:active` | `transform: scale(0.98)` + 배경 `--color-surface` | 120ms | `--ease-standard` | scale 없음, 배경색만 즉시 |
| 모든 버튼·링크 | `:hover` (pointer: fine일 때만) | 텍스트·테두리 `--color-accent`로 | 200ms | `--ease-standard` | 즉시 |
| 모든 포커스 가능 요소 | `:focus-visible` | `outline: 2px solid var(--color-accent); outline-offset: 2px` | 0 | — | 동일 |
| 텍스트 링크 | `:hover` | 밑줄 표시 (`text-decoration-color` transparent → accent) | 200ms | `--ease-standard` | 즉시 |
| 히어로 사진 | 로드 | scale 1.04 → 1, 1회 | 2400ms | `--ease-settle` | 없음 |
| 섹션 디바이더 | 진입 | 소속 그룹 ①과 함께 공통 reveal. 별도 scaleX·stroke-draw 없음 | 800ms | `--ease-out` | 즉시 |
| 그리드 썸네일 | 이미지 load | opacity 0 → 1 | 300ms | `--ease-out` | 즉시 |
| lightbox | 열기 / 닫기 | 오버레이 opacity | 250ms / 200ms | `--ease-out` / `--ease-in` | 즉시 |
| 복사 버튼 라벨 | 성공·복귀 | 라벨 opacity 크로스 | 120ms + 120ms | `--ease-standard` | 즉시 교체 |
| 음악 아이콘 | 토글 | 음표 ↔ 이퀄라이저 opacity | 200ms | `--ease-standard` | 크로스페이드 유지 가능, 이퀄라이저는 정적 |

**쓰지 않는 것 (QA 확인용)**: 꽃잎·파티클·메시·반딧불이, ken-burns 루프, 패럴랙스, blur reveal, 마스킹 텍스트 리빌, split char, 카운트업, 달력 펄스, 클릭 ripple, 토스트, 갤러리 자동 슬라이드, hover lift + 그림자, `scroll-behavior: smooth`(페이지 내 앵커 내비게이션이 없음).

---

## 5. CSS 변수 / 토큰

```css
:root {
  /* Easing */
  --ease-out:      cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 섹션 reveal, 이미지 등장 */
  --ease-settle:   cubic-bezier(0.22, 1, 0.36, 1);       /* 히어로 사진 settle: 초반에 거의 다 줄고 끝이 길게 멈춤 */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);         /* 버튼, 스냅, 줌 전환 */
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);           /* lightbox 닫기 */

  /* Duration */
  --dur-fast:   120ms;   /* 버튼 active, 복사 라벨 전환 */
  --dur-base:   300ms;   /* 썸네일 등장, 펼침 */
  --dur-modal:  250ms;   /* lightbox 열기, 더블탭 줌, 원위치 복귀 */
  --dur-snap:   350ms;   /* lightbox 스와이프 스냅 */
  --dur-reveal: 800ms;   /* 섹션 진입 */
  --dur-settle: 2400ms;  /* 히어로 사진 */
  --dur-eq:     1200ms;  /* 이퀄라이저 바 반주기 */

  /* Distance & stagger */
  --reveal-distance: 16px;
  --stagger: 120ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-fast: 0ms;
    --dur-base: 0ms;
    --dur-modal: 0ms;
    --dur-snap: 0ms;
    --dur-reveal: 0ms;
    --dur-settle: 0ms;
    --reveal-distance: 0px;
    --stagger: 0ms;
  }
  .hero__photo { transform: none !important; }
  .eq-bar { animation: none !important; }
}
```

**JS 쪽 분기**: `const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');` 를 한 번 만들고, JS가 직접 계산하는 duration(lightbox 스냅·더블탭 줌·히어로 settle 시작 여부)은 `reducedMotion.matches`일 때 0으로 둔다. `reducedMotion.addEventListener('change', ...)`로 런타임 전환도 반영한다.

**토큰 사용 규칙**: 전역 `* { transition-duration: 0.01ms !important }` 같은 일괄 덮어쓰기는 쓰지 않는다. 위 토큰 0ms 재정의 + 개별 규칙으로 처리해야 QA가 항목별로 대체안을 확인할 수 있다.

---

## 6. 구현 우선순위

| 우선순위 | 항목 |
|---------|------|
| **Must** | 2-0 공통 reveal (no-JS·IO 미지원 안전장치 포함) |
| **Must** | 2-1 히어로 사진 settle + 텍스트 reveal |
| **Must** | 3-1 갤러리 그리드 + 로딩 성능(lazy, `width`/`height`, 10~15번 지연, 히어로 preload) + 더보기 |
| **Must** | 3-2 lightbox 스와이프 + 핀치 줌 + 더블탭 + ±1 이미지 로딩 + 포커스 트랩 |
| **Must** | 3-3 계좌 복사 라벨 전환 + 폴백 (주소·링크 복사 공용) |
| **Must** | 3-4 음악 토글 (`audio/bgm.mp3`, `preload="none"`, 자동재생 없음) |
| **Must** | 5 토큰 + prefers-reduced-motion CSS·JS 분기 |
| Should | 3-5 D-day 정적 표시 |
| Should | 3-6 카카오 공유 / 링크 복사, 3-7 길찾기 버튼 |
| Should | 그리드용 썸네일 생성: `images/photos/thumb/` 에 긴 변 600px, JPEG q78 15장 → 그리드는 thumb, lightbox는 원본. 첫 9장 약 1.9MB → 약 0.4MB 예상. 리사이즈 도구가 없으면 원본 유지(현재 상태로도 동작) |
| Nice-to-have | 3-8 스크롤 안내선, lightbox `+`/`-` 키 줌 |

---

## 7. 성능 메모

- 동시 무한 루프는 음악 재생 중 이퀄라이저 3바(transform만) 하나뿐이다. 그 외 모든 모션은 단발이다.
- scroll 이벤트 리스너는 3-8 스크롤 안내선 1개뿐이며 `{ passive: true }` + 숨긴 뒤 즉시 `removeEventListener`. reveal은 전부 IntersectionObserver.
- lightbox 드래그 중에만 트랙에 `will-change: transform`, `pointerup`에서 제거.
- `filter`, `box-shadow`, `backdrop-filter` 애니메이션 없음.
- 목표: Lighthouse Mobile Performance ≥ 90, LCP ≤ 2.5s(히어로 68KB preload), CLS ≤ 0.05, INP ≤ 200ms.

---

## 8. 자산 협의 (image-artist)

- **파티클·꽃잎 자산 불필요.** 배경 애니메이션이 없다.
- 디바이더는 정적으로 쓰므로 stroke-draw용 path 구조가 필요 없다. PNG든 SVG든 무방하다.
- 아이콘(음표, 이퀄라이저, 닫기, 이전/다음)은 frontend가 인라인 SVG로 작성한다. 별도 자산 불필요.
- og 썸네일 크롭을 할 때 리사이즈 도구를 확보한다면, 같은 도구로 6장 Should의 그리드 썸네일 15장(긴 변 600px)도 함께 만들어 주면 좋다. 사진 보정·필터는 하지 않는다(컨셉 시트 원칙).

---

## 9. 접근성 체크리스트 (QA용)

- [ ] `prefers-reduced-motion: reduce`에서 히어로 settle·reveal·썸네일 페이드·lightbox 전환·라벨 페이드가 모두 즉시 처리되고, 이퀄라이저는 정적 3바로 바뀐다
- [ ] JS 비활성 상태에서도 모든 섹션 콘텐츠가 보인다 (`.js` 클래스 게이트)
- [ ] BGM이 로드·스크롤·첫 탭으로 자동 시작되지 않고, 토글 버튼으로만 시작된다. 켜기 전 `bgm.mp3` 요청이 없다(`preload="none"`)
- [ ] 음악 토글 `aria-pressed` 상태가 실제 재생 상태와 일치, 키보드 Enter/Space 동작
- [ ] 3Hz 이상 점멸 없음 (이퀄라이저 주기 1.2s)
- [ ] lightbox: `aria-modal`, 포커스 트랩, Esc 닫기, 닫은 뒤 포커스 복귀, `←`/`→` 이동, "N / 15" 위치 안내
- [ ] viewport meta에 `user-scalable=no`·`maximum-scale=1` 없음
- [ ] 복사 성공·실패가 `role="status"` 영역으로 낭독된다
- [ ] 모든 아이콘 버튼 `aria-label`, 터치 영역 44x44 이상

## 10. 한 줄 정리

움직임은 섹션 진입 fade-in(800ms, 16px)과 히어로 사진 settle 1회뿐이고, 인터랙션은 lightbox 스와이프·핀치 줌, 복사 라벨 전환, 토글로만 켜지는 BGM이며, prefers-reduced-motion에서는 transform이 모두 빠지고 즉시 표시된다.
