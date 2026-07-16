/**
 * ============================================================
 *  Isabel & Nathan — Wedding Backend (Google Apps Script)
 *  Handles: RSVP submissions → "RSVPs" sheet
 *           Honeymoon fund → "Fund" sheet (percent only)
 *  Setup instructions: see README.md, Section 2.
 * ============================================================
 */

var RSVP_SHEET = "RSVPs";
var FUND_SHEET = "Fund";

/** Handles RSVP form submissions from the website. */
function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000); // avoid clashing writes if two guests submit at once

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(RSVP_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(RSVP_SHEET);
      sheet.appendRow(["Timestamp", "Name", "Email", "Attending", "Party Count", "Song Request"]);
      sheet.setFrozenRows(1);
    }

    var p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      String(p.name || "").slice(0, 200),
      String(p.email || "").slice(0, 200),
      String(p.attending || "").slice(0, 60),
      String(p.count || "").slice(0, 4),
      String(p.song || "").slice(0, 300)
    ]);

    lock.releaseLock();
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Returns the honeymoon fund progress as a PERCENTAGE only.
 * Dollar amounts stay private in the sheet — the website
 * never sees them.
 *
 * Fund sheet layout:
 *   A1: "Goal"    B1: 5500
 *   A2: "Raised"  B2: (update this as Venmo contributions arrive)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "";
  if (action !== "fund") {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, service: "pushingP" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(FUND_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(FUND_SHEET);
    sheet.getRange("A1").setValue("Goal");
    sheet.getRange("B1").setValue(5500);
    sheet.getRange("A2").setValue("Raised");
    sheet.getRange("B2").setValue(0);
  }

  var goal = Number(sheet.getRange("B1").getValue()) || 1;
  var raised = Number(sheet.getRange("B2").getValue()) || 0;
  var percent = Math.round(Math.min(100, Math.max(0, (raised / goal) * 100)));

  return ContentService
    .createTextOutput(JSON.stringify({ percent: percent }))
    .setMimeType(ContentService.MimeType.JSON);
}
