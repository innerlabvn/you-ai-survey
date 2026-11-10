/**
 * INNERLAB COURSES — optional Google Sheets receiver for course-interest requests.
 * This is not a checkout or payment processor.
 *
 * Setup:
 * 1) Create a NEW private Google Sheet for course leads (not the survey sheet).
 * 2) Replace the spreadsheet ID below with that Sheet's ID.
 * 3) In that Sheet, Extensions > Apps Script, replace Code.gs with this file.
 * 4) Run testConnection once to approve read/write permission.
 * 5) Deploy > New deployment > Web app (Execute as: Me; Access: Anyone).
 * 6) Paste the /exec URL into COURSE_API_URL in app.js, commit and redeploy.
 *
 * CAUTION: A public anonymous web app can receive spam.
 * Browser fetch(mode:no-cors) cannot verify that Sheets saved the request.
 */
const COURSE_SPREADSHEET_ID = 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID';
const LEADS_TAB = 'CourseLeads';
const LEADS_COLUMNS = ['submitted_at','inquiry_code','full_name','contact','course_id','course_title','note','consent','site_version','record_type','status'];
const ALLOWED_COURSES = ['hieu-minh','tri-tue-cam-xuc','giao-tiep-tu-tin','hoc-tap-hieu-qua','dinh-huong-tuong-lai','ai-ung-dung'];

function courseSheet_() {
  if (!COURSE_SPREADSHEET_ID || COURSE_SPREADSHEET_ID.indexOf('REPLACE_') === 0)
    throw new Error('Set COURSE_SPREADSHEET_ID first');
  const ss = SpreadsheetApp.openById(COURSE_SPREADSHEET_ID);
  let tab = ss.getSheetByName(LEADS_TAB);
  if (!tab) tab = ss.insertSheet(LEADS_TAB);
  if (tab.getLastRow() === 0) tab.appendRow(LEADS_COLUMNS);
  return tab;
}
function testConnection() {
  const tab=courseSheet_();
  Logger.log('CONNECTED: ' + tab.getParent().getName()+' / '+tab.getName());
}
function doGet() {
  try { courseSheet_();return ContentService.createTextOutput(JSON.stringify({ok:true,status:'ready'})).setMimeType(ContentService.MimeType.JSON); }
  catch (error) { return ContentService.createTextOutput(JSON.stringify({ok:false,status:'not_ready'})).setMimeType(ContentService.MimeType.JSON); }
}
function doPost(e) {
  const lock=LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Empty request');
    const d=JSON.parse(e.postData.contents);
    if (d.record_type!=='course_inquiry'||d.consent!==true) throw new Error('Invalid inquiry or consent');
    if (typeof d.full_name!=='string'||!d.full_name.trim()||d.full_name.length>100) throw new Error('Invalid name');
    if (typeof d.contact!=='string'||d.contact.length>18||!/^(?:0[35789]\d{8}|\+84[35789]\d{8})$/.test(d.contact.replace(/[\s().-]/g,''))) throw new Error('Invalid phone');
    if (!ALLOWED_COURSES.includes(d.course_id)) throw new Error('Invalid course');
    if (typeof d.inquiry_code!=='string'||!/^IC-[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}$/.test(d.inquiry_code)) throw new Error('Invalid inquiry code');
    if (typeof d.note!=='string'||d.note.length>750) throw new Error('Invalid note');
    lock.waitLock(10000);
    const tab=courseSheet_();
    const headers=tab.getRange(1,1,1,tab.getLastColumn()).getValues()[0];
    LEADS_COLUMNS.filter(c=>!headers.includes(c)).forEach(c=>{tab.getRange(1,tab.getLastColumn()+1).setValue(c);headers.push(c);});
    const codeColumn=headers.indexOf('inquiry_code')+1;
    if (tab.getLastRow()>1 && tab.getRange(2,codeColumn,tab.getLastRow()-1,1).getValues().some(r=>r[0]===d.inquiry_code))
      throw new Error('Duplicate inquiry code');
    const row=headers.map(key=>{
      let value=key==='status'?'Mới':(d[key]==null?'':d[key]);
      if (typeof value==='boolean') value=String(value);
      const str=String(value).slice(0,1000);
      return /^[=+\-@]/.test(str)?"'"+str:str;
    });
    tab.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    console.error('Course lead write error: '+String(error));
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(error)})).setMimeType(ContentService.MimeType.JSON);
  } finally {try{lock.releaseLock()}catch(e){}}
}
