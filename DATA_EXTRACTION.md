# Data Extraction Guide

This guide explains how to extract data from the `BODS.xlsx` file and generate the `src/data.js` file used by the application.

## Prerequisites

-   **Node.js**: Ensure Node.js is installed on your system.
-   **xlsx**: The SheetJS library is required to parse the Excel file.

## 🔄 Workflow Overview

1.  **Source**: `BODS.xlsx` (The Master Data)
2.  **Process**: `extract_data.js` (The Script)
3.  **Output**: `src/data.js` (The App Data)

> [!WARNING]
> **Do not edit `src/data.js` manually** if you plan to continue using the Excel file. Running the extraction script will **overwrite** any changes made directly to `src/data.js`. Always update the Excel file first, then run the script.


## Setup

1.  Open your terminal in the project root directory.
2.  Install the `xlsx` library (if not already installed):

    ```bash
    npm install xlsx
    ```

## Creating the Extraction Script

Create a new file named `extract_data.js` in the root of your project (next to `package.json`) and paste the following code:

```javascript
import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync } from 'fs';

// Configuration
const SOURCE_FILE = 'BODS.xlsx';
const OUTPUT_FILE = 'src/data.js';

try {
  console.log(`Reading ${SOURCE_FILE}...`);
  
  // 1. Read the Excel file
  const buf = readFileSync(SOURCE_FILE);
  const workbook = XLSX.read(buf);

  // 2. Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // 3. Convert sheet to JSON
  const rawData = XLSX.utils.sheet_to_json(sheet);

  // 4. Map Excel Columns to App Schema
  // Adjust the column names below if the Excel header names change
  const mappedData = rawData.map(row => ({
    etlTool: row['ETL Tool '] || 'SAP BODS', // Note: Handles potential trailing space in header
    source: row['SOURCE'],
    sourceConnector: row['SOURCE_CONNECTOR'],
    sourceProtocol: row['SOURCE_PROTOCOL'],
    target: row['TARGET'],
    targetConnector: row['TARGET_CONNECTOR'],
    targetProtocol: row['TARGET_PROTOCOL']
  })).filter(row => row.source && row.target); // Filter out empty rows

  // 5. Save as JavaScript Module
  const fileContent = `export const integrationMatrix = ${JSON.stringify(mappedData, null, 2)};`;
  writeFileSync(OUTPUT_FILE, fileContent);

  console.log(`✅ Successfully converted ${mappedData.length} rows.`);
  console.log(`📄 Data saved to ${OUTPUT_FILE}`);

} catch (error) {
  console.error('❌ Error extracting data:', error.message);
}
```

## Running the Extraction

Once you have created the script and installed the dependency, run the extraction command:

```bash
node extract_data.js
```

This will:
1.  Read `BODS.xlsx`.
2.  Parse the data.
3.  Overwrite `src/data.js` with the updated data.

-   **Column Name Mismatch**: If the generated data has `undefined` values, check if the column headers in `BODS.xlsx` match the keys used in the `extract_data.js` script (e.g., "SOURCE", "TARGET").

## ↩️ Reverse Extraction (Restore Excel)

If you have lost the original `BODS.xlsx` file or want to generate a new Excel file from the current `src/data.js`, you can use the `restore_excel.js` script.

1.  Create `restore_excel.js` (code provided in the repository).
2.  Run the script:
    ```bash
    node restore_excel.js
    ```
3.  This will create `BODS_Restored.xlsx`.
