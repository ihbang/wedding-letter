# 방명록 글 목록 공개 설계

- 작성: 2026-10-12, 오케스트레이터
- 상태: **2026-10-13에 구현했다.** 구현 내용은 `05_frontend-developer_summary.md` 16장, 검증은 `06_invitation-qa_report.md` 8차 절에 있다. 아래 본문은 설계 당시 그대로 두고, 구현에서 달라진 점만 바로 아래에 적는다.
- 구현에서 달라진 점
  - 웹 앱 코드의 원본은 `apps-script/guestbook.gs`다. 5장 골격과 다른 점은 `00_user-input.md`의 "방명록 글 목록 공개 착수" 절에 있다. QA 뒤에 메일 발송을 lock 밖으로 옮겼다.
  - 공개 안내는 폼 아래가 아니라 "남기기" 버튼 바로 위에 둔다(6-1과 다름). 제출하기 전에 공개 사실을 읽게 하기 위해서다.
  - 4-1의 offset 커서는 페이지에서 보정한다. 쓰기에 성공하면 +1, 삭제에 성공하거나 `not_found`로 항목을 빼면 -1이고, 더보기 항목은 id로 중복을 거른다.
  - 함정 칸의 입력 이름은 `website`가 아니라 `gb_extra`다. 자동 완성이 채우면 실제 하객의 글이 버려지기 때문이다. 웹 앱으로 보내는 JSON 키는 `website` 그대로다.
  - 시험은 시험용 시트 대신 `guestbook.gs`를 그대로 실행하는 로컬 모의 서버로 했다(8장 1-6, 4, 5와 다름). 실제 URL로는 글 1건 쓰고 지우기만 확인한다.
- 사용자 결정(2026-10-12)
  - 저장소는 Google 시트 + Apps Script 웹 앱을 쓴다.
  - 하객이 비밀번호로 자기 글을 지울 수 있게 한다.
  - 새 글 메일 알림은 유지한다.
  - 이름과 글을 모두 공개하고, 공개된다는 안내 문구를 넣는다.

---

## 1. 지금 구조와 바꿀 점

| 항목 | 지금 | 바뀐 뒤 |
|---|---|---|
| 글 저장 | Formspree로 보낸다(`index.html`의 `.gb-form` `action`). 페이지에서는 읽을 수 없다 | Apps Script 웹 앱이 Google 시트에 한 줄씩 저장한다 |
| 글 보기 | 없다. 두 사람만 메일과 Formspree 대시보드로 본다 | 방명록 폼 아래에 최신순 목록을 보여 준다 |
| 메일 알림 | Formspree가 보낸다 | Apps Script가 `MailApp`으로 보낸다(아래 착수 전 확인 1) |
| 삭제 | 없다 | 하객은 글을 쓸 때 정한 비밀번호로 지운다. 두 사람은 시트에서 숨긴다 |
| 안내 문구 | "남겨 주신 글은 두 사람에게만 전해집니다." | 지운다. "남겨 주신 글은 이 페이지에 공개됩니다" 취지의 안내로 바꾼다 |

GitHub Pages는 정적 호스팅이라 저장 서버가 없다. Formspree는 받은 글을 공개로 읽어 오는 기능이 없다(조회 API에 비밀 키가 필요해 브라우저에 둘 수 없다). 그래서 쓰기와 읽기를 모두 받아 주는 Apps Script 웹 앱을 둔다.

## 2. 전체 구조

```
브라우저(index.html, script.js)
  ├─ GET  {웹 앱 URL}?action=list&limit=20&cursor=N   → 목록
  ├─ POST {웹 앱 URL}  body: {"action":"create", ...}  → 새 글
  └─ POST {웹 앱 URL}  body: {"action":"delete", ...}  → 본인 삭제
Apps Script 웹 앱(실행 계정: 두 사람의 Google 계정, 접근: 모든 사용자)
  ├─ Google 시트 "entries" (저장소)
  ├─ CacheService (목록 캐시, 쓰기 횟수 제한, 삭제 시도 제한)
  ├─ LockService (동시 쓰기 직렬화)
  └─ MailApp (새 글 알림)
```

- **POST 형식:** `Content-Type: text/plain;charset=utf-8`로 보내고 본문은 JSON 문자열로 한다. `application/json`으로 보내면 브라우저가 CORS 사전 요청(OPTIONS)을 보내는데, Apps Script는 이 요청을 처리하지 못한다.
- **응답 경로:** Apps Script 응답은 `script.googleusercontent.com`으로 한 번 리다이렉트된다. `fetch`의 기본값(`redirect: 'follow'`)이면 그대로 받는다.
- **상태 코드:** Apps Script는 HTTP 상태 코드를 정할 수 없어서 항상 200을 돌려준다. 성공·실패는 응답 본문의 `ok`와 `error`로 판단한다.

## 3. 데이터 모델 (시트 "entries")

| 열 | 이름 | 내용 |
|---|---|---|
| A | `id` | `Utilities.getUuid()` |
| B | `createdAt` | 서버 시각, ISO 8601(UTC) |
| C | `name` | 성함. 앞뒤 공백 제거, 1~40자 |
| D | `message` | 남기실 말씀. 앞뒤 공백 제거, 1~500자, 줄바꿈 허용(최대 연속 2줄) |
| E | `salt` | 글마다 새로 만드는 무작위 값(`Utilities.getUuid()`) |
| F | `passwordHash` | `base64(SHA-256(salt + password))` |
| G | `status` | `visible`, `deleted`(하객 삭제), `hidden`(두 사람이 숨김) |
| H | `deletedAt` | 삭제·숨김 시각 |

- 행을 실제로 지우지 않고 `status`만 바꾼다(소프트 삭제). 잘못 지운 글을 되살릴 수 있고, 행 번호가 바뀌어 동시 요청이 엉키는 일도 막는다.
- 두 사람이 글을 내릴 때는 시트에서 `status`를 `hidden`으로 바꾼다. 목록 캐시 때문에 최대 60초 뒤에 페이지에서 사라진다.
- 비밀번호는 평문으로 저장하지 않는다. 응답에도 `salt`, `passwordHash`를 넣지 않는다.

## 4. API

### 4-1. 목록: `GET ?action=list&limit=20&cursor=0`

```json
{ "ok": true,
  "entries": [ { "id": "…", "name": "…", "message": "…", "createdAt": "2026-12-01T05:12:00.000Z" } ],
  "nextCursor": 20 }
```

- `status === 'visible'`인 행만 최신순으로 준다. `nextCursor`가 `null`이면 마지막 페이지다.
- `limit`는 1~50으로 자른다. 커서는 정렬된 목록의 위치(offset)다. 방명록은 많아야 수백 건이라 offset으로 충분하다.
- 전체 목록을 `CacheService`에 60초 동안 담아 두고, 새 글이나 삭제가 생기면 캐시를 지운다.

### 4-2. 새 글: `POST {"action":"create","name","message","password","website","elapsed"}`

- 성공: `{ "ok": true, "entry": { "id", "name", "message", "createdAt" } }`
- 실패 `error` 값
  - `invalid`: 길이나 형식이 맞지 않음
  - `rate_limited`: 너무 잦은 쓰기
  - `duplicate`: 같은 내용을 연달아 보냄
  - `closed`: 방명록을 닫음
  - `server`: 그 밖의 서버 오류
- 검사 순서
  1. `website`(사람 눈에 보이지 않는 함정 칸)에 값이 있으면 저장하지 않는다. 봇이 눈치채지 못하도록 겉으로는 성공처럼 응답한다.
  2. `elapsed`(폼이 보인 뒤 제출까지 걸린 ms)가 3000 미만이면 같은 방식으로 버린다.
  3. 길이를 검사한다. 성함 1~40자, 말씀 1~500자, 비밀번호 4~20자.
  4. 전체 쓰기를 1분에 20건으로 제한한다(`CacheService` 카운터).
  5. 같은 성함과 말씀 조합은 10분 안에 다시 받지 않는다.
  6. `LockService.getScriptLock().waitLock(10000)`을 잡고 한 줄을 추가한다.
- 저장한 뒤 메일을 보낸다. 메일 발송이 실패해도 글 저장은 성공으로 응답한다.

### 4-3. 본인 삭제: `POST {"action":"delete","id","password"}`

- 성공: `{ "ok": true }`
- 실패 `error` 값: `not_found`, `wrong_password`, `too_many_attempts`, `server`
- 글 하나당 10분에 5번까지만 비밀번호를 시도할 수 있다(`CacheService`, 키 `del:{id}`).
- 비밀번호가 맞으면 `status`를 `deleted`로 바꾸고 목록 캐시를 지운다.

## 5. Apps Script 코드 골격

착수할 때 저장소에 `apps-script/guestbook.gs`로 두고, Apps Script 편집기에 붙여 넣거나 `clasp`로 올린다. 비밀값과 한국어 문구는 코드에 넣지 않고 스크립트 속성에 둔다(저장소 코드 규칙, GitHub Pages에 공개됨).

| 스크립트 속성 | 내용 |
|---|---|
| `NOTIFY_EMAIL` | 알림을 받을 메일 주소 |
| `MAIL_SUBJECT` | 알림 메일 제목(지금 Formspree 제목 "[청첩장] 인혁 · 유민 방명록"과 같게) |
| `CLOSED` | `true`면 새 글을 받지 않는다(예식 뒤 방명록을 닫을 때) |

```js
// Guestbook web app: list / create / delete entries in the "entries" sheet.
const SHEET = 'entries';
const LIMITS = { NAME: 40, MESSAGE: 500, PW_MIN: 4, PW_MAX: 20, PAGE_MAX: 50 };
const CACHE_LIST_KEY = 'list';
const CACHE_TTL_S = 60;

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'list') return json(list(Number(p.limit) || 20, Number(p.cursor) || 0));
  return json({ ok: false, error: 'unknown_action' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'invalid' }); }
  try {
    if (body.action === 'create') return json(create(body));
    if (body.action === 'delete') return json(remove(body));
    return json({ ok: false, error: 'unknown_action' });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server' });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function sheet() { return SpreadsheetApp.getActive().getSheetByName(SHEET); }

function visibleEntries() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get(CACHE_LIST_KEY);
  if (hit) return JSON.parse(hit);
  const rows = sheet().getDataRange().getValues().slice(1); // skip header row
  const entries = rows
    .filter((r) => r[6] === 'visible')
    .map((r) => ({ id: r[0], createdAt: new Date(r[1]).toISOString(), name: r[2], message: r[3] }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  cache.put(CACHE_LIST_KEY, JSON.stringify(entries), CACHE_TTL_S); // value must stay under 100KB
  return entries;
}

function list(limit, cursor) {
  const all = visibleEntries();
  const size = Math.min(Math.max(limit, 1), LIMITS.PAGE_MAX);
  const page = all.slice(cursor, cursor + size);
  const next = cursor + size < all.length ? cursor + size : null;
  return { ok: true, entries: page, nextCursor: next };
}

function clean(s, max) {
  return String(s || '').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, max + 1);
}

function hash(salt, password) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password, Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}

function create(b) {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('CLOSED') === 'true') return { ok: false, error: 'closed' };
  if (b.website || Number(b.elapsed) < 3000) return { ok: true, entry: null }; // silent drop for bots
  const name = clean(b.name, LIMITS.NAME);
  const message = clean(b.message, LIMITS.MESSAGE);
  const password = String(b.password || '');
  if (!name || name.length > LIMITS.NAME || !message || message.length > LIMITS.MESSAGE
      || password.length < LIMITS.PW_MIN || password.length > LIMITS.PW_MAX) return { ok: false, error: 'invalid' };

  const cache = CacheService.getScriptCache();
  const minuteKey = 'rate:' + Math.floor(Date.now() / 60000);
  const count = Number(cache.get(minuteKey) || 0);
  if (count >= 20) return { ok: false, error: 'rate_limited' };
  const dupKey = 'dup:' + hash('', name + '\n' + message);
  if (cache.get(dupKey)) return { ok: false, error: 'duplicate' };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const id = Utilities.getUuid();
    const salt = Utilities.getUuid();
    const createdAt = new Date().toISOString();
    sheet().appendRow([id, createdAt, name, message, salt, hash(salt, password), 'visible', '']);
    cache.put(minuteKey, String(count + 1), 120);
    cache.put(dupKey, '1', 600);
    cache.remove(CACHE_LIST_KEY);
    notify(props, name, message, createdAt);
    return { ok: true, entry: { id, name, message, createdAt } };
  } finally {
    lock.releaseLock();
  }
}

function remove(b) {
  const cache = CacheService.getScriptCache();
  const triesKey = 'del:' + b.id;
  const tries = Number(cache.get(triesKey) || 0);
  if (tries >= 5) return { ok: false, error: 'too_many_attempts' };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet();
    const rows = sh.getDataRange().getValues();
    const i = rows.findIndex((r, k) => k > 0 && r[0] === b.id && r[6] === 'visible');
    if (i < 0) return { ok: false, error: 'not_found' };
    if (hash(rows[i][4], String(b.password || '')) !== rows[i][5]) {
      cache.put(triesKey, String(tries + 1), 600);
      return { ok: false, error: 'wrong_password' };
    }
    sh.getRange(i + 1, 7, 1, 2).setValues([['deleted', new Date().toISOString()]]);
    cache.remove(CACHE_LIST_KEY);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function notify(props, name, message, createdAt) {
  const to = props.getProperty('NOTIFY_EMAIL');
  if (!to) return;
  try {
    MailApp.sendEmail({ to, subject: props.getProperty('MAIL_SUBJECT') || 'Guestbook', body: name + '\n' + createdAt + '\n\n' + message });
  } catch (err) {
    console.error(err); // a mail failure must not fail the saved entry
  }
}
```

- 골격이므로 착수할 때 실제 배포본으로 시험한다. 특히 캐시 크기 한도(값 100KB)를 확인한다. 글이 수백 건을 넘으면 목록 캐시를 페이지 단위로 나눈다.
- 시트 첫 행에는 3장의 열 이름을 헤더로 넣는다.

## 6. 프런트엔드 변경

### 6-1. `index.html`
- **웹 앱 주소:** `<head>`에 `<meta name="guestbook-endpoint" content="https://script.google.com/macros/s/…/exec">` 한 곳에 둔다. 카카오 키를 `<meta name="kakao-js-key">`에 둔 방식과 같다.
- **폼 정리:** `.gb-form`의 Formspree `action`과 `_subject` 숨은 입력을 지운다.
- **폼에 추가하는 입력칸**
  - 비밀번호: `type="password"`, `autocomplete="new-password"`, `minlength="4"`, `maxlength="20"`, 라벨과 짧은 도움말("글을 지울 때 필요합니다")을 둔다.
  - 함정 칸: `name="website"`, 화면 밖으로 숨기고 `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`를 붙인다.
- **안내 문구:** `.guestbook__note`의 문구를 공개 안내로 바꾸고 폼 바로 아래에 둔다.
- **목록 영역:** 폼 아래에 둔다.
  - 목록 제목(h3)
  - `<ul class="gb-list">`
  - 더보기 버튼
  - 상태 문구(불러오는 중, 글이 없을 때, 오류와 다시 시도)
- **JS가 꺼졌을 때:** 목록과 폼을 숨기고, JS가 필요하다는 짧은 안내만 보여 준다. 웹 앱은 JSON만 돌려주므로 일반 폼 전송 폴백은 두지 않는다.
- **문구 위치:** 새 화면 문구는 모두 `<template id="ui-text">`나 마크업에 둔다(코드 파일 한국어 금지 규칙).

### 6-2. `script.js` (`initGuestbook` 다시 쓰기)
- **불러오는 시점:** 방명록 섹션이 화면 한 개 거리 안에 들어오면 첫 페이지(20건)를 불러온다. 카카오맵 지연 로딩(`initVenueMap`)과 같은 방식이다. 그 전에는 `script.google.com` 요청이 0건이어야 한다.
- **렌더링:** 항목마다 성함, 날짜, 말씀, 삭제 버튼을 둔다.
  - 모든 글은 `textContent`로 넣는다(`innerHTML` 금지, XSS 방지).
  - 말씀의 줄바꿈은 CSS `white-space: pre-line`으로 살린다.
  - 날짜는 KST 기준 "2026. 12. 1." 형식으로 보여 준다.
- **새 글**
  - 입력값 검증은 지금 방식(`aria-invalid`, 첫 오류 칸에 포커스)을 그대로 쓰고, 비밀번호 칸 검증을 더한다.
  - 전송에 성공하면 응답의 `entry`를 목록 맨 위에 넣고, 입력칸을 비우고, `role="status"`로 알린다.
  - `entry`가 `null`이면(봇으로 판단해 버린 경우) 목록에 넣지 않는다.
  - `elapsed`는 폼이 처음 화면에 보인 시각부터 잰다.
- **본인 삭제**
  - 항목의 "삭제" 버튼을 누르면 그 항목 안에 비밀번호 입력칸과 확인·취소 버튼이 펼쳐진다. 브라우저 `prompt()`는 쓰지 않는다.
  - 성공하면 항목을 지우고, 포커스를 다음 항목이나 목록 제목으로 옮기고, 결과를 알린다.
  - 실패하면 오류 종류(`wrong_password`, `too_many_attempts` 등)에 맞는 문구를 입력칸 아래에 보여 준다.
- **더보기:** `nextCursor`가 있을 때만 보인다. 누르면 다음 20건을 이어 붙이고, 새로 붙은 첫 항목으로 포커스를 옮긴다.
- **오류 처리:** 네트워크 오류나 `ok: false`이면 상태 문구와 "다시 시도" 버튼을 보여 준다. 15초 안에 응답이 없으면 실패로 본다.

### 6-3. `style.css`
감사 문서(`07_concept-director_design-audit.md`)의 통일 규칙 R1~R9를 따른다.
- **목록 모양:** 계좌 카드처럼 카드로 감싸지 않는다. 교통편 목록과 같은 구분선 목록으로 둔다.
- **글자 역할**
  - 성함: 라벨 역할(Pretendard 600 14px, sage_deep)
  - 날짜: 보조 정보 역할(muted)
  - 말씀: 정보 값 역할(Pretendard 400 14px/1.7, text)
- **버튼**
  - 삭제 버튼: 작은 텍스트 버튼으로 하되 터치 영역은 44x44 이상으로 둔다.
  - 더보기 버튼: secondary 꽉 찬 폭이다.
- **새 항목 모션:** `opacity 0→1` 250ms(`--dur-modal`, `--ease-out`)로 나타나고, reduced-motion에서는 즉시 보인다. 높이 애니메이션은 쓰지 않는다.

## 7. 카피 (copy-writer가 쓸 항목)

| 키(예시) | 용도 |
|---|---|
| `guestbook_note` | 공개 안내. "남겨 주신 글은 이 페이지에 공개됩니다. 비밀번호는 글을 지울 때 필요합니다." 취지 |
| 비밀번호 라벨과 도움말 | 폼 입력칸 |
| 목록 제목 | 예: "남겨 주신 말씀" |
| `gb-list-empty` | 아직 글이 없을 때 |
| `gb-list-loading`, `gb-list-failed`, 다시 시도 버튼 | 목록 불러오기 상태 |
| 더보기 버튼 | 다음 20건 |
| 삭제 버튼, 확인·취소, 삭제 성공 | 본인 삭제 흐름 |
| `wrong_password`, `too_many_attempts`, `not_found`, `rate_limited`, `duplicate`, `closed` 안내 | 서버 오류별 문구 |
| 삭제 버튼 접근성 이름 | 예: "{성함}님의 글 삭제" |
| JS가 꺼졌을 때 안내 | 6-1 참고 |

- 지금 카피 시트 `guestbook_note` 아래의 메모("목록을 공개하는 구조로 바꾸면 이 줄을 뺀다")대로 기존 안내 줄을 지운다.

## 8. 착수 순서 (하네스 단계)

1. **사용자 준비** (약 20~30분, 사용자만 할 수 있음)
   1. Google 시트를 만들고 시트 이름을 `entries`로 정한 뒤, 첫 행에 3장의 열 이름을 넣는다.
   2. 시트에서 [확장 프로그램 > Apps Script]를 열고 5장의 코드를 붙여 넣는다. 프로젝트 시간대는 `Asia/Seoul`로 한다.
   3. [프로젝트 설정 > 스크립트 속성]에 `NOTIFY_EMAIL`, `MAIL_SUBJECT`를 넣는다.
   4. [배포 > 새 배포 > 웹 앱]에서 실행 계정을 "나", 액세스 권한을 "모든 사용자"로 정하고 배포한다. 권한 승인 창(시트, 메일)이 뜨면 승인한다.
   5. 웹 앱 URL(`…/exec`)을 알려 준다.
   6. QA용으로 시트와 스크립트를 한 벌 더 복사해 시험용 URL도 만든다. 실제 방명록에 시험 글이 쌓이지 않게 하기 위해서다.
2. **copy-writer:** 7장 문구를 카피 시트에 쓴다.
3. **motion-designer:** 새 항목 모션과 삭제 펼침 모션을 모션 명세에 짧게 더한다(6-3 기준).
4. **frontend-developer:** 6장 구현을 하고, 시험용 URL로 연결해 확인한다.
5. **invitation-qa:** 시험용 URL로 아래를 확인한다.
   - 쓰기·목록·더보기·삭제(맞는 비밀번호, 틀린 비밀번호, 시도 제한)
   - 함정 칸과 빠른 제출이 저장되지 않는지
   - XSS 문자열(`<img onerror>` 등)이 글자로만 보이는지
   - 메일 알림
   - 지연 로딩(첫 화면 요청 0건)
   - 접근성, reduced-motion, JS 비활성, 360~430px 가로 스크롤
   - 다른 섹션 회귀
6. **실제 URL로 교체:** 시험용 URL을 실제 URL로 바꿔 커밋하고 push한다. 그 뒤 시험용 시트는 지우고, Formspree 폼은 Formspree 대시보드에서 비활성화한다.

## 9. 바꾸게 될 파일

| 파일 | 내용 |
|---|---|
| `index.html` | 방명록 섹션 마크업, `<meta name="guestbook-endpoint">`, `ui-text` 문구 |
| `script.js` | `initGuestbook` 다시 쓰기, 목록 렌더링, 삭제 흐름 |
| `style.css` | 목록·삭제 펼침·더보기 스타일 |
| `apps-script/guestbook.gs` (새 파일) | 웹 앱 코드 원본 |
| `_workspace/02`, `04`, `05`, `06` | 카피, 모션, 구현 요약, QA 기록 |

## 10. 착수 전 확인

1. **메일 알림 방식:** 결정은 "메일 알림 유지"다. 이 문서는 알림을 Apps Script `MailApp`으로 옮기는 안을 기본으로 했다. 요청을 한 번만 보내면 되고, 저장과 알림이 따로 실패하는 일이 없기 때문이다. Formspree를 그대로 함께 쓰고 싶다면 착수할 때 정한다. 그 경우 브라우저가 Apps Script와 Formspree에 요청을 두 번 보내야 한다.
2. **이미 받은 글:** Formspree에 이미 들어온 방명록 글이 있다면, 새 목록에 옮겨 보여 줄지 정한다. 옮긴다면 비밀번호가 없으므로 그 글은 두 사람만 시트에서 지울 수 있다.
3. **예식 뒤 운영:** 방명록을 언제까지 열어 둘지 정한다. 닫을 때는 스크립트 속성 `CLOSED=true`로 새 글만 막고 목록은 계속 보여 준다.
4. **Google 계정 한도:** 개인 Gmail 계정의 `MailApp` 발송 한도는 하루 100통이다. 결혼식 무렵 하루에 글이 100건을 넘으면 그 뒤 알림은 빠진다. 글 저장에는 영향이 없다.
5. **배포 갱신:** 코드를 고칠 때는 [배포 관리 > 수정 > 새 버전]으로 갱신한다. 새 배포를 만들면 URL이 바뀌어 `index.html`도 고쳐야 한다.
