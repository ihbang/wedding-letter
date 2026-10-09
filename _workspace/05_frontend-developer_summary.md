# Frontend 구현 요약: 방인혁 · 손유민 ("Warm Paper & Ink")

- 산출물: `index.html`, `style.css`, `script.js` (이전 커플 파일을 전부 새로 작성해 덮어씀)
- 입력: `_workspace/00`~`04` 산출물, `images/photos/`(원본 1600px), `images/photos/thumb/`(600px)
- 이전 커플 흔적 확인: `grep -E '민준|서연|파르나스|인터컨티넨탈|2026|floral|gallery-placeholder|og-thumbnail\.png'` 결과 0건 (index.html·style.css·script.js)

## 1. 구조

| 섹션 | 구현 |
|------|------|
| hero | `jo--8400.jpg` 100svh(미지원 시 100vh), `object-position: center 70%`, 상단 "Inhyeok & Yumin" + "2027. 01. 03. SUN 3PM", 하단 "방인혁 · 손유민" + 예식장 |
| greeting | 인사말 3문단 |
| couple-intro | "방주경 · 주진숙의 아들 인혁", "손홍희 · 김연주의 딸 유민" (서열 표기 없음) |
| calendar | 2027년 1월 달력을 HTML로 정적 작성(JS 없이도 보임), 3일 일요일에 accent 원 36px, D-day는 JS 계산 |
| gallery | 3열 정사각 그리드 15장(컨셉 시트 순서), 첫 9장 + "더보기", lightbox |
| venue | 장소·주소, 주소 복사, 카카오맵·네이버 지도 링크, 지하철·버스·주차(placeholder) |
| account | 신랑측·신부측 계좌(placeholder), 복사 버튼 |
| rsvp | 참석 여부·신랑측/신부측·성함·동행 인원 폼 |
| guestbook | 성함·전하실 말씀 폼 |
| share | 카카오톡 공유(키 없으면 링크 복사로 폴백), 링크 복사 |
| footer | 인라인 SVG 모노그램(I & Y) + 맺음말 |

- 디바이더(`images/divider-hairline.svg`)는 모든 섹션 제목 아래에 둔다. 모션 명세 2-0의 그룹 ①(라벨 + 제목 + 디바이더) 구성을 따랐다.
- 모노그램은 `<text>`가 페이지의 Cormorant Garamond로 렌더되도록 footer에 인라인 SVG로 넣었다. 색은 `currentColor` = `--color-primary`.

## 2. 모션 명세 매핑

| 우선순위 | 항목 | 상태 | 구현 위치 / 비고 |
|---------|------|------|-----------------|
| Must | 5 토큰 `:root` + reduced-motion 0ms 재정의 | 구현 | `style.css` 상단. JS는 `token()`으로 같은 CSS 변수를 읽고 reduced일 때 0 |
| Must | 2-0 공통 reveal (IO threshold 0.15, rootMargin -10%, 1회, stagger 120ms, `.js` 게이트, IO 미지원 폴백) | 구현 | `initReveal()`. 섹션 단위로 관찰해 그룹 `--i` 0~2 지연 |
| Must | 2-1 히어로 settle (decode 후 scale 1.04→1, 2400ms, 1500ms 초과 시 정적) + 텍스트 +400/+700ms | 구현 | `initHero()`. will-change는 settle 동안만 |
| Must | 3-1 그리드 lazy·width/height·10~15번 지연·히어로 preload·썸네일 페이드·더보기 후 10번 포커스 | 구현 | 10~15번은 `hidden` 대신 `.js` 게이트 CSS로 숨겨 JS 비활성 시에도 15장이 모두 보임. 숨김 상태에서는 요청 0건 확인 |
| Must | 3-2 lightbox 스와이프(50px / 0.3px/ms, 양 끝 저항 0.3)·핀치 1~3·더블탭 2배·팬 clamp·아래로 끌어 닫기(80px, 배경 1-dy/400 최저 0.4)·±1 로딩·포커스 트랩·Esc/←/→·"N / 15" | 구현 | `createLightbox()`. Pointer Events 단일 처리, `touch-action: none`은 lightbox 안에만 |
| Must | 3-3 복사 라벨 전환(120ms+120ms)·폭 고정·clipboard→execCommand 폴백·실패 시 텍스트 선택·`role="status"`·vibrate(10) | 구현 | 세 라벨을 한 grid 셀에 겹쳐 폭이 바뀌지 않음. 주소·링크 복사에도 동일 적용 |
| Must | 3-4 음악 토글 (`preload="none"`, 자동재생 없음, aria-pressed/aria-busy, 볼륨 0→0.6 1500ms·→0 400ms, 이퀄라이저 1.2s, 탭 숨김 시 일시정지·복귀 시 재개) | 구현 | iOS처럼 volume이 읽기 전용이면 페이드 생략. reduced에서 정적 3바(0.5/1/0.7) |
| Should | 3-5 D-day (KST 날짜 기준, 로드·visibilitychange 갱신) | 구현 | 2026-10-09 기준 "D-86" 확인 |
| Should | 3-6 카카오 공유 / 링크 복사 | 구현 | 키가 placeholder면 SDK를 아예 로드하지 않고 링크 복사로 폴백 |
| Should | 3-7 길찾기 버튼 | 부분 구현 | 카카오맵·네이버 지도만. 티맵은 키 없는 웹 검색 URL이 없어 제외. 지도 임베드 없음(카카오맵 키 미발급) |
| Should | 그리드 썸네일 | 구현 | 그리드는 `images/photos/thumb/`, lightbox는 `images/photos/` 원본 |
| Nice | 3-8 스크롤 안내선 (bounce 없음, scrollY > 24에서 400ms 페이드 후 리스너 제거) | 구현 | |
| Nice | lightbox `+`/`-` 키 줌 (1.5배) | 구현 | |

사용하지 않은 것: 배경 애니메이션·canvas·패럴랙스·카운트업·토스트·ripple·자동 슬라이드·`scroll-behavior: smooth`. 무한 루프는 재생 중 이퀄라이저 하나뿐이다.

### 명세와 다르게 처리한 부분

- **복사 버튼 라벨은 "복사하기"**: 모션 명세는 "복사"지만 카피 시트(`account_info`)의 "복사하기 → 복사되었습니다"를 따랐다.
- **예식 이후 D-day**: 명세는 D-day 줄을 숨기라고 했지만, 카피 시트에 예식 이후 문구가 있어 숫자만 숨기고 "인혁 · 유민의 결혼식에 함께해 주셔서 감사합니다."를 보여 준다.
- **히어로 하단 그라디언트 추가**: 하단 한글 텍스트가 드레스 자락 위에 놓여, 상단과 같은 종류의 정적 그라디언트(`rgba(248,245,240,0.7)` → 0, 24%)를 하단에도 넣었다. 컨셉 시트의 "텍스트 가독성용 그라디언트만 허용" 범위 안이다.
- **토큰 1개 추가**: `--dur-short: 200ms` (hover, 음악 아이콘 크로스페이드, lightbox 닫기). 명세 표에 있는 200ms 값을 토큰화한 것이며 reduced에서 0ms다.
- **solid 버튼 `:active` 배경**: 명세의 `--color-surface`를 쓰면 흰 글자가 보이지 않아 `--color-text`로 바꿨다.

### frontend가 작성한 문구 (카피 시트에 없음, copy-writer 검토 권장)

"더보기", "주소 복사하기", "링크 복사하기", "남기기"(방명록 제출), "소중한 말씀 감사합니다."(방명록 제출 완료), "복사하지 못했습니다", "접수 주소가 아직 설정되지 않았습니다.", "전송하지 못했습니다. 잠시 후 다시 시도해 주세요.", 갤러리 사진별 설명 15건(`data-desc`, `aria-label`).

## 3. Placeholder 위치

배포 전 `grep -n '\[\[TODO:' index.html script.js`로 남은 항목을 확인한다.

| KEY | 파일:줄 | 채울 내용 |
|-----|---------|----------|
| `SITE_URL` | index.html:17, index.html:18 (설명 주석 12) | 배포 도메인. og:url, og:image 절대 URL |
| `SITE_URL` | script.js:7 | 같은 값. 공유 링크 기준 주소 (비어 있으면 현재 주소 사용) |
| `KAKAO_JS_KEY` | script.js:6 | Kakao Developers JavaScript 키. 비어 있으면 카카오 버튼이 링크 복사로 동작 |
| `SUBWAY` | index.html:188 | 지하철역·호선·출구·도보 시간 |
| `BUS` | index.html:192 | 정류장·노선 |
| `PARKING` | index.html:196 | 주차 위치·무료 시간 |
| `GROOM_BANK` / `GROOM_ACCOUNT` | index.html:217 | 신랑측 은행 / 계좌번호 (복사 버튼은 계좌번호 span만 복사) |
| `BRIDE_BANK` / `BRIDE_ACCOUNT` | index.html:230 | 신부측 은행 / 계좌번호 |
| `RSVP_ENDPOINT` | index.html:251 (설명 주석 250) | RSVP 폼 POST 주소 |
| `GUESTBOOK_ENDPOINT` | index.html:286 (설명 주석 285) | 방명록 폼 POST 주소 |

- `SITE_URL`, `KAKAO_JS_KEY`, `RSVP_ENDPOINT`, `GUESTBOOK_ENDPOINT`는 카피 시트 표에 없는 frontend 설정값이다. 같은 `[[TODO:<KEY>]]` 형식으로 두었다.
- 폼 주소가 placeholder인 동안 제출하면 페이지가 깨지지 않고 "접수 주소가 아직 설정되지 않았습니다."만 표시된다.
- BGM은 `audio/bgm.mp3`가 이미 있어 placeholder가 아니다.

## 4. 외부 리소스

| 리소스 | 용도 | 로드 조건 |
|--------|------|----------|
| Google Fonts: Cormorant Garamond (300/400, italic 300/400), Noto Serif KR (300/400/500) | 영문·한글 세리프 | 항상 |
| jsDelivr: Pretendard v1.3.9 dynamic subset | 정보성 텍스트 | 항상 |
| Kakao JS SDK 2.7.2 (`t1.kakaocdn.net`) | 카카오톡 공유 | `KAKAO_JS_KEY`를 채운 경우에만 동적 로드 |

애니메이션 라이브러리, jQuery 없음.

## 5. 검증 결과 (headless Chromium, 375x667)

- 가로 스크롤 없음(scrollWidth 375), 콘솔 오류는 샌드박스 프록시로 웹폰트가 막힌 407 두 건뿐
- 히어로 settle 후 transform 정상 복귀, 스크롤 후 숨은 `.reveal` 0개
- 토글 전 `bgm.mp3` 요청 없음, 토글 후 재생·이퀄라이저 동작, 다시 누르면 정지
- 그리드 9 → 더보기 15, 더보기 전 10~15번 썸네일 요청 0건
- lightbox: 열기 시 ±1만 로드, → 키·마우스 드래그 스와이프, 더블탭 2배 줌, Tab 트랩, Esc 후 그리드 셀로 포커스 복귀, 아래로 끌어 닫기
- 계좌 복사 라벨 전환·2초 후 복귀·status 낭독 문구, 카카오 버튼 폴백으로 링크 복사
- reduced-motion: 히어로 transform none, reveal 즉시 표시, `--dur-reveal` 0ms, 이퀄라이저 정적 3바
- JS 비활성: 모든 섹션 표시, 갤러리 15장 표시
- 웹폰트는 샌드박스 네트워크 제한으로 실제 렌더를 확인하지 못했다. 배포 후 실기기에서 Cormorant·Noto Serif KR·Pretendard 적용을 확인해야 한다.

## 6. 배포 가이드

1. 위 placeholder를 채운다. 최소한 `SITE_URL`과 계좌 4개는 채워야 카카오톡 미리보기와 계좌 복사가 의미 있게 동작한다.
2. RSVP·방명록은 Formspree(`https://formspree.io/f/<id>`) 또는 FormSubmit(`https://formsubmit.co/ajax/<이메일>`) 같은 POST 수신 서비스를 만들고 그 주소를 `action`에 넣는다. JS는 `Accept: application/json`으로 fetch POST한다.
3. 카카오 공유: Kakao Developers에서 앱을 만들고 JavaScript 키를 `script.js`의 `kakaoJsKey`에 넣는다. 플랫폼 > Web에 배포 도메인을 등록해야 공유가 동작한다.
4. GitHub Pages 기준: 저장소 루트를 그대로 배포한다(`.nojekyll` 있음). `images/photos/`, `images/photos/thumb/`, `images/divider-hairline.svg`, `images/og-thumbnail.jpg`, `audio/bgm.mp3`가 함께 올라가야 한다.
5. 배포 후 카카오톡 미리보기 캐시는 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 초기화한다.
6. 이전 커플 이미지(`images/floral-*.png`, `images/gallery-placeholder-*.png`, `images/hero-illustration.png`, `images/og-thumbnail.png`)는 이번 페이지에서 참조하지 않는다. 매니페스트 지시대로 삭제하지 않고 두었다.


## 변경 이력
- 2026-10-09: 사용자 요청으로 RSVP 섹션을 제거했다(index.html 섹션, style.css의 `.form__choice`·`.choice`, `RSVP_ENDPOINT` placeholder). 방명록은 유지하며, 사용자가 `GUESTBOOK_ENDPOINT`를 나중에 채운다. 접수 주소가 없을 때 안내 문구를 "지금은 방명록을 남길 수 없습니다. 축하의 말씀은 두 사람에게 직접 전해 주세요."로 바꿨다.
