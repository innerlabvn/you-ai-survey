/**
 * innerlab.survey — Google Apps Script receiver.
 * Paste into Extensions > Apps Script of the DESTINATION Google Sheet.
 * Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 * Then paste your /exec URL into GOOGLE_SCRIPT_URL in index.html.
 *
 * IMPORTANT: Public anonymous endpoint can receive spam.
 * Apps Script + no-cors cannot acknowledge success reliably to the website.
 */
const SPREADSHEET_ID = '1CmMUyDdWf5dZvGUGGhldjN1eEfzs6INawZkhoIXJcQc';
const SHEET_NAME = 'Responses';

/** Explicit destination: works for both standalone and sheet-bound Apps Script projects. */
function getResponseSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/** Run directly once in Apps Script to verify permission and destination. */
function testConnection() {
  const book = getResponseSpreadsheet_();
  const sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Responses tab not found in destination spreadsheet');
  Logger.log('CONNECTED: ' + book.getName() + ' / ' + sheet.getName() + ', data rows: ' + Math.max(0, sheet.getLastRow() - 1));
}

/** Lightweight public readiness check; does not expose participants or Sheet ID. */
function doGet(e) {
  try {
    const book = getResponseSpreadsheet_();
    const ready = !!book.getSheetByName(SHEET_NAME);
    return ContentService.createTextOutput(JSON.stringify({ok: ready, status: ready ? 'ready' : 'missing_responses_sheet'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Innerlab readiness check: ' + String(error));
    return ContentService.createTextOutput(JSON.stringify({ok:false,status:'spreadsheet_access_error'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

const COLUMNS = [
  'submitted_at','survey_version','age','occupation','focus','usage',
  'ai_uses','ai_feeling','skills','barriers','wish','topics','format',
  'course_interest','course_interest_other','time','gift_box','reward_code','reward_status','expert_field','preferred_course','contact_optin','full_name','contact','consent'
];
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Empty request');
    const data = JSON.parse(e.postData.contents);
    if (data.consent !== true) throw new Error('Consent required');
    const rewardCode = String(data.reward_code || '').trim();
    // Accept five-digit codes going forward and legacy IL-XXXX-... codes previously issued.
    if (!/^(?:[0-9]{5}|IL-(?:[A-HJ-NP-Z2-9]{4}-){3}[A-HJ-NP-Z2-9]{4})$/.test(rewardCode)) throw new Error('Invalid reward code');
    if (!data.age || !data.occupation || !data.usage) throw new Error('Missing required fields');
    if (data.course_interest === 'Khác (vui lòng ghi rõ lý do)' && !data.course_interest_other) throw new Error('Other reason required');
    if (data.contact_optin === 'Có, tôi muốn nhận voucher và thông tin khóa học' && (!data.full_name || !data.contact)) throw new Error('Contact details required for voucher');
    // `contact` is now exclusively a Vietnam mobile / Zalo number (kept for Sheet compatibility).
    const phone = String(data.contact || '').replace(/[\s().-]/g, '');
    if (data.contact_optin === 'Có, tôi muốn nhận voucher và thông tin khóa học' && !/^(?:0[35789]\d{8}|\+84[35789]\d{8})$/.test(phone)) throw new Error('Invalid Vietnam mobile / Zalo number');
    lock.waitLock(10000);
    const spreadsheet = getResponseSpreadsheet_();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
    // Existing surveys may have older headers. Reconcile by header name to avoid misaligned columns.
    const existing = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const missing = COLUMNS.filter(key => !existing.includes(key));
    if (missing.length) sheet.getRange(1, existing.length+1, 1, missing.length).setValues([missing]);
    const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const optin = data.contact_optin === 'Có, tôi muốn nhận voucher và thông tin khóa học';
    // Five-digit codes are short and may collide. Do NOT drop someone's registration on collision.
    // Keep the submitted code as text and flag it for staff to reissue a distinct code.
    const codeColumn = headers.indexOf('reward_code') + 1;
    const statusColumn = headers.indexOf('reward_status') + 1;
    let duplicateCode = false;
    if (optin && codeColumn && sheet.getLastRow() > 1) {
      const existingRows = sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues();
      duplicateCode = existingRows.some(row =>
        String(row[codeColumn - 1]).trim() === rewardCode &&
        (!statusColumn || String(row[statusColumn - 1]) !== 'Không đăng ký nhận quà')
      );
    }
    const row = headers.map(key => {
      let v = (!optin && ['full_name','contact'].includes(key)) ? '' : data[key];
      if (key === 'reward_code') v = rewardCode;
      if (key === 'reward_status') v = !optin ? 'Không đăng ký nhận quà' : duplicateCode ? 'Mã trùng - cần cấp lại' : 'Chờ xác nhận nhận quà';
      if (Array.isArray(v)) v = v.join(' | ');
      if (typeof v === 'boolean') v = String(v);
      if (v == null) v = '';
      // Prevent spreadsheet formula injection.
      const str = String(v).slice(0,5000);
      return /^[=+\-@]/.test(str) ? "'" + str : str;
    });
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error('Innerlab data write failure: ' + String(err));
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}
