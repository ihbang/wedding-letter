# 디자인 통일 감사: "Petal & Glow"

- 작성: 2026-10-12, concept-director
- 요청(사용자): "다른 섹션과 다르게 방명록만 배경색이 다르다거나, 오시는 길에서 지하철, 주차 등과 다르게 주소 부분만 별도의 박스에 들어가 있는 부분이라거나, 폰트의 사용 등등 전반적으로 검토가 필요할 것 같아"
- 기준: 컨셉 시트(팔레트, 타이포 스케일, `layout_mood`), `00_user-input.md`의 결정 기록, 현재 `index.html`·`style.css`(커밋 `9bc0a6a`)
- 범위: 감사와 제안만 담았다. `index.html`, `style.css`, `script.js`, 컨셉 시트, 카피 시트는 고치지 않았다. 아래 제안은 문구를 한 글자도 바꾸지 않는다. 새 낱말이 필요한 선택지는 따로 표시했다.
- 순서: 1. 현황 표 → 2. 불일치 목록 → 3. 통일 규칙 → 4. 수정 목록 → 5. 사용자 결정 필요

## 0. 확인 방법

- 로컬 서버 `127.0.0.1:8779`에서 headless Chrome을 CDP로 띄웠다(DPR 2, 터치 에뮬레이션). 390x844, 360x780, 430x932에서 페이지 끝까지 스크롤해 reveal을 모두 발동시켰다. 세 화면 모두 숨은 reveal 0개, 가로 스크롤 없음, 콘솔 오류 0건이었다. 데스크톱 1280x900은 방명록 구간만 따로 찍었다.
- 수치는 `getComputedStyle`로 뽑았다. 실제로 그려진 글꼴은 CDP `CSS.getPlatformFontsForNode`로 확인했다.
- 카카오맵은 `127.0.0.1`이 등록 도메인이 아니라 로컬에서 숨겨진다. 배포 화면(`qa5/venue-engine-390.png`)처럼 장소 카드와 지도 버튼 사이에 4:3 지도 카드가 있다고 보고, 스크린샷에서는 `#venue-map`의 `hidden`을 풀어 빈 surface 카드로 자리만 채웠다(390에서 342x257, 360에서 312x234.5, 430에서 382x282).
- 제안 검증: 4장의 추천안을 브라우저 안에서만 CSS로 주입해 렌더해 봤다(`preview-390/`, `preview-360/`). 저장소 파일은 그대로다.
- 대비는 WCAG 상대 휘도 공식으로 계산했다.

스크린샷과 스크립트(저장소 밖): `/private/tmp/claude-501/-Users-inhyeok-Workspace-wedding-letter/cc1402ba-2bf0-4475-9039-e013d45393f0/scratchpad/design-audit/`

| 파일 | 내용 |
|---|---|
| `shots-{360,390,430}/00-first-screen.png` | 첫 화면(BGM 토글 포함) |
| `shots-{360,390,430}/01-hero.png` ~ `10-share.png` | 섹션별(DPR 2). 06 venue, 07 notice, 08 account, 09 guestbook |
| `shots-*/06b-venue-map-placeholder.png` | 오시는 길, 지도 자리 표시 |
| `shots-*/08b-account-expanded.png` | 계좌 카드 두 개 모두 펼침 |
| `shots-*/full.png`, `full-part1~5.png` | 전체 페이지(1x), 1600px씩 나눈 조각 |
| `wide-desktop-guestbook-1280.png` | 데스크톱에서 방명록 밴드와 컬럼 바깥 면이 붙는 모습 |
| `preview-{390,360}/*.png` | 추천안 적용 미리보기(hero-top, couple, calendar, venue, account-guestbook, account-open, share, gallery-controls, full) |
| `audit-{360,390,430}.json` | 계산 스타일 원자료 |

## 1. 현황 표

### 1-1. 섹션별 (390x844)

면 색: background `#FBF6F1`, surface `#F3EAE3`. "투명"은 섹션에 면이 없고 `.page`의 background가 보인다는 뜻이다.

| # | 섹션 | 배경 | 패딩 위 / 아래 (좌우) | 정렬 | 정보를 담는 방식 | 장식 |
|---|---|---|---|---|---|---|
| 1 | hero | background | 48 / 24 (0), 높이 100svh | 가운데 | 맨 텍스트 + 풀블리드 사진 | 보케, 스크롤 큐 |
| 2 | greeting | 투명 | 80 / **0** (24) | 가운데 | 맨 텍스트 3문단 | 끝에 sprig(위 56) |
| 3 | couple | 투명 | **56** / 80 (24) | 가운데 | 맨 텍스트 2행, 행 앞 인라인 라벨 | 없음 |
| 4 | calendar | 투명 | 80 / 80 (24) | 가운데 | 맨 텍스트(일시) + 가는 선 표(달력) + 맨 텍스트(D-day) | string-lights(헤더 위), 보케 |
| 5 | gallery | 투명 | 80 / 80 (**16**) | 가운데 | 사진 프레임(모서리 4) + 원형 버튼 | sprig(헤더 위) |
| 6 | venue | 투명 | 80 / 80 (24) | 가운데, **교통편만 왼쪽** | **카드**(장소명·주소·복사) + 지도 카드 + 버튼 2개 + **구분선 목록**(교통편) | 없음 |
| 7 | notice | 투명 | 80 / 80 (24) | 가운데 | 맨 텍스트 | 없음 |
| 8 | account | 투명 | 80 / 80 (24) | 머리 가운데, 카드 안 왼쪽 | 접이식 카드 2개 | 없음 |
| 9 | guestbook | **surface (섹션 전체 밴드)** | 80 / 80 (24) | 머리 가운데, 폼 왼쪽 | 섹션 면 + 입력 필드 | 없음 |
| 10 | share | 투명 | 80 / 80 + safe-area (24) | 가운데 | 맨 텍스트 + 모노그램 + 버튼 2개 | sprig(맨 위), wreath, 보케 |

섹션 머리(`.section-head`) → 첫 콘텐츠는 모든 섹션이 40px이다(style.css:165).

섹션 사이 실제 여백(앞 섹션 마지막 글자 → 다음 섹션 첫 요소): hero → greeting 217(hero 100svh의 남는 높이), greeting → couple 62(sprig로 묶음), 나머지 약 160~170.

섹션 안 블록 간격(390 실측):

| 섹션 | 블록 → 블록 |
|---|---|
| calendar | lights → eyebrow 20, 머리 → 일시 40, 일시 → 달력 36, 달력 → D-day 36 |
| gallery | sprig → eyebrow 32, 제목 → 안내 12, 머리 → 캐러셀 40, 사진 → 버튼 줄 12 |
| venue | 머리 → 장소 카드 40, 카드 안 주소 → 복사 버튼 18, 카드 → 지도 16, 지도 → 지도 버튼 16, 버튼 → 교통편 36 |
| account | 제목 → 안내문 20, 머리 → 카드 40, 카드 → 카드 12 |
| guestbook | 제목 → 안내문 20, 머리 → 폼 40, 필드 → 필드 18, 폼 → 맺음 안내 16(+빈 상태 줄 22) |
| share | sprig → 모노그램 36, 모노그램 → Thank you 28, 맺음말 → 버튼 36 |

### 1-2. 텍스트 역할별 (390, 계산 스타일)

글꼴 약칭: Gowun = Gowun Batang, Pre = Pretendard, Cor = Cormorant Garamond. 색은 토큰 이름(text `#3B2D2A`, muted `#75655E`, accent `#8E5558`, sage_deep `#5B6A46`, on_accent `#FFFCF8`).

| 역할 | 요소 (선택자) | 글꼴 | 굵기 | 크기 / 줄 높이 | 색 | 자간·기타 |
|---|---|---|---|---|---|---|
| eyebrow | 섹션 eyebrow (`.eyebrow`), hero eyebrow | Cor | 500 | 13 / 16 | accent | 0.28em, 대문자 |
| eyebrow 모양 | 달력 캡션 "JANUARY 2027" (`.cal__caption-en`) | Cor | 500 | 13 / 16 | accent | 0.28em. **eyebrow와 똑같다** |
| 섹션 제목 | `.section-title` | Gowun | 700 | 20 / 30 | text | |
| 섹션 제목(예외) | "Thank you" (`.share__title`) | Allura | 400 | 48 / 57.6 | accent | 컨셉 지정 |
| 이름 | hero 이름 / couple 이름 | Gowun | 700 | 22 / 36, 18 / 34.2 | text | hero 0.08em |
| 핵심 정보 | 예식일 섹션 일시 (`.calendar__when`) | Gowun | **400** | 17 / 27.2 | text | |
| 핵심 정보 | 장소명 (`.venue__name`) | Gowun | **700** | 17 / 27.2 | text | |
| 본문 | greeting, notice, account 안내문, guestbook 안내문, share 맺음말 | Gowun | 400 | 15 / 29.25 (1.95) | text | |
| 본문 | couple 행 (`.couple__line`) | Gowun | 400 | 15 / 28.5 (**1.9**) | text | |
| 본문 | D-day 문구 (`.dday__message`) | Gowun | 400 | 15 / 27 (**1.8**) | text | |
| 본문 | hero 일시 (`.hero__when`) | Gowun | 400 | 15 / 24 | text | hero 고정값 |
| 정보 라벨 | 신랑·신부 (`.couple__role`) | Pre | **500** | 14 / 22.4 | **muted** | |
| 정보 라벨 | 지하철·주차·내비게이션 (`.venue__route dt`) | Pre | 600 | 14 / 22.4 | **sage_deep** | |
| 정보 라벨 | 신랑측·신부측 (`.account__side`) | Pre | 600 | 14 / 21 | **sage_deep** | |
| 정보 라벨 | 성함·남기실 말씀 (`.gb-label`) | Pre | **500** | 14 / 19.6 | **text** | |
| 정보 라벨 | 예금주 (`.account__holder-label`) | Pre | **400** | 14 / 21 | **muted** | 값과 같은 모양 |
| 표 머리 | 요일 (`.cal th`) | Pre | 500 | 14 / 14 | muted, 일요일 accent | |
| 정보 값 | 주소 (`.venue__address`) | Pre | 400 | 14 / 22.4 (1.6) | **muted** | |
| 정보 값 | 교통 안내 (`.venue__route dd`) | Pre | 400 | 14 / 23.8 (1.7) | text | |
| 정보 값 | 계좌번호 (`.account__number`) | Pre | 500 | 15 / 22.5 | text | |
| 보조 값 | 예금주 줄 (`.account__holder`), hero 장소 (`.hero__where`) | Pre | 400 | 14 / 21, 14 / 22 | muted | |
| 보조 안내 | 갤러리 안내 (`.section-note`), 방명록 맺음 (`.guestbook__note`) | Pre | 400 | 14 / 22.4 | muted | |
| 상태 문구 | 방명록 결과 (`.gb-status`) | Pre | 400 | 14 / 22.4 | text | |
| 버튼 | `.btn` 전부 | Pre | 500 | 14 / 16.8 | primary on_accent / secondary accent | |
| 숫자 | hero 날짜 (`.hero__date`) | Cor | 300 | 34 / 40 | text | 0.06em, **old-style 숫자** |
| 숫자 | hero 요일·시각 (`.hero__time`) | Cor | 500 | 12 / 16 | muted | 0.2em, **old-style** |
| 숫자 | D-day (`.dday__count`) | Cor | 300 | 34 / 40.8 | accent | 0.06em, **old-style** |
| 숫자 | 갤러리 카운터 (`.g-counter`) | Cor | 400 | 16 / 16 | muted, 현재 번호 text | 0.1em, **lining + tabular** |
| 숫자 | 라이트박스 카운터 (`.lb-counter`) | Cor | 400 | 16 / 16 | background(어두운 면 위) | 0.1em, **old-style** |
| 숫자 | 달력 날짜 (`.cal td`) / 예식일 원 (`.cal__mark`) | Pre | 400 / 600 | 14 / 14 | text / on_accent(accent 원) | |
| 모노그램 | `.monogram__text` / `&` | Cor italic / Allura | 400 | 26 / 30 | accent | 컨셉 지정 |
| 폼 입력 | `.gb-input` | Pre | 400 | 16 / 24 | text, placeholder muted | iOS 확대 방지 16px |
| 토스트 | `.toast` | Pre | 500 | 14 / 19.6 | background(text 면 위) | |

실제로 그려진 글꼴: 네 글꼴 모두 로드됐고 시스템 대체 글꼴로 그려진 요소는 없었다. CDP는 Cormorant를 굵기와 상관없이 "Cormorant Garamond Light"로 보고하는데, 이건 가변 글꼴의 기본 인스턴스 이름일 뿐이다. 같은 문자열을 40px로 그리면 300/400/500에서 폭이 483.6 / 485.3 / 487.6px로 달라서, 지정한 굵기가 실제로 적용되고 있다.

### 1-3. 컴포넌트

| 컴포넌트 | 위치 | 테두리 | 모서리 | 면 | 안쪽 여백 | 정렬 |
|---|---|---|---|---|---|---|
| `.card` 공통 (style.css:187-191) | | 1px line `#E4D6CD` | 16 | surface | | |
| 장소 카드 | venue | 공통 | 16 | surface | 28 / 20 | 가운데 |
| 지도 카드 | venue | 공통 | 16 | surface(로딩 면) | 0, 4:3, 최대 280 | |
| 계좌 카드 | account | 공통 | 16 (summary 15) | surface | summary 0 20, 높이 56 / 본문 좌우 20, 위 16 아래 20, 위쪽 1px line | 왼쪽 |
| 방명록 밴드 | guestbook 섹션 전체 | 없음 | 0 | surface | 섹션 패딩 | |
| 입력 필드 | guestbook | 1px field_border `#958379` | **10** | `#FFFDFB` | 12 / 14 | 왼쪽 |
| 사진 프레임 | gallery | 없음 | 4 | surface 매트 | 0 | |

| 버튼 종류 | 쓰는 곳 | 폭 (390) | 테두리 | 면 | 글자·아이콘 |
|---|---|---|---|---|---|
| primary pill | 남기기, 카카오톡으로 공유하기 | 342 (전체) | 없음 | accent | on_accent |
| secondary pill | 주소 복사하기 | **158 (내용 폭)** | 1px accent | 투명 | accent |
| secondary pill | 네이버 지도, 카카오맵 | 167 x 2 (2분할) | 1px accent | 투명 | accent |
| secondary pill | 계좌 복사하기 | 300 (카드 안 전체) | 1px accent | 투명 | accent |
| secondary pill | 링크 복사하기 | 342 (전체) | 1px accent | 투명 | accent |
| 원형 아이콘 | 갤러리 이전/다음(터치 44, 보이는 원 40) | | 1px **primary** | 투명 | accent 화살표 |
| 원형 아이콘 | BGM 토글(40) | | 1px **primary** | background 0.92 | accent 음표 |
| 접기 행 | 계좌 summary | 카드 폭 | 카드 테두리 | surface | sage_deep 라벨 + accent 화살표 |

| 그 밖의 요소 | 현재 |
|---|---|
| 구분선 | 모두 1px line `#E4D6CD`: 교통편 목록(맨 위, 행마다 아래), 달력(머리글 위아래, 마지막 행 아래), 계좌 카드 안(summary 아래). 이미 통일돼 있다 |
| 장식 SVG | sprig 3곳(greeting 끝, gallery 헤더 위, share 맨 위), string-lights 1곳(calendar 헤더 위), wreath 1곳(share 모노그램). 장식 → 다음 요소 간격은 56(greeting) / 32(gallery) / 36(share) / 20(lights)로 제각각이다 |
| 모서리 값 | 16 카드, 15 summary(카드 안쪽), 999 버튼, 50% 원형, **10 입력**, 4 사진, 0 hero 사진 |
| 왼쪽 정렬 글자 시작점 (390) | 교통편 x **28**(행 좌우 4px), 계좌 라벨 x **45**(테두리 1 + 20), 방명록 라벨 x **24** |

## 2. 불일치 목록

중요도: **상** = 사용자가 바로 알아차리는 것, **중** = 같은 역할이 다르게 보이는 것, **하** = 간격·줄 높이 미세 조정.

| ID | 중요도 | 위치 | 현재 상태 | 왜 어긋나 보이는가 |
|---|---|---|---|---|
| U1 | 상 | style.css:793 `.guestbook`, index.html:344 | 방명록만 섹션 전체가 surface 밴드. 나머지 9개 섹션은 background | 컨셉 시트가 처음부터 정한 밴드지만, 그 뒤 계좌가 surface 카드로 바뀌고(2026-10-11) notice가 생기면서 "surface = 카드 면"과 "surface = 섹션 밴드"가 한 페이지에 섞였다. 계좌 카드 80px 아래에서 섹션 전체가 같은 색으로 바뀌어 카드 면이 섹션으로 번진 것처럼 읽히고, 이 섹션만 다른 이유를 화면에서 알 수 없다. 데스크톱(481px 이상)에서는 컬럼 바깥 면(style.css:96 `body`)도 surface라서 방명록 구간에서만 480px 컬럼 경계가 사라진다(`wide-desktop-guestbook-1280.png`) |
| U2 | 상 | index.html:247 `.card.venue__card`, style.css:673-680 | 장소명·주소·주소 복사만 카드 안에 있고, 지하철·주차·내비게이션은 카드 없는 구분선 목록(style.css:708-725) | 같은 "찾아오는 정보"를 담는 그릇이 둘이다. 카드 안은 가운데 정렬, 목록은 왼쪽 정렬이라 한 섹션 안에서 정렬도 바뀐다. 주소 복사 버튼은 카드 안, 지도 버튼은 카드 밖이라 버튼 소속도 갈린다 |
| U3 | 상 | style.css:469-473, 717-720, 754-757, 804-808, 781-785 | 정보 라벨이 네 모양: 신랑·신부 Pre 500 muted / 지하철·신랑측 Pre 600 sage_deep / 성함 Pre 500 text / 예금주 Pre 400 muted(값과 같은 모양) | "이 값이 무엇인지 알려 주는 짧은 이름표"라는 같은 역할에 색 3가지, 굵기 3가지를 쓴다. 섹션을 넘길 때마다 라벨 모양이 바뀐다 |
| U4 | 상 | style.css:501, 674 | 예식일 섹션의 일시는 Gowun 400 17px, 오시는 길의 장소명은 Gowun 700 17px | 둘 다 섹션 제목 바로 아래 오는 "이 섹션의 답"인데 하나만 굵다. 17px은 컨셉 시트 스케일(20 / 15 / 14)에도 없는 크기라 역할 이름이 없다 |
| U5 | 중 | style.css:675-679 | 주소만 muted(14 / 1.6). 교통 안내와 계좌번호는 text | 복사 버튼이 붙은 가장 중요한 값이 그 섹션에서 가장 흐리다. 대비는 4.68:1로 기준을 넘지만 위계가 거꾸로다 |
| U6 | 중 | style.css:512-518 | 달력 캡션 "JANUARY 2027"이 섹션 eyebrow(167-173)와 글꼴·크기·색·자간이 같다 | 한 섹션에 "THE DAY"와 "JANUARY 2027"이 같은 모양으로 두 번 나와, 달력 위에서 새 섹션이 시작하는 것처럼 읽힌다 |
| U7 | 중 | style.css:362, 369, 512, 547, 666, 1006 | Cormorant 숫자 중 갤러리 카운터만 lining + tabular. hero 날짜·요일 줄, 달력 캡션, D-day, 라이트박스 카운터는 기본값(old-style) | old-style 숫자는 대문자 옆에서 높이가 맞지 않는다. "SUNDAY · 3 PM"의 3이 기준선 아래로 내려가고, "JANUARY 2027"의 2027이 대문자보다 작다. hero의 "01"은 "oI"처럼 보인다. 같은 "n / 15"인데 갤러리와 라이트박스의 숫자 모양이 다르다 |
| U8 | 중 | style.css:650 `.g-nav::before`, 283 `.bgm-face` | 원형 버튼 윤곽선은 primary `#C9A09F`(bg 대비 2.17), pill 버튼 윤곽선은 accent(5.45) | 같은 "누를 수 있는 윤곽선"이 두 색이다. 아이콘이 accent라 WCAG 1.4.11은 통과하지만, 원형 버튼이 장식선처럼 흐리게 보이고 비활성(opacity 0.3)일 때는 거의 사라진다(1.24:1) |
| U9 | 중 | style.css:680, 704-707, 786-789, 832, 885-889 | 버튼 폭이 내용 폭(주소 복사 158px), 2분할(지도), 카드 안 전체(계좌 복사), 컬럼 전체(남기기·공유·링크 복사)로 섞여 있다 | 내용 폭 버튼은 주소 복사 하나뿐이다. 다른 단독 버튼은 모두 전체 폭이다 |
| U10 | 중 | style.css:714 `.venue__route` | 교통편 행 좌우 padding 4px | 왼쪽 정렬 글자 시작점이 교통편 x 28, 방명록 x 24, 계좌 카드 x 45로 셋이다. 4px은 카드 안쪽(20)도 목록(0)도 아닌 값이다 |
| U11 | 하 | style.css:814 `.gb-input` | 입력 필드 모서리 10px | 카드 16, 버튼 999, 사진 4에 더해 네 번째 모서리 값이다. 컨셉 시트 `layout_mood`에도 없다 |
| U12 | 하 | style.css:474, 556, 735 vs 453 | 15px Gowun 본문의 줄 높이가 1.95 / 1.9(couple) / 1.8(D-day 문구). 문단 사이는 greeting 1.95em(한 줄), account 안내문 1em(반 줄) | 같은 본문 역할에서 줄 높이와 문단 간격이 갈린다. 카피 시트는 "빈 줄 = 문단 구분" 한 가지 규칙만 쓴다 |
| U13 | 하 | style.css:182 vs 732, 795 | 제목 → 안내문 간격: gallery 12px, account·guestbook 20px | 같은 "제목 밑에 붙는 문장"인데 간격이 다르다 |
| U14 | 하 | style.css:491, 506, 546, 565, 709, 801, 850, 876, 888, 461, 680 | 섹션 안 블록 간격이 36 / 32 / 28로 섞이고, 장식 → 헤더 간격이 20(lights) / 32(gallery sprig), 촘촘한 간격이 18 / 14 / 16으로 섞여 있다 | 하나하나는 작지만 리듬이 섹션마다 조금씩 달라진다. 간격 단위가 정해져 있지 않다 |
| U15 | 하 | index.html:275, style.css:721-725 | 360·390에서 주차 안내 둘째 줄 끝 "드립니다."만 다음 줄로 떨어진다 | 사용자가 준 문구가 한 줄 16자 기준보다 길다. 문구는 그대로 두고 `text-wrap: pretty`를 주면 "안내해 드립니다."가 함께 내려가는 것을 360에서 확인했다(U10 수정 후 390은 한 줄에 들어간다) |

일부러 다르게 둔 것(고치지 않는다):

- hero: 100svh, 사진 풀블리드, 위 패딩 48, 아래 24는 첫 화면 레이아웃이다(컨셉 시트 `hero_layout`). hero 뒤 217px은 남는 높이를 나눈 결과다.
- greeting 아래 0, couple 위 56, 그 사이 sprig: 인사말과 혼주 표기를 한 묶음으로 읽히게 하는 구분이다.
- gallery 좌우 16px, 사진 모서리 4px, 가로 사진의 surface 매트: 캐러셀 명세 그대로다.
- hero의 장소 줄(Pre 14 muted)과 오시는 길의 장소명(핵심 정보): 역할이 달라 모양이 다른 것이 맞다.
- 달력 날짜·계좌번호·주소의 Pretendard 숫자: 읽고 받아 적는 데이터 숫자는 산세리프, 분위기를 내는 숫자는 Cormorant로 나눈다(규칙 T11, T12).
- 데스크톱 컬럼 바깥 surface: 컨셉 시트 그대로다. U1과 맞물리는 부분은 D1에서 다룬다.
- 구분선 색과 굵기: 이미 1px line 하나로 통일돼 있다.

## 3. 통일 규칙

컨셉 시트의 원칙(사진이 주인공, 여백과 가는 선, 면은 두 단계, 대비 기준)은 그대로 둔다. 바꾸는 것은 "어떤 정보를 어떤 그릇과 모양에 담는가"의 규칙이다. 아래 규칙은 5장의 추천안(D1a, D2a, D3a, D4a)을 전제로 한다.

### R1. 섹션 배경과 리듬

- 모든 섹션의 바탕은 background다. surface는 섹션 면으로 쓰지 않고 카드, 사진 매트, 지도 로딩 면에만 쓴다(D1).
- 섹션 상하 패딩은 80이다. 예외는 hero, greeting·couple 묶음(0 / 56 + sprig), closing 아래 safe-area 세 곳이다(2026-10-12 share/closing 분리).
- 섹션은 여백(약 160)과 장식 SVG로만 나눈다. 배경색을 바꿔서 나누지 않는다.
- 보케 구간(hero, calendar, closing)은 바뀌지 않는다(2026-10-12 share/closing 분리). 방명록을 background로 바꿔도 보케 구간이 아니므로 보케는 나타나지 않는다.

영향: guestbook.

### R2. 정보 묶음 방식(그릇)

| 내용 | 그릇 | 해당 |
|---|---|---|
| 문장(인사, 안내, 맺음) | 맨 텍스트, 가운데 | greeting, notice, account·guestbook 안내문, share 문구(맺음말은 삭제, 2026-10-12 share/closing 분리) |
| 섹션의 답 한두 줄(일시, 장소) | 맨 텍스트, 가운데 | 예식일 일시, 오시는 길 장소명·주소 |
| 라벨 + 값이 여러 행 | 구분선 목록, 왼쪽 | 교통편 |
| 표 | 가는 선 표 | 달력 |
| 상태가 있거나 바깥 콘텐츠를 담는 틀(펼침, 지도) | 카드 | 계좌 접기, 카카오맵 |
| 사진 | 사진 프레임 | 갤러리 |
| 입력 | 필드 | 방명록 |

카드는 "눌러서 상태가 바뀌거나 지도처럼 바깥 콘텐츠를 담는 틀"에만 쓴다. 정보를 강조하려고 카드에 넣지 않는다. 강조는 글자 크기와 위치(섹션의 답)로 한다.

영향: venue(D2), guestbook(D1).

### R3. 정렬

- 가운데: 섹션 머리, 문장, 섹션의 답, 버튼 묶음.
- 왼쪽: 라벨-값 목록, 폼, 카드 안의 라벨-값.
- 왼쪽 정렬 글자의 시작점: 목록과 폼은 컬럼 가장자리(들여쓰기 0, 390에서 x 24), 카드 안은 카드 안쪽 20px(x 45). 그 밖의 값은 쓰지 않는다.

영향: venue 교통편(4px → 0).

### R4. 텍스트 역할별 타이포

| 역할 | 글꼴 | 굵기 | 크기 / 줄 높이 | 색 | 기타 | 해당 선택자 |
|---|---|---|---|---|---|---|
| T1 eyebrow | Cormorant Garamond | 500 | 13 / 16 | accent | 0.28em, 대문자. **섹션 머리에만, 섹션당 한 번** | `.eyebrow`, `.hero__eyebrow` |
| T2 섹션 제목 | Gowun Batang | 700 | 20 / 1.5 | text | closing만 Allura 48 accent(컨셉 지정) (2026-10-12 share/closing 분리) | `.section-title`, `.closing__title` |
| T3 이름 | Gowun Batang | 700 | 22(hero), 18(couple) | text | | `.hero__names`, `.couple__name` |
| T4 핵심 정보(섹션의 답) | Gowun Batang | 400 | 17 / 1.6 | text | | `.calendar__when`, `.venue__name` |
| T5 본문 | Gowun Batang | 400 | 15 / 1.95 | text | 문단 사이 1.95em(빈 줄 하나) | greeting, notice, account·guestbook 안내문, share 문구 `.share__message`(맺음말은 삭제, 2026-10-12 share/closing 분리), `.couple__line`, `.dday__message` |
| T6 정보 값 | Pretendard | 400 | 14 / 1.7 | text | | `.venue__address`, `.venue__route dd` |
| T6b 계좌번호 | Pretendard | 500 | 15 / 1.5 | text | 받아 적는 숫자 열이라 한 단계 크게. 지금 그대로 | `.account__number` |
| T7 정보 라벨 | Pretendard | 600 | 14 / 1.6 | sage_deep | | `.couple__role`, `.venue__route dt`, `.account__side`, `.gb-label` |
| T8 보조 안내·보조 값 | Pretendard | 400 | 14 / 1.6 | muted | 예금주 줄은 계좌번호와 붙여 읽도록 1.5 유지 | `.section-note`, `.guestbook__note`, `.account__holder`, `.hero__where` |
| T9 버튼 | Pretendard | 500 | 14 / 1.2 | R6 | | `.btn` |
| T10 표 머리 | Pretendard | 500 | 14 | muted, 일요일 accent | 지금 그대로 | `.cal th` |
| T11 데이터 숫자 | Pretendard | 400(예식일 600) | 14 | text | 지금 그대로 | `.cal td`, `.cal__mark` |
| T12 분위기 숫자 | Cormorant Garamond | 300(큰 숫자), 400(카운터), 500(작은 대문자 줄) | 지금 크기 | 지금 색 | `font-variant-numeric: lining-nums`, 카운터는 `tabular-nums` 추가 | `.hero__date`, `.hero__time`, `.dday__count`, `.g-counter`, `.lb-counter`, `.cal__caption-en`, `.closing__date` |
| T13 표 제목 | Cormorant Garamond | 500 | 16 / 20 | text | 0.16em, lining. 맺음 날짜 '2027.01.03'도 이 모양(2026-10-13 7차 QA: 컨셉 시트 `table_title`과 맞춤) | `.cal__caption-en`, `.closing__date` |
| T14 입력 | Pretendard | 400 | 16 / 1.5 | text, placeholder muted | iOS 확대 방지 | `.gb-input` |
| T15 맺음 이름 | Cormorant Garamond | 400 italic | 22 / 1.4 | text | 'Inhyeok & Yumin'. 한글 이탤릭 명조가 없어 영문 이탤릭(사용자 결정). 2026-10-13 7차 QA: 컨셉 시트 `closing_names`와 맞춤 | `.closing__names` |
| T16 섹션 안 한글 소제목 | Gowun Batang | 700 | 17 / 1.6 | text | 섹션 제목(T2 20)보다 한 단계 낮춘다. 방명록 목록 제목 "남겨 주신 말씀"(2026-10-13 방명록 공개, 8차 QA W14) | `.gb-list-title` |
| 스크립트 | Allura | 400 | 3곳 | accent | 컨셉 시트 그대로(hero `&`, 모노그램 `&`, Thank you) | |

eyebrow 모양(T1)은 섹션 머리에서만 쓴다. 섹션 안에 소제목이 필요하면 T13처럼 text 색으로 한 단계 낮춘다.

### R5. 라벨 색

- 값 앞에 따로 서는 라벨은 sage_deep 600이다(bg 5.44:1, surface 4.92:1).
- 값과 한 줄에 붙은 접두어(예금주)는 그 줄의 색(muted)을 따른다.
- muted는 보조 안내와 보조 값에만 쓴다. text는 값과 본문에만 쓴다.

영향: couple, guestbook(D4).

### R6. 버튼

- 높이 44 이상, Pretendard 500 14, 모서리 999.
- primary(accent 면 + on_accent 글자 5.72:1): 그 섹션의 마지막 행동 하나(남기기, 카카오톡으로 공유하기).
- secondary(1px accent 테두리 + accent 글자, bg 5.45:1, surface 4.93:1): 그 밖의 모든 행동.
- 폭: 단독 버튼은 담긴 영역의 전체 폭이다(컬럼 342, 카드 안 300). 대등한 두 선택지는 2분할이다(지도). 내용 폭 버튼은 쓰지 않는다.
- 원형 아이콘 버튼(갤러리 이전/다음, BGM)도 윤곽선은 1px accent다. bg 위 5.45:1, BGM 면(background 0.92)이 가장 어두운 사진 위에 얹혀도 면과 윤곽선 사이 4.63:1. 비활성은 지금처럼 opacity 0.3.
- 계좌 접기 행은 카드 전체가 버튼이고 화살표만 accent다. 지금 그대로 둔다.

영향: venue(주소 복사 폭), gallery, BGM 토글.

### R7. 모서리

16(카드, 입력 필드) / 999(pill 버튼) / 50%(원형 버튼) / 4(사진 프레임) / 0(hero 사진). summary의 15는 카드 안쪽 맞춤이라 그대로 둔다.

영향: guestbook 입력 필드.

### R8. 여백 단위

8, 12, 16, 20, 24, 32, 40, 56, 80만 쓴다.

| 관계 | 값 |
|---|---|
| 섹션 상하 패딩 | 80 |
| 섹션 머리 → 콘텐츠 | 40 |
| 섹션 안 블록 → 블록 | 32 |
| 장식 → 섹션 머리 | 24 |
| 장식이 섹션 사이 구분일 때(greeting sprig) | 56 |
| 섹션 제목 → 제목 밑 문장 | 20 |
| 이어진 요소(값 → 버튼, 지도 → 지도 버튼, 필드 → 필드, 행 → 행, 구분선 목록 행 안쪽 위아래) | 16 |
| 형제 카드 사이, 사진 → 버튼 줄 | 12 |
| 라벨 → 필드, 나란한 버튼 사이 | 8 |
| eyebrow → 제목 | 10 (글자 한 쌍이라 예외로 둔다) |
| (2026-10-12 7차 QA W11) 맺음: 장식 → 모노그램 | 24 ("장식 → 섹션 머리"와 같은 관계. 맺음은 모노그램이 머리 자리다) |
| (2026-10-12 7차 QA W11) 맺음: 모노그램 → Thank you, Thank you → 날짜, 날짜 → 이름 | 32, 20, 8 (블록 → 블록, 제목 → 제목 밑 문장, 붙은 두 줄) |

hero 내부 간격은 `hero_layout`의 세로 예산을 따르므로 이 표에서 뺀다.

예외(2026-10-12 6차 QA W9): 한 묶음으로 붙은 두 줄 사이(2, 4), 버튼·입력 필드의 안쪽 패딩(14, 22), 포커스 링 자리(4)는 이 단계를 따르지 않는다. 블록 사이 간격이 아니라 요소 안쪽 값이기 때문이다.

### R9. 대비 (계산값)

| 전경 | 배경 | 대비 | 쓰는 곳 |
|---|---|---|---|
| text | background / surface / 필드 `#FFFDFB` | 12.26 / 11.09 / 12.98 | 본문, 값, 표 제목(T13) |
| muted | background / surface / 필드 | 5.17 / 4.68 / 5.48 | 보조 안내, placeholder |
| sage_deep | background / surface | 5.44 / 4.92 | 라벨(T7) |
| accent | background / surface | 5.45 / 4.93 | eyebrow, 버튼 글자·윤곽선, 원형 버튼 윤곽선 |
| on_accent | accent | 5.72 | primary 버튼 글자 |
| field_border | background / surface / 필드 | 3.37 / 3.05 / 3.57 | 입력 경계(비텍스트 3:1). 방명록이 background로 바뀌어도 충족 |
| text / accent / muted | (2026-10-12 보케 B안) 보케가 글자 영역을 피하므로 글자 바탕은 background 그대로다 | 12.26 / 5.45 / 5.17 | calendar의 달력 캡션, D-day, hero, closing. 겹친다고 가정한 최악값과 회피 방식은 모션 명세 1-3 |
| primary(지금 원형 버튼 윤곽선) | background | 2.17 | 3:1 미달. R6에서 accent로 바꾼다 |
| line | background / surface | 1.32 / 1.20 | 장식 구분선 전용. 입력 경계로 쓰지 않는다(지금도 안 씀) |

본문 4.5:1, 비텍스트 3:1을 모든 제안 조합이 넘는다.

## 4. 수정 목록 (frontend 구현용)

5장의 추천안을 전제로 쓴 목록이다. `[D1]`처럼 표시한 항목은 해당 결정이 다른 선택지로 나면 바뀐다. 줄 번호는 커밋 `9bc0a6a` 기준이다. 사진, 갤러리 캐러셀, 보케, 카카오맵 카드의 동작은 건드리지 않는다. `script.js`는 주석 한 줄 외에는 바뀌지 않는다(`.venue__card`나 방명록 배경을 읽는 코드가 없다).

### 우선순위 상

| ID | 규칙 | 파일:줄 / 선택자 | 지금 | 바꿀 것 | 섹션 |
|---|---|---|---|---|---|
| M1 | R1 [D1] | style.css:793 `.guestbook` | `background: var(--color-surface);` | 규칙 삭제. 791행 주석 "(surface band)"와 index.html:344 주석 "(surface band)"도 지운다. `.gb-input`의 면 `#FFFDFB`와 field_border 테두리는 그대로 둔다 | guestbook |
| M2 | R2·R6 [D2] | index.html:247 `<div class="card venue__card">` | 카드 | `<div class="venue__info">`로 바꾼다(`card` 클래스 제거, 이름 변경). style.css:673 `.venue__card { padding: 28px 20px; }` 삭제. 680행 `.venue__card .copy-btn { margin-top: 18px; }` → `.venue__info .copy-btn { width: 100%; margin-top: 16px; }`. script.js:1376 주석의 "the venue card"를 "the venue info"로(주석만) | venue |
| M3 | R8 [D2] | style.css:686 `.venue__map` | `margin-top: 16px` | `margin-top: 24px`(주소 묶음과 지도 묶음을 나눈다). 지도가 숨겨지면 주소 복사 버튼 → 지도 버튼은 `.venue__maps`의 16px로 그대로 이어진다 | venue |
| M4 | R4 T4 | style.css:674 `.venue__name` | `font: 700 17px/1.6 …` | `font: 400 17px/1.6 var(--font-ko-serif);` | venue |
| M5 | R4 T6 | style.css:675-679 `.venue__address` | `margin-top: 6px; color: var(--color-muted); font: 400 14px/1.6 …` | `margin-top: 4px;` color 선언 삭제(text 상속), `font: 400 14px/1.7 var(--font-ko-sans);` | venue |
| M6 | R5 [D4] | style.css:469-473 `.couple__role` | `color: var(--color-muted); font: 500 14px/1.6 …` | `color: var(--color-sage-deep); font: 600 14px/1.6 var(--font-ko-sans);` | couple |
| M7 | R5 [D4] | style.css:804-808 `.gb-label` | `font: 500 14px/1.4 …`, 색 없음(text) | `color: var(--color-sage-deep); font: 600 14px/1.4 var(--font-ko-sans);` | guestbook |
| M8 | R3 | style.css:714 `.venue__route` | `padding: 16px 4px;` | `padding: 16px 0;` | venue |

### 우선순위 중

| ID | 규칙 | 파일:줄 / 선택자 | 지금 | 바꿀 것 | 섹션 |
|---|---|---|---|---|---|
| M9 | R4 T13 | style.css:512-518 `.cal__caption-en` | eyebrow와 같은 값(accent, 13px, 0.28em) | `padding-left: 0.16em; color: var(--color-text); font: 500 16px/20px var(--font-en-serif); letter-spacing: 0.16em; font-variant-numeric: lining-nums;` | calendar |
| M10 | R4 T12 [D3] | style.css:362 `.hero__date`, 369 `.hero__time`, 547 `.dday__count`, 1006 `.lb-counter` | `font-variant-numeric` 없음(old-style) | 각 규칙의 `font` 선언 **뒤에** `font-variant-numeric: lining-nums;`를 넣는다. `.lb-counter`는 `lining-nums tabular-nums`(갤러리 카운터와 같게). **주의: `font` 단축 속성은 `font-variant-numeric`을 normal로 되돌린다.** 같은 규칙 안에서 `font`보다 앞에 쓰거나 뒤에 오는 다른 `font` 규칙이 있으면 적용되지 않는다(미리보기에서 실제로 걸렸다) | hero, calendar, lightbox |
| M11 | R6 | style.css:650 `.g-nav::before`, 283 `.bgm-face` | `border: 1px solid var(--color-primary)` | `var(--color-accent)`로 | gallery, BGM 토글 |

M2의 주소 복사 버튼 전체 폭(R6)은 M2에 들어 있다.

### 우선순위 하

| ID | 규칙 | 파일:줄 / 선택자 | 지금 | 바꿀 것 | 섹션 |
|---|---|---|---|---|---|
| M12 | R7 | style.css:814 `.gb-input` | `border-radius: 10px;` | `border-radius: var(--radius-card);` | guestbook |
| M13 | R4 T5 | style.css:474 `.couple__line` / 556 `.dday__message` / 735 `.account__message p + p` | 1.9 / 1.8 / `margin-top: 1em` | `line-height` 1.95 / 1.95 / `margin-top: 1.95em`. couple 두 줄의 가로 정렬(`.couple__rel`)은 줄 높이와 상관없다 | couple, calendar, account |
| M14 | R8 | style.css:182 `.section-note` | `margin-top: 12px` | `20px` | gallery |
| M15 | R8 (블록 32) | style.css:506 `.cal`, 546 `.dday`, 709 `.venue__routes`, 850 `.share .sprig`(margin-bottom), 888 `.share__buttons` / 876 `.share__thanks`. (2026-10-12 share/closing 분리: sprig와 Thank you 묶음은 지금 `.closing .sprig`(24로 바뀜)·`.closing__thanks`이고, `.share__buttons` 위 여백은 섹션 머리 → 콘텐츠 40이 맡는다) | 36 / 28 | 모두 `32px`. `.cal`은 `margin: 32px auto 0` | calendar, venue, share·closing (2026-10-12 share/closing 분리) |
| M16 | R8 (장식 24) | style.css:491 `.lights`(margin-bottom), 565 `.gallery .sprig`(margin-bottom) | 20 / 32 | 둘 다 `24px`. `.lights`는 `margin: 0 auto 24px` | calendar, gallery |
| M17 | R8 (16) | style.css:801 `.gb-form` gap, 461 `.couple__list` gap | 18 / 14 | 둘 다 `16px` | guestbook, couple |
| M18 | U15 | style.css:721-725 `.venue__route dd` | | `text-wrap: pretty;` 추가(지원하지 않는 브라우저는 지금과 같다) | venue |

### 구현 후 확인할 것 (QA)

- 360 / 390 / 430에서 가로 스크롤 없음, 숨은 reveal 0개, 콘솔 오류 0건.
- 장소명 "더컨벤션 송파문정 13층 아모르홀"과 "JANUARY 2027"이 세 화면 모두 한 줄(미리보기 360·390에서 한 줄 확인).
- 왼쪽 정렬 글자 시작점: 교통편 라벨과 방명록 라벨 모두 x 24(390). 미리보기에서 확인.
- 계산 스타일: `.guestbook` 배경 투명, `.venue__info`에 테두리·면 없음, 주소 복사 버튼 폭 = 컬럼 폭(390에서 342, 360에서 312), `.couple__role`·`.gb-label` 색 `rgb(91, 106, 70)` 굵기 600, `.hero__date`·`.hero__time`·`.cal__caption-en`·`.dday__count`·`.lb-counter`의 `font-variant-numeric`이 `lining-nums`를 포함, `.g-nav::before`·`.bgm-face` 테두리 `rgb(142, 85, 88)`.
- 배포 화면에서 지도 카드가 주소 복사 버튼 24px 아래에 오는지, 지도가 실패해 숨겨지면 복사 버튼과 지도 버튼 사이가 16px인지.
- hero 첫 화면 세로 예산: `.hero__date`는 `line-height: 40px` 고정이라 lining 숫자로 바뀌어도 높이가 같다. 375x548 압축 규칙에서도 날짜·사진·이름·장소가 첫 화면에 들어오는지 다시 본다.
- 보케 통계(`window.__bokeh.stats()`): guestbook 위치에서 `running: []` 그대로.

### 결정 뒤 문서 갱신 (이번에는 하지 않음)

- 컨셉 시트 `palette.surface` 주석(32행), `layout_mood`의 면 규칙(204행), 보케 안내(404행)의 "guestbook 밴드" 표현, `typography.scale`에 T4·T6·T7·T12·T13 추가. 사용자가 5장을 정하면 concept-director가 바뀐 부분만 고친다.
- frontend 요약 `05_frontend-developer_summary.md` 2장 섹션 표의 venue·guestbook 배경 칸.

## 5. 사용자 결정 필요

### D1. 방명록 배경

| 선택지 | 내용 |
|---|---|
| **(a) 추천** | 다른 섹션처럼 background로 바꾼다. 입력 필드는 지금처럼 밝은 면 + 테두리 |
| (b) | surface 밴드를 유지하고, 데스크톱에서 컬럼 경계가 사라지는 것만 보완한다(밴드 좌우에 1px line을 긋거나 컬럼 바깥 면 색을 바꾼다) |
| (c) | background로 바꾸고, 폼만 카드(surface, 1px line, 16px) 안에 넣는다 |

추천 이유: 계좌가 surface 카드가 된 뒤로 surface는 "카드 면"으로 읽힌다. 섹션 전체가 그 색이면 아주 큰 카드처럼 보이고, 왜 이 섹션만 다른지 하객이 알 수 없다. 입력 필드가 field_border로 이미 3.37:1 경계를 갖고 있어 면 없이도 폼 영역이 분명하다(`preview-390/account-guestbook.png`). (c)는 R2의 카드 규칙에는 맞지만 박스가 하나 더 생겨, 사용자가 지적한 "한 곳만 박스"를 다른 섹션에서 다시 만든다. (b)는 어긋남의 원인(섹션 하나만 다른 면)을 그대로 둔다.

### D2. 오시는 길의 장소 정보를 담는 방식

| 선택지 | 내용 |
|---|---|
| **(a) 추천** | 카드를 걷어 내고 장소명·주소를 섹션의 답(T4·T6)으로 가운데에 맨 텍스트로 둔다. 주소 복사 버튼은 전체 폭. 지도 카드, 지도 버튼 2개, 교통편 목록은 그대로 |
| (b) | 장소도 교통편 목록의 첫 행으로 넣어 모든 정보를 왼쪽 목록 하나로 만든다. 행 라벨로 "장소"(카피 시트 directions 소제목과 같은 낱말이지만 화면에 새로 보이는 글자)가 필요하다 |
| (c) | 교통편도 카드 안에 넣어 정보 전체를 카드로 맞춘다 |

추천 이유: (a)로 하면 오시는 길이 예식일 섹션과 같은 구조가 된다(제목 → 답 한 줄 → 자세한 정보). 카드는 지도에만 남아 "카드 = 상태가 있거나 바깥 콘텐츠를 담는 틀" 규칙과 맞는다. 미리보기(`preview-390/venue.png`, `preview-360/venue.png`)에서 장소명은 한 줄에 들어가고, 교통편 들여쓰기를 없애자 390에서 주차 안내도 한 줄로 맞았다. (b)는 정렬은 완전히 같아지지만, hero 다음으로 중요한 장소명이 지하철과 같은 무게로 내려가고 화면에 없던 라벨이 생긴다. (c)는 surface 면이 섹션의 절반 넘게 차지하고 카드가 세 개 이어져 "여백과 가는 선" 원칙에서 멀어진다.

### D3. Cormorant 숫자 모양

| 선택지 | 내용 |
|---|---|
| **(a) 추천** | 모든 Cormorant 숫자를 lining(대문자 높이 숫자)으로 맞춘다: hero 날짜, SUNDAY · 3 PM, JANUARY 2027, D-day, 두 카운터 |
| (b) | hero 날짜와 D-day의 큰 숫자는 지금처럼 old-style로 두고, 대문자와 한 줄에 있는 숫자(SUNDAY · 3 PM, JANUARY 2027)와 두 카운터만 lining으로 바꾼다 |

추천 이유: 날짜는 부모님 세대도 한눈에 읽어야 하는 정보다. old-style "01"은 "oI"처럼 보이고, "D - 83"에서는 D와 숫자의 높이가 어긋난다. (b)는 "큰 숫자만 old-style"이라는 규칙이 하나 더 생기고, hero 날짜와 달력 캡션의 숫자 모양이 다시 달라진다. lining으로 바꾸면 hero 첫인상이 조금 더 단정해지니 `preview-390/hero-top.png`, `preview-390/calendar.png`를 지금 화면(`shots-390/00-first-screen.png`, `shots-390/04-calendar.png`)과 비교해 보고 정하면 된다.

### D4. 정보 라벨 색

| 선택지 | 내용 |
|---|---|
| **(a) 추천** | 모든 독립 라벨을 sage_deep 600으로(신랑·신부, 성함·남기실 말씀 2곳만 바뀐다) |
| (b) | 모든 독립 라벨을 muted 600으로(지하철·주차·내비게이션, 신랑측·신부측이 바뀐다) |

추천 이유: 컨셉 시트가 sage_deep을 "작은 아이콘, 보조 라벨 허용" 색으로 정해 두었고, 교통편과 계좌 라벨이 이미 이 색이다. 잎 장식(secondary)과 같은 색 계열이라 장식과 정보가 이어진다. (b)로 하면 라벨과 보조 안내가 같은 muted가 되어 굵기로만 구분된다(`preview-390/couple.png`, `preview-390/account-guestbook.png`).

---

## 사용자 결정 결과 (2026-10-12)

D1~D4 모두 추천안 (a)로 확정되었다. 기록은 `_workspace/00_user-input.md` "디자인 통일" 절에 있다.
