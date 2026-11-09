/**
 * innerlab.survey — Google Apps Script receiver.
 * Paste into Extensions > Apps Script of the DESTINATION Google Sheet.
 * Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 * Then paste your /exec URL into GOOGLE_SCRIPT_URL in index.html.
 *
 * IMPORTANT: Public anonymous endpoint can receive spam.
 * Apps Script + no-cors cannot acknowledge success reliably to the website.
 */
const SHEET_NAME = 'Responses';
const COLUMNS = [
  'submitted_at','survey_version','age','occupation','focus','usage',
  'ai_uses','ai_feeling','skills','barriers','wish','topics','format',
  'course_interest','course_interest_other','time','contact_optin','full_name','contact','consent'
];
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Empty request');
    const data = JSON.parse(e.postData.contents);
    if (data.consent !== true) throw new Error('Consent required');
    if (!data.age || !data.occupation || !data.usage) throw new Error('Missing required fields');
    if (data.course_interest === 'Khác (vui lòng ghi rõ lý do)' && !data.course_interest_other) throw new Error('Other reason required');
    if (data.contact_optin === 'Có, tôi muốn nhận voucher và thông tin khóa học' && (!data.full_name || !data.contact)) throw new Error('Contact details required for voucher');
    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
    // Existing surveys may have older headers. Reconcile by header name to avoid misaligned columns.
    const existing = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const missing = COLUMNS.filter(key => !existing.includes(key));
    if (missing.length) sheet.getRange(1, existing.length+1, 1, missing.length).setValues([missing]);
    const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const optin = data.contact_optin === 'Có, tôi muốn nhận voucher và thông tin khóa học';
    const row = headers.map(key => {
      let v = (!optin && ['full_name','contact'].includes(key)) ? '' : data[key];
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
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}
