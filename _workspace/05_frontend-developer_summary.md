# 프론트엔드 구현 요약: "Petal & Glow"

- 작성일: 2026-10-10
- 갱신: 2026-10-10, 사용자 카피 수정 반영(9장). 바뀐 부분만 고쳤다.
- 갱신: 2026-10-11, 갤러리를 3x5 그리드에서 한 장씩 넘기는 캐러셀로 바꾸고 사진 1·2번 순서를 맞바꿨다(10장). 갤러리와 lightbox 연결 부분만 고쳤다.
- 갱신: 2026-10-12, 오시는 길에 카카오맵 고정 지도를 넣고 카카오 키를 `<head>` 메타 태그 한 곳으로 옮겼다(12장). venue 섹션과 카카오 공유의 키 읽는 줄만 고쳤다.
- 갱신: 2026-10-12, 디자인 감사(`07_concept-director_design-audit.md`) D1~D4 (a)와 수정 목록 M1~M18을 반영하고, 갤러리를 파일 번호 순서(01~15)로 바꿨다(13장). 2장 표의 배경·그릇 칸과 갤러리 순서 문단을 함께 고쳤다.
- 갱신: 2026-10-12, 마지막 share 섹션을 공유하기(`#share`)와 맺음(`#closing`)으로 나누고 보케 구간을 맺음으로 옮겼다(14장). 2장 표의 10·11행을 고쳤다.
- 갱신: 2026-10-13, 보케를 B안 "작은 전구 불빛"으로 바꿨다(15장). 3장 표의 보케 행, 4장의 보케 행, 7장의 보케·reduced-motion 행을 고쳤다.
- 갱신: 2026-10-13, 방명록을 Formspree 전송 폼에서 Apps Script 웹 앱에 저장하고 페이지에 공개 목록을 보여 주는 방명록으로 바꿨다(16장). 1장 외부 리소스, 2장 guestbook 행, 3장 4-8 행, 6장 방명록 행, 8장 배포 가이드 1·5번을 고쳤다.
- 갱신: 2026-10-17, 사진 보호(사진 저장 메뉴 차단 + 페이지·lightbox의 모든 확대 제거)를 반영했다(18장). 2장 lightbox 행, 3장 4-1·4-2 행과 4-10 행(신설), Nice-to-have의 키·휠 줌 행, 4장의 줌 관련 행과 `showModal` 폴백 행, 7장 라이트박스 행 주석, 8장 배포 가이드 5번을 고쳤다.
- 갱신: 2026-10-17, 갤러리 사진을 이전 파일 번호 05 03 04 01 06~15 02 순서로 재배치하고 파일 이름을 새 순서대로 바꿨다(19장). 2장 표 아래 갤러리 문단, 3장 Must 4-1 행, 4장 갤러리 순서 행을 고쳤다.
- 입력: `00_user-input.md`, `01_concept-director_concept-sheet.md`, `02_copy-writer_copy.md`, `03_image-artist_manifest.md`, `04_motion-designer_motion-spec.md`
- 산출물: `index.html`(454줄), `style.css`(1,099줄), `script.js`(1,442줄). 줄 수와 3장의 `파일:줄`은 캐러셀 반영 후 기준이다. 어제의 "Warm Paper & Ink" 파일을 전부 새로 썼다.
- 이전 컨셉 자산(`jo--*`, `op1789048062-*`, `divider-hairline.svg`, `og-thumbnail.jpg`, `monogram-iy.svg`, `floral-*`, `gallery-placeholder-*`, `hero-illustration.png`)은 세 파일 어디에서도 참조하지 않는다(grep 0건). 파일 자체는 지우지 않았다.

## 1. 외부 리소스

| 리소스 | 용도 | 로드 시점 |
|---|---|---|
| Google Fonts 1회 요청: Gowun Batang 400/700, Cormorant Garamond 300/400/500 + 400 italic, Allura 400 (`display=swap`) | 본문·제목, 영문 날짜·eyebrow, '&'·Thank you | `<head>` |
| Pretendard v1.3.9 dynamic-subset (jsDelivr) | 주소·계좌·버튼·폼 | `<head>` |
| Kakao JS SDK 2.7.2 (`t1.kakaocdn.net`) | 카카오톡 공유 | 키가 설정된 경우에만, 버튼을 처음 누를 때 동적 로드 |
| 카카오맵 JavaScript API (`dapi.kakao.com/v2/maps/sdk.js?autoload=false&libraries=services`, 이어서 `t1.kakaocdn.net/mapjsapi`의 본체·services) | 오시는 길 고정 지도 + 주소 검색 | 지도 상자가 한 화면 거리 안에 들어올 때 1회 동적 로드(2026-10-12) |
| 방명록 Apps Script 웹 앱 (`script.google.com/macros/s/…/exec`, 응답은 `script.googleusercontent.com`으로 302) | 방명록 목록·새 글·본인 삭제(`fetch`, 스크립트 로드 없음) | 방명록 섹션이 한 화면 거리 안에 들어올 때 목록 첫 페이지 1회. 그 뒤로는 하객이 더보기·남기기·삭제를 누를 때만(2026-10-13, 16장). **2026-10-14 17장: 처음에 `limit=50`으로 목록 전체를 받고, 그 뒤로는 남기기·삭제와 다시 불러오기 때만** |

애니메이션 라이브러리와 jQuery는 쓰지 않았다. 모션은 Canvas 2D, CSS, rAF로 구현했다.

## 2. 섹션 구조

| # | 섹션 (요소) | 배경 | reveal 그룹 | 장식·모션 |
|---|---|---|---|---|
| 1 | hero (`header.hero.bokeh-zone[data-bokeh=hero]`) | background | 위 텍스트 / 사진(opacity만) / 아래 텍스트. 로드 시퀀스로 등장 | 보케 캔버스, 스크롤 큐 |
| 2 | greeting (`#greeting`) | background | ① 헤더 ② 인사말 | 섹션 끝 sprig-divider ① (stroke-draw) |
| 3 | couple-intro (`#couple`) | background | ① 헤더 ② 신랑·신부 두 줄("아들"/"딸"은 같은 폭 칸 `.couple__rel`) | 없음 |
| 4 | calendar (`#calendar[data-bokeh=calendar]`) | background | ① string-lights + 헤더 ② 한글 일시 + 달력(caption "JANUARY 2027") ③ D-day | 보케, 전구 점등·호흡 |
| 5 | gallery (`#gallery`) | background | ① 헤더 + 안내 ② 캐러셀 전체(`.g-carousel`: 사진 창 + 이전·카운터·다음 줄). 슬라이드 개별 등장 없음 | 헤더 위 sprig-divider ②, 캐러셀 트랙 전환(350ms) |
| 6 | venue (`#venue`) | background. surface 카드는 지도(`#venue-map`)만 | ① 헤더 ② 장소명·주소 맨 텍스트(`.venue__info`, 가운데) + 전체 폭 주소 복사 + 카카오맵 고정 지도 카드(2026-10-12) + 지도 버튼 2분할 ③ 교통편 구분선 목록(왼쪽, 들여쓰기 0) | 없음 (지도 위 모션 없음) |
| 7 | notice (`#notice`) | background | ① 헤더(NOTICE / 축하 화환 안내) ② 본문 2행 | 없음 (보케 구간 아님) |
| 8 | account (`#account`) | background + surface 카드 | ① 헤더 + 안내문 ② 신랑측 카드 ③ 신부측 카드. 카드는 `details.card.account__card.reveal`이고 기본으로 접혀 있다(2026-10-11) | 계좌 접기: summary 화살표 회전 200ms, 펼친 내용 opacity 250ms |
| 9 | guestbook (`#guestbook`) | background (2026-10-12까지 surface 밴드) | (2026-10-13 공개 목록) ① 헤더 + 안내 ② 폼(성함·말씀·비밀번호 필드 `#FFFDFB` 면 + field_border 테두리, 모서리 16, 숨은 함정 칸, 남기기 바로 위 공개 안내) ③ 목록 머리(h3 "남겨 주신 말씀" + 상태 문구). 목록 항목과 더보기 버튼은 reveal 밖(17장: 더보기 대신 페이지 번호 줄, 역시 reveal 밖) | 목록 항목·삭제 펼침 opacity 250ms, 상태·오류 문구 200ms, 삭제한 항목 200ms 페이드 아웃(모션 명세 4-8-1) |
| 10 | share 공유하기 (`#share`, 2026-10-12 분리) | background | ① 헤더(SHARE / 공유하기) + 문구 2행 ② 카카오톡 공유(primary)·링크 복사(secondary) 전체 폭 세로 쌓기, 사이 8 | 없음 (보케 구간 아님) |
| 11 | closing 맺음 (`#closing[data-bokeh=closing]`, 마지막 섹션) | background | ① 장식 + wreath 모노그램(sprig는 `.reveal` 밖에서 stroke-draw, 모노그램만 `.reveal`) ② Allura Thank you(h2) + 2027.01.03 + Inhyeok & Yumin(이탤릭) | 상단 sprig-divider ③, 보케 |
| - | lightbox (`dialog#lightbox`) | scrim #1C1514 / 0.96 | - | 스와이프·끌어 닫기·사진 밖 탭 닫기. 사진은 화면에 맞춘 크기로만 보이고 확대되지 않는다(2026-10-17, 18장). 캐러셀 현재 장과 같은 번호로 열리고, 닫으면 캐러셀이 마지막으로 본 번호로 맞춰진다 |
| - | BGM 토글 (`.bgm-toggle`, fixed) | 반투명 면 | hero 시퀀스 t=0 | glow 링 |

RSVP 섹션은 없다(사용자 지정). 갤러리 순서는 사용자 요청(2026-10-12)으로 파일 번호 순서 01~15다(그 전에는 01 02 08 / 03 09 12 / 07 13 05 / 11 06 14 / 10 04 15). 2026-10-17 사용자 요청으로 이전 파일 번호 05 03 04 01 06~15 02 순서로 재배치하고 파일 이름을 새 순서대로 바꿨으므로 지금도 파일 번호 순서다(19장). 카피 시트 `gallery_alt` 표도 같은 순서이고, 컨셉 시트 `photos.gallery.order`보다 이 순서가 우선한다(`00_user-input.md`). alt는 파일별 문장 그대로이고 버튼 이름의 번호("사진 n / 15 크게 보기")가 곧 파일 번호다. hero.jpg는 갤러리에 없다. 프레임은 모두 2:3이다. 세로 13장은 `object-fit: cover`, 가로 2장(14번 14, 15번 15)은 `contain`이며 surface 매트 위에 올라간다. 그리드에서 쓰던 가로 사진의 `object-position`은 지웠다.

## 3. 모션 명세 매핑

위치는 `파일:줄` 기준이며 2026-10-11 캐러셀 반영 후 다시 쟀다(이전 표의 줄 번호는 9장 카피 수정 때 이미 어긋나 있었다).

### Must

| 명세 | 구현 | 위치 |
|---|---|---|
| 6 토큰 (`--ease-*` 5종, `--dur-*` 12종, `--reveal-distance`, `--stagger`, `--bulb-stagger`) + 캐러셀 치수 `--g-gap`·`--g-side`·`--g-chrome`·`--g-w`(`@supports (height: 100svh)` 분기) + `@property --g-i`·`--g-dx` + reduced 0ms 재정의 | 구현 | style.css:38-83 |
| `html.js` 게이트 | `<head>` 첫 인라인 스크립트 | index.html:5 |
| reduced-motion CSS·JS 분기 | CSS 블록 + `@media (no-preference)` 안에 루프 배치, JS `matchMedia` + 런타임 `change` 처리(새로고침 없음). 캐러셀은 토큰만 따라가고 JS 분기 없음 | style.css:1026-1099, script.js:1430 |
| 1 보케 B안(2026-10-13 교체, 15장): 구간 3곳(hero·calendar·closing), 구간당 8·합산 12/16, 흰 심 `#FFFCF8` + glow 후광 7단 스프라이트(지름 0.1px 단위 캐시, 화면 DPR로 렌더), 페이드 1.2s·반짝임 2.4~4.8s, 궤적 상자 겹침 방지(`BOX_GAP` 10), 30fps, 캔버스 DPR `min(dpr, 2)`, 직전 자리만 지우기 | 구현. 1-7 참고 코드를 글자 단위로 그대로 옮겼다(`BOKEH` 포함) | script.js:110-520 |
| 1-3 글자 회피: `data-bokeh-exclude="text"`는 텍스트 노드 줄 상자(공백·`.sr-only` 제외), 값 없음은 요소 상자, hero만 BGM 토글의 스크롤 0 자리, 사방 `EXCLUDE_MARGIN` 8 | 구현. HTML 속성 12개(`"text"` 6: `.hero__top`, `.hero__bottom`, calendar `.section-head`, `.calendar__when`, `.dday`, `.closing__thanks` / 값 없음 6: `.hero__photo`, `.scroll-cue`, `.lights`, `.cal`, closing `.sprig`, `.monogram`). wreath `<img>`에는 없다 | script.js:258-276, 315; index.html:66, 72, 74, 79, 136, 139, 156, 157, 175, 388, 407, 412 |
| 1-4 정지 조건: 구간 이탈(600ms 페이드 후 정지), 탭 숨김, 라이트박스 | `pauses` Set(`'hidden'`, `'lightbox'`) | script.js:283, 379, 392, 449 |
| 1-5 pre-seed, hero 첫 등장 1200ms, ResizeObserver 150ms 디바운스(폭 변화·높이 40px 초과면 재배치, 아니면 `dropBlocked`), fonts.ready·사진 load·구간 안 transform `transitionend`(100ms 디바운스) 재측정 | 구현. window resize 이벤트는 쓰지 않음 | script.js:321, 353, 423-447 |
| 1-6 reduced 정지 불빛 7개(hero만, `mulberry32(5)` 고정 시드, 최대 21회 시도, 밝기 0.85), calendar·closing 캔버스 숨김, 런타임 전환 | 구현 | script.js:134, 340, 455-475 |
| 1-7 `window.__bokeh = { config, stats() }`. `stats()`는 `living`, `zones`, `still`, `running`, `excludeHits`, `pairHits`, `minExcludeGap` (2026-10-13 명세에서 Should → Must) | 구현 | script.js:493, 1593 |
| 2-0 공통 reveal(threshold 0.15, rootMargin -10%, 1회, 콜백 단위 stagger 최대 2) + 안전장치 | 구현 | script.js:452, style.css:1005 |
| 2-1 hero 로드 시퀀스 0/300/600/900/1700ms, 사진 opacity만, `decode()` 대기, preload | 구현 | script.js:9, 495; index.html:26 |
| 2-5 gallery reveal 2그룹(헤더 / 캐러셀 전체), 슬라이드 개별 등장 없음 | 구현. reveal은 `.g-carousel`, 슬라이드 이동은 안쪽 `.g-track`이라 서로 덮어쓰지 않는다 | index.html:203, 208 |
| 3-1 sprig-divider stroke-draw 3곳(인라인 SVG, `sp-*` 클래스, IO threshold 0.5) | 구현 | index.html 각 `svg.sprig`, style.css:1027-1038, script.js:547 |
| 3-2 전구 호흡(주기 표 그대로) + 화면 밖·라이트박스 일시정지 | 구현 | style.css:493-499, 1040-1048, script.js:565 |
| 4-1 갤러리 캐러셀: 2:3 프레임(세로 cover, 가로 14·15 contain + surface 매트, 2026-10-17 재배치 뒤 번호, 19장), peek 16px, transform 트랙(`--g-i`·`--g-dx`), 스와이프(8px 축 판정, 50px 또는 0.3px/ms, 양 끝 정지·저항 0.3, 350ms), `touch-action: pan-y`(2026-10-17 `pinch-zoom` 제거, 18장), 가로로 판정된 뒤에만 포인터 캡처, 이전/다음 버튼 `aria-disabled` + "n / 15" 카운터, ←/→(포커스가 캐러셀 안일 때만), click 억제, `role="group"`·`aria-roledescription`·비현재 14장 `inert`+`aria-hidden`·`.g-status` 낭독·←/→ 시 포커스 이동, lightbox 같은 번호로 열기·닫으면 동기화·포커스 복귀, `srcset`/`sizes` + 로딩 창(index −1 ~ +2를 `eager`로, IO `rootMargin: 100% 0px`), JS 꺼짐 scroll-snap 폴백, `inert` 미지원 브라우저는 `tabindex="-1"` | 구현. 명세 4-1-11 CSS·4-1-12 JS를 옮겼고 차이는 4장 | index.html:208-238, style.css:559-669, script.js:22-23, 607-769 |
| 4-2 lightbox: `showModal` 포커스 트랩, 스와이프(판정은 캐러셀과 같은 `swipeTarget`), 확대 없음(2026-10-17, 18장: 핀치·더블탭·`ctrl + wheel`·`+`/`=`/`-`/`0` 키 확대와 팬 삭제, 두 번째 손가락이 닿으면 진행 중인 스와이프·끌어 닫기를 되돌리고 손을 다 뗄 때까지 입력 무시, 사진 밖 탭은 바로 닫기·사진 위 탭은 동작 없음), ←/→/Esc, 스크롤 잠금, 슬라이드 목록을 캐러셀 `.g-open`의 `data-full`·`data-w`·`data-h`·img alt로 생성, 현재 장은 캐러셀 img `currentSrc`로 시작해 원본으로 교체(절대 URL 비교, 캐러셀이 아직 못 받았으면 처음부터 원본), ±1 원본, 닫기 시작과 `close` 두 곳에서 캐러셀을 lightbox 번호로 맞춤(애니메이션·낭독 없음), 그 뒤 캐러셀 현재 슬라이드 버튼으로 포커스, 보케 정지 | 구현 | script.js:17-21(`LB`), 719-726(`swipeTarget`), 893-1151 (2026-10-17 기준) |
| 4-10 사진 보호 (2026-10-17, 18장): 모든 img의 저장 메뉴·끌기·선택 차단(CSS `img` 규칙 + `document` 위임 `contextmenu`·`dragstart`, 판정 `closest('img, .g-open')`), 글자 선택 유지, viewport meta `maximum-scale=1, user-scalable=no`, `html { touch-action: manipulation }`, WebKit `gesturestart`·`gesturechange` 차단, `window`의 `ctrl + wheel` 차단, 캐러셀 `touch-action: pan-y` | 구현. 4-10-2·4-10-3 참고 코드를 그대로 옮겼다 | index.html:6; style.css:89-93, 110-116, 627; script.js:115-135(`initZoomGuard`, `initPhotoGuard`), 1938-1939 |
| 4-3 BGM: 자동재생 없음, `preload="none"`, 꺼짐(사선 음표)/켜짐 아이콘, `aria-pressed`, `aria-busy`, 탭 숨김 일시정지·복귀, 재생 실패 복구 | 구현 | index.html:39-60, script.js:1166 |
| 4-4 복사(계좌·주소·링크): 라벨 전환 1600ms, 토스트 1800ms, `role="status"` 낭독(50ms 비웠다 다시), clipboard → execCommand → Selection 폴백, 진동 12ms | 구현 | script.js:82-104, 1248-1308 |
| 4-5 D-day 한국 시간 계산, D-N / D-DAY / 숨김 분기, visibilitychange 갱신, 카운트업 없음 | 구현 | script.js:585 |

### Should

| 명세 | 구현 | 위치 |
|---|---|---|
| 3-2 전구 점등 시퀀스(0.3→1, 140ms 간격) | 구현 | style.css:1041-1046 |
| 4-3 glow 링(3000ms 호흡), 볼륨 페이드(1500ms 들어옴, 400ms 나감) | 구현 | style.css:296-315, 1050-1053; script.js:1175 |
| 4-1 슬라이드 이미지 로드 페이드(300ms `--dur-base`, 스피너 없음) | 구현. 예전 `initThumbs`의 대상만 `.g-open img`로 바꾸고 이름을 `initPhotoFade`로 고쳤다 | script.js:771-782, style.css:609 |
| 4-1 이웃(peek) 탭으로 한 장 이동 + 뒤따르는 click 1회 억제 | 구현 | script.js:715-731 |
| 4-2 아래로 끌어 닫기(80px, scrim 0.96→최저 0.4), Android 뒤로가기(`pushState`/`popstate`, 이중 닫기 방지) | 구현 | script.js:923-969, 1032, 1152 |
| 4-4 계좌 접기 | 구현(2026-10-11 사용자 피드백). `<details>/<summary>`, 기본 접힘, 높이 애니메이션 없음. 화살표 `rotate(0→180deg)` `--dur-fast` 200ms `--ease-standard`, 열린 내용 `opacity 0→1` `--dur-modal` 250ms `--ease-out`(`::details-content`에 걸고, 이 의사 요소가 없는 엔진은 `.account__body`에 건다). reduced-motion은 토큰 0ms로 즉시. JS가 꺼져도 `<details>` 기본 동작으로 접고 편다 | index.html:297-334, style.css:719-757 |
| 4-6 카카오 공유 + 링크 복사 폴백 | 구현 | script.js:1312 |
| 4-7 길찾기 버튼 | 네이버 지도, 카카오맵 2개. 티맵은 미구현(아래 4장) | index.html:263-266 |
| 4-7 지도 임베드(지연 로딩, 지도 위 모션 없음) | 구현(2026-10-12). 카카오맵 고정 지도, 12장 | index.html:258-262, style.css:681-696, script.js:1373-1443 |
| 4-8 방명록 상태 문구(200ms 페이드), 제출 중 비활성 | 구현 | script.js:1516-1884 `guestbookRequest`·`initGuestbook` (2026-10-13 다시 씀) |
| 4-8-1 방명록 목록: 첫 페이지·새 글·더보기 묶음 250ms 페이드(순차 등장 없음. 더보기는 17장에서 페이지 넘김·긴 글 접기로 바뀜), 삭제 펼침 250ms·닫기 즉시, 오류 문구 200ms, 삭제 성공 `inert` + 200ms 페이드 아웃 뒤 제거, 상태 문구 200ms(스피너·스켈레톤 없음), 포커스 이동 | 구현(2026-10-13, 16장) | style.css:966-976, script.js:1516-1884 |
| 4-9 스크롤 큐(1700ms 등장, 2400ms 루프, 첫 스크롤 후 제거, 압축 화면 숨김) | 구현 | style.css:406-437, 1055-1059; script.js:534-543 |
| 4-10-2 `showModal` 미지원 폴백(원본을 새 탭으로 열기) 제거 (2026-10-17, 18장) | 구현. `showModal`이 없으면 lightbox를 만들지 않고 돌아간다. 사진 버튼을 눌러도 아무 일이 없고 캐러셀 넘기기만 된다 | script.js:897-898 |

### Nice-to-have

| 명세 | 구현 | 위치 |
|---|---|---|
| 4-2 `+` / `-` / `0` 키 줌, `ctrl + wheel` 줌 | **삭제**(2026-10-17, 18장). 명세 7장에서 이 줄이 빠졌고 4-2 "확대 없음"이 대신한다 | - |
| 4-1 트랙패드 가로 휠 | 구현. 가로 성분이 클 때만 `preventDefault`, deltaX 누적 ±40에서 한 장, 이후 450ms 입력 무시(`GAL.WHEEL_STEP`·`WHEEL_LOCK`) | script.js:742-755 |
| 4-1 전환 중 잡기 | **미구현.** 전환 중에 손가락을 대면 목표 위치로 짧게 점프한 뒤 끌린다(명세가 적은 미구현 시 동작, lightbox와 같음) | - |

## 4. 명세와 다르게 처리한 부분

| 항목 | 명세 | 실제 | 이유 |
|---|---|---|---|
| sprig 숨김 대시 | `stroke-dasharray: 1 1` | `1 2` | `1 1`로 숨기면 round cap 때문에 모든 path 끝에 점이 남는다. Chrome에서 3배 확대 캡처로 확인했다(image-artist 매니페스트에도 같은 지적). `1 2`는 숨김 상태가 깨끗하고 그려지는 모양은 같다 |
| 장식 루프 CSS 위치 | 명세 블록은 미디어 쿼리 없이 작성됨 | sprig·전구·BGM 링·스크롤 큐의 숨김 상태와 애니메이션을 `@media (prefers-reduced-motion: no-preference)` 안에 두고, 명세의 reduce 블록도 그대로 유지(선택자 명시도를 올림) | 명세의 reduce 규칙(`.sprig :is(...)`, `.lights .bulb`)은 명시도가 `.js .sprig :is(...)`, `.lights.is-on .bulb`보다 낮아서, 그대로 두면 reduce에서 디바이더가 숨겨진 채로 남고 전구가 계속 깜빡인다 |
| reduce에서 reveal | 토큰 0ms로 "즉시 표시" | 토큰 0ms + JS가 시작 시 모든 `.reveal`에 `.is-visible`을 붙임(IO 생략) | 0ms 토큰만으로는 아직 화면에 안 들어온 그룹이 opacity 0으로 남는다 |
| 페이지 끝 안전장치 | `scrollY + innerHeight >= scrollHeight - 2` | 페이지 끝 1px 센티널(`.reveal-sentinel`)을 IntersectionObserver로 감시 | 명세 8장이 scroll 리스너를 스크롤 큐 1개로 제한한다 |
| 보케 (2026-10-13 B안) | 1-7 참고 코드 | 다른 곳 없음. 예전 이 표에 있던 보케 차이 5행(30fps 게이트 32.3ms, 구간이 켜질 때 합산 상한 맞추기, 제외 영역의 reveal 이동분 보정, 높이 40px 이하 변화, `stats()` 정의)은 명세 1-7 코드에 모두 들어가 지웠다(15장) | - |
| 복사 성공 라벨 | "복사됨" | "복사했습니다"(카피 시트). 토스트 문구도 카피 시트(마침표 포함) | 문구는 카피 시트 기준 |
| BGM `aria-label` | "배경 음악" | "배경음악"(카피 시트) | 같음 |
| BGM 재생 실패 | 오류 문구 없음 | 화면 토스트 없이 `role="status"` 낭독만("음악을 재생하지 못했습니다. 다시 한번 눌러 주세요.") | 카피 시트의 상태 메시지를 쓰되 시각 피드백은 명세대로 없음 |
| 길찾기 | 카카오맵·네이버 지도·티맵 | 티맵 제외 | 티맵은 앱 키 없이 쓸 수 있는 웹 검색 URL이 없다. 앱 스킴(`tmap://`)은 데스크톱·미설치 기기에서 실패 |
| 라이트박스 카운터 | "n / 15" + `aria-live` | 보이는 "n / 15"는 `aria-hidden`, 같은 `aria-live` 문단 안의 sr-only "15장 중 n번째 사진"이 낭독됨 | 카피 시트의 카운터 접근성 문구 |
| 끌어 닫기 원위치 250ms | 시간만 명시 | 토큰 `--dur-modal`(250ms) 재사용. 2026-10-17 줌이 없어져 원위치만 남았다 | 250ms 전용 토큰이 없다. reduce에서 0ms로 따라감 |
| 400/600ms 전환 | BGM 토글 등장 400ms, 스크롤 큐 등장 600ms·퇴장 400ms | `calc(var(--dur-fast) * 2)`, `calc(var(--dur-base) * 2)` | 토큰에 묶어 reduce에서 0ms가 되게 |
| 끌어 닫기 배경 | dialog 배경 opacity 변경 | scrim을 별도 요소(`.lb-scrim`)로 두고 그 opacity만 바꿈 | transform/opacity만 움직이는 규칙 유지 |
| greeting 그룹 ③ "혼주 표기" | greeting 안 | 혼주 표기는 couple-intro 섹션에 있음 | 컨셉 시트 `sections_order`가 두 섹션을 나눈다 |
| UI 문구 위치 | - | 런타임 문구를 `index.html`의 `<template id="ui-text">`에 두고 JS가 읽음 | 저장소 규칙상 코드 파일에 한국어를 넣지 않는다. 모든 문구를 index.html에서 grep으로 확인할 수 있다 |
| SVG 인라인 수정 | 9장 자산 협의 | sprig에 `sp-flower`/`sp-stem`/`sp-leaf--1~3`/`sp-dot--center`/`sp-dot--end` 클래스, string-lights 전구에 `data-i="0"~"6"`, 후광 `opacity="0.25"` → `fill-opacity="0.25"` | 원본 SVG 파일은 그대로 두고 인라인 사본에서 반영 |
| hero 아래 여백 | 예산에 없음 | `padding-bottom: 24px` | 스크롤 큐가 화면 끝에 붙지 않게. 390x844, 375x667, 375x548 모두 첫 화면 안에 들어가는 것을 측정으로 확인 |
| 캘린더 일요일 | 머리글 accent | 머리글만 accent, 날짜 숫자는 text | 컨셉 시트 지정 범위 그대로 |
| 갤러리 순서 (2026-10-11, 2026-10-12) | 4-1: 02 01 08 …, "순서상 첫 장이 가로(02)", QA 확인값 "02, 01, 08만 요청" | 2026-10-11에 01 02 08 03 09 12 07 13 05 11 06 14 10 04 15로, 2026-10-12에 파일 번호 순서 01~15로 바꿨다. 첫 장은 세로 01, 가로 사진은 2번(02)과 15번(15). 첫 요청은 01, 02, 03 세 장이다. (2026-10-17 재배치와 파일 이름 변경 뒤에도 파일 번호 순서이고, 가로 사진은 14번(14)과 15번(15)이다. 19장) | 사용자 요청(오케스트레이터 전달, `00_user-input.md`). 첫 화면이 위아래 매트가 큰 가로 사진으로 시작하지 않게, 그다음 파일 번호와 같게 |
| 캐러셀 click 억제 해제 | 플래그는 다음 pointerdown에서 초기화 | 같고, 키보드로 일어난 click(`e.detail === 0`)은 플래그와 상관없이 막지 않는다 | 터치 스와이프 뒤에는 click이 오지 않아 플래그가 남는다(70px 터치 스와이프에서 click 0건 실측). 그대로면 스와이프 다음의 Enter·Space 한 번이 사라져 lightbox가 열리지 않는다 |
| 이전/다음 버튼 CSS | 4-1-11 참고 CSS | 참고 CSS에 더해 `border-radius: 50%`(포커스 링이 보이는 원을 따라감), `cursor: pointer`, 탭 하이라이트 끔, 5장 누름 규칙(`:active` scale 0.97, 120ms), `svg { position: relative }`. chevron 색은 BGM 아이콘처럼 SVG `stroke="#8E5558"` 속성 | 포커스 링이 44px 사각형으로 그려지지 않게, 그리고 hover 때 `::before` 원 면이 chevron 위에 칠해지지 않게 |
| reduce의 누름 피드백 | 모든 버튼 `opacity: 0.85` | 이전/다음 버튼은 `:not([aria-disabled="true"]):active`에만 적용 | 끝에서 비활성(0.3)인 버튼을 누르면 0.85로 밝아지는 것을 막는다 |
| 드래그 중 커서 | `.g-track.is-dragging { cursor: grabbing }` | 같은 규칙 + `.g-track.is-dragging .g-open { cursor: grabbing }` | 슬라이드 버튼의 `zoom-in`이 트랙 커서보다 우선해서, 사진 위에서 끌면 `grabbing`이 보이지 않는다 |
| JS 꺼짐에서 `.g-status` | 4-1-9 "버튼 줄과 `.g-status`는 숨긴다"(참고 CSS는 버튼 줄만) | `html:not(.js) .g-status { display: none }`도 넣었다 | 4-1-9 본문대로 |
| 캐러셀 반환값 | `{ goTo, index, button, img }` | `{ goTo, index, button }`. 지역 변수 이름은 `root` 대신 `el` | lightbox는 버튼 안 img를 직접 읽어 `img`가 필요 없다. 파일 전역의 `root`(문서 루트)와 이름이 겹치지 않게 |
| 슬라이드 `data-index` | 4-1-8 마크업에 없음 | 넣지 않았다. 번호는 DOM 순서로 정한다 | 예전 그리드 버튼의 `data-index`는 스크립트에서 쓰지 않았다 |

참고로 greeting을 화면 가운데에 둔 상태에서는 hero 아래쪽이 아직 IO 띠(가운데 70%)와 겹쳐서 `running`이 `['hero']`로 나온다. 명세 1-4의 IO 정의대로 동작한 결과다. gallery·guestbook 위치에서는 `running`이 빈 배열이다.

## 5. frontend가 직접 쓴 문구 (카피 시트에 없는 것)

| 문구 | 위치 | 출처 |
|---|---|---|
| 웨딩 사진 15장 | 캐러셀 묶음 `aria-label` (index.html:208) | 모션 명세 4-1-8 기본값. 카피 시트에 같은 항목이 생기면 그쪽을 쓴다 |
| 슬라이드 | 캐러셀 `aria-roledescription` (index.html:208) | 모션 명세 4-1-8 기본값 |
| "15장 중 n번째 사진, {alt}" | 캐러셀 `.g-status` 낭독. 앞부분은 기존 카피 키 `lb-counter`(`<template id="ui-text">`), 쉼표와 alt는 JS가 이어 붙임 | 모션 명세 4-1-8 기본 조합 |

캐러셀 이전/다음 버튼 이름("이전 사진", "다음 사진")과 슬라이드 버튼 이름("사진 n / 15 크게 보기: {alt}")은 카피 시트 `gallery_controls` 문구 그대로다. 나머지 화면·낭독 문구는 모두 카피 시트에서 가져왔다. 메타 태그 중 `og:locale`(`ko_KR`)과 `theme-color`(`#FBF6F1`)는 설정값이다.

## 6. 설정값

placeholder(`[[TODO:...]]`)는 모두 채워졌고(2026-10-11), placeholder를 판별하던 코드(`isPlaceholder`, 계좌 "준비 중" 안내, 방명록 "접수 주소 미설정" 안내)도 지웠다. 값은 모두 `index.html`에 있다.

| 항목 | 위치 | 값 |
|---|---|---|
| 배포 주소 | `og:url`, `og:image` | `https://ihbang.github.io/wedding-letter/` |
| 교통편 | `.venue__routes` | 지하철, 주차, 내비게이션 3줄. 버스 안내는 없다 |
| 계좌 | `#groom-account`, `#bride-account`와 앞의 은행명 | 신한은행 110-335-546640(방인혁), 국민은행 298702-04-213005(손유민) |
| 방명록 웹 앱 주소 | `<head>`의 `<meta name="guestbook-endpoint">` (2026-10-13까지는 `.gb-form`의 Formspree `action`) | Apps Script 웹 앱 `https://script.google.com/macros/s/AKfycbxbY_…/exec`. 새 배포를 만들면 URL이 바뀌므로 코드를 고칠 때는 [배포 관리 > 수정 > 새 버전]으로 갱신한다 |
| 방명록 동작 값 | script.js 맨 위 `GB` 상수 | `PAGE: 20`(한 번에 받는 글 수), `TIMEOUT: 15000`(15초 안에 응답이 없으면 실패), `NEAR_MARGIN: '100% 0px'`(한 화면 앞에서 목록 로드), `PASSWORD_MIN: 4`. 비밀번호 최대 20자와 성함 40자·말씀 500자는 입력칸 `maxlength` |
| 카카오 JavaScript 키 | `<head>`의 `<meta name="kakao-js-key">` (2026-10-12까지는 `#share-kakao`의 `data-kakao-key`) | 카카오 디벨로퍼스 앱 키. 카카오 공유와 오시는 길 지도가 같이 읽는다 |
| 지도 주소 | `#venue-address`의 글자 | "서울 송파구 송파대로 155". 주소 복사 버튼과 지도 주소 검색이 같은 글자를 쓴다. 좌표는 코드에 없다 |
| 지도 확대 수준·로딩 | script.js 맨 위 `MAP` 상수 | `LEVEL: 4`(CSS 1px당 약 2m), `NEAR_MARGIN: '100% 0px'`(한 화면 앞에서 로드), `TIMEOUT: 10000`(10초 안에 마커까지 못 그리면 숨김) |
| 지도 접근성 이름 | `#venue-map`의 `aria-label` | "더컨벤션 송파문정 위치 지도" |
| 카카오 디벨로퍼스 설정(사용자) | 카카오 디벨로퍼스 앱 | 카카오맵 사용 설정 켜기, [플랫폼 > Web]에 `https://ihbang.github.io` 등록. 로컬에서 지도를 보려면 `http://localhost:8000`도 등록 |

- 링크 복사와 카카오 공유 링크는 `og:url`을 쓴다. 로컬 미리보기에서도 배포 주소가 복사된다.
- 카카오 SDK 로드나 공유 호출이 실패하면 링크를 복사하고 카카오 폴백 문구를 띄운다.
- 카카오맵 SDK 로드·인증(401/403)·주소 검색이 실패하면 지도 상자를 숨긴다. 장소명·주소, 주소 복사 버튼, 지도 버튼은 그대로 남는다.

## 7. 화면 확인 결과

로컬 서버(`python3 -m http.server 8765`)에서 headless Chrome으로 확인했다. 안내받은 `--screenshot --window-size=390,844` 방식은 macOS headless Chrome의 최소 창 폭(500px) 때문에 레이아웃 폭이 500px로 잡혔고(왼쪽에 바깥 면 10px이 보임), 프로세스가 끝나지 않았다. 그래서 CDP(`Emulation.setDeviceMetricsOverride`)로 정확한 뷰포트를 지정하고, 실제로 스크롤해서 IntersectionObserver reveal이 자연스럽게 발동한 상태를 캡처했다. 디버그 파라미터나 virtual time은 쓰지 않았다. 스크린샷과 스크립트는 scratchpad에만 있고 저장소에는 넣지 않았다.

| 항목 | 결과 |
|---|---|
| 390x844 첫 화면 | 날짜(y 187–227), 사진(277–537, 390x260 3:2), 이름(565–601), 장소(637–659), 스크롤 큐(679–707) 모두 화면 안. 가로 스크롤 없음(scrollWidth 390) |
| 375x667 첫 화면 | 스크롤 큐 끝 y 613. 모두 화면 안 |
| 375x548 (압축 규칙) | 장소 줄 끝 y 501, 스크롤 큐 숨김 |
| 1280x900 데스크톱 | 480px 컬럼 가운데, 바깥 surface, BGM 토글이 컬럼 안 오른쪽 위 |
| 폰트 | 9종 모두 로드 확인(Allura, Cormorant 300/500/400i, Gowun Batang 400/700, Pretendard 400/500/600) |
| 보케 | (2026-10-13 B안 기준, 15장) 구간마다 그 구간 하나만 실행(hero → calendar → closing), gallery·venue·notice·account·guestbook에서 `running: []`. 구간별 최대 생존 8, `excludeHits` 0, `pairHits` 0, 제외 상자까지 최소 14.4px 이상. 사진·글자 줄·장식 위에는 나타나지 않음 |
| 전구 | 점등 후 opacity 0.85–0.99 사이에서 호흡 |
| 스크롤 완주 후 | 숨은 reveal 0개, 안 그려진 디바이더 0개, D-day "D-85 / 인혁과 유민의 결혼식까지 85일 남았습니다." |
| 라이트박스 | 2번 셀 탭 → 2/15로 열림, 첫 포커스 닫기 버튼, `html.lb-open`, 원본 01.jpg 로드, → 키 3/15, 왼쪽 스와이프 4/15, 더블탭 2배 / 다시 더블탭 1배, 핀치 3배에서 clamp, Esc 닫기 후 2번 셀로 포커스 복귀·history 원복, 아래로 끌어 닫기 동작. (2026-10-17: 더블탭·핀치 확대는 삭제됐다. 지금 동작의 확인은 18장) |
| reduced-motion | 모든 섹션 즉시 표시, hero 사진 opacity 1, 디바이더 완성, 전구 opacity 1·animation none, calendar·closing 캔버스 `display: none`, hero에 정지 불빛 7개(2026-10-13 B안, 새로고침해도 같은 픽셀). 런타임에 설정을 되돌리면 새로고침 없이 hero 보케 재개 |
| 복사·폼·공유 | 주소 복사 라벨 "✓ 복사했습니다", 방명록 빈 값 검증(`aria-invalid`), 카카오 폴백 문구 |
| BGM | 탭 전 `bgm.mp3` 요청 없음. 탭 후 재생, volume 0.60, 링 표시. 다시 탭하면 정지 |
| 콘솔 | 모든 시나리오에서 오류·예외 0건 |

확인 중 고친 것: 토스트가 `left: 50%` 때문에 뷰포트 절반 폭으로 줄어 두 줄로 꺾이던 문제(`width: max-content` 추가).

## 8. 배포 가이드

1. 설정값은 모두 채워져 있다(6장). 배포 주소, 계좌, 방명록 웹 앱 주소, 카카오 키가 바뀌면 6장의 위치를 고친다.
2. GitHub Pages: 저장소 루트를 그대로 배포한다. `.nojekyll`이 있으므로 Jekyll 처리 없이 정적 파일로 나간다.
3. 카카오 공유를 쓰면 카카오 디벨로퍼스 앱의 [플랫폼 > Web]에 배포 도메인을 등록한다. SDK 로드나 공유가 실패하면 버튼은 링크 복사로 동작한다. 오시는 길 지도는 같은 앱에서 카카오맵 사용 설정도 켜야 나온다. 둘 중 하나라도 빠지면 지도 상자만 숨겨진다(12장).
4. 카카오톡 미리보기 캐시: 공유 미리보기가 예전 이미지로 보이면 카카오 공유 디버거에서 URL 캐시를 초기화한다(og 이미지는 새 파일명 `og-garden.jpg`를 쓴다).
5. 배포 후 휴대폰에서 확인할 것: 첫 화면(날짜·사진·이름·장소), BGM 토글, 갤러리 캐러셀 스와이프(가로로 넘김, 세로로는 페이지 스크롤)와 이전/다음 버튼, 라이트박스 스와이프·끌어 닫기와 닫은 뒤 캐러셀 번호, 사진 보호(2026-10-17: 본문·캐러셀·lightbox에서 핀치·더블탭해도 확대되지 않음, 사진을 길게 눌러도 저장 메뉴가 뜨지 않음, 계좌번호 글자는 길게 눌러 선택·복사됨. 모션 명세 12-2 C 표), 계좌 복사, 방명록 글 1건 남기기·목록 표시·삭제(2026-10-13부터 실제 시트에 쌓이고 알림 메일이 간다), 카카오 공유 미리보기.
6. 쓰지 않는 예전 자산(`images/divider-hairline.svg`, `images/monogram-iy.svg`, `images/og-thumbnail.*`, `images/floral-*.png`, `images/gallery-placeholder-*.png`, `images/hero-illustration.png`, `images/photos/thumb/hero.jpg`)은 페이지에서 참조하지 않는다. 지울지는 사용자가 정한다.

## 9. 사용자 카피 수정 반영 (2026-10-10)

아래 `파일:줄`은 2026-10-11 캐러셀 반영 후 줄 번호로 고쳤다.

`00_user-input.md` 맨 아래 "사용자 카피 수정" 표의 항목만 반영했다. `script.js`는 바꾸지 않았다. 주소 복사는 `#venue-address`의 글자를 그대로 읽으므로 HTML만 고치면 된다.

| 항목 | 반영 | 위치 |
|---|---|---|
| `<title>`, `og:title` | "인혁 ♡ 유민, 우리 결혼합니다". 카카오 공유 제목은 지금처럼 og:title에서 읽는다 | index.html:8, 16 |
| couple 제목 | "신랑 신부" | index.html:119 |
| couple 정렬 | "아들"/"딸"을 `span.couple__rel`(inline-block, 폭 2em, 가운데 정렬)에 넣었다. `.couple__line`에 letter-spacing이 없어서 2em만으로 충분하다("아들" 글자 폭 28.36px < 칸 30px) | index.html:121-132, style.css:475-479 |
| calendar 제목 | "예식일" | index.html:155 |
| 영문 일시 줄 | `calendar__when-en` 문단과 CSS 규칙 삭제. hero의 `SUNDAY · 3 PM`은 그대로 | index.html, style.css |
| 달력 caption | "JANUARY 2027"만 남기고 `cal__caption`("2027년 1월") span과 CSS 규칙 삭제 | index.html:160-162 |
| 주소 | "서울 송파구 송파대로 155". index.html·script.js에 "NH송파농협" 0건 | index.html:250 |
| notice 신설 | venue와 account 사이. 공용 `.section` / `.section-head` / `.eyebrow` / `.section-title` / `reveal` 패턴, 본문은 기본 문단 스타일(Gowun Batang 15px / 1.95, account 안내문과 같음)을 그대로 상속해 전용 CSS가 없다 | index.html:286-292 |
| account 안내문 1연 | 3행으로 교체, 2연은 그대로 | index.html:300 |
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

## 10. 갤러리 캐러셀 전환 (2026-10-11)

`00_user-input.md` 맨 아래 "갤러리 방식 변경"과 순서 변경, 모션 명세의 "(2026-10-10 갤러리 캐러셀로 변경)" 절(2-5, 4-1, 4-2, 5, 6, 7, 10)만 반영했다. 다른 섹션은 건드리지 않았다.

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| index.html | `#gallery`의 `ul.g-grid` 15칸을 4-1-8 마크업(`.g-carousel` > `.g-viewport` > `.g-track#g-track` > `.g-slide` 15개, `.g-controls`, `.g-status`)으로 교체. 슬라이드 img는 원본 `src` + `srcset`(썸네일·원본) + `sizes="(min-width: 480px) 432px, calc(100vw - 48px)"`, 원본 `width`/`height`, `loading="lazy"`, `decoding="async"`, `draggable="false"`. 갤러리·lightbox 주석 두 줄 |
| style.css | `:root`에 `--g-*` 토큰·`@supports (100svh)`·`@property --g-i`/`--g-dx` 추가, 토큰 주석 4줄 갱신. `.g-grid`·`.g-cell` 규칙을 지우고 4-1-11 캐러셀 CSS로 교체. reduce 블록의 `.g-cell:active`를 `.g-nav:not([aria-disabled="true"]):active`로 교체 |
| script.js | `GAL` 상수, `swipeTarget()`, `initCarousel()` 추가. `initThumbs` → `initPhotoFade`(대상 `.g-open img`). `initLightbox(bokeh, carousel)`: 슬라이드 목록을 `.g-open`에서 만들고, 현재 장을 캐러셀 `currentSrc`로 시작, `opener` 대신 닫기 시작·`close`에서 캐러셀 동기화와 포커스 복귀, `finishSwipe`는 `swipeTarget` 호출. 부팅 순서 `photo-fade → carousel → lightbox` |

예전 그리드의 02·15 `object-position`, `.g-cell:active` scale 0.98, 썸네일 `src`, `data-index`는 모두 없어졌다(`grep 'g-cell\|g-grid\|object-position'` 0건).

### 명세 QA 확인값 실측

로컬 서버(`python3 -m http.server 8769 --bind 127.0.0.1`)와 headless Chrome CDP(DPR 2, 터치 에뮬레이션)로 쟀다. 검사 스크립트와 스크린샷은 scratchpad(`fe-carousel/`)에만 있다. Chrome이 Bash 샌드박스 안에서는 뜨지 않아 샌드박스를 끄고 실행했다. 110개 항목 모두 통과했다.

| 화면 | 프레임 | peek | 프레임 + 버튼 줄 | 명세 표 |
|---|---|---|---|---|
| 390 x 664 | 342 x 513 | 16px | 577px | 같음 |
| 375 x 548 | 290.7 x 436 (높이 기준) | 34px | 500px | 같음 |
| 360 x 700 | 312 x 468 | 16px | 532px | 같음 |
| 430 x 750 | 382 x 573 | 16px | 637px | 같음 |
| 375 x 667 | 327 x 490.5 | 16px | 554.5px | 표에 없음(계산값과 같음) |
| 1280 x 900 (컬럼 480) | 432 x 648 | 16px | 712px | 같음 |

모든 화면에서 가로 스크롤 없음(scrollWidth = 화면 폭), 이전/다음 버튼 44x44, 콘솔 오류·예외 0건.

| 4-1-12 확인값 | 결과 |
|---|---|
| 390px에서 프레임 342x513, peek 16px | 342 x 513, 다음 장 왼쪽 끝 x 374(= 24 + 342 + 8), peek 16px |
| 14번에서 다음 → "15 / 15", 다음 `aria-disabled="true"`, 포커스는 다음 버튼 | 그대로. 한 번 더 눌러도 15에 머묾, opacity 0.3 |
| hero에서 갤러리 사진 요청 0건, 갤러리 근처에서 01·02·08만 | hero 1.5초 동안 0건. 갤러리 근처에서 `01.jpg`, `thumb/02.jpg`, `08.jpg` 3건(DPR 2라 세로는 원본, 가로 02는 804w 썸네일). 2번으로 넘기면 `03.jpg` 추가 |
| 4번에서 lightbox를 열어 7번까지 넘기고 닫기 → "7 / 15", 포커스는 7번 버튼 | → 두 번 + 스와이프 한 번으로 7/15, 닫기 버튼 → 캐러셀 "7", `document.activeElement` = "사진 7 / 15 크게 보기: …" 버튼. 닫기 모션 30ms 시점(dialog 아직 열림)에 이미 "7"로 맞춰짐, 닫은 직후 7번 프레임 x 24(애니메이션 없음), `.g-status`는 바뀌지 않음 |
| 캐러셀 위에서 세로로 쓸어 올리면 페이지 스크롤, 트랙 고정 | scrollY 2597 → 2797, 번호·프레임 위치 그대로 |

### 그 밖의 동작 확인

| 항목 | 결과 |
|---|---|
| 스와이프 | 빠른 70px 왼쪽 → 다음 장. 느린 40px → 제자리. 40px을 0.7px/ms로 튕기면 → 이전 장. 드래그 중 `--g-dx`가 손가락 이동과 1:1(-60px), `will-change: transform`은 드래그 중에만 |
| 양 끝 | 1번에서 오른쪽, 15번에서 왼쪽으로 끌면 제자리(순환 없음). 1번에서 100px 끌면 트랙은 30px(저항 0.3) |
| 버튼·키보드 | 이전/다음 버튼 한 장씩, 끝에서 `aria-disabled`라 눌러도 그대로이고 포커스 유지. 슬라이드 버튼에서 → / ← 는 포커스가 새 슬라이드 버튼으로 옮겨 가고 `.g-status`는 그대로. 다음 버튼에서 → 는 포커스가 버튼에 남고 `.g-status` = "15장 중 n번째 사진, {alt}". Tab 순서: 현재 슬라이드 → 이전 → 다음. 비현재 14장 `inert` + `aria-hidden` |
| 탭 | 현재 프레임 탭 → 같은 번호로 lightbox. 오른쪽·왼쪽 peek 탭 → 한 장 이동, lightbox 안 열림. 마우스로 90px 끌고 놓기 → 한 장 이동, lightbox 안 열림. 터치 스와이프 직후 Enter → lightbox 열림 |
| lightbox | 첫 포커스 닫기 버튼, `html.lb-open`, 첫 `src`는 캐러셀 `currentSrc`(390 DPR 2에서는 원본 자체), 이웃은 원본. 슬라이드 순서·alt가 캐러셀과 같음. 열린 동안 캐러셀 번호 그대로. 7번에서 ← 세 번 후 Esc → 캐러셀 4, 포커스 4번 버튼 |
| reduced-motion | 캐러셀 즉시 표시, 트랙·이미지 페이드 `transition-duration` 0s, 다음 버튼 30ms 뒤 이미 제자리. 드래그 중에는 손가락을 따라감(x -36). 설정을 되돌리면 새로고침 없이 0.35s |
| JS 꺼짐 | `html.js` 없음, 뷰포트 `overflow-x: auto` + `scroll-snap-type: x mandatory`, 첫 장 x 24 가운데, 손가락 스와이프로 다음 장이 x 24에 멈춤. 버튼 줄·`.g-status` 숨김, `inert` 0개, 페이지 가로 스크롤 없음 |
| 나머지 페이지 회귀 | 이전 `fe/cdp.mjs`의 scroll·reduced 시나리오를 8769에서 다시 돌림: 숨은 reveal 0, 안 그려진 디바이더 0, gallery·guestbook에서 보케 `running: []`, reduced 정적 상태 그대로, 콘솔 0건 |
| `node --check script.js` | 통과 |

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/fe-carousel/`

- 갤러리 첫 화면(헤더 + 1번 01): `first-screen-390.png`, `first-screen-360.png`
- 세로 사진: `slide01-portrait-390.png`·`-360.png`(01), `slide03-portrait-390.png`·`-360.png`(08)
- 가로 사진: `slide02-landscape-390.png`·`-360.png`(02), `slide15-landscape-390.png`·`-360.png`(15, 오른쪽 빈 자리에 페이지 background)
- 화면별: `gallery-375x548.png`, `gallery-375x667.png`, `gallery-430x750.png`, `gallery-1280x900.png`
- lightbox(2번에서 열기): `lightbox-from-slide2-390.png`, JS 꺼짐: `nojs-390.png`

화면으로 본 것: 가로 02·15는 잘림 없이 surface 매트 가운데에 놓이고, 세로 사진은 프레임을 꽉 채운다. 사진 위에 화살표·글자·오버레이가 없고 이웃 사진은 흐리게·작게 처리하지 않았다. 375x548에서는 프레임이 줄어 버튼 줄까지 한 화면에 들어온다. 데스크톱에서는 480px 컬럼 가장자리에서 peek가 잘린다.

## 11. 계좌 영역 피드백 반영 (2026-10-11)

`00_user-input.md` 맨 아래 "계좌 영역 피드백"과 카피 시트 account_info 아래 인용문만 반영했다. account 섹션과 복사 토스트 외에는 건드리지 않았다. 카카오페이 `송금하기` 버튼은 이번에 넣지 않았다.

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| index.html | 계좌 카드 2개를 `div.card.account__card.reveal`에서 `details.card.account__card.reveal`로 바꿨다. `summary.account__summary` 안에 기존 라벨(`span.account__side` 신랑측·신부측)과 아래 화살표 SVG(`aria-hidden`)가 있고, `.account__body` 안에 계좌번호 줄·예금주 줄·`복사하기` 버튼이 그대로 있다. `#groom-account`·`#bride-account`, `data-copy-target`, 버튼 `aria-label`은 바뀌지 않았다. 토스트는 `svg.toast__check` + `span.toast__text`로 나눴다. `copy-done-account` 문구는 "계좌번호가 복사되었습니다."로 바꿨다 |
| style.css | `.account__card` 패딩을 summary(최소 높이 56px, 좌우 20px)와 body(좌우 20px, 위 16px·아래 20px, 위쪽 line 구분선)로 나눴다. 기본 삼각형은 `list-style: none` + `::-webkit-details-marker`로 숨겼다. summary 모서리를 카드에 맞춰 포커스 링(기존 전역 `:focus-visible`)이 카드를 따라 돈다. 화살표 회전과 내용 페이드는 위 "계좌 접기" 행에 적었다. 토스트를 flex로 바꾸고, 체크는 `.toast.is-done`일 때만 보인다(`--color-secondary` #A2AA92, 토스트 면 대비 5.46:1). 버튼 체크 `.copy-btn__check`는 `--color-sage-deep` #5B6A46(surface 대비 4.92:1)이고 라벨 글자 색은 accent 그대로다. 새 색 변수는 없다(둘 다 기존 변수) |
| script.js | `notify(message, done = false)`: 글자는 `.toast__text`에 넣고 `done`이면 `is-done`을 붙인다. 복사 성공(계좌·주소·링크)만 `done = true`. 복사 실패, 카카오 폴백 안내에는 체크가 없다 |

`::details-content`에 페이드를 건 이유: Chrome은 닫힌 `<details>`의 내용을 `content-visibility: hidden`으로 숨겨 그 안을 다시 스타일하지 않는다. `.account__body`에 애니메이션을 걸면 처음 펼칠 때만 페이드가 나오고 두 번째부터는 나오지 않았다(실측). 의사 요소 쪽은 매번 다시 스타일된다.

이 변경으로 script.js 85행 뒤, style.css 251행·719행·913행 근처 줄 번호가 몇 줄 밀렸다. 이 문서 3장의 다른 행에 적힌 줄 번호는 고치지 않았다.

### 확인 (headless Chrome 154 CDP, DPR 2, 터치 에뮬레이션)

로컬 서버 `python3 -m http.server 8772 --bind 127.0.0.1`. Chrome이 Bash 샌드박스 안에서는 뜨지 않아 샌드박스를 끄고 실행했다. 검사 스크립트·결과·스크린샷은 scratchpad `fe-account/`에만 있다.

| 항목 | 360 x 740 / 390 x 844 |
|---|---|
| 처음 상태 | 두 카드 모두 닫힘, 복사 버튼 안 보임, summary 높이 56px, 화살표 회전 없음 |
| 탭 | 신랑측 탭 → 열림(버튼 보임), 다시 탭 → 닫힘. 두 카드 모두 열기 → 둘 다 열림, 화살표 180deg |
| 모션 | 같은 카드를 두 번 열어 두 번 다 내용 opacity 0 → 100ms 무렵 0.7 → 1, 화살표 200ms 전환(`--ease-standard`) |
| reduced-motion | 클릭 직후(0ms 샘플) 이미 opacity 1, 화살표 180deg, 진행 중 애니메이션 0개 |
| JS 꺼짐 | `html.js` 없음, 탭으로 열고 닫힘 |
| 접근성 | summary 역할 DisclosureTriangle, 이름 "신랑측", expanded false. Tab으로 summary에 오면 `:focus-visible` 2px accent 링, offset 2px, Enter로 열림 |
| 복사 | 클립보드에 `110-335-546640`, `298702-04-213005`(주소·링크도 그대로) |
| 토스트 | 계좌 성공 "계좌번호가 복사되었습니다." 앞에 16px 체크 rgb(162,170,146), `role="status"` 낭독 같은 문구, 시각 토스트 `aria-hidden="true"`. 주소·링크 성공에도 체크. 복사 실패·카카오 폴백에는 체크 없음 |
| 버튼 체크 | 성공 라벨 체크 stroke rgb(91,106,70), 라벨 글자 rgb(142,85,88) 그대로 |
| 그 밖 | 가로 스크롤 없음(scrollWidth = 화면 폭), 끝까지 스크롤 후 숨은 reveal 0개, account reveal 그룹 3개(헤더, 신랑측 details, 신부측 details), 콘솔 오류 0건. `node --check script.js` 통과 |

화면으로 본 것: 닫힌 카드는 surface 면·line 테두리·16px 모서리의 낮은 막대 두 개로 정돈되어 보인다. 펼치면 라벨 아래 구분선, 계좌번호·예금주, 전체 폭 `복사하기` 버튼이 예전 카드와 같은 배치로 나온다. fixed BGM 토글이 화면 맨 위에 걸린 summary의 화살표 위에 잠시 겹칠 수 있다(다른 콘텐츠가 그 버튼 아래로 지나갈 때와 같은 일이고, summary는 나머지 폭 전체가 눌린다). 이번에는 손대지 않았다.

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/fe-account/`

- 접힘: `motion-390-collapsed.png`, `motion-360-collapsed.png`
- 펼침: `motion-390-expanded.png`, `motion-360-expanded.png`
- 토스트 + 버튼 체크: `motion-390-toast.png`, `motion-360-toast.png`
- 포커스 링(닫힘·열림): `motion-390-focus.png`, `motion-390-focus-open.png`
- reduced-motion: `reduced-390-*.png`, `reduced-360-*.png`

## 12. 오시는 길 지도 추가 (2026-10-12)

`00_user-input.md` 맨 아래 "오시는 길 지도 추가"만 반영했다. venue 섹션 밖에서는 카카오 키 위치와 공유 코드의 키 읽는 줄 하나만 바뀌었다.

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| index.html | `<head>`에 `<meta name="kakao-js-key">`를 두고 `#share-kakao`의 `data-kakao-key`를 지웠다. 장소 카드와 지도 버튼 사이에 `div.card.venue__map#venue-map[role=img][aria-label="더컨벤션 송파문정 위치 지도"]` > `div.venue__map-canvas[inert]`를 넣었다 |
| style.css | `.venue__map`: 위 여백 16px, `overflow: hidden`, `isolation: isolate`, `user-select: none`(5차 QA 추가: PC에서 지도를 더블클릭하면 가까운 버튼 글자가 선택되던 문제). 테두리·모서리·surface 면은 `.card` 그대로 쓴다. `.venue__map-canvas`: `width: 100%`, `aspect-ratio: 4 / 3`, `max-height: 280px`, `pointer-events: none`. `html:not(.js) .venue__map { display: none }` |
| script.js | `KAKAO_MAP_SDK_URL`, `MAP` 상수, `kakaoKey()`(공유와 지도가 같이 씀), `initVenueMap()`, 부팅 줄 `safe('venue-map', ...)`. `initKakao`는 키를 `kakaoKey()`로 읽는다 |

### 동작

- 로딩: IntersectionObserver(`rootMargin: 100% 0px`)로 지도 상자가 한 화면 거리 안에 들어오면 `sdk.js?appkey=…&autoload=false&libraries=services`를 한 번 붙이고 `kakao.maps.load` 뒤에 `services.Geocoder().addressSearch(#venue-address 글자)`로 위치를 찾는다. 그 전에는 `dapi.kakao.com` 요청이 없다. 로딩 중에는 `.card`의 surface 빈 면이 보인다.
- 지도: `level 4`, `draggable: false`, `scrollwheel: false`, `disableDoubleClickZoom: true`, `keyboardShortcuts: false`, `tileAnimation: false`, 컨트롤 없음, 예식장 마커 1개. 크기가 바뀌면(화면 회전) `relayout()` 뒤 `setCenter()`로 즉시 가운데를 맞춘다. `panTo`는 쓰지 않는다. reduced-motion에서도 따로 분기할 것이 없다.
- 실패: `sdk.js` 오류(401/403 포함), `kakao.maps.load` 없음, 주소 검색 결과 없음, 지도 생성 예외, 10초 안에 마커까지 못 그림 중 하나면 `#venue-map`에 `hidden`을 건다. 숨기면 카드와 지도 버튼 사이가 원래 16px로 돌아간다. 실패는 예상된 상태라 콘솔에 남기지 않는다.
- 확대 수준 근거: 카카오맵 4.5.28 본체의 정적 지도 코드가 `SCALE = 0.3125 * 2^level`(WCONG/px, 1 WCONG = 0.4m)이다. level 3은 1px당 약 1m라 390px 화면 지도(340 x 255)의 세로 반폭이 약 128m로 도보 3분 거리의 문정역이 빠질 수 있다. level 4는 약 2m/px로 약 680 x 510m를 보여 준다. 실제 화면에서 역이 안 보이거나 너무 멀어 보이면 `MAP.LEVEL`만 고친다.

### 실제 카카오맵 코드에서 확인한 것

- 4.5.28 본체는 지도 안쪽에 전체 크기의 판을 깔고 `touch-action:none`을 준다. `draggable: false`여도 그 판 위에서 쓸면 페이지가 스크롤되지 않는다. 로고는 `<a href="http://map.kakao.com/" target="_blank">`, 마커는 `<area href="javascript:void(0)">`라 키보드 포커스를 받는다.
- 그래서 지도를 그리는 `.venue__map-canvas`에 `inert`를 걸었다. inert 하위는 hit-test가 `pointer-events: none`처럼 동작해서 손가락이 바깥 `.venue__map`(touch-action auto)에 닿고, 포커스와 접근성 트리에서도 빠진다. `role="img"`와 이름은 바깥 상자가 가진다. inert를 지원하지 않는 브라우저를 위해 CSS `pointer-events: none`도 같이 뒀다.
- 로고·저작권 줄은 지도 왼쪽 아래(absolute, bottom 0, 바깥 여백 6px + 안쪽 여백 4px)에 붙는다. 16px 모서리 안쪽에 들어와 가려지지 않는다(재현 스텁 확대 캡처로 확인).
- `127.0.0.1`에서는 `sdk.js`가 `401 {"errorType":"AccessDeniedError","message":"domain mismatched! ..."}`를 돌려준다. Chrome은 이 JSON 응답을 ORB(`net::ERR_BLOCKED_BY_ORB`)로 막고 script `error` 이벤트를 낸다. 콘솔 오류 줄은 생기지 않았다.

### 확인 (headless Chrome CDP, DPR 2, 터치 에뮬레이션)

로컬 서버 `python3 -m http.server 8776 --bind 127.0.0.1`. Chrome이 Bash 샌드박스 안에서는 뜨지 않아 샌드박스를 끄고 실행했다. 성공 경로는 CDP `Fetch`로 `dapi.kakao.com`과 공유 SDK를 가로채 가짜 `kakao.maps`(load, LatLng, Map, Marker, services.Geocoder)와 가짜 `Kakao`를 돌려주고 확인했다. 가짜 지도는 위의 실제 동작(전체 크기 `touch-action:none` 판, `preventDefault`하는 non-passive 터치 리스너, 포커스 받는 로고·마커 링크)을 그대로 흉내 낸다. 검사 스크립트·결과·스크린샷은 scratchpad `fe-map/`에만 있다. 방명록(`*formspree*`) 요청은 모든 실행에서 막았다.

| 항목 | 결과 |
|---|---|
| 요청 시점 | hero 1.5초 동안 `dapi.kakao.com` 0건. 지도 상자 위쪽이 화면 아래 끝에서 971px(390x844) 떨어져 있을 때 0건, 721px일 때 1건. 이후에도 1건, `script[src*=dapi]` 1개 |
| 지도 생성 값 | level 4, draggable·scrollwheel false, disableDoubleClickZoom true, keyboardShortcuts false, tileAnimation false, 컨트롤 0, `panTo` 0. 주소 검색어 "서울 송파구 송파대로 155", 마커 1개 = 지도 중심 = 검색 결과 |
| 크기·배치 | 상자 = 컬럼 폭, 캔버스 = 상자 안쪽 폭. 360: 312 x 234.5, 390: 342 x 257, 430: 382 x 282(캔버스 280에서 멈춤). 카드 → 16px → 지도 → 16px → 버튼. 모서리 16px, 1px line 테두리, surface 면 |
| 세로 쓸기 | 지도 위로 160px 쓸어 올리면 페이지가 약 200px 스크롤, 가짜 지도의 터치 리스너 호출 0회 |
| 대조 실험 | 같은 페이지에서 inert와 pointer-events를 잠시 풀면 같은 쓸기에 스크롤 0px, 터치 리스너 13회, Tab이 로고 링크로 들어간다. 검사가 실제 차이를 잡는다는 뜻이다 |
| 탭 | 지도 가운데·로고 위치를 눌러도 지도 click 0, 로고 click 0, 주소 그대로. 포커스는 글자를 눌렀을 때와 같이 `<main tabindex="-1">` |
| 키보드·접근성 | 주소 복사 버튼에서 Tab → 네이버 지도(지도 건너뜀). 접근성 트리 role image, 이름 "더컨벤션 송파문정 위치 지도" |
| 회전 | 390 → 430 폭 변경 시 `relayout`·`setCenter` 각 1회 더, 캔버스 380px |
| reduced-motion | 지도 값 동일, 지도 안 애니메이션 0개, 상자 transition 0s |
| 카카오 공유 | 두 번 눌러도 공유 SDK 요청 1건·태그 1개, `Kakao.init` 1회(메타 키), `sendDefault` 2회(제목 og:title), 폴백 문구 없음. 지도 SDK는 다시 불리지 않음. 공유 SDK를 막은 회귀 실행에서는 예전처럼 링크 복사 폴백 |
| 실패 경로 | 실제 네트워크(401 → ORB) 360·390, 403 응답, 연결 거부, 주소 검색 결과 없음, 지도 생성 예외, `load` 무응답(9.8초에 숨김) 모두: 상자 `hidden`·높이 0, 카드와 지도 버튼 그대로, 카드 → 버튼 16px |
| JS 꺼짐 | 상자 `display: none`, `dapi.kakao.com` 0건 |
| 공통 | 모든 실행에서 가로 스크롤 없음(360/390/430), 끝까지 스크롤 후 숨은 reveal 0개, 페이지 코드의 콘솔 오류·경고·예외 0건. 기존 `fill-check/check.mjs` 사본으로 계좌·주소·링크 복사 회귀 통과. `node --check script.js` 통과 |

### 배포 후 사용자가 확인할 것

- 실제 지도 타일, 마커 모양, 로고·저작권 위치는 `127.0.0.1`에서 인증이 막혀 볼 수 없었다. 배포 주소에서 휴대폰으로 지도가 나오는지, 예식장 주변 길과 문정역이 함께 보이는지 본다.
- 지도 위를 손가락으로 위아래로 쓸었을 때 페이지가 스크롤되는지, 지도를 눌러도 아무 일이 없는지 본다.
- 지도가 안 나오고 주소 복사 버튼 바로 아래 지도 버튼이 붙어 있으면 카카오 디벨로퍼스에서 카카오맵 사용 설정과 Web 도메인 등록을 확인한다(2026-10-12 디자인 통일로 장소 카드는 없어졌다).

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/fe-map/`

- 성공(가짜 지도, 화면에 "STUB MAP" 표시): `venue-success-390.png`, `venue-success-360.png`, `venue-success-430.png`, `venue-success-390-reduced.png`
- 로고 모서리 4배 확대: `venue-success-{360,390,430}-logo-corner-x4.png`
- 실패: `venue-real-390.png`, `venue-real-360.png`(실제 401), `venue-fail-{403,net,zero,throw,hang}-390.png`
- JS 꺼짐: `venue-nojs-390.png`

## 13. 디자인 통일과 갤러리 순서 (2026-10-12)

`00_user-input.md`의 "디자인 통일"(D1~D4 모두 (a))과 감사 문서 `07_concept-director_design-audit.md`의 3장 통일 규칙·4장 수정 목록 M1~M18을 반영했다. 같은 날 오케스트레이터가 전달한 갤러리 순서 변경(파일 번호 순서 01~15)도 함께 넣었다. 문구, 사진, 캐러셀·lightbox 동작, 보케, 카카오맵 지도 동작, 계좌 접기, D-day, BGM은 그대로다. `script.js`는 주석 한 줄만 바뀌었다.

### 바꾼 범위 (수정 목록 기준)

| ID | 선택자 | 바꾼 것 |
|---|---|---|
| M1 (D1) | `.guestbook` | surface 배경 규칙을 지웠다. style.css 섹션 주석과 index.html 주석의 "(surface band)"도 지웠다. 입력 필드 면 `#FFFDFB`와 field_border 테두리는 그대로 |
| M2 (D2) | `.venue__card` → `.venue__info` | `card` 클래스를 빼고 이름을 바꿨다. 카드 padding 규칙을 지우고, 주소 복사 버튼은 `width: 100%; margin-top: 16px`. `#venue-address` id는 그대로(복사와 지오코딩이 읽는다). script.js 주석 "the venue card" → "the venue info" |
| M3 | `.venue__map` | 위 여백 16 → 24 |
| M4 | `.venue__name` | 굵기 700 → 400 (17px/1.6 그대로) |
| M5 | `.venue__address` | 위 여백 6 → 4, muted 색 삭제(text 상속), 줄 높이 1.6 → 1.7 |
| M6 (D4) | `.couple__role` | muted 500 → sage_deep 600 |
| M7 (D4) | `.gb-label` | text 500 → sage_deep 600 (14px/1.4 그대로) |
| M8 | `.venue__route` | 좌우 padding 4 → 0 |
| M9 | `.cal__caption-en` | eyebrow 모양(accent 13px 0.28em) → 표 제목(text 500 16px/20px, 0.16em, lining) |
| M10 (D3) | `.hero__date`, `.hero__time`, `.dday__count`, `.lb-counter` | `font` 단축 속성 **뒤에** `font-variant-numeric: lining-nums`. `.lb-counter`는 `lining-nums tabular-nums`(갤러리 카운터와 같게) |
| M11 | `.g-nav::before`, `.bgm-face` | 윤곽선 primary → accent |
| M12 | `.gb-input` | 모서리 10 → `var(--radius-card)`(16) |
| M13 | `.couple__line`, `.dday__message`, `.account__message p + p` | 줄 높이 1.9·1.8 → 1.95, 문단 사이 1em → 1.95em |
| M14 | `.section-note` | 위 여백 12 → 20 |
| M15 | `.cal`, `.dday`, `.venue__routes`, `.share .sprig`, `.share__thanks`, `.share__buttons` | 36·28 → 32 |
| M16 | `.lights`, `.gallery .sprig` | 장식 → 섹션 머리 20·32 → 24 |
| M17 | `.gb-form`, `.couple__list` | gap 18·14 → 16 |
| M18 | `.venue__route dd` | `text-wrap: pretty` 추가 |

감사 문서와 다르게 처리한 항목은 없다. 수정 목록에 없어서 손대지 않았지만 3장 규칙과 값이 다른 곳은 아래 셋이다. 화면 차이가 작아 concept-director 판단에 맡긴다.

- `.share__closing`의 위 여백 16px. R8 "섹션 제목 → 제목 밑 문장"은 20이다("Thank you" → 맺음말).
- `.share__buttons`의 gap 10px. R8 단계(8, 12, 16 …)에 없는 값이다.
- T7 라벨의 줄 높이가 1.6(`.couple__role`, `.venue__route dt`), 1.5(`.account__side`), 1.4(`.gb-label`, M7이 1.4로 지정)로 남아 있다. 모두 한 줄 라벨이라 글자 모양은 같다.

### 갤러리 순서

- index.html의 슬라이드 15줄을 파일 번호 순서로 옮기고 버튼 이름 "사진 n / 15 크게 보기: …"의 n을 새 위치로 다시 매겼다. 각 줄의 `data-full`, `data-w`·`data-h`, `src`·`srcset`, `width`·`height`, alt, 가로 클래스(`g-slide--landscape`, 02와 15)는 파일에 붙은 그대로 옮겼다. 옮기기 전에 15장 alt가 카피 시트 `gallery_alt` 표의 파일별 문장과 글자 단위로 같은지 확인했다.
- script.js는 바꾸지 않았다. 로딩 창(현재 −1 ~ +2)은 DOM 순서를 쓰고, lightbox 슬라이드 목록은 캐러셀 버튼에서 순서대로 만들어진다.

### 확인 (headless Chrome CDP, DPR 2, 터치 에뮬레이션)

로컬 서버 `python3 -m http.server 8780 --bind 127.0.0.1`. Chrome은 Bash 샌드박스 안에서 뜨지 않아 샌드박스를 끄고 실행했고, 끝난 뒤 서버와 Chrome을 모두 종료했다. 모든 실행에서 `*kakao*`, `*formspree*` 요청을 막았다. 카카오맵은 `127.0.0.1`에서 숨겨지므로 배치 확인용 스크린샷에서만 `#venue-map`의 `hidden`을 풀어 빈 4:3 카드로 자리를 채웠다(코드는 그대로). 실행: 360x780, 390x844, 430x932, 390x844 reduced-motion, 1280x900, 375x548.

| 항목 | 결과 (6회 실행 모두 같음) |
|---|---|
| 공통 | 가로 스크롤 없음(scrollWidth = 화면 폭, 상호작용 뒤에도), 끝까지 스크롤한 뒤 숨은 reveal 0 / 25, 페이지 콘솔 오류·경고·예외 0건, `node --check script.js` 통과 |
| 섹션 배경 | hero만 background, 나머지 9개 섹션 투명(`.page`의 background). guestbook 위치에서 보케 `running: []` |
| 독립 라벨 9개 | 신랑·신부, 지하철·주차·내비게이션, 신랑측·신부측, 성함·남기실 말씀 모두 Pretendard 600 14px `rgb(91, 106, 70)`(sage_deep) |
| 정보 값 | 주소, 교통 안내 3줄, 계좌번호 2줄 모두 `rgb(59, 45, 42)`(text). 주소·교통 안내 14px/23.8px |
| 섹션의 답 | `.calendar__when`, `.venue__name` 모두 Gowun Batang 400 17px/27.2px, 한 줄(360~1280) |
| eyebrow | 섹션 eyebrow 8개 + hero eyebrow: Cormorant 500 13px, 0.28em, accent. 달력 캡션은 16px, 0.16em, text로 구분되고 한 줄 |
| 버튼 윤곽선 | secondary pill 6개, 갤러리 이전·다음 `::before`, BGM 면 모두 1px `rgb(142, 85, 88)`(accent) |
| 버튼 폭 (390) | 주소 복사 342 = 컬럼 폭(360 312, 430 382), 지도 167 x 2, 계좌 복사 300(카드 안 전체), 링크 복사·카카오 공유·남기기 342 |
| 모서리 | 카드(지도·계좌 2) 16, 입력 필드 2개 16, pill 999, 원형 50%, 사진 4, summary 15 |
| 왼쪽 정렬 시작점 | 390: 교통편 라벨·값, 구분선, 방명록 라벨·필드 모두 x 24. 계좌 라벨·번호·예금주 x 45(카드 안쪽 20). 1280에서는 컬럼 왼쪽 400 기준으로 424 / 445 |
| 숫자 `font-variant-numeric` | `.hero__date`, `.hero__time`, `.cal__caption-en`, `.dday__count` = `lining-nums`. `.g-counter`, `.lb-counter`(와 안쪽 텍스트) = `lining-nums tabular-nums`. Pretendard 데이터 숫자(달력, 계좌, 주소)는 `normal` 그대로 |
| 본문 줄 높이 | 인사말, couple 두 줄, D-day 문구, 안내, 계좌 안내문, 방명록 안내문, 맺음말 모두 29.25px(1.95). 문단 사이 인사말·계좌 안내문 모두 29.25px |
| 간격 | couple 행 16, lights → eyebrow 24, 머리 → 일시 40, 일시 → 달력 32, 달력 → D-day 32, sprig → eyebrow(gallery) 24, 제목 → 안내 20, 장소명 → 주소 4, 주소 → 복사 16, 지도 버튼 → 교통편 32, 계좌 카드 사이 12, 필드 사이 16, 폼 → 맺음 16, share sprig → 모노그램 → Thank you → 버튼 32 / 32 / 32 |
| 지도 자리 | 주소 복사 버튼 → 지도 카드 24, 지도 → 지도 버튼 16. 지도가 숨겨지면 주소 복사 → 지도 버튼 16. 지도 카드 360 312 x 234.5, 390 342 x 257, 430 382 x 282 |
| 첫 화면 | 375x548 압축 규칙에서 장소 줄 아래 끝 y 501(< 548). 390x844 날짜 아래 227, 사진 537, 장소 659 |
| 회귀(실제 탭) | BGM 켜기(`aria-pressed` true, 재생, glow 링) → 끄기(false, 정지). 계좌 카드 하나 펼침 → 둘 다 → 둘 다 접힘. 주소 복사(클립보드 대체 함수에 "서울 송파구 송파대로 155", "복사했습니다" 라벨, 토스트 "주소를 복사했습니다."). 방명록 빈 제출 → "성함을 적어 주세요."·성함 `aria-invalid`·포커스 이동, 채워서 제출 → Formspree 차단으로 "말씀을 보내지 못했습니다. 잠시 후 다시 눌러 주세요." |
| 갤러리 순서·번호·alt | 15장 모두 n번째 슬라이드 = `n.jpg`(data-full, src, srcset), 버튼 이름 "사진 n / 15 크게 보기: {카피 시트 alt}", img alt = 카피 시트 문장, 가로 클래스는 2번·15번만, `data-w`·`data-h` = img `width`·`height`. 불일치 0건. lightbox 슬라이드 15장 alt 순서도 같다 |
| 초기 로딩 | 캐러셀이 1번일 때 `loading="eager"`는 1, 2, 3번(01, 02, 03). 끝까지 넘긴 뒤 15장 모두 eager |
| 끝까지 넘기기 | 다음 버튼 14번에 02 → 15 순서대로 한 장씩, "15 / 15"에서 다음 버튼 `aria-disabled="true"`, 한 번 더 눌러도 그대로. 이전 버튼 12번으로 1번까지 돌아와 이전 버튼 `aria-disabled="true"` |
| lightbox 왕복 | ① 15번에서 열기 → "15 / 15", 15.jpg alt → ← 두 번 → "13 / 15", 13.jpg alt → Esc → 캐러셀 "13 / 15", 포커스 "사진 13 / 15 크게 보기…" 버튼. ② 1번에서 열기 → lightbox 다음 버튼 두 번 → "3 / 15", 03.jpg alt → 닫기 버튼 → 캐러셀 "3 / 15", `html.lb-open` 해제 |
| reduced-motion | 위 항목 모두 같은 값. 숨은 reveal 0 |

화면으로 본 것: 오시는 길은 카드 없이 장소명·주소가 가운데 텍스트로 놓이고, 360에서는 주차 안내가 "…주차장으로 / 안내해 드립니다."로 끊긴다(`text-wrap: pretty`). 390과 430에서는 둘째 줄이 한 줄에 들어간다. 데스크톱 1280에서 방명록 구간도 480px 컬럼 경계가 이어진다. hero의 "2027 · 01 · 03", "SUNDAY · 3 PM", "JANUARY 2027", "D - 83", "15 / 15"는 모두 높이가 고른 숫자로 그려진다.

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/fe-unify/`

- 실행별 폴더: `shots-motion-360/`, `shots-motion-390/`, `shots-motion-430/`, `shots-reduced-390/`, `shots-motion-1280/`, `shots-motion-375/`(375x548)
- 각 폴더: `00-first-screen`, 섹션별 `01-hero` ~ `10-share`, `06b-venue-map-placeholder`(지도 자리 표시), `08b-account-expanded`, `11-bgm-on`, `12a-gallery-slide02`, `12b-gallery-slide15`, `12c-gallery-controls`, `13-lightbox-15`, `14-guestbook-invalid`, `15-guestbook-sent`, `full`(1x 절반 배율)
- 계산 스타일 원자료: `result-{motion,reduced}-{360,390,430,1280,375}.json`, 검사 스크립트 `check.mjs`
- 비교 대상: 감사 당시 화면 `design-audit/shots-390/`, 추천안 미리보기 `design-audit/preview-390/`

- 오케스트레이터 후속 수정(2026-10-12): 감사 문서 R8 여백 단계에 맞춰 `.share__closing` 위 여백 16 → 20(제목 → 제목 밑 문장), `.share__buttons` gap 10 → 8(버튼 사이). 6차 QA 뒤 `.account__side`·`.gb-label` 줄 높이를 컨셉 시트 label 규칙(1.6)으로 맞췄고(`.couple__role`은 이미 1.6), 방명록 textarea는 크기 조절 손잡이가 16px 곡선 모서리 위에 겹쳐서 `resize: none`으로 바꿨다(W10).

## 14. 공유하기와 맺음 섹션 분리 (2026-10-12)

`00_user-input.md` 맨 아래 "공유하기와 맺음 섹션 분리"와 카피 시트의 section_titles, `## share`(문구, share_buttons, kakao_share), `## closing`(monogram, thank_you, 날짜, 이름)을 반영했다. 사용자가 `index.html`에서 직접 고친 인사말 연 구분(4행 + 5행)은 건드리지 않았다. 보케의 모양과 수치는 바꾸지 않았다(개선안은 motion-designer가 따로 만들고 있다).

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| index.html | `#share` 하나를 둘로 나눴다. **10 공유하기** `section.share#share`(보케 구간 아님, 장식 없음): `.section-head.reveal`(eyebrow SHARE, `h2.section-title#share-title` 공유하기, `p.share__message` 2행) + `.share__buttons.reveal`(카카오톡 공유 primary, 링크 복사 secondary). 두 버튼의 마크업·id·data 속성은 그대로 옮겼다. **11 맺음** `section.closing.bokeh-zone#closing[data-bokeh=closing][aria-labelledby=closing-title]`: 보케 캔버스, sprig 인라인 SVG(그대로, `data-bokeh-exclude`), `.closing__mono.reveal`(wreath 모노그램 그대로, wreath `<img>`에 `data-bokeh-exclude`), `.closing__thanks.reveal`(`h2.closing__title#closing-title[lang=en]` Thank you, `p.closing__date[lang=en]` 2027.01.03, `p.closing__names[lang=en]` Inhyeok & Yumin). 맺음말 "끝까지 봐 주셔서 감사합니다. / 그날, 반갑게 뵙겠습니다."는 지웠다 |
| style.css | `.share__message`(T5 본문 Gowun Batang 400 15/1.95, 제목 → 문장 20), `.share__buttons`(grid, gap 8. 위 여백은 섹션 머리의 40이 맡는다). 하단 safe-area 패딩과 sprig 여백은 `.closing`으로 옮기고 sprig → 모노그램을 32에서 24로 바꿨다. `.share__thanks`·`.share__title` → `.closing__thanks`·`.closing__title`(값 그대로). 새 규칙 `.closing__date`(T13 표 제목: Cormorant Garamond 500 16/20, 0.16em, text, `lining-nums`, 왼쪽 0.16em 패딩으로 가운데 보정), `.closing__names`(Cormorant Garamond italic 400 22/1.4, text). `.share__closing` 삭제. 보케 구간 주석 |
| script.js | `BOKEH.ZONES`의 `share: 6` → `closing: 6`과 그 위 주석 한 줄. 보케 코드는 `data-bokeh` 이름으로 구간을 찾으므로 다른 줄은 그대로이고, `__bokeh.stats().zones`의 키가 `closing`이 된다 |

이름 글꼴: Google Fonts 링크에 Cormorant Garamond `1,400`(이탤릭 400)이 이미 들어 있다. 브라우저에서 `document.fonts.check('italic 400 22px "Cormorant Garamond"')`가 true이고 이탤릭 면 1개가 `loaded`다(가짜 기울임이 아니다).

### 여백 (감사 문서 R8)

| 섹션 | 값 |
|---|---|
| 공유하기 | 패딩 80 / eyebrow → 제목 10 / 제목 → 문구 20 / 머리 → 버튼 40 / 버튼 사이 8 / 패딩 80 |
| 맺음 | 패딩 80 / sprig → 모노그램 24 / 모노그램 → Thank you 32(블록 → 블록) / Thank you → 날짜 20(제목 → 제목 밑 문장) / 날짜 → 이름 8(나란한 한 쌍) / 패딩 80 + safe-area |

wreath.svg 위쪽에 여백이 있어 sprig와 화환 잎 사이는 24보다 넓어 보인다. 분리 전(32)에도 같았다.

### reveal 그룹 (모션 명세 2-0, 섹션당 최대 3)

- 공유하기: ① 머리(eyebrow, 제목, 문구) ② 버튼 두 개.
- 맺음: ① 장식 + 모노그램 ② Thank you + 날짜 + 이름. sprig는 지금까지처럼 `.reveal`에 넣지 않고 3-1 stroke-draw로만 등장한다(모션 명세 2-2·2-7 "sprig는 reveal 대상이 아니다"). 그래서 `.reveal` 요소는 `.closing__mono`와 `.closing__thanks` 둘이다. 390에서 맺음으로 한 번에 스크롤했을 때 sprig `.is-drawn`과 모노그램 `.is-visible`이 같은 표본(120ms)에서 함께 켜졌다.

### 명세 문서와 어긋나는 곳

- `04_motion-designer_motion-spec.md`는 아직 보케 구간을 `share`로 적고 있다(머리말 `zone_counts`, 1장 구간·슬롯·제외 영역 표, 1-7 `BOKEH` 참고 코드, 2-6·2-7, 3-1 위치, 8장 성능 예산, 10장 QA 체크리스트, 11장 한 줄 정리). 코드는 `closing`으로 바꿨고 수치는 같다. motion-designer가 개선안을 낼 때 함께 고치면 된다.
- 이 문서 3장·7장·13장, 감사 문서 R1·R2·R4의 `share` 보케·맺음말·safe-area·Allura 48 표기는 당시 기준 기록이다. 지금은 맺음(`#closing`)에 해당한다.

### 확인 (headless Chrome 154 CDP, DPR 2, 터치 에뮬레이션)

로컬 서버 `python3 -m http.server 8785 --bind 127.0.0.1`. Chrome은 Bash 샌드박스 안에서 뜨지 않아 샌드박스를 끄고 실행했고, 끝난 뒤 서버와 Chrome을 모두 종료했다. 모든 실행에서 `*kakao*`, `*formspree*` 요청을 막았다. 실행: 360x780, 390x844, 430x932(모션), 390x844 reduced-motion, 390x844 JS 꺼짐.

| 항목 | 결과 |
|---|---|
| 섹션 순서 | hero, greeting, couple, calendar, gallery, venue, notice, account, guestbook, share, closing (5회 모두) |
| heading | h1 1개, h2 10개(기존 9 + 공유하기). 맺음 h2는 "Thank you". `#share`·`#closing`의 `aria-labelledby`가 각 h2를 가리킨다 |
| 인사말 | 두 문단이 4행, 5행 그대로 |
| reveal·장식 | 끝까지 스크롤한 뒤 숨은 reveal 0 / 26(5회 모두). 맺음 sprig `.is-drawn`, 선 dashoffset 최대 0, 점 opacity 1, 남은 애니메이션 0. 시간 표본(390): 진입 전 줄기·잎 dashoffset 1, 끝 점 0 → 진입 120ms 뒤 `.is-drawn`·모노그램 `.is-visible` → 720ms 줄기 0.851 → 3.1초 모두 0, 끝 점 1 |
| 보케 | 보케 구간 hero, calendar, closing. 맺음 가운데: `running: ["closing"]`, 맺음 생존 최대 5(360·390)·6(430), `maxPeak` glow ≤ 0.278, primary ≤ 0.179. 공유하기가 띠 안에 있고 맺음 위끝이 띠 아래(85%)에 있을 때: `running: []`(360·390·430). 공유하기에는 캔버스·sprig·모노그램·`data-bokeh-exclude`가 없다. 맺음 제외 영역은 sprig, wreath |
| 링크 복사·카카오 폴백 | 링크 복사: 라벨 "복사했습니다", 토스트·상태 "청첩장 링크를 복사했습니다.", 클립보드 `og:url`. 카카오(SDK 차단): 토스트·상태 "카카오톡 공유를 열 수 없어 링크를 복사했습니다. 대화방에 붙여 넣어 주세요.", 클립보드 `og:url`. 360·390·430·reduced 모두 같음 |
| 버튼 폭 | 360 312, 390 342, 430 382 = 컬럼 폭. 순서 카카오 → 링크 복사 |
| 글자 | 문구 Gowun Batang 400 15px/29.25px text 가운데. Thank you Allura 400 48px accent. 날짜 Cormorant 500 16px/20px, 자간 2.56px(0.16em), text, `lining-nums`. 이름 Cormorant italic 400 22px/30.8px, text |
| 가로 스크롤 | 없음(scrollWidth = 화면 폭, 탭 뒤에도) |
| 콘솔 | 오류·경고·예외 0건(5회 모두) |
| reduced-motion | 숨은 reveal 0, sprig 완성 상태, calendar·closing 캔버스 `display: none`, hero 캔버스만 켜짐(정지 점), 맺음·공유하기·맨 위 모두 `running: []` |
| JS 꺼짐 | `html.js` 없음, 26개 reveal 모두 opacity 1, sprig 완성 상태, 공유하기·맺음 내용과 여백 모두 표시 |
| 문법 | `node --check script.js` 통과. script.js·style.css에 한글 0줄 |

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/fe-closing/`

- `shots/share-{motion-360,motion-390,motion-430,reduced-390,nojs-390}.png`
- `shots/closing-{motion-360,motion-390,motion-430,reduced-390,nojs-390}.png`
- 원자료 `result-*.json`, 검사 스크립트 `check.mjs`(구조·여백·보케·복사), `draw.mjs`(sprig 시간 표본)

## 15. 보케 B안: 작은 전구 불빛 (2026-10-13)

사용자가 보케를 "디스플레이가 눌린 자국 같다"고 지적했고 개선안 중 B안 "작은 전구 불빛"을 골랐다(`00_user-input.md` 맨 아래 "보케를 작은 전구 불빛으로"). 모션 명세 1장(2026-10-12 보케 B안, 전면 교체)과 10장 확인값을 반영했다. 보케만 바꿨고, 다른 섹션·문구·모션은 그대로다.

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| script.js | `/* ---------- Bokeh background (spec 1) ---------- */`부터 `/* ---------- Section reveal (spec 2-0) ---------- */` 바로 앞까지(이전 110-451행)를 명세 1-7 코드로 바꿨다(지금 110-520행). 이 블록은 명세 1-7 코드 블록, `scratchpad/bokeh-redesign/spec/bokeh-section.js`와 바이트 단위로 같다. 블록 밖은 한 줄도 바꾸지 않았다. 블록이 69행 길어져서 3장 표에서 보케가 아닌 행의 script.js 줄 번호(521행 뒤)는 69씩 밀렸다 |
| index.html | 1-3 표대로 `data-bokeh-exclude`를 8개 붙였다. `"text"` 6개: `.hero__top`, `.hero__bottom`, calendar `.section-head[data-lights-trigger]`, `.calendar__when`, `.dday`, `.closing__thanks`. 값 없음 2개: `.scroll-cue`, `.cal`. wreath `<img>`의 속성은 `.monogram`으로 옮겼다. `.hero__photo`, `.lights`, closing `.sprig`는 그대로다 |
| style.css | 바꾸지 않았다(아래) |

### 블록 밖 코드를 그대로 둔 근거

- `initBokeh()`가 돌려주는 객체의 키는 `pause`, `resume`, `openHeroGate`, `toStatic`, `toLive`, `stats`로 이전과 같다. 블록 밖에서 이 객체를 쓰는 곳은 `initHero`의 `bokeh?.openHeroGate()`(587행), lightbox의 `bokeh?.pause('lightbox')`·`resume('lightbox')`(1009·1033행), 부트의 `toStatic`·`toLive`(1586·1588행), `window.__bokeh`의 `BOKEH`·`stats()`(1593행)뿐이다.
- 새 블록이 쓰는 파일 위쪽 헬퍼는 `rand`와 `isReduced`다. 옛 블록이 쓰던 `clamp`는 캐러셀·lightbox·BGM에서 계속 쓰므로 남는다. 옛 블록에만 있던 `BOKEH_STATIC`, `sprites` 객체, `maxPeak`는 블록 밖 참조가 0건이다.
- motion-designer의 시험 사이트(`scratchpad/bokeh-redesign/site-spec/`)와 비교했다. 바꾼 script.js는 시험용 훅(`__bz`, `__bokehPerf`, `__bokehMem`, `__bokehSim`)을 뺀 것과 같고, index.html과 style.css는 같다.

### CSS를 바꾸지 않은 이유

`.bokeh-zone`(relative, isolate), 캔버스(absolute, inset 0, 100%, z-index 0, `--dur-zone-fade` opacity 페이드, `.is-intro`는 `--dur-bokeh-intro`), reduced에서 calendar·closing 캔버스 `display: none`이 명세 1-1·1-5·1-6 요구와 같다. 캔버스 픽셀 크기는 JS가 DPR로 맞추고 CSS 크기는 100%라서 DPR 상한 변경(1 → `min(dpr, 2)`)에도 CSS가 필요 없다. `data-bokeh-exclude`를 선택자로 쓰는 CSS 규칙도 없다.

### 명세와 다르게 처리한 부분

코드에는 없다. 확인 방법만 명세 10장과 조금 다르다.

- 9번(성능): DevTools Performance 대신 CDP로 rAF를 감싸, 보케 캔버스에 그린 콜백 수와 콜백 시간을 쟀다(`Page.addScriptToEvaluateOnNewDocument`로 주입, script.js는 그대로).
- 3번 탭 숨김: `document.hidden`·`visibilityState`를 덮어쓰고 `visibilitychange`를 보내 흉내 냈다(motion-designer `stop.mjs`와 같은 방식).
- 3Hz 미만: 설정값 대조에 더해 그려진 픽셀로 쟀다. 매 프레임 캔버스에서 불빛마다 가장 진한 알파(= 밝기)를 따라가며, 0.1 이상 오르내림의 방향이 바뀐 시각을 셌다.

### 확인 (headless Chrome CDP, 터치 에뮬레이션)

로컬 서버 `python3 -m http.server 8786 --bind 127.0.0.1`. Chrome은 Bash 샌드박스 밖에서 실행했고, 끝난 뒤 서버와 Chrome을 모두 종료했다. 모든 실행에서 `*kakao*`, `*formspree*` 요청을 막았다.

명세 10장 자동 확인 9항목. 화면은 390x664 DPR 3, 375x548 DPR 2, 360x700 DPR 3, 430x750 DPR 3, 1280x900 DPR 1(데스크톱)이다.

| # | 항목 | 결과 |
|---|---|---|
| 1 | 구간별 10초, 250ms마다 `stats()` 40회 | 5개 화면 × 3구간 모두 구간 최대 생존 8, `living` 최대 8, `excludeHits` 0, `pairHits` 0, `running`은 그 구간 하나. `minExcludeGap` 최솟값 14.8(390x664 calendar) ~ 24.1px(390x664 closing), 모두 13.0 이상 |
| 2 | 멈춤 위치(머리, 머리 + 200px, 1.3초 뒤) | gallery·venue·notice·account·guestbook에서 5개 화면 모두 `[]`. couple → `["calendar"]`, 공유하기 → `["closing"]`, 1280x900의 greeting + 200 → `["calendar"]`(1-4가 적은 의도한 동작). greeting 머리 `[]` |
| 3 | 탭 숨김, lightbox | 5개 화면 모두 숨김 동안 `[]`이고 1.5초 동안 그린 프레임 0, 보이면 `["hero"]`. lightbox 열린 동안 `[]`, 프레임 0, 닫으면 `["hero"]`(scrollY 0 그대로) |
| 4 | 캔버스 픽셀 크기 | 5개 화면 모두 `round(섹션 크기 × min(dpr, 2))`와 같다. 390x664: 780x1328 / 780x1684 / 780x986(합계 11.9MB). 375x548: 750x1096 / 750x1684 / 750x986(10.8MB). 360x700: 720x1400 / 720x1684 / 720x986(11.2MB). 430x750: 860x1500 / 860x1684 / 860x986(13.7MB). 1280x900: 480x900 / 480x842 / 480x493(4.1MB). 명세 1-8 표와 같다 |
| 5 | reduced 로드 2.5초 뒤 | 390x664·375x548: `still` 7, `running` `[]`, `excludeHits` 0, `pairHits` 0, `minExcludeGap` 13.2 / 13.9px. calendar·closing 캔버스 `display: none`, hero 캔버스 opacity 1 |
| 6 | reduced 두 번 로드(캐시 끔) | hero 캔버스 픽셀 서명이 같다(390x664 `10648:328324978`, 375x548 `8608:327588356`) |
| 7 | reduce → no-preference → reduce(새로고침 없음) | no-preference에서 `running ["hero"]`, `still` 0. 다시 reduce에서 `still` 7, 서명이 6번과 같다. 실제 클릭으로 켠 BGM이 전환 내내 `paused: false`, `currentTime` 1.12 → 2.63 → 3.47초로 계속 늘었다 |
| 8 | `BOKEH` 대조 | `__bokeh.config`가 명세 1-7 `BOKEH`와 JSON으로 같다. 없어진 키(`D_MIN`, `D_MAX`, `CENTER_D_MAX`, `EDGE_BIAS`, `EDGE_BAND`, `GLOW_RATIO`, `ALPHA`, `BREATH`, `DPR`), `BOKEH_STATIC`, `primary`, `ctx.filter`, `shadowBlur`가 script.js에 없다(grep) |
| 9 | 성능, 구간마다 5초 | 390x664 DPR 3·375x548 DPR 2, CPU 1x와 4x throttle 모두 30.0fps(5초에 150프레임). 보케 rAF 콜백 최대 0.2~0.3ms(1x), 0.2~0.7ms(4x) |

3Hz 미만: 390x664 DPR 1에서 구간마다 20초(표본 1,201개, 불빛 18~19개 추적). 밝기 반전 사이 최단 간격은 hero 1,133ms, calendar 800ms, closing 700ms였다. 가장 빠른 오르내림이 0.71Hz이고, 1초 안의 반전은 최대 2번(깜빡임 1회/초)이다. 반짝임 단독 최고치(0.42Hz)보다 빠른 값은 페이드(1.2초)와 반짝임이 겹치는 순간에서 나왔다. 3Hz보다 한참 낮다.

회귀 확인: 360x780, 390x844, 430x932(모션), 390x844 reduced-motion, DPR 2.

| 항목 | 결과 |
|---|---|
| 가로 스크롤 | 4회 모두 처음·끝·조작 뒤 scrollWidth = 화면 폭 |
| 콘솔 | 4회 모두 오류·경고·예외 0건. 위 9항목 실행에서도 페이지 오류 0건이다. reduced 실행의 `getImageData` willReadFrequently 경고는 확인 스크립트가 캔버스를 읽어서 난 것이다. 처음 회귀 실행에서 복사 버튼을 `.click()`으로 눌렀을 때 `navigator.vibrate` 차단 안내가 1건 떴는데, 사용자 활성화가 없는 가짜 클릭 때문이었다. 실제 탭(`Input.dispatchTouchEvent`)으로 바꾸자 0건이다 |
| reveal | 끝까지 스크롤한 뒤 숨은 reveal 0(4회) |
| 갤러리 캐러셀·lightbox | 다음 두 번 → 3, 이전 → 2, `.g-status` "15장 중 2번째 사진, …". 2번을 열면 lightbox "2 / 15", 다음 → "3 / 15", 닫으면 캐러셀 3, 포커스는 "사진 3 / 15 …" 버튼. lightbox 동안 보케 `[]` |
| 계좌 접기·복사 | 신랑측을 누르면 `[true, false]`, 복사(실제 탭) → 클립보드 "110-335-546640", 토스트·상태 "계좌번호가 복사되었습니다.", 버튼 `.is-copied`. 다시 누르면 접힘 |
| 맺음 stroke-draw | `.is-drawn`, 선 9개 dashoffset 최대 0, 점 3개 opacity 1 |
| 속성 수 | `[data-bokeh] [data-bokeh-exclude="text"]` 6개, 값 없는 것 6개(`.hero__photo`, `.scroll-cue`, `.lights`, `.cal`, `.sprig`, `.monogram`), wreath `<img>`에는 없음 |
| 문법 | `node --check script.js` 통과. script.js·style.css에 한글 0줄 |

### 알아 둘 점 (고치지 않음)

- `stats().zones`는 구간이 꺼져 있어도 슬롯에 남은 불빛 수를 센다. reduced에서 `living` 0인데 `zones`가 hero 8, calendar 7, closing 8로 나온다. 명세 1-7 코드 그대로의 동작이고, 10장 확인값(1번은 모션 상태의 각 값 ≤ 8, 5번은 `still`·`running`)과 어긋나지 않는다.
- 14장 "명세 문서와 어긋나는 곳"의 `share` 표기는 이번 명세 개정으로 `closing`이 되어 해소됐다.

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/fe-bokeh/`

- `shots/{hero,calendar,closing}-f0~f3.png`: 390x844 DPR 2, 1초 간격 연속 프레임. `bokeh-redesign/shots/site-b/`와 같은 화면 크기·스크롤 위치
- `shots/{hero,calendar,closing}-zoom0~1.png`: 불빛 3배 확대
- `shots/hero-reduced.png`: reduced-motion 정지 불빛 7개
- site-b 시험 화면과 비교: 흰 심과 금빛 후광, 크기, 개수(구간 7~8개), 글자 줄·hero 사진·장식·hero BGM 버튼과 떨어진 배치, 프레임 사이에 한두 개가 켜지고 꺼지는 모습이 같다. 불빛 자리는 무작위라 다르다
- 원자료 `out-*.json`(1~4·9번), `reduced-*.json`(5~7번), `flicker-390x664.json`(3Hz), `regress-*.json`(회귀). 스크립트 `cdp.mjs`, `measure.mjs`, `reduced.mjs`, `flicker.mjs`, `regress.mjs`, `shoot.mjs`, `reduced-shot.mjs`

## 16. 방명록 공개 목록 (2026-10-13)

`00_user-input.md` 맨 아래 "방명록 글 목록 공개 착수"와 설계 `08_guestbook-list-design.md` 2~4장(API)·6장(프런트엔드), 카피 시트 `## guestbook`(키 이름과 문구 그대로), 모션 명세 4-8-1, 감사 문서 R1~R9를 반영했다. 오케스트레이터가 정한 결정 6가지(아래)가 설계 문서보다 우선한다. `apps-script/guestbook.gs`는 고치지 않았다(찾은 점은 아래에 적었다). 방명록 밖의 코드는 reduced-motion 누름 규칙의 선택자 한 줄만 바꿨다.

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| index.html | `<head>`에 `<meta name="guestbook-endpoint">`(실제 웹 앱 URL). `.gb-form`에서 Formspree `action`·`method`와 `_subject` 숨은 입력을 지우고 `hidden`을 붙였다(script.js가 준비를 마치면 푼다). 폼에 비밀번호 칸(`type=password`, `autocomplete=new-password`, `minlength=4`, `maxlength=20`, 도움말 `#gb-password-help`를 `aria-describedby`로 연결)과 함정 칸(`.gb-trap[aria-hidden=true]` 안의 `name=website`, `tabindex=-1`, `autocomplete=off`, 라벨 "이 칸은 비워 두세요.")을 더했다. 공개 안내 `p.guestbook__note#gb-note`(4행)는 폼 아래에서 남기기 버튼 바로 위로 옮기고, 버튼의 `aria-describedby`로 이었다. 폼 아래 `.gb-board[hidden]`: `.gb-board__head.reveal`(h3 `#gb-list-title[tabindex=-1]` "남겨 주신 말씀", `.gb-list-state` 문구 + "다시 불러오기"), `ul.gb-list`, "말씀 더 보기" `.gb-more`, `.gb-more-status[role=status]`(17장에서 지우고 페이지 번호 줄로 바꿈). `<noscript><p class="gb-noscript">`. `ui-text`에 방명록 키 24개를 더하고 `gb-sending`·`gb-success`·`gb-failed`를 새 문구로 바꿨다 |
| style.css | 9장 블록(797~976행): `.guestbook [hidden]`(`.btn`·`.gb-form`의 `display`가 UA의 `[hidden]` 규칙을 이기므로), `.gb-noscript`·`.gb-help`(T8), `.gb-trap`(화면 밖 -9999px. `.page`가 잘라서 가로 스크롤이 생기지 않는다), `.guestbook__note`(폼 안 가운데 T8, 위 여백은 폼 gap 16). 목록: `.gb-board` 위 32(블록 → 블록), h3 Gowun Batang 700 17px/1.6 text, 상태 문구 T8 위 20, 다시 불러오기·더보기(17장에서 지움) secondary 전체 폭 위 16, 교통편과 같은 구분선 목록(`.gb-list` 위 선, `.gb-item` 위아래 16, 아래 선). 항목: 성함 T7(sage_deep 600 14/1.6), 날짜 T8(muted), 말씀 T6(400 14/1.7, `white-space: pre-line`), 긴 글자는 `overflow-wrap: anywhere`. 삭제 텍스트 버튼(accent 500 14, 44x44 이상, 글자 끝이 컬럼 가장자리). 삭제 펼침(라벨 → 필드 8, 오류 문구 위 8, 취소·삭제하기 secondary 2분할 gap 8, 위 16). 4-8-1 모션 규칙(966~976행). 공통 reduced-motion 블록의 누름 규칙 선택자에 `.gb-item__delete:active`를 더했다 |
| script.js | 맨 위 `GB` 상수(29행). `guestbookRequest`를 더하고 `initGuestbook`을 다시 썼다(1516~1884행). 다른 init 함수와 부트 순서는 그대로다 |

### 결정 사항 반영

1. **커서 보정(17장에서 없앰: 목록 전체를 받아 id로 거른다):** 로컬 `nextCursor`를 새 글이 성공하면 +1, 삭제가 성공하면 -1 한다. 더보기로 받은 항목 중 이미 보이는 id(`Set`)는 버린다. `not_found`로 항목을 뺄 때도 -1 한다. 그 글도 이 페이지가 받을 때는 서버 목록 앞쪽에 있었으므로 이유가 같다.
2. **공개 안내 위치:** 폼 안, 남기기 버튼 바로 위다. 버튼의 `aria-describedby="gb-note"`로 화면 낭독기도 버튼에서 안내를 함께 읽는다.
3. **오류 처리:** `duplicate`이면 `gb-error-duplicate`를 보이고 목록 첫 페이지를 다시 불러온다(입력값 유지). 삭제 `not_found`이면 항목을 목록에서 빼고 `gb-error-not-found`를 알린다. 응답 `entry`가 `null`이면 목록에 넣지 않는다(겉으로는 `gb-success`, 입력칸 비움).
4. **불러오는 시점:** 섹션에 IntersectionObserver(`rootMargin: '100% 0px'`)를 걸었다. `initVenueMap`과 같은 방식이다. IntersectionObserver가 없는 브라우저는 바로 불러온다.
5. **XSS:** 하객 글(성함, 말씀)은 모두 `textContent`로 넣는다. 삭제 버튼 이름은 `setAttribute('aria-label', …)`다. 하객 글이 `innerHTML`·`insertAdjacentHTML`로 들어가는 곳은 없고, `richText`는 템플릿 문구에만 쓴다.
6. **Formspree 정리:** `action`과 `_subject`를 지웠다. 세 파일에 `formspree` 0건이다.

### 동작 요약

- **요청:** 목록은 `GET ?action=list&limit=20&cursor=N`이다(17장: `limit=50`으로 `nextCursor`가 null이 될 때까지). 새 글과 삭제는 `POST`에 `Content-Type: text/plain;charset=utf-8`, 본문은 JSON 문자열이다(CORS 사전 요청 없음). `credentials: 'omit'`, `cache: 'no-store'`이고, `AbortController`로 15초에 끊는다. 결과는 JSON의 `ok`·`error`로만 판단하고, 네트워크 오류·JSON이 아닌 응답·시간 초과는 모두 "그 밖의 실패"로 본다.
- **새 글:** 검증 순서는 성함 → 말씀 → 비밀번호다(비었으면 `gb-password-empty`, 4자 미만이면 `gb-password-short`). 첫 오류 칸에 `aria-invalid`를 붙이고 포커스를 옮긴다. `elapsed`는 폼이 처음 화면에 보인 시각(IntersectionObserver)부터 잰다. 성공하면 입력칸을 비우고 `gb-success`를 보이고, 응답 `entry`를 목록 맨 위에 넣는다(그 항목만 250ms 페이드, 포커스·스크롤 이동 없음). `rate_limited`·`duplicate`·`closed`는 각 문구, 나머지 실패는 `gb-failed`이고 입력값은 남긴다.
- **목록:** 첫 페이지(다시 불러오기와 `duplicate` 뒤 재로드 포함)는 목록 전체를 바꾼다. 늦게 도착한 이전 응답은 순번(`listSeq`)으로 버린다. 글이 없으면 `gb-list-empty`, 실패하면 `gb-list-failed`와 다시 불러오기 버튼이다. 다시 불러오기를 누르면 포커스를 목록 제목으로 옮기고, 또 실패하면 버튼으로 돌린다.
- **더보기(17장에서 없앰):** `nextCursor`가 있을 때만 보인다. 요청 중에는 `disabled`와 라벨 `gb-list-loading`이다. 성공하면 새로 붙은 항목만 페이드하고 포커스는 새 첫 항목(`li[tabindex=-1]`)으로 간다. 실패하면 버튼 바로 아래에 `gb-list-failed`(`role=status`)를 보이고, 버튼을 다시 누르면 재시도다.
- **본인 삭제:** "삭제" 버튼(`aria-label` "{name}님의 글 삭제", `aria-expanded`, `aria-controls`)을 처음 누를 때 그 항목 안에 펼침 폼을 만든다. 항목마다 비밀번호 칸을 미리 만들지 않는다. 열면 포커스는 비밀번호 칸이고, 열려 있던 다른 펼침은 즉시 닫힌다. 취소, Esc, "삭제"를 다시 누르면 즉시 닫히고 포커스는 그 "삭제" 버튼이다. 비밀번호가 비면 `gb-delete-password-empty`, 4자 미만이면 요청 없이 `gb-error-wrong-password`다. 요청 중에는 확인·취소가 `disabled`이고 라벨은 `gb-deleting`이다. `wrong_password`·`too_many_attempts`는 문구를 보이고 칸을 비우고 `aria-invalid`를 붙이고 칸으로 포커스를 옮긴다. 그 밖의 실패는 `gb-delete-failed`이고 칸을 그대로 둔다. 성공과 `not_found`는 `inert` + 200ms 페이드 뒤 항목을 지우고, 포커스는 다음 항목, 없으면 목록 제목으로 간다. 마지막 글이 사라지면 `gb-list-empty`다.
- **날짜:** `createdAt`을 KST로 바꿔 화면에는 "2026. 10. 13."(`aria-hidden`), 화면 낭독기에는 `gb-date-sr` "2026년 10월 13일"(`sr-only`)을 `<time datetime>` 안에 둔다.
- **JS 꺼짐:** 폼과 목록은 `hidden` 그대로이고 `<noscript>` 안내만 보인다. JS는 켜졌는데 script.js가 실패한 경우에도 폼이 숨겨져 있으므로, 비밀번호가 주소창 쿼리로 나가는 일반 폼 제출이 생기지 않는다.

### 설계·명세에 없던 것을 정한 부분

| 항목 | 정한 것 | 이유 |
|---|---|---|
| 목록 제목 h3 모양 | Gowun Batang 700 17px/1.6, text, 가운데 | 감사 문서 R4는 "섹션 안 소제목은 한 단계 낮춘다"고만 적었다. T2(20px)보다 한 단계 아래로 T4와 같은 17px에 굵기로 제목을 표시했다. concept-director가 다르게 정하면 `.gb-list-title` 한 규칙만 고치면 된다 |
| 삭제 성공·`not_found` 알림 | 기존 토스트 + 상태 영역(`notify()`). 성공에만 체크 아이콘 | 설계 6-2는 "결과를 알린다"고만 적었다. 항목이 사라지면 그 안의 문구도 사라지므로 항목 밖의 토스트를 썼다. 토스트 모션은 4-4 그대로다 |
| 더보기 실패 문구 위치(17장에서 없앰) | 버튼 바로 아래 `.gb-more-status` | 목록 머리의 상태 문구는 20건 위에 있어서 누른 자리에서 보이지 않는다 |
| 삭제 텍스트 버튼 누름·hover | 누름 `scale(0.97)` 120ms(reduced는 opacity 0.85), hover는 밑줄 색 transparent → accent | 모션 명세 5장 "모든 버튼"과 "텍스트 링크" 행 |
| 펼침 Esc 닫기 | 취소와 같은 동작 | 키보드 사용자가 펼침을 닫는 방법 |
| 포커스 복귀 | 요청 중 `disabled`가 된 버튼이 포커스를 잃으면 요청이 끝난 뒤 그 버튼으로 되돌린다 | 시험에서 남기기 요청 중 Chrome의 `activeElement`가 `<body>`였다 |

### 모의 서버 (QA가 다시 쓴다)

위치: `/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/gb-mock/` (저장소에 넣지 않음)

- **`server.mjs`:** `apps-script/guestbook.gs`를 `node:vm`으로 그대로 실행하고 Google 서비스만 대역으로 만들었다. `SpreadsheetApp`(메모리 행 배열, `appendRow`, `getDataRange().getValues()`, `getRange(r,c,h,w).setValues()`, 앞에 붙은 작은따옴표는 저장할 때 떼고 텍스트로 둔다), `CacheService`(TTL, 값이 100KB를 넘으면 예외), `LockService`, `Utilities`(`computeDigest`는 Java처럼 부호 있는 바이트, `base64Encode`, `getUuid`, `formatDate`, `DigestAlgorithm`, `Charset`), `MailApp`(콘솔과 상태에 기록), `PropertiesService`(`NOTIFY_EMAIL`, `MAIL_SUBJECT`, `CLOSED`), `ContentService`.
- **HTTP 모양:** API 포트(`--port`, script.google.com 역할)의 `/macros/s/<id>/exec`에 GET·POST가 오면 스크립트를 끝까지 실행한 뒤 `302`(+ `Access-Control-Allow-Origin: *`)로 echo 포트(`--port` + 1, script.googleusercontent.com 역할, 다른 출처)에 보낸다. echo는 JSON을 ACAO `*`와 함께 200으로 준다. OPTIONS에는 CORS 헤더 없는 405로 답하므로, 실수로 `application/json`으로 보내면 브라우저에서 실패한다.
- **사이트 포트(`--site-port`):** 작업 트리를 그대로 서빙하고 `index.html`의 `guestbook-endpoint` 값만 모의 서버로 바꿔 준다. 바꾼 결과에 `script.google`이 남아 있으면 500으로 거부한다. 실제 `index.html`은 건드리지 않는다.
- **실행:** `node server.mjs --port 8790 --site-port 8792 [--seed N]` → 브라우저는 `http://127.0.0.1:8792/`. 8791은 echo 포트라 비워 둔다.
- **시험 옵션**(실행 인자. 실행 중에는 `POST /__mock/config`로 바꾼다)
  - `--delay MS`, `--delay-on list,create,delete`: 스크립트는 실행하고 응답만 늦춘다("저장됐는데 응답을 못 받은" 경우, 15초 시간 초과 시험).
  - `--fail network|server|html`, `--fail-on …`: 연결 끊기 / `{ok:false,error:'server'}` / CORS 헤더 없는 HTML 오류 페이지.
  - `--sheet-error`: 시트 대역이 예외를 던져 gs의 catch 경로로 `server`가 나온다.
  - `--closed`, `--mail-fail`, `--seed N`(Guest 01이 가장 최신, 비밀번호 `--seed-password` 기본 1234).
- **관리:** `GET /__mock/state`(행, 메일, 요청 기록(비밀번호는 길이만), 캐시 키), `POST /__mock/reset {seed}`, `/__mock/cache/clear`, `/__mock/hide {id}`(두 사람이 시트에서 숨김, 캐시는 지우지 않음), `/__mock/create {name,message,password}`(다른 하객의 글), `/__mock/append {row}`(손으로 넣은 행).
- **시험 스크립트:** `cdp.mjs`(headless Chrome CDP. `*kakao*`, `*formspree*`, `*script.google.com*`, `*script.googleusercontent.com*`를 막는다. `intercept`를 주면 Google 요청을 `Fetch.fulfillRequest`로 모의 서버 응답으로 채워서 네트워크에 나가지 않는다), `gb-test.mjs <시나리오…|all>`(아래 표), `smoke.mjs`, `nojs-shot.mjs`. `realpage` 시나리오에는 저장소 루트를 서빙하는 `python3 -m http.server 8793 --bind 127.0.0.1`이 더 필요하다.
- **주의:** 예전 `qa7/*.mjs`는 `*kakao*`, `*formspree*`만 막는다. 실제 `index.html`(예: :8787)에 그대로 돌리면 방명록 근처로 스크롤할 때 실제 웹 앱으로 목록 요청이 나간다. 모의 사이트(:8792)에 돌리거나 막을 URL에 `*script.google.com*`을 더해야 한다.

### 확인 (headless Chrome CDP, DPR 2, 터치 에뮬레이션)

실제 웹 앱 URL에는 요청을 한 건도 보내지 않았다. `realpage` 밖의 시나리오는 모의 사이트(:8792)에서 Google 주소를 막고 돌렸다. `realpage`는 실제 `index.html`(meta 그대로)을 열고, Google로 가는 요청을 CDP `Fetch`에서 모두 멈춰 모의 서버 응답으로 채웠다(멈춘 요청 수 = Google 요청 수). Chrome과 서버는 Bash 샌드박스 밖에서 실행했다.

| 시나리오 | 결과 | 확인한 것 |
|---|---|---|
| lazy (360x640, 390x844, 430x932) | 12/12 | 첫 화면 2.6초 동안 웹 앱 요청 0건. 150px씩 스크롤하면 첫 목록 요청은 섹션 위끝이 화면 높이의 1.80~1.99배 아래에 있을 때(한 화면 앞) 1건. 콘솔 0건 |
| realpage | 8/8 | meta가 실제 URL. 첫 화면 `script.google` 요청 0건. 실제 URL 경로로 목록·새 글·삭제 동작(302 → googleusercontent, 다른 출처 리다이렉트). 요청은 GET 목록과 POST text/plain뿐, OPTIONS 없음 |
| form | 26/26 | 공개 안내가 폼 안 남기기 바로 위 + `aria-describedby`. Formspree `action`·`_subject` 없음. 비밀번호·함정 칸 속성. 빈 성함(공백만 포함)·빈 말씀·빈 비밀번호·3자 비밀번호 → 각 문구, `aria-invalid`, 포커스, 요청 0건. 성공: "남기는 중…" + disabled → `gb-success`, 입력칸 비움, 맨 위 항목(서버가 정리한 말씀), 날짜 KST와 낭독 문장, 포커스는 남기기 버튼 그대로, `pre-line`, `elapsed` ≥ 3000, `website` 빈 값, 행 1·메일 1. XSS: `<img src=x onerror=alert(1)>`, `<script>alert(2)</script><b>bold</b>`, `onerror="document.title=…"`가 글자로만 보이고 목록 안 img·script·b 0개, dialog 0, `document.title` 그대로. 삭제 버튼 이름도 원문 그대로. 같은 성함·말씀 다시 → `gb-error-duplicate`, 입력 유지, 목록 다시 불러옴 |
| bots | 3/3 | 폼이 보이자마자 제출(`elapsed` < 3000), 함정 칸 채움: 둘 다 저장 0, 메일 0, 목록 그대로, 겉으로는 `gb-success` |
| delete | 16/16 | 펼침 `aria-expanded`·`aria-controls`, 비밀번호 칸 포커스, 라벨·버튼 문구. 다른 항목을 열면 앞 것 닫힘. Esc·취소 → 즉시 닫힘, 포커스 "삭제" 버튼. 빈 칸·2자 → 요청 없이 문구. 틀림 → 문구, 칸 비움, `aria-invalid`, 포커스, 버튼 복구. 맞음 → `inert` + 페이드 → 제거, 포커스 다음 항목, 토스트·상태 "글을 삭제했습니다.", 시트 `deleted`. 6번 틀리면 5번째까지 `wrong_password`, 6번째 `too_many_attempts`, 그 뒤에는 맞는 비밀번호도 거부. 두 사람이 숨긴 글 삭제 → `not_found` → 목록에서 빠짐, "이미 삭제된 글입니다.", 포커스 다음 항목. 마지막 글 삭제 → 포커스 목록 제목, `gb-list-empty` |
| more (45건, 17장에서 시나리오를 pages·pagedelete·pagefetch로 바꿈) | 11/11 | 첫 페이지 20건 + 더보기. 내 새 글 1건과 다른 하객 글 1건 뒤 더보기: 커서 21, 겹친 Guest 20은 버리고 Guest 21~39가 붙음(빠짐·중복 없음), 포커스 Guest 21. Guest 05 삭제 뒤 더보기: 커서 40, Guest 40~45. 최종 목록이 Mine + Guest 01~45(05 제외)와 정확히 같고 더보기 숨김. 보낸 커서 0, 21, 40. 요청 중 라벨 "말씀을 불러오는 중입니다." + disabled. 더보기 실패 → 버튼 아래 `gb-list-failed`, 라벨 복구, 포커스 유지 → 다시 누르면 성공하고 문구가 지워짐 |
| failures | 11/11 | 첫 목록 `server` → `gb-list-failed` + 다시 불러오기 → 성공, 포커스 목록 제목. 새 글 `server`·HTML 오류 페이지·연결 끊김 → `gb-failed`, `closed` → `gb-error-closed`, 시트 예외(gs catch 경로) → `gb-failed`, 1분 안의 21번째 글 → `gb-error-rate-limited`. 모두 입력 유지. 삭제 연결 끊김·`server` → `gb-delete-failed`, 비밀번호 유지 |
| timeout | 4/4 | 새 글 응답 16.5초 지연 → 15.0초에 `gb-failed`(입력 유지), 시트에는 저장됨 → 다시 누르면 `duplicate` → 다시 불러온 목록 맨 위에 그 글. 목록 응답 지연 → 약 15초 뒤 `gb-list-failed` + 다시 불러오기 |
| motion | 5/5 | 항목 `gb-in 0.25s`, 펼침 0.25s `--ease-out`, 오류 문구 0.2s, 지우는 항목 `opacity 0.2s` `--ease-in`, 방명록 안 무한 애니메이션 0 |
| reduced | 6/6 | 항목·펼침 0s, 방명록 reveal 3그룹 opacity 1, 삭제 항목 즉시 제거, 실행 중 애니메이션 0. 실행 중 설정을 되돌리면 펼침 0.25s |
| nojs | 2/2 | 폼·목록 상자 없음, noscript 안내 표시, 웹 앱 요청 0건 |
| widths (360, 390, 430) | 15/15 | 같은 글자 40자 성함, 공백 없는 500자 말씀, 긴 URL, 펼친 삭제 폼과 오류 문구까지 넣고: 가로 스크롤 없음(scrollWidth = 화면 폭), 방명록 안 요소가 화면 밖으로 나가지 않음(함정 칸 제외), 삭제 버튼 44.2x44, 글자 끝 = 컬럼 가장자리, 성함과 겹치지 않음, 폼 라벨·성함 x 24. 콘솔 0건 |
| focusloss | 1/1 | 남기기 요청 중 `activeElement`가 body → 끝난 뒤 남기기 버튼으로 돌아옴 |

회귀: 7차 QA 회귀 드라이버(`qa7/qa.mjs` 12개 시나리오와 firstscreen, widths 1280, `account.mjs` motion·reduced, `carousel-check.mjs`)를 `HEAD`(`git archive`로 scratchpad에 풀어 :8794) 한 번, 작업 트리(모의 사이트 :8792, 글 0건) 한 번 같은 시각에 돌려 비교했다. 러너 `scratchpad/gb-regress/run.sh`, 비교 `compare.py`, 결과 `compare.out`.

| 항목 | 결과 |
|---|---|
| 가로 스크롤 | 360x640, 375x667, 390x844, 430x932, 1280x900 모두 scrollWidth = 화면 폭(HEAD와 같음) |
| 콘솔·stderr | 새 오류 0건. `interact`의 `audio/missing.mp3` 404는 시나리오가 일부러 낸 것이고 HEAD에도 있다 |
| 캐러셀 | 110/110 통과(HEAD 110/110), 검사 이름 같음. 다른 값은 좌표 0.1px·시각 몇 ms |
| 계좌 접기 | reduced 결과 HEAD와 같음. motion은 페이드 표본 시각·불투명도의 1ms·0.001 차이뿐 |
| 차이가 난 곳(모두 방명록 변경 때문) | 방명록 섹션 높이 744 → 1062px(글 0건). 그 아래 위치를 재는 값(copyedit2의 couple 상대 좌표)이 318px 밀림. heading 목록에 "3 남겨 주신 말씀" 추가. 예전 방명록 검사(`interact`·`copyedit2`의 Formspree 전송)는 비밀번호 칸이 없어 "비밀번호를 정해 주세요."에서 멈춤: 시나리오가 낡은 것이다. 예전 overflow 검사기가 `.gb-trap`(left -9999px)과 그 라벨·입력을 화면 밖 요소로 잡고, 작은 터치 대상 목록에 함정 입력(162x35)과 숨은 다시 불러오기·더보기(0x0)가 들어감: 함정 칸은 설계대로 화면 밖이고(`.page`가 잘라 가로 스크롤 없음), 숨은 버튼은 보일 때 44px다 |
| 보케 | `zones`·`perZoneMaxHeld`·`minExcludeGap` 값이 실행마다 다르다(무작위 배치, 15장 "알아 둘 점"). `running`·`excludeHits`·`pairHits` 차이 없음 |

### guestbook.gs에서 찾은 점

> 2026-10-13 오케스트레이터: 1·2 모두 해소했다. `visibleEntries`가 id가 비었거나 날짜를 읽을 수 없는 행을 건너뛴다. 그 행만 목록에서 빠지고 목록 요청은 성공한다(8차 QA에서 확인).

1. **날짜가 비었거나 날짜로 읽히지 않는 행이 한 줄만 있어도 목록 전체가 실패한다.** `visibleEntries`의 `new Date(r[COL.CREATED_AT]).toISOString()`이 `RangeError: Invalid time value`를 던지고 `doGet`이 `server`를 돌려준다. 모의 서버에서 `createdAt`이 빈 행을 하나 넣자 모든 목록 요청이 `{"ok":false,"error":"server"}`가 됐다. Formspree 글을 시트에 손으로 옮길 때 생길 수 있다. 그 행을 건너뛰게 하거나(`isNaN(date.getTime())` 검사), 옮길 때 B열을 반드시 날짜로 채워야 한다.
2. **손으로 넣은 행의 `id`(A열)가 비면 목록 응답에 `id: ""`로 나간다.** 페이지는 id가 없는 항목을 그리지 않는다(중복 제거와 삭제에 id가 필요하다). 그 글은 시트에만 있고 페이지에는 보이지 않는다. 옮길 때 행마다 겹치지 않는 id(아무 글자)를 넣어야 한다.

### 알아 둘 점

- (17장에서 해소: 커서 보정을 없앴다) 다른 하객이 그사이 지운 글은 보정하지 못한다. 커서가 한 칸 앞서서 더보기에서 한 건을 건너뛸 수 있다(새로고침하면 보인다). 결정 1의 보정은 이 페이지에서 일어난 쓰기와 삭제만 반영한다. 다른 하객이 그사이 쓴 글로 생기는 겹침은 id 중복 제거가 막는다(시험함).
- 두 사람이 시트에서 숨긴 글은 목록 캐시(60초) 때문에 최대 60초 동안 보인다. 그사이 하객이 삭제를 누르면 `not_found`로 목록에서 빠진다(시험함).
- 첫 목록 요청이 진행 중일 때 새 글을 쓰면, 늦게 온 첫 페이지가 목록을 바꾸면서 그 글이 잠시 빠질 수 있다(첫 페이지가 그 글보다 먼저 계산된 경우). 목록은 한 화면 앞에서 미리 받으므로 실제로는 생기기 어렵다.

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`scratchpad/gb-mock/shots/`

- `gb-{360,390,430}.png`: 긴 글 3건 + 펼친 삭제 폼과 오류 문구
- `form-after-390.png`: XSS 문자열 글과 `duplicate` 문구
- `nojs-390.png`: JS 꺼짐(머리 + noscript 안내)
- 원자료 `results-*.json`

## 17. 방명록 페이지 번호와 긴 글 접기 (2026-10-14)

`00_user-input.md` 마지막 절 "방명록 목록을 페이지 번호 방식으로"(덧붙인 줄 포함), 카피 시트 `### guestbook_pager`·`### guestbook_expand`, 모션 명세 4-8-1(2026-10-14), 감사 문서 R1~R9를 반영했다. 웹 앱(`apps-script/guestbook.gs`)은 고치지 않았고 다시 배포할 필요가 없다. 방명록 밖의 코드는 공통 reduced-motion 누름 규칙의 선택자 목록만 바꿨다.

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| index.html | `.gb-more`(말씀 더 보기)와 `.gb-more-status`를 지웠다. 목록 아래에 `nav.gb-pager[aria-label="방명록 페이지"][hidden]`(원형 이전·다음 버튼 + 번호 자리 `.gb-pager__pages`), `p.gb-page-status.sr-only[role=status]`, 화살표 버튼 원본 `template.gb-fold-template`(16px SVG `M3 6l5 5 5-5`, stroke 1.4, round)을 두었다. `ui-text`에 `gb-page-number-aria`, `gb-page-status`, `gb-expand-aria`, `gb-collapse-aria`를 더했다 |
| style.css | `.gb-more`·`.gb-more-status` 규칙을 지웠다. 긴 글 접기(`.gb-item__message.is-foldable` 3줄 높이 + `height` 전환, `::after` 흐림, `.gb-fold` 24x24 + 44x44 터치 영역), 페이지 번호 줄(`.gb-pager`, `.gb-pager__nav`, `.gb-pager__page`), `.gb-pager` 페이드, 안전선(`.gb-list-title`·`.gb-item`의 `scroll-margin-top`)을 더했다. 공통 reduced-motion 누름 규칙에 `.gb-fold`, `.gb-pager__nav`, `.gb-pager__page`를 더했다 |
| script.js | `GB`에 `PAGE: 5`, `FETCH: 50`, `PAGE_LINKS: 5`, `FOLD_LINES: 3`. `initGuestbook`에서 더보기와 커서 보정(`shown`, `nextCursor`, `setNextCursor`, `newItems`, `loadMore`)을 지우고 `loadAll`, `renderPage`, `renderPager`, `turnPage`, `alignToSafeLine`, `measureFold`, `toggleFold`를 더했다. 새 글·삭제는 받아 둔 목록(`entries`)을 고친 뒤 페이지를 다시 그린다 |

### 동작

- **불러오기:** 섹션이 한 화면 앞에 오면(기존 IntersectionObserver, 그 전에는 요청 0건) `GET ?action=list&limit=50&cursor=0`부터 `nextCursor`가 `null`이 될 때까지 차례로 받는다. 커서가 앞으로 가지 않는 응답도 끝으로 본다(무한 반복 방지). id로 중복을 거른다: 두 요청 사이에 새 글이 들어오면 서버 목록이 한 칸 밀려 한 건이 겹친다. 모두 받은 뒤 1페이지를 그린다. 요청이 하나라도 실패하면 받은 것을 버리고 `gb-list-failed` + 다시 불러오기다. 다시 불러오기와 `duplicate` 뒤 재로드도 같은 함수다.
- **페이지 그리기:** 페이지에 남는 항목은 그대로 두고(접힘 상태, 삭제 펼침, 포커스 유지) 새로 넣는 항목만 `.is-new`로 페이드한다. 지워지는 중인 항목은 페이드가 끝날 때까지 자리에 둔다. 페이지를 넘길 때는 네트워크 요청이 없다.
- **번호 줄:** 2페이지 이상일 때만 보인다. 번호는 최대 5개이고 현재 페이지를 가운데 두되 양 끝에서는 멈춘다(24페이지에서 1→1~5, 4→2~6, 23·24→20~24). 현재 번호는 `aria-current="page"`, 번호 이름은 `gb-page-number-aria`. 첫·마지막 페이지의 이전·다음은 `aria-disabled="true"` + opacity 0.3이고 눌러도 아무 일이 없다. `disabled`를 쓰지 않은 것은 갤러리 버튼과 같은 이유(포커스를 잃지 않게)다. 현재 번호를 눌러도 아무 일이 없다.
- **페이지 넘김:** 새 페이지 항목을 모두 250ms 페이드(`--dur-modal`), 목록 제목이 안전선(`scroll-margin-top`, 보통 72px) 위에 있을 때만 즉시 `scrollIntoView({ block: 'start' })`, 제목에 `focus({ preventScroll: true })`, 50ms 뒤 `.gb-page-status`에 "{total}페이지 중 {n}페이지".
- **새 글 성공:** 받아 둔 목록 맨 앞에 넣고 1페이지를 그린다. 새 글만 페이드하고 다른 4건은 바로 보인다. 스크롤·포커스 이동은 없다.
- **삭제 성공·`not_found`:** 받아 둔 목록에서 빼고 같은 페이지를 바로 다시 채운다(다음 페이지에서 당겨 온 항목만 페이드). 포커스는 다음 항목, 없으면 목록 제목. 그 페이지가 비면(마지막 페이지의 유일한 글) 200ms 페이드 동안 포커스를 제목에 두었다가(스크롤 없이) 이전 페이지로 넘긴다. 넘김은 위 "페이지 넘김"과 같다.
- **긴 글 접기:** 페이지를 그릴 때, 그린 뒤 `document.fonts.ready`, `.gb-list` 너비가 바뀔 때(ResizeObserver, 너비만 비교) 잰다. `scrollHeight > 줄 높이 × 3 + 1`이면 `.is-foldable`과 화살표를 붙이고, 3줄 이하가 되면 뗀다(펼친 글은 펼친 채 둔다). 펼침은 높이를 `scrollHeight`px로 350ms(`--dur-snap`, `--ease-standard`), 끝나면 `--dur-snap` + 50ms 타이머로 `auto`. 접기는 시작할 때 항목 위 끝이 안전선 위면 먼저 맞추고, 지금 높이 px → reflow → 인라인 높이 제거로 3줄로 간다. 전환 중에 다시 누르면 지금 높이에서 반대로 간다. 글 블록 클릭도 같은 토글이지만 선택된 글자가 있거나 `event.detail > 1`이면 무시한다. 화살표는 `aria-expanded`, `aria-controls`(말씀 `p`의 id), 이름 `gb-expand-aria`/`gb-collapse-aria`이고 탭 순서에는 화살표만 있다.

### 명세와 다르게 정하거나 명세에 없던 것

| 항목 | 정한 것 | 이유 |
|---|---|---|
| 페이지 넘김 알림 | 제목 포커스와 `gb-page-status` 알림을 **둘 다** 쓴다 | 카피 시트는 "포커스를 목록으로 옮기면 알림을 쓰지 않는다"고 적었고, 모션 명세 4-8-1은 제목 포커스와 `role=status` 알림을 함께 정했다. 제목 "남겨 주신 말씀"만으로는 몇 페이지인지 알 수 없어 모션 명세를 따랐다. copy-writer와 motion-designer가 한쪽으로 맞춰야 한다 (2026-10-14 오케스트레이터: 카피 시트를 이 구현에 맞췄다) |
| 알림 요소 | `p.gb-page-status.sr-only`, 화면에는 보이지 않음 | 현재 번호가 화면에 이미 보인다. 토스트가 쓰는 `#live-status`와 나눠서, 삭제 → 이전 페이지 흐름에서 두 알림이 서로 지우지 않게 했다 |
| 번호 모양 | Cormorant Garamond 400 16px, `lining-nums tabular-nums`, muted. 현재 번호는 text 색 + accent 1px 밑줄(offset 6). hover(정밀 포인터만)는 밑줄 accent 200ms | 바로 옆 원형 버튼과 함께 갤러리 조작 줄(T12 카운터)과 같은 모양으로 맞췄다. 현재 번호를 색만으로 구분하지 않으려고 밑줄을 썼다. concept-director가 바꾸면 `.gb-pager__page` 규칙만 고치면 된다 |
| 번호 버튼 크기 | 40x44(이전·다음 44x44, 사이 8) | 360 폭의 컬럼 312px에 원형 버튼 2개 + 번호 5개를 넣으면 304px. 번호도 44 폭이면 324px로 넘친다 |
| 이전·다음 CSS | 갤러리 `.g-nav`와 같은 값을 `.gb-pager__nav`로 따로 둠 | 갤러리 규칙을 고치지 않으려고 |
| 넘김 중에 온 삭제 응답 | 항목이 화면에 없어도 성공·`not_found`면 목록에서 빼고 지금 페이지를 다시 그리고 토스트를 띄운다 | 예전처럼 무시하면 지운 글이 그 페이지로 돌아갔을 때 다시 보인다 |
| 글꼴 재측정 | 그릴 때마다 `document.fonts.ready` 뒤 한 번 | 명세는 "한 번"이다. Pretendard dynamic subset은 하객 글의 글자에 따라 새 subset을 그때 받으므로, 페이지마다 다시 잰다(5건이라 비용이 작다) |
| 화살표 버튼 모서리 | `border-radius: 50%` | 키보드 포커스 링이 원으로 보이게 |

### 확인 (headless Chrome CDP, DPR 2, 터치 에뮬레이션)

실제 웹 앱 URL에는 요청을 한 건도 보내지 않았다. `realpage` 밖의 시나리오는 모의 사이트(:8792)에서 Google 주소를 막고 돌렸고, `realpage`는 실제 `index.html`을 열어 Google로 가는 요청을 CDP `Fetch`에서 모두 모의 응답으로 채웠다(멈춘 요청 수 = Google 요청 수). 결과 17개 시나리오 203/203.

| 시나리오 | 결과 | 확인한 것 |
|---|---|---|
| pages | 36/36 | 0·3·5·6·23·120건: 1페이지 건수, 번호 줄 표시 여부, 번호 창, 이전 비활성, 다음 비활성(1페이지뿐일 때), 요청 `50/0`(120건은 `50/0, 50/50, 50/100`). 23건에서 번호 줄 `gb-in 0.25s`, 번호·nav·화살표 이름. 120건: 가장 큰 번호를 눌러 1→24 순회, 페이지마다 5건과 번호 창이 맞음, 이전으로 23·22·21 창, 넘기는 동안 요청 0, 마지막 페이지에서 다음·현재 번호를 눌러도 그대로. 넘김: 아래에서 누르면 제목이 72px에 맞춰짐, 5건 모두 페이드, 포커스 제목, 알림 "5페이지 중 2페이지". 제목이 안전선 아래면 스크롤 0. 다음 버튼 Enter·Space. 1페이지 이전 비활성. 3페이지에서 새 글 → 1페이지 맨 앞, 새 글만 `.is-new`, 스크롤 0, 포커스 남기기 버튼 |
| pagedelete | 9/9 | 11건 3페이지의 유일한 글 삭제: 페이드 중 포커스 제목 → 2페이지(06~10), 번호 1~2, 다음 비활성, 포커스 제목, 알림 "2페이지 중 2페이지", 토스트. 6건 2페이지 삭제 → 1페이지, 번호 줄 숨김. 1페이지 가운데 삭제 → 01,03,04,05,06, 실행 중 `gb-in`은 당겨 온 06뿐, 포커스 03, 알림 없음. 2페이지 `not_found` → 당겨 채움, 토스트, 포커스 다음. 삭제 요청 중 다음 페이지로 넘김 → 응답 뒤 토스트, 2페이지 07~11, 1페이지 02~06 |
| pagefetch | 6/6 | 120건에서 cursor 50 요청 실패 → `gb-list-failed` + 다시 불러오기, 목록 0, 번호 줄 숨김, 요청 `50/0, 50/50`에서 멈춤. 다시 불러오기 → `50/0, 50/50, 50/100`, 1페이지, 포커스 제목. 60건에서 두 요청 사이에 새 글 → 둘째 응답 첫 글이 Guest 50(겹침), 12페이지를 모두 넘겨 60건 서로 다름·Guest 50 한 번·마지막 56~60 |
| pagewidths (360, 390, 430) | 12/12 | 화살표 24x24 + 터치 영역 `::before` -10px(44x44), 글 아래 8, 항목 아래 선 위 16, 가운데. 두 자리 번호 창(9~13 등)이 컬럼 안(좌우 24 이상), 가로 스크롤 없음, 겹침 없음, 이전·다음 44x44, 번호 40x44 이상 |
| fold | 28/28 | 1줄·정확히 3줄·430에서 3줄인 글: 화살표·흐림·pointer 없음, 눌러도 그대로. 4줄 글: 71.4px, 화살표, `aria-expanded=false`, `aria-controls`, 이름, `::after` 그라디언트, `height`·화살표·흐림 모두 0.35s ease-standard. 글 클릭 → 중간 높이 표본 → `auto`, `aria-expanded=true`, 접기 이름, 흐림 0, 화살표 180°, 스크립트가 포커스를 옮기지 않음. 다시 클릭 → 3줄. 화살표 클릭 열기·닫기, Enter 열기·Space 닫기(포커스 화살표 유지), 항목 안 탭 순서 화살표 → 삭제. 글자 드래그 선택은 펼치지 않음, 더블클릭의 둘째 클릭은 되돌리지 않음. 전환 중 반대로 누르면 튀지 않음. 항목 위 끝이 화면 위일 때 접으면 즉시 72에 맞추고 접는 동안 그대로, 안전선 아래면 스크롤 0. 430→360: 4줄이 된 글이 접힘, 펼친 상태로 430에 가면 3줄이라 접기 장치가 떨어지고 긴 글은 펼친 채, 다시 360에서 접힘. 글꼴: `fonts.ready`를 붙잡은 채 글자 폭을 넓히면 그대로, 풀면 접힘 |
| 기존 시나리오 | 112/112 | lazy 12, realpage 8, form 27(XSS 성함이 화살표 이름에도 글자로 들어감을 더함), bots 3, delete 16, failures 11, timeout 4(재전송 `duplicate` 뒤 전체 재로드 포함), reduced 8(접기 즉시·흐림·화살표 0s, 페이지 넘김 즉시 + 포커스 제목을 더함), motion 5, nojs 2, widths 15(긴 글이 접힌 상태), focusloss 1 |

회귀: qa7 회귀 드라이버(16장과 같은 묶음)를 `HEAD`와 작업 트리에 같은 시각에 돌려 비교했다. 이번에는 `HEAD`도 실제 웹 앱 URL을 담고 있어서, `git archive`로 푼 `HEAD`를 둘째 모의 서버(`--port 8796 --site-port 8798 --root …`)로 서빙해 endpoint를 모의 서버로 바꿨다(qa7은 Google을 막지 않는다). 러너 `scratchpad/gb-regress17/run.sh`, 비교 `compare.out`.

| 항목 | 결과 |
|---|---|
| 같음 | firstscreen, nojs, ax, dday, lbkeys, account-reduced |
| 차이가 난 곳(방명록 변경 때문) | widths(5개 폭)의 작은 터치 대상 목록에서 숨은 더보기(0x0)가 숨은 이전·번호·다음(0x0)으로 바뀜. 글 0건이라 번호 줄은 숨어 있고, 보일 때는 44x44·40x44다 |
| 실행마다 다른 값 | 보케 구간별 개수·`perZoneMaxHeld`·`minExcludeGap`(무작위 배치, 15장), 실패 요청 id 숫자, 계좌 접기 페이드 표본의 1~2ms·0.001 차이, reducednotice의 외부 요청 순서(카카오맵 SDK와 모의 목록 요청 순서가 바뀜) |
| 콘솔 | 새 오류 0건. `interact`의 `audio/missing.mp3` 404는 시나리오가 일부러 낸 것이고 HEAD에도 있다 |
| 캐러셀 | 두 실행을 같은 시각에 돌리자 둘 다 600초 제한에 걸려 중간에 끊겼다(HEAD 21건, 작업 트리 28건까지 모두 통과). 작업 트리만 따로 제한 없이 다시 돌려 110/110 통과(16장 HEAD 110/110과 같은 수) |

### 모의 서버·시험 스크립트 변경 (scratchpad, 저장소에 넣지 않음)

- `server.mjs`: `failCursor` 옵션(실행 중 `POST /__mock/config {failCursor: 50}`). 그 커서의 목록 요청만 `{ok:false, error:'server'}`로 답한다. 연결을 끊는 방식은 Chrome이 재사용 연결에서 끊긴 GET을 조용히 한 번 다시 보내서(같은 커서가 두 번 기록됨) 쓰지 않았다.
- `gb-test.mjs`: `more` 시나리오를 `pages`, `pagedelete`, `pagefetch`, `pagewidths`, `fold`로 바꿨다. `lazy`는 `limit=50`, `form`·`reduced`에 위 검사를 더했다. 16장 판은 `gb-test.v16.mjs`로 남겼다.
- `scratchpad/qa8/ui.mjs`의 `more` 시나리오는 고치지 않았다(QA가 다시 짠다).

### 알아 둘 점

- 첫 표시까지 걸리는 시간은 글 수에 비례한다. 요청은 50건마다 하나씩 차례로 나가고, 모두 받은 뒤에야 1페이지가 보인다. 실제 웹 앱의 요청당 시간은 재지 않았다(실제 URL에 요청하지 않는 조건).
- 목록을 받는 중에 새 글을 쓰면, 받기를 마친 목록이 그 글을 덮어 잠시 빠질 수 있다(16장과 같은 한계). 섹션 한 화면 앞에서 미리 받으므로 실제로는 생기기 어렵다.
- 더블클릭으로 단어를 고르면 첫 클릭에 글이 한 번 펼쳐진다. 명세대로 `event.detail > 1`만 무시한 결과다. 첫 클릭까지 막으려면 더블클릭 간격만큼 펼침을 늦춰야 한다.
- 목록 제목은 reveal 그룹 안에 있다. 하객이 제목을 지나치지 않고 페이지 번호 줄로 바로 왔다면(예: 주소 해시) 넘김 뒤 제목이 reveal 전 상태(투명, 12px 아래)일 수 있다. 시험 화면 캡처에서만 보였고 보통 스크롤에서는 생기지 않는다. (9차 QA: 캡처가 reveal 페이드 800ms가 끝나기 전에 찍힌 것이다. 제목 색은 내내 text이고 결함이 아니다.)

### 스크린샷 (scratchpad, 저장소에 넣지 않음)

`scratchpad/gb-mock/shots/`

- `pager-{360,390,430}.png`: 120건 + 긴 글, 두 자리 번호 창
- `p17-smoke.png`: 390, 1페이지(접힌 긴 글 + 번호 줄)
- 원자료 `results-*.json`

## 18. 사진 보호: 저장 메뉴 차단과 확대 제거 (2026-10-17)

모션 명세 12-1 작업 목록 11개(Must 10 + Should 1)를 모두 반영했다. 세부는 명세 4-1-4, 4-1-11, 4-1-12, 4-2 "확대 없음"·참고 코드, 4-10-2, 4-10-3을 따랐다. 사용자 결정은 "캡처 방지"를 사진에만, "사진 확대 방지"를 "모든 확대 차단"으로 적용하는 것이다. 글자 선택은 막지 않는다(계좌 복사 실패 안내 `copy-failed`가 길게 눌러 복사하는 방법에 기대기 때문).

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| index.html | 6행 viewport meta에 `maximum-scale=1, user-scalable=no` (12-1 #1) |
| style.css | `html`에 `touch-action: manipulation`(#2). `img, svg, canvas` 바로 아래 사진 보호 `img` 규칙: `-webkit-touch-callout`·`-webkit-user-drag`·`-webkit-user-select`·`user-select` 모두 `none`(#3). `.js .g-viewport`의 `pan-y pinch-zoom` → `pan-y`(#4). `.lb-img`의 `transform-origin: 0 0`과 `.lb-img.is-zooming` 규칙 삭제(#5). `--ease-standard` 주석에서 "zoom, " 삭제(#6) |
| script.js | `LB`에서 `ZOOM_MAX`, `DOUBLE_TAP_ZOOM`, `DOUBLE_TAP_MS`, `PINCH_MIN`, `KEY_ZOOM_STEP` 삭제(#7). `initCarousel` 두 번째 손가락 주석을 4-1-12 문구로(#8, 코드 그대로). `initLightbox`에서 `zoom`, `origin`, `clampZoom`, `applyZoom`, `resetZoom`, `zoomAt`, `startPinch`, `settlePinch`, `lastTap`, 무대 `wheel` 리스너, keydown의 `+`·`=`·`-`·`0` 분기, `resetZoom(false)` 호출 4곳을 지우고 제스처 블록을 4-2 참고 코드로 바꿨다(#9). `pointers`는 좌표가 필요 없어져 `Map` → `Set`. `initZoomGuard`·`initPhotoGuard`를 Live region 절 다음에 두고 Boot 맨 앞(`initBokeh`보다 먼저)에서 부른다(#10). `showModal`이 없으면 `window.open` 폴백 없이 돌아간다(#11, Should) |

건드리지 않은 것(12-1 "건드리지 않는 것" 그대로): `.js .g-viewport`·`.lb-stage`·`.venue__map`의 `user-select: none`, `.lb-stage { touch-action: none }`, 갤러리·lightbox img의 `draggable="false"`, `.g-viewport`의 `dragstart` 리스너, 캐러셀 트랙패드 가로 휠, `.g-open { cursor: zoom-in }`, 복사 실패 `Selection` 폴백. 전역 `user-select: none`과 글자 요소의 `-webkit-touch-callout: none`은 넣지 않았다.

### 동작

- **사진 저장 경로:** iOS 길게 누르기 메뉴는 CSS `-webkit-touch-callout: none`, Android·PC 메뉴는 `document`의 `contextmenu` 위임, 끌어 저장은 `-webkit-user-drag: none` + `dragstart` 위임이 막는다. 판정은 `e.target.closest('img, .g-open')`이라 lightbox가 나중에 만드는 `.lb-img`, hero wreath, 카카오 지도 타일 img도 함께 막힌다(명세 4-10-2가 받아들인 범위). 글자·버튼·빈 곳의 우클릭과 길게 누르기는 브라우저 기본 동작 그대로다.
- **페이지 확대:** Android·WebView는 viewport meta, iOS·macOS Safari 핀치는 `gesturestart`·`gesturechange` 차단(`passive: false`), iOS 더블탭은 `touch-action: manipulation`, PC 트랙패드 핀치와 `Ctrl` + 마우스 휠은 `window`의 `ctrl + wheel` 차단이 막는다. `Ctrl`/`Cmd` + `+`·`-`·`0` 키 확대와 브라우저·OS 강제 확대 설정은 막지 않는다(4-10-3 "막지 않는 것"). 터치 스크롤 경로에 non-passive touch 리스너는 하나도 늘지 않았다.
- **lightbox:** 사진은 화면에 맞춘 크기가 최대다. 손가락이 둘 이상 닿으면 진행 중인 스와이프는 350ms에 제자리, 끌어 닫기는 250ms에 원위치로 돌리고 마지막 손가락이 떨어질 때까지 입력을 무시한다(`g.type = 'idle'`). 한 번 탭은 사진 밖이면 바로 닫고 사진 위면 아무 일도 없다. 탭 반응 지연은 예전과 같이 0이다. 남은 조작(열기, 스와이프, 이전/다음, ←/→, Esc, 끌어 닫기, Android 뒤로가기)은 바뀌지 않았다.
- **`showModal` 미지원(Safari·iOS 15.3 이하):** 사진 버튼을 눌러도 아무 일이 없다. 캐러셀 넘기기는 된다.

### 확인 (Playwright 1.63 headless Chromium 1243, 390 x 664, `isMobile`, `hasTouch`, DPR 3)

정적 확인(명세 12-2 A1~A11)은 모두 기대 결과와 같다. A1 `1`, A2·A3·A6·A11 출력 없음, A4 `initZoomGuard` 안 2줄(둘 다 `passive: false`), A5 `initZoomGuard` 1줄, A7 `img` 규칙 1줄, A8 `img`·`.js .g-viewport`·`.venue__map`·`.lb-stage`만, A9 `html` `manipulation`·`.js .g-viewport` `pan-y`·`.lb-stage` `none` + 지도 주석 1줄, A10 `.g-open`의 `zoom-in` 1줄.

브라우저 확인 29개 중 28개 통과. 남은 1개는 콘솔 오류 검사이고, 시험이 외부 요청을 일부러 막아서 생긴 `Failed to load resource` 3건(Google Fonts, Pretendard jsDelivr, 카카오맵 SDK)뿐이다. 페이지 오류와 `[invitation] … failed` 로그는 0건이다.

| 명세 | 결과 |
|---|---|
| B1 | `manipulation`, `pan-y`, `none` |
| B2 / B3 | `gesturestart`·`gesturechange`·`ctrl + wheel` 취소됨 / 일반 `wheel` 취소 안 됨 |
| B4 | `contextmenu` 취소: `.hero__photo`, 현재 캐러셀 img, 그 `.g-open`, lightbox를 연 뒤 런타임 `.lb-img`(`dragstart`도 취소) |
| B5 | `contextmenu` 취소 안 됨: `.hero__names`, `#groom-account`, `#gb-message` |
| B6 / B7 | hero img `dragstart` 취소 / `userSelect` img `none`, body·계좌번호 `auto` |
| B8 | hero·캐러셀·lightbox 무대에서 두 손가락 touch(CDP `Input.dispatchTouchEvent`)와 `synthesizePinchGesture`(`gestureSourceType: 'default'`) 모두 `visualViewport.scale` 1. lightbox는 `.lb-img`·슬라이드 transform `''`, "4 / 15" 그대로, 열린 채 |
| B9 | 본문 글자 더블탭 scale 1 |
| B10 | lightbox `+`, `=`, `-`, `0` 뒤 transform `''`, "4 / 15" 그대로 |
| 휠 | lightbox 무대의 `ctrl + wheel` 취소됨, 실제 `Ctrl` + 마우스 휠과 일반 휠 뒤 transform `''`, scale 1, 번호 그대로 |
| B11 | 02(가로)로 열어 사진 가운데 더블탭: 확대 없음, 열린 채 / 사진 위 빈 무대 한 번 탭: 닫힘 |
| B12 | 캐러셀 가로 스와이프 1→2→1, 세로로 쓸면 페이지 스크롤(scrollY 2574 → 2807)·번호 그대로, 프레임 342 x 513, 다음 14번 → "15 / 15"·`aria-disabled="true"`·포커스 다음 버튼, 4번에서 lightbox 열기 → 스와이프 3번 "7 / 15" → ←/→, 이전/다음 버튼 → 닫기 후 캐러셀 7번·포커스 7번째 슬라이드 버튼, Esc 닫기, 아래로 끌어 닫기 |
| 글자 선택 | 계좌 카드를 펼친 뒤 `Selection`으로 계좌번호 선택 → "110-335-546640" |

**시험이 확대를 실제로 잡는지:** 같은 시험을 `HEAD`(이번 변경 전) 사본에 돌리면 두 손가락 touch에서 scale 5, `synthesizePinchGesture`(`default`)에서 scale 2.0이 나와 B8a·B8b가 실패한다. 이번 변경 뒤에는 둘 다 1이다. `gestureSourceType: 'touch'`인 `synthesizePinchGesture`는 headless shell에서 `HEAD`도 확대하지 않아 쓰지 않았다.

### 확인하지 못한 것

- **B13(WebKit `-webkit-touch-callout`):** Playwright WebKit이 이 기기에 설치돼 있지 않다. CSS 규칙은 A7로만 확인했다.
- **더블탭 확대(B9·B11):** Chromium은 `width=device-width` 페이지에서 원래 더블탭 확대를 하지 않아 `HEAD`에서도 scale 1이다. 이 항목이 실제로 막히는지는 iOS Safari에서만 드러난다(명세 12-2 C2).
- **실기기(명세 12-2 C1~C8, 12-3):** 하지 않았다. 특히 카카오톡 인앱 브라우저가 앱 자체의 길게 누르기 메뉴를 띄우는지, Android 카카오톡 WebView가 viewport meta를 따르는지는 실기기에서만 알 수 있다. 결과가 나쁘면 명세 12-3의 대안(투명 덮개, `touch-action: pan-x pan-y`, `touchmove` 차단)을 다시 정해야 한다.

### 알아 둘 점

- Lighthouse 접근성 `meta-viewport`와 axe `meta-viewport` 규칙이 실패로 나온다. 사용자가 WCAG 1.4.4 위반을 알고 고른 범위이므로 QA는 "사용자 수용 예외(WCAG 1.4.4)"로 기록한다(명세 4-10-3).
- `Ctrl` + 마우스 휠 확대도 트랙패드 핀치와 같은 신호라 함께 막힌다. PC에서 글자를 키우려면 `Ctrl`/`Cmd` + `+` 키나 브라우저 메뉴를 써야 한다.
- 컨셉 시트의 lightbox 줄("좌우 스와이프, 핀치 줌")은 이 결정 이전 기록이고 고치지 않았다(명세 12-2가 우선).

### 시험 스크립트 (scratchpad, 저장소에 넣지 않음)

- `photo-guard-check.js`: 위 표의 29개 검사. `--baseline`이면 B8a·B9·B8b만 돈다
- `pinch-probe.js`: 입력 방식별로 `HEAD`와 작업 트리의 확대 여부를 비교
- `run-check.sh`, `run-probe.sh`: 작업 트리(:8743)와 `HEAD` 사본(:8744)을 서빙하고 끝나면 서버를 내린다

## 19. 갤러리 재배치와 사진 파일 이름 변경 (2026-10-17)

사용자 요청: "사진 순서를 05 → 03 → 04 → 01 → 나머지 → 02 순서로 재배치하고, 사진 이름도 재배치된 순서에 맞게 변경해 달라." 나머지는 06~15를 기존 순서대로 둔 것이다. 갤러리의 n번째 사진은 지금도 `images/photos/n.jpg`다.

| 새 | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 이전 | 05 | 03 | 04 | 01 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 | 02 |

### 바꾼 범위

| 파일 | 바꾼 것 |
|---|---|
| `images/photos/NN.jpg`, `images/photos/thumb/NN.jpg` | 각 15개를 위 표대로 `git mv`(임시 이름을 거쳐서). 파일 내용은 그대로다. `hero.jpg`, `thumb/hero.jpg`, `images/og-garden.jpg`는 그대로 |
| index.html | 갤러리 슬라이드 15줄을 새 순서로 옮기고 `data-full`·`src`·`srcset`의 파일 번호와 버튼 이름 "사진 n / 15"를 새 위치로 다시 매겼다. alt, `data-w`·`data-h`, img `width`·`height`, 썸네일 `w` 값, `g-slide--landscape`는 사진을 따라 옮겼다. 가로 사진은 14번(1600x1066)과 15번(1600x1194), 1067px 세로 사진은 13번이다. 갤러리 주석의 "landscape 02/15" → "14/15" |
| 문서 | 컨셉 시트 `photos.gallery.order`와 사진 번호 언급, 카피 시트 `gallery_alt` 표, 이미지 매니페스트(og 소스 15.jpg, 사진 자산 표, 1px 차이 13.jpg, 200KB 넘는 썸네일 07·08·09), 모션 명세(0, 4-1, 4-1-1, 4-1-4, 4-1-7, 4-1-8, 7, 10, 12-2와 맨 위 변경 기록). 이 문서는 2장 표 아래 갤러리 문단을 고쳤다. 3장 Must 4-1 행의 가로 사진 번호(02·15 → 14·15)와 4장 갤러리 순서 행의 덧붙임은 QA가 고쳤다(06 보고서 11차). 7장·10장·13장·18장의 확인 기록에 남은 사진 번호는 그때 파일 이름 기준이라 그대로 둔다 |

style.css와 script.js는 바꾸지 않았다. 가로 사진 처리는 `.g-slide--landscape` 클래스로, 로딩 창과 lightbox 목록은 DOM 순서로 정해져서 특정 사진 번호를 쓰는 코드가 없다.

### 확인

- 파일 해시: 새 파일 30개(원본·썸네일 각 15) 모두 `HEAD`의 대응 파일과 git blob 해시가 같다. `hero.jpg` 2개도 그대로다.
- 정적 대조: 15개 슬라이드가 1~15 순서이고, 각 슬라이드의 파일 번호, `data-w`·`data-h`·`width`·`height`(실제 JPEG 크기), 썸네일 `w`(실제 썸네일 폭), 가로 클래스(가로 비율일 때만), alt와 버튼 이름이 해시로 대응한 이전 사진의 값과 같다. 카피 시트 표와 컨셉 시트 order(desc, orientation)도 같은 기준으로 대조했다. 불일치 0건.
- 브라우저(Playwright 1.63 headless Chromium 1243, 390 x 664, `isMobile`, `hasTouch`, DPR 2, 로컬 서버 :8817, 외부 요청 차단): 17개 검사 모두 통과. 캐러셀 1번 = `01.jpg`(검은 배경 비눗방울, 하트 풍선), 15번 = 가로 `15.jpg`(창가 벤치)이고 다음 버튼 `aria-disabled="true"`. 낭독 문구 "15장 중 15번째 사진, 분홍 꽃가지 장식 아래…", "15장 중 14번째 사진, 커튼 사이로…". lightbox는 15번에서 "15 / 15"·`15.jpg` 1600x1194, 1번에서 "1 / 15"·`01.jpg` 1066x1600, 슬라이드 15장의 alt 순서가 캐러셀과 같다. 페이지 오류·로컬 4xx 0건, 콘솔 오류는 차단한 외부 요청(Google Fonts, jsDelivr, 카카오맵 SDK) 3건뿐이다.

### 알아 둘 점

- 사진 파일 이름이 바뀌어 같은 URL(`images/photos/01.jpg` 등)이 다른 사진을 가리킨다. 배포 뒤 하객 브라우저나 CDN 캐시에 예전 파일이 남아 있으면 잠시 이전 사진과 새 alt가 엇갈려 보일 수 있다.
- 매니페스트 사진 자산 표의 가로 사진 "쓰임"은 이미 쓰지 않는 `object-position` 대신 "contain"으로 적었다.
- 모션 명세 4-1-7의 첫 화면 예산은 2026-10-11 순서(02 01 08) 기준 값이 남아 있어서, 새 01·02·03(모두 세로 원본) 합계 약 0.52MB로 고쳤다.
