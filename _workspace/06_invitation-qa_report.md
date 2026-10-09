# QA Report — 2026-10-09

## 요약
- 전체 결과: **PASS (WARNING 4건)**
- FAIL: 0개 / WARNING: 4개 / 직접 수정: 1건 (`더보기` → `사진 더 보기`)
- 기준: `_workspace/00_user-input.md`(진실의 원천), 01 컨셉 시트, 02 카피, 03 매니페스트, 04 모션 명세, 05 frontend 요약
- 검증 방법: grep/file 자동 대조 + headless Chromium(Playwright, chrome-headless-shell 1243) 실측. 웹폰트는 샌드박스 프록시(407)로 막혀 fallback 서체로 렌더됨

## 1. 정보 정합성

| 항목 | 사용자 입력 / 컨셉시트 | HTML 값 (위치) | 결과 |
|------|------------|---------|------|
| 신랑 이름 | 방인혁 | 방인혁 6회 (hero, 계좌, title, og) | PASS |
| 신부 이름 | 손유민 | 손유민 6회 | PASS |
| 신랑 부·모 | 방주경 · 주진숙 | "방주경 · 주진숙의 아들 인혁" (index.html:96) | PASS |
| 신부 부·모 | 손홍희 · 김연주 | "손홍희 · 김연주의 딸 유민" (index.html:100) | PASS |
| 서열 표기 | "아들", "딸"만 | 장남·장녀·차남·차녀·막내·외아들·외동딸 grep 0건 | PASS |
| 일시 | 2027-01-03 일요일 오후 3시 | "2027년 1월 3일 일요일 오후 3시"(3회), "2027. 01. 03. SUN 3PM", `data-wedding-date="2027-01-03"` | PASS |
| 달력 | 2027-01-03 = 일요일 | 1월 1일 금요일 시작, 3일이 일요일 열에 accent 원 (index.html:121-122) | PASS |
| 장소 | 더컨벤션 송파문정 13층 아모르홀 | 4회 (hero, venue, description, og) | PASS |
| 주소 | 서울 송파구 송파대로 155 NH송파농협 13층 | index.html:174, 주소 복사 결과도 동일 문자열 | PASS |
| 이전 커플 흔적 | 김민준·박서연·김재현·이수진·박정훈·최은영·파르나스·테헤란로·2026-10-17 | index.html·style.css·script.js grep 0건 (2026, floral, gallery-placeholder, og-thumbnail.png 포함) | PASS |
| 팔레트 | 7색 HEX | `:root` 7색 동일 (style.css:5-11) | PASS |
| 카피 누락 | greeting, couple_intro, ceremony_info, dday 3종, directions, account_message, rsvp, guestbook, closing, kakao_share | 전 항목 HTML/JS에 존재 (dday 3종·카카오 버튼 "청첩장 보기"는 script.js:127-132, 774) | PASS |
| 갤러리 15장 순서 | 컨셉 시트 gallery_order | 1~15 파일명·순서 일치, 히어로 컷 제외, 컬러/흑백 중복 없음 | PASS |
| 로컬 파일 존재 | HTML/JS 참조 전체 | 35개 참조(audio/bgm.mp3, divider SVG, 원본 16장, thumb 15장, og-thumbnail.jpg, css/js) 모두 존재 | PASS |
| 이미지 크기 속성 | 실제 픽셀 | width/height·data-full-w/h 31건 모두 `file` 실측과 일치 (og 1200x630) | PASS |
| og 메타 | kakao_share.title/description | og:title·og:description 카피와 동일, og:image = og-thumbnail.jpg(jo--8670 크롭) | PASS (URL은 SITE_URL placeholder) |
| 히어로 alt | 사진 내용 | "신랑이 신부의 베일을 걷어 올리는" — 스크린샷으로 사진과 일치 확인 | PASS |

## 2. 모바일 반응형
- viewport 메타 `width=device-width, initial-scale=1, viewport-fit=cover`, `user-scalable=no` 없음: PASS
- 가로 스크롤 (갤러리 펼친 상태, 전 섹션 reveal 후): 320 / 375 / 414px 모두 scrollWidth = viewport, 화면 밖 요소 0개: PASS
- 768px 이상 max-width 480px 중앙 정렬 (`.card`, 481px 이상 body surface): PASS
- 이미지 폭 처리: 히어로 cover, 그리드 1:1 cover, lightbox contain: PASS
- 320px에서 히어로 영문 이름이 "Inhyeok &" / "Yumin" 두 줄로 줄바꿈 (fallback 서체 기준, Cormorant는 폭이 좁아 한 줄일 가능성 높음): 참고
- 14px 미만 텍스트: hero__venue, couple__role, 달력 요일, 복사 버튼(btn--small), account__side, form__label이 13px: **WARNING (W4)**

## 3. 접근성
- `<html lang="ko">`, 영문 블록 `lang="en"`: PASS
- alt 누락 `<img>` 0건. 디바이더 `alt="" aria-hidden`, 그리드 썸네일 `alt=""` + 버튼 aria-label에 사진 설명, lightbox img alt = 사진 설명: PASS
- heading: h1 1회(hero) → h2 9개, 스킵 없음. main/section/header/footer 사용: PASS
- 대비(계산값): text/bg 13.63, muted/bg 5.57, muted/surface 5.05, accent/bg 7.61, accent/surface 6.91, 흰 글자/accent 8.27, primary/bg 3.21(D-day 28px 대형 텍스트에만 사용, 3:1 기준 충족): PASS
- 음악 토글 aria-pressed·aria-label, 복사 결과 `role="status"` 낭독, lightbox aria-modal·포커스 트랩·포커스 복귀, skip link: PASS

## 4. 인터랙션 (headless Chromium 실측)
- D-day (KST 고정 시각): 2026-10-09 → "D-86", 2027-01-02 23:59 → "D-1", 2027-01-03 00:01 → "D-DAY / 오늘, 인혁 · 유민이 부부가 됩니다.", 2027-01-04 → 숫자 숨김 + 감사 문구: PASS
- 계좌 복사: clipboard → execCommand 폴백 → 실패 시 Selection 코드 존재. 실측 클립보드 = `[[TODO:GROOM_ACCOUNT]]`(현재 placeholder), status "계좌번호가 복사되었습니다": PASS (값은 W1)
- 주소 복사: 클립보드 = "서울 송파구 송파대로 155 NH송파농협 13층": PASS
- 갤러리: 더보기 전 10~15번 썸네일 요청 0건, 펼친 뒤 10번 셀로 포커스: PASS
- lightbox: 3번 열기 → "3 / 15", 2·3·4번만 src 로드, 스크롤 잠금, → 키 "4 / 15", Esc 닫기 후 3번 셀로 포커스 복귀. 스와이프·핀치(1~3)·더블탭 2배·팬 clamp·끌어 닫기 80px 코드 확인: PASS
- 음악: 토글 전 bgm.mp3 요청 없음, 켜면 재생·volume 0.60·이퀄라이저, 끄면 정지: PASS
- 카카오 공유: 키 placeholder → SDK 미로드, 버튼을 누르면 링크 복사로 폴백: **WARNING (W2)**
- RSVP/방명록 폼: endpoint placeholder → 제출 시 입력값 유지 + "접수 주소가 아직 설정되지 않았습니다.": **WARNING (W3)**
- JS 비활성: 갤러리 15장·전 섹션 표시, 더보기 버튼 숨김: PASS
- 콘솔 오류: 웹폰트 407 2건(샌드박스 프록시) 외 없음: PASS

## 5. 모션 명세 구현도

| 항목 | 명세 | 구현 | 결과 |
|------|------|------|------|
| 배경 모션 | 없음 (canvas·파티클·메시 금지) | canvas·파티클 없음, bg 단색 | PASS |
| 히어로 가독성 그라디언트 | 상단 정적 0.55→0 38% | 상단 동일 + 하단 0.7→0 24% 추가 (summary에 사유 기재, 컨셉 허용 범위) | PASS |
| 토큰 `--ease-*` 4종 | out/settle/standard/in 베지어 값 | style.css:26-29 값 동일 | PASS |
| 토큰 `--dur-*` 7종 + distance/stagger | 120/300/250/350/800/2400/1200ms, 16px, 120ms | style.css:31-41 동일, `--dur-short 200ms` 1개 추가 | PASS |
| 2-0 공통 reveal | IO 0.15, -10%, 1회, stagger 120, `.js` 게이트, IO 폴백 | script.js:91-108, style.css:130-148 | PASS |
| 2-1 히어로 settle | decode 후 1.04→1 2400ms, 1500ms 초과 시 정적, 텍스트 +400/+700 | script.js:43-87 | PASS |
| 3-1 그리드 로딩 | lazy, width/height, 10~15 지연, 히어로 preload, 썸네일 페이드 | 구현 + thumb 600px (Should) | PASS |
| 3-2 lightbox | 50px/0.3px/ms, 저항 0.3, 핀치 1~3, 더블탭 2배, 끌어 닫기 80px·1-dy/400 최저 0.4, ±1 로딩 | script.js:284-298 상수 전부 일치 | PASS |
| 3-3 복사 라벨 | 120+120ms, 폭 고정, 폴백, status, vibrate(10) | 구현. 라벨 "복사하기"는 카피 시트 우선 | PASS |
| 3-4 음악 토글 | preload none, 자동재생 없음, 0→0.6 1500ms / →0 400ms, eq 1.2s | script.js:15-17, 194-270 | PASS |
| 3-5 D-day | KST, 로드·visibilitychange 갱신, 카운트업 없음 | 구현 | PASS |
| 3-8 스크롤 안내선 | bounce 없음, scrollY>24에서 400ms 페이드 | 구현 (`--dur-reveal / 2`) | PASS |
| 무한 루프 | 최대 1개 (eq) | `infinite`는 eq-bounce 1건뿐 | PASS |
| layout 속성 애니메이션 | 금지 (width/height/top/left/margin/padding/filter/box-shadow) | transition·JS style 대상 grep 0건, transform/opacity만 | PASS |
| reduced-motion: 토큰 | 0ms 재정의 | style.css:44-58, 실측 `--dur-reveal: 0ms` | PASS |
| reduced-motion: 히어로·reveal | transform 제거, 즉시 표시 | 실측 hero transform none, 미표시 reveal 0개 | PASS |
| reduced-motion: 이퀄라이저(유일한 무한 루프) | 정적 3바 0.5/1/0.7 | 실측 animation none, scaleY 0.5/1/0.7 | PASS |
| reduced-motion: JS duration | lightbox 스냅·줌·settle 0 | `token()`·`delay()`가 matches 시 0, change 리스너 | PASS |

## 6. 배포 준비
- 외부 리소스 HTTPS (Google Fonts, jsDelivr Pretendard, Kakao SDK, 지도 링크), `http://` 0건: PASS
- Placeholder 16개(`[[TODO:*]]`) 모두 05 summary 3장에 파일:줄과 함께 안내됨: PASS (채우기 전 배포 금지는 W1)
- 이전 회차 대비 회귀: 이전 리포트(2026-04-29, 이전 커플)에서 수정했던 D-day 오프바이원은 이번 구현(UTC 날짜 차 + `Math.round`)에서 재발하지 않음(D-1/D-DAY 경계 실측): PASS

## 직접 적용한 수정
- [x] index.html:161 `더보기` → `사진 더 보기`. '더'는 부사라 표준 맞춤법상 "더 보기"로 띄어 쓴다. 대상(사진)을 밝혀 다른 버튼 라벨("참석 여부 전하기", "주소 복사하기")과 형식을 맞췄다. JS는 id로만 참조해 동작 영향 없음

## frontend 작성 문구 점검 (카피 시트 외)
| 문구 | 맞춤법 | 톤 | 판정 |
|------|-------|----|------|
| 더보기 | 띄어쓰기 오류 | - | 수정함 (위) |
| 남기기 | 정상 | "-기" 명사형 라벨이 다른 버튼과 일관. 단독으로는 대상이 모호 | PASS, 선택 제안: "말씀 남기기" |
| 주소 복사하기 / 링크 복사하기 / 복사하지 못했습니다 | 정상 | 정중·간결 | PASS |
| 소중한 말씀 감사합니다. | 정상 | 카피의 "소중한 답변 감사합니다."와 짝 | PASS |
| 전송하지 못했습니다. 잠시 후 다시 시도해 주세요. | 정상 | 정중 | PASS |
| 접수 주소가 아직 설정되지 않았습니다. | 정상 | 개발자 용어("접수 주소", "설정")가 하객에게 노출됨 | W3 |
| 갤러리 사진 설명 15건 | 정상 ("보여 주며", "끼워 주는" 보조용언 띄어쓰기 일관) | 담백, 사용자 입력 사진 설명과 일치 | PASS |

## 발견된 이슈와 수정 제안
- [ ] **W1 (배포 차단) index.html:17-18, 188-196, 217, 230 / script.js:7** placeholder가 그대로 화면에 노출되고 계좌 복사 시 `[[TODO:GROOM_ACCOUNT]]`가 복사된다 → 배포 전 SITE_URL, 계좌 4개, 지하철·버스·주차 값을 채우고 `grep -n '\[\[TODO:' index.html script.js` 결과가 RSVP/GUESTBOOK/KAKAO 외 0건인지 확인
- [ ] **W2 script.js:755-759** 카카오 키가 없으면 "카카오톡으로 공유하기"를 눌러도 카카오톡이 열리지 않고, 옆 "링크 복사하기" 버튼 라벨만 "주소가 복사되었습니다"로 바뀐다. 하객은 공유가 실패했다고 느낄 수 있다 → (a) KAKAO_JS_KEY를 채우거나, (b) 키가 없을 때 `navigator.share?.({ title, text, url })`(모바일 공유 시트에 카카오톡 포함)를 먼저 시도하고 미지원 시에만 링크 복사, 또는 (c) 키가 없으면 카카오 버튼을 숨김
- [ ] **W3 script.js:792-795, index.html:251, 286** endpoint가 없는 상태로 배포하면 하객이 RSVP·방명록을 끝까지 작성한 뒤에야 "접수 주소가 아직 설정되지 않았습니다."를 보게 되고 응답은 어디에도 저장되지 않는다. JS 비활성 시에는 `[[TODO:RSVP_ENDPOINT]]` 상대 경로로 POST되어 오류 페이지로 이동한다. 또한 방명록은 제출만 되고 남긴 글을 페이지에서 볼 수 없다 → endpoint를 채우지 않을 거라면 `initForms()`에서 placeholder일 때 해당 `<section>`을 `hidden` 처리(또는 마크업에서 제거)하는 것을 권장. 남겨 둘 경우 문구를 "참석 여부 접수를 준비하고 있습니다. 조금 뒤에 다시 들러 주세요."처럼 하객 관점으로 교체
- [ ] **W4 style.css:184, 361, 442, 483, 612, 680** 13px 텍스트(hero 예식장명, 신랑/신부 라벨, 달력 요일, 복사 버튼, 계좌 측 라벨, 폼 라벨) → 정보성 텍스트인 `.hero__venue`, `.form__label`, `.btn--small`은 14px 권장. 디자인 판단 영역이라 직접 수정하지 않음


## 변경 이력
- 2026-10-09: 사용자 요청으로 RSVP 섹션을 제거했다(index.html 섹션, style.css의 `.form__choice`·`.choice`, `RSVP_ENDPOINT` placeholder). 방명록은 유지하며, 사용자가 `GUESTBOOK_ENDPOINT`를 나중에 채운다. 접수 주소가 없을 때 안내 문구를 "지금은 방명록을 남길 수 없습니다. 축하의 말씀은 두 사람에게 직접 전해 주세요."로 바꿨다.
