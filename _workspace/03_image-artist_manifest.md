# Image Manifest: 방인혁 · 손유민 ("Warm Paper & Ink")

컨셉 시트 기준으로 사진이 주인공이고 AI 자산은 장식 보조 2종(디바이더, 모노그램)으로 한정한다.

## 생성 방식 요약

| 자산 | 파일 | 생성 방식 |
|------|------|----------|
| divider-hairline | images/divider-hairline.svg | SVG 직접 작성 (gpt-image2 대체) |
| monogram-iy | images/monogram-iy.svg | SVG 직접 작성 (gpt-image2 대체) |
| og-thumbnail | images/og-thumbnail.jpg | 실제 사진 jo--8670 크롭 (Pillow) |
| hero, gallery | images/photos/*.jpg | 실제 사진 원본 참조 (수정 없음) |

**gpt-image2 미사용 사유:** 글로벌 `gpt-image2` 스킬이 이 환경(`~/.claude/skills/`)에 설치되어 있지 않고, `OPENAI_API_KEY` 환경 변수도 없다. 2회 확인 후 작업 지시에 따라 같은 디자인을 SVG로 직접 그렸다. 단색 hairline 장식은 SVG가 해상도 독립·투명 배경·수 KB 크기라 PNG보다 이 컨셉에 적합하다.

## divider-hairline

- file: images/divider-hairline.svg
- method: SVG 직접 작성 (gpt-image2 대체)
- size: viewBox 320x24 (가로형 약 13:1), 벡터
- color: 단색 #9A8670 (primary), 투명 배경
- design: 좌우 hairline 단선 두 개 사이 가운데에 위로 벌어진 작은 잎 한 쌍(외곽선만)과 점 하나. 채색·그라데이션·질감 없음
- alt: "" (장식 이미지, `aria-hidden="true"`)
- usage: 섹션 사이 구분선. 권장 위치는 greeting ↔ couple-intro, gallery ↔ venue, account ↔ rsvp (반복 사용 가능)
- 구현 메모:
  - 권장 표시 폭 160~240px, `height: auto`. `<img src="images/divider-hairline.svg" alt="" aria-hidden="true">` 또는 인라인 SVG 모두 가능
  - 모든 선에 `vector-effect="non-scaling-stroke"`가 있어 확대해도 1px hairline이 유지된다
- prompt (gpt-image2 사용 가능 시 재생성용):
    A piece of visual art for a Korean wedding invitation web page. Minimal hairline section divider, wide horizontal format. A single thin monoline horizontal line with a tiny pair of outlined leaves opening upward at the exact center and a small dot where they meet. Single solid color taupe #9A8670 only, transparent background, no texture, no gradient, no watercolor, no flowers, no text. Classic, minimal, calm.

## monogram-iy

- file: images/monogram-iy.svg
- method: SVG 직접 작성 (gpt-image2 대체)
- size: viewBox 120x120 (1:1), 벡터
- color: 단색 #9A8670, 투명 배경
- design: 두 겹 hairline 원(바깥 1px, 안쪽 0.5px) 안에 "I & Y". I·Y는 Cormorant Garamond 300, "&"는 Cormorant Garamond italic 300(더 작게)
- alt: "인혁과 유민의 이니셜 I & Y 모노그램" (장식으로만 쓰면 alt="" 처리)
- usage: 선택 자산. 권장 위치는 greeting 섹션 상단 또는 footer(share 섹션 아래) 마무리 마크. 권장 표시 크기 72~96px
- 구현 메모 (필수 확인):
  - 글자가 `<text>` 요소라 폰트는 페이지에서 결정된다. **인라인 SVG로 넣어야** 페이지에 로드된 Cormorant Garamond가 적용된다
  - `<img>`로 넣으면 웹폰트가 적용되지 않아 시스템 serif(Times New Roman 등)로 대체 렌더링된다
- prompt (gpt-image2 사용 가능 시 재생성용):
    A piece of visual art for a Korean wedding invitation web page. A minimal circular monogram emblem: the initials "I & Y" in a thin classic serif (Cormorant Garamond style), with the ampersand in a smaller italic, enclosed by a double hairline circle. Single solid color taupe #9A8670 only, transparent background, monoline, no texture, no gradient, no flowers. Classic, minimal, calm.

## og-thumbnail

- file: images/og-thumbnail.jpg
- method: 실제 사진 크롭 (Pillow LANCZOS 리사이즈, JPEG quality 88, progressive)
- source: images/photos/jo--8670.jpg (1067x1600, 원본 수정 없음)
- crop: x 0~1067, y 330~890 (1067x560, 티아라~턱선 포함) → 1200x630 (1.91:1)
- color: 보정·필터 없음
- alt: "방인혁과 손유민이 서로를 바라보며 웃고 있는 웨딩 사진"
- usage: `og:image`, 카카오톡 공유 미리보기 (`og:image:width` 1200, `og:image:height` 630)

## hero (실제 사진, 생성 안 함)

- file: images/photos/jo--8400.jpg
- size: 1067x1600 (세로)
- alt: "화이트 스튜디오에서 신랑이 신부의 베일을 걷어 올리는 웨딩 사진"
- usage: hero 섹션 100svh 풀스크린. `object-fit: cover; object-position: center 70%`. 상단 빈 벽 영역에 영문 이름·날짜 오버레이 (컨셉 시트 layout_mood 참조)

## gallery (실제 사진, 생성 안 함)

- source: images/photos/ (순서·파일명은 컨셉 시트 `photos.gallery_order` 15장을 그대로 따른다)
- alt 텍스트는 컨셉 시트 gallery_order 주석의 장면 설명을 기반으로 frontend-developer가 작성한다 (예: "꽃장식 문 앞에서 마주 선 두 사람")

## 이전 커플 자산 (미사용, 삭제하지 않음)

이번 청첩장에서 참조하지 않는다. 파일은 그대로 둔다.

- images/floral-corner.png: 미사용
- images/floral-divider.png: 미사용
- images/hero-illustration.png: 미사용
- images/gallery-placeholder-1.png ~ images/gallery-placeholder-5.png: 미사용
- images/og-thumbnail.png: 미사용 (이번 og는 images/og-thumbnail.jpg)
- images/gallery/ (빈 디렉터리): 미사용

## 체크리스트

- [x] 사람·인물 생성 없음, 실제 사진 대체 없음
- [x] AI/장식 자산은 컨셉 시트가 정한 2종만 (디바이더 필수, 모노그램 선택)
- [x] 단색 #9A8670, 투명 배경, 수채화·꽃 일러스트·채색 장식 없음
- [x] images/photos/ 원본 수정 없음
- [x] og 썸네일 1200x630, jo--8670 크롭
