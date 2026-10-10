---
concept_name: "Petal & Glow — 꽃잎과 불빛의 정원"   # 기본값: 사용자 선택 '로맨틱 가든'을 사진 기반으로 구체화한 이름
couple:
  groom: "방인혁"
  bride: "손유민"
  groom_en: "Inhyeok"   # 기본값: 로마자 표기 사용자 미확인 (이전 실행과 동일 표기)
  bride_en: "Yumin"     # 기본값: 로마자 표기 사용자 미확인
ceremony:
  date: "2027-01-03 15:00"
  day_of_week: "일요일"     # 검증: 2027-01-03은 일요일
  time_ko: "오후 3시"
  venue: "더컨벤션 송파문정"
  hall: "13층 아모르홀"
  address: "서울 송파구 송파대로 155 NH송파농협 13층"
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
  primary: "#C9A09F"     # blush rose: hero 가랜드 꽃 샘플 그대로. 장식 전용(선, 아이콘, 보케). bg 대비 2.17이므로 텍스트 금지
  secondary: "#A2AA92"   # light sage: hero 가랜드 잎(#677753)과 background를 6:4로 섞은 색. 장식 전용. bg 대비 2.25이므로 텍스트 금지
  accent: "#8E5558"      # deep rose: primary와 같은 색상을 어둡게 내린 색. 버튼 면, 링크, 강조 숫자, 영문 eyebrow. bg 5.45 / surface 4.93
  background: "#FBF6F1"  # warm ivory: hero 아이보리 벽(#E4D6CD)을 밝힌 페이지 바탕
  surface: "#F3EAE3"     # wall ivory: 카드와 guestbook 밴드 면. hero 벽과 같은 색 계열
  text: "#3B2D2A"        # rose-brown black: 본문. bg 12.26 / surface 11.09
  muted: "#75655E"       # warm taupe gray: 캡션, 보조 정보. bg 5.17 / surface 4.68
palette_extended:   # 기본값
  glow: "#EBCB94"          # 전구 빛: 08·09·10 전구 영역 샘플(#EAC88E, #ECD19C) 평균. 보케와 전구 장식 전용. 텍스트 금지(bg 1.45)
  sage_deep: "#5B6A46"     # 가랜드 잎 샘플 그대로. 작은 아이콘, 보조 라벨 허용(bg 5.44 / surface 4.92)
  on_accent: "#FFFCF8"     # accent 면 위의 글자(5.72)
  line: "#E4D6CD"          # hero 벽 샘플 그대로. 1px 구분선, 카드 테두리(장식). 비텍스트 대비 1.32이므로 입력 필드 경계로 쓰지 않는다
  field_border: "#958379"  # 입력 필드 경계. WCAG 1.4.11 비텍스트 3:1 충족(bg 3.37 / surface 3.05)
  lightbox_scrim: "#1C1514"  # 라이트박스 배경, 불투명도 0.96. 사진 뒤에 깔리는 면이며 사진 위에 얹지 않는다
typography:   # 기본값
  korean_serif: "Gowun Batang"          # Google Fonts 400/700. 인사말, 이름, 섹션 제목, 본문
  korean_sans: "Pretendard"             # jsDelivr CDN pretendard@v1.3.9 dynamic-subset, 400/500/600. 주소, 계좌, 버튼, 폼, 작은 정보
  english_serif: "Cormorant Garamond"   # Google Fonts 300/400/500 + 400 italic. 날짜 숫자, 영문 eyebrow, 영문 이름
  english_script: "Allura"              # Google Fonts 400. 사용처는 hero의 '&', wreath 모노그램의 '&', 마지막 'Thank you' 3곳뿐. 28px 이상, 정보 전달 텍스트에 금지
  scale:
    hero_date: "Cormorant Garamond 300, 34px (뷰포트 높이 640px 이하에서 28px), letter-spacing 0.06em, text"
    hero_names: "Gowun Batang 700, 22px, letter-spacing 0.08em, text / '&'는 Allura 34px, accent"
    eyebrow: "Cormorant Garamond 500, 13px, 대문자, letter-spacing 0.28em, accent"
    section_title: "Gowun Batang 700, 20px, text"
    body: "Gowun Batang 400, 15px, line-height 1.95, 가운데 정렬, text"
    info: "Pretendard 400, 14px, line-height 1.6, text 또는 muted"
    button: "Pretendard 500, 14px"
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
    usage: "3곳만: greeting 하단(greeting과 couple-intro 사이), gallery 섹션 헤더 위, share 섹션 상단. 표시 폭 120px"
  - id: "string-lights"
    path: "images/deco/string-lights.svg"
    spec: "viewBox 0 0 240 44. 양끝(4,6)과 (236,6)을 잇고 가운데가 y≈22까지 처지는 전선 1줄(stroke field_border #958379, 1px). 전선을 따라 같은 간격으로 전구 7개: 길이 4의 짧은 줄 끝에 전구(r 3.2, glow 채움, 0.8px primary 윤곽) + 후광 원(r 7, glow 채움, opacity 0.25). 각 전구 그룹에 class='bulb'를 붙인다"
    usage: "calendar 섹션 헤더 위 1곳. 표시 폭 200px. 깜빡임 애니메이션을 위해 frontend가 HTML 안에 인라인 SVG로 넣는다"
  - id: "wreath"
    path: "images/deco/wreath.svg"
    spec: "viewBox 0 0 140 140. 아래쪽 가운데에서 시작해 좌우로 올라가 10시·2시 방향에서 끝나는 열린 리스(위쪽이 비어 있음). 잎은 윤곽선 secondary, 작은 다섯 잎 꽃 3송이(아래 가운데 1, 좌우 각 1)는 윤곽선 primary. 가운데는 비워 둔다"
    usage: "share 섹션 모노그램 1곳. 표시 폭 120px. 가운데 'I & Y'는 HTML 텍스트로 올린다(Cormorant Garamond italic 26px + Allura '&' 30px, accent). SVG 안에 글자를 넣지 않는다"
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
  gallery:   # 기본값: 사용자가 순서를 디렉터에게 위임, 사용자 미확인
    count: 15
    hero_in_gallery: false
    grid: "3열 x 5행 균일 그리드. 셀 비율 2:3(세로), gap 4px, 좌우 거터 16px, 모서리 4px, object-fit cover"
    grid_src: "images/photos/thumb/{file}"
    lightbox_src: "images/photos/{file}"
    lightbox: "원본 비율(contain), 좌우 스와이프, 핀치 줌, 'n / 15' 카운터, 배경 lightbox_scrim #1C1514 불투명도 0.96, 사진 위에 텍스트·그라데이션 없음"
    order:
      - pos: 1
        file: "02.jpg"
        orientation: "가로 1600x1194"
        chapter: "꽃과 불빛 아래"
        object_position: "70% 50%"
        desc: "벚꽃 가지 장식 아래 창가 벤치에 나란히 앉아 마주 보는 두 사람"
      - pos: 2
        file: "01.jpg"
        orientation: "세로"
        chapter: "꽃과 불빛 아래"
        desc: "화이트 배경, 신랑이 신부를 안아 올리고 서로 바라보며 웃는 상반신"
      - pos: 3
        file: "08.jpg"
        orientation: "세로"
        chapter: "꽃과 불빛 아래"
        desc: "녹색 잎과 전구 벽 앞에서 손을 맞잡고 마주 선 두 사람, 신부는 베일"
      - pos: 4
        file: "03.jpg"
        orientation: "세로"
        chapter: "Will you marry me?"
        desc: "화이트 셔츠와 블랙 드레스, 'Will you marry me?'와 'yes! yes! yes!' 하트 풍선 피켓"
      - pos: 5
        file: "09.jpg"
        orientation: "세로"
        chapter: "Will you marry me?"
        desc: "흰 꽃과 전구 벽 앞 잔디에서 신랑이 무릎 꿇고 꽃을 건네는 장면"
      - pos: 6
        file: "12.jpg"
        orientation: "세로"
        chapter: "Will you marry me?"
        desc: "블랙 수트와 블랙 드레스, 반지 낀 손을 펼쳐 보이며 웃는 두 사람"
      - pos: 7
        file: "07.jpg"
        orientation: "세로"
        chapter: "웃음이 번지는 날"
        desc: "화이트 배경, 컬러 컨페티가 날리는 가운데 손잡고 웃는 전신, 신부는 꽃다발"
      - pos: 8
        file: "13.jpg"
        orientation: "세로"
        chapter: "웃음이 번지는 날"
        desc: "블랙 수트와 블랙 드레스, 나란히 앉아 볼을 맞대고 웃는 두 사람"
      - pos: 9
        file: "05.jpg"
        orientation: "세로"
        chapter: "웃음이 번지는 날"
        desc: "블랙 배경과 비눗방울, 하트 풍선을 들고 크게 웃는 두 사람"
      - pos: 10
        file: "11.jpg"
        orientation: "세로"
        chapter: "베일과 반지"
        desc: "블랙 드레스에 재킷을 걸치고 꽃다발을 든 신부 단독 전신"
      - pos: 11
        file: "06.jpg"
        orientation: "세로"
        chapter: "베일과 반지"
        desc: "신랑이 신부의 베일을 걷어 올리는 전신"
      - pos: 12
        file: "14.jpg"
        orientation: "세로"
        chapter: "베일과 반지"
        desc: "화이트 서랍장과 꽃 앞에서 신랑이 신부에게 반지를 끼워 주는 장면"
      - pos: 13
        file: "10.jpg"
        orientation: "세로"
        chapter: "We're getting married"
        desc: "흰 꽃과 전구 벽 앞, 꽃다발을 들고 볼을 맞대고 웃는 두 사람"
      - pos: 14
        file: "04.jpg"
        orientation: "세로"
        chapter: "We're getting married"
        desc: "'We're getting married' 케이크를 든 신랑과 비눗방울을 부는 신부"
      - pos: 15
        file: "15.jpg"
        orientation: "가로 1600x1066"
        chapter: "We're getting married"
        object_position: "54% 50%"
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
  BGM 토글: position fixed, top 16, right 16, 40x40 원형. 날짜 줄(가운데 약 220px 폭)과 겹치지 않는다.
  데스크톱(≥481px): 컬럼 max-width 480px 가운데 정렬, 컬럼 바깥은 surface #F3EAE3.
layout_mood: |   # 기본값
  모바일 우선 단일 컬럼(max 480px), 가운데 정렬, 본문 좌우 거터 24px(갤러리 16px, hero 사진 0).
  섹션 상하 패딩 80px. 섹션 헤더는 영문 eyebrow(accent) + 한글 제목(text) 2단.
  면은 두 단계뿐이다: background(기본)와 surface(카드: venue 정보, account 계좌 카드 / 밴드: guestbook 섹션 전체).
  hero, calendar, share는 background 위에 두고 보케 배경이 보이는 구간으로 쓴다(surface 위에서는 보케 대비가 부족하다).
  모서리: 카드 16px, 버튼 999px(pill), 갤러리 셀 4px, hero 사진 0. 그림자 없음, 경계는 1px line #E4D6CD.
  버튼: 주 버튼 = accent 면 + on_accent 글자(5.72), 높이 44px 이상. 보조 버튼 = 투명 면 + 1px accent 테두리 + accent 글자(bg 5.45 / surface 4.93).
  입력 필드: 면 #FFFDFB, 1px field_border #958379, placeholder muted. 포커스 링 2px accent, offset 2px.
  캘린더: 2027년 1월, 일요일 열 머리글 accent, 3일은 지름 36px accent 원 + on_accent 숫자.
motion_direction: |   # 기본값 (보케 사용 자체는 사용자 선택 설명에서 옴)
  무드: '겨울 오후에 켜진 정원의 전구'. 화면 가장자리에서 따뜻한 빛망울이 숨 쉬듯 천천히 밝아졌다 어두워진다. 눈에 띄는 움직임이 아니라 공기의 결이어야 한다.
  모션 카탈로그 매핑: 첫 키워드 '로맨틱'의 기본값(romantic-lush, 꽃잎 파티클 24~40개)을 쓰지 않는다. 카탈로그 C(별빛/반딧불이)를 크고 흐린 보케로 바꿔 쓰고 density는 minimal로 한다.
  보케 상한(넘지 말 것):
    - 동시 표시 입자: 모바일 12개 이하, 768px 이상 16개 이하. 한 구간(섹션) 안에서는 8개 이하
    - 지름 12~56px, radial-gradient로 가장자리를 완전히 흐리게(하드 엣지·별 모양 스파클 금지)
    - 합성 후 픽셀 최대 불투명도: glow #EBCB94 0.28, primary #C9A09F 0.18. 입자끼리 겹쳐도 이 값을 넘지 않게 최소 간격을 둔다
      (근거: 이 상한에서 muted 텍스트가 bg 위 4.5:1 이상 유지. 본문 '보케와 텍스트 대비' 표)
    - 색 비율: glow 70% / primary 30%. 흰색·녹색·accent 보케 금지
    - 속도: 위쪽 드리프트 8px/s 이하, 좌우 흔들림 ±12px, 밝기 호흡 주기 5~9초(1초에 1회 넘는 깜빡임 금지)
    - 구간: hero, calendar, share 세 섹션의 background 영역에서만 보인다. 그 밖의 구간으로 스크롤하면 600ms에 걸쳐 0으로 사라진다
    - 레이어: 사진·카드·텍스트 뒤. hero 사진 위에 겹쳐 보이면 안 된다(사진 위아래 여백에만 보임)
    - 정지 조건: 라이트박스 열림, 탭 비활성, 구간이 화면 밖. 캔버스 DPR 상한 2
  그 밖의 모션: 섹션 진입 fade-in + translateY(12px→0) 800ms ease-out 하나로 통일. hero는 위 텍스트 → 사진 → 아래 텍스트 순 fade-in(사진은 900ms, scale 금지).
    sprig-divider는 진입 시 stroke-draw 1회(2.4s) 후 정지. string-lights의 전구 7개는 opacity 0.65↔1을 4~6초 주기로 서로 엇갈리게.
    BGM 토글 재생 중에는 버튼 둘레에 glow 링이 3초 주기로 은은하게 숨 쉰다.
  금지: 꽃잎·컨페티·하트 파티클, 패럴랙스, hero 사진 Ken Burns·확대, 터치 반응 파티클, 사진 위 오버레이 효과.
  prefers-reduced-motion: reduce → 보케는 hero 위아래 여백에 정지한 흐린 점 5개만(같은 불투명도 상한). 디바이더는 완성된 상태, 전구 깜빡임 없음, 섹션은 즉시 표시.
sections_order:   # rsvp 제외, guestbook 유지는 사용자 지정. 나머지 순서는 기본값
  - hero
  - greeting
  - couple-intro
  - calendar
  - gallery
  - venue
  - account
  - guestbook
  - share
defaults_applied:
  - "컨셉 이름 'Petal & Glow — 꽃잎과 불빛의 정원'과 mood_keywords 3개(로맨틱 가든 안에서 구체화)"
  - "영문 이름 표기 Inhyeok / Yumin (사용자 미확인)"
  - "팔레트: 사진 픽셀 샘플링 기반 커스텀 7색 + 확장 토큰 6개"
  - "폰트: Gowun Batang + Pretendard + Cormorant Garamond + Allura(3곳 한정)"
  - "hero 레이아웃: 위 텍스트 / 가로 사진 풀블리드 / 아래 텍스트 3단 스택"
  - "갤러리 15장 순서와 3열 2:3 그리드 (사용자 위임, 미확인)"
  - "장식 자산 4종(SVG)과 og 썸네일 소스 02.jpg 크롭"
  - "보케 모션 밀도·불투명도·속도 상한"
  - "섹션 순서 중 rsvp 제외·guestbook 유지 외 나머지 순서"
  - "교통편(지하철·버스·주차) 정보 미제공: copy-writer가 '확인 필요' 표시와 함께 작성"
  - "계좌번호와 방명록 접수 주소: placeholder (사용자 지정)"
---

# 컨셉 디렉션 노트: "Petal & Glow — 꽃잎과 불빛의 정원"

## 톤앤매너

1월 첫 일요일 오후, 실내 컨벤션홀에서 올리는 격식 있는 예식이다. 사용자가 고른 **로맨틱 가든**은 장소가 아니라 사진의 분위기를 가리킨다. 아이보리 벽에 걸린 블러시 꽃 가랜드, 잎 사이로 켜진 전구 줄이 이 청첩장의 두 축이다. 겨울 한가운데 실내로 들어왔을 때 느끼는 온기를 화면의 첫인상으로 삼는다. 꽃은 선으로만 그리고 빛은 흐린 보케로만 움직이게 해서, 화려함보다 다정함이 먼저 읽히게 한다. 격식은 정중한 문장과 넉넉한 여백으로 지킨다.

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
| sage_deep #5B6A46 | background / surface | 5.44 / 4.92 | 작은 라벨 AA |
| field_border #958379 | background / surface | 3.37 / 3.05 | 입력 경계 비텍스트 3:1 |
| primary #C9A09F | background | 2.17 | 장식 전용 (텍스트 금지) |
| secondary #A2AA92 | background | 2.25 | 장식 전용 (텍스트 금지) |
| glow #EBCB94 | background | 1.45 | 장식 전용 (텍스트 금지) |
| line #E4D6CD | background | 1.32 | 장식 구분선 전용 (입력 경계 금지) |

### 보케와 텍스트 대비

보케가 글자 뒤를 지날 때 바탕색이 바뀐다. 아래는 보케 색을 background에 해당 불투명도로 섞은 뒤 다시 잰 값이다.

| 보케 | 불투명도 | 섞인 바탕 | muted | accent |
|---|---|---|---|---|
| glow | 0.28 상한 | #F7EAD7 | 4.68 | 4.93 |
| glow | 0.35 | #F5E7D0 | 4.56 | 4.80 |
| primary | 0.18 상한 | #F2E7E2 | 4.58 | 4.82 |
| primary | 0.25 | #EEE0DC | 4.32 (미달) | 4.55 |
| glow (surface 위) | 0.20 | #F1E4D3 | 4.44 (미달) | 4.67 |

그래서 보케는 background 위 세 구간(hero, calendar, share)에서만 쓰고, 상한은 glow 0.28, primary 0.18로 둔다. surface 위에는 보케를 두지 않는다.

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

## 갤러리

### 형태: 3열 x 5행, 셀 2:3

- 15장이 3열 5행으로 빈칸 없이 맞아떨어진다. 세로 13장은 원본 비율이 2:3이라 썸네일에서 잘리는 부분이 없다. 전신 컷(06, 07, 09, 11)도 구도가 그대로 남는다.
- 가로 2장(02, 15)만 2:3으로 크롭한다. object-position 값은 두 사람이 들어가도록 썸네일 좌표로 계산했다. 02는 70% 50%(두 사람과 드레스 자락), 15는 54% 50%(두 사람과 베일)이다. 라이트박스에서는 원본 비율로 보인다.
- 390px 화면에서 셀은 약 117x175px이고 그리드 전체 높이는 약 890px이다.
- 정사각 크롭을 쓰지 않는 이유: 전신 컷의 발끝과 머리 위 장식(전구, 꽃)이 잘린다. 메이슨리를 쓰지 않는 이유: 가로 2장 때문에 열 높이가 어긋나고 행 단위 흐름이 깨진다.

### 순서와 배치 이유

각 행이 한 챕터다. 그리드 칸은 (행, 열)로 적는다.

| # | 칸 | 파일 | 방향 | 한 줄 설명 | 배치 이유 |
|---|---|---|---|---|---|
| 1 | 1,1 | 02 | 가로 | 벚꽃 가지 아래 창가 벤치에 나란히 앉은 컷 | 오프닝. hero의 꽃 가랜드·아이보리 벽을 그대로 이어받아 hero에서 갤러리로 자연스럽게 넘어간다 |
| 2 | 1,2 | 01 | 세로 | 안아 올려 서로 바라보는 상반신 | 꽃 장식 컷 사이에 흰 여백의 클로즈업을 두어 숨을 고른다. 02와 같은 수트지만 배경과 프레이밍이 다르다 |
| 3 | 1,3 | 08 | 세로 | 잎·전구 벽 앞에서 손잡고 마주 선 컷 | 첫 행 끝에 첫 '불빛' 컷을 둬서 컨셉의 두 축(꽃, 빛)을 첫 행에서 모두 보여 준다 |
| 4 | 2,1 | 03 | 세로 | "Will you marry me?" 하트 풍선 피켓 | 프러포즈 챕터의 질문 |
| 5 | 2,2 | 09 | 세로 | 꽃·전구 벽 앞에서 무릎 꿇고 꽃을 건네는 컷 | 질문에 답하는 장면이자 2행의 색 앵커. 08과는 대각선이라 맞닿지 않는다 |
| 6 | 2,3 | 12 | 세로 | 반지 낀 손을 펼쳐 보이는 컷 | 프러포즈의 결과("yes"). 03과 같은 행이지만 09가 사이에 있다 |
| 7 | 3,1 | 07 | 세로 | 컨페티 속 손잡고 웃는 전신 | 프러포즈 뒤의 축하. 위(03)와 의상·색이 다르다 |
| 8 | 3,2 | 13 | 세로 | 블랙 의상, 앉아서 볼 맞댄 컷 | 축하 사이의 다정한 클로즈업. 12와 대각선이라 맞닿지 않는다 |
| 9 | 3,3 | 05 | 세로 | 블랙 배경, 비눗방울과 하트 풍선 | 갤러리 한가운데 유일한 어두운 배경으로 리듬을 바꾼다. 풍선이 겹치는 03, 비눗방울이 겹치는 04와 멀리 둔다 |
| 10 | 4,1 | 11 | 세로 | 블랙 드레스·재킷 차림의 신부 단독 | 서약 챕터를 여는 신부 컷. 같은 의상의 03·04와 떨어져 있다 |
| 11 | 4,2 | 06 | 세로 | 베일을 걷어 올리는 전신 | 서약의 순간. 같은 화이트 스튜디오 베이지 세트인 01·07과 두 칸 이상 떨어져 있다 |
| 12 | 4,3 | 14 | 세로 | 서랍장과 꽃 앞에서 반지를 끼워 주는 컷 | 서약의 완성. 반지를 보여 주는 12와 멀리 둔다 |
| 13 | 5,1 | 10 | 세로 | 꽃·전구 벽 앞, 꽃다발 들고 볼 맞댄 컷 | 마지막 행을 다시 불빛으로 연다. 첫 행의 08과 짝을 이룬다 |
| 14 | 5,2 | 04 | 세로 | "We're getting married" 케이크와 비눗방울 | 청첩장의 메시지와 같은 문구라 끝 직전에 둔다. 같은 의상의 03과는 3행 떨어져 있다 |
| 15 | 5,3 | 15 | 가로 | 커튼 창가 역광 속 입맞춤 | 피날레. 가장 밝고 조용한 컷으로 갤러리를 닫는다 |

챕터: 1행 꽃과 불빛 아래 → 2행 Will you marry me? → 3행 웃음이 번지는 날 → 4행 베일과 반지 → 5행 We're getting married. 챕터 이름은 화면에 표시하지 않는다. 순서와 alt 작성에만 쓴다.

### 인접 검사 (QA 기준)

다음 쌍은 같은 행에서 옆 칸, 같은 열에서 위아래 칸, 라이트박스 연속 순서(행이 바뀌는 3→4, 6→7, 9→10, 12→13 포함) 중 어느 것으로도 맞닿지 않는다. 배치를 고를 때 스크립트로 전수 검사했다.

- 꽃·전구 벽: 08, 09, 10 (그리고 어두운 배경 05와도 서로 맞닿지 않음)
- 화이트 셔츠 + 블랙 드레스·재킷 세트: 03, 04, 11
- 블랙 의상 + 화이트 배경: 11, 12, 13, 15
- 베이지 수트 화이트 스튜디오: 01, 06, 07
- 풍선·비눗방울: 03–05, 04–05
- 반지: 12–14

## 카피라이터에게

- 중심 키워드는 **로맨틱**. 다정하고 따뜻하되 혼주가 함께 보내는 청첩장이므로 정중한 경어체를 유지한다. 과장된 수식어는 피한다.
- 은유는 '꽃'과 '빛(온기)' 중 하나를 골라 인사말 안에서 한 번만 쓴다. 1월 예식이므로 "겨울 한가운데의 따뜻한 빛" 같은 대비가 컨셉과 잘 맞는다. 계절 클리셰를 나열하지 않는다.
- **'가든 웨딩', '정원에서', '야외' 같은 표현은 쓰지 않는다.** 실내 컨벤션 예식이라 하객이 장소를 오해할 수 있다. 벚꽃·봄도 쓰지 않는다(02의 꽃은 촬영 소품이다).
- hero eyebrow 제안: "WE'RE GETTING MARRIED". 04 케이크의 문구와 호응한다. 섹션 eyebrow는 영문 대문자 한두 단어로 한다(예: INVITATION, THE DAY, GALLERY, LOCATION, GUESTBOOK, THANK YOU). 최종 문구는 카피라이터가 정한다.
- 혼주 표기: "방주경 · 주진숙의 아들 인혁", "손홍희 · 김연주의 딸 유민". **장남/장녀 등 서열 표기 금지.**
- 일시: "2027년 1월 3일 일요일 오후 3시". 영문: "2027 · 01 · 03" + "SUNDAY · 3 PM".
- 장소: "더컨벤션 송파문정 13층 아모르홀", 주소 "서울 송파구 송파대로 155 NH송파농협 13층".
- 교통편은 사용자가 주지 않았다. 쓰는 경우 "확인 필요" 표시를 남긴다. 계좌번호와 방명록 접수 주소는 `[[TODO:...]]` placeholder로 둔다.
- 마지막 share 섹션의 'Thank you'는 Allura로 쓰이므로 영문 두 단어 그대로 둔다.
- 갤러리 alt는 `photos.gallery.order[].desc`를 바탕으로 쓰되 파일명이나 챕터 이름은 넣지 않는다.

## 이미지 아티스트에게

- gpt-image2를 쓸 수 없다. 장식 4종(sprig-divider, string-lights, wreath, favicon)은 frontmatter `decor_assets`의 viewBox·좌표·색 지시대로 SVG를 직접 작성한다.
- 선 굵기 1~1.4px(favicon만 2px), 채움은 꽃 중심 점과 전구에만 쓴다. 그라데이션, 필터, 텍스처, 그림자는 넣지 않는다. 색은 HEX를 그대로 쓴다.
- SVG 안에 글자를 넣지 않는다. 모노그램 글자는 HTML이 담당한다.
- 사진 작업은 og 크롭 1건뿐이다(02.jpg → `images/og-garden.jpg`, 크롭 영역은 frontmatter). 색·밝기 조정, 샤프닝, 리터칭은 하지 않는다.
- og 파일 이름을 새로 정한 이유: 이전 실행의 `images/og-thumbnail.jpg`가 이미 카카오톡에 공유됐다면 같은 URL은 예전 이미지가 캐시로 남을 수 있다.
- og 소스로 hero 대신 02를 고른 이유: hero를 가랜드가 남도록 1.9:1로 자르면(y 96–936) 두 얼굴이 크롭 높이의 53~77%로 아래에 치우치고 인물이 작다. 02는 두 얼굴이 39~60%로 가운데에 오고, 벚꽃 가지와 아이보리 벽이 hero와 같은 시각 언어를 이어 간다.

## 모션 디자이너에게

- frontmatter `motion_direction`의 보케 상한이 기준이다. 이 값은 텍스트 대비를 지키기 위한 한계이므로 줄이는 것은 자유지만 늘리면 안 된다.
- 첫 키워드가 '로맨틱'이어도 꽃잎 파티클은 쓰지 않는다. 사진에 이미 컨페티(07)와 비눗방울(04, 05)이 있어서 화면 파티클이 사진과 겹쳐 보인다.
- 보케 구현 방식(섹션별 캔버스 또는 공용 fixed 캔버스 + 구간 페이드)은 자유다. 조건은 세 가지다. calendar 구간에서도 보여야 하고, hero 사진과 카드 위로는 보이지 않아야 하며, surface 위(guestbook, 카드)에는 나타나지 않아야 한다.
- string-lights의 전구 깜빡임과 sprig-divider stroke-draw는 SVG 구조(class='bulb', pathLength='1')를 전제로 한다.

## 프론트엔드 개발자에게

- CSS 변수: `--color-primary:#C9A09F`, `--color-secondary:#A2AA92`, `--color-accent:#8E5558`, `--color-bg:#FBF6F1`, `--color-surface:#F3EAE3`, `--color-text:#3B2D2A`, `--color-muted:#75655E`, `--color-glow:#EBCB94`, `--color-sage-deep:#5B6A46`, `--color-on-accent:#FFFCF8`, `--color-line:#E4D6CD`, `--color-field-border:#958379`, `--color-scrim:#1C1514`.
- primary, secondary, glow, line은 글자 색으로 쓰지 않는다. 작은 글자는 text, muted, accent, sage_deep만 쓴다.
- hero는 `hero_layout` 그대로 만든다. `<img src="images/photos/hero.jpg" width="1600" height="1066" fetchpriority="high">`, width 100% / height auto. object-fit cover, transform scale, 사진 위 텍스트·그라데이션은 금지한다.
- 갤러리: 그리드는 `images/photos/thumb/`, 라이트박스는 `images/photos/` 원본을 쓴다. 셀은 `aspect-ratio: 2/3`, 02와 15에만 지정된 object-position을 준다. 썸네일은 `loading="lazy"`.
- 폰트: Google Fonts(Gowun Batang 400/700, Cormorant Garamond 300/400/500/400i, Allura 400) + Pretendard jsDelivr dynamic-subset CSS. `display=swap`.
- og: `og:image`는 `images/og-garden.jpg`(1200x630). `og:image:width`/`height`를 명시한다. favicon은 `images/favicon.svg`.
- `unused_legacy_assets`에 적힌 파일은 참조하지 않는다.

## QA 체크포인트

- 서열 표기("장남/장녀/차남/차녀")가 없고 "아들", "딸"만 쓰였는지
- 2027-01-03이 일요일로 표기되고 캘린더 3일 강조가 일요일 열에 있는지
- hero.jpg가 크롭·확대·오버레이 없이 3:2로 보이고, 390x664와 375x548 뷰포트 첫 화면에 날짜와 두 이름이 함께 보이는지
- 갤러리 15장이 위 순서·파일명과 일치하고 hero.jpg가 갤러리에 없는지. 인접 검사 쌍이 맞닿지 않는지
- 사진에 CSS filter, mix-blend-mode, 오버레이 의사요소가 없는지
- 대비 표의 조합만 텍스트에 쓰였는지(primary, secondary, glow, line이 글자 색으로 쓰이지 않았는지), 입력 경계가 field_border인지
- 보케가 상한(입자 수, 불투명도 glow 0.28 / primary 0.18, 속도)을 지키고, hero 사진·카드·surface 위에 나타나지 않으며, reduced-motion에서 정지하는지
- 꽃잎·컨페티 파티클, 패럴랙스, hero 확대 모션이 없는지
- og:image가 images/og-garden.jpg(1200x630)를 가리키는지
- BGM이 audio/bgm.mp3이고 자동재생하지 않는지
- RSVP 섹션이 없고 guestbook이 있는지
