// Guestbook web app: list / create / delete entries in the "entries" sheet.
// Columns: A id, B createdAt, C name, D message, E salt, F passwordHash, G status, H deletedAt.
// Script properties: NOTIFY_EMAIL, MAIL_SUBJECT, CLOSED ("true" stops new entries).
const SHEET = 'entries';
const COL = { ID: 0, CREATED_AT: 1, NAME: 2, MESSAGE: 3, SALT: 4, HASH: 5, STATUS: 6 };
const LIMITS = { NAME: 40, MESSAGE: 500, PW_MIN: 4, PW_MAX: 20, PAGE_MAX: 50, ID_MAX: 64 };
const MIN_ELAPSED_MS = 3000;
const WRITES_PER_MINUTE = 20;
const DUPLICATE_WINDOW_S = 600;
const DELETE_TRIES = 5;
const DELETE_TRIES_WINDOW_S = 600;
const LOCK_WAIT_MS = 10000;
const CACHE_LIST_KEY = 'list';
const CACHE_TTL_S = 60;

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'list') return json(list(p.limit, p.cursor));
    return json({ ok: false, error: 'unknown_action' });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server' });
  }
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

// A leading apostrophe stores the value as plain text, so "=…" never becomes a formula and
// "2026-12-01" never becomes a date. Sheets strips the apostrophe when the value is read back.
function asText(s) { return "'" + s; }

function toInt(value, fallback) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

function visibleEntries() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get(CACHE_LIST_KEY);
  if (hit) return JSON.parse(hit);
  const rows = sheet().getDataRange().getValues().slice(1); // skip header row
  // A hand-edited row without an id or a readable date is skipped, so it cannot fail the whole list.
  const entries = rows
    .filter((r) => r[COL.STATUS] === 'visible' && r[COL.ID] && !isNaN(new Date(r[COL.CREATED_AT])))
    .map((r) => ({
      id: String(r[COL.ID]),
      createdAt: new Date(r[COL.CREATED_AT]).toISOString(),
      name: String(r[COL.NAME]),
      message: String(r[COL.MESSAGE]),
    }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  try {
    cache.put(CACHE_LIST_KEY, JSON.stringify(entries), CACHE_TTL_S);
  } catch (err) {
    console.warn(err); // values over 100KB are rejected; serve uncached instead
  }
  return entries;
}

function list(limit, cursor) {
  const all = visibleEntries();
  const size = Math.min(Math.max(toInt(limit, 20), 1), LIMITS.PAGE_MAX);
  const start = Math.max(toInt(cursor, 0), 0);
  const page = all.slice(start, start + size);
  const next = start + size < all.length ? start + size : null;
  return { ok: true, entries: page, nextCursor: next };
}

function clean(s, max) {
  return String(s || '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    .replace(/\n{3,}/g, '\n\n').trim().slice(0, max + 1);
}

function hash(salt, password) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password, Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}

function create(b) {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('CLOSED') === 'true') return { ok: false, error: 'closed' };
  if (b.website || !(Number(b.elapsed) >= MIN_ELAPSED_MS)) return { ok: true, entry: null }; // silent drop for bots
  const name = clean(b.name, LIMITS.NAME);
  const message = clean(b.message, LIMITS.MESSAGE);
  const password = String(b.password || '');
  if (!name || name.length > LIMITS.NAME || !message || message.length > LIMITS.MESSAGE
      || password.length < LIMITS.PW_MIN || password.length > LIMITS.PW_MAX) return { ok: false, error: 'invalid' };

  const cache = CacheService.getScriptCache();
  const minuteKey = 'rate:' + Math.floor(Date.now() / 60000);
  const dupKey = 'dup:' + hash('', name + '\n' + message);

  const lock = LockService.getScriptLock();
  lock.waitLock(LOCK_WAIT_MS);
  let id, now;
  try {
    const count = Number(cache.get(minuteKey) || 0);
    if (count >= WRITES_PER_MINUTE) return { ok: false, error: 'rate_limited' };
    if (cache.get(dupKey)) return { ok: false, error: 'duplicate' };
    id = Utilities.getUuid();
    now = new Date();
    const salt = Utilities.getUuid();
    sheet().appendRow([asText(id), now, asText(name), asText(message), asText(salt), asText(hash(salt, password)), 'visible', '']);
    cache.put(minuteKey, String(count + 1), 120);
    cache.put(dupKey, '1', DUPLICATE_WINDOW_S);
    cache.remove(CACHE_LIST_KEY);
  } finally {
    lock.releaseLock();
  }
  notify(props, name, message, now); // outside the lock so a slow mail never holds up other writes
  return { ok: true, entry: { id, name, message, createdAt: now.toISOString() } };
}

function remove(b) {
  const id = typeof b.id === 'string' ? b.id : '';
  if (!id || id.length > LIMITS.ID_MAX) return { ok: false, error: 'not_found' };
  const cache = CacheService.getScriptCache();
  const triesKey = 'del:' + id;

  const lock = LockService.getScriptLock();
  lock.waitLock(LOCK_WAIT_MS);
  try {
    const tries = Number(cache.get(triesKey) || 0);
    if (tries >= DELETE_TRIES) return { ok: false, error: 'too_many_attempts' };
    const sh = sheet();
    const rows = sh.getDataRange().getValues();
    const i = rows.findIndex((r, k) => k > 0 && String(r[COL.ID]) === id && r[COL.STATUS] === 'visible');
    if (i < 0) return { ok: false, error: 'not_found' };
    // Rows copied in by hand have no hash, so only the couple can hide them from the sheet.
    if (!rows[i][COL.HASH] || hash(String(rows[i][COL.SALT]), String(b.password || '')) !== String(rows[i][COL.HASH])) {
      cache.put(triesKey, String(tries + 1), DELETE_TRIES_WINDOW_S);
      return { ok: false, error: 'wrong_password' };
    }
    sh.getRange(i + 1, COL.STATUS + 1, 1, 2).setValues([['deleted', new Date()]]);
    cache.remove(CACHE_LIST_KEY);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function notify(props, name, message, createdAt) {
  const to = props.getProperty('NOTIFY_EMAIL');
  if (!to) return;
  const when = Utilities.formatDate(createdAt, 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  try {
    MailApp.sendEmail({ to, subject: props.getProperty('MAIL_SUBJECT') || 'Guestbook', body: name + '\n' + when + '\n\n' + message });
  } catch (err) {
    console.error(err); // a mail failure must not fail the saved entry
  }
}
