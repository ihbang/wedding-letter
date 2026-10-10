# 프론트엔드 구현 요약: "Petal & Glow"

- 작성일: 2026-10-10
- 갱신: 2026-10-10, 사용자 카피 수정 반영(9장). 바뀐 부분만 고쳤다.
- 입력: `00_user-input.md`, `01_concept-director_concept-sheet.md`, `02_copy-writer_copy.md`, `03_image-artist_manifest.md`, `04_motion-designer_motion-spec.md`
- 산출물: `index.html`(440줄), `style.css`(1,010줄), `script.js`(1,277줄). 줄 수는 카피 수정 반영 후 기준이다. 어제의 "Warm Paper & Ink" 파일을 전부 새로 썼다.
- 이전 컨셉 자산(`jo--*`, `op1789048062-*`, `divider-hairline.svg`, `og-thumbnail.jpg`, `monogram-iy.svg`, `floral-*`, `gallery-placeholder-*`, `hero-illustration.png`)은 세 파일 어디에서도 참조하지 않는다(grep 0건). 파일 자체는 지우지 않았다.

## 1. 외부 리소스

| 리소스 | 용도 | 로드 시점 |
|---|---|---|
| Google Fonts 1회 요청: Gowun Batang 400/700, Cormorant Garamond 300/400/500 + 400 italic, Allura 400 (`display=swap`) | 본문·제목, 영문 날짜·eyebrow, '&'·Thank you | `<head>` |
| Pretendard v1.3.9 dynamic-subset (jsDelivr) | 주소·계좌·버튼·폼 | `<head>` |
| Kakao JS SDK 2.7.2 (`t1.kakaocdn.net`) | 카카오톡 공유 | 키가 설정된 경우에만, 버튼을 처음 누를 때 동적 로드 |

애니메이션 라이브러리, jQuery, 지도 SDK는 쓰지 않았다. 모션은 Canvas 2D, CSS, rAF로 구현했다.

## 2. 섹션 구조

| # | 섹션 (요소) | 배경 | reveal 그룹 | 장식·모션 |
|---|---|---|---|---|
| 1 | hero (`header.hero.bokeh-zone[data-bokeh=hero]`) | background | 위 텍스트 / 사진(opacity만) / 아래 텍스트. 로드 시퀀스로 등장 | 보케 캔버스, 스크롤 큐 |
| 2 | greeting (`#greeting`) | background | ① 헤더 ② 인사말 | 섹션 끝 sprig-divider ① (stroke-draw) |
| 3 | couple-intro (`#couple`) | background | ① 헤더 ② 신랑·신부 두 줄("아들"/"딸"은 같은 폭 칸 `.couple__rel`) | 없음 |
| 4 | calendar (`#calendar[data-bokeh=calendar]`) | background | ① string-lights + 헤더 ② 한글 일시 + 달력(caption "JANUARY 2027") ③ D-day | 보케, 전구 점등·호흡 |
| 5 | gallery (`#gallery`) | background | ① 헤더 + 안내 ② 3x5 그리드 전체 | 헤더 위 sprig-divider ② |
| 6 | venue (`#venue`) | background + surface 카드 | ① 헤더 ② 정보 카드 + 주소 복사 + 지도 버튼 ③ 교통편 | 없음 |
| 7 | notice (`#notice`) | background | ① 헤더(NOTICE / 축하 화환 안내) ② 본문 2행 | 없음 (보케 구간 아님) |
| 8 | account (`#account`) | background + surface 카드 | ① 헤더 + 안내문 ② 신랑측 카드 ③ 신부측 카드 | 없음 |
| 9 | guestbook (`#guestbook`) | surface 밴드 | ① 헤더 + 안내 ② 폼 ③ 전달 안내 | 없음 |
| 10 | share (`#share[data-bokeh=share]`) | background | ① wreath 모노그램 ② Thank you + 맺음말 ③ 공유 버튼 | 상단 sprig-divider ③, 보케 |
| - | lightbox (`dialog#lightbox`) | scrim #1C1514 / 0.96 | - | 스와이프·핀치·더블탭·끌어 닫기 |
| - | BGM 토글 (`.bgm-toggle`, fixed) | 반투명 면 | hero 시퀀스 t=0 | glow 링 |

RSVP 섹션은 없다(사용자 지정). 갤러리 순서는 컨셉 시트 `photos.gallery.order` 그대로이며(02, 01, 08 / 03, 09, 12 / 07, 13, 05 / 11, 06, 14 / 10, 04, 15), hero.jpg는 갤러리에 없다. 02와 15에만 `object-position` 70% 50% / 54% 50%를 줬다.

## 3. 모션 명세 매핑

위치는 `파일:줄` 기준이다.

### Must

| 명세 | 구현 | 위치 |
|---|---|---|
| 6 토큰 (`--ease-*` 5종, `--dur-*` 12종, `--reveal-distance`, `--stagger`, `--bulb-stagger`) + reduced 0ms 재정의 | 구현 | style.css:38-71 |
| `html.js` 게이트 | `<head>` 첫 인라인 스크립트 | index.html:5 |
| reduced-motion CSS·JS 분기 | CSS 블록 + `@media (no-preference)` 안에 루프 배치, JS `matchMedia` + 런타임 `change` 처리(새로고침 없음) | style.css:937-1010, script.js:1265 |
| 1 보케: 구간 3곳, `BOKEH` 상수(명세와 글자 단위 동일), 스프라이트, 30fps, DPR 1, 겹침 방지, 제외 영역, 합산 상한 12/16 | 구현. `makeSprite`/`pickDiameter`/`spawn`/`step`은 1-7 참고 코드 그대로(`step` 끝에 `globalAlpha = 1` 한 줄만 추가) | script.js:107-445 |
| 1-4 정지 조건: 구간 이탈(600ms 페이드 후 정지), 탭 숨김, 라이트박스 | `pauses` Set(`'hidden'`, `'lightbox'`) | script.js:322-357, 385 |
| 1-5 pre-seed, hero 첫 등장 1200ms, ResizeObserver 150ms 디바운스, fonts.ready·사진 load 재측정 | 구현. window resize 이벤트는 쓰지 않음 | script.js:296-383, 419 |
| 1-6 reduced 정적 점 5개(hero만), calendar·share 캔버스 숨김 | 구현 | script.js:124, 280, 391 |
| 2-0 공통 reveal(threshold 0.15, rootMargin -10%, 1회, 콜백 단위 stagger 최대 2) + 안전장치 | 구현 | script.js:450, style.css:916 |
| 2-1 hero 로드 시퀀스 0/300/600/900/1700ms, 사진 opacity만, `decode()` 대기, preload | 구현 | script.js:9, 493; index.html:24 |
| 3-1 sprig-divider stroke-draw 3곳(인라인 SVG, `sp-*` 클래스, IO threshold 0.5) | 구현 | index.html 각 `svg.sprig`, style.css:939-949, script.js:545 |
| 3-2 전구 호흡(주기 표 그대로) + 화면 밖·라이트박스 일시정지 | 구현 | style.css:481-487, 951-959, script.js:563 |
| 4-1 그리드 구조, `loading="lazy"`, `width`/`height`, `aspect-ratio: 2/3` | 구현 | index.html 갤러리, style.css:555 |
| 4-2 lightbox: `showModal` 포커스 트랩, 스와이프(50px / 0.3px/ms), 핀치 1~3, 더블탭 2배, 팬 clamp, ←/→/Esc, 포커스 복귀, 스크롤 잠금, 썸네일→원본 교체, ±1 프리로드, 보케 정지 | 구현 | script.js:619-1000 |
| 4-3 BGM: 자동재생 없음, `preload="none"`, 꺼짐(사선 음표)/켜짐 아이콘, `aria-pressed`, `aria-busy`, 탭 숨김 일시정지·복귀, 재생 실패 복구 | 구현 | index.html:36-60, script.js:1002 |
| 4-4 복사(계좌·주소·링크): 라벨 전환 1600ms, 토스트 1800ms, `role="status"` 낭독(50ms 비웠다 다시), clipboard → execCommand → Selection 폴백, 진동 12ms | 구현 | script.js:79-101, 1084-1146 |
| 4-5 D-day 한국 시간 계산, D-N / D-DAY / 숨김 분기, visibilitychange 갱신, 카운트업 없음 | 구현 | script.js:583 |

### Should

| 명세 | 구현 | 위치 |
|---|---|---|
| 3-2 전구 점등 시퀀스(0.3→1, 140ms 간격) | 구현 | style.css:952-957 |
| 4-3 glow 링(3000ms 호흡), 볼륨 페이드(1500ms 들어옴, 400ms 나감) | 구현 | style.css:285-303, 962; script.js:1011 |
| 4-1 썸네일 페이드 | 구현 | script.js:607 |
| 4-2 아래로 끌어 닫기(80px, scrim 0.96→최저 0.4), Android 뒤로가기(`pushState`/`popstate`, 이중 닫기 방지) | 구현 | script.js:776-800, 860, 968 |
| 4-4 placeholder 보호(`[[TODO`면 복사 대신 안내 토스트) | 구현 | script.js:1127 |
| 4-4 계좌 접기 | **미구현.** 양가 계좌가 한 개씩이라 접기 없이 카드로 바로 보여 준다(명세도 "쓰면"이라는 조건부) | - |
| 4-6 카카오 공유 + 링크 복사 폴백 | 구현 | script.js:1148 |
| 4-7 길찾기 버튼 | 네이버 지도, 카카오맵 2개. 티맵은 미구현(아래 4장) | index.html:244-247 |
| 4-8 방명록 상태 문구(200ms 페이드), 제출 중 비활성 | 구현 | script.js:1200 |
| 4-9 스크롤 큐(1700ms 등장, 2400ms 루프, 첫 스크롤 후 제거, 압축 화면 숨김) | 구현 | style.css:381-425, 966-970; script.js:530 |
| 1-7 `window.__bokeh = { config, stats() }` | 구현 | script.js:1276 |

### Nice-to-have

| 명세 | 구현 | 위치 |
|---|---|---|
| `+` / `-` / `0` 키 줌 | 구현(1.5배 단위) | script.js:803 |
| `ctrl + wheel` 줌 | 구현 | script.js:811 |

## 4. 명세와 다르게 처리한 부분

| 항목 | 명세 | 실제 | 이유 |
|---|---|---|---|
| sprig 숨김 대시 | `stroke-dasharray: 1 1` | `1 2` | `1 1`로 숨기면 round cap 때문에 모든 path 끝에 점이 남는다. Chrome에서 3배 확대 캡처로 확인했다(image-artist 매니페스트에도 같은 지적). `1 2`는 숨김 상태가 깨끗하고 그려지는 모양은 같다 |
| 장식 루프 CSS 위치 | 명세 블록은 미디어 쿼리 없이 작성됨 | sprig·전구·BGM 링·스크롤 큐의 숨김 상태와 애니메이션을 `@media (prefers-reduced-motion: no-preference)` 안에 두고, 명세의 reduce 블록도 그대로 유지(선택자 명시도를 올림) | 명세의 reduce 규칙(`.sprig :is(...)`, `.lights .bulb`)은 명시도가 `.js .sprig :is(...)`, `.lights.is-on .bulb`보다 낮아서, 그대로 두면 reduce에서 디바이더가 숨겨진 채로 남고 전구가 계속 깜빡인다 |
| reduce에서 reveal | 토큰 0ms로 "즉시 표시" | 토큰 0ms + JS가 시작 시 모든 `.reveal`에 `.is-visible`을 붙임(IO 생략) | 0ms 토큰만으로는 아직 화면에 안 들어온 그룹이 opacity 0으로 남는다 |
| 페이지 끝 안전장치 | `scrollY + innerHeight >= scrollHeight - 2` | 페이지 끝 1px 센티널(`.reveal-sentinel`)을 IntersectionObserver로 감시 | 명세 8장이 scroll 리스너를 스크롤 큐 1개로 제한한다 |
| 보케 30fps 게이트 | 33ms 미만 프레임 건너뜀 | `1000/30 - 1` = 32.3ms | 60Hz에서 33.3ms 간격이 vsync 지터로 32.9ms가 되면 프레임이 하나 더 밀려 20fps대로 떨어진다 |
| 보케 합산 상한과 pre-seed | 새 입자 생성만 상한으로 막음 | 구간이 켜질 때(캔버스 opacity 0인 순간) 상한을 넘는 미리 뿌린 입자를 지움 | 구간마다 pre-seed하면 두 구간이 동시에 켜질 때(세로로 긴 창) 8 + 6 = 14 > 12가 된다 |
| 보케 제외 영역 측정 | 요소 사각형 + 12px | 같은 값에서 상위 `.reveal`의 아직 남은 translateY를 빼고 잰다 | 측정 시점에 그룹이 12px 아래에 있으면 최종 위치와 어긋난다 |
| 높이 40px 이하 변화 | 재배치 조건만 명시 | 재배치는 안 하고 새 높이를 벗어나는 입자만 지움 | 캔버스 아래 경계에서 원이 잘려 직선 모서리가 생기지 않게 |
| `stats()` 정의 | `living`, `zones`, `maxPeak`, `running` | `living`과 `maxPeak`는 켜진 구간만, `zones`는 구간별 보유 입자 수 | 꺼진 구간의 멈춘 입자가 상한 판정에 섞이지 않게 |
| 갤러리 셀 접근성 이름 | img alt가 담당 | 버튼 `aria-label` = "사진 n / 15 크게 보기: {alt}"(카피 시트), img alt도 유지 | 문구는 카피 시트 기준 |
| 복사 성공 라벨 | "복사됨" | "복사했습니다"(카피 시트). 토스트 문구도 카피 시트(마침표 포함) | 문구는 카피 시트 기준 |
| BGM `aria-label` | "배경 음악" | "배경음악"(카피 시트) | 같음 |
| BGM 재생 실패 | 오류 문구 없음 | 화면 토스트 없이 `role="status"` 낭독만("음악을 재생하지 못했습니다. 다시 한번 눌러 주세요.") | 카피 시트의 상태 메시지를 쓰되 시각 피드백은 명세대로 없음 |
| 길찾기 | 카카오맵·네이버 지도·티맵 | 티맵 제외 | 티맵은 앱 키 없이 쓸 수 있는 웹 검색 URL이 없다. 앱 스킴(`tmap://`)은 데스크톱·미설치 기기에서 실패 |
| 라이트박스 카운터 | "n / 15" + `aria-live` | 보이는 "n / 15"는 `aria-hidden`, 같은 `aria-live` 문단 안의 sr-only "15장 중 n번째 사진"이 낭독됨 | 카피 시트의 카운터 접근성 문구 |
| 줌·원위치 250ms | 시간만 명시 | 토큰 `--dur-modal`(250ms) 재사용 | 250ms 전용 토큰이 없다. reduce에서 0ms로 따라감 |
| 400/600ms 전환 | BGM 토글 등장 400ms, 스크롤 큐 등장 600ms·퇴장 400ms | `calc(var(--dur-fast) * 2)`, `calc(var(--dur-base) * 2)` | 토큰에 묶어 reduce에서 0ms가 되게 |
| 핀치 1 미만 | "줄였다 놓으면 1로 복귀" | 제스처 중 최저 0.6까지 허용 후 250ms에 1로 복귀 | 하한이 명시되지 않음 |
| 끌어 닫기 배경 | dialog 배경 opacity 변경 | scrim을 별도 요소(`.lb-scrim`)로 두고 그 opacity만 바꿈 | transform/opacity만 움직이는 규칙 유지 |
| `showModal` 미지원 브라우저 | 언급 없음 | 셀을 누르면 원본 사진을 새 탭으로 연다 | 구형 Safari(15.4 미만) 대비 |
| greeting 그룹 ③ "혼주 표기" | greeting 안 | 혼주 표기는 couple-intro 섹션에 있음 | 컨셉 시트 `sections_order`가 두 섹션을 나눈다 |
| UI 문구 위치 | - | 런타임 문구를 `index.html`의 `<template id="ui-text">`에 두고 JS가 읽음 | 저장소 규칙상 코드 파일에 한국어를 넣지 않는다. 모든 문구를 index.html에서 grep으로 확인할 수 있다 |
| SVG 인라인 수정 | 9장 자산 협의 | sprig에 `sp-flower`/`sp-stem`/`sp-leaf--1~3`/`sp-dot--center`/`sp-dot--end` 클래스, string-lights 전구에 `data-i="0"~"6"`, 후광 `opacity="0.25"` → `fill-opacity="0.25"` | 원본 SVG 파일은 그대로 두고 인라인 사본에서 반영 |
| hero 아래 여백 | 예산에 없음 | `padding-bottom: 24px` | 스크롤 큐가 화면 끝에 붙지 않게. 390x844, 375x667, 375x548 모두 첫 화면 안에 들어가는 것을 측정으로 확인 |
| 캘린더 일요일 | 머리글 accent | 머리글만 accent, 날짜 숫자는 text | 컨셉 시트 지정 범위 그대로 |

참고로 greeting을 화면 가운데에 둔 상태에서는 hero 아래쪽이 아직 IO 띠(가운데 70%)와 겹쳐서 `running`이 `['hero']`로 나온다. 명세 1-4의 IO 정의대로 동작한 결과다. gallery·guestbook 위치에서는 `running`이 빈 배열이다.

## 5. frontend가 직접 쓴 문구 (카피 시트에 없는 것)

| 문구 | 위치 | 출처 |
|---|---|---|
| 계좌번호를 준비하고 있습니다 | 계좌 복사 버튼, placeholder 상태일 때 토스트·낭독 | 모션 명세 4-4 (카피 시트에 없음) |

나머지 화면·낭독 문구는 모두 카피 시트에서 가져왔다. 메타 태그 중 `og:locale`(`ko_KR`)과 `theme-color`(`#FBF6F1`)는 설정값이다.

## 6. placeholder 위치

`grep -n '\[\[TODO:' index.html` 결과(주석 줄 포함). `script.js`와 `style.css`에는 placeholder 값이 없다(`script.js`의 `'[[TODO'`는 placeholder 판별용 문자열).

```
12:       TODO(user): replace [[TODO:SITE_URL]] with the deployed origin without a trailing slash,
18:  <meta property="og:url" content="[[TODO:SITE_URL]]/">
19:  <meta property="og:image" content="[[TODO:SITE_URL]]/images/og-garden.jpg">
250:      <!-- TODO(user): replace [[TODO:SUBWAY]], [[TODO:BUS]], [[TODO:PARKING]] with confirmed directions. -->
254:          <dd>[[TODO:SUBWAY]]</dd>
258:          <dd>[[TODO:BUS]]</dd>
262:          <dd>[[TODO:PARKING]]</dd>
293:          <!-- TODO(user): fill [[TODO:GROOM_BANK]] and [[TODO:GROOM_ACCOUNT]]; the copy button copies #groom-account. -->
294:          <p class="account__number"><span>[[TODO:GROOM_BANK]]</span> <span id="groom-account">[[TODO:GROOM_ACCOUNT]]</span></p>
308:          <!-- TODO(user): fill [[TODO:BRIDE_BANK]] and [[TODO:BRIDE_ACCOUNT]]; the copy button copies #bride-account. -->
309:          <p class="account__number"><span>[[TODO:BRIDE_BANK]]</span> <span id="bride-account">[[TODO:BRIDE_ACCOUNT]]</span></p>
329:      <!-- TODO(user): replace [[TODO:GUESTBOOK_ENDPOINT]] with a form endpoint that accepts POST
331:      <form class="gb-form reveal" action="[[TODO:GUESTBOOK_ENDPOINT]]" method="POST" novalidate>
379:        <!-- TODO(user): replace [[TODO:KAKAO_JS_KEY]] with the Kakao JavaScript key. Until then the button copies the link. -->
380:        <button type="button" class="btn btn--primary" id="share-kakao" data-kakao-key="[[TODO:KAKAO_JS_KEY]]">카카오톡으로 공유하기</button>
```

placeholder가 남아 있을 때의 동작:

- `SITE_URL`: 링크 복사와 카카오 공유 링크는 현재 주소(`location.href`)를 쓴다. og 미리보기는 절대 URL이 필요하므로 배포 전에 반드시 채워야 한다.
- 계좌: 복사 버튼이 placeholder를 복사하지 않고 "계좌번호를 준비하고 있습니다"를 띄운다.
- `GUESTBOOK_ENDPOINT`: 전송하지 않고 "지금은 방명록을 받을 수 없습니다…" 안내를 띄우며 입력값은 유지한다.
- `KAKAO_JS_KEY`: SDK를 부르지 않고 링크를 복사한 뒤 카카오 폴백 문구를 띄운다.
- BGM: `audio/bgm.mp3`는 이미 있으므로 placeholder가 아니다.

## 7. 화면 확인 결과

로컬 서버(`python3 -m http.server 8765`)에서 headless Chrome으로 확인했다. 안내받은 `--screenshot --window-size=390,844` 방식은 macOS headless Chrome의 최소 창 폭(500px) 때문에 레이아웃 폭이 500px로 잡혔고(왼쪽에 바깥 면 10px이 보임), 프로세스가 끝나지 않았다. 그래서 CDP(`Emulation.setDeviceMetricsOverride`)로 정확한 뷰포트를 지정하고, 실제로 스크롤해서 IntersectionObserver reveal이 자연스럽게 발동한 상태를 캡처했다. 디버그 파라미터나 virtual time은 쓰지 않았다. 스크린샷과 스크립트는 scratchpad에만 있고 저장소에는 넣지 않았다.

| 항목 | 결과 |
|---|---|
| 390x844 첫 화면 | 날짜(y 187–227), 사진(277–537, 390x260 3:2), 이름(565–601), 장소(637–659), 스크롤 큐(679–707) 모두 화면 안. 가로 스크롤 없음(scrollWidth 390) |
| 375x667 첫 화면 | 스크롤 큐 끝 y 613. 모두 화면 안 |
| 375x548 (압축 규칙) | 장소 줄 끝 y 501, 스크롤 큐 숨김 |
| 1280x900 데스크톱 | 480px 컬럼 가운데, 바깥 surface, BGM 토글이 컬럼 안 오른쪽 위 |
| 폰트 | 9종 모두 로드 확인(Allura, Cormorant 300/500/400i, Gowun Batang 400/700, Pretendard 400/500/600) |
| 보케 | 구간별 하나씩만 실행(hero → calendar → share), gallery·guestbook에서 `running: []`, 최대 생존 8(hero)·6, `maxPeak` glow ≤ 0.279, primary ≤ 0.180. 사진·카드 위에는 나타나지 않음 |
| 전구 | 점등 후 opacity 0.85–0.99 사이에서 호흡 |
| 스크롤 완주 후 | 숨은 reveal 0개, 안 그려진 디바이더 0개, D-day "D-85 / 인혁과 유민의 결혼식까지 85일 남았습니다." |
| 라이트박스 | 2번 셀 탭 → 2/15로 열림, 첫 포커스 닫기 버튼, `html.lb-open`, 원본 01.jpg 로드, → 키 3/15, 왼쪽 스와이프 4/15, 더블탭 2배 / 다시 더블탭 1배, 핀치 3배에서 clamp, Esc 닫기 후 2번 셀로 포커스 복귀·history 원복, 아래로 끌어 닫기 동작 |
| reduced-motion | 모든 섹션 즉시 표시, hero 사진 opacity 1, 디바이더 완성, 전구 opacity 1·animation none, calendar·share 캔버스 `display: none`, hero에 정지 점 5개. 런타임에 설정을 되돌리면 새로고침 없이 hero 보케 재개 |
| 복사·폼·공유 | 계좌 placeholder 보호 토스트, 주소 복사 라벨 "✓ 복사했습니다", 방명록 빈 값 검증(`aria-invalid`), 접수 주소 미설정 안내, 카카오 폴백 문구 |
| BGM | 탭 전 `bgm.mp3` 요청 없음. 탭 후 재생, volume 0.60, 링 표시. 다시 탭하면 정지 |
| 콘솔 | 모든 시나리오에서 오류·예외 0건 |

확인 중 고친 것: 토스트가 `left: 50%` 때문에 뷰포트 절반 폭으로 줄어 두 줄로 꺾이던 문제(`width: max-content` 추가).

## 8. 배포 가이드

1. placeholder를 채운다: `grep -n '\[\[TODO:' index.html`로 남은 항목을 확인한다.
   - `SITE_URL`: 끝에 `/` 없이 배포 주소(예: `https://<계정>.github.io/wedding-letter`). `og:url`, `og:image` 두 곳.
   - 계좌 4개, 교통편 3개(확인된 정보만), 방명록 접수 주소(Formspree 등 POST + JSON 응답을 주는 서비스), 카카오 JavaScript 키.
2. GitHub Pages: 저장소 루트를 그대로 배포한다. `.nojekyll`이 있으므로 Jekyll 처리 없이 정적 파일로 나간다.
3. 카카오 공유를 쓰면 카카오 디벨로퍼스 앱의 [플랫폼 > Web]에 배포 도메인을 등록한다. 키가 없으면 버튼은 링크 복사로 동작한다.
4. 카카오톡 미리보기 캐시: 공유 미리보기가 예전 이미지로 보이면 카카오 공유 디버거에서 URL 캐시를 초기화한다(og 이미지는 새 파일명 `og-garden.jpg`를 쓴다).
5. 배포 후 휴대폰에서 확인할 것: 첫 화면(날짜·사진·이름·장소), BGM 토글, 갤러리 라이트박스 스와이프·핀치, 계좌 복사, 방명록 전송 1회, 카카오 공유 미리보기.
6. 쓰지 않는 예전 자산(`images/divider-hairline.svg`, `images/monogram-iy.svg`, `images/og-thumbnail.*`, `images/floral-*.png`, `images/gallery-placeholder-*.png`, `images/hero-illustration.png`, `images/photos/thumb/hero.jpg`)은 페이지에서 참조하지 않는다. 지울지는 사용자가 정한다.

## 9. 사용자 카피 수정 반영 (2026-10-10)

`00_user-input.md` 맨 아래 "사용자 카피 수정" 표의 항목만 반영했다. `script.js`는 바꾸지 않았다. 주소 복사는 `#venue-address`의 글자를 그대로 읽으므로 HTML만 고치면 된다.

| 항목 | 반영 | 위치 |
|---|---|---|
| `<title>`, `og:title` | "인혁 ♡ 유민, 우리 결혼합니다". 카카오 공유 제목은 지금처럼 og:title에서 읽는다 | index.html:8, 16 |
| couple 제목 | "신랑 신부" | index.html:119 |
| couple 정렬 | "아들"/"딸"을 `span.couple__rel`(inline-block, 폭 2em, 가운데 정렬)에 넣었다. `.couple__line`에 letter-spacing이 없어서 2em만으로 충분하다("아들" 글자 폭 28.36px < 칸 30px) | index.html:121-132, style.css:463-467 |
| calendar 제목 | "예식일" | index.html:155 |
| 영문 일시 줄 | `calendar__when-en` 문단과 CSS 규칙 삭제. hero의 `SUNDAY · 3 PM`은 그대로 | index.html, style.css |
| 달력 caption | "JANUARY 2027"만 남기고 `cal__caption`("2027년 1월") span과 CSS 규칙 삭제 | index.html:160-162 |
| 주소 | "서울 송파구 송파대로 155". index.html·script.js에 "NH송파농협" 0건 | index.html:236 |
| notice 신설 | venue와 account 사이. 공용 `.section` / `.section-head` / `.eyebrow` / `.section-title` / `reveal` 패턴, 본문은 기본 문단 스타일(Gowun Batang 15px / 1.95, account 안내문과 같음)을 그대로 상속해 전용 CSS가 없다 | index.html:271-278 |
| account 안내문 1연 | 3행으로 교체, 2연은 그대로 | index.html:286 |
| 방명록 전송 성공 | "소중한 말씀이 잘 전달되었습니다. 감사합니다." | index.html `<template id="ui-text">` `gb-success` |

notice의 배경과 간격: 컨셉 시트 `layout_mood`가 면을 background와 surface 두 단계로 두고 surface는 카드(venue·account)와 guestbook 밴드에만 쓴다고 정했으므로 background로 뒀다. 섹션 상하 패딩도 컨셉 시트의 80px 그대로다. 앞뒤(venue, account)가 모두 background 섹션이라 기존 venue → account 사이 간격(80 + 80px)이 그대로 이어진다. 보케 구간이 아니라 캔버스는 넣지 않았다. 섹션 번호 주석은 index.html·style.css 모두 notice를 7로 넣고 뒤를 8~10으로 밀었다.

### couple 정렬 실측 (getBoundingClientRect, 신랑 줄 − 신부 줄)

| 뷰포트 | 행 폭 | 줄 왼쪽 | 줄 오른쪽 | 줄 폭 | 이름 왼쪽 | 이름 오른쪽 |
|---|---|---|---|---|---|---|
| 390x844 | 0 | 0.39px | -0.39px | -0.78px | 0.69px | -0.39px |
| 360x780 | 0 | 0.39px | -0.39px | -0.78px | 0.69px | -0.39px |

모두 1px 이내다. 남은 차이는 Gowun Batang 한글 글자 폭이 글자마다 조금씩 달라서 생긴다(부모님 함자 "방주경 · 주진숙" / "손홍희 · 김연주"가 0.3px, 이름 "인혁" 31.69px / "유민" 32.77px). 두 칸(`.couple__rel`)은 모두 폭 30px이고, 칸 끝에서 이름까지 간격도 두 줄 모두 6.66px다.

### 스크린 리더 문장

`.couple__rel` 칸 뒤의 일반 공백은 Chrome 접근성 트리에서 빠졌다(inline-block 옆 공백은 블록 경계로 보고 버린다). 그대로 두면 접근성 트리 글자가 "딸유민"으로 붙는다. 그래서 칸 뒤 공백을 `&nbsp;`로 바꿨다. 화면 폭은 일반 공백과 같다(간격 6.66px 동일). CDP `Accessibility.getFullAXTree`로 확인한 문단 글자:

- 신랑 줄: "방주경 · 주진숙의 아들 인혁" (StaticText "방주경 · 주진숙의 " / "아들" / NBSP / "인혁")
- 신부 줄: "손홍희 · 김연주의 딸 유민" (StaticText "손홍희 · 김연주의 " / "딸" / NBSP / "유민")

### 화면 확인

로컬 서버(`python3 -m http.server 8767`)와 headless Chrome CDP로 390x844, 360x780에서 확인했다. 스크린샷은 scratchpad(`fe-copy/`)에만 있다.

| 항목 | 390 | 360 |
|---|---|---|
| 가로 스크롤 | 없음(scrollWidth 390) | 없음(scrollWidth 360) |
| 콘솔 오류·예외 | 0건 | 0건 |
| 스크롤 완주 후 숨은 reveal | 0개 | 0개 |
| 섹션 순서 | hero, greeting, couple, calendar, gallery, venue, notice, account, guestbook, share | 같음 |
| 주소 복사 버튼이 넘기는 글자 | 서울 송파구 송파대로 155 | 같음 |
| account 안내문 줄바꿈 | 3행 + 2행, 의도하지 않은 줄바꿈 없음 | 같음 |
