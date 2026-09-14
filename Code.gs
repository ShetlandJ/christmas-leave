// Christmas leave grid — Google Apps Script backend.
// Sheet tab "Grid": row 1 = dates (B1 onward), column A = names (A2 down), body cells = "OFF" or blank.

var TAB = 'Grid';
var TOKENS_TAB = 'Tokens';
var OFF = 'OFF';

var SITE = 'https://shetlandj.github.io/christmas-leave/';

// GET ?json=1 -> grid as JSON (used by the site). Plain GET -> bounce to the site.
function doGet(e) {
  if (e && e.parameter && e.parameter.json) {
    var grid = getGrid();
    grid.me = tokens_()[String(e.parameter.token || '')] || null;
    return json_(grid);
  }
  return HtmlService.createHtmlOutput(
    '<meta http-equiv="refresh" content="0; url=' + SITE + '">' +
    '<p style="font:15px sans-serif;padding:16px">Redirecting to <a href="' + SITE + '">' + SITE + '</a></p>'
  );
}

// POST body: {"token":"<uuid>","date":"Mon 21 Dec","off":true}
// The token decides whose row is written. Nobody can edit anyone else's.
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var name = tokens_()[String(body.token || '')];
    if (!name) throw new Error('Unknown link. Use the one you were sent.');
    setOff(name, body.date, !!body.off);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB);
  if (!s) throw new Error('No tab called "' + TAB + '"');
  return s;
}

// Tokens tab: Name | Token | Link. Every name in Grid gets a UUID the first time this runs.
// Mam sends each person their Link. Returns {token: name}.
function tokens_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var t = ss.getSheetByName(TOKENS_TAB);
  if (!t) {
    t = ss.insertSheet(TOKENS_TAB);
    t.appendRow(['Name', 'Token', 'Link']);
    t.setFrozenRows(1);
  }
  var names = sheet_().getDataRange().getValues().slice(1)
    .map(function (r) { return String(r[0]).trim(); })
    .filter(Boolean);
  var rows = t.getDataRange().getValues();
  var have = {};
  var map = {};
  rows.forEach(function (r) {
    var n = String(r[0]).trim(), tok = String(r[1]).trim();
    if (n && tok && n !== 'Name') { have[n] = tok; map[tok] = n; }
  });
  var missing = names.filter(function (n) { return !have[n]; });
  if (missing.length) {
    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      var fresh = missing.map(function (n) {
        var tok = Utilities.getUuid();
        map[tok] = n;
        return [n, tok, SITE + '#' + tok];
      });
      t.getRange(t.getLastRow() + 1, 1, fresh.length, 3).setValues(fresh);
    } finally {
      lock.releaseLock();
    }
  }
  return map;
}

function getGrid() {
  var values = sheet_().getDataRange().getValues();
  if (values.length < 2 || values[0].length < 2) {
    return { dates: [], names: [], off: [] };
  }
  var tz = Session.getScriptTimeZone();
  var header = values[0].slice(1);
  var dates = header.map(function (d) {
    if (d instanceof Date) {
      return {
        label: Utilities.formatDate(d, tz, 'EEE d MMM'),
        weekend: d.getDay() === 0 || d.getDay() === 6
      };
    }
    return { label: String(d), weekend: false };
  });
  var names = [];
  var off = [];
  for (var r = 1; r < values.length; r++) {
    var name = String(values[r][0]).trim();
    if (!name) continue;
    names.push(name);
    off.push(header.map(function (_, c) {
      return String(values[r][c + 1]).trim().toUpperCase() === OFF;
    }));
  }
  return { dates: dates, names: names, off: off };
}

// name-based so row/col shifts in the sheet don't misfire.
// Sets an explicit state rather than toggling, so rapid taps converge on the last one.
function setOff(name, dateLabel, off) {
  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    var s = sheet_();
    var values = s.getDataRange().getValues();
    var tz = Session.getScriptTimeZone();
    var col = -1;
    for (var c = 1; c < values[0].length; c++) {
      var d = values[0][c];
      var label = d instanceof Date ? Utilities.formatDate(d, tz, 'EEE d MMM') : String(d);
      if (label === dateLabel) { col = c; break; }
    }
    var row = -1;
    for (var r = 1; r < values.length; r++) {
      if (String(values[r][0]).trim() === name) { row = r; break; }
    }
    if (row < 0 || col < 0) throw new Error('Cell not found for ' + name + ' / ' + dateLabel);
    s.getRange(row + 1, col + 1).setValue(off ? OFF : '');
  } finally {
    lock.releaseLock();
  }
  return true;
}
