// Christmas leave grid — Google Apps Script backend.
// Sheet tab "Grid": row 1 = dates (B1 onward), column A = names (A2 down), body cells = "OFF" or blank.

var TAB = 'Grid';
var OFF = 'OFF';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Christmas leave')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function sheet_() {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB);
  if (!s) throw new Error('No tab called "' + TAB + '"');
  return s;
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
function toggle(name, dateLabel) {
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
    var cell = s.getRange(row + 1, col + 1);
    var isOff = String(cell.getValue()).trim().toUpperCase() === OFF;
    cell.setValue(isOff ? '' : OFF);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  return getGrid();
}
