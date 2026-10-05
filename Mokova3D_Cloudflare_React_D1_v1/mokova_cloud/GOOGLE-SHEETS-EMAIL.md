# Google Sheets + Email integration

Use a Google Apps Script Web App as the single free integration endpoint. The Worker sends enquiry JSON to `GOOGLE_APPS_SCRIPT_URL`.

1. Create a Google Sheet named `Mokova Enquiries`.
2. Extensions → Apps Script.
3. Paste the script below and set `SHEET_ID`, `TO_EMAIL`.
4. Deploy → New deployment → Web app → Execute as you → Who has access: Anyone.
5. Put the Web App URL into a Cloudflare Worker secret/variable named `GOOGLE_APPS_SCRIPT_URL`.

```js
const SHEET_ID='YOUR_SHEET_ID';
const TO_EMAIL='your@email.com';
function doPost(e){
  const d=JSON.parse(e.postData.contents||'{}');
  const sh=SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if(sh.getLastRow()===0)sh.appendRow(['Date','Name','Phone','Email','Product','Message','Source']);
  sh.appendRow([new Date(),d.name||'',d.phone||'',d.email||'',d.product||'',d.message||'',d.source||'website']);
  MailApp.sendEmail(TO_EMAIL,'New Mokova enquiry',`Name: ${d.name||''}\nPhone: ${d.phone||''}\nEmail: ${d.email||''}\nProduct: ${d.product||''}\nMessage: ${d.message||''}`);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
```

The database remains the source of truth; Google Sheets/email are notification/backup channels.
