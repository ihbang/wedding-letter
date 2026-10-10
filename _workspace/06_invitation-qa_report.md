# QA Report — 2026-10-10

"Petal & Glow" (방인혁 · 손유민, 로맨틱 가든) 첫 구현 검증.

> 2차 QA(사용자 카피 수정 반영) 결과는 문서 끝 "2차 QA" 절에 있다: PASS 38 / FAIL 0 / WARNING 1(새로 생긴 W5), 1차 WARNING 4건은 그대로 남아 있다. 바로 아래 요약은 1차 결과다.
>
> 3차 QA(갤러리 캐러셀, 2026-10-11) 결과는 문서 맨 끝 "3차 QA" 절에 있다: PASS 67 / FAIL 0 / WARNING 2(새로 생긴 W6·W7). W4는 해소됐고 W1·W2·W3·W5는 그대로다.

## 요약

- 전체 결과: **PASS** (FAIL 0)
- PASS 82 / FAIL 0 / WARNING 4
- 직접 수정 1건: `index.html:415` 토스트 문구 끝에 마침표 추가 (아래 "직접 적용한 수정")
- 기준: `00_user-input.md`(정보의 진실의 원천), 01 컨셉 시트, 02 카피, 03 매니페스트, 04 모션 명세(모션의 진실의 원천), 05 frontend 요약
- 검증 방법
  - 정적: grep과 Python 스크립트로 입력 문서와 `index.html`·`style.css`·`script.js`를 교차 대조 (`scratchpad/qa/static_checks.py`, 출력 `static_checks.out`)
  - 브라우저: 로컬 서버 `127.0.0.1:8766` + headless Chrome을 CDP로 구동 (`Emulation.setDeviceMetricsOverride`로 정확한 뷰포트 지정, `scratchpad/qa/qa.mjs`). 웹폰트 9종이 실제로 로드된 상태에서 측정했다. 스크립트와 스크린샷은 scratchpad에만 있고 저장소에는 넣지 않았다
- 남은 WARNING 4건은 모두 배포 전 사용자 입력 또는 커밋 절차 문제다. 페이지 구현 결함은 없다

## 1. 정보 정합성

| 항목 | 사용자 입력 / 컨셉 시트 | HTML 값 (위치) | 결과 |
|------|------------|---------|------|
| 신랑 이름 | 방인혁 | 6회 (title, og, hero h1, 계좌 예금주·aria-label) | PASS |
| 신부 이름 | 손유민 | 6회 | PASS |
| 신랑 부·모 | 방주경 · 주진숙 | "방주경 · 주진숙의 아들 인혁" (index.html:124) | PASS |
| 신부 부·모 | 손홍희 · 김연주 | "손홍희 · 김연주의 딸 유민" (index.html:128) | PASS |
| 서열 표기 금지 | "아들", "딸"만 | 장남·장녀·차남·차녀·삼남·삼녀·막내·외아들·외동딸·첫째·둘째 grep 0건 (3개 파일) | PASS |
| 일시 | 2027-01-03 (일) 오후 3시 | "2027년 1월 3일 일요일 오후 3시" 4회, "2027 · 01 · 03" / "SUNDAY · 3 PM", 영문 "SUNDAY, JANUARY 3, 2027 · 3 PM", `data-wedding-date="2027-01-03"` | PASS |
| 요일·달력 | 2027-01-03 = 일요일 | 1일 금요일 칸 시작, 3일이 일요일 열(accent 원 36px), 31일 일요일 (index.html:167-172, 화면 확인) | PASS |
| 장소 | 더컨벤션 송파문정 13층 아모르홀 | 4회 (description, og, hero, venue) | PASS |
| 주소 | 서울 송파구 송파대로 155 NH송파농협 13층 | index.html:236. 주소 복사 결과 클립보드 문자열도 동일(실측) | PASS |
| 팔레트 | `--color-*` 13개 | style.css:9-21 HEX 13개 모두 컨셉 시트와 동일 | PASS |
| 카피 섹션 누락 | meta, skip_link, bgm_toggle, hero 3종, alt, section_titles 7, greeting, couple_intro, ceremony_info, calendar, dday 3종, gallery hint·alt·controls, directions, venue_buttons, account_message·info, guestbook 전체, share, monogram, closing, kakao_share, common_status | 전 항목 존재. 런타임 문구는 `<template id="ui-text">`(index.html:410-429)에서 확인 | PASS |
| 금지어 | 가든·정원·야외·벚꽃·봄·결혼합니다·하나가 되는 | index.html·script.js·style.css grep 0건 (속성·주석 포함) | PASS |
| 갤러리 순서 | 02, 01, 08 / 03, 09, 12 / 07, 13, 05 / 11, 06, 14 / 10, 04, 15 | 15칸 순서·파일명이 컨셉 시트 `photos.gallery.order`, 카피 시트 표와 일치. hero.jpg는 갤러리에 없음 | PASS |
| 갤러리 alt·버튼 이름 | 카피 시트 `gallery_alt`, "사진 {n} / 15 크게 보기: {alt}" | 15건 alt·aria-label 글자 단위 일치 | PASS |
| 이미지 크기 속성 | 실제 픽셀 | 원본 `data-w/h` 15건, 썸네일 `width/height` 15건, hero 1600x1066 모두 JPEG 헤더 실측과 일치 (14.jpg 1067x1600 / 600x899 포함) | PASS |
| object-position | 02: 70% 50%, 15: 54% 50% | 동일, 나머지 13칸 없음 | PASS |
| 참조 파일 존재 | HTML·CSS·JS의 로컬 참조 전체 | 36개 참조(audio 1, wreath, favicon, 원본 16, 썸네일 15, css, js) 중 **누락 0건**. og:image 대상 `images/og-garden.jpg` 존재, 1200x630 | PASS |
| 예전 자산 참조 | 쓰지 않음 | `jo--`, `op1789048062`, `divider-hairline`, `og-thumbnail`, `monogram-iy`, `floral-`, `gallery-placeholder`, `hero-illustration`, `thumb/hero.jpg` grep 0건 | PASS |
| og 메타 ↔ kakao_share | title / description / image / image:alt | og:title·description이 카피와 동일, og:image:alt는 카피 문구(벚꽃 대신 "분홍 꽃가지"). 카카오 공유는 같은 메타를 읽음(script.js:1184-1186) | PASS |
| alt 사실성 | 사진 내용 | 사용자 설명과 표현이 다른 07(꽃잎), 11(눈을 감고)을 사진으로 확인. 07의 컨페티는 꽃잎 모양, 11은 눈을 감고 미소 지음. 둘 다 정확 | PASS |

## 2. 모바일 반응형

| 항목 | 측정 | 결과 |
|------|------|------|
| viewport 메타 | `width=device-width, initial-scale=1, viewport-fit=cover`, `user-scalable=no`·`maximum-scale` 없음 | PASS |
| 가로 스크롤 | 360 / 375 / 390 / 430 (+768, 1280)에서 전 섹션 reveal 후 `scrollWidth` = viewport | PASS |
| 화면 밖 요소·잘린 텍스트 | 모든 폭에서 viewport 밖으로 나가는 요소 0, overflow로 잘린 텍스트 0 | PASS |
| 첫 화면 (컨셉 QA 기준) | 390x664: 날짜 97-137, 사진 187-447, 이름 475-511, 장소 547-569 / 375x548(압축 규칙): 장소 끝 501, 스크롤 큐 숨김. 360x640·375x667·390x844·430x932도 모두 첫 화면 안. hero 사진 비율 1.501(3:2, 크롭 없음) | PASS |
| BGM 토글 겹침 | 360px에서 토글 x 304-344 / y 16-56, eyebrow 글자 x 65-299 / y 102-118. 모든 폭에서 날짜·eyebrow와 겹치지 않음 | PASS |
| 한글 최소 크기 | 14px 미만 한글 텍스트 0건 (sr-only 제외) | PASS |
| 섹션 간격 | 상하 80px 통일. 예외는 hero(48/24, 압축 28/24), greeting 아래 0 + 디바이더 56 + couple 위 56(두 섹션을 디바이더로 잇는 의도된 리듬) | PASS |
| 데스크톱 컬럼 | 768·1280에서 480px 컬럼 가운데, 토글이 컬럼 안 오른쪽 16px(768: 608 = 624-16, 1280: 864 = 880-16) | PASS |

## 3. 접근성

| 항목 | 측정 | 결과 |
|------|------|------|
| lang | `<html lang="ko">`, 영문 문자열(eyebrow 8, hero 3, 달력 영문 2, D-day 숫자, Thank you, 모노그램, lightbox 카운터)에 `lang="en"` | PASS |
| img alt | alt 없는 `<img>` 0. 장식은 wreath 1건만 `alt=""`(모노그램 컨테이너가 `role="img"` "인혁과 유민의 이니셜") | PASS |
| heading | h1 1회(hero "방인혁과 손유민", `&` 낭독 방지 aria-label) → h2 8개, 스킵 없음 | PASS |
| 랜드마크 | main 1 + 이름 있는 region 8 (aria-labelledby) | PASS |
| 이름 없는 컨트롤 | CDP 접근성 트리에서 이름 없는 button·link·img·textbox·dialog 0건 | PASS |
| 장식 숨김 | aria-hidden 밖으로 노출된 svg·canvas 0건 | PASS |
| 컬러 대비 | text/bg 12.26, text/surface 11.09, muted/bg 5.17, muted/surface 4.68, accent/bg 5.45, accent/surface 4.93, sage_deep/bg 5.44, sage_deep/surface 4.92, on_accent/accent 5.72, placeholder muted/field 5.48, 토스트 12.26, lightbox 카운터 15.25. 보케 최대 불투명도 위에서 muted 4.58·accent 4.82(primary 0.18), 4.68·4.93(glow 0.28). 입력 경계 field_border 3.37/3.05/3.57(비텍스트 3:1) | PASS |
| 장식색 글자 사용 | CSS `color:`에 쓰인 토큰은 text, muted, accent, sage-deep, on-accent, bg뿐. primary·secondary·glow·line 0건 | PASS |
| 터치 영역 | 버튼·링크 높이 44 이상. BGM 토글은 시각 40px + `::before` 44px | PASS |
| 상태 낭독 | 복사·카카오·BGM 실패는 `#live-status`(role=status), 방명록은 `.gb-status`(role=status). 시각 토스트는 aria-hidden. 같은 문구 재낭독(50ms 비웠다 채움) 코드 확인 | PASS |
| 새 창 링크 | 지도 2개 `target=_blank rel=noopener`, 이름 "{지도}에서 예식장 위치 보기 (새 창)" | PASS |

## 4. 인터랙션 (headless Chrome 실측)

| 항목 | 측정 | 결과 |
|------|------|------|
| D-day (KST) | `Date.now` 고정 실측: 2026-10-10 → D-85 / 2027-01-02 23:59 KST → D-1 / 01-03 00:00·23:59 KST → D-DAY + "오늘, 인혁과 유민이 부부가 됩니다." / 01-04 00:00 KST → 숫자 숨김 + 감사 문구 / UTC 날짜가 하루 이른 2026-12-31 08:00 KST → D-3. 카운트업 없음 | PASS |
| 계좌 복사 | placeholder 상태: 클립보드에 쓰지 않고 토스트·낭독 "계좌번호를 준비하고 있습니다." | PASS |
| 주소·링크 복사 | 실제 클립보드 읽기로 확인: 주소 = 예식장 주소 문자열, 링크 = 현재 URL(SITE_URL placeholder일 때). 라벨 "복사했습니다" 1600ms 후 복귀 | PASS |
| 복사 폴백 | `clipboard.writeText` 거부 시 `execCommand('copy')` 1회 호출로 성공 처리. 둘 다 실패 시 "복사하지 못했습니다. 길게 눌러 직접 복사해 주세요." + 주소 텍스트가 Selection으로 선택됨 | PASS |
| lightbox 열기 | 5번 셀 → "5 / 15", sr "15장 중 5번째 사진"(aria-live polite), 첫 포커스 "닫기", `html.lb-open`·`overflow: hidden`, 휠 스크롤 잠김, 현재 슬라이드만 aria-hidden=false, 원본 09.jpg 교체, ±1(03, 12) 원본 프리로드, 그 밖 src 없음, 보케 running [] | PASS |
| 스와이프 | 왼쪽 스와이프 → 다음, 28px 느린 끌기 → 제자리, 마지막(15/15)에서 왼쪽 → 제자리(다음 버튼 disabled) | PASS |
| 확대 | 더블탭 2배, 핀치 3배에서 clamp, 확대 중 팬이 가장자리에서 clamp, `+`/`0` 키, ctrl+wheel(3배 clamp) | PASS |
| 키보드 | ←/→ 이동, Esc 닫기. 바·카운터·사진처럼 포커스 불가 영역을 마우스로 눌러도 dialog로 포커스가 가서 화살표가 계속 동작 | PASS |
| 닫기 | Esc, `history.back()`(Android 뒤로가기), 빈 무대 탭, 아래로 끌기(scrim 0.96→0.648 후 닫힘) 모두 동작. 닫은 뒤 연 셀로 포커스 복귀, `history.state` 원복, 보케 재개 | PASS |
| BGM | 탭 전 `bgm.mp3` 요청 0건(네트워크 로그), `preload="none"`, autoplay 없음. 탭 후 재생·volume 0.60·`aria-pressed=true`·glow 링 호흡. 다시 탭 → 정지·링 제거. 음원 오류 주입 시 `aria-pressed=false`·`aria-busy` 제거·"음악을 재생하지 못했습니다…" 낭독 | PASS |
| 방명록 | 빈 성함 → "성함을 적어 주세요." + aria-invalid + 포커스 / 빈 말씀 → "남기실 말씀을 적어 주세요." / 접수 주소 미설정 → 안내 문구, 입력값 유지 / 전송 실패(501 주입) → 전송 중 버튼 disabled·"보내는 중…" → "말씀을 보내지 못했습니다…", 입력값 유지, 버튼 복귀 | PASS |
| 카카오 공유 | 키 placeholder → SDK 요청 없이 링크 복사 + "카카오톡 공유를 열 수 없어 링크를 복사했습니다. 대화방에 붙여 넣어 주세요." | **WARNING (W2)** |
| JS 꺼짐 | `.js` 게이트로 reveal 0개 숨김, hero 사진·디바이더·전구 모두 완성 상태, D-day 블록 숨김(의도) | PASS |
| 콘솔·네트워크 | 모든 시나리오에서 페이지 발생 오류·예외 0, 4xx/5xx 0 (기록된 501·404는 QA가 일부러 주입한 것, Canvas2D 경고는 QA 픽셀 측정 때문) | PASS |

## 5. 모션 명세 구현도

| 항목 | 명세 | 구현 (위치) | 결과 |
|------|------|------|------|
| 토큰 20개 | `--ease-*` 5, `--dur-*` 12, `--reveal-distance`, `--stagger`, `--bulb-stagger` | style.css:38-63 값 20개 모두 글자 단위 일치 | PASS |
| reduced 토큰 재정의 | 13개 0ms/0px | style.css:65-71, 명세 블록과 동일 | PASS |
| `BOKEH` 상수 | 1-7 참고 코드 | script.js:107-120, 14줄 전부 일치(difflib 차이 0) | PASS |
| 참고 함수 | makeSprite·pickDiameter·spawn·step | 앞 3개 차이 0줄, step은 `ctx.globalAlpha = 1` 1줄 추가(요약에 기재) | PASS |
| 구간·입자 수 | hero 8 / calendar 6 / share 6, 모바일 합산 12 | `stats()` 10초씩 250ms 샘플: 구간 최대 8 / 6 / 6, 합산 최대 8 | PASS |
| 불투명도 상한 | glow 0.28, primary 0.18 | `maxPeak` glow 0.266~0.275, primary 0.160~0.178. **캔버스 픽셀 실측** 최대 alpha glow 0.259, primary 0.161 | PASS |
| 제외 영역 | hero 사진, 전구 SVG, share 디바이더·wreath | 해당 요소 사각형 안 캔버스 alpha 0 (3구간 모두) | PASS |
| 정지 조건 | 구간 밖·탭 숨김·라이트박스 | gallery·venue·guestbook에서 running [], lightbox 열림 running [], visibilitychange는 `pauses` Set(script.js:385-389) | PASS |
| 30fps·DPR 1·dt 상한 | 33ms 게이트, DPR 1, dt ≤ 0.05 | script.js:224, 306-307, 317 | PASS |
| 2-0 reveal | IO 0.15 / -10%, 1회, stagger ≤2, `html.js` 게이트, 안전장치 | script.js:450-487, style.css:921-932. 스크롤 완주 후 숨은 reveal 0 | PASS |
| 2-1 hero 시퀀스 | 0/300/600/900/1700ms, 사진 opacity만, decode 대기, preload | script.js:9, 493-541, index.html:26. 사진에 transform 없음 | PASS |
| 3-1 sprig stroke-draw | 3곳 인라인, sp-* 클래스, IO 0.5 | index.html:95/185/341, style.css:946-954. 인라인 path 9·circle 3이 원본 SVG와 좌표 일치 | PASS |
| 3-2 전구 | 주기 4.6/5.4/4.2/5.8/4.8/6.0/5.0s, 점등 140ms 간격, 화면 밖·lightbox 일시정지 | 주기 7개 일치. 화면 안 `bulb-breathe: running`, guestbook 위치에서 `paused` | PASS |
| 4-1 그리드 | 3x5, 2:3, lazy, width/height, 썸네일 페이드 | 구현 | PASS |
| 4-2 lightbox | 4장 표 참조 | 4. 인터랙션 실측 전 항목 | PASS |
| 4-3 BGM | 자동재생 없음, preload none, 링 3000ms, 볼륨 페이드 | 실측 + script.js:1002-1080 | PASS |
| 4-4 복사 | 라벨 1600ms, 토스트 1800ms, 낭독, 폴백 3단, 진동 12ms | 실측 + script.js:1084-1144 | PASS |
| 4-5 D-day | KST, 카운트업 없음 | 실측 | PASS |
| 4-9 스크롤 큐 | 1700ms 등장, 2400ms 루프, scrollY > 24에서 제거, 압축 화면 숨김 | 구현. 375x548·360x640에서 `display: none` | PASS |
| 금지 속성 | width/height/top/left/margin/padding/filter/box-shadow/backdrop-filter/background-position 애니메이션 금지 | transition 대상 grep 0건. @keyframes 속성은 stroke-dashoffset, opacity, transform뿐. `will-change`는 드래그 중 트랙 1곳 | PASS |
| 금지 효과 | 꽃잎·컨페티 파티클, 패럴랙스, hero 확대, 사진 filter·blend·오버레이, scroll-behavior | 0건 (`filter`는 주석과 `Array.filter`뿐) | PASS |
| 루프·리스너 예산 | 동시 루프 3 이하, scroll 리스너 1개 | scroll 리스너 1개(passive, 1회 후 해제), guestbook 위치 무한 애니메이션 0 | PASS |
| reduced: 보케 | hero 정적 점 5개, calendar·share 숨김 | 캔버스 hero block/opacity 1, calendar·share `display: none`, 점 최대 alpha 0.255, running [], 스크린샷으로 점 5개 확인 | PASS |
| reduced: 루프·전환 | 모든 루프 정지, 즉시 표시 | 로드 직후·스크롤 완주 후 실행 중 애니메이션 0, 숨은 reveal 0, sprig 3개 완성, 전구 1/none, 스크롤 큐 정지 선, BGM 켜도 링 opacity 0.8·animation none | PASS |
| reduced: 런타임 전환 | 새로고침 없이 전환, BGM 유지 | reduce → 동작: hero 보케 재개(living 7), 링 호흡 재개, BGM 계속 재생. 동작 → reduce: running [], 무한 루프 0, BGM 계속 재생. hero 시퀀스 도중 전환도 깨지지 않음 | PASS |
| 명세와 다르게 처리한 부분 | 05 요약 4장 24건 | 아래 "명세 이탈 검토" 표. 24건 모두 타당 | PASS |

### 명세 이탈 검토 (05 요약 4장)

| 항목 | 판정 | 근거 |
|---|---|---|
| sprig 숨김 대시 `1 1` → `1 2` | 타당 | frontend의 3배 캡처에서 `1 1`은 path 끝마다 점이 남고 `1 2`는 깨끗하다(매니페스트도 같은 지적). 그려진 상태는 동일 |
| 장식 루프를 `no-preference` 안에 배치 | 타당 | 명세 reduce 규칙(`.sprig :is(...)`, 명시도 0,2,0)이 숨김 규칙(`.js .sprig :is(...)`, 0,3,0)에 져서 그대로 두면 reduce에서 디바이더가 숨는다. 실측으로 reduce 완성 상태 확인 |
| reduce에서 JS가 즉시 `.is-visible` | 타당 | 0ms 토큰만으로는 화면 밖 그룹이 opacity 0으로 남는다 |
| 페이지 끝 안전장치를 센티널 IO로 | 타당 | 명세 8장 "scroll 리스너는 스크롤 큐 1개" 규칙을 지킨다 |
| 30fps 게이트 32.3ms | 타당 | vsync 지터로 20fps대로 떨어지는 문제 방지 |
| 합산 상한과 pre-seed 정리 | 타당 | 상한 12를 구조로 보장. 실측 합산 최대 8 |
| 제외 영역 측정 시 reveal translateY 보정 | 타당 | 실측 제외 영역 alpha 0 |
| 높이 40px 이하 변화 시 경계 밖 입자만 제거 | 타당 | 경계에서 원이 잘리는 직선 모서리 방지 |
| `stats()` 정의 | 타당 | 읽기 전용 QA 훅, 동작 영향 없음 |
| 갤러리 버튼 aria-label, 복사 라벨, BGM aria-label, 재생 실패 낭독, lightbox 카운터 낭독 | 타당 | 명세 4-4가 "카피 파일에 같은 항목이 있으면 그쪽을 쓴다"고 정함. 모두 카피 시트 문구 |
| 티맵 제외 | 타당 | Should 항목이고 카피 시트도 "쓰는 것만". 앱 키 없는 웹 URL이 없다 |
| 250/400/600ms를 토큰·calc로 | 타당 | reduce에서 0ms로 따라간다 |
| 핀치 하한 0.6 후 1로 복귀 | 타당 | 명세에 하한 미정 |
| scrim 별도 요소 | 타당 | transform/opacity만 움직이는 규칙 유지 |
| `showModal` 미지원 시 새 탭 | 타당 | 구형 Safari 대비 |
| 혼주 표기를 couple 섹션에 | 타당 | 컨셉 시트 `sections_order` 기준 |
| UI 문구를 `<template id="ui-text">`에 | 타당 | 코드 파일에 한국어를 넣지 않는 저장소 규칙. script.js·style.css 한글 0건 확인 |
| 인라인 SVG에 클래스·`data-i` 추가, 후광 `fill-opacity` | 타당 | 명세 9장 요구. 원본과 좌표 일치 확인 |
| hero 아래 24px, 달력 일요일은 머리글만 accent | 타당 | 첫 화면 측정 통과, 컨셉 시트 범위 그대로 |

## 6. 배포 준비

| 항목 | 측정 | 결과 |
|------|------|------|
| 외부 리소스 HTTPS | Google Fonts, jsDelivr Pretendard, Kakao SDK, 지도 링크 모두 https. `http://` 0건 | PASS |
| placeholder 안내 | `[[TODO:*]]` 10개 키(SITE_URL, SUBWAY, BUS, PARKING, GROOM_BANK, GROOM_ACCOUNT, BRIDE_BANK, BRIDE_ACCOUNT, GUESTBOOK_ENDPOINT, KAKAO_JS_KEY)가 카피 시트 표와 같고, 05 요약 6장 줄 목록과 일치 | PASS |
| placeholder 화면 노출·og 절대 URL | 교통편 3줄과 계좌 4값이 화면에 그대로 보이고, og:url·og:image가 `[[TODO:SITE_URL]]`로 시작 | **WARNING (W1)** |
| 방명록 접수 주소 | placeholder | **WARNING (W3)** |
| 새 자산 커밋 상태 | 페이지가 참조하는 `images/photos/`(원본 16 + 썸네일 16), `images/deco/`, `images/favicon.svg`, `images/og-garden.jpg`가 untracked이고, 예전 사진 31개는 삭제가 staged 상태 | **WARNING (W4)** |
| `.nojekyll` | 존재 | PASS |
| 회귀 | 아래 표 | PASS |

### 이전 리포트(2026-10-09, "Warm Paper & Ink") 대비

컨셉과 세 파일이 모두 새로 쓰여 셀 단위 비교는 의미가 없다. 공통 항목만 비교했다.

| 이전 항목 | 이전 | 이번 | 변화 |
|---|---|---|---|
| 정보(이름·부모·일시·주소·서열) | PASS | PASS | 회귀 없음 |
| D-day 경계(D-1 / D-DAY / 이후) | PASS | PASS | 회귀 없음 |
| W1 placeholder 노출·계좌 placeholder 복사 | WARNING | WARNING (W1) | 개선: 계좌 복사가 placeholder를 클립보드에 넣지 않음 |
| W2 카카오 키 없음 | WARNING | WARNING (W2) | 개선: 폴백 시 무슨 일이 일어났는지 토스트로 설명 |
| W3 방명록 접수 주소 | WARNING | WARNING (W3) | 같음(JS 꺼짐 시 상대 경로 POST도 같음) |
| W4 13px 텍스트 | WARNING | 해소 | 14px 미만 한글 0건 |

## 직접 적용한 수정

- [x] `index.html:415` `계좌번호를 준비하고 있습니다` → `계좌번호를 준비하고 있습니다.` `<template id="ui-text">`의 다른 문장형 상태 문구(복사·카카오·BGM·D-day·방명록 14개)는 모두 카피 시트대로 마침표로 끝나는데 이 문구만 빠져 있었다(frontend 작성 문구, 05 요약 5장). 토스트와 낭독에만 쓰이며 동작 영향 없음. 수정 후 브라우저에서 토스트·낭독 문구를 다시 확인했다. 05 요약 5장의 문구 표기는 이 한 글자만 달라진다

## 발견된 이슈와 수정 제안

FAIL은 없다. WARNING 4건은 모두 페이지 코드가 아니라 배포 전 처리 사항이다.

- [ ] **W1 (배포 전 필수) `index.html:18-19, 254, 258, 262, 285, 300`** 교통편 3줄과 계좌 은행·번호 4개가 `[[TODO:...]]`로 화면에 보이고, og:url·og:image가 절대 URL이 아니어서 카카오톡·SNS 미리보기 이미지가 나오지 않는다. 카카오 키만 채우고 SITE_URL을 비워 두면 공유 카드 `imageUrl`도 깨진다(script.js:1186) → SITE_URL(끝 `/` 없이), 계좌 4개, 확인된 교통편을 채운 뒤 `grep -n '\[\[TODO:' index.html`로 남은 항목이 의도한 것(방명록·카카오 키를 미룰 경우 그 둘)뿐인지 확인
- [ ] **W2 `index.html:371`, `script.js:1176`** 카카오 JavaScript 키가 없어 "카카오톡으로 공유하기"가 링크 복사로 대신 동작한다(안내 토스트 있음) → 카카오 디벨로퍼스 앱 키를 넣고 [플랫폼 > Web]에 배포 도메인 등록. 키를 쓰지 않을 경우 선택 개선: 폴백 전에 `navigator.share?.({ title, text, url })`(모바일 공유 시트)를 먼저 시도
- [ ] **W3 `index.html:322`, `script.js:1227`** 접수 주소가 없으면 하객이 글을 다 쓴 뒤에야 "지금은 방명록을 받을 수 없습니다…"를 본다. JS가 꺼진 환경에서는 `[[TODO:GUESTBOOK_ENDPOINT]]` 상대 경로로 POST되어 오류 페이지로 이동한다 → 배포 전에 Formspree 등 POST + JSON 응답 주소를 채운다. 채우지 않고 배포할 거라면 placeholder일 때 `#guestbook` 섹션을 `hidden` 처리하도록 frontend에 요청
- [ ] **W4 (커밋 시 필수) git 작업 트리** 페이지가 참조하는 새 자산이 untracked이고, 예전 사진 31개 삭제만 staged 상태다. staged 변경만 커밋하면 배포 페이지에서 hero·갤러리·장식·og 이미지 34개 참조가 모두 깨진다 → 커밋할 때 `git add images/photos images/deco images/favicon.svg images/og-garden.jpg index.html style.css script.js`(와 저장소 관례에 따라 `_workspace/`)를 포함하고, `git ls-files`로 이 리포트 1장의 참조 36개가 모두 추적되는지 확인

### 참고 (판정 대상 아님, 선택 개선)

- JS가 꺼진 환경에서 BGM 토글은 보이지만 누르면 아무 동작도 하지 않고, 갤러리 셀도 크게 보기가 열리지 않는다. 카카오톡 인앱 브라우저는 JS가 켜져 있어 실사용 영향은 작다. 원하면 `html:not(.js) .bgm-toggle { display: none; }` 한 줄로 토글을 숨길 수 있다
- 모션 명세 10장 QA 메모는 "greeting에 머무는 동안 running이 빈 배열"이라고 적었지만, 390x844에서 greeting을 가운데에 두면 hero 아래쪽이 실제로 가운데 70% 띠 안에 있다(실측 `zonesInMiddleBand: ['hero']`). 구현은 규범인 1-4 정의대로 동작하므로 PASS로 판정했다. 명세 10장 문구는 motion-designer가 정정하면 된다
- 성능 예산(Lighthouse Mobile 90, LCP 2.5초, CPU 4x throttle 드롭 프레임 5% 이하)은 이번 환경에서 측정하지 않았다. 배포 후 실기기나 PageSpeed Insights로 한 번 확인할 것을 권장
- 쓰지 않는 예전 자산(`images/floral-*.png`, `gallery-placeholder-*.png`, `hero-illustration.png`, `og-thumbnail.*`, `divider-hairline.svg`, `monogram-iy.svg`, `images/photos/thumb/hero.jpg`, 합계 약 15MB)이 저장소에 남아 함께 배포된다. 페이지 동작과 무관하며 삭제 여부는 사용자가 정한다

---

## 2차 QA (사용자 카피 수정 반영) — 2026-10-10

1차 완성 뒤 사용자가 카피 시트를 직접 고쳤고(`00_user-input.md` 맨 아래 표, 10건), frontend가 `index.html`·`style.css`에 반영했다(`05_frontend-developer_summary.md` 9장). 그 반영 결과와 영향 범위를 회귀 검증했다.

### 요약

- 전체 결과: **PASS** (FAIL 0)
- 2차 판정 39항목: PASS 38 / FAIL 0 / WARNING 1 (W5, 문서 동기화)
- 1차 WARNING W1~W4는 페이지 코드와 무관한 배포 전 처리 사항이고, 이번 수정으로 바뀐 것이 없다(W1 줄 번호만 아래에서 갱신)
- 직접 수정: 없음. 고칠 결함이 나오지 않았다
- 판정 기준: 사용자 수정 표가 컨셉 시트 주소 표기("NH송파농협 13층" 포함)와 카피 시트 머리말 금지어 목록("결혼합니다")보다 우선한다. 두 규칙과 다른 점은 FAIL로 보지 않았다
- 검증 방법
  - 정적: `scratchpad/qa2/static2.py`(10건 글자 단위 대조, 잔재 grep, heading 순서, 52개 검사 → FAIL 0). 1차 정적 스크립트(`qa/static_checks.py`)를 지금 파일에 다시 돌렸더니 출력이 1차와 바이트 단위로 같다(자산 참조 36개, 갤러리 15칸, `BOKEH` 상수·참고 함수, 모션 토큰, 키프레임 속성, 컬러 대비, 팔레트)
  - 브라우저: 로컬 서버 `127.0.0.1:8768` + headless Chrome CDP. 1차 드라이버를 `scratchpad/qa2/qa.mjs`로 복사해 포트를 바꾸고, `copyedit2`·`zonecap`·`reducednotice` 시나리오를 더했다. 1차 시나리오(widths, reduced, nojs, ax, dday, bokeh, interact) 출력은 `qa2/compare.py`로 1차 JSON과 비교했다. Chrome은 샌드박스 안에서 뜨지 않아 샌드박스를 끄고 실행했고, 끝난 뒤 서버와 Chrome을 모두 종료했다(남은 프로세스 0). 스크립트·JSON·스크린샷은 scratchpad에만 있고 저장소에는 넣지 않았다
  - `script.js`는 이번 반영에서 바뀌지 않았다(수정 시각 22:07, 1차 리포트 22:38보다 앞섬). frontend 요약과 같다

### 2-1. 사용자 카피 수정 10건 반영

| # | 항목 | 카피 시트 (사용자 수정) | 구현 / 측정 | 결과 |
|---|------|------|------|------|
| 1 | title · og:title | 인혁 ♡ 유민, 우리 결혼합니다 | `index.html:8`, `:16` 글자 단위 일치. 카카오 공유 제목은 `script.js`가 og:title을 그대로 읽는다(`metaContent('meta[property="og:title"]')`) | PASS |
| 2 | couple 제목 | THE COUPLE / 신랑 신부 | `index.html:119` 일치. 접근성 트리 region 이름도 "신랑 신부" | PASS |
| 3 | calendar 제목 | THE DAY / 예식일 | `index.html:155` 일치. region 이름 "예식일" | PASS |
| 4 | notice 위치 | venue와 account 사이 | 섹션 순서 hero, greeting, couple, calendar, gallery, venue, **notice**, account, guestbook, share. 주석 번호도 html·css 모두 7, 뒤는 8~10 | PASS |
| 5 | notice 문구 | NOTICE / 축하 화환 안내, 본문 2행 | eyebrow·h2·본문 2행 글자 단위 일치(`index.html:274-277`). 360/375/390/430 모두 화면에서도 정확히 2줄 | PASS |
| 6 | notice heading 구조 | 다른 섹션과 같은 패턴 | `<section class="section notice" aria-labelledby="notice-title">` + `h2#notice-title` 1개. 접근성 트리 region "축하 화환 안내". `aria-labelledby` 9개 모두 대상 id 존재 | PASS |
| 7 | notice reveal | 다른 섹션과 같은 패턴 | 그룹 2개(`section-head reveal`, `notice__message reveal`). 스크롤 전 opacity 0 / translateY 12px, transition(`opacity, transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)`)이 venue·account 헤더와 같다. 스크롤 뒤 `is-visible`, opacity 1, transform none | PASS |
| 8 | notice 스타일·간격 | 공용 패턴 (05 요약 9장) | 상하 80px, 좌우 24px, 가운데 정렬, 배경 투명(=background면). 본문 15px/29.25px Gowun Batang, text 색으로 account 안내문과 같다. eyebrow·제목 font와 헤더 아래 40px이 venue와 같다. 섹션 높이 315px로 네 폭에서 같고, venue·account와 사이 틈 0(섹션 패딩 80 + 80). 전용 CSS 없음(`style.css:620` 주석만) | PASS |
| 9 | couple 정렬 | "딸" 앞뒤 공백으로 두 줄 정렬 | HTML은 연속 공백을 하나로 줄이므로 `span.couple__rel`(inline-block, 2em = 30px, 가운데 정렬)로 구현했다. 신랑 줄 − 신부 줄 차이(360/375/390/430 모두 같음): 행 폭 0, 줄 왼쪽 +0.39, 오른쪽 −0.39, 줄 폭 −0.78, "아들"/"딸" 칸 왼쪽·오른쪽 +0.69, 이름 왼쪽 +0.69, 오른쪽 −0.39px. **최대 0.78px, 기준 1px 이내.** 남은 차이는 Gowun Batang 글자 폭 차이("인혁" 31.69 / "유민" 32.77px). 스크린샷에서도 "딸"이 칸 가운데에 있고 이름 열이 맞는다 | PASS |
| 10 | couple 접근성 텍스트 | "…의 아들 인혁", "…의 딸 유민" | CDP `Accessibility.getFullAXTree`: "방주경 · 주진숙의 아들 인혁" / "손홍희 · 김연주의 딸 유민". 공백은 "의" 뒤 U+0020, "아들"/"딸" 뒤 U+00A0(NBSP)이다. 글자가 붙지 않고, NBSP는 스크린 리더가 띄어 읽는다. JS가 꺼져도 `innerText`가 같다 | PASS |
| 11 | 영문 일시 삭제 | `SUNDAY, JANUARY 3, 2027 · 3 PM` 삭제 | `calendar__when-en`, "SUNDAY, JANUARY", "JANUARY 3, 2027"이 index.html·style.css·script.js에 0건. calendar 본문 자식은 `p.calendar__when`, `table.cal` 두 개뿐. hero의 `SUNDAY · 3 PM`(카피 hero_top)은 그대로 둔 것이 맞다 | PASS |
| 12 | 주소: 화면 | 서울 송파구 송파대로 155 | `#venue-address`(`index.html:236`) 일치. 카피 directions 장소 2줄(장소명 + 주소)과도 일치 | PASS |
| 13 | 주소: 복사 대상 | 같음 | 실제 클립보드 읽기: "서울 송파구 송파대로 155"(1차: "… NH송파농협 13층"). 두 복사 경로가 다 실패할 때 Selection으로 선택되는 글자도 같은 문자열 | PASS |
| 14 | 주소: 내비게이션 안내 | "더컨벤션 송파문정" 또는 / "서울 송파구 송파대로 155"를 검색해 주세요. | `index.html:266` 2줄 글자 단위 일치 | PASS |
| 15 | "NH송파농협" 잔재 | 없음 | "NH"·"농협"이 세 파일에 0건. "13층"은 장소명 "더컨벤션 송파문정 13층 아모르홀"(description, og, hero, venue) 4곳에만 있다 | PASS |
| 16 | 달력 제목 | JANUARY 2027 | `<caption>` 안은 `span.cal__caption-en[lang=en]` 하나, 글자 "JANUARY 2027". 한글 caption(`cal__caption`) 규칙·참조가 세 파일에 0건. Cormorant 500 13px accent로 표시되고 thead와 겹치지 않는다 | PASS |
| 17 | account 안내문 | 1연 3행 교체, 2연 유지 | 두 문단 글자 단위 일치(`index.html:286-287`). 네 폭 모두 화면 줄 수 3 + 2로 `<br>` 수와 같다(의도하지 않은 줄바꿈 없음) | PASS |
| 18 | 방명록 전송 성공 | 소중한 말씀이 잘 전달되었습니다. 감사합니다. | `<template id="ui-text">` `gb-success` 일치. **성공 경로 실측**(fetch를 200 JSON으로 대체): POST 필드 `_subject, name, message`, 버튼 `보내는 중…`(disabled) → `남기기`, `.gb-status`(role=status)에 이 문구 표시, 입력값 비움 | PASS |
| 19 | 이전 문구 잔재 | 없음 | "부부가 되는 날에 초대합니다", "저희 두 사람", "예식 일시", "멀리서 축하해 주실", "계좌번호를 남겨", "말씀 잘 받았습니다", "2027년 1월"(caption), "SUNDAY, JANUARY"가 세 파일에 0건 | PASS |
| 20 | 금지어 | "결혼합니다"는 사용자 결정으로 허용 | 가든 웨딩·정원·야외·벚꽃·봄·하나가 되는 0건. "결혼합니다"는 `index.html:8`, `:16`(title, og:title)뿐 | PASS |
| 21 | 카카오 공유 제목 ↔ 카피 시트 | `kakao_share.title`은 수정 전 문구 그대로 | 화면·미리보기·카카오 공유 모두 새 og:title을 쓴다(오케스트레이터 기본값, `00_user-input.md`). 페이지는 맞고, `_workspace` 문서가 서로 다르다 | **WARNING (W5)** |

### 2-2. 영향 범위 회귀 (1차 PASS 항목 재확인)

| # | 항목 | 측정 | 1차 대비 | 결과 |
|---|------|------|------|------|
| 1 | heading 순서 | 소스 순서 h1(aria-label "방인혁과 손유민") → h2 9개: 초대합니다, 신랑 신부, 예식일, 사진첩, 오시는 길, 축하 화환 안내, 마음 전하실 곳, 방명록, Thank you. 단계 건너뜀 없음 | h2 8 → 9 (notice 추가), 제목 2개 변경 | PASS |
| 2 | 랜드마크 | main 1 + 이름 있는 region 9 | 8 → 9 | PASS |
| 3 | 이름·alt·장식 | 이름 없는 button·link·img·textbox·dialog 0, alt 없는 img 0, 빈 alt는 wreath 1건, aria-hidden 밖 svg·canvas 0, `lang="ko"`, viewport 메타 같음 | 같음 | PASS |
| 4 | reveal 그룹 | 스크롤 완주 후 숨은 reveal 0 (360/375/390/430), reduce에서 로드 직후·완주 후 0, JS 꺼짐 0. notice 두 그룹 모두 포함 | 같음 | PASS |
| 5 | 보케: notice는 비구간 | notice에 `data-bokeh`·canvas·`bokeh-zone` 없음. notice를 화면 가운데에 두면 네 폭 모두 `running []`, 가운데 띠 안 구간 없음, 무한 애니메이션 실행 0. account 위치도 `running []` | 새 확인 | PASS |
| 6 | 보케: 구간별 상한·정지 | 10초 샘플 구간별 최대 보유 hero 8 / calendar 6 / share 6, 실행 중 입자 최대 8 / 6 / 6. 캔버스 픽셀 최대 alpha glow 0.267, primary 0.176(상한 0.28 / 0.18), 제외 영역 alpha 0. gallery·venue·guestbook `running []`, 화면 밖 전구 paused | 같음. bokeh 시나리오의 `maxZone` 7은 멈춘 hero 구간이 쥐고 있는 입자 수다(`zonecap`으로 구간별 분리 확인) | PASS |
| 7 | 가로 스크롤 | 360/375/390/430 모두 `scrollWidth` = viewport (document, body) | 같음 | PASS |
| 8 | 화면 밖·잘림·글자 크기 | viewport 밖 요소 0, overflow로 잘린 텍스트 0, 14px 미만 한글 0 | 같음 | PASS |
| 9 | 섹션 간격 | hero 28·48/24, greeting 80/0, couple 56/80, 나머지(notice 포함) 80/80. calendar 높이 922 → 867px(영문 일시 줄과 한글 caption 삭제), account 814 → 843px(안내문 1행 증가) | 의도한 변화만 있음 | PASS |
| 10 | hero 첫 화면 | 네 폭 모두 날짜·사진·이름·장소가 첫 화면 안, 토글과 글자 겹침 없음, 사진 비율 1.501 | 같음(375에서 날짜 왼쪽 1px 반올림 차이) | PASS |
| 11 | 콘솔·네트워크 | 페이지에서 생긴 오류·예외 0, 4xx/5xx 0. 기록된 501·404는 QA가 일부러 넣은 것이고, Canvas2D 경고는 QA 픽셀 측정 때문이다 | 같음 | PASS |
| 12 | reduced-motion 정적 표시 | 로드 직후·완주 후 상태가 1차와 같다(숨은 reveal 0, transform none, sprig 3개 완성, 전구 1/none, calendar·share 캔버스 none, 실행 애니메이션 0, hero 정지 점 alpha 0.255). notice 두 그룹 opacity 1 / transform none(스크린샷 확인) | 같음 | PASS |
| 13 | reduced 런타임 전환 | reduce → 동작: hero 보케 재개, 링 호흡 재개, BGM 계속 재생. 동작 → reduce: running [], 무한 루프 0. hero 시퀀스 도중 전환 결과도 1차와 같다 | 같음 | PASS |
| 14 | JS 비활성 | `.js` 없음, 숨은 reveal 0, notice 전체 글자 표시(opacity 1), couple 두 줄, caption "JANUARY 2027", 주소 "서울 송파구 송파대로 155" | 같음 | PASS |
| 15 | D-day | 6개 시점(D-85, D-1, D-DAY 0시·23:59, 이후, UTC 전날) 결과가 1차와 같다 | 같음 | PASS |
| 16 | 그 밖의 인터랙션 | 계좌 placeholder 보호, 주소 복사 폴백 3단, 방명록 빈 값·미설정·전송 실패, 카카오 폴백, 링크 복사, BGM 켜기·끄기·실패 복구 | 주소 문자열 말고는 1차와 같다. 계좌 토스트 끝 마침표는 1차 직접 수정이 반영된 것 | PASS |
| 17 | 정적 회귀 | 자산 참조 36개 누락 0, 갤러리 15칸 순서·alt·크기, `BOKEH`·참고 함수, 토큰 20개·reduce 재정의, 금지 속성 애니메이션 0, 컬러 대비(notice 본문 text/bg 12.26) | 출력이 1차와 바이트 단위로 같다 | PASS |
| 18 | script.js 변경 범위 | 이번 반영에서 수정 없음. 주소 복사는 `#venue-address`의 `textContent.trim()`을 읽는다 | 같음 | PASS |

### 1차 WARNING 현황 (변화 없음)

- W1: 교통편 placeholder `index.html:254, 258, 262`, 계좌 placeholder **`index.html:294, 309`**(1차 285, 300에서 notice 9줄만큼 밀림), og:url·og:image `:18-19`. 05 요약 6장 줄 목록은 이미 새 줄 번호로 맞다
- W2: 카카오 키 `index.html:380`(1차 371)
- W3: 방명록 접수 주소 `index.html:331`(1차 322). 접수 주소를 채우면 성공 문구는 위 2-1 #18처럼 나온다
- W4: 새 자산은 아직 untracked이고 예전 사진 삭제만 staged다. 커밋 때 함께 넣어야 한다

### 2차에서 나온 이슈와 수정 제안

- [ ] **W5 (문서 동기화, 페이지 영향 없음)** `_workspace` 문서끼리 맞지 않는 곳이 있다. 지금 페이지는 맞지만, 부분 재실행 때 이 문서를 다시 읽으면 수정 전 값이 되살아날 수 있다
  - `02_copy-writer_copy.md:299` `kakao_share.title`이 "방인혁 & 손유민, 부부가 되는 날에 초대합니다"로 남아 있다. 실제 카카오 공유 제목은 og:title "인혁 ♡ 유민, 우리 결혼합니다"다 → 같게 둘 거면(오케스트레이터 기본값) 299행을 og:title과 같게 고친다. 카카오 제목만 따로 두려면 frontend에 별도 값 읽기를 요청해야 한다. 어느 쪽인지 사용자 확인이 필요하다
  - `02_copy-writer_copy.md:42` "og:title 26자"는 지금 17자다. `:6` 금지어 목록에 "결혼합니다"가 있는데, title이 사용자 결정으로 이 말을 쓴다
  - `01_concept-director_concept-sheet.md:14, 388` 주소가 "… NH송파농협 13층"으로 남아 있다. `00_user-input.md` 위쪽 "예식" 항목도 같다(맨 아래 수정 표가 우선)
  - 카피 시트는 사용자가 직접 고친 파일이라 QA가 손대지 않았다. copy-writer나 사용자가 고치면 된다

### 참고 (판정 대상 아님)

- notice는 두 줄짜리 섹션인데 위아래가 모두 80 + 80 = 160px 여백이라, 화면에서 venue와 account 사이에 넓게 떠 보인다(스크린샷 `qa2/notice-390.png`). 컨셉 시트의 섹션 리듬(상하 80px 통일)을 그대로 따른 것이라 결함은 아니다. 더 촘촘하게 보이길 원하면 `.notice { padding-top: 56px; }`처럼 couple 섹션과 같은 예외를 둘 수 있다
- couple 줄은 "딸" 뒤에 NBSP가 있어서, 하객이 이 줄을 길게 눌러 복사하면 일반 공백 대신 NBSP가 들어간다. 일반적인 붙여 넣기에서는 차이가 보이지 않는다

---

## 3차 QA (갤러리 캐러셀) — 2026-10-11

2차 QA 뒤 사용자 요청으로 갤러리를 3x5 썸네일 그리드에서 한 장씩 옆으로 넘기는 캐러셀로 바꾸고, 1번과 2번 사진을 맞바꿨다(`00_user-input.md` 맨 아래 "갤러리 방식 변경"). 모션 명세의 "(2026-10-10 갤러리 캐러셀로 변경)" 절(2-5, 4-1-1~4-1-12, 4-2, 5, 6, 7, 8, 10)과 frontend 요약 10장·4장을 기준으로 이번 변경분(`git diff`: `index.html`, `style.css`, `script.js`)을 검증하고, 다른 섹션의 회귀를 확인했다.

### 요약

- 전체 결과: **PASS** (FAIL 0)
- 3차 판정 69항목: PASS 67 / FAIL 0 / WARNING 2 (W6 문서 동기화, W7 트랙패드 관성 스크롤)
- 직접 수정: 없음. 페이지 코드에서 고칠 결함이 나오지 않았다. W7은 모션 명세 4-1-5가 정한 값을 바꾸는 일이라 직접 고치지 않고 제안만 적었다
- 기존 WARNING: W1·W2·W3은 그대로(줄 번호만 갱신), **W4는 해소**, W5는 그대로
- 판정 기준: 갤러리 순서는 `00_user-input.md` 맨 아래 절(01 02 08 / 03 09 12 / 07 13 05 / 11 06 14 / 10 04 15)이 컨셉 시트·카피 시트·모션 명세보다 우선한다. 문서끼리 다른 점은 FAIL로 보지 않았다(W6)
- 검증 방법
  - 정적: `scratchpad/qa3/static3.py`(50개 검사, FAIL 0). 순서, 파일별 alt, 버튼 번호, `src`·`srcset`·`sizes`·크기 속성을 JPEG 헤더 실측과 대조하고, 가로 슬라이드 표시, 참조 경로(`srcset` 포함 36개), 그리드 잔재, 접근성 마크업, 토큰, 4-1-11 참고 CSS 선언 전수, 4-1-12 참고 JS 줄 단위 diff, `LB`·`GAL` 상수, heading, `node --check`를 봤다. 1차 정적 스크립트(`qa/static_checks.py`)도 다시 돌렸다. 2차 출력과 다른 곳은 갤러리 절(그리드 정규식이 0칸을 찾음)과 참조 수(`srcset`을 읽지 않아 36 → 21)뿐이다. 새로 잡힌 `scroll-behavior` 1건은 `overscroll-behavior-x`의 부분 일치다
  - 브라우저: 로컬 서버 `127.0.0.1:8770` + headless Chrome CDP(기본 DPR 2, 터치 에뮬레이션)
    - frontend 검사 `fe-carousel/check.mjs`를 포트만 바꿔 `qa3/check.mjs`로 다시 돌렸다: 110/110 PASS로 재현됐다
    - QA 독립 검사 `qa3/extra.mjs`: 60개 중 58 PASS. FAIL 2건은 측정 시점 문제여서 `qa3/diag.mjs`·`diag2.mjs`·`diag3.mjs`로 다시 재고 정상임을 확인했다(아래 3-1 #19, #26)
    - 2차 회귀 드라이버를 `qa3/qa.mjs`로 옮겨(포트 변경, 그리드 셀 열기를 캐러셀 이동 + 현재 슬라이드 클릭으로 교체, 레이아웃 검사에서 뷰포트가 잘라 내는 트랙 안 슬라이드 제외) 13개 시나리오를 실행하고 `qa3/compare3.py`로 1·2차 JSON과 비교했다
    - Chrome은 샌드박스 안에서 뜨지 않아 샌드박스를 끄고 실행했다. 끝난 뒤 서버와 Chrome을 모두 종료했다(남은 프로세스 0). 스크립트·출력·스크린샷은 scratchpad에만 있고 저장소에는 넣지 않았다

### 3-1. 캐러셀 실측 (모션 명세 4-1 Must, 4-1-12 QA 확인값)

| # | 항목 | 명세 | 측정 | 결과 |
|---|------|------|------|------|
| 1 | 화면별 프레임·peek | 4-1-2 표 | 390x664 342x513 / 16px, 375x548 290.7x436 / 34.1px(높이 기준 축소), 360x700 312x468 / 16px, 430x750 382x573 / 16px, 1280x900 432x648 / 16px(컬럼 480). 표에 없는 375x667 327x490.5 / 16px, 390x844 342x513 / 16px | PASS |
| 2 | 프레임 + 버튼 줄이 한 화면에 | 577 / 500 / 532 / 637 / 712px | 같은 값이고 모두 화면 높이 이하. 가로로 눕힌 844x390에서도 342px ≤ 390 | PASS |
| 3 | 가로 사진 contain | 02·15 잘림 0, 가운데, surface 매트 | `object-fit: contain`, `object-position: 50% 50%`, 잘림 0. 390에서 02는 342x255에 위아래 매트 128.9px, 15는 342x228에 142.6px(명세 129 / 143). 360·375x548·430도 잘림 0. 스크린샷 `qa3/landscape02-390.png`, `qa3/landscape15-360.png` | PASS |
| 4 | 세로 사진 cover | 13장, 잘림이 보이지 않을 것 | 잘림 최대 0.36px(430, 세로 방향), 14번(1067x1600)은 가로 0.12px | PASS |
| 5 | 프레임 면 | surface #F3EAE3, 모서리 4px, 테두리·그림자 없음 | rgb(243, 234, 227), 4px, 15장 같음 | PASS |
| 6 | 스와이프 임계값 | 50px 또는 0.3px/ms, 한 제스처에 한 장 | 빠른 70px → 다음, 느린 40px → 제자리, 40px를 0.73px/ms로 튕김 → 이전. 120ms 안에 다음 버튼 3번 → 목표만 바뀌어 6번에서 x 24로 멈춤. `swipeTarget` 본문이 4-1-12와 줄 단위로 같고 lightbox `finishSwipe`도 같은 함수를 부른다 | PASS |
| 7 | 방향 판정 | 처음 8px에서 축 결정, 세로면 페이지 스크롤 | 대각선(dx 12, dy −160) → 세로: 페이지가 196px 스크롤, 트랙 그대로(`--g-dx` 0px). 가로 + 세로 흔들림(dx −80, dy 20) → 다음 장, 페이지 스크롤 0. 세로로 쓸어 올리기 → scrollY +200, 번호·위치 그대로. `setPointerCapture`는 축이 가로로 정해진 뒤에만 부른다 | PASS |
| 8 | 드래그 | 손가락 1:1, 드래그 중에만 `will-change` | `--g-dx` −60px에서 프레임 x −36. `will-change: transform`은 드래그 중에만, 놓으면 auto. 드래그 중에도 페이지 가로 스크롤 없음(360/375/390/430) | PASS |
| 9 | 양 끝 멈춤·저항 | 순환 없음, 0.3배 | 1번에서 오른쪽 100px → 트랙 30px, 놓으면 제자리. 15번에서 왼쪽 → 제자리. 양 끝에서 빠르게 튕겨도 그대로 | PASS |
| 10 | 두 번째 손가락 | 드래그 취소, 제자리 | 드래그 중(−60px)에 두 번째 손가락 → `--g-dx` 0px, `is-dragging` 해제, 5번 그대로, lightbox 안 열림 | PASS |
| 11 | 이전/다음 버튼 | 44x44, 보이는 원 40px 1px primary, chevron accent 1.4, 끝에서 `aria-disabled`(`disabled` 속성 아님), opacity 0.3 | 44x44, `::before` 40px 1px rgb(201, 160, 159) 원, stroke #8E5558 1.4. HTML에 `disabled` 없음. 1번의 이전·15번의 다음은 opacity 0.3이고 눌러도 그대로, 포커스 유지. 접근성 트리에서 1번일 때 "이전 사진" disabled=true, 가운데서는 둘 다 false | PASS |
| 12 | QA 확인값: 14번에서 다음 | "15 / 15", 다음 `aria-disabled`, 포커스는 다음 버튼 | 그대로 | PASS |
| 13 | ← / → | 캐러셀 안에서만, 슬라이드 버튼이면 포커스 이동 | 슬라이드 버튼에서 → / ←: 포커스가 새 슬라이드 버튼으로 가고 `.g-status`는 그대로. 다음 버튼에서 →: 포커스 유지, `.g-status` 갱신. 1번에서 이전 버튼에 포커스를 두고 ←: 번호·포커스·낭독 모두 그대로. 포커스가 캐러셀 밖(venue)에 있을 때 →: 캐러셀 그대로 | PASS |
| 14 | Tab 순서 | 현재 슬라이드 → 이전 → 다음 | 5번에서 배경음악 → 사진 5 버튼 → 이전 사진 → 다음 사진 → 주소 복사하기. Shift+Tab은 그 역순. 비현재 14장은 탭 순서에 없다 | PASS |
| 15 | 현재 위치 낭독 | `.g-status` polite·atomic, "15장 중 n번째 사진, {alt}" | 로드 때 빈 문자열. 다음 버튼·터치 스와이프·이웃 탭에서 "15장 중 2번째 사진, 분홍 꽃가지 장식 아래…" 형식으로 바뀐다. lightbox를 닫으며 맞출 때는 바뀌지 않는다. 보이는 카운터는 `aria-hidden`, `lang="en"` | PASS |
| 16 | 비현재 슬라이드 숨김 | `inert` + `aria-hidden`, JS가 붙임 | 14장 `inert` + `aria-hidden="true"`, HTML에는 없다(JS 꺼짐에서 0개). 접근성 트리의 사진 버튼은 현재 1개("사진 5 / 15 크게 보기: …"). 묶음은 group "웨딩 사진 15장", roledescription "슬라이드" | PASS |
| 17 | 탭 → lightbox | 같은 번호로 열림 | 3번 탭 → "3 / 15", 첫 포커스 닫기 | PASS |
| 18 | QA 확인값: 4번에서 열고 7번까지 넘긴 뒤 닫기 | "7 / 15", 포커스 7번 버튼 | → 두 번 + 스와이프 → 7/15, 닫기 → 캐러셀 "7", activeElement "사진 7 / 15 크게 보기: …". 닫기 모션 30ms 시점(dialog가 아직 열림)에 이미 7이고, 닫은 직후 x 24(애니메이션 없음). 다른 닫기 경로도 같다: 7에서 ←×3 + Esc → 4, 4에서 →×2 + `history.back()`(Android 뒤로가기) → 6 · `history.state` null, 6에서 ← + 아래로 끌어 닫기 → 5. 모두 그 번호의 버튼으로 포커스가 간다 | PASS |
| 19 | lightbox 첫 사진 | 캐러셀 `currentSrc`로 시작해 원본으로 교체 | 02(DPR 2, 캐러셀은 `thumb/02.jpg`): MutationObserver 기록으로 lightbox `src`가 58ms에 `thumb/02.jpg`, 80ms에 원본 `02.jpg`. 4번(세로, DPR 2)은 캐러셀이 이미 원본이라 바로 원본. 이웃은 원본. extra 검사의 FAIL은 60ms 뒤 한 번만 읽어서 교체 뒤의 값을 본 측정 문제였다 | PASS |
| 20 | peek 탭·드래그 뒤 lightbox 안 열림 | click 억제 | 오른쪽·왼쪽 peek 탭 → 한 장 이동, lightbox 안 열림. 마우스로 80·90px 끌고 놓기 → 한 장 이동, 안 열림. 그 직후 마우스 클릭·터치 탭은 정상으로 연다(플래그가 다음 pointerdown에서 풀림) | PASS |
| 21 | 키보드 Enter / Space | lightbox 열림 | Enter(마우스 드래그 뒤, 터치 스와이프 뒤 모두) 열림. Space → "5 / 15" 열림 | PASS |
| 22 | 이미지 요청 수 | hero 0건, 갤러리 근처 3건 | hero: 390x664 1.5초·430x932 3초 동안 0건. 갤러리 근처: DPR 2 `01.jpg`, `thumb/02.jpg`, `08.jpg` / DPR 3 `01.jpg`, `02.jpg`, `08.jpg` / DPR 1 데스크톱 썸네일 3장. 2번으로 넘기면 `03.jpg` 추가. 430x932에서 캐러셀이 화면 아래 0.9화면 거리에 있을 때 이미 3장(`rootMargin: 100% 0px`). 5번에서 로딩 창 4~7번 eager, 앞서 바꾼 eager는 유지 | PASS |
| 23 | reduced-motion | 전환·페이드 0ms, 드래그 추종 유지 | 즉시 표시(opacity 1), 트랙·이미지 `transition-duration` 0s, 다음 버튼 30ms 뒤 이미 x 24, 드래그 중 x −36으로 따라옴. 설정을 되돌리면 새로고침 없이 0.35s. 이전/다음 누름은 reduce 블록에서 opacity 0.85(`style.css:1094`) | PASS |
| 24 | JS 비활성 폴백 | scroll-snap | `html.js` 없음, 뷰포트 `overflow-x: auto` + `scroll-snap-type: x mandatory`, 첫 장 x 24, 손가락 스와이프로 다음 장이 x 24에 멈춤. 버튼 줄·`.g-status` 숨김, `inert` 0, 페이지 가로 스크롤 없음 | PASS |
| 25 | reveal 중 조작 | 서로 덮어쓰지 않음 | reveal 진행 중(opacity 0.22)에 다음 버튼 → 2번으로 이동, 끝나면 opacity 1·x 24 | PASS |
| 26 | 크기 변경·회전 | CSS 계산만으로 위치 유지 | 6번에서 430x750 → 360x700 → 844x390 → 390x664: 매번 6번 그대로, 전환이 끝나면 가운데(오차 0), 페이지 가로 스크롤 없음. extra 검사의 FAIL은 350ms 전환 도중(300ms)에 잰 측정 문제였다. 844x390의 `null`은 오프셋 −0을 CDP가 값으로 넘기지 못한 것이고, 원시값은 슬라이드 중심 421.97 / 뷰포트 중심 422다 | PASS |
| 27 | 마우스 커서 | 뷰포트 grab, 현재 슬라이드 zoom-in, 드래그 중 grabbing | 그대로. 이전/다음은 pointer | PASS |
| 28 | 트랙패드 가로 휠 (Nice) | ±40 누적에 한 장, 이후 450ms 무시, 세로 휠은 그대로 | deltaX 60 → +1, 450ms 안의 두 번째는 무시, 25 + 25 → +1. 캐러셀 위 세로 휠 → 페이지 300px 스크롤, 번호 그대로 | PASS |
| 29 | 트랙패드 관성 스크롤 | 한 번 쓸면 한 장(4-1-4 "한 제스처에 한 장만 넘어간다"의 취지) | 16ms 간격으로 줄어드는 휠 이벤트로 관성을 모사: 약하게(시작 30, ×0.9, 0.65초) +1, 보통(60, ×0.94, 1.26초) **+2**, 세게(90, ×0.95, 1.63초) **+3**. 구현은 명세(4-1-5) 그대로이고, 450ms 잠금이 관성 꼬리보다 짧다. 합성 `WheelEvent`로 잰 값이라 실제 Mac 트랙패드 확인이 필요하다 | **WARNING (W7)** |
| 30 | 콘솔 | 0건 | 캐러셀·lightbox·reduced·JS 꺼짐 모든 시나리오에서 페이지 오류·예외 0 | PASS |

### 3-2. 갤러리 순서·alt·번호·경로 대조

| 항목 | 기준 | 측정 | 결과 |
|------|------|------|------|
| 순서 | 01 02 08 / 03 09 12 / 07 13 05 / 11 06 14 / 10 04 15 (사용자 결정) | `data-full` 순서 일치(`index.html:211-225`) | PASS |
| alt | 파일별 카피 시트 `gallery_alt` 문장 | 15장 모두 파일 기준으로 글자 단위 일치(1번 01 "신랑이 신부를 안아 올리고…", 2번 02 "분홍 꽃가지 장식 아래…") | PASS |
| 번호 | "사진 {n} / 15 크게 보기: {alt}", n은 새 순서 | 15건 일치(1 = 01, 2 = 02, 15 = 15). lightbox 슬라이드 목록도 같은 순서·alt | PASS |
| 파일·크기 속성 | `src` = 원본, `srcset` 썸네일·원본 w, `sizes`, `width`/`height` = 원본 | 15건 모두 JPEG 헤더 실측과 일치(세로 1066x1600 / 600w, 14번 1067x1600 / 600w(600x899), 02 1600x1194 / 804w, 15 1600x1066 / 900w). `sizes="(min-width: 480px) 432px, calc(100vw - 48px)"`, `loading="lazy"`, `decoding="async"`, `draggable="false"` | PASS |
| 가로 슬라이드 표시 | 02·15에만 `.g-slide--landscape` | 2번·15번에만 있고 실제 가로 비율과 일치 | PASS |
| 참조 경로 존재 | `srcset` 포함 | 로컬 참조 36개 누락 0. 페이지가 참조하는 이미지·오디오 35개 모두 git 추적 중 | PASS |
| 그리드 잔재 | 없음 | `g-cell`, `g-grid`, `object-position`, `initThumbs`, `data-index`가 세 파일에 0건 | PASS |
| hero 사진 | 갤러리에 없음 | 없음 | PASS |
| 문서 동기화 | — | 카피 시트·컨셉 시트·모션 명세 본문이 예전 순서(02 01 08)와 그리드 명칭을 적고 있다 | **WARNING (W6)** |

### 3-3. 모션 명세 구현도 (캐러셀 범위)

| 항목 | 명세 | 구현 (위치) | 결과 |
|------|------|------|------|
| 토큰 | `--g-gap` 8px, `--g-side` 24px, `--g-chrome` 112px, `--g-w`(vh / `@supports` svh), `@property --g-i`·`--g-dx` | `style.css:64-75` 일치 | PASS |
| reduce 토큰 | `--dur-snap`·`--dur-base` 0ms, 캐러셀용 추가 규칙 없음 | reduce `:root` 블록에서 둘 다 0ms. 캐러셀 JS에 reduced 분기 없음 | PASS |
| 4-1-11 참고 CSS | 규칙 전부 | 선언 단위로 대조해 빠진 선언 0(`style.css:567-669`). 더한 규칙은 05 요약 4장에 적혀 있다 | PASS |
| 4-1-12 참고 JS | `initCarousel` | 줄 단위 diff 결과 차이는 변수 이름(`el`), `inert` 미지원 폴백(4-1-8 표가 요구), click 억제의 `e.detail === 0`, 트랙패드 휠(Nice), 반환값에서 `img` 제외뿐이다(`script.js:619-769`) | PASS |
| 상수 | `LB` AXIS_LOCK 8, SWIPE_DIST 50, SWIPE_VELOCITY 0.3, EDGE_RESIST 0.3, VELOCITY_WINDOW 100 / `GAL` | 일치(`script.js:16-23`). 캐러셀과 lightbox가 같은 `LB`·`swipeTarget`을 쓴다 | PASS |
| 금지 속성·동작 | transform/opacity만, 자동 넘김·순환·햅틱 없음, `scroll-behavior: smooth` 없음 | 레이아웃 속성 transition 0건, 캐러셀에 `setInterval` 없음, 순환 없음, `vibrate`는 복사 피드백 두 곳(`script.js:1300, 1335`)에만 | PASS |
| 시각 금지 | 사진 위 화살표·글자·오버레이 없음, 이웃 흐리게·축소 없음 | 스크린샷과 CSS로 확인. 비현재 슬라이드에는 `pointer-events: none`만 걸린다 | PASS |
| `will-change` | 드래그 중 트랙에만 | `.js .g-track.is-dragging`, `.lb-track.is-dragging` 두 곳 | PASS |
| 2-5 reveal | 헤더 / 캐러셀 전체 두 그룹, 슬라이드 개별 등장 없음 | `section-head reveal`, `g-carousel reveal` 두 개 | PASS |
| Should | 이미지 로드 페이드, 이웃 탭 | 구현(`script.js:772-782`, `715-731`). 이웃 탭 실측은 3-1 #20 | PASS |
| Nice | 트랙패드 가로 휠 / 전환 중 잡기 | 휠 구현(3-1 #28, #29). 전환 중 잡기는 미구현인데, 명세가 미구현 시 동작(목표 위치로 짧게 점프)을 정해 두었고 05 요약에 적혀 있다 | PASS |
| 명세와 다르게 처리한 부분 | 05 요약 4장의 새 항목 8건 | 아래 표. 8건 모두 타당 | PASS |

#### 명세 이탈 검토 (05 요약 4장, 2026-10-11 추가분)

| 항목 | 판정 | 근거 |
|---|---|---|
| 갤러리 순서 01 02 08 … | 타당 | 사용자 결정(`00_user-input.md` 맨 아래)이 명세 4-1·4-1-12보다 우선한다. 첫 요청 세 장(01, 02, 08)은 명세의 집합과 같아서 QA 확인값의 취지도 그대로다 |
| click 억제에서 `e.detail === 0`은 막지 않음 | 타당 | 70px 터치 스와이프에서 click이 0건인 것을 QA도 재현했다. 이 예외가 없으면 스와이프 다음의 Enter·Space 한 번이 사라진다. 실측: 스와이프 뒤 Enter로 열리고, 마우스 드래그 뒤 click은 여전히 억제된다 |
| 이전/다음 버튼 CSS 추가(원형 포커스 링, pointer, `:active`) | 타당 | 포커스 링이 원을 따라 그려지는 것을 스크린샷으로 확인했다(`qa3/focus-ring-next-390.png`). 5장 버튼 누름 규칙과 같다 |
| reduce 누름 피드백을 활성 버튼에만 | 타당 | 끝에서 비활성(0.3)인 버튼이 누를 때 0.85로 밝아지면 비활성 표시가 깨진다 |
| 드래그 중 `.g-open` 커서 grabbing | 타당 | 실측: 드래그 중 사진 위 커서가 grabbing |
| JS 꺼짐에서 `.g-status` 숨김 | 타당 | 4-1-9 본문이 요구한다. 참고 CSS에서 빠진 것을 채웠다 |
| 반환값에서 `img` 제외, 변수 이름 `el` | 타당 | lightbox는 버튼 안 img를 직접 읽는다. 파일 전역 `root`(문서 루트)와 이름이 겹치지 않게 했다 |
| 슬라이드 `data-index` 없음 | 타당 | 번호는 DOM 순서로 정하고, grep 0건 |

### 3-4. 회귀 (다른 섹션)

| # | 항목 | 측정 | 1·2차 대비 | 결과 |
|---|------|------|------|------|
| 1 | hero 보케 | 10초 샘플 구간별 최대 hero 8 / calendar 6 / share 6, 합산 최대 8(상한 12). 캔버스 픽셀 최대 alpha glow 0.263, primary 0.173(상한 0.28 / 0.18), 제외 영역 alpha 0. gallery·venue·notice·account·guestbook에서 `running []`, 화면 밖 전구 paused, guestbook 위치 무한 애니메이션 0 | 수치 차이는 무작위 범위 안 | PASS |
| 2 | reveal | 스크롤 완주 후 숨은 reveal 0, 안 그려진 디바이더 0(360/375/390/430) | 같음 | PASS |
| 3 | couple 정렬 | 네 폭 모두 행·줄·"아들/딸" 칸·이름의 left/right/width가 2차와 같다(차이 최대 0.78px 유지). 달라진 것은 갤러리가 짧아져 바뀐 문서 위치(top)뿐 | 같음 | PASS |
| 4 | notice | reducednotice 결과가 2차와 같고, copyedit2의 notice 2줄·간격도 같다 | 같음 | PASS |
| 5 | 복사 | 계좌 placeholder 보호, 주소 복사(클립보드 "서울 송파구 송파대로 155"), execCommand 폴백, 둘 다 실패 시 선택, 링크 복사 | 클립보드에 들어간 URL의 포트만 다름(8768 → 8770) | PASS |
| 6 | BGM | 탭 전 요청 0, 탭 후 재생·volume 0.60·링, 끄기, 음원 오류 복구 | 같음 | PASS |
| 7 | 방명록 | 빈 성함·빈 말씀·주소 미설정·전송 실패(501 주입) | 같음 | PASS |
| 8 | D-day | 고정 시각 6개 결과가 2차와 같다. 실제 시각 기준 표시는 D-84(2026-10-11 → 2027-01-03, 84일)로 정확 | 같음(날짜가 하루 지남) | PASS |
| 9 | 가로 스크롤 | 360/375/390/430에서 `scrollWidth` = viewport. 캐러셀 드래그 중과 15번까지 넘긴 뒤에도 같다 | 같음 | PASS |
| 10 | 화면 밖·잘림·글자 크기·터치 영역 | viewport 밖 요소 0(트랙 안 슬라이드는 뷰포트가 잘라 내므로 제외하고, 뷰포트 자신은 검사), 잘린 텍스트 0, 14px 미만 한글 0. 44px 미만 컨트롤은 2차와 같은 2건(BGM 토글 시각 40px + `::before` 44px, 크기 0인 숨김 input) | 같음 | PASS |
| 11 | 섹션 간격 | 모든 섹션의 위아래 패딩이 2차와 같다. gallery 높이만 줄었다(390x844 1234 → 920px, 360x640 1159 → 875px) | 의도한 변화 | PASS |
| 12 | heading·랜드마크 | 소스 순서 h1 1개 → h2 9개, 건너뜀 없음. main 1 + region 9 | 같음 | PASS |
| 13 | 접근성 트리 | 이름 없는 컨트롤 0, alt 없는 img 0, aria-hidden 밖 장식 svg·canvas 0. 버튼 목록에 "이전 사진", "다음 사진"이 생기고 사진 버튼은 15개 → 현재 1개 | 의도한 변화 | PASS |
| 14 | lightbox 기능 | 1차 lightbox·lbkeys 시나리오(핀치 3배 clamp, 더블탭, 팬 clamp, `+`/`0`, ctrl+wheel, 포커스 트랩, 스크롤 잠금, Android 뒤로가기, 빈 무대 탭·아래로 끌어 닫기, 바·카운터·사진 클릭 뒤 화살표)가 1차와 같다. 다른 것은 닫은 뒤 포커스 대상뿐이다(연 버튼 → lightbox에서 마지막으로 본 사진의 버튼, 명세 4-1-6) | 의도한 변화 | PASS |
| 15 | reduced-motion (페이지 전체) | 로드 직후·완주 후 상태, BGM 링 정지, 런타임 전환 결과가 2차와 같다 | 같음 | PASS |
| 16 | JS 비활성 (페이지 전체) | nojs 결과가 2차와 같다 | 같음 | PASS |
| 17 | 콘솔·네트워크 | 페이지에서 생긴 오류·예외 0. 4xx/5xx는 QA가 일부러 넣은 501·404뿐이고, Canvas2D 경고는 QA 픽셀 측정 때문이다 | 같음 | PASS |
| 18 | 정적 회귀 | 1차 정적 스크립트 출력이 갤러리 절 말고는 2차와 같다(`BOKEH` 상수·참고 함수, 토큰 20개, 키프레임 속성, 컬러 대비, 팔레트) | 같음 | PASS |

### 기존 WARNING 현황

- W1: og:url·og:image `index.html:18-19`, 교통편 `:268, 272, 276`, 계좌 `:308, 323`(2차 대비 갤러리 마크업이 14줄 늘어 밀림)
- W2: 카카오 키 `index.html:394`(2차 380)
- W3: 방명록 접수 주소 `index.html:345`(2차 331)
- W4: **해소.** 커밋 `179dd01`에 새 자산이 들어갔다. 페이지가 참조하는 이미지·오디오 35개가 모두 `git ls-files`에 있다. 지금 작업 트리의 변경은 `index.html`, `style.css`, `script.js`와 `_workspace` 문서뿐이다
- W5: 그대로

### 3차에서 나온 이슈와 수정 제안

- [ ] **W6 (문서 동기화, 페이지 영향 없음)** 사용자 결정 절(`00_user-input.md` 맨 아래)과 다른 내용이 아래 문서에 남아 있다. 부분 재실행 때 이 문서를 다시 읽으면 예전 순서(02가 첫 장)나 그리드 명세가 되살아날 수 있다
  - `02_copy-writer_copy.md:146-151` `gallery_alt` 표가 1 = 02, 2 = 01이고 "컨셉 시트 순서 그대로"라고 적혀 있다. `:173` "그리드 버튼 접근성 이름"
  - `01_concept-director_concept-sheet.md:104` `grid: "3열 x 5행 …"`, `:108` 이하 `photos.gallery.order`의 pos 1 = 02, pos 2 = 01과 02·15의 `object_position`(캐러셀에서 쓰지 않음)
  - `04_motion-designer_motion-spec.md:430`(순서), `:447`("순서상 첫 장이 가로(02)"), `:557`(예산 "02, 01, 08"), `:566-573`(4-1-8 마크업 예시의 첫 슬라이드가 02 가로), `:879`(QA 확인값 "02, 01, 08")
  - → 오케스트레이터가 copy-writer, concept-director, motion-designer에게 순서와 명칭을 새 결정대로 고쳐 달라고 요청한다. 카피 시트는 사용자가 직접 고친 파일이라 QA가 손대지 않았다
- [ ] **W7 (Nice 기능, 데스크톱 트랙패드만) `script.js:742-754`** 가로 휠은 ±40에서 한 장 넘기고 450ms 동안 입력을 버리는데, Mac 트랙패드 관성 스크롤은 손을 뗀 뒤에도 1초 넘게 deltaX를 보낸다. 모사 실측에서 보통 세기의 한 번 쓸기가 2장, 세게 쓸면 3장을 넘겼다(3-1 #29). 모바일 터치와 다른 입력에는 영향이 없다 → 고정 450ms 대신 "입력이 멈출 때까지" 잠그는 방식을 제안한다. 잠금 중에 들어온 가로 휠 이벤트마다 잠금을 조금씩 늘린다:
  ```js
  if (e.timeStamp < wheelUntil) { wheelUntil = Math.max(wheelUntil, e.timeStamp + 150); return; }
  ```
  명세 4-1-5의 값을 바꾸는 일이라 motion-designer가 정한 뒤 frontend가 반영하고, 실제 Mac 트랙패드로 한 번 쓸면 한 장인지 확인한다

### 참고 (판정 대상 아님)

- 창 크기가 바뀌거나 폰을 돌리면 `--g-w`가 바뀌고 트랙 `transform`의 350ms 전환이 그대로 돌아서, 현재 사진이 옆에서 미끄러져 들어오듯 제자리로 간다(430x750로 바꾼 직후 200px 어긋남 → 300ms에 1px → 450ms에 0). 최종 위치는 정확하다. 없애려면 뷰포트 폭이 바뀔 때만 `no-anim`을 한 프레임 붙이면 되지만, 명세 4-1-3이 "회전·크기 변경에 재계산 코드가 없다"를 장점으로 들었으므로 motion-designer가 판단할 일이다
- 가로로 눕힌 폰(844x390)에서는 프레임이 높이 기준으로 185x278까지 줄고 이웃 사진이 좌우로 약 139px씩 보인다. 명세 4-1-2가 "짧은 화면에서는 더 넓다"고 허용한 범위다(스크린샷 `qa3/rotate-844x390.png`)
- JS가 꺼진 환경에서는 Chrome이 가로 스크롤 영역 안의 lazy 이미지를 미리 받아 갤러리 근처에서 15장을 모두 요청한다(폴백에서만). 슬라이드를 눌러도 lightbox가 열리지 않는 것은 명세 4-1-9가 적은 기존 한계다
- 캐러셀 `keydown`(`script.js:679`)과 lightbox `keydown`(`:975`)이 수정 키를 보지 않아, 포커스가 그 안에 있을 때 Windows·Linux Chrome의 Alt+←(뒤로 가기)도 막힌다. 두 곳에 `if (e.altKey || e.ctrlKey || e.metaKey) return;` 한 줄씩 넣으면 된다
- 화면 오른쪽 위에 고정된 BGM 토글은 갤러리를 화면 맨 위까지 올렸을 때 프레임 오른쪽 위 모서리를 덮는다. 다른 섹션과 예전 그리드에서도 같았고, 그 자리를 누르면 토글이 받는다
