---
concept_name: "Petal & Glow — 꽃잎과 불빛의 정원"   # 기본값: 사용자 선택 '로맨틱 가든'을 사진 기반으로 구체화한 이름
couple:
  groom: "방인혁"
  bride: "손유민"
  groom_en: "Inhyeok"   # 사용자 확인(2026-10-12): 맺음 이름 미리보기에서 "Inhyeok & Yumin"을 골랐다
  bride_en: "Yumin"     # 사용자 확인(2026-10-12)
ceremony:
  date: "2027-01-03 15:00"
  day_of_week: "일요일"     # 검증: 2027-01-03은 일요일
  time_ko: "오후 3시"
  venue: "더컨벤션 송파문정"
  hall: "13층 아모르홀"
  address: "서울 송파구 송파대로 155"   # 사용자 수정(2026-10-10): 'NH송파농협 13층' 삭제. 카카오맵 주소 검색도 이 값을 쓴다 (2026-10-12 디자인 통일 때 지난 결정에 맞춤)
  formality: "1월 실내 컨벤션 웨딩홀 예식. '가든'은 사진과 화면의 분위기이며 야외 예식이 아니다"
parents:
  groom_father: "방주경"
  groom_mother: "주진숙"
  bride_father: "손홍희"
  bride_mother: "김연주"
  groom_birth_order: "아들"   # 사용자 지정: 장남/장녀 등 서열 표기 금지
  bride_birth_order: "딸"     # 사용자 지정
mood_keywords:   # 기본값: '로맨틱 가든' 안에서 사진(꽃 가랜드, 전구 벽, 블러시 꽃)에 맞춰 구체화
  - "로맨틱"
  - "따스한 전구빛"
  - "블러시 플로럴"
palette:   # 기본값: 사진 픽셀 샘플링으로 만든 커스텀 팔레트. 근거와 대비 계산은 본문 참고
  primary: "#C9A09F"     # blush rose: hero 가랜드 꽃 샘플 그대로. 장식 전용(선, 아이콘). bg 대비 2.17이므로 텍스트 금지 (2026-10-12 보케 B안: 보케에는 쓰지 않는다)
  secondary: "#A2AA92"   # light sage: hero 가랜드 잎(#677753)과 background를 6:4로 섞은 색. 장식 전용. bg 대비 2.25이므로 텍스트 금지
  accent: "#8E5558"      # deep rose: primary와 같은 색상을 어둡게 내린 색. 버튼 면, 버튼 윤곽선(원형 버튼 포함), 링크, 강조 숫자, 영문 eyebrow. bg 5.45 / surface 4.93 (2026-10-12 디자인 통일: 원형 버튼 윤곽선 추가)
  background: "#FBF6F1"  # warm ivory: hero 아이보리 벽(#E4D6CD)을 밝힌 페이지 바탕. 모든 섹션의 바탕 (2026-10-12 디자인 통일)
  surface: "#F3EAE3"     # wall ivory: 카드 면(계좌 접기, 카카오맵), 갤러리 사진 매트, 데스크톱 컬럼 바깥. 섹션 면(밴드)으로 쓰지 않는다. hero 벽과 같은 색 계열 (2026-10-12 디자인 통일: guestbook 밴드 폐지)
  text: "#3B2D2A"        # rose-brown black: 본문과 값(주소 포함). bg 12.26 / surface 11.09 (2026-10-12 디자인 통일)
  muted: "#75655E"       # warm taupe gray: 보조 안내, 보조 값, placeholder에만. 라벨과 값에는 쓰지 않는다. bg 5.17 / surface 4.68 (2026-10-12 디자인 통일)
palette_extended:   # 기본값
  glow: "#EBCB94"          # 전구 빛: 08·09·10 전구 영역 샘플(#EAC88E, #ECD19C) 평균. 보케 후광과 전구 장식 전용. 텍스트 금지(bg 1.45) (2026-10-12 보케 B안: 후광 색)
  sage_deep: "#5B6A46"     # 가랜드 잎 샘플 그대로. 정보 라벨(typography.scale.label) 색, 작은 아이콘(bg 5.44 / surface 4.92) (2026-10-12 디자인 통일: 독립 라벨은 모두 이 색, D4)
  on_accent: "#FFFCF8"     # accent 면 위의 글자(5.72). 보케 불빛의 심 색으로도 쓴다. 바탕보다 밝은 색이다 (2026-10-12 보케 B안)
  line: "#E4D6CD"          # hero 벽 샘플 그대로. 1px 구분선, 카드 테두리(장식). 비텍스트 대비 1.32이므로 입력 필드 경계로 쓰지 않는다
  field_border: "#958379"  # 입력 필드 경계. WCAG 1.4.11 비텍스트 3:1 충족(bg 3.37 / surface 3.05)
  lightbox_scrim: "#1C1514"  # 라이트박스 배경, 불투명도 0.96. 사진 뒤에 깔리는 면이며 사진 위에 얹지 않는다
typography:   # 기본값
  korean_serif: "Gowun Batang"          # Google Fonts 400/700. 인사말, 이름, 섹션 제목, 본문
  korean_sans: "Pretendard"             # jsDelivr CDN pretendard@v1.3.9 dynamic-subset, 400/500/600. 주소, 계좌, 버튼, 폼, 작은 정보
  english_serif: "Cormorant Garamond"   # Google Fonts 300/400/500 + 400 italic. 날짜 숫자, 영문 eyebrow, 영문 이름. 숫자는 모두 lining (scale.figures, 2026-10-12 디자인 통일)
  english_script: "Allura"              # Google Fonts 400. 사용처는 hero의 '&', wreath 모노그램의 '&', 마지막 'Thank you' 3곳뿐. 28px 이상, 정보 전달 텍스트에 금지
  scale:   # 텍스트 역할별 모양. 역할마다 한 모양만 쓴다. 해당 선택자 목록은 07 감사 문서 3장 R4 표(T1~T14) (2026-10-12 디자인 통일: 역할 추가·정리)
    hero_date: "Cormorant Garamond 300, 34px (뷰포트 높이 640px 이하에서 28px), letter-spacing 0.06em, text, lining figures"   # (2026-10-12 디자인 통일: lining)
    hero_names: "Gowun Batang 700, 22px, letter-spacing 0.08em, text / '&'는 Allura 34px, accent"
    eyebrow: "Cormorant Garamond 500, 13px, 대문자, letter-spacing 0.28em, accent. 섹션 머리에만, 섹션당 한 번"   # (2026-10-12 디자인 통일)
    section_title: "Gowun Batang 700, 20px, line-height 1.5, text. 예외는 맺음(closing)의 'Thank you'(Allura 48px, accent) 하나"   # (2026-10-12 디자인 통일, 2026-10-12 share/closing 분리)
    names: "Gowun Batang 700, 18px, text (couple의 이름. hero 이름은 hero_names)"   # (2026-10-12 디자인 통일)
    closing_names: "맺음의 영문 이름 'Inhyeok & Yumin'(.closing__names). Cormorant Garamond 400 italic, 22px, line-height 1.4, text. 한글 이탤릭 명조가 없어 영문 이탤릭으로 정했다(사용자 결정)"   # (2026-10-12 share/closing 분리: 새 역할)
    key_line: "핵심 한 줄(섹션의 답: 예식일 섹션의 일시, 오시는 길의 장소명). Gowun Batang 400, 17px, line-height 1.6, text, 가운데. 굵게 하지 않는다"   # (2026-10-12 디자인 통일: 새 역할)
    body: "Gowun Batang 400, 15px, line-height 1.95, 문단 사이 1.95em(빈 줄 하나), 가운데 정렬, text. couple 행과 D-day 문구도 같은 값"   # (2026-10-12 디자인 통일)
    info: "정보 값(주소, 교통 안내). Pretendard 400, 14px, line-height 1.7, text"   # (2026-10-12 디자인 통일: 주소 muted → text)
    account_number: "계좌번호. Pretendard 500, 15px, line-height 1.5, text. 받아 적는 숫자 열이라 한 단계 크게"   # (2026-10-12 디자인 통일)
    label: "정보 라벨(값 앞에 따로 서는 이름표: 신랑·신부, 지하철·주차·내비게이션, 신랑측·신부측, 성함·남기실 말씀). Pretendard 600, 14px, line-height 1.6, sage_deep. 값과 한 줄에 붙은 접두어('예금주')는 라벨이 아니라 그 줄의 색을 따른다"   # (2026-10-12 디자인 통일: D4)
    sub_info: "보조 안내·보조 값(갤러리 안내, 방명록 맺음 안내, 예금주 줄, hero 장소 줄). Pretendard 400, 14px, line-height 1.6(예금주 줄은 1.5), muted"   # (2026-10-12 디자인 통일)
    table_title: "표 제목(달력 위 'JANUARY 2027', 맺음의 '2027.01.03'). Cormorant Garamond 500, 16px / 20px, 대문자, letter-spacing 0.16em, text, lining figures. eyebrow 모양을 섹션 안에서 다시 쓰지 않는다. 섹션 안 소제목이 필요하면 이 모양을 쓴다"   # (2026-10-12 디자인 통일: 새 역할. 2026-10-12 share/closing 분리: 맺음 날짜 추가)
    table_head: "달력 요일. Pretendard 500, 14px, muted, 일요일 accent"   # (2026-10-12 디자인 통일)
    figures: "숫자 모양 두 가지. ① 분위기 숫자(hero 날짜, 'SUNDAY · 3 PM', 'JANUARY 2027', D-day, 갤러리·라이트박스 카운터, 맺음 '2027.01.03')는 Cormorant Garamond, 모두 lining figures(font-variant-numeric: lining-nums). 카운터는 tabular-nums도 넣는다. old-style 숫자는 쓰지 않는다. ② 읽고 받아 적는 데이터 숫자(달력 날짜, 계좌번호, 주소)는 Pretendard"   # (2026-10-12 디자인 통일: D3. 2026-10-12 share/closing 분리: 맺음 날짜 추가)
    button: "Pretendard 500, 14px, line-height 1.2"   # (2026-10-12 디자인 통일)
    input: "Pretendard 400, 16px, line-height 1.5, text, placeholder muted (iOS 확대 방지)"   # (2026-10-12 디자인 통일)
    min_size: "한글 최소 14px. 영문 대문자 eyebrow와 hero 보조 줄만 12~13px 허용"
imagery_direction: |   # 기본값: gpt-image2 미설치 전제
  실제 웨딩 사진이 주인공이다. 장식은 가는 선(라인아트) SVG만 쓴다.
  사진과 경쟁하는 채색 일러스트, 수채화, 인물·풍경 일러스트, 그라데이션 꽃 그림은 만들지 않는다.
  SVG는 image-artist가 직접 작성한다. stroke 1~1.4px(favicon만 2px), stroke-linecap round, 채움은 꽃 중심 점·줄기 끝 점·전구 원에만 쓴다.
  사용 색은 primary(꽃), secondary(잎), glow(전구), field_border(전선), accent(favicon)로 제한한다.
  사진은 보정, 필터, 색 오버레이, 비네팅, 그라데이션 스크림 없이 원본 톤으로 쓴다. 사진 작업은 og 크롭 1건뿐이다.
decor_assets:   # 기본값
  - id: "sprig-divider"
    path: "images/deco/sprig-divider.svg"
    spec: "viewBox 0 0 160 28. 가운데에 지름 약 10의 다섯 잎 꽃(윤곽선, primary)과 중심 점(r 1.6, glow 채움). 꽃 양옆으로 완만한 곡선 줄기가 각 60 정도 뻗고, 줄기마다 아몬드형 잎 3장이 번갈아 붙는다(윤곽선, secondary). 줄기 끝은 r 1.2 점으로 마무리. 모든 path에 pathLength='1'을 넣어 stroke-draw 애니메이션이 가능하게 한다"
    usage: "3곳만: greeting 하단(greeting과 couple-intro 사이), gallery 섹션 헤더 위, 맺음(closing) 섹션 상단. 표시 폭 120px"   # (2026-10-12 share/closing 분리)
  - id: "string-lights"
    path: "images/deco/string-lights.svg"
    spec: "viewBox 0 0 240 44. 양끝(4,6)과 (236,6)을 잇고 가운데가 y≈22까지 처지는 전선 1줄(stroke field_border #958379, 1px). 전선을 따라 같은 간격으로 전구 7개: 길이 4의 짧은 줄 끝에 전구(r 3.2, glow 채움, 0.8px primary 윤곽) + 후광 원(r 7, glow 채움, opacity 0.25). 각 전구 그룹에 class='bulb'를 붙인다"
    usage: "calendar 섹션 헤더 위 1곳. 표시 폭 200px. 깜빡임 애니메이션을 위해 frontend가 HTML 안에 인라인 SVG로 넣는다"
  - id: "wreath"
    path: "images/deco/wreath.svg"
    spec: "viewBox 0 0 140 140. 아래쪽 가운데에서 시작해 좌우로 올라가 10시·2시 방향에서 끝나는 열린 리스(위쪽이 비어 있음). 잎은 윤곽선 secondary, 작은 다섯 잎 꽃 3송이(아래 가운데 1, 좌우 각 1)는 윤곽선 primary. 가운데는 비워 둔다"
    usage: "맺음(closing) 섹션 모노그램 1곳(2026-10-12 share/closing 분리). 표시 폭 120px. 가운데 'I & Y'는 HTML 텍스트로 올린다(Cormorant Garamond italic 26px + Allura '&' 30px, accent). SVG 안에 글자를 넣지 않는다"
  - id: "favicon"
    path: "images/favicon.svg"
    spec: "viewBox 0 0 32 32. sprig-divider와 같은 다섯 잎 꽃 하나. 윤곽선 accent #8E5558, stroke 2px, 투명 배경"
    usage: "<link rel='icon' type='image/svg+xml'>"
  - id: "og-image"
    path: "images/og-garden.jpg"
    spec: "사진 크롭. 아래 photos.og_image 참고"
    usage: "og:image, 카카오 공유 imageUrl"
unused_legacy_assets:   # 이번 페이지에서 참조하지 않는다
  - "images/divider-hairline.svg, images/monogram-iy.svg, images/og-thumbnail.jpg (2026-10-09 'Warm Paper & Ink' 실행 자산)"
  - "images/floral-*.png, images/gallery-placeholder-*.png, images/hero-illustration.png, images/og-thumbnail.png (예전 샘플 커플 자산)"
photos:
  source_dir: "images/photos/"
  thumb_dir: "images/photos/thumb/"
  treatment: "보정, 필터, 색 오버레이, 비네팅, 그라데이션 스크림 금지. 원본 톤 그대로"   # 사용자 지정
  hero:
    file: "hero.jpg"     # 사용자 지정
    size: "1600x1066 (3:2 가로)"
    crop: "없음. 원본 비율 그대로 표시한다(세로 화면 꽉 채우는 cover 크롭 금지)"   # 사용자 지정
    subject: "두 사람은 가로 32~67%, 세로 51~100% 구간(머리 51~70%). 위쪽 0~23%에 전구 줄과 꽃 가랜드, 좌우 벽등"
  og_image:   # 기본값
    source: "02.jpg"
    crop: "x 0–1600, y 64–904 (1600x840, 1.905:1) → 1200x630으로 축소(정확히 3/4), JPEG q85, sRGB, 색 변경 없음"
    output: "images/og-garden.jpg"
    subject_check: "두 얼굴이 크롭 높이 39~60%, 가로 44~62%. 가운데 1:1 영역(가로 24~76%) 안에 두 얼굴이 모두 들어간다"
    tool_hint: "jpegtran -crop 1600x840+0+64 → djpeg -scale 3/4 → cjpeg -quality 85 (y 64는 16의 배수라 무손실 크롭 경계와 맞는다)"
  gallery:   # 방식과 순서 모두 사용자 지정: 한 장씩 넘기는 캐러셀(2026-10-10), 파일 번호 순서(2026-10-12)
    count: 15
    hero_in_gallery: false
    layout: "한 장씩 옆으로 넘기는 캐러셀. 프레임 2:3, 모서리 4px, 프레임 면 surface. 세로 사진은 object-fit cover, 가로 사진(02, 15)은 contain으로 surface 매트 위에 올린다(자르지 않는다). 좌우로 이웃 사진이 16px 보인다. 사진 아래 가운데에 이전·다음 원형 버튼과 'n / 15' 카운터. 자동 넘김·썸네일 목록 없음. 치수와 제스처는 모션 명세 4-1"   # (2026-10-12: 3x5 그리드 명세를 현재 캐러셀로 고침)
    slide_src: "images/photos/{file} (srcset에 images/photos/thumb/{file} 포함)"   # (2026-10-12: grid_src 대체)
    lightbox_src: "images/photos/{file}"
    lightbox: "원본 비율(contain), 좌우 스와이프, 핀치 줌, 'n / 15' 카운터, 배경 lightbox_scrim #1C1514 불투명도 0.96, 사진 위에 텍스트·그라데이션 없음"
    order:   # 파일 번호 순서 01~15 (사용자 지정 2026-10-12). desc는 파일별로 그대로. 행 단위 챕터와 가로 사진 object-position은 캐러셀·파일 번호 순서로 바뀌며 없앴다 (2026-10-12)
      - pos: 1
        file: "01.jpg"
        orientation: "세로"
        desc: "화이트 배경, 신랑이 신부를 안아 올리고 서로 바라보며 웃는 상반신"
      - pos: 2
        file: "02.jpg"
        orientation: "가로 1600x1194"
        desc: "벚꽃 가지 장식 아래 창가 벤치에 나란히 앉아 마주 보는 두 사람"
      - pos: 3
        file: "03.jpg"
        orientation: "세로"
        desc: "화이트 셔츠와 블랙 드레스, 'Will you marry me?'와 'yes! yes! yes!' 하트 풍선 피켓"
      - pos: 4
        file: "04.jpg"
        orientation: "세로"
        desc: "'We're getting married' 케이크를 든 신랑과 비눗방울을 부는 신부"
      - pos: 5
        file: "05.jpg"
        orientation: "세로"
        desc: "블랙 배경과 비눗방울, 하트 풍선을 들고 크게 웃는 두 사람"
      - pos: 6
        file: "06.jpg"
        orientation: "세로"
        desc: "신랑이 신부의 베일을 걷어 올리는 전신"
      - pos: 7
        file: "07.jpg"
        orientation: "세로"
        desc: "화이트 배경, 컬러 컨페티가 날리는 가운데 손잡고 웃는 전신, 신부는 꽃다발"
      - pos: 8
        file: "08.jpg"
        orientation: "세로"
        desc: "녹색 잎과 전구 벽 앞에서 손을 맞잡고 마주 선 두 사람, 신부는 베일"
      - pos: 9
        file: "09.jpg"
        orientation: "세로"
        desc: "흰 꽃과 전구 벽 앞 잔디에서 신랑이 무릎 꿇고 꽃을 건네는 장면"
      - pos: 10
        file: "10.jpg"
        orientation: "세로"
        desc: "흰 꽃과 전구 벽 앞, 꽃다발을 들고 볼을 맞대고 웃는 두 사람"
      - pos: 11
        file: "11.jpg"
        orientation: "세로"
        desc: "블랙 드레스에 재킷을 걸치고 꽃다발을 든 신부 단독 전신"
      - pos: 12
        file: "12.jpg"
        orientation: "세로"
        desc: "블랙 수트와 블랙 드레스, 반지 낀 손을 펼쳐 보이며 웃는 두 사람"
      - pos: 13
        file: "13.jpg"
        orientation: "세로"
        desc: "블랙 수트와 블랙 드레스, 나란히 앉아 볼을 맞대고 웃는 두 사람"
      - pos: 14
        file: "14.jpg"
        orientation: "세로"
        desc: "화이트 서랍장과 꽃 앞에서 신랑이 신부에게 반지를 끼워 주는 장면"
      - pos: 15
        file: "15.jpg"
        orientation: "가로 1600x1066"
        desc: "커튼 창가 역광 속에서 입맞추는 두 사람"
audio:
  bgm: "audio/bgm.mp3"   # 사용자 지정: 기존 파일 재사용(MP3 192kbps, 약 2분 50초). 자동재생 금지, 탭으로 재생
hero_layout: |   # 기본값 (사진 고정·크롭 금지는 사용자 지정)
  세로 스택 3단: [위 텍스트] → [가로 사진 풀블리드] → [아래 텍스트]. 사진 위에는 글자를 올리지 않는다.
  섹션: min-height 100svh, background #FBF6F1, flex column, 가로 가운데 정렬, 남는 높이는 위아래 균등 분배(justify-content center).
  위 텍스트: padding-top max(48px, safe-area-inset-top + 40px). eyebrow(13px) → 10px → 날짜 숫자 "2027 · 01 · 03"(34px) → 6px → "SUNDAY · 3 PM"(12px, muted).
  사진: margin 28px 0. 컬럼 폭 100%(모바일 390px이면 390x260, 데스크톱 컬럼 480px이면 480x320). 좌우 거터·모서리 둥글림·테두리 없음.
        <img width="1600" height="1066">에 width 100%, height auto. object-fit cover·scale 확대 금지(원본 구도 전체 노출).
  아래 텍스트: "방인혁 & 손유민"(22px, '&'만 Allura 34px accent, 좌우 10px) → 12px → "2027년 1월 3일 일요일 오후 3시"(Gowun Batang 15px, text)
        → "더컨벤션 송파문정 13층 아모르홀"(Pretendard 14px, muted) → 20px → 스크롤 큐(1px x 28px 세로선, primary).
  세로 예산(390x664, iPhone 14 Safari 가시 영역): 48+16+10+40+6+16+28+260+28+36+12+24+22+20+30 = 596px ≤ 664 → 첫 화면에 날짜·사진·이름·장소 모두 보임.
  압축 규칙(@media (max-height: 640px)): padding-top 28, 사진 위아래 18, 날짜 숫자 28px, 아래 블록 간격 8, 스크롤 큐 숨김.
        375x548(iPhone SE Safari 가시 영역)에서 28+16+8+34+4+16+18+250+18+34+8+22+20 = 476px ≤ 548.
  BGM 토글: position fixed, top 16, right 16, 40x40 원형, 윤곽선 1px accent(2026-10-12 디자인 통일). 날짜 줄(가운데 약 220px 폭)과 겹치지 않는다.
  데스크톱(≥481px): 컬럼 max-width 480px 가운데 정렬, 컬럼 바깥은 surface #F3EAE3.
layout_mood: |   # 기본값. 면·그릇·정렬·모서리·버튼·여백 규칙은 2026-10-12 디자인 통일(사용자 결정 D1~D4 모두 (a)). 근거와 관계별 수치는 _workspace/07_concept-director_design-audit.md 3장 R1~R9
  모바일 우선 단일 컬럼(max 480px), 가운데 정렬, 본문 좌우 거터 24px(갤러리 16px, hero 사진 0).
  섹션 상하 패딩 80px. 예외는 hero, greeting·couple 묶음(greeting 아래 0, couple 위 56, 사이에 sprig), closing 아래 safe-area 세 곳뿐이다(2026-10-12 디자인 통일, 2026-10-12 share/closing 분리).
  섹션 헤더는 영문 eyebrow(accent) + 한글 제목(text) 2단. 맺음(closing)만 섹션 헤더 없이 Allura 'Thank you'가 제목을 맡는다(2026-10-12).
  면(2026-10-12 디자인 통일, D1): 두 단계뿐이다. 모든 섹션의 바탕은 background다. surface는 카드(account 계좌 접기, venue 카카오맵), 갤러리 사진 매트, 데스크톱 컬럼 바깥에만 쓰고 섹션 면(밴드)으로 쓰지 않는다. 섹션은 여백과 장식 SVG로만 나눈다.
  hero, calendar, closing은 background 위에 두고 보케 배경이 보이는 구간으로 쓴다. 보케는 카드·사진 매트 같은 surface 면 위에 두지 않는다(2026-10-12 share/closing 분리, 보케 B안).
  그릇(2026-10-12 디자인 통일, D2): 정보를 담는 방식은 내용으로 정한다.
    - 문장(인사·안내·맺음)과 섹션의 답(예식일 일시, 오시는 길 장소명·주소)은 맨 텍스트로 가운데에 둔다.
    - 라벨 + 값 여러 행은 구분선 목록(교통편), 표는 가는 선 표(달력), 사진은 사진 프레임, 입력은 필드.
    - 카드는 눌러서 상태가 바뀌거나(계좌 접기) 바깥 콘텐츠를 담는 틀(카카오맵)에만 쓴다. 강조하려고 카드에 넣지 않는다. 강조는 글자 크기와 위치로 한다.
    - 오시는 길 순서: 장소명(key_line) → 주소(info) → 주소 복사(전체 폭) → 24 → 카카오맵 고정 지도 카드(4:3, 실패하면 숨김) → 네이버 지도·카카오맵 버튼(2분할) → 교통편 목록.
  정렬(2026-10-12 디자인 통일): 가운데는 섹션 머리, 문장, 섹션의 답, 버튼 묶음. 왼쪽은 라벨-값 목록, 폼, 카드 안의 라벨-값.
    왼쪽 정렬 글자의 시작점은 두 가지뿐이다: 목록·폼은 컬럼 가장자리(들여쓰기 0), 카드 안은 카드 안쪽 20px.
  모서리 다섯 단계(2026-10-12 디자인 통일): 16(카드, 입력 필드) / 999(pill 버튼) / 50%(원형 버튼) / 4(사진 프레임) / 0(hero 사진). 계좌 summary의 15는 카드 안쪽 맞춤이다. 그림자 없음, 경계는 1px line #E4D6CD.
  버튼(2026-10-12 디자인 통일): 높이 44px 이상, Pretendard 500 14px, 모서리 999.
    - 주 버튼 = accent 면 + on_accent 글자(5.72). 그 섹션의 마지막 행동 하나에만 쓴다(남기기, 카카오톡으로 공유하기).
    - 보조 버튼 = 투명 면 + 1px accent 테두리 + accent 글자(bg 5.45 / surface 4.93). 그 밖의 모든 행동.
    - 폭: 단독 버튼은 담긴 영역의 전체 폭(컬럼 또는 카드 안쪽). 대등한 두 선택지는 2분할(지도 버튼). 내용 폭 버튼은 쓰지 않는다.
    - 원형 아이콘 버튼(갤러리 이전·다음, BGM 토글)도 윤곽선은 1px accent다. primary 윤곽선은 쓰지 않는다. 비활성은 opacity 0.3.
  여백 단계(2026-10-12 디자인 통일): 8, 12, 16, 20, 24, 32, 40, 56, 80만 쓴다.
    섹션 머리 → 콘텐츠 40, 섹션 안 블록 → 블록 32, 장식 → 섹션 머리 24, 섹션 사이 구분 장식(greeting sprig) 56, 제목 → 제목 밑 문장 20,
    이어진 요소(값 → 버튼, 지도 → 지도 버튼, 필드 → 필드, 목록 행 안쪽 위아래) 16, 형제 카드 사이·사진 → 버튼 줄 12, 라벨 → 필드·나란한 버튼 사이 8.
    eyebrow → 제목 10만 예외다. hero 내부 간격은 hero_layout을 따른다.
  입력 필드: 면 #FFFDFB, 1px field_border #958379, 모서리 16(2026-10-12 디자인 통일), placeholder muted. 포커스 링 2px accent, offset 2px.
  캘린더: 2027년 1월, 일요일 열 머리글 accent, 3일은 지름 36px accent 원 + on_accent 숫자. 달력 위 'JANUARY 2027'은 eyebrow가 아니라 표 제목(typography.scale.table_title)이다(2026-10-12 디자인 통일).
motion_direction: |   # 기본값 (보케 사용 자체는 사용자 선택 설명에서 옴). 보케 모양·색·움직임·대비 방식은 사용자 결정 B '작은 전구 불빛'(2026-10-12, 00_user-input.md '보케를 작은 전구 불빛으로')이며, 이전 지시(불투명도 상한, 흰색 보케 금지, 색 비율)보다 우선한다
  무드: '겨울 오후에 켜진 정원의 전구'. 사진 속 전구 벽(08·09·10)처럼 작은 전구 불빛이 화면 가장자리 곳곳에서 거의 제자리에 머물며 천천히 반짝인다. 눈에 띄는 움직임이 아니라 공기의 결이어야 한다. (2026-10-12 B안: '숨 쉬듯 밝아졌다 어두워지는 따뜻한 빛망울'에서 바꿈)
  모션 카탈로그 매핑: 첫 키워드 '로맨틱'의 기본값(romantic-lush, 꽃잎 파티클 24~40개)을 쓰지 않는다. 카탈로그 C(별빛/반딧불이)를 작은 전구 불빛으로 바꿔 쓰고 density는 minimal로 한다. (2026-10-12: '크고 흐린 보케'에서 바꿈)
  보케 기준(2026-10-12 B안. 세부 수치, 회피 영역, 참고 코드는 모션 명세 1장):
    - 동시 표시 입자: 모바일 12개 이하, 768px 이상 16개 이하. 한 구간(섹션) 안에서는 8개 이하
    - 모양(2026-10-12): 지름 5~9px의 심을 #FFFCF8(바탕보다 밝은 색)로 채우고, 그 둘레에 glow 후광을 심 반지름의 3.6배까지 둘러 가장자리에서 0으로 끝낸다. 별 모양 스파클 금지.
      지름 12~56px의 크고 흐린 원은 쓰지 않는다. 바탕보다 어두운 glow(L* 83, 바탕 L* 97)를 넓게 칠하면 바탕보다 어두운 얼룩이 된다
    - 색(2026-10-12): 심 #FFFCF8, 후광 glow #EBCB94 100%. primary·녹색·accent 불빛 금지. 이전의 '흰색 보케 금지'와 'glow 70% / primary 30%'는 없앴다
    - 불투명도(2026-10-12): 불투명도 상한(glow 0.28 / primary 0.18)을 없앴다. 심은 불투명, 후광 알파는 심 바로 밖 0.9 → 0.5 → 0.2 → 0
    - 글자 대비(2026-10-12): 불투명도 상한 대신 글자 영역 회피로 지킨다. 불빛은 후광 끝까지 글자 줄 상자, hero 사진·장식 SVG 상자, BGM 버튼 자리와 겹치지 않는 곳에만 생긴다.
      reveal이 끝난 뒤 피할 영역을 다시 잰다. 근거는 본문 '보케와 텍스트 대비', 회피 대상과 여백 수치는 모션 명세 1장
    - 움직임(2026-10-12): 거의 제자리. 상승 0~3px/s, 좌우 흔들림 2~5px, 밝기 반짝임 1 ↔ 0.5(주기 2.4~4.8초, 1초에 1회 넘는 깜빡임 금지), 수명 9~16초, 나타나고 사라질 때 1.2초 페이드
    - 구간: hero, calendar, closing 세 섹션의 background 영역에서만 보인다(2026-10-12 share/closing 분리). 그 밖의 구간으로 스크롤하면 600ms에 걸쳐 0으로 사라진다
    - 레이어: 사진·카드·텍스트 뒤. hero 사진 위에 겹쳐 보이면 안 된다(사진 위아래 여백에만 보임)
    - 정지 조건: 라이트박스 열림, 탭 비활성, 구간이 화면 밖. 캔버스 DPR 상한 2
  그 밖의 모션: 섹션 진입 fade-in + translateY(12px→0) 800ms ease-out 하나로 통일. hero는 위 텍스트 → 사진 → 아래 텍스트 순 fade-in(사진은 900ms, scale 금지).
    sprig-divider는 진입 시 stroke-draw 1회(2.4s) 후 정지. string-lights의 전구 7개는 opacity 0.65↔1을 4~6초 주기로 서로 엇갈리게.
    BGM 토글 재생 중에는 버튼 둘레에 glow 링이 3초 주기로 은은하게 숨 쉰다.
  금지: 꽃잎·컨페티·하트 파티클, 패럴랙스, hero 사진 Ken Burns·확대, 터치 반응 파티클, 사진 위 오버레이 효과.
  prefers-reduced-motion: reduce → 보케는 hero 위아래 여백에 정지한 작은 불빛 7개만(같은 모양, 글자 영역 회피. 2026-10-12 B안: 흐린 점 5개에서 바꿈). 디바이더는 완성된 상태, 전구 깜빡임 없음, 섹션은 즉시 표시.
sections_order:   # rsvp 제외, guestbook 유지, notice 신설(venue와 account 사이, 2026-10-10), share/closing 분리(guestbook → share → closing, 2026-10-12)는 사용자 지정. 나머지 순서는 기본값 (2026-10-12 디자인 통일 때 notice를 지난 결정에 맞춰 넣음)
  - hero
  - greeting
  - couple-intro
  - calendar
  - gallery
  - venue
  - notice
  - account
  - guestbook
  - share     # 공유하기: eyebrow SHARE, 제목, 문구, 버튼 2개. 보케 없음 (2026-10-12)
  - closing   # 맺음, 마지막 섹션: 장식, 모노그램, Allura Thank you, 날짜, Inhyeok & Yumin. 보케 구간 (2026-10-12)
defaults_applied:
  - "컨셉 이름 'Petal & Glow — 꽃잎과 불빛의 정원'과 mood_keywords 3개(로맨틱 가든 안에서 구체화)"
  - "팔레트: 사진 픽셀 샘플링 기반 커스텀 7색 + 확장 토큰 6개"
  - "폰트: Gowun Batang + Pretendard + Cormorant Garamond + Allura(3곳 한정)"
  - "hero 레이아웃: 위 텍스트 / 가로 사진 풀블리드 / 아래 텍스트 3단 스택"
  # (2026-10-12) '갤러리 15장 순서와 3열 2:3 그리드' 항목 삭제: 갤러리 방식(캐러셀)과 순서(파일 번호순)가 모두 사용자 지정으로 바뀌어 기본값이 아니다
  - "장식 자산 4종(SVG)과 og 썸네일 소스 02.jpg 크롭"
  - "보케 동시 입자 수 상한"   # (2026-10-12) 모양·색·불투명도·움직임·대비 방식은 사용자가 고른 B '작은 전구 불빛'으로 바뀌어 기본값에서 뺐다
  - "섹션 순서 중 rsvp 제외·guestbook 유지 외 나머지 순서"
---

# 컨셉 디렉션 노트: "Petal & Glow — 꽃잎과 불빛의 정원"

## 톤앤매너

1월 첫 일요일 오후, 실내 컨벤션홀에서 올리는 격식 있는 예식이다. 사용자가 고른 **로맨틱 가든**은 장소가 아니라 사진의 분위기를 가리킨다. 아이보리 벽에 걸린 블러시 꽃 가랜드, 잎 사이로 켜진 전구 줄이 이 청첩장의 두 축이다. 겨울 한가운데 실내로 들어왔을 때 느끼는 온기를 화면의 첫인상으로 삼는다. 꽃은 선으로만 그리고 빛은 작은 전구 불빛으로만 반짝이게 해서(2026-10-12 보케 B안), 화려함보다 다정함이 먼저 읽히게 한다. 격식은 정중한 문장과 넉넉한 여백으로 지킨다.

## 팔레트 근거 (사진 픽셀 샘플링)

`images/photos/thumb/`를 디코딩해 영역 평균과 색상 필터 평균을 낸 값이다.

| 샘플 영역 | 측정값 | 반영한 토큰 |
|---|---|---|
| hero 좌우 벽 | #DFD1C8 / #E4D6CD | line #E4D6CD, surface #F3EAE3, background #FBF6F1 |
| hero 가랜드 꽃(분홍 필터) | #C9A09F | primary #C9A09F |
| hero 바닥 꽃 / 02 벚꽃 | #CFA8A6 / #DCBAB2 | primary 계열 확인 |
| hero 가랜드 잎(녹색 필터) | #5B6A46 / #677753 | sage_deep #5B6A46, secondary #A2AA92(잎 60% + 바탕 40%) |
| 08·09·10 전구 빛(따뜻한 고명도 필터) | #EAC88E / #ECD19C / #E6CDA5 | glow #EBCB94 |
| hero 벽등 | #BC9979 | 사용 안 함(accent와 충돌) |

accent #8E5558은 primary와 같은 장밋빛 색상을 명도만 내린 색이다. 그래서 버튼과 강조 숫자가 꽃 장식과 같은 색 가족으로 읽힌다.

## WCAG 대비 (계산값)

| 전경 | 배경 | 대비 | 용도 판정 |
|---|---|---|---|
| text #3B2D2A | background #FBF6F1 | 12.26 | 본문 AA/AAA |
| text #3B2D2A | surface #F3EAE3 | 11.09 | 본문 AA/AAA |
| muted #75655E | background | 5.17 | 보조 텍스트 AA |
| muted #75655E | surface | 4.68 | 보조 텍스트 AA |
| accent #8E5558 | background | 5.45 | 링크·강조·보조 버튼 글자 AA |
| accent #8E5558 | surface | 4.93 | 카드 안 링크·보조 버튼 AA |
| on_accent #FFFCF8 | accent #8E5558 | 5.72 | 주 버튼 글자 AA |
| sage_deep #5B6A46 | background / surface | 5.44 / 4.92 | 정보 라벨 AA (2026-10-12 디자인 통일: 독립 라벨 전부) |
| field_border #958379 | background / surface | 3.37 / 3.05 | 입력 경계 비텍스트 3:1 |
| primary #C9A09F | background | 2.17 | 장식 전용 (텍스트·버튼 윤곽선 금지, 2026-10-12 디자인 통일) |
| secondary #A2AA92 | background | 2.25 | 장식 전용 (텍스트 금지) |
| glow #EBCB94 | background | 1.45 | 장식 전용 (텍스트 금지) |
| line #E4D6CD | background | 1.32 | 장식 구분선 전용 (입력 경계 금지) |

### 보케와 텍스트 대비 (2026-10-12 보케 B안으로 고침)

B안의 불빛은 심(#FFFCF8)이 바탕보다 밝고, 심 바로 밖 후광이 glow 0.9로 진하다. 글자가 후광 위에 오면 대비가 기준 아래로 떨어진다. 아래는 glow를 background에 해당 알파로 섞은 뒤 다시 잰 값이다.

| 불빛 자리 | 섞인 바탕 | text | muted | accent | sage_deep |
|---|---|---|---|---|---|
| 심 | #FFFCF8 | 12.87 | 5.43 | 5.72 | 5.71 |
| 후광 0.9 (심 바로 밖) | #EDCF9D | 8.79 | 3.71 (미달) | 3.90 (미달) | 3.90 (미달) |
| 후광 0.5 | #F3E0C2 | 10.19 | 4.30 (미달) | 4.53 | 4.52 |
| 후광 0.2 | #F8EDDE | 11.39 | 4.80 | 5.06 | 5.05 |

후광 알파를 낮춰 대비를 맞추면 불빛이 다시 흐린 얼룩이 된다(이전 보케가 "디스플레이가 눌린 자국"처럼 보인 원인 중 하나가 낮은 불투명도 상한이었다). 그래서 불투명도 상한 대신 **글자 영역 회피**로 대비를 지킨다. 불빛은 후광 끝까지 글자 줄 상자와 겹치지 않는 자리에만 생기므로, 글자 뒤 바탕은 언제나 background이고 대비는 'WCAG 대비' 표의 background 값(muted 5.17, accent 5.45) 그대로다. 회피 대상(`data-bokeh-exclude="text"`, 값 없는 `data-bokeh-exclude`, BGM 버튼 자리), 여백, 재측정 시점은 모션 명세 1장이 기준이다.

보케는 background 위 세 구간(hero, calendar, closing)에서만 쓰고, surface 위에는 보케를 두지 않는다.

## 히어로 구성

`hero.jpg`는 3:2 가로 사진이다. 두 사람은 아래 가운데에 작게 서 있고, 위쪽에 꽃 가랜드와 전구 줄이 있다. 세로로 꽉 채우면 가랜드나 벽등이 잘리므로 사진은 원본 비율 그대로 화면 폭에 맞춘다. 대신 위아래 여백에 글자를 둔다. 액자에 걸린 사진 한 장을 보는 구도다.

```
390 x 664 (iPhone 14 Safari 가시 영역)
┌──────────────────────────────┐
│                         (♪)  │ BGM 토글 40x40, top 16 / right 16
│                              │ padding-top 48
│     WE'RE GETTING MARRIED    │ eyebrow 13px accent, tracking .28em
│        2027 · 01 · 03        │ Cormorant 300 34px text
│        SUNDAY · 3 PM         │ 12px muted
│                              │ 28px  ← 보케가 보이는 여백
├──────────────────────────────┤
│                              │
│   hero.jpg  390 x 260 (3:2)  │ 풀블리드, 크롭·오버레이·확대 없음
│                              │
├──────────────────────────────┤
│                              │ 28px  ← 보케가 보이는 여백
│       방인혁  &  손유민        │ Gowun Batang 700 22px / Allura & 34px accent
│ 2027년 1월 3일 일요일 오후 3시  │ Gowun Batang 15px text
│ 더컨벤션 송파문정 13층 아모르홀  │ Pretendard 14px muted
│              │               │ 스크롤 큐 1x28 primary
└──────────────────────────────┘
합계 596px (여유 68px은 위아래 균등 분배)
```

- 영문 날짜(위)와 한글 날짜(아래)를 둘 다 둔다. 위는 분위기, 아래는 부모님 세대가 읽기 쉬운 정보다.
- 압축 규칙을 적용하면 iPhone SE(375x548)에서도 476px로 첫 화면 안에 들어간다.
- hero 섹션 바탕은 background다. 사진 속 벽(#E4D6CD)이 바탕보다 한 톤 짙어서, 사진이 벽에 걸린 패널처럼 보인다.

## 갤러리 (2026-10-12: 캐러셀과 파일 번호 순서로 고침)

### 형태: 한 장씩 넘기는 캐러셀, 프레임 2:3

사용자 결정(2026-10-10)으로 3x5 썸네일 그리드를 캐러셀로 바꿨다. 치수, 제스처, 접근성은 모션 명세 4-1이 기준이다.

- 프레임은 2:3이다. 15장 중 13장이 세로 2:3이라 대부분 잘림이나 여백 없이 프레임을 채우고, 전신 컷(06, 07, 09, 11)의 발끝과 머리 위 장식도 남는다.
- 세로 사진은 `object-fit: cover`, 가로 2장(02, 15)은 `contain`으로 surface 매트 위에 올린다. 자르지 않으므로 object-position은 쓰지 않는다. hero와 같은 "액자 속 사진 한 장" 구도다.
- 좌우로 이웃 사진이 16px 보여서 옆으로 넘길 수 있다는 것을 글 없이 알린다. 이웃 사진도 원래 톤 그대로 둔다(흐리게, 작게, 투명하게 하지 않는다).
- 이전·다음 원형 버튼과 "n / 15" 카운터는 사진 아래 가운데에 둔다. 사진 위에는 버튼과 글자를 얹지 않는다. 자동 넘김과 썸네일 목록은 없다.
- 사진을 누르면 같은 번호로 라이트박스가 열린다(원본 비율, 핀치 줌).

### 순서: 파일 번호순 01 → 15

사용자 지정(2026-10-12, "사진첩의 이미지 순서를 내가 파일명으로 매겨둔 번호와 일치시켜줘"). 사진별 설명은 frontmatter `photos.gallery.order`에 있다. 가로 사진은 2번(02)과 15번(15)이다.

이전에 두었던 행 단위 챕터 배치와 인접 검사(배경이나 의상이 같은 사진끼리 맞닿지 않게 하는 기준)는 이 결정으로 없앴다. 파일 번호순에서는 꽃·전구 벽 사진 08, 09, 10이 이어지지만 사용자가 고른 순서이므로 그대로 둔다.

## 공유하기와 맺음 (2026-10-12 share/closing 분리)

사용자 결정(`00_user-input.md` "공유하기와 맺음 섹션 분리")으로 마지막 share 섹션을 둘로 나눴다. 순서는 guestbook → 공유하기 → 맺음이다.

| 섹션 | 구성 | 보케 |
|---|---|---|
| 공유하기 `#share` | 다른 섹션과 같은 머리(eyebrow "SHARE", 제목 "공유하기") → 문구 2행(body) → 카카오톡으로 공유하기(주 버튼), 링크 복사하기(보조 버튼). 버튼은 전체 폭으로 세로로 쌓는다 | 없음. 장식도 없다 |
| 맺음 `#closing`, 마지막 섹션 | sprig-divider → wreath 모노그램 "I & Y" → Allura "Thank you"(제목) → "2027.01.03"(table_title) → "Inhyeok & Yumin"(closing_names, Cormorant Garamond 이탤릭) | 있다. 보케 구간 hero, calendar, closing 중 마지막 |

- 맺음에는 eyebrow와 한글 제목이 없다. Allura "Thank you"가 제목 자리를 맡는 유일한 예외다(`typography.scale.section_title`).
- 이름 표기: 사용자는 처음에 한글 "인혁 & 유민"을 이탤릭으로 원했다. 이탤릭이 있는 한글 명조가 없어서(Google Fonts 한글 38종 모두 이탤릭 없음) 영문 "Inhyeok & Yumin"을 Cormorant Garamond 이탤릭으로 쓴다(사용자 결정).
- 이전 맺음말 "끝까지 봐 주셔서 감사합니다. / 그날, 반갑게 뵙겠습니다."는 뺐다.
- 아래 safe-area 여백은 맺음이 가진다(`layout_mood`).

## 카피라이터에게

- 중심 키워드는 **로맨틱**. 다정하고 따뜻하되 혼주가 함께 보내는 청첩장이므로 정중한 경어체를 유지한다. 과장된 수식어는 피한다.
- 은유는 '꽃'과 '빛(온기)' 중 하나를 골라 인사말 안에서 한 번만 쓴다. 1월 예식이므로 "겨울 한가운데의 따뜻한 빛" 같은 대비가 컨셉과 잘 맞는다. 계절 클리셰를 나열하지 않는다.
- **'가든 웨딩', '정원에서', '야외' 같은 표현은 쓰지 않는다.** 실내 컨벤션 예식이라 하객이 장소를 오해할 수 있다. 벚꽃·봄도 쓰지 않는다(02의 꽃은 촬영 소품이다).
- hero eyebrow 제안: "WE'RE GETTING MARRIED". 04 케이크의 문구와 호응한다. 섹션 eyebrow는 영문 대문자 한두 단어로 한다(예: INVITATION, THE DAY, GALLERY, LOCATION, GUESTBOOK, SHARE). 맺음에는 eyebrow를 두지 않는다(2026-10-12 share/closing 분리). 최종 문구는 카피라이터가 정한다.
- 혼주 표기: "방주경 · 주진숙의 아들 인혁", "손홍희 · 김연주의 딸 유민". **장남/장녀 등 서열 표기 금지.**
- 일시: "2027년 1월 3일 일요일 오후 3시". 영문: "2027 · 01 · 03" + "SUNDAY · 3 PM".
- 장소: "더컨벤션 송파문정 13층 아모르홀", 주소 "서울 송파구 송파대로 155"(사용자 수정 2026-10-10. 2026-10-12 디자인 통일 때 지난 결정에 맞춤).
- 교통편(지하철·주차), 계좌번호, 방명록 접수 주소는 사용자가 나중에 제공했다(2026-10-11). 값은 `_workspace/00_user-input.md`와 카피 시트에 있다. 버스 안내는 넣지 않는다.
- 마지막 맺음(closing) 섹션의 'Thank you'는 Allura로 쓰이므로 영문 두 단어 그대로 둔다(2026-10-12 share/closing 분리).
- 갤러리 alt는 `photos.gallery.order[].desc`를 바탕으로 쓰되 파일명은 넣지 않는다(2026-10-12: 챕터를 없애며 챕터 이름 언급 삭제).

## 이미지 아티스트에게

- gpt-image2를 쓸 수 없다. 장식 4종(sprig-divider, string-lights, wreath, favicon)은 frontmatter `decor_assets`의 viewBox·좌표·색 지시대로 SVG를 직접 작성한다.
- 선 굵기 1~1.4px(favicon만 2px), 채움은 꽃 중심 점과 전구에만 쓴다. 그라데이션, 필터, 텍스처, 그림자는 넣지 않는다. 색은 HEX를 그대로 쓴다.
- SVG 안에 글자를 넣지 않는다. 모노그램 글자는 HTML이 담당한다.
- 사진 작업은 og 크롭 1건뿐이다(02.jpg → `images/og-garden.jpg`, 크롭 영역은 frontmatter). 색·밝기 조정, 샤프닝, 리터칭은 하지 않는다.
- og 파일 이름을 새로 정한 이유: 이전 실행의 `images/og-thumbnail.jpg`가 이미 카카오톡에 공유됐다면 같은 URL은 예전 이미지가 캐시로 남을 수 있다.
- og 소스로 hero 대신 02를 고른 이유: hero를 가랜드가 남도록 1.9:1로 자르면(y 96–936) 두 얼굴이 크롭 높이의 53~77%로 아래에 치우치고 인물이 작다. 02는 두 얼굴이 39~60%로 가운데에 오고, 벚꽃 가지와 아이보리 벽이 hero와 같은 시각 언어를 이어 간다.

## 모션 디자이너에게

- frontmatter `motion_direction`의 보케 기준을 따른다. 입자 수 상한은 줄이는 것은 자유지만 늘리면 안 된다. 글자 대비는 불투명도 상한이 아니라 글자 영역 회피로 지키므로, 글자 줄 상자를 회피 대상에서 빼면 안 된다(2026-10-12 보케 B안).
- 첫 키워드가 '로맨틱'이어도 꽃잎 파티클은 쓰지 않는다. 사진에 이미 컨페티(07)와 비눗방울(04, 05)이 있어서 화면 파티클이 사진과 겹쳐 보인다.
- 보케 구현 방식(섹션별 캔버스 또는 공용 fixed 캔버스 + 구간 페이드)은 자유다. 조건은 네 가지다. calendar 구간에서도 보여야 하고, hero 사진과 카드 위로는 보이지 않아야 하며, surface 위(카드, 사진 매트)에는 나타나지 않아야 하고, 후광이 글자 위에 걸리지 않아야 한다(2026-10-12 보케 B안). guestbook은 surface 밴드가 아니라 background 섹션이지만 보케 구간도 아니다(2026-10-12 디자인 통일). 공유하기(share)도 보케 구간이 아니다(2026-10-12 share/closing 분리).
- string-lights의 전구 깜빡임과 sprig-divider stroke-draw는 SVG 구조(class='bulb', pathLength='1')를 전제로 한다.

## 프론트엔드 개발자에게

- CSS 변수: `--color-primary:#C9A09F`, `--color-secondary:#A2AA92`, `--color-accent:#8E5558`, `--color-bg:#FBF6F1`, `--color-surface:#F3EAE3`, `--color-text:#3B2D2A`, `--color-muted:#75655E`, `--color-glow:#EBCB94`, `--color-sage-deep:#5B6A46`, `--color-on-accent:#FFFCF8`, `--color-line:#E4D6CD`, `--color-field-border:#958379`, `--color-scrim:#1C1514`.
- primary, secondary, glow, line은 글자 색으로 쓰지 않는다. 작은 글자는 text, muted, accent, sage_deep만 쓴다.
- hero는 `hero_layout` 그대로 만든다. `<img src="images/photos/hero.jpg" width="1600" height="1066" fetchpriority="high">`, width 100% / height auto. object-fit cover, transform scale, 사진 위 텍스트·그라데이션은 금지한다.
- 갤러리(2026-10-12: 현재 캐러셀로 고침): frontmatter `photos.gallery`와 모션 명세 4-1대로 만든다. 슬라이드 img는 `images/photos/` 원본 + `srcset`(`images/photos/thumb/` 포함), 라이트박스는 원본. 프레임 `aspect-ratio: 2/3`, 가로 사진 02·15는 `contain` + surface 매트. 순서는 파일 번호순 01~15.
- 디자인 통일(2026-10-12): 섹션 배경, 그릇, 정렬, 모서리, 버튼, 여백은 `layout_mood`, 글자 모양은 `typography.scale`의 역할 하나에 맞춘다. 새 요소가 어느 역할에도 맞지 않으면 새 모양을 만들기 전에 concept-director에게 묻는다. 구현 순서와 선택자별 변경은 07 감사 문서 4장(M1~M18).
- lining figures 주의: `font` 단축 속성은 `font-variant-numeric`을 normal로 되돌린다. `font-variant-numeric`은 같은 규칙의 `font` 선언 뒤에 쓰고, 뒤에 오는 다른 `font` 규칙이 덮어쓰지 않는지 확인한다.
- 폰트: Google Fonts(Gowun Batang 400/700, Cormorant Garamond 300/400/500/400i, Allura 400) + Pretendard jsDelivr dynamic-subset CSS. `display=swap`.
- og: `og:image`는 `images/og-garden.jpg`(1200x630). `og:image:width`/`height`를 명시한다. favicon은 `images/favicon.svg`.
- `unused_legacy_assets`에 적힌 파일은 참조하지 않는다.

## QA 체크포인트

- 서열 표기("장남/장녀/차남/차녀")가 없고 "아들", "딸"만 쓰였는지
- 2027-01-03이 일요일로 표기되고 캘린더 3일 강조가 일요일 열에 있는지
- hero.jpg가 크롭·확대·오버레이 없이 3:2로 보이고, 390x664와 375x548 뷰포트 첫 화면에 날짜와 두 이름이 함께 보이는지
- 갤러리 15장이 파일 번호순(01~15)이고 hero.jpg가 갤러리에 없는지, 가로 사진 02·15가 잘리지 않고 매트 위에 보이는지 (2026-10-12: 인접 검사 기준 삭제)
- 디자인 통일(2026-10-12): 모든 섹션 배경이 background(guestbook 포함)인지, 오시는 길 장소명·주소에 카드가 없는지, 독립 라벨이 모두 sage_deep 600인지, Cormorant 숫자가 모두 lining인지, 원형 버튼 윤곽선이 accent인지, 내용 폭 버튼이 없는지, 모서리가 다섯 단계 안에 있는지. 계산 스타일 기준값은 07 감사 문서 4장 "구현 후 확인할 것"
- 사진에 CSS filter, mix-blend-mode, 오버레이 의사요소가 없는지
- 대비 표의 조합만 텍스트에 쓰였는지(primary, secondary, glow, line이 글자 색으로 쓰이지 않았는지), 입력 경계가 field_border인지
- 보케가 B안 기준(입자 수, 심 지름 5~9px, 심 #FFFCF8 + glow 후광, 움직임)을 지키고, 후광까지 글자 줄 상자·hero 사진·장식 SVG·BGM 버튼 자리·카드·surface 위에 나타나지 않으며, reduced-motion에서 hero의 정지 불빛 7개로 바뀌는지 (2026-10-12 보케 B안)
- 섹션 순서가 guestbook → share → closing으로 끝나고, share에는 보케·장식이 없고, 보케 구간이 hero, calendar, closing인지 (2026-10-12 share/closing 분리)
- 꽃잎·컨페티 파티클, 패럴랙스, hero 확대 모션이 없는지
- og:image가 images/og-garden.jpg(1200x630)를 가리키는지
- BGM이 audio/bgm.mp3이고 자동재생하지 않는지
- RSVP 섹션이 없고 guestbook이 있는지
