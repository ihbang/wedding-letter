# QA Report — 2026-10-10

"Petal & Glow" (방인혁 · 손유민, 로맨틱 가든) 첫 구현 검증.

> 2차 QA(사용자 카피 수정 반영) 결과는 문서 끝 "2차 QA" 절에 있다: PASS 38 / FAIL 0 / WARNING 1(새로 생긴 W5), 1차 WARNING 4건은 그대로 남아 있다. 바로 아래 요약은 1차 결과다.
>
> 3차 QA(갤러리 캐러셀, 2026-10-11) 결과는 문서 맨 끝 "3차 QA" 절에 있다: PASS 67 / FAIL 0 / WARNING 2(새로 생긴 W6·W7). W4는 해소됐고 W1·W2·W3·W5는 그대로다.
>
> 4차 QA(계좌 접기·복사 토스트, 2026-10-11) 결과는 문서 맨 끝 "4차 QA" 절에 있다: PASS 48 / FAIL 1 / 새 WARNING 0. 계좌 접기·복사 토스트 변경분은 FAIL 0이다. FAIL 1건(F1)은 카피 시트에서 바뀐 dday_message가 페이지에 반영되지 않은 것이다. W1·W2·W3은 해소됐고 W5·W6·W7은 그대로다.
>
> placeholder 정리(2026-10-12): `[[TODO:...]]` 값이 모두 채워져 W1·W2·W3은 닫혔다. placeholder를 판별하던 코드(`isPlaceholder`, 계좌 "준비 중" 토스트, 방명록 "접수 주소 미설정" 안내)를 지웠으므로, 1~4차 표에 있는 placeholder 보호 관련 행은 당시 기록으로만 남는다. F1도 해소됐다(4차 절 끝).
>
> 5차 QA(오시는 길 카카오맵, 2026-10-12) 결과는 문서 맨 끝 "5차 QA" 절에 있다: PASS 38 / FAIL 0 / 새 WARNING 0. 검증 중 찾은 데스크톱 더블클릭 글자 선택 1건은 `style.css`에서 직접 고쳤다. W5는 해소됐고 W6·W7은 그대로다.

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

- [x] **(해소 2026-10-11)** **W1 (배포 전 필수) `index.html:18-19, 254, 258, 262, 285, 300`** 교통편 3줄과 계좌 은행·번호 4개가 `[[TODO:...]]`로 화면에 보이고, og:url·og:image가 절대 URL이 아니어서 카카오톡·SNS 미리보기 이미지가 나오지 않는다. 카카오 키만 채우고 SITE_URL을 비워 두면 공유 카드 `imageUrl`도 깨진다(script.js:1186) → SITE_URL(끝 `/` 없이), 계좌 4개, 확인된 교통편을 채운 뒤 `grep -n '\[\[TODO:' index.html`로 남은 항목이 의도한 것(방명록·카카오 키를 미룰 경우 그 둘)뿐인지 확인
- [x] **(해소 2026-10-11)** **W2 `index.html:371`, `script.js:1176`** 카카오 JavaScript 키가 없어 "카카오톡으로 공유하기"가 링크 복사로 대신 동작한다(안내 토스트 있음) → 카카오 디벨로퍼스 앱 키를 넣고 [플랫폼 > Web]에 배포 도메인 등록. 키를 쓰지 않을 경우 선택 개선: 폴백 전에 `navigator.share?.({ title, text, url })`(모바일 공유 시트)를 먼저 시도
- [x] **(해소 2026-10-11)** **W3 `index.html:322`, `script.js:1227`** 접수 주소가 없으면 하객이 글을 다 쓴 뒤에야 "지금은 방명록을 받을 수 없습니다…"를 본다. JS가 꺼진 환경에서는 `[[TODO:GUESTBOOK_ENDPOINT]]` 상대 경로로 POST되어 오류 페이지로 이동한다 → 배포 전에 Formspree 등 POST + JSON 응답 주소를 채운다. 채우지 않고 배포할 거라면 placeholder일 때 `#guestbook` 섹션을 `hidden` 처리하도록 frontend에 요청
- [x] **(해소 3차)** **W4 (커밋 시 필수) git 작업 트리** 페이지가 참조하는 새 자산이 untracked이고, 예전 사진 31개 삭제만 staged 상태다. staged 변경만 커밋하면 배포 페이지에서 hero·갤러리·장식·og 이미지 34개 참조가 모두 깨진다 → 커밋할 때 `git add images/photos images/deco images/favicon.svg images/og-garden.jpg index.html style.css script.js`(와 저장소 관례에 따라 `_workspace/`)를 포함하고, `git ls-files`로 이 리포트 1장의 참조 36개가 모두 추적되는지 확인

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

---

## 4차 QA (계좌 접기·복사 토스트) — 2026-10-11

3차 QA 뒤 사용자가 커밋 3개(`b5abf79` og 주소·카카오 키·방명록 주소, `05d910b` 주석 정리, `5e7de56` 교통편·계좌번호)로 placeholder를 채웠다. 그 뒤 사용자 피드백(`00_user-input.md` 맨 아래 "계좌 영역 피드백", 카피 시트 account_info 아래 인용문)에 따라 frontend가 account 섹션을 접는 카드로 바꾸고 복사 토스트에 체크를 넣었다(`05_frontend-developer_summary.md` 11장). 기준은 모션 명세 4-4 표의 "계좌 접기"·토스트·reduced-motion 행이다. 작업 트리 변경분(`git diff`: `index.html`, `style.css`, `script.js`)을 검증하고 다른 섹션의 회귀를 확인했다.

### 요약

- 전체 결과: **FAIL** (FAIL 1)
- 4차 판정 49항목: PASS 48 / FAIL 1 / 새 WARNING 0
- **계좌 접기·복사 토스트 변경분은 FAIL 0이다.** FAIL 1건(F1)은 이번 변경과 무관하다. 작업 트리의 카피 시트 `dday_message`가 바뀌었는데 페이지와 `00_user-input.md`에는 반영·기록이 없다(아래 4-6). 구조 수정이 필요해 보고만 한다
- 직접 수정: 없음. 페이지 코드에서 고칠 결함이 나오지 않았다
- 기존 WARNING: **W1·W2·W3 해소**(W2·W3은 배포 후 실제 동작 1회 확인 권장), W4는 3차에 해소, W5·W6·W7은 그대로
- 검증 방법
  - 정적: 1차 `qa/static_checks.py`와 3차 `qa3/static3.py`를 `qa4/`로 옮겨 다시 돌렸다. static3은 50/50 PASS이고 출력이 3차와 같다. static_checks는 og:image가 절대 URL이 되어 경로 변환 한 줄만 고쳤고, 3차 출력과 다른 곳은 og:image 값, `@keyframes account-open: ['opacity']` 추가, 장식 전용 색 경고 1건(4-3 #29, 오탐)이다. 대비는 Python으로 WCAG 식을 계산했다
  - 브라우저: 로컬 서버 `127.0.0.1:8773` + headless Chrome CDP(DPR 2, 터치 에뮬레이션)
    - frontend 검사 `fe-account/check.mjs`를 포트만 바꿔 `qa4/fe-account-check.mjs`로 motion·reduced·nojs × 360·390에서 다시 돌렸다. 페이드 중간 샘플의 몇 ms 차이 말고는 frontend 결과와 같다
    - QA 독립 검사 `qa4/account.mjs`(360/375/390/430, motion·reduced): 권한을 준 실제 클립보드 읽기, 펼친 뒤 접근성 트리 expanded 값, Space·Enter·Tab 키보드, 실제 터치 탭 전후 매 프레임 opacity·회전각 샘플, 토스트 위치·줄 수, 연속 토스트, BGM 토글 겹침을 쟀다
    - 3차 회귀 드라이버를 `qa4/qa.mjs`로 옮겨 13개 시나리오를 돌리고 `qa4/compare4.py`로 3차 JSON과 비교했다. 캐러셀 검사 `qa4/carousel-check.mjs`는 110/110 PASS다. 바꾼 곳은 두 군데다. 카카오 키와 방명록 주소가 실제 값이 되어 모든 시나리오에서 `*kakao*`, `*formspree.io*` 요청을 막았다(시험 제출이 사용자 Formspree 받은편지함에 들어가지 않게). interact의 계좌 단계는 첫 카드를 연 뒤 복사하도록 바꿨다
    - Chrome은 샌드박스 안에서 뜨지 않아 샌드박스를 끄고 실행했다. 끝난 뒤 서버와 Chrome을 종료했다(남은 프로세스 0, 포트 닫힘). 스크립트·출력·스크린샷은 scratchpad `qa4/`에만 있고 저장소에는 넣지 않았다

### 4-1. 계좌 접기 (명세 4-4 "계좌 접기", 사용자 결정)

| # | 항목 | 기준 | 측정 | 결과 |
|---|------|------|------|------|
| 1 | 마크업 | `<details>/<summary>`, 라벨은 기존 신랑측/신부측 | `index.html:297-334` `details.card.account__card.reveal` 2개, 첫 자식이 `summary.account__summary`(라벨 + `aria-hidden` 화살표 SVG). 본문의 `#groom-account`·`#bride-account`, `data-copy-target`, 버튼 `aria-label`은 커밋본과 같다 | PASS |
| 2 | 기본 접힘 | 처음엔 숨김 | 네 폭 모두 `open=false`, 계좌번호·복사 버튼 `checkVisibility()` false | PASS |
| 3 | 탭으로 열고 닫기 | 누르면 펼쳐짐 | 실제 터치 탭으로 열림 → 다시 탭하면 닫힘, 두 카드 모두 열기 가능, 열린 화살표 180deg | PASS |
| 4 | summary 터치 영역 | 44px 이상 | 높이 56px, 폭은 카드 전체(310/325/340/380px) | PASS |
| 5 | 기본 삼각형 숨김 | Safari 포함 | `style.css:734` `.account__summary::-webkit-details-marker { display: none; }`가 CSSOM에 있다. Chrome은 `display: flex` + `list-style: none`으로 표식 없음(스크린샷 `qa4/motion-360-collapsed.png`). Safari 실기는 이 환경에서 보지 못했다 | PASS |
| 6 | 포커스 링 | 기존 2px accent, offset 2px | Tab으로 온 summary가 `:focus-visible`, `solid 2px rgb(142,85,88)`, offset 2px. 닫힘에서는 카드 모서리를 따라 돌고, 열림에서는 summary 아래 변이 직선이다(`qa4/motion-390-focus*.png`) | PASS |
| 7 | 키보드 | `<summary>` 기본 동작 | Space로 열기·닫기, Enter로 열기. 닫힌 카드의 복사 버튼은 `focus()`가 걸리지 않는다. 열면 Tab 순서가 summary → "신랑측 방인혁 계좌번호 복사하기" → 다음 summary | PASS |
| 8 | 접근성 이름·상태 | "신랑측"/"신부측", 펼침 상태 전달 | 접근성 트리 role DisclosureTriangle(Chrome의 summary 역할), 이름 "신랑측"·"신부측"(화살표는 이름에 안 들어감), expanded false → 열면 true | PASS |
| 9 | 높이 애니메이션 금지 | 명세 4-4 | CSSOM에 height·max-height·grid-template-rows 전환 0. 새 키프레임 `account-open`은 opacity만 쓴다 | PASS |
| 10 | 내용 페이드 | opacity 0→1 250ms | `::details-content`(`style.css:753`)에 `account-open` 250ms `--ease-out`. 열린 첫 프레임 0 → 100ms 0.78 → 231-235ms에 1(16ms 프레임 간격 안). 이 의사 요소가 없는 엔진은 `@supports not selector(::details-content)`(`:754`)로 `.account__body`에 건다 | PASS |
| 11 | 같은 카드를 다시 열 때 | 매번 페이드 | 같은 카드를 열기·닫기·다시 열기 해도 두 번째 열기 첫 프레임이 0이고 232-233ms에 1. 두 번째 카드도 같다(네 폭) | PASS |
| 12 | 화살표 회전 | rotate 0→180deg 200ms | transform 전환 200ms `--ease-standard`, 180deg 도달 198-202ms | PASS |
| 13 | reduced-motion | 펼침·회전 즉시 | 토큰 0ms로 화살표 `transition-duration` 0s, 페이드 `animation-duration` 0s. 탭 뒤 첫 프레임에 이미 opacity 1, 180deg(360·390, 카드 두 장, 두 번 열기) | PASS |
| 14 | JS 비활성 | 접고 펴기 가능 | `html.js` 없음, 탭으로 열리고 다시 탭하면 닫힘(360·390) | PASS |
| 15 | 펼친 레이아웃 | 화면 밖·잘림 없음 | 네 폭에서 화면 밖 요소 0, 계좌번호 한 줄, 복사 버튼 높이 44px·카드 폭 전체, 펼친 카드 높이 201px, `scrollWidth` = 화면 폭 | PASS |
| 16 | reveal | 숨은 reveal 0 | account reveal 그룹 3개(헤더, 신랑측 details, 신부측 details), 끝까지 스크롤 후 모두 보임 | PASS |

### 4-2. 복사·토스트

| # | 항목 | 기준 | 측정 | 결과 |
|---|------|------|------|------|
| 17 | 실제 클립보드 | 펼친 뒤 복사 | 클립보드에 `sentinel`을 넣고 실제 터치로 복사 → `navigator.clipboard.readText()`가 `110-335-546640`, `298702-04-213005`(네 폭, motion·reduced). frontend 검사는 writeText를 가로챘는데, QA는 실제 클립보드로 읽었다 | PASS |
| 18 | 토스트 문구 | "계좌번호가 복사되었습니다." | `index.html:432`, 카피 시트 성공 상태 메시지 줄과 같다. `role="status"` 낭독도 같은 문구, 시각 토스트는 `aria-hidden="true"` | PASS |
| 19 | 토스트 sage 체크 | 성공 시 체크 | `.toast.is-done`에서만 16px 체크 표시, `rgb(162,170,146)`, 글자 왼쪽, 세로 중심 차이 0px. 토스트 214 x 44px 한 줄, 화면 가운데 | PASS |
| 20 | 버튼 체크 색 | sage | 체크 stroke `rgb(91,106,70)`, 라벨 글자는 accent `rgb(142,85,88)` 그대로. 복사 전후 버튼 폭 변화 0(CLS 0) | PASS |
| 21 | 체크 없는 토스트 | 실패·placeholder·카카오 대체 | placeholder 보호(값을 `[[TODO:X]]`로 바꿔 시험), 복사 실패(두 방식 모두 거부: 2줄, 312-320px, 가운데 정렬, 계좌번호 선택됨, 버튼 "복사하지 못했습니다"), 카카오 대체 안내 모두 체크 `display: none` | PASS |
| 22 | 연속 토스트 | 체크가 남지 않음 | 토스트가 떠 있는 동안 성공 → 250ms 뒤 placeholder 안내 → 성공: 체크가 표시 → 숨김 → 표시로 바뀐다(`notify`가 매번 `is-done`을 토글, `script.js:101`) | PASS |
| 23 | 주소·링크 성공 | 체크 표시(공용 함수) | "주소를 복사했습니다.", "청첩장 링크를 복사했습니다."에도 체크. 05 요약 11장에 적혀 있고 오케스트레이터 지시와 맞다 | PASS |
| 24 | script.js 변경 범위 | 토스트만 | `notify(message, done = false)`(`script.js:98-104`)와 계좌·주소·링크 성공 호출(`:1304`)만 바뀌었다. placeholder 안내(`:1295`), 실패(`:1306`), 카카오 대체(`:1339`)는 `done` 없이 그대로 | PASS |

### 4-3. 대비 (WCAG 식 계산)

| # | 쌍 | 기준 | 대비 | 결과 |
|---|----|------|------|------|
| 25 | 토스트 체크 `#A2AA92` / 토스트 면 `#3B2D2A` | 비텍스트 3:1 | 5.46:1 | PASS |
| 26 | 버튼 체크 `#5B6A46` / surface `#F3EAE3` | 비텍스트 3:1 | 4.92:1 (데스크톱 hover 면 `#EDE1DB` 위 4.56:1) | PASS |
| 27 | summary 라벨 `#5B6A46` / surface (Pretendard 600 14px) | 텍스트 4.5:1 | 4.92:1 | PASS |
| 28 | 화살표 accent `#8E5558` / surface, 포커스 링 accent / bg·surface | 비텍스트 3:1 | 4.93:1, 5.45:1 / 4.93:1 | PASS |
| 29 | 1차 정적 검사 "장식 전용 색이 글자 색으로 쓰임" 경고(`style.css:913` `.toast__check { color: var(--color-secondary) }`) | 컨셉 시트: secondary는 텍스트 금지 | 오탐이다. 이 `color`는 `stroke="currentColor"` SVG 체크에만 걸리고 글자가 없다. 컨셉 시트가 금지한 것은 글자 색이다. 같은 자리에 sage_deep을 쓰면 2.25:1로 비텍스트 기준에도 못 미친다 | PASS |

### 4-4. 회귀 (다른 섹션)

| # | 항목 | 측정 | 3차 대비 | 결과 |
|---|------|------|------|------|
| 30 | hero 보케 | 구간별 living 최대 hero 8 / calendar 6 / share 6, 구간별 보유 최대 8/6/6(모바일 합계 상한 12). 캔버스 alpha glow 0.255, primary 0.161(상한 0.28 / 0.18), 제외 영역 alpha 0. gallery·venue·notice·account·guestbook에서 `running []`, 화면 밖 전구 paused, guestbook 위치 무한 애니메이션 0 | 수치 차이는 무작위 범위 안 | PASS |
| 31 | 갤러리 캐러셀 | `carousel-check.mjs` 110/110 PASS | 검사 목록 같음, 전환 중 샘플 위치만 다름 | PASS |
| 32 | lightbox | lightbox·lbkeys 시나리오(핀치 3배 clamp, 더블탭, 팬 clamp, 포커스 트랩, 스크롤 잠금, 뒤로가기, 끌어 닫기, 키보드) | 문서 위치(top) 말고 같음 | PASS |
| 33 | couple 정렬 | 네 폭의 행·줄·"아들/딸" 칸·이름 left/right/width | 문서 위치(top) 말고 같음 | PASS |
| 34 | notice | 2줄, 간격, reduced 상태, notice에서 보케 정지 | 같음(venue~account 간격 포함) | PASS |
| 35 | venue 주소·교통 | 교통편이 카피 시트 199-208행과 같다(지하철·주차·내비게이션, 버스 줄 삭제). 주소 복사 클립보드 "서울 송파구 송파대로 155", execCommand 폴백, 둘 다 실패 시 선택 | 섹션 높이 885 → 850px(430폭 826px)은 커밋 `5e7de56`이 버스 줄을 지운 결과 | PASS |
| 36 | BGM | 탭 전 요청 0, 탭 후 재생·volume 0.60·링, 끄기, 음원 오류 복구, reduced 링 정지 | 같음 | PASS |
| 37 | 방명록 | 빈 성함·빈 말씀, 501 응답, 성공 경로(fetch 대체) | 접수 주소가 생겨 3차의 "받을 수 없습니다" 단계가 전송 실패 문구로 바뀌었다(QA가 Formspree 요청을 막았기 때문). 실제 접수는 시험하지 않았다 | PASS |
| 38 | D-day 계산 | 고정 시각 6개 결과, 실제 시각 표시 D-84 | 같음 | PASS |
| 39 | 가로 스크롤 | 360/375/390/430에서 `scrollWidth` = 화면 폭(계좌를 펼쳤을 때도) | 같음 | PASS |
| 40 | 콘솔 오류 | 페이지에서 생긴 오류·예외 0. 4xx/5xx는 QA가 일부러 넣은 501·404, 실패 요청 2건은 QA가 막은 카카오 SDK·Formspree, Canvas2D 경고는 QA 픽셀 측정 때문 | 같음 | PASS |
| 41 | heading·랜드마크 | h1 1개 + h2 9개, 이름 없는 컨트롤 0, alt 없는 img 0, 장식 svg·canvas 노출 0 | 같음 | PASS |
| 42 | reveal·디바이더 | 네 폭에서 끝까지 스크롤 후 숨은 reveal 0, 안 그려진 디바이더 0, 14px 미만 한글 0, 화면 밖 요소 0 | 같음 | PASS |
| 43 | reduced-motion (페이지 전체) | 로드 직후·완주 후 상태, 런타임 전환 | 보케 무작위 값 말고 같음 | PASS |
| 44 | JS 비활성 (페이지 전체) | nojs 결과 | 같음 | PASS |
| 45 | 접근성 트리 버튼 목록 | 계좌 복사 버튼 2개가 접힌 동안 빠진다. 펼치면 나타나고 Tab으로 닿는다(4-1 #7) | 의도한 변화 | PASS |
| 46 | 정적 회귀 | static3 50/50(3차와 같음), 1차 정적 출력은 요약에 적은 3곳만 다르다 | 같음 | PASS |
| 47 | 코드 파일 한국어 | `script.js`, `style.css`에서 한글 0건 | 같음 | PASS |

### 4-5. BGM 토글과 summary 화살표 겹침 (05 요약 11장 참고 사항)

| # | 항목 | 측정 | 결과 |
|---|------|------|------|
| 48 | 실사용 영향 | 고정 토글(위 16px, 오른쪽 16px, 40px)은 첫 summary의 위 끝이 화면 맨 위에서 약 0~24px 안에 있을 때만 화살표(20px)의 오른쪽 11px을 덮는다(화살표 면적의 35~55%). 이때 화살표 한가운데를 누르면 토글이 받아 음악이 켜진다. summary 위 끝이 25px 아래로 내려가면 가운데는 summary가 받고, 41px부터는 겹치지 않는다. 라벨과 나머지 막대(56px 높이, 카드 폭 전체)는 어느 위치에서나 summary가 받는다(네 폭 같음, `qa4/motion-390-bgm-overlap.png`) | PASS |

판단: 실사용 문제로 보지 않는다. 겹치는 건 카드를 화면 맨 위에 딱 붙인 짧은 순간뿐이다. 그때도 토글이 화살표 위에 그대로 보여서 하객은 무엇을 누르는지 알 수 있다. 라벨이나 막대의 다른 곳을 눌러도 열린다. 3차에서 적은 갤러리 프레임 모서리와 같은 성격이라 고치지 않아도 된다.

### 4-6. 교차 확인에서 나온 불일치

| # | 항목 | 카피 시트 (작업 트리) | 페이지 | 결과 |
|---|------|------|------|------|
| 49 | dday_message | `02_copy-writer_copy.md:127-146`이 바뀌었다. 예식 전 "인혁 · 유민의 결혼식까지 / D - {n}", 당일 "오늘, / 저희 두 사람이 첫 걸음을 내딛습니다.", 예식 후 "(D+{n}) 함께 걸어가는 {n}번째 날 / 끝까지 축복해 주셔서 감사합니다." 카운터를 `aria-hidden`으로 둔다는 줄도 지워졌다 | `index.html:440-442` "인혁과 유민의 결혼식까지 {n}일 남았습니다." / "오늘, 인혁과 유민이 부부가 됩니다." / "인혁과 유민의 결혼식에 함께해 주셔서 감사합니다."(커밋본 카피). `script.js:600`은 예식 후 카운터를 숨긴다 | **FAIL (F1)** |

이 변경은 `5e7de56`(오늘 09:26) 뒤의 작업 트리 diff에만 있다. `00_user-input.md` "계좌 영역 피드백"과 05 요약 11장에는 나오지 않는다. 사용자가 account_info 인용문과 함께 카피 시트에 직접 적은 수정으로 보이지만, 오케스트레이터 기록이 없어 의도를 단정할 수 없다. 계좌 변경과 무관하고 이번 변경으로 생긴 회귀도 아니다.

### 기존 WARNING 현황

- W1: **해소.** og:url·og:image가 `https://ihbang.github.io/wedding-letter/…` 절대 URL이다(`index.html:15-16`, 로컬 `images/og-garden.jpg` 1200 x 630 존재). 교통편(`:264, 268, 272`)과 계좌 4개(`:304, 323`)가 채워졌고, `index.html`에 `[[TODO` 0건
- W2: **해소(코드).** 카카오 JavaScript 키가 들어갔다(`index.html:392`). 이 환경에서는 SDK 요청을 막아 대체 경로만 확인했다. 카카오 디벨로퍼스 [플랫폼 > Web]에 `https://ihbang.github.io`가 등록됐는지는 여기서 알 수 없으니, 배포 후 휴대폰에서 공유를 한 번 눌러 카드가 뜨는지 확인한다. 이제 공유 카드 제목은 og:title을 쓴다(W5 참고)
- W3: **해소(코드).** 접수 주소가 Formspree로 채워졌다(`index.html:344`). QA는 실제로 제출하지 않았다. 배포 후 시험 글 1건을 보내 Formspree에 도착하는지, 성공 문구가 뜨는지 확인한다
- W4: 3차에서 해소
- W5: 그대로. `02_copy-writer_copy.md:310` `kakao_share.title`(3차 299행)은 여전히 "방인혁 & 손유민, 부부가 되는 날에 초대합니다"이고, 실제 공유 제목은 og:title "인혁 ♡ 유민, 우리 결혼합니다"다. 카카오 키가 들어가 이 차이가 실제 공유에 드러나게 됐다. 문서에서 같이 고칠 곳이 하나 늘었다. 카피 시트 15-26행의 placeholder 표(`GROOM_BANK`~`KAKAO_JS_KEY`)와 28행 "교통편 3종은 사용자가 주지 않았고"는 모두 채워진 지금과 맞지 않는다
- W6: 그대로(`02_copy-writer_copy.md` gallery_alt 표 1 = 02, `:183` "그리드 버튼 접근성 이름", 컨셉 시트 `:104`, 모션 명세 `:447, 557, 879`)
- W7: 그대로(`script.js:747-756`)

### 4차에서 나온 이슈와 수정 제안

- [ ] **F1 (FAIL, 구조 수정·사용자 확인 필요) `_workspace/02_copy-writer_copy.md:127-146` ↔ `index.html:440-442`, `script.js:599-603`** 카피 시트의 dday_message가 바뀌었는데 페이지는 예전 문구다 → 오케스트레이터가 사용자에게 이 수정을 반영할지 먼저 확인한다
  - 반영하는 경우: `00_user-input.md`에 결정을 적고, copy-writer가 아래를 정한 뒤 frontend가 반영한다
    - 예식 후 `{n}`의 기준. 다음 날이 "1번째 날"인지 "2번째 날"인지 정해야 한다. 지금 코드는 예식 후 카운터를 숨기는데, 새 카피는 `D+{n}` 표시를 전제로 한다
    - `D - {n}`(띄어 쓴 형식)을 화면 카운터로 쓸지, 문구 둘째 줄로 쓸지. 스크린 리더가 "디 마이너스"로 읽지 않도록 시각 카운터는 `aria-hidden`으로 두고 "84일 남았습니다" 같은 sr-only 문장을 함께 둘 것을 권한다(예전 카피 시트의 근거 줄이 지워졌다)
    - "첫 걸음"은 표준국어대사전에 한 낱말 "첫걸음"으로 올라 있다. "1번째 날"보다는 "첫 번째 날"처럼 읽히는 표기를 검토한다
    - 반영 뒤 QA가 dday 시나리오(고정 시각 6개)를 새 문구 기준으로 다시 돈다
  - 반영하지 않는 경우: 카피 시트 127-146행을 커밋본으로 되돌려 문서와 페이지를 맞춘다. 카피 시트는 사용자가 직접 고친 파일이라 QA가 손대지 않았다

### 참고 (판정 대상 아님)

- 복사 실패 토스트는 360~430폭에서 "복사하지 못했습니다. 길게 눌러 직접 복사해 / 주세요."처럼 둘째 줄에 한 어절만 남는다(`qa4/motion-360-fail-toast.png`). 토스트를 flex로 바꾸기 전에도 폭이 같아 이번 변경으로 생긴 것은 아니다. 원하면 `.toast__text { text-wrap: balance; }` 한 줄로 두 줄 길이를 고르게 할 수 있다
- 열린 카드에서 포커스 링은 summary 아래 변을 따라 카드 안쪽을 가로지른다(아래 모서리 직각, `style.css:735`). 포커스된 대상이 summary라는 점이 잘 보여 문제는 아니다
- Safari 실기는 이 환경에서 확인하지 못했다(`display: flex` summary 배치, `::-webkit-details-marker` 숨김, `::details-content` 또는 `@supports` 대체 경로의 페이드). 배포 후 iPhone에서 카드 하나를 두 번 열어 삼각형이 보이지 않는지, 페이드가 매번 나오는지 한 번 보면 된다

### 4차 이후 F1 해소 (오케스트레이터 확인, 2026-10-11)

- 사용자 확인으로 결정했다: 예식 후 `{n}`은 예식일을 1번째 날로 센다(다음 날이 "2번째 날"이라 "1번째 날"은 나오지 않는다). 큰 카운터는 예식 전에만 "D - {n}"으로 보여 준다. 결정은 `00_user-input.md` "D-day 문구 변경" 절에 있다
- 오케스트레이터 기본값: "첫걸음" 표준 표기, 시각 카운터 `aria-hidden` + sr-only "{n}일 남았습니다."
- 반영: `index.html` dday 블록(문구 → 카운터 순서)과 `ui-text`의 `dday-before`·`dday-before-sr`·`dday-today`·`dday-after`, `script.js` `initDday`, `style.css` `.dday__count`·`.dday__message` 여백
- 고정 시각 5개(KST 정오 2026-10-11, 2027-01-02, 01-03, 01-04, 01-10)로 확인했다: 예식 전 "D - 84"/"D - 1" 표시와 숨은 문장 낭독, 당일·예식 후 카운터 숨김, 예식 후 "2번째 날"/"8번째 날", 콘솔 오류 0건. 스크립트와 캡처는 `scratchpad/fill-check/dday.mjs`, `dday-before.png`, `dday-today.png`
- **F1: 해소**

---

## 5차 QA (오시는 길 카카오맵) — 2026-10-12

마지막 커밋(`2312b3f`) 뒤 작업 트리에서 오시는 길 섹션에 카카오맵 고정 지도가 들어갔다. 기준은 `00_user-input.md` 맨 아래 "오시는 길 지도 추가" 절(사용자 결정과 오케스트레이터 기본값), 모션 명세 4-7("지도 임베드가 들어가면 `loading="lazy"`. 지도 위에 모션 없음"), `05_frontend-developer_summary.md` 12장이다. 변경 범위는 `index.html`(meta 키, 지도 상자, 공유 버튼의 `data-kakao-key` 삭제), `style.css`(`.venue__map`), `script.js`(`kakaoKey()`, `initVenueMap()`, 공유 키 읽는 줄)다.

### 요약

- 전체 결과: **PASS** (FAIL 0)
- 5차 판정 38항목: PASS 38 / FAIL 0 / 새 WARNING 0
- 직접 수정 1건: PC에서 지도를 더블클릭하면 지도 아래 "네이버" 글자가 선택되던 문제를 `style.css:689-690` 두 줄로 고쳤다(아래 "5차 직접 수정"). 수정 전에는 WARNING이었고, 수정 뒤 다시 재서 PASS로 적었다
- 기존 WARNING: **W5 해소**(커밋 `2312b3f`에서 카피 시트 `kakao_share.title`이 og:title과 같아졌고 placeholder 표가 지워졌다). W6·W7은 그대로(W7 위치는 `script.js:758-767`로 바뀌었다)
- 검증 방법
  - 정적: 4차 `static3.py`, `static_checks.py`를 다시 돌렸다. static3은 50/50 PASS이고 4차와 출력이 같다. static_checks는 4-3 #29 오탐 줄 번호만 바뀌었다. `node --check script.js` 통과. `script.js`·`style.css` 한글 0건
  - 브라우저: 로컬 서버 `127.0.0.1:8777`(작업 트리) + headless Chrome CDP(DPR 2, 터치 에뮬레이션). 모든 실행에서 `*formspree*` 요청을 막았고 실제 전송은 0건이다
  - frontend 검사 재현: `fe-map/map.mjs`를 포트만 바꿔 11개 시나리오를 다시 돌렸다. stub 360·390·430·390 reduced 각 28/28, real 360·390 10/10, fail-403·net·throw 10/10, fail-zero·hang 11/11, nojs 6/6. frontend 결과와 같다(hang은 9.77초에 숨김)
  - **QA 독립 검사 `qa5/map5.mjs`는 가짜 지도 대신 실제 카카오 코드로 쟀다.** `dapi.kakao.com/v2/maps/sdk.js` 요청에 실제 로더 본문(frontend가 받아 둔 4.5.28 로더)을 돌려주고, 로더가 부르는 실제 `kakao.js` 4.5.28과 `services.js` 1.1.3(공개 CDN `t1.kakaocdn.net`에서 받은 원본)을 그대로 실행했다. 지도 타일은 실제 `mts.kakaocdn.net`에서 받았다. `127.0.0.1`은 카카오 로컬 API가 거절하므로 `Geocoder.addressSearch`만 바꿨다. 결과 좌표는 실제 레벨 4 타일에 보이는 "더컨벤션" 위치를 읽은 추정값(37.4840, 127.1228)이다. 페이지 코드가 만든 Map·Marker 인스턴스는 원본을 감싼 기록용 래퍼로 잡아 실제 getter(`getLevel`, `getDraggable`, `getProjection().containerPointFromCoords`)로 확인했다. 공유는 실제 공유 SDK 2.7.2를 실행하고 `init`·`Share.sendDefault`만 기록하도록 감쌌다(공유 창은 열지 않았다)
  - 공통 회귀: 4차 드라이버(`qa.mjs` 13개 시나리오, `account.mjs` motion·reduced × 4폭, `carousel-check.mjs`)를 HEAD(`2312b3f`를 scratchpad에 풀어 `127.0.0.1:8778`로 띄움)와 작업 트리(`:8777`)에 같은 조건으로 돌리고 `qa5/compare5.py`로 비교했다. 이 드라이버들은 4차처럼 `*kakao*`를 막으므로 지도는 실패 경로(숨김)로 돈다. 지도가 그려진 상태의 페이지 전체 검사(가로 스크롤, 숨은 reveal, 콘솔)는 `map5.mjs`가 4폭에서 했다
  - Chrome은 샌드박스 안에서 뜨지 않아 샌드박스를 끄고 실행했다. 끝난 뒤 두 서버와 Chrome을 종료했다(남은 프로세스 0, 8777·8778 포트 닫힘). 스크립트·출력·스크린샷은 scratchpad `qa5/`에만 있고 저장소에는 넣지 않았다

### 5-1. 지도 변경

| # | 항목 | 기준 | 측정 | 결과 |
|---|------|------|------|------|
| 1 | 마크업·접근성 | `role="img"` + 이름, 지도 안쪽은 접근성 트리에서 빠짐 | `index.html:260-261` `div.card.venue__map#venue-map[role=img][aria-label="더컨벤션 송파문정 위치 지도"]` > `div.venue__map-canvas[inert]`. 접근성 트리: 상자 role image, 이름 "더컨벤션 송파문정 위치 지도". 실제 카카오 로고 링크는 ignored(사유 inertElement), 이름에 Kakao가 든 노출 노드 0개 | PASS |
| 2 | 고정 지도 옵션 | 드래그·휠·더블클릭 확대 막힘, 컨트롤 없음 | 생성 옵션 level 4, `draggable: false`, `scrollwheel: false`, `disableDoubleClickZoom: true`, `keyboardShortcuts: false`, `tileAnimation: false`(`script.js:1400-1408`). 실제 getter `getLevel()` 4, `getDraggable()` false, `getKeyboardShortcuts()` false. `addControl` 0회, `panTo` 0회 | PASS |
| 3 | 옵션이 실제 엔진에서 먹는지 | inert가 없어도 지도가 안 움직임 | 대조 실험으로 inert와 pointer-events를 잠시 풀고 실제 카카오 판에 직접 입력: 마우스 끌기 뒤 중심 그대로, 휠 뒤 level 4(페이지는 스크롤됨), 카카오 판 위 더블클릭(대상이 캔버스 안인지 확인) 뒤 level 4, 두 손가락 핀치 뒤 level 4. 4폭과 reduced 모두 같다 | PASS |
| 4 | 마커 = 지오코더 결과 | 같은 점, 지도 가운데 | 지오코더 질의 1회, 질의어 = `#venue-address` 글자 "서울 송파구 송파대로 155"(카피 시트 97행과 같다). `marker.getPosition()` = 결과 (y, x) 정확히 같음. 마커 화면 위치와 캔버스 중심 차이 0~0.5px(360/375/390/430/390 reduced). `getCenter()`는 엔진이 픽셀 격자에 맞춰 1e-5도(약 1m) 안쪽으로 반올림한다 | PASS |
| 5 | 좌표·한국어가 코드에 없음 | 지오코더로만 위치 결정 | `script.js`·`style.css`·`index.html`에서 위경도 꼴 숫자 0건. 주소는 DOM에서 읽는다(`script.js:1381`). 두 코드 파일 한글 0건 | PASS |
| 6 | 세로 쓸기 → 페이지 스크롤 | 지도 위에서도 스크롤 | 실제 엔진(지도 안에 `touch-action: none` 판 1개)에서 지도 가운데를 160px 쓸어 올리면 페이지가 195~199px 스크롤(4폭, reduced, 공유 실행 포함 9회). 캔버스로 간 터치 0건, 지도 중심·레벨 그대로. 가로로 200px 쓸어도 페이지 가로 이동 0, 지도 그대로. 대조 실험(inert 해제)에서는 같은 쓸기에 스크롤 0px이어서, 검사가 실제 차이를 잡는다 | PASS |
| 7 | 탭 | 눌러도 동작 없음 | 지도 가운데 탭, 더블탭, 카카오 로고 위치 탭: 주소 변화 없음, 새 탭 0개(`Target.targetCreated`), 확대 없음, 포커스가 지도 안으로 가지 않음 | PASS |
| 8 | 키보드 | Tab이 지도 안으로 안 들어감 | 주소 복사 버튼 → Tab → "네이버 지도", Shift+Tab → 주소 복사 버튼. 실제 엔진이 만든 포커스 가능 요소 2개(`AREA[href="javascript:void(0)"]` 마커, `A[href="http://map.kakao.com/"]` 로고)에 `focus()`를 걸어도 0개가 포커스를 받는다. 대조 실험에서는 Tab이 `AREA`로 들어간다 | PASS |
| 9 | 지연 로딩 | hero에서 0건, venue 근처에서 1건 | 첫 화면 3초 동안 `dapi.kakao.com`·`kakaocdn` 지도 파일·타일 요청 0건. 50px씩 내리며 잰 첫 요청 시점: 지도 상자 위쪽이 화면 아래 끝에서 776px(360x780), 648px(375x667), 809~821px(390x844), 931px(430x932) 떨어졌을 때. 바로 전 단계는 모두 한 화면보다 멀었다(826/698/859~871/981px). 끝까지 `sdk.js` 1건, `script[src*=dapi]` 1개. URL은 https, `appkey` = meta 값, `autoload=false`, `libraries=services`. 명세 4-7 "`loading="lazy"`"와 같은 효과다 | PASS |
| 10 | 실패 경로 | 지도 상자만 숨고 카드·버튼은 남음 | 실제 401(127.0.0.1 도메인 불일치, Chrome이 ORB로 막음) 360/375/390/430, 403, 연결 거부, 주소 결과 없음, 지도 생성 예외, `load` 무응답(9.77초), QA 추가 2건: 실제 `services.js`가 실제 로컬 API를 불러 401을 받은 경우(콜백이 `ERROR`로 와서 즉시 숨김), `kakao.js` 로드 실패로 `load`가 영영 안 불리는 경우(9.99초에 숨김). 모두 `hidden` + `display: none` + 높이 0, 장소 카드와 지도 버튼 2개가 보이고 카드 → 버튼 간격 16px | PASS |
| 11 | JS 비활성 | 지도 상자 없음 | `display: none`, `dapi.kakao.com` 0건. `nojs` 시나리오 결과가 HEAD와 완전히 같다(지도 없는 예전 배치 그대로) | PASS |
| 12 | 카카오 로고·축척 | 가려지지 않음 | 실제 로고 이미지 32x10이 상자 왼쪽 아래 안쪽에 있다. 390폭 상자 342x257에서 (93, 237)-(125, 247), 아래 끝에서 10px. 360폭은 카카오가 축척을 숨겨 로고가 (11, 214.5)-(43, 224.5). 375/390/430폭의 축척 "100m"는 상자 왼쪽 7px에서 시작하는 82px 폭이고 아래 끝에서 6px 떨어져 있다. 네 모서리가 모두 안쪽 반지름 15px 둥근 영역 안에 든다(계산). 4배 확대 캡처 `qa5/logo-corner-engine-{360,375,390,430}-x4.png`에서도 잘리지 않는다. 이 지도 종류에서 저작권 글자 칸은 비어 있다 | PASS |
| 13 | 크기·배치 | 4:3, 최대 280px, 카드와 같은 간격 | 상자 = 컬럼 폭, 캔버스 = 상자 안쪽 폭. 360: 310 x 232.5, 375: 325 x 243.75, 390: 340 x 255, 430: 380 x 280(높이 상한). 카드 → 16px → 지도 → 16px → 버튼 | PASS |
| 14 | 폭·높이 변경 | 가운데 유지, 애니메이션 없음 | 390→430, 430→375 등 폭 변경 뒤 마커가 캔버스 중심에서 0~0.5px, 캔버스가 새 컬럼 폭, `panTo` 0회. 주소창이 접히고 펴지듯 높이를 56px씩 네 번 바꿔도 마커 중심 그대로, 타일이 캔버스를 100% 덮는다 | PASS |
| 15 | 지도 위 모션 | 명세 4-7 "모션 없음" | 상자 안 `getAnimations()` 0개, `tileAnimation: false`, 상자 transition 0s. reduced-motion에서도 같은 값. 카카오 축척 막대에 `transition: width 0.1s`가 있지만 레벨이 바뀔 때만 돌고 이 지도는 레벨이 바뀌지 않는다 | PASS |
| 16 | 고정 요소와 겹침 | BGM 토글이 지도 위 | 지도 상자를 화면 맨 위에 붙였을 때 토글(334, 16, 40x40)이 지도와 겹치고, 그 자리를 누르면 토글이 받는다. 실제 화면 캡처에서도 토글이 지도 위에 그려진다(`qa5/bgm-over-map-viewport-390.png`) | PASS |
| 17 | 실제 엔진 렌더링 | 컨테이너에 정상으로 그려짐 | 실제 `kakao.js`가 `.venue__map-canvas` 안에 타일 8개(430폭 11개)를 모두 불러와 캔버스를 100% 덮는다. 카카오가 `<main>` 밖에 요소를 붙이지 않는다. 지도 관련 콘솔 오류·경고 0건 | PASS |
| 18 | 데스크톱 더블클릭 | 페이지 글자 선택 없음 | 수정 전: inert가 걸린 지도를 마우스로 더블클릭하면 상자가 클릭을 받아 Chrome이 가장 가까운 글자 "네이버"(지도 버튼 라벨)를 선택했다. 터치 더블탭·길게 누르기에서는 선택이 없었다. 수정 뒤(`user-select: none`) 같은 시험에서 선택 0, 터치 동작도 그대로 0 | PASS (직접 수정) |

### 5-2. 카카오 공유 회귀

| # | 항목 | 기준 | 측정 | 결과 |
|---|------|------|------|------|
| 19 | SDK 한 번 로드, meta 키로 init | 공유 버튼 2회 | 지도 먼저 그린 뒤 공유 2회: `kakao_js_sdk` 요청 1건, 태그 1개, 실제 `Kakao.init` 1회(인자 `5c503e2a…7bc3` = `index.html:22` meta 값), `isInitialized()` true. `sendDefault` 2회, 제목 og:title "인혁 ♡ 유민, 우리 결혼합니다", 이미지 og:image, 링크 og:url. 대체 안내 없음 | PASS |
| 20 | SDK 실패 → 링크 복사 | 대체 동작 | 공유 SDK 연결 거부: 클립보드 = og:url `https://ihbang.github.io/wedding-letter/`, 안내 "카카오톡 공유를 열 수 없어 링크를 복사했습니다. 대화방에 붙여 넣어 주세요.", `init` 호출 0. 이때도 지도는 그려진 채다 | PASS |
| 21 | 지도 SDK와 공유 SDK 간섭 | 서로 덮어쓰지 않음 | 코드: 지도 엔진은 `window.kakao`·`window.daum`만, 공유 SDK는 `window.Kakao`만 쓴다. 실행: 공유를 먼저 쓴 뒤(그때 지도 요청 0건, `window.kakao` 없음) 올라와 지도를 그려도 `window.Kakao`가 같은 객체로 남고 `init`은 1회뿐, 세 번째 공유도 정상. 지도 먼저 → 공유 순서도 `kakao.maps.Map`(function)과 `Kakao.Share`(object)가 둘 다 살아 있고 지도 SDK 요청은 계속 1건 | PASS |
| 22 | 방명록 요청 차단 | 모든 실행 | 모든 실행에서 `*formspree*` 차단, 보낸 요청 0건 | PASS |

### 5-3. 공통 회귀 (HEAD ↔ 작업 트리, 같은 드라이버)

| # | 항목 | 측정 | 결과 |
|---|------|------|------|
| 23 | hero 보케 | `bokeh`·`zonecap`·`reduced`의 차이는 무작위 값뿐이고 상한 안이다: 구간별 보유 최대 hero 7(상한 8), alpha 최대 glow 0.278 / primary 0.175(상한 0.28 / 0.18) | PASS |
| 24 | 갤러리 캐러셀·lightbox | `carousel-check` 양쪽 110/110, 검사 이름 같음(다른 곳은 손가락 이동 시각과 전환 중 위치 샘플). `lightbox`·`lbkeys`는 네트워크 줄 말고 같다 | PASS |
| 25 | couple 정렬·notice | `copyedit2`(4폭 행·줄·이름 위치), `reducednotice` 모두 네트워크 줄 말고 같다 | PASS |
| 26 | 계좌 접기·복사 토스트 | `account` motion·reduced × 4폭: 실제 클립보드 계좌번호, 접기·키보드·접근성·토스트 결과 같음. 다른 곳은 페이드 샘플 ±1ms와 BGM 토글이 화살표를 덮는 면적 비율 2곳의 1%p(정수로 반올림한 좌표와 누름 판정은 같다) | PASS |
| 27 | D-day | `dday` 시나리오 결과가 HEAD와 같다. 오늘(2026-10-12) 표시 "D - 83 / 인혁 · 유민의 결혼식까지 83일 남았습니다."(2027-01-03까지 83일) | PASS |
| 28 | BGM | `bgmnet` 같음, `interact`의 탭 전 요청 0·재생·끄기·음원 오류 복구 단계 같음 | PASS |
| 29 | 방명록 검증 | `interact`의 빈 성함·빈 말씀·501 응답 단계 같음 | PASS |
| 30 | 가로 스크롤 | 360/375/390/430에서 `scrollWidth` = 화면 폭, 화면 밖 요소 0(지도 숨김 상태, HEAD와 같음). 지도가 그려진 상태(`map5`)도 4폭 모두 가로 스크롤 없음 | PASS |
| 31 | 콘솔 오류 | 페이지 코드의 오류·예외 0건. 회귀 드라이버의 콘솔 줄은 HEAD와 완전히 같다(QA가 일부러 넣은 501·404, QA 픽셀 측정 때문인 Canvas2D 경고). 실패 요청은 QA가 막은 카카오 요청뿐이다. 참고로 403이나 지오코더 401처럼 서버가 오류 상태를 돌려주면 브라우저가 "Failed to load resource" 줄을 남긴다. 페이지 코드가 찍는 줄이 아니라 막을 수 없다 | PASS |
| 32 | heading·접근성 트리 | h1 1개 + h2 9개, 랜드마크 HEAD와 같음. 이미지 목록에 "더컨벤션 송파문정 위치 지도" 1개가 늘어난 것만 다르다 | PASS |
| 33 | 숨은 reveal | 4폭에서 끝까지 스크롤한 뒤 0개, 안 그려진 디바이더 0개(지도 숨김·지도 그림 모두) | PASS |
| 34 | 코드 검사 | `node --check script.js` 통과, `script.js`·`style.css` 한글 0건 | PASS |
| 35 | 정적 회귀 | static3 50/50(4차와 같음), static_checks는 4-3 #29 오탐 줄 번호만 바뀜 | PASS |

외부 요청 목록에서 늘어난 것은 9개 시나리오의 `https://dapi.kakao.com/v2/maps/sdk.js` 1건씩이다(드라이버가 막았다). 계좌 섹션처럼 지도 아래로 바로 건너뛰어도 지도 상자가 한 화면 안에 들어오는 순간 요청이 나가고, 실패하면 숨는다.

### 5-4. 컨셉 일치 (스크린샷)

`qa5/venue-engine-{360,375,390,430}.png`, `qa5/map-engine-*-x2.png`

| # | 항목 | 판단 | 결과 |
|---|------|------|------|
| 36 | 모서리·테두리·면·여백 | 계산값이 장소 카드와 같다: 모서리 16px, 1px 실선 `rgb(228, 214, 205)`(line), 면 `rgb(243, 234, 227)`(surface), 그림자 없음. 컨셉 시트의 "면은 background와 surface 두 단계, 카드 16px, 경계 1px line"에 맞는다. 카드 → 지도 → 버튼이 16px 간격으로 한 묶음처럼 읽힌다 | PASS |
| 37 | 4:3·최대 280px | 360·375·390폭은 4:3 그대로이고, 430폭은 280px 상한에 걸려 380x280(약 1.36:1)이 된다. 네 폭 모두 섹션 안에서 카드보다 조금 큰 정도로 자연스럽다. 추정 좌표로 그린 지도에서 예식장 마커가 가운데, 8호선 문정역이 위쪽에 함께 보인다(아래 "배포 후 확인" 참고) | PASS |

### 5-5. 모션 명세 4-7

| # | 항목 | 명세 | 구현 | 결과 |
|---|------|------|------|------|
| 38 | 지도 임베드 지연 로딩 | "`loading="lazy"`" | iframe이 아닌 SDK라 `loading` 속성 대신 IntersectionObserver(`rootMargin: 100% 0px`, `script.js:1436-1442`)로 한 화면 앞에서 불러온다(5-1 #9). 모션 없음은 5-1 #15 | PASS |

### 5차 직접 수정

- `style.css:689-690` `.venue__map`에 `-webkit-user-select: none;`(줄 끝 영어 주석 포함)와 `user-select: none;` 두 줄을 넣었다
  - 이유: 지도 안쪽은 inert라서 PC 브라우저에서 지도를 더블클릭하면(확대하려는 흔한 동작) 클릭이 바깥 상자로 간다. 상자에 글자가 없어서 Chrome이 가장 가까운 글자인 지도 버튼 "네이버"를 파란 블록으로 선택했다. 휴대폰 터치에서는 생기지 않는다
  - 확인: 같은 시험(`qa5/sel5.mjs`)에서 수정 뒤 마우스 더블클릭·끌기, 터치 탭·더블탭·길게 누르기 모두 선택 0. 지도 검사(`map5.mjs engine`)를 360/375/390/430/390 reduced에서 다시 돌려 각 33/33. 작업 트리 회귀 드라이버는 이 수정이 들어간 상태로 돌았다. static3 50/50, 한글 0건
  - `05_frontend-developer_summary.md` 12장 표에는 아직 이 두 줄이 없다

### 기존 WARNING 현황

- W5: **해소.** 커밋 `2312b3f`에서 `02_copy-writer_copy.md` `kakao_share.title`이 "인혁 ♡ 유민, 우리 결혼합니다"(285-286행)로 og:title과 같아졌고, placeholder 표(`GROOM_BANK`~`KAKAO_JS_KEY`)와 "교통편 3종은 사용자가 주지 않았고" 줄이 지워졌다
- W6: 그대로(`02_copy-writer_copy.md:160` "그리드 버튼 접근성 이름" 등)
- W7: 그대로. 위치만 `script.js:758-767`(가로 휠 450ms 잠금)로 바뀌었다

### 5차에서 나온 이슈와 수정 제안

- [x] `style.css:685-691` PC 더블클릭 글자 선택 → 직접 수정(위)
- 새로 남은 FAIL·WARNING은 없다

### 배포 후 확인 (이 환경에서 확인할 수 없는 것)

`127.0.0.1`은 카카오에 등록된 도메인이 아니라서 아래 셋은 실제 서비스 응답으로 확인하지 못했다.

1. **지도 SDK 인증**: `sdk.js`가 200을 주는지. 401(도메인 미등록)이나 403(카카오맵 사용 설정 꺼짐)이면 지도 상자가 숨고 장소 카드 아래에 지도 버튼이 바로 붙는다. 그렇게 보이면 카카오 디벨로퍼스에서 카카오맵 사용 설정과 Web 플랫폼 도메인 `https://ihbang.github.io`를 확인한다
2. **실제 지오코더 결과**: "서울 송파구 송파대로 155"가 한 점으로 잡히는지, 그 점이 예식장 건물 위인지. QA는 실제 타일에 보이는 "더컨벤션" 위치로 좌표를 추정해 그렸다. 이 좌표에서는 문정역 표시가 지도 위 끝에서 약 10~40px 아래에 걸렸고, 360폭에서는 역 이름이 위 가장자리에 붙고 8호선 표시가 조금 잘렸다. 실제 좌표가 더 남쪽이면 역이 빠질 수 있다. 그때는 `script.js:27` `MAP.LEVEL`을 5로 올리는 것을 검토한다
3. **휴대폰 실기**: iPhone Safari·카카오톡 인앱 브라우저에서 지도 위를 위아래로 쓸 때 페이지가 스크롤되는지, 지도를 길게 눌러도 이미지 저장 메뉴가 뜨지 않는지 본다. 실제 타일·로고·축척 모양은 `t1.kakaocdn.net`·`mts.kakaocdn.net`의 실제 파일로 확인했으므로 같은 모습일 것이다

### 참고 (판정 대상 아님)

- 지도 타일은 카카오 기본 지도 색(노란 큰길, 분홍 8호선, 주황·보라 장소 표시)이라 페이지 팔레트보다 채도가 높다. 카카오맵 JavaScript API에는 지도 색을 바꾸는 기능이 없다. 카드 테두리와 surface 면 안에 들어 있어 정보 블록으로 읽히므로 바꿀 필요는 없다고 본다
- 10초 시간 제한으로 늦게 실패하면, 그때 하객이 오시는 길을 보고 있을 경우 지도 상자(약 273px)가 사라지며 아래 버튼과 교통편이 위로 올라온다. 도메인 미등록·사용 설정 꺼짐 같은 흔한 실패는 한 화면 앞에서 바로 끝나서 보이지 않는다. 카카오 CDN이 멈춘 경우에만 생기므로 지금 동작(오케스트레이터 기본값)으로 충분하다
- 공유 SDK가 실패한 뒤 다시 누르면 SDK를 또 요청한다(두 번 실패하면 `kakao_js_sdk` 태그 2개). 커밋본부터 있던 동작이고, 매번 링크 복사로 대체되니 문제는 없다
- 카카오 로고 링크(`http://map.kakao.com/`)는 inert라서 눌리지 않는다. 바로 아래 "카카오맵" 버튼이 같은 역할을 한다

---

## 6차 QA (디자인 통일·갤러리 순서) — 2026-10-12

마지막 커밋(`9bc0a6a`) 뒤 작업 트리에 두 가지 변경이 있다. ① concept-director 감사 문서 `07_concept-director_design-audit.md`의 통일 규칙 R1~R9와 수정 목록 M1~M18을 사용자 결정 D1~D4(모두 (a))대로 반영했고, 오케스트레이터가 `.share__closing` 위 여백 16 → 20, `.share__buttons` gap 10 → 8을 더 맞췄다. ② 갤러리를 파일 번호순 01~15로 바꿨다. 결정 기록은 `00_user-input.md` 맨 아래 "디자인 통일", "갤러리 순서를 파일 번호순으로" 절이고, frontend 반영 내역은 `05_frontend-developer_summary.md` 13장이다. 코드 변경은 `index.html`(슬라이드 15줄 순서, `.venue__info`, 주석 1줄), `style.css`(M1~M18과 후속 2건), `script.js`(주석 1줄)뿐이다.

### 요약

- 전체 결과: **PASS** (FAIL 0)
- 6차 판정 67항목: PASS 62 / FAIL 0 / WARNING 5 (새 WARNING W8·W9·W10, 기존 W6 잔여)
- **디자인 통일 변경분은 FAIL 0이다.** 감사 문서 1장 현황 표의 항목을 `getComputedStyle`로 다시 뽑아 R1~R9와 대조했고, 같은 역할의 요소는 모두 같은 값이다. 규칙과 다른 값은 문서가 예외를 적지 않은 것(W9)과 입력 필드 모서리 16px이 만든 새 화면 결함 1건(W10)이다
- 직접 수정: 없음. 남은 것은 문서 문구와 디자인 판단이 필요한 항목이라 보고만 한다
- 기존 WARNING: **W6 부분 해소**(컨셉 시트·카피 시트 표는 고쳐졌고 모션 명세 3곳과 카피 시트 1줄이 남음), W7 그대로
- 검증 방법
  - 정적: `node --check script.js` 통과, `script.js`·`style.css` 한글 0건. 4차 `static3.py`의 순서 기대값만 새 순서로 바꿔 50/50 PASS(HEAD는 예전 기대값으로 50/50). `static_checks.py`는 4-3 #29 오탐의 줄 번호(931 → 937)만 바뀌었다. `qa6/gallery_static.py`로 슬라이드 15줄을 카피 시트 `gallery_alt` 표, 컨셉 시트 `photos.gallery.order`와 글자 단위로 대조했다. 대비는 `qa6/contrast6.py`(WCAG 2.x 식)
  - 브라우저: 로컬 서버 `127.0.0.1:8781`(작업 트리)과 `127.0.0.1:8782`(HEAD `9bc0a6a`를 `git archive`로 푼 사본), headless Chrome CDP(DPR 2, 모바일은 터치 에뮬레이션). 모든 실행에서 `*kakao*`, `*formspree*` 요청을 막았다
  - 통일 규칙 검사 `qa6/unify6.mjs`(새로 씀): 끝까지 스크롤해 reveal을 모두 발동시킨 뒤 섹션 배경·패딩, 텍스트 역할 14종(T1~T14), 화면에 보이는 모든 글자의 색, 면이나 테두리가 있는 모든 요소, 왼쪽 정렬 시작점, 버튼 폭·윤곽선, 쓰인 모서리 반지름 전체, 섹션 안 margin·padding·gap 전체와 블록 간격 36개를 뽑았다. 지도 자리는 감사 문서 0장처럼 `#venue-map`의 `hidden`을 풀어 빈 4:3 카드로 채워 쟀다. 실행: 작업 트리 360x780, 375x667, 375x548, 390x844, 430x932, 1280x900(마우스), 390x844 reduced / HEAD 360x780, 390x844, 1280x900(전후 스크린샷용)
  - frontend 검사 재현: `fe-unify/check.mjs`를 포트만 바꿔 `qa6/fe/`에서 motion 390, reduced 390, motion 360으로 다시 돌렸다. frontend 결과와 같다
  - 회귀: 5차 드라이버(`qa.mjs` 13개 시나리오 + `firstscreen`(390x664, 375x548, 390x844) + `widths 1280x900`, `account.mjs` motion·reduced × 4폭, `carousel-check.mjs`)를 HEAD와 작업 트리에 같은 조건으로 돌리고 `qa6/compare6.py`로 비교했다. `carousel-check.mjs`는 순서가 들어간 검사 4개(순서, 첫 요청 3장, 2번으로 갈 때 추가 요청, 4번 lightbox의 이웃 원본)를 `QA_ORDER`로 나눠 HEAD는 예전 순서, 작업 트리는 새 순서로 기대하게 했다
  - Chrome은 샌드박스 안에서 뜨지 않아 샌드박스를 끄고 실행했다. 끝난 뒤 두 서버와 Chrome을 종료했다(남은 Chrome 프로세스 0, 8781·8782 포트 닫힘). 스크립트·출력·스크린샷은 scratchpad `qa6/`에만 있고 저장소에는 넣지 않았다

### 6-1. 통일 규칙 준수 (감사 1장 현황 → 지금, `getComputedStyle`)

판정은 7개 실행(작업 트리) 모두 같은 값일 때 PASS로 적었다. 수치는 390 기준이고 폭마다 달라지는 값은 따로 적었다.

| # | 규칙 | 감사 1장 (커밋 `9bc0a6a`) | 지금 | 결과 |
|---|------|------|------|------|
| 1 | R1 섹션 배경 | guestbook만 surface 밴드 | hero만 면 `rgb(251, 246, 241)`, 나머지 9개 섹션은 배경 투명이라 `.page`의 background가 보인다. HEAD는 guestbook이 `rgb(243, 234, 227)` | PASS |
| 2 | R1 데스크톱 컬럼 경계 | 1280에서 guestbook 구간만 컬럼 안팎이 같은 surface | 1280에서 guestbook 구간 컬럼 안 background, 바깥 surface(body). 480px 컬럼 경계가 끊기지 않는다(`shots-cur-motion-1280x900/11-desktop-guestbook.png`, HEAD `shots-base-motion-1280x900/11-desktop-guestbook.png`) | PASS |
| 3 | R1 섹션 패딩 | | greeting `80 24 0`, couple `56 24 80`, gallery `80 16 80`, 나머지 `80 24 80`, share 아래 80 + safe-area. 예외 세 곳 말고 모두 80 | PASS |
| 4 | R1 보케 | | guestbook 위치에서 `__bokeh.stats().running` `[]`(7개 실행) | PASS |
| 5 | R2 그릇 | 장소 카드, 지도 카드, 계좌 카드 | 면이나 테두리가 있는 요소를 모두 뽑으면 카드는 계좌 `details.card` 2개와 지도 `#venue-map`(숨김을 풀면 surface, 1px line, 16)뿐이다. 그 밖은 사진 프레임 15개(surface 매트, 4), 입력 2개(`#FFFDFB`, field_border, 16), 버튼, 달력·교통편 구분선이다. `.venue__info`는 배경 투명, 테두리 0, 패딩 0, 가운데 정렬. `.venue__card` 0개 | PASS |
| 6 | R2·R8 오시는 길 순서 | 카드(이름·주소·복사) → 16 → 지도 → 16 → 버튼 | 장소명 → 4 → 주소 → 16 → 주소 복사 → 24 → 지도 카드 → 16 → 지도 버튼 → 32 → 교통편. 지도가 숨으면 주소 복사 → 16 → 지도 버튼. 지도 카드 360 312x234.5, 375 327x245.8, 390 342x257, 430 382x282, 1280 432x282. 컨셉 시트 `layout_mood` "오시는 길 순서"와 같다 | PASS |
| 7 | R3 왼쪽 시작점 | 교통편 28, 방명록 24, 계좌 45 | 교통편 라벨·값·맨 위 구분선, 방명록 라벨·필드가 모두 x 24(360/375/390/430), 1280에서 424. 계좌 라벨·계좌번호·예금주는 x 45(1280 445). 두 값 말고는 없다 | PASS |
| 8 | R4 T1 eyebrow | eyebrow 9개 + 달력 캡션이 같은 모양 | Cormorant 500 13px/16px accent 0.28em(3.64px) 글자는 섹션 머리 eyebrow 8개와 hero eyebrow 1개뿐이다. 섹션마다 1개(share는 0개, "Thank you"가 제목) | PASS |
| 9 | R4 T13 표 제목 | eyebrow와 같음 | `.cal__caption-en` Cormorant 500 16px/20px text, 0.16em(2.56px), lining. 모든 폭에서 한 줄 | PASS |
| 10 | R4 T4 섹션의 답 | 일시 400, 장소명 700 | `.calendar__when`, `.venue__name` 모두 Gowun Batang 400 17px/27.2px text. 360~1280에서 둘 다 한 줄 | PASS |
| 11 | R4 T5 본문 | 줄 높이 1.95 / 1.9 / 1.8, 문단 사이 1.95em / 1em | 본문 11개(인사말 3문단, couple 2줄, D-day 문구, notice, 계좌 안내 2문단, 방명록 안내, 맺음말) 모두 15px/29.25px. 문단 사이는 인사말·계좌 안내 모두 29.25px | PASS |
| 12 | R4 T6·R5 정보 값 | 주소만 muted, 1.6 | 주소와 교통 안내 3줄 Pretendard 400 14px/23.8px text, 계좌번호 500 15px/22.5px text. 화면에 보이는 muted 글자를 모두 뽑으면 hero 요일 줄·장소 줄, 달력 요일 6개, 갤러리 " / 15", 갤러리 안내, 예금주 줄 2개(접두어 포함), 방명록 맺음뿐이다. 라벨과 값에는 muted가 없다 | PASS |
| 13 | R5 T7 라벨 색·굵기 | 색 3가지, 굵기 3가지 | 9개(신랑·신부, 지하철·주차·내비게이션, 신랑측·신부측, 성함·남기실 말씀) 모두 Pretendard 600 14px `rgb(91, 106, 70)` | PASS |
| 14 | R4 T7 라벨 줄 높이 | | couple·교통편 22.4px(1.6), `.account__side` 21px(1.5, `style.css:762`), `.gb-label` 19.6px(1.4, `style.css:813`). 감사 R4 T7과 컨셉 시트 `typography.scale.label`은 1.6이다. 05 요약 13장에 적혀 있고 오케스트레이터가 그대로 두기로 했다. 모두 한 줄이라 글자 모양은 같다 | WARNING (W9) |
| 15 | R4 T8 보조 안내·값 | | 갤러리 안내·방명록 맺음 14px/22.4px muted, 예금주 줄 14px/21px muted(규칙이 정한 1.5), hero 장소 줄 14px/22px(hero 고정값) | PASS |
| 16 | R4 T12 숫자 | 갤러리 카운터만 lining | `.hero__date`, `.hero__time`, `.cal__caption-en`, `.dday__count` = `lining-nums`. `.g-counter`(안쪽 span 2개 포함)와 `.lb-counter`(안쪽 `.lb-counter__text` 포함) = `lining-nums tabular-nums`, lightbox를 연 상태에서도 같다. 375x548 압축 규칙은 `font-size`·`line-height`만 바꿔서 hero 날짜(28px/34px)도 lining이 유지된다. 확대 캡처에서 "2027 · 01 · 03"의 01이 더는 "oI"로 보이지 않고 "SUNDAY · 3 PM"의 3이 기준선 위에 선다(`00b-hero-date-x3.png` 전후). Pretendard 데이터 숫자(달력, 계좌, 주소)는 `normal` | PASS |
| 17 | R6 버튼 폭 | 주소 복사 158px(내용 폭) | 단독 버튼은 담긴 영역 폭과 같다: 주소 복사·남기기·카카오톡·링크 복사 342(360 312, 375 327, 430 382, 1280 432), 계좌 복사 300 = 카드 안쪽 폭(360 270, 430 340). 지도 버튼은 2분할 167 x 2. 내용 폭 버튼 0개. 높이 모두 44 | PASS |
| 18 | R6 윤곽선 | pill accent, 원형 primary | secondary pill 6개 1px `rgb(142, 85, 88)`. 갤러리 이전·다음 `::before` 1px accent(inset 2, 보이는 원 40, 터치 44x44), BGM 면 1px accent. 아이콘 stroke `#8E5558`. 비활성 opacity 0.3. primary는 남기기·카카오톡 2개 | PASS |
| 19 | R7 모서리 | 16 / 15 / 999 / 50% / 10 / 4 | 쓰인 반지름 전체: 16(계좌 카드 2, 지도 카드, 입력 2), 15(계좌 summary), 999(pill 버튼, 건너뛰기 링크, 토스트), 50%(원형 버튼, BGM, 달력 예식일 원, lightbox 버튼), 4(사진 프레임). 10px 없음 | PASS |
| 20 | R8 관계별 간격 | 36 / 32 / 28 / 20 / 18 / 14가 섞임 | 36개 관계가 모두 R8 표 값이다(아래 표). 7개 실행에서 같다 | PASS |
| 21 | R8 단계 밖 값 | | "8, 12, 16, 20, 24, 32, 40, 56, 80만 쓴다"는 문구 밖의 값이 남아 있다(아래 목록). 모두 감사 문서가 정했거나 고치지 않기로 한 값이고 화면 리듬을 깨지 않는다 | WARNING (W9) |
| 22 | R7 입력 필드 모서리의 부작용 | 10px | 방명록 textarea의 크기 조절 손잡이(`resize: vertical`, `style.css:836`)가 16px 곡선 테두리 위에 겹쳐 그려진다. 10px일 때는 테두리 안쪽에 있었다(`corner/textarea-corner-{cur,base}-1280.png`, 6배 확대). 데스크톱 Chrome과 모바일 에뮬레이션에서 같다. 휴대폰 실기에서 손잡이가 그려지는지는 이 환경에서 확인하지 못했다 | WARNING (W10) |

R8 관계별 실측(390, 다른 폭도 같다):

| 관계 | 값 | 관계 | 값 |
|---|---|---|---|
| 섹션 머리 → 콘텐츠(couple, calendar, gallery, venue, notice, account, guestbook) | 40 | greeting 본문 → sprig | 56 |
| lights → eyebrow, gallery sprig → eyebrow | 24 / 24 | 일시 → 달력, 달력 → D-day | 32 / 32 |
| 지도 버튼 → 교통편 | 32 | share sprig → 모노그램 → Thank you, 맺음말 → 버튼 | 32 / 32 / 32 |
| 제목 → 제목 밑 문장(갤러리, 계좌, 방명록, share) | 20 | eyebrow → 제목 | 10 |
| 주소 → 주소 복사, 지도 → 지도 버튼, 필드 → 필드, 필드 → 남기기, 교통편 행 안쪽 위 | 16 | couple 행 → 행 | 16 |
| 계좌 카드 → 카드, 사진 창 → 버튼 줄 | 12 / 12 | 라벨 → 필드, share 버튼 → 버튼, D-day 문구 → 카운터 | 8 / 8 / 8 |
| 주소 복사 → 지도 카드 | 24 | 장소명 → 주소, 교통편 라벨 → 값 | 4 / 4 |

R8 단계 밖 값(섹션 안 margin·padding·gap 전체를 뽑아 단계 값과 hero를 뺀 나머지):

| 위치 | 값 | 성격 |
|---|---|---|
| `style.css:679` `.venue__address` margin-top | 4 | 장소명 → 주소. M5가 정한 값 |
| `style.css:727` `.venue__route dd` margin-top | 4 | 라벨 → 값. 감사 전부터 있던 값 |
| `style.css:788` `.account__holder` margin-top | 2 | 계좌번호 → 예금주 |
| `style.css:207` `.btn` 좌우 padding | 22 | 버튼 안쪽 |
| `style.css:818` `.gb-input` 좌우 padding | 14 | 입력 안쪽(위아래는 12) |
| `.g-viewport` padding-block | 4 | 현재 슬라이드 포커스 링 자리(모션 명세 4-1-2). 그래서 사진 아래 끝 → 버튼 줄은 화면에서 16이다 |
| `.btn` gap 6, 복사 라벨 gap 4, 모노그램 gap 5, `.couple__name` margin-left 2 | 2~6 | 아이콘·글자 사이 |

### 6-2. 대비 (바뀐 색 조합, WCAG 2.x 식)

| # | 전경 / 배경 | 쓰는 곳 | 기준 | 대비 | 결과 |
|---|------|------|------|------|------|
| 23 | sage_deep `#5B6A46` / background | 신랑·신부, 지하철·주차·내비게이션, 성함·남기실 말씀(Pretendard 600 14px) | 텍스트 4.5 | 5.44 | PASS |
| 24 | sage_deep / surface | 신랑측·신부측(계좌 카드 안) | 텍스트 4.5 | 4.92 | PASS |
| 25 | text `#3B2D2A` / background | 주소(muted 5.17에서 바뀜), 교통 안내, 달력 표 제목 | 텍스트 4.5 | 12.26 | PASS |
| 26 | text / 보케 상한 섞인 바탕 glow 0.28 `#F7EAD7`, primary 0.18 `#F2E7E2` | 달력 표 제목(보케 구간) | 텍스트 4.5 | 11.10 / 10.85 | PASS |
| 27 | accent `#8E5558` / background, surface, hover 면(bg + accent 6%) | pill 버튼 글자 | 텍스트 4.5 | 5.45 / 4.93 / 5.02 | PASS |
| 28 | accent / background, surface | pill 버튼 윤곽선 | 비텍스트 3 | 5.45 / 4.93 | PASS |
| 29 | accent / background, hover 면 | 갤러리 이전·다음 원 윤곽선(primary 2.17에서 바뀜), chevron | 비텍스트 3 | 5.45 / 5.02 | PASS |
| 30 | accent / BGM 면(background 0.92)이 흰 바탕 위 `#FBF7F2`, 검은 사진 위 `#E7E2DE` | BGM 원 윤곽선, 음표 | 비텍스트 3 | 5.48 / 4.55 | PASS |
| 31 | on_accent `#FFFCF8` / accent | 남기기, 카카오톡 | 텍스트 4.5 | 5.72 | PASS |
| 32 | muted / background, text / background | 방명록 맺음·안내문(밴드가 없어져 surface → background) | 텍스트 4.5 | 5.17 / 12.26 | PASS |
| 33 | field_border `#958379` / background, 필드 `#FFFDFB` | 입력 경계(바깥이 surface → background) | 비텍스트 3 | 3.37 / 3.57 | PASS |

참고: 끝에서 비활성인 갤러리 버튼(opacity 0.3)의 윤곽선은 background 위 1.52:1이다(예전 primary 윤곽선일 때 1.24). 비활성 컨트롤은 WCAG 1.4.11 대상이 아니다. 지도 카드 테두리 line은 1.32로 장식선이다(카드 안 지도 자체가 내용).

### 6-3. 문서 정합성

| # | 문서 | 확인한 것 | 결과 |
|---|------|------|------|
| 34 | 컨셉 시트 갤러리 | `photos.gallery.order` pos n = 파일 n(15/15), 가로 02·15, `layout` 캐러셀, 본문 "순서: 파일 번호순 01 → 15", `defaults_applied`에서 그리드 항목 삭제. 3차에 적은 `:104` 그리드와 `object_position`은 없어졌다 | PASS |
| 35 | 컨셉 시트 면·그릇·글자 | `palette` 주석(surface는 카드·매트·컬럼 바깥, 섹션 밴드 금지), `layout_mood`(면·그릇·오시는 길 순서·정렬·모서리·버튼·여백), `hero_layout` BGM 윤곽선 accent, 보케 안내의 guestbook, `typography.scale`(key_line, info, label 색·굵기, table_title, figures)이 6-1 실측과 같다. 다른 곳은 label 줄 높이 1.6 하나(6-1 #14, W9) | PASS |
| 36 | 카피 시트 | `gallery_alt` 표 # = 파일 번호(01~15), 15행의 alt가 HTML img alt, 버튼 이름 "사진 n / 15 크게 보기: {alt}", lightbox 슬라이드 alt와 글자 단위로 같다. `directions` 장소 2줄 = `.venue__name`, `#venue-address`. 남은 것: `02_copy-writer_copy.md:160` "그리드 버튼 접근성 이름"(W6 잔여, 낱말만) | PASS |
| 37 | 모션 명세 갱신분 | 4-1 머리말(`:430`), 4-1-1(`:447`), 이전/다음 버튼 행(`:462`), 4-1-11 CSS(`:702`), BGM 면(`:962`)이 새 순서·accent 윤곽선과 같다 | PASS |
| 38 | 모션 명세 남은 예전 순서 | `04_motion-designer_motion-spec.md:557` 예산 "02, 01, 08", `:566-576` 4-1-8 마크업 예시의 첫 슬라이드가 02 가로 + "사진 1 / 15", `:879` QA 확인값 "02, 01, 08만 요청". 실제 첫 요청은 01, thumb/02, 03이다(6-4 #43) | WARNING (W6 잔여) |
| 39 | 모션 명세 남은 예전 면·그릇 | `:55` "surface(guestbook, 카드)", `:336` venue reveal 그룹 "② 정보 카드 + 주소 복사", `:337` "surface 위 구간이라 보케 없음"(venue·account·guestbook 모두 이제 background이고, 보케가 없는 이유는 보케 구간이 아니어서다) | WARNING (W8) |
| 40 | 05 요약 | 2장 섹션 표(venue: surface 카드는 지도만, guestbook: background), 갤러리 순서 문단, 4장 순서 행, 6장 실패 안내, 12장 배포 후 확인 문구, 13장 표·수치가 실측과 같다(13장의 계산 스타일 값, 첫 화면 y, 갤러리 순서·lightbox 왕복을 같은 방법으로 재현). 12장 본문(`:360, 386, 394`)의 "장소 카드"는 그날 기록이라 그대로 둬도 된다. `:9`의 줄 수(454/1,099/1,442)는 지금 458/1,160/1,525다(참고) | PASS |

**W6 판정: 부분 해소.** 3차에 적은 다섯 곳 중 카피 시트 `gallery_alt` 표, 컨셉 시트 그리드·순서·`object_position`, 모션 명세 `:430`·`:447`이 고쳐졌다. 모션 명세 `:557`, `:566-576`, `:879`와 카피 시트 `:160`의 "그리드" 낱말이 남았다. 지금 페이지와 어긋나는 것은 모션 명세 세 곳의 순서다.

### 6-4. 갤러리 (순서·번호·alt, 미리 받기, 끝까지 넘기기, lightbox 왕복, 가로 사진 매트)

| # | 항목 | 측정 | 결과 |
|---|------|------|------|
| 41 | 순서·번호·alt | 정적: n번째 슬라이드의 `data-full`·`src`·`srcset` 두 항목이 모두 `n.jpg`, 버튼 이름 "사진 n / 15 크게 보기: {카피 시트 alt}", img alt = 카피 시트 문장, `g-slide--landscape`는 2번·15번만, `data-w`·`data-h` = img `width`·`height` = 실제 픽셀(14번 1067x1600, 02 1600x1194, 15 1600x1066, thumb 804w·900w 포함). 실행(360/390, motion·reduced): 불일치 0건, lightbox 슬라이드 15장 alt 순서 같음 | PASS |
| 42 | 화면 넘김 순서 | 다음 버튼 14번에 02 → 15 순서대로 한 장씩. 카운터와 현재 파일 번호가 늘 같다 | PASS |
| 43 | 첫 화면 미리 받기 | hero에 머무는 동안 갤러리 사진 요청 0건. 갤러리 가까이에서 `01.jpg`, `thumb/02.jpg`, `03.jpg` 3건만(390x664, DPR 2). 처음 `loading="eager"`는 1·2·3번. 2번으로 넘기면 `04.jpg`가 더해진다. HEAD는 같은 검사에서 01, thumb/02, 08 | PASS |
| 44 | 끝까지 넘기기 | "15 / 15"에서 다음 버튼 `aria-disabled="true"`, opacity 0.3, 한 번 더 눌러도 그대로, 포커스는 다음 버튼에 남는다. 15에서 왼쪽으로 쓸어도 그대로(끝에서 돌아가지 않음). 끝까지 넘긴 뒤 15장 모두 eager. 이전 버튼으로 1까지 돌아오면 이전 버튼 비활성 | PASS |
| 45 | lightbox 왕복 | ① 15번에서 열기 "15 / 15"(15.jpg alt) → ← 두 번 "13 / 15"(13.jpg alt) → Esc → 캐러셀 "13 / 15", 포커스 "사진 13 / 15 크게 보기…" ② 1번에서 열기 → lightbox 다음 버튼 두 번 "3 / 15"(03.jpg alt) → 닫기 버튼 → 캐러셀 "3 / 15", `html.lb-open` 해제 ③ 4번에서 열기(04.jpg, 이웃 03·05 원본) → → 두 번 + 쓸기 한 번 "7 / 15" → 닫기 → 캐러셀 "7 / 15", 포커스 7번 버튼. ①②는 motion 360·390과 reduced 390, ③은 `carousel-check`(390x664) | PASS |
| 46 | 가로 사진 02·15 매트 | 두 장 모두 `object-fit: contain`, 프레임 면 surface `rgb(243, 234, 227)`, 모서리 4, 사진 로드 완료·opacity 1, 좌우 매트 0. 위아래 매트(02 / 15): 360 118 / 130, 375 123.3 / 136.3, 390 128.6 / 142.5, 430 144 / 159.5, 1280 163 / 180. 390 값이 모션 명세 4-1-1의 129 / 143과 같다. 세로 13장은 `cover`(`12b-gallery-02-landscape.png`, `12c-gallery-15-landscape.png`) | PASS |
| 47 | 캐러셀 종합 | `carousel-check.mjs` 작업 트리 110/110 PASS (HEAD는 예전 순서 기대값으로 110/110) | PASS |

### 6-5. 회귀 (HEAD `9bc0a6a` ↔ 작업 트리, 같은 드라이버)

섹션 높이는 의도한 만큼만 바뀌었다(390, HEAD → 작업 트리): couple 314 → 318(행 간격 16, 줄 높이 1.95), calendar 840 → 842(표 제목 20px 줄, 블록 32·장식 24, D-day 문구 1.95), venue 850 → 761(카드 패딩·테두리 제거, 교통편 32·들여쓰기 0), account 565 → 580(문단 사이 1em → 1.95em), guestbook 744 → 738(폼 gap 18 → 16 세 곳), share 631 → 629. 360·375는 venue 850 → 785(주차 안내가 세 줄), 430은 826 → 761.

| # | 항목 | 측정 | 결과 |
|---|------|------|------|
| 48 | hero 보케 | 구간별 동시 최대 hero 8 / calendar 6 / share 6(상한 8), 합성 최대 glow 0.279 / 0.266 / 0.269(상한 0.28), primary 0.178 / 0.151 / 0.168(상한 0.18), 제외 영역 alpha 0. greeting 위치에서 hero만, gallery·venue·notice·account·guestbook에서 `running []`, 화면 밖 전구 paused, guestbook에서 무한 애니메이션 0. `zonecap`의 차이는 무작위 보유 수(상한 안)뿐 | PASS |
| 49 | 첫 화면 | `firstscreen` 390x664 / 375x548 / 390x844에서 날짜·사진·이름·일시·장소가 모두 화면 안이고 HEAD와 같은 좌표다(375x548 장소 아래 끝 501, 스크롤 큐 숨김). 4폭에서 BGM 토글이 eyebrow·날짜와 겹치지 않는다 | PASS |
| 50 | couple 정렬 | `copyedit2` 4폭에서 행·줄·"아들/딸" 칸·이름의 left/right/width가 HEAD와 같다. 다른 것은 세로 위치와 줄 상자 개수(3 → 2, 측정 스크립트가 반올림한 top 개수. 줄 높이 1.95에서 "아들" 칸과 이름의 top이 같아졌다. 화면은 두 행 모두 한 줄 그대로) | PASS |
| 51 | notice | `reducednotice`와 `copyedit2`의 notice 항목(2줄, 간격, reduced 상태, notice에서 보케 정지)이 HEAD와 같다 | PASS |
| 52 | 오시는 길 지도 자리 | 6-1 #6. 카카오 요청을 막은 회귀 실행에서는 지도가 실패 경로로 숨고 주소 복사 → 지도 버튼 16 | PASS |
| 53 | 계좌 접기·복사 토스트 | `account` motion·reduced × 4폭: 실제 클립보드 계좌번호(`110-335-546640`, `298702-04-213005`), 접기·키보드·접근성·토스트 결과가 HEAD와 같다. 다른 것은 페이드 샘플 ±1ms와 BGM 토글이 화살표를 덮는 면적 비율 ±2%p(위 섹션 높이가 바뀐 영향, 누름 판정은 같다). 작업 트리 motion 첫 실행은 Chrome이 응답하지 않아 400초 제한에 걸렸고, 같은 명령을 다시 돌려 1분 47초에 정상으로 끝났다 | PASS |
| 54 | D-day | `dday` 고정 시각 6개 결과가 HEAD와 같다. 오늘(2026-10-12) "D - 83 / 인혁 · 유민의 결혼식까지 83일 남았습니다." | PASS |
| 55 | BGM | `bgmnet` 같음. `interact`: 탭 전 음원 요청 0(`preload="none"`, autoplay 없음), 탭 뒤 재생·volume 0.60·링, 끄기, 음원 오류 복구 문구. reduced에서 링 0.8 정지. 윤곽선만 accent로 바뀌었다 | PASS |
| 56 | 방명록 검증 | `interact`: 빈 성함 → "성함을 적어 주세요."·`aria-invalid`·포커스 이동, 빈 말씀 → "남기실 말씀을 적어 주세요.", 501 응답과 전송 실패 → 실패 문구·입력 유지·버튼 복구. HEAD와 같다. 실제 Formspree 전송은 0건 | PASS |
| 57 | 카카오 공유 폴백 | SDK 요청을 막으면 클립보드 = og:url `https://ihbang.github.io/wedding-letter/`, 안내 "카카오톡 공유를 열 수 없어 링크를 복사했습니다. 대화방에 붙여 넣어 주세요.". 링크 복사 "청첩장 링크를 복사했습니다." HEAD와 같다 | PASS |
| 58 | 주소 복사 | 실제 클립보드 "서울 송파구 송파대로 155", execCommand 폴백, 둘 다 실패하면 주소 선택 + 실패 라벨. 전체 폭이 된 버튼에서도 라벨 전환·토스트가 같다 | PASS |
| 59 | 가로 스크롤 | 360/375/390/430/1280에서 `scrollWidth` = 화면 폭(계좌 펼침·갤러리 끝·상호작용 뒤에도). 화면 밖 요소 0, 14px 미만 한글 0 | PASS |
| 60 | 콘솔 오류 | 페이지 코드의 오류·예외 0건. 회귀 드라이버의 콘솔 줄이 HEAD와 완전히 같다(QA가 일부러 넣은 501·404, QA 픽셀 측정 때문인 Canvas2D 경고). `unify6`·frontend 검사 실행 10회도 콘솔 0건 | PASS |
| 61 | heading·접근성 트리 | h1 1개 + h2 9개, main 1 + region 9, 이름 없는 컨트롤 0, alt 없는 img 0, 장식 svg·canvas 노출 0, `lang="ko"`, viewport 메타 그대로. HEAD와 같다 | PASS |
| 62 | 숨은 reveal | 7개 `unify6` 실행과 4폭 `widths`에서 끝까지 스크롤한 뒤 0 / 25, 안 그려진 디바이더 0 | PASS |
| 63 | reduced-motion | 로드 직후·스크롤 뒤 숨은 reveal 0, 실행 중 애니메이션 0, 보케는 hero 정지 점만(최대 alpha 0.255), calendar·share 캔버스 숨김, 전구 1, BGM 링 정지. 런타임 전환 결과는 보케 무작위 값 말고 HEAD와 같다 | PASS |
| 64 | JS 비활성 | `nojs`가 HEAD와 같다(reveal 보임, D-day 숨김, 지도 상자 없음, notice·couple·달력 캡션·주소 글자 그대로) | PASS |
| 65 | lightbox | `lightbox`·`lbkeys`(핀치 3배 제한, 더블탭, 팬 제한, 키보드, 포커스 순환, 스크롤 잠금, 뒤로가기, 끌어 닫기) 결과가 같다. 5번째 사진이 09 → 05로 바뀐 것(순서 변경)만 다르다 | PASS |
| 66 | 외부 요청 | 글꼴 하위 집합만 바뀌었다: Pretendard SemiBold 82번이 늘고 Pretendard Medium 82번과 Gowun Batang 112번이 빠졌다(라벨 500 → 600, 장소명 700 → 400으로 쓰는 글자 묶음이 바뀐 결과). 모두 https, 새 도메인 없음 | PASS |
| 67 | 코드 검사 | `node --check script.js` 통과, `script.js`·`style.css` 한글 0건, static3 50/50, static_checks는 오탐 줄 번호만 바뀜 | PASS |

### 6차 직접 수정

없음. 페이지 코드에서 고칠 결함이 나오지 않았고, W9·W10은 규칙 문구나 디자인 판단이 필요하다.

### 기존 WARNING 현황

- W6: **부분 해소**(6-3). 남은 곳: `04_motion-designer_motion-spec.md:557, 566-576, 879`, `02_copy-writer_copy.md:160`
- W7: 그대로. 위치 `script.js:755-767`(가로 휠 450ms 잠금, `GAL.WHEEL_LOCK` `:24`)

### 6차에서 나온 이슈와 수정 제안

- [ ] **W6 잔여 (문서, 페이지 영향 없음)** → motion-designer가 아래처럼 고친다
  - `04_motion-designer_motion-spec.md:557` "현재 + 이웃 + 미리 받기 = 02, 01, 08" → "= 01, 02, 03"
  - `:566-576` 4-1-8 예시의 첫 슬라이드를 01 세로(`data-full="images/photos/01.jpg" data-w="1066" data-h="1600"`, `g-slide--landscape` 없음, srcset `thumb/01.jpg 600w, 01.jpg 1066w`)로 바꾸고, 주석 "14 more slides in concept order"는 "in file-number order (02 and 15 carry --landscape)"로
  - `:879` "갤러리 근처에서 02, 01, 08만 요청" → "01, 02(썸네일), 03만 요청"
  - `02_copy-writer_copy.md:160` "그리드 버튼 접근성 이름" → "슬라이드 버튼 접근성 이름"(카피 시트는 사용자가 직접 고치는 파일이라 QA가 손대지 않았다)
- [ ] **W8 (문서, 페이지 영향 없음) 모션 명세의 예전 면·그릇 표현** → motion-designer가 고친다
  - `04_motion-designer_motion-spec.md:55` "surface(guestbook, 카드)" → "surface(카드, 사진 매트)"
  - `:336` venue 그룹 "② 정보 카드 + 주소 복사" → "② 장소명·주소 + 주소 복사 + 지도 + 지도 버튼"(지금 `.venue__main` 한 덩어리) "③ 교통편"
  - `:337` "surface 위 구간이라 보케 없음" → "보케 구간이 아니라 보케 없음"
- [ ] **W9 (규칙 문구 ↔ 구현) 예외가 문서에 없다** → concept-director가 둘 중 하나를 고른다
  - 라벨 줄 높이: 컨셉 시트 `typography.scale.label`과 감사 R4 T7은 1.6인데 `style.css:762` `.account__side` 1.5, `:813` `.gb-label` 1.4다. ⓐ 문서에 "한 줄 라벨이라 줄 높이는 자리에 따라 1.4~1.6"을 적거나 ⓑ 두 줄을 `/1.6`으로 바꾼다. ⓑ에서 `.account__side`는 summary가 높이 56px로 가운데 정렬이라 화면이 그대로이고, `.gb-label`은 줄 상자가 19.6 → 22.4px가 되어 라벨 글자가 1.4px 내려가고 아래 필드가 2.8px씩 내려간다. 참고로 05 요약 마지막 줄의 "couple 행의 세로 정렬에 영향" 걱정은 해당하지 않는다. `.couple__role`은 이미 1.6이다
  - R8 "8 … 80만 쓴다": 6-1의 단계 밖 값 표(붙은 두 줄 4·2, 버튼·입력 안쪽 22·14, 포커스 링 자리 4, 아이콘 간격 2~6)를 예외로 한 줄 적는다. 코드는 바꾸지 않아도 된다
- [ ] **W10 (화면, 데스크톱에서 확인) `style.css:815-836` 방명록 textarea 손잡이가 16px 곡선 테두리 위에 겹친다** → concept-director와 frontend가 정한다. 선택지: ⓐ `.gb-textarea { resize: none; }`(크기 조절을 없앤다. 500자 제한이라 안쪽 스크롤로 충분하다) ⓑ R7의 예외로 textarea 오른쪽 아래 모서리만 작게(예: `border-bottom-right-radius: 10px`) ⓒ 그대로 둔다(데스크톱 마우스 사용자만 보는 작은 흠). QA 추천은 ⓐ다. 바꾸면 QA가 같은 캡처(`corner6.mjs`)로 다시 본다

### 참고 (판정 대상 아님)

- 사진 창 → 버튼 줄은 R8 표의 12지만, 창 안쪽 위아래 4px(포커스 링 자리) 때문에 사진 아래 끝 → 버튼 원은 화면에서 16이다. 감사 전과 같고 모션 명세 4-1-2가 "프레임 아래 12px(뷰포트 패딩 포함 16px)"로 적었다
- 360·375에서 주차 안내 둘째 줄은 "…연계 주차장으로 / 안내해 드립니다."로 끊긴다(`text-wrap: pretty`, 한 어절만 떨어지지 않음). 390·430·1280은 한 줄이다
- `05_frontend-developer_summary.md:9`의 파일 줄 수는 캐러셀 반영 때 값이다

### 전후 비교 스크린샷 (scratchpad, 저장소에 넣지 않음)

`/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/qa6/` 아래. `shots-base-*`는 HEAD `9bc0a6a`, `shots-cur-*`는 작업 트리다.

| 대상 | 전 (HEAD) | 후 (작업 트리) |
|---|---|---|
| 오시는 길(지도 자리 표시) | `shots-base-motion-390x844/06b-venue-map-placeholder.png` | `shots-cur-motion-390x844/06b-venue-map-placeholder.png` (360: `shots-*-motion-360x780/06b-…`) |
| 방명록(계좌에서 이어지는 구간) | `shots-base-motion-390x844/08c-account-to-guestbook.png` | `shots-cur-motion-390x844/08c-account-to-guestbook.png` |
| 방명록 데스크톱 컬럼 경계 | `shots-base-motion-1280x900/11-desktop-guestbook.png` | `shots-cur-motion-1280x900/11-desktop-guestbook.png` |
| hero 날짜(3배 확대) | `shots-base-motion-390x844/00b-hero-date-x3.png` | `shots-cur-motion-390x844/00b-hero-date-x3.png` (첫 화면 전체 `00-first-screen.png`) |
| 계좌(펼침) | `shots-base-motion-390x844/08b-account-expanded.png` | `shots-cur-motion-390x844/08b-account-expanded.png` (접힘 `08-account.png`) |
| 그 밖 | 달력 `04-calendar.png`, couple `03-couple.png`, share `10-share.png`, 갤러리 `12a~12d`, 전체 `full.png` | 같은 이름. 375x548 첫 화면 `shots-cur-motion-375x548/00-first-screen.png`, reduced `shots-cur-reduced-390x844/` |
| textarea 모서리(W10, 6배) | `corner/textarea-corner-base-1280.png` | `corner/textarea-corner-cur-1280.png` |
