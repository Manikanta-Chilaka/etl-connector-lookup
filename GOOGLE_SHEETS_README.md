# Google Sheets Integration Setup

Follow these steps to connect your form to a Google Sheet.

## 1. Create the Google Sheet

1.  Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2.  Name it something like **"ETL Connector Requests"**.
3.  In **Sheet1**, add the following headers to the first row (A1 to N1):

| Column | Header Name |
| :--- | :--- |
| A | **Request ID** |
| B | **Request Date** |
| C | **Requester Name** |
| D | **Project / SOL** |
| E | **Business Need** |
| F | **Desired Outcome** |
| G | **Source System** |
| H | **Target System** |
| I | **Frequency** |
| J | **Frequency Other** |
| K | **Transformations** |
| L | **Transformations Other** |
| M | **File Name** |
| N | **Error Handling** |

## 2. Add the Script

1.  In your Google Sheet, go to **Extensions** > **Apps Script**.
2.  Delete any code in the `Code.gs` file and paste the following script:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('Sheet1');

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var data = JSON.parse(e.postData.contents);

    var newRow = headers.map(function(header) {
      switch(header) {
        case 'Request ID': return data.requestId;
        case 'Request Date': return data.requestDate;
        case 'Requester Name': return data.requesterName;
        case 'Project / SOL': return data.requesterProjectSol;
        case 'Business Need': return data.businessNeedJustification;
        case 'Desired Outcome': return data.desiredOutcomeBusinessValue;
        case 'Source System': return data.sourceSystem;
        case 'Target System': return data.targetSystem;
        case 'Frequency': return data.integrationFrequency;
        case 'Frequency Other': return data.integrationFrequencyOther;
        case 'Transformations': return Array.isArray(data.dataTransformationRequirements) ? data.dataTransformationRequirements.join(', ') : data.dataTransformationRequirements;
        case 'Transformations Other': return data.dataTransformationOther;
        case 'File Name': return data.uploadedFileName;
        case 'Error Handling': return data.errorHandlingMonitoring;
        default: return '';
      }
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3.  Click the **Save** icon (floppy disk).

## 3. Deploy the Web App

1.  Click the **Deploy** button (top right) > **New deployment**.
2.  Click the **Select type** gear icon > **Web app**.
3.  Fill in the details:
    *   **Description**: "ETL Form Backend"
    *   **Execute as**: **Me** (your email)
    *   **Who has access**: **Anyone** (This is important so the React app can access it without login prompts)
4.  Click **Deploy**.
5.  Authorize the script if prompted (Click "Review permissions" > Choose account > Advanced > Go to (unsafe) > Allow).
6.  **Copy the Web App URL** (it ends in `/exec`).

## 4. Connect to React App

1.  Open `src/App.jsx` in your project.
2.  Find the `GOOGLE_SCRIPT_URL` constant (or the `handleSubmit` function).
3.  Paste your Web App URL there.
