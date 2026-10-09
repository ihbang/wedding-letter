# 카피 시트: 방인혁 · 손유민

- 기준: `_workspace/00_user-input.md`, `_workspace/01_concept-director_concept-sheet.md`
- 어조: 클래식 · 미니멀 · 차분한. 정중한 경어체, 짧은 문장, 수식어 최소.
- 줄바꿈: 본문 블록의 각 행은 그대로 `<br>` 한 번, 빈 줄은 문단 구분이다.

## placeholder 규칙

사용자가 아직 제공하지 않은 정보는 모두 `[[TODO:<KEY>]]` 형식으로 둔다.
frontend는 이 문자열을 그대로 마크업에 넣고, 배포 전 `grep -n '\[\[TODO:' index.html`로 남은 항목을 확인한다.

| KEY | 채울 내용 |
|-----|----------|
| `GROOM_BANK` | 신랑측 은행명 |
| `GROOM_ACCOUNT` | 신랑측 계좌번호 |
| `BRIDE_BANK` | 신부측 은행명 |
| `BRIDE_ACCOUNT` | 신부측 계좌번호 |
| `SUBWAY` | 가장 가까운 지하철역, 호선, 출구 번호, 도보 시간 |
| `BUS` | 하차 정류장명, 노선 번호 |
| `PARKING` | 주차장 위치, 무료 주차 시간 조건 |

## hero_subtitle
2027. 01. 03. SUN 3PM

### hero_bottom
방인혁 · 손유민
더컨벤션 송파문정 13층 아모르홀

## section_titles
- greeting: INVITATION / 초대합니다
- couple-intro: BRIDE & GROOM / 신랑 신부
- calendar: THE DAY / 예식 일시
- gallery: GALLERY / 사진
- venue: LOCATION / 오시는 길
- account: WITH HEART / 마음 전하실 곳
- rsvp: RSVP / 참석 여부
- guestbook: GUESTBOOK / 방명록
- share: SHARE / 청첩장 전하기

## greeting
새해가 열리는 첫 일요일,
저희 두 사람이
부부의 연을 맺고자 합니다.

아껴 주신 분들을 모시고
그 약속을 드리려 합니다.

귀한 걸음으로 함께해 주시면
더없는 기쁨으로 간직하겠습니다.

## couple_intro
- 신랑: 방주경 · 주진숙의 아들 인혁
- 신부: 손홍희 · 김연주의 딸 유민

## ceremony_info
- 일시: 2027년 1월 3일 일요일 오후 3시
- 일시(영문): Sunday, January 3, 2027 · 3PM
- 장소: 더컨벤션 송파문정 13층 아모르홀
- 주소: 서울 송파구 송파대로 155 NH송파농협 13층

## dday_message
인혁 · 유민의 결혼식이 {N}일 남았습니다.
- 예식 당일: 오늘, 인혁 · 유민이 부부가 됩니다.
- 예식 이후: 인혁 · 유민의 결혼식에 함께해 주셔서 감사합니다.
- `{N}`은 frontend가 계산해 넣는 값이며 placeholder가 아니다.

## directions
### 지하철
[[TODO:SUBWAY]]

### 버스
[[TODO:BUS]]

### 주차
[[TODO:PARKING]]
내비게이션에서 "더컨벤션 송파문정" 또는
"서울 송파구 송파대로 155"를 검색해 주세요.

## account_message
참석이 어려우신 분들을 위해
마음 전하실 곳을 안내드립니다.

보내 주시는 축하의 마음,
감사히 간직하겠습니다.

## account_info
- 신랑측: [[TODO:GROOM_BANK]] [[TODO:GROOM_ACCOUNT]] 방인혁
- 신부측: [[TODO:BRIDE_BANK]] [[TODO:BRIDE_ACCOUNT]] 손유민
- 복사 버튼 라벨: 복사하기 → 복사되었습니다
- 혼주 계좌는 사용자 요청이 없어 넣지 않았다.

## rsvp_message
참석 여부를 미리 알려 주시면
정성껏 자리를 준비하겠습니다.

- 버튼 라벨: 참석 여부 전하기
- 선택지: 참석합니다 / 참석이 어렵습니다
- 입력 항목: 성함, 신랑측·신부측, 동행 인원
- 제출 완료: 소중한 답변 감사합니다.

## guestbook_placeholder
두 사람에게 전하실 말씀을 남겨 주세요.

### guestbook_message
남겨 주신 말씀은
오래도록 간직하겠습니다.

## closing
함께해 주시는 모든 분께
진심으로 감사드립니다.

## kakao_share
- title: 방인혁 · 손유민의 결혼식에 초대합니다
- description: 2027년 1월 3일 일요일 오후 3시, 더컨벤션 송파문정 13층 아모르홀
- button: 청첩장 보기
- 링크 복사 완료: 주소가 복사되었습니다.
