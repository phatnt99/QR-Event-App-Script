function doGet() {
  return HtmlService.createHtmlOutputFromFile('WebTemplate.html')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function handleQRCodeData(data) {
  let dataParts = data.split('_');
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getActiveSheet();
  const lrowData = sh.getRange(`C${dataParts[0]}:D${dataParts[0]}`).getValues();
  if (lrowData[0][1] == dataParts[1]) {
    sh.getRange(`G${dataParts[0]}:G${dataParts[0]}`).setValue('X');
    return `Xin chào ${lrowData[0][0]}! Bạn đã check-in thành công`
  } else {
    return "Rất tiếc! Không tìm thấy thông tin đăng kí của bạn."
  }
}
