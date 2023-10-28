function onFormSubmit(res) {
  // 1. generate ID and QR
  // 1.1 get the latest record in the spreadsheet
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getActiveSheet();
  const lrowIndex = sh.getLastRow();

  // 1.2 generate unique ID
  const id = Utilities.getUuid();
  const qrData = lrowIndex + "_" + id;
  const qrRawUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${qrData}`;
  const qrUrl = `=IMAGE("https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="&ENCODEURL("${qrData}"))`;


  const lrowData = sh.getRange(`B${lrowIndex}:C${lrowIndex}`).getValues();
  // 1.3 update Id and QR to this row
  sh.getRange("D" + lrowIndex + ":D" + lrowIndex).setValue(id);
  sh.getRange("E" + lrowIndex + ":E" + lrowIndex).setFormula(qrUrl);
  // 2. build email template
  // 2.1 get email template
  const rowObject = {
    userEmail: lrowData[0][0],
    userName: lrowData[0][1],
    qr: ""
  }
  var htmlTemplate = HtmlService.createTemplateFromFile("EmailTemplate.html");
  // 2.2 build object to bind in template
  htmlTemplate.ticket = rowObject;
  var htmlBody = htmlTemplate.evaluate().getContent();
  var inlineImages = {};
  inlineImages["qr"] = UrlFetchApp.fetch(qrRawUrl).getBlob();
  // 3. send mail
  try {
    MailApp.sendEmail({
      to: rowObject.userEmail,
      subject: `QR Check-in Event - Ticket Infor - ${rowObject.userName}`,
      htmlBody: htmlBody,
      inlineImages: inlineImages
    });
    sh.getRange("F" + lrowIndex + ":F" + lrowIndex).setValue("X");
  } catch(ex) {
    sh.getRange("F" + lrowIndex + ":F" + lrowIndex).setValue(ex.toString());
  }
  
}
