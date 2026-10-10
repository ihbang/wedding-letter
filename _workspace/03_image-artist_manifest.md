# Image Manifest — Petal & Glow

- 기준 문서: `_workspace/01_concept-director_concept-sheet.md`의 `palette`, `palette_extended`, `imagery_direction`, `decor_assets`, `photos`
- 생성 방식: gpt-image2를 쓰지 않았다(미설치). 장식 4종은 SVG를 직접 작성했고, og 이미지는 실제 사진 02.jpg를 크롭했다. 그라데이션, 필터, 텍스처, 그림자, SVG 안 글자는 없다.
- 좌표는 스크립트로 계산해 소수 둘째 자리까지 반올림했다. 수정할 때는 SVG 파일을 직접 고친다.

## 요약

| id | 파일 | 크기 | 표시 크기 | 사용 위치 | 넣는 방식 |
|---|---|---|---|---|---|
| sprig-divider | `images/deco/sprig-divider.svg` | viewBox 0 0 160 28 (1,425 B) | 폭 120px, 높이 21px | greeting 하단, gallery 헤더 위, share 상단 (3곳) | 인라인 SVG (stroke-draw 때문) |
| string-lights | `images/deco/string-lights.svg` | viewBox 0 0 240 44 (1,627 B) | 폭 200px, 높이 36.7px | calendar 섹션 헤더 위 (1곳) | 인라인 SVG (전구 깜빡임 때문) |
| wreath | `images/deco/wreath.svg` | viewBox 0 0 140 140 (3,115 B) | 120 x 120px | share 섹션 모노그램 (1곳) | `<img>` 또는 인라인 (정적) |
| favicon | `images/favicon.svg` | viewBox 0 0 32 32 (428 B) | 탭 아이콘 | `<link rel="icon" type="image/svg+xml" href="images/favicon.svg">` | 링크 |
| og-image | `images/og-garden.jpg` | 1200 x 630 px (98,803 B) | 공유 미리보기 | `og:image`, 카카오 공유 `imageUrl` | 메타 태그 |

장식 SVG는 모두 정보가 없는 장식이다. 인라인이면 `aria-hidden="true" focusable="false"`(파일에 이미 들어 있음), `<img>`면 `alt=""`로 넣는다. 세 파일 모두 `id`를 쓰지 않았으므로 같은 SVG를 한 페이지에 여러 번 인라인해도 충돌하지 않는다.

## 색 사용

| 색 | HEX | 쓰인 곳 |
|---|---|---|
| primary | #C9A09F | 꽃 윤곽선(sprig, wreath), 전구 윤곽선 0.8 |
| secondary | #A2AA92 | 줄기, 잎 윤곽선, sprig 줄기 끝 점 채움 |
| glow | #EBCB94 | 꽃 중심 점 채움, 전구 채움, 후광 채움(opacity 0.25) |
| field_border | #958379 | 전선, 전구 매달린 줄 |
| accent | #8E5558 | favicon 윤곽선과 중심 점 |

이 다섯 색 외에는 쓰지 않았다. 채움은 꽃 중심 점, 줄기 끝 점, 전구(후광 포함)에만 있다.

## sprig-divider

- file: `images/deco/sprig-divider.svg`
- size: viewBox `0 0 160 28`, width/height 속성 160 x 28. 표시 폭 120px(배율 0.75)
- alt: `""` (장식)
- usage: 3곳만. ① greeting 하단(greeting과 couple-intro 사이) ② gallery 섹션 헤더 위 ③ share 섹션 상단
- 구성
  - 가운데 다섯 잎 꽃: 중심 (80, 14), 꽃잎 바깥 반지름 5.6(지름 11.2), 꽃잎 사이 홈 반지름 2.5. 꽃잎 하나가 위를 향하고 좌우 대칭. 꽃 윤곽은 끊김 없는 path 1개(`class="flower"`), stroke primary
  - 중심 점: `circle.dot` r 1.6, glow 채움
  - 줄기: 꽃 좌우 가장자리 (74.53, 14) / (85.47, 14)에서 시작해 (15, 12.6) / (145, 12.6)에서 끝나는 완만한 S자 곡선 2개(`class="stem"`), 각 길이 59.9. 좌우 거울 대칭
  - 잎: 줄기마다 아몬드형 잎 3장(`class="leaf"`), 꽃 쪽부터 위 → 아래 → 위로 번갈아 붙고 바깥쪽(줄기 끝 방향)을 향한다. 길이 9 / 8.2 / 6.8로 끝으로 갈수록 작아진다
  - 줄기 끝 점: `circle.dot` r 1.2, secondary 채움 (15, 12.6), (145, 12.6)
- stroke: 1.4(표시 약 1.05px), linecap/linejoin round, 채움 없음
- 애니메이션용 구조
  - path 9개(stem 2, leaf 6, flower 1) 모두 `pathLength="1"`. 각 path는 하위 경로가 하나뿐이라 대시가 path마다 처음부터 그려진다
  - 그려지는 방향: 줄기는 꽃에서 바깥으로, 잎은 붙은 점에서 시작해 한 바퀴, 꽃은 위쪽 꽃잎 왼쪽 홈에서 시작해 시계 방향
  - 점 3개(`circle.dot`)는 path가 아니므로 stroke-draw 대상이 아니다. 선이 다 그려진 뒤 opacity로 나타나게 한다
  - CSS는 `<img>` 안의 SVG에 닿지 않는다. stroke-draw를 하려면 인라인으로 넣어야 한다
  - 참고: `stroke-dasharray: 1; stroke-dashoffset: 1`로 숨기면 round cap 때문에 path 끝에 점이 남는 브라우저가 있다. `stroke-dasharray: 1 2`로 두고 `stroke-dashoffset`을 1 → 0으로 움직이면 이 잔상이 없다
  - reduced-motion: 애니메이션 없이 완성된 상태 그대로 둔다

## string-lights

- file: `images/deco/string-lights.svg`
- size: viewBox `0 0 240 44`, width/height 속성 240 x 44. 표시 폭 200px(배율 0.833), 높이 36.7px
- alt: `""` (장식)
- usage: calendar 섹션 헤더 위 1곳. 인라인 SVG로 넣는다
- 구성
  - 전선: `path.wire` `M4 6 Q120 38 236 6`. 양끝 (4, 6)과 (236, 6), 가운데 (120, 22)까지 처지는 포물선. 길이 234.9. stroke field_border, 1
  - 매달린 줄: `path.drops` 하나에 하위 경로 7개. 전선 위 점에서 아래로 길이 4. stroke field_border, 1
  - 전구 7개: 전선 길이를 8등분한 지점(같은 호 길이 간격)에 매단다. 매다는 점의 x 좌표는 32.54, 61.48, 90.65, 120, 149.35, 178.52, 207.46이고 y 좌표는 12.9, 17.93, 20.98, 22, 20.98, 17.93, 12.9다. 전구 중심은 그 점에서 y +7.2
  - 각 전구는 `<g class="bulb">` 하나: 후광 원 r 7(glow 채움, `opacity="0.25"`) + 전구 원 r 3.2(glow 채움, primary 윤곽선 0.8)
- 애니메이션용 구조
  - `.bulb` 그룹 7개가 문서 순서대로(왼쪽 → 오른쪽) 있다. `:nth-of-type`이나 JS로 지연을 엇갈리게 준다
  - `.bulb`에는 빛(후광 + 전구)만 들어 있다. 매달린 줄과 전선은 그룹 밖에 있으므로 `.bulb` opacity를 0.65 ↔ 1로 움직여도 줄은 흐려지지 않는다
  - 후광의 `opacity="0.25"`는 그룹 opacity와 곱해진다(최소 0.65 x 0.25 = 0.16)
  - reduced-motion: 깜빡임 없이 opacity 1로 둔다

## wreath

- file: `images/deco/wreath.svg`
- size: viewBox `0 0 140 140`, width/height 속성 140 x 140. 표시 120 x 120px(배율 0.857)
- alt: `""` (장식). 모노그램 글자는 HTML이 담당한다
- usage: share 섹션 모노그램 1곳. 가운데에 'I & Y'를 HTML 텍스트로 올린다(Cormorant Garamond italic 26px + Allura '&' 30px, accent)
- 구성
  - 리스 원: 중심 (70, 70), 반지름 54. 아래 가운데(6시)에서 시작해 왼쪽은 10시 (23.23, 43), 오른쪽은 2시 (116.77, 43)에서 끝난다. 위쪽 120°가 비어 있다
  - 줄기: 꽃에서 끊기는 원호 4개(`class="stem"`, 좌우 각 2개). 아래 꽃에서 위쪽 끝으로 자라는 방향으로 그려진다
  - 잎(`class="leaf"`): 한쪽마다 줄기 잎 7장(아래 꽃과 옆 꽃 사이 3장, 옆 꽃 위 4장)이 바깥·안쪽으로 번갈아 붙고 끝(10시, 2시)을 향한다. 줄기 끝에는 줄기 방향을 잇는 끝잎 1장. 한쪽 8장, 합계 16장
  - 꽃 3송이(`class="flower"`, 각각 끊김 없는 path 1개): 아래 가운데 (70, 124) 바깥 반지름 6.8, 좌 8시 (23.23, 97)과 우 4시 (116.77, 97) 바깥 반지름 5.6. 각 꽃은 꽃잎 하나가 리스 바깥을 향한다
  - 꽃 중심 점 3개: `circle.dot` glow 채움, r 1.9(아래) / 1.6(좌우)
- stroke: 1.2(표시 약 1.03px), linecap/linejoin round. 줄기는 꽃 윤곽선 바로 바깥에서 끊어서 선이 꽃잎을 가로지르지 않는다
- 텍스트 영역: 원 중심 = SVG 상자 중심이다. 'I & Y'는 상자 정중앙(표시 기준 60px, 60px)에 맞춘다. 선과 겹치지 않는 안쪽 반지름은 47.5(표시 40.7px)이고, 세로 55~85 구간의 가로 빈 폭은 94(표시 80.6px)다. 글자 블록 폭은 표시 기준 76px 이하로 둔다
- 그림 범위: x 9.3~130.7, y 33.9~131.4. 위쪽 약 34(표시 29px)는 비어 있다
- 애니메이션용 구조: path 23개(stem 4, leaf 16, flower 3) 모두 `pathLength="1"`. 모션 명세에 리스 애니메이션은 없으므로 쓰지 않으면 정적 `<img>`로 넣어도 된다

## favicon

- file: `images/favicon.svg`
- size: viewBox `0 0 32 32`, width/height 속성 32 x 32. 투명 배경
- usage: `<link rel="icon" type="image/svg+xml" href="images/favicon.svg">`
- 구성: sprig-divider와 같은 다섯 잎 꽃(꽃잎 하나가 위, 같은 곡선 비율). 바깥 반지름 13.4, 홈 반지름 5.9. 윤곽선 accent #8E5558, stroke 2, round. 가운데 점 r 2.4 accent 채움(16px 탭에서 꽃으로 읽히게 하는 중심점)
- 중심은 (16, 16.8)이다. 다섯 잎 꽃은 위 꽃잎이 아래 꽃잎보다 멀리 뻗어서 중심을 (16, 16)에 두면 그림이 0.8 위로 쏠린다. 0.8 내려서 선 포함 그림 범위(x 2~30, y 2.4~29.6)를 상자 가운데에 맞췄다
- 16px 탭에서는 선이 1px로 보인다

## og-image

- file: `images/og-garden.jpg`
- size: 1200 x 630 px (1.905:1), 98,803 B
- alt(og:image:alt 제안): "벚꽃 가지 장식 아래 창가 벤치에 나란히 앉아 서로 바라보며 웃는 신랑과 신부"
- usage: `og:image`, 카카오 공유 `imageUrl`. `og:image:width` 1200, `og:image:height` 630
- 소스: `images/photos/02.jpg` (1600 x 1194, sRGB)
- 처리 순서
  1. `jpegtran -crop 1600x840+0+64 -copy none` (x 0~1600, y 64~904. y 64는 16의 배수라 무손실 크롭)
  2. `djpeg -scale 3/4` → 1200 x 630
  3. `cjpeg -quality 85 -optimize` (baseline JPEG)
- 색: 색·밝기 조정, 샤프닝, 리터칭 없음. 메타데이터를 지워 ICC 프로필과 EXIF가 없다. 소스가 sRGB라서 프로필이 없어도 브라우저와 카카오는 sRGB로 해석하므로 색은 같다
- 피사체 확인(결과 이미지를 보고 잰 근사값): 두 얼굴이 세로 약 40~55%, 가로 약 45~59%에 있다. 가운데 1:1 영역(가로 24~76%) 안에 둘 다 들어간다. 위쪽 벚꽃 가랜드와 창틀이 남고 벤치 아래(발, 벤치 다리)는 잘린다
- 새 파일명을 쓰는 이유: 이전 실행의 `images/og-thumbnail.jpg`가 카카오 캐시에 남아 있을 수 있다

## 사진 자산 (`images/photos/`)

모두 sRGB(IEC61966-2.1) JPEG이다. 이번 작업에서 사진은 수정하지 않았다(og 크롭은 별도 파일).

| 파일 | 원본 px | 원본 B | 썸네일 px | 썸네일 B | 쓰임 |
|---|---|---|---|---|---|
| hero.jpg | 1600 x 1066 | 227,152 | 900 x 600 | 90,886 | hero (원본만). 썸네일은 이번 페이지에서 쓰지 않는다 |
| 01.jpg | 1066 x 1600 | 172,297 | 600 x 900 | 68,965 | 갤러리 2 |
| 02.jpg | 1600 x 1194 | 373,734 | 804 x 600 | 115,326 | 갤러리 1 (가로, object-position 70% 50%), og 소스 |
| 03.jpg | 1066 x 1600 | 158,287 | 600 x 900 | 64,134 | 갤러리 4 |
| 04.jpg | 1066 x 1600 | 166,407 | 600 x 900 | 69,450 | 갤러리 14 |
| 05.jpg | 1066 x 1600 | 193,992 | 600 x 900 | 72,067 | 갤러리 9 |
| 06.jpg | 1066 x 1600 | 132,730 | 600 x 900 | 54,974 | 갤러리 11 |
| 07.jpg | 1066 x 1600 | 146,232 | 600 x 900 | 63,367 | 갤러리 7 |
| 08.jpg | 1066 x 1600 | 490,217 | 600 x 900 | 209,590 | 갤러리 3 |
| 09.jpg | 1066 x 1600 | 650,627 | 600 x 900 | 251,259 | 갤러리 5 |
| 10.jpg | 1066 x 1600 | 486,224 | 600 x 900 | 205,823 | 갤러리 13 |
| 11.jpg | 1066 x 1600 | 127,469 | 600 x 900 | 50,976 | 갤러리 10 |
| 12.jpg | 1066 x 1600 | 132,673 | 600 x 900 | 54,161 | 갤러리 6 |
| 13.jpg | 1066 x 1600 | 161,494 | 600 x 900 | 66,757 | 갤러리 8 |
| 14.jpg | 1067 x 1600 | 121,284 | 600 x 899 | 78,373 | 갤러리 12 |
| 15.jpg | 1600 x 1066 | 158,720 | 900 x 600 | 56,488 | 갤러리 15 (가로, object-position 54% 50%) |

- 합계: 원본 16장 3,899,539 B, 썸네일 16장 1,572,596 B. 갤러리 그리드가 내려받는 썸네일 15장(thumb/hero.jpg 제외)은 1,481,710 B
- `<img>`의 width/height 속성은 위 px 값을 그대로 쓴다. 14.jpg와 그 썸네일은 다른 세로 사진보다 1px 다르다(1067 / 899). 셀이 `aspect-ratio: 2/3` + `object-fit: cover`라서 눈에 띄지 않는다
- 썸네일 중 08, 09, 10은 전구·잎 디테일 때문에 200KB를 넘는다(205~251KB)
- 갤러리 alt는 copy-writer가 컨셉 시트 `photos.gallery.order[].desc`를 바탕으로 쓴다

## 사용하지 않는 기존 자산

이번 페이지에서 참조하지 않는다. 삭제하지 않고 그대로 두었다.

| 파일 | 크기 | 출처 |
|---|---|---|
| `images/divider-hairline.svg` | 608 B | 2026-10-09 'Warm Paper & Ink' 실행 |
| `images/monogram-iy.svg` | 647 B | 2026-10-09 'Warm Paper & Ink' 실행 |
| `images/og-thumbnail.jpg` | 70,954 B | 2026-10-09 'Warm Paper & Ink' 실행 |
| `images/floral-corner.png` | 1,446,181 B | 예전 샘플 커플 자산 |
| `images/floral-divider.png` | 1,134,397 B | 예전 샘플 커플 자산 |
| `images/gallery-placeholder-1.png` ~ `-5.png` | 1,698,994 ~ 2,123,080 B (5장 합계 9,577,427 B) | 예전 샘플 커플 자산 |
| `images/hero-illustration.png` | 2,084,360 B | 예전 샘플 커플 자산 |
| `images/og-thumbnail.png` | 2,005,828 B | 예전 샘플 커플 자산 |
| `images/photos/thumb/hero.jpg` | 90,886 B | 현재 사진 세트. hero는 원본만 쓰고 갤러리에 없으므로 참조하지 않는다 |

프론트엔드 참고: 현재 `index.html`과 `script.js`는 `images/divider-hairline.svg`, `images/og-thumbnail.jpg`, 그리고 이 worktree에 더 이상 없는 예전 사진 파일명(`images/photos/jo--*.jpg`, `images/photos/op1789048062-*.jpg`와 그 썸네일)을 참조한다. 새 페이지에서는 위 표의 자산으로 모두 바꿔야 한다.

## 렌더링 확인

각 SVG를 페이지 배경 #FBF6F1 위에 올린 미리보기로 만들어 `qlmanage`(WebKit)로 PNG를 렌더링해 확인했다. 확대본(폭 800px)과 실제 표시 폭의 2배(DPR 2) 두 가지로 봤다. 미리보기 PNG는 저장소에 넣지 않았다.

- sprig-divider: 꽃잎 5장이 고르게 열리고 중심 점이 홈 안에 들어간다. 줄기는 꽃 옆 꽃잎 가장자리에서 시작해 선이 꽃 안으로 들어가지 않는다. 120px 표시에서 덩굴과 작은 꽃으로 읽힌다
- string-lights: 전구 7개가 처진 전선을 따라 같은 간격으로 매달리고 가운데 전구가 가장 낮다. 후광은 배경 위에서 아주 옅다(의도한 값)
- wreath: 첫 렌더링에서 왼쪽 8시 꽃 바로 앞의 안쪽 잎(139°)이 꽃잎과 겹쳤다. 그 잎을 빼고 잎 위치를 103 / 115 / 127°로 당겨 다시 확인했다. 지금은 줄기가 세 꽃의 윤곽선 바로 바깥에서 끊기고 잎과 꽃이 겹치지 않는다
- favicon: 첫 렌더링에서 꽃이 위로 쏠려 보였다(위 여백 1.6, 아래 3.2). 중심을 (16, 16.8)로 내려 위아래 여백을 2.4로 맞추고 다시 확인했다. 104px 미리보기에서 꽃 모양이 또렷하다
- og-garden.jpg: 1200 x 630, 위 피사체 위치를 이미지로 확인했다
