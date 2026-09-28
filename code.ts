function doGet(e: any) {
  try {
    // You can hardcode the Sheet ID here, or just use SpreadsheetApp.getActiveSpreadsheet()
    // if the script is bound to the spreadsheet. 
    // We'll use the ID you provided to be safe.
    const sheetId = "1TUpjndpM5HCyO02agpo8LPAiY5h3SiIjGlec-kEw4rg";
    const doc = SpreadsheetApp.openById(sheetId);
    
    // Identify which form was submitted (rsvp or wish)
    const formName = e.parameter.formName || "unknown";
    
    let sheetName = "";
    let headers: string[] = [];
    let rowData: any[] = [];
    const timestamp = new Date();

    if (formName === "rsvp") {
      sheetName = "RSVPs";
      headers = ["Timestamp", "Name", "Guests", "Dietary Notes"];
      rowData = [
        timestamp,
        e.parameter["Name"] || "",
        e.parameter["Guests"] || "",
        e.parameter["Dietary Notes"] || ""
      ];
    } else if (formName === "wish") {
      sheetName = "Wishes";
      headers = ["Timestamp", "Name", "Message"];
      rowData = [
        timestamp,
        e.parameter["Name"] || "",
        e.parameter["Message"] || ""
      ];
    } else {
      // Fallback for unknown forms
      sheetName = "Other Submissions";
      headers = ["Timestamp", "Raw Data"];
      rowData = [timestamp, JSON.stringify(e.parameter)];
    }

    // Try to get the sheet, or create it if it doesn't exist
    let sheet = doc.getSheetByName(sheetName);
    
    // Auto-generate sheet and headers if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      sheet.appendRow(headers);
      
      // Make headers bold and freeze the first row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Append the submitted data row
    sheet.appendRow(rowData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": rowData }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error: any) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// In case the frontend ever changes to POST requests
function doPost(e: any) {
  return doGet(e);
}
