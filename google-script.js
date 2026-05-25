/**
 * Google Apps Script Webhook for Digi Presence Contact Form
 * 
 * Instructions for deploying:
 * 1. Go to https://script.google.com/ and create a new project.
 * 2. Paste this entire code into the script editor (Code.gs).
 * 3. Save the project (e.g., "Digi Presence Solutions CRM").
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy" and copy the "Web app URL" (it starts with https://script.google.com/macros/s/...).
 * 9. Paste that URL into the javascript file in your website (in contact.html or animations.js).
 */

const SHEET_NAME = "website";
const NOTIFY_EMAIL = "contact@digipresence.in"; // Your email to receive notifications

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Business Name", "Contact Person Name", "Contact Number", "Email ID", "Requirements"]);
    sheet.getRange("A1:F1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    const data = JSON.parse(e.postData.contents);
    
    const businessName = data.businessName || "N/A";
    const contactName = data.contactName || "N/A";
    const contactNumber = data.contactNumber || "N/A";
    const email = data.email || "N/A";
    const requirements = data.requirements || "N/A";
    const timestamp = new Date();

    sheet.appendRow([timestamp, businessName, contactName, contactNumber, email, requirements]);

    // Send email notification
    const subject = `New Digi Presence Lead: ${businessName}`;
    const body = `
      New inquiry from Digi Presence!
      
      Business Name: ${businessName}
      Contact Person: ${contactName}
      Phone: ${contactNumber}
      Email: ${email}
      
      Requirements:
      ${requirements}
    `;
    
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Lead captured successfully" }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle preflight requests for CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
