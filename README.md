# Source-Target Connector Lookup Website

A responsive single-page application that allows users to identify available ETL tools and connectors for specific Source and Target system combinations.

## 🚀 Features

-   **Dynamic Filtering**: Select a Source and Target to instantly see available integration paths.
-   **Comprehensive Data**: Powered by a dataset of ~600 integration combinations derived from the official matrix.
-   **Premium UI**: Modern, glassmorphism-inspired design that is fully responsive across mobile and desktop.
-   **Real-time Search**: Dropdowns are sorted and searchable (native browser behavior).

---

## 📊 Data Extraction Process

The data for this application was programmatically extracted from the provided `BODS.xlsx` file. This ensures accuracy and allows for easy updates if the source spreadsheet changes.

### How it works

1.  **Source File**: We use the `BODS.xlsx` file as the source of truth.
2.  **Parsing Library**: We use the `xlsx` (SheetJS) library to read the Excel file directly in Node.js.
3.  **Conversion Script**: A custom script reads the rows, maps the Excel column headers to our application's data schema, and exports it as a JavaScript module.

### The Extraction Script

Below is the exact script logic used to convert the Excel data into the `src/data.js` file used by the application. You can run this logic again if the Excel file is updated.

```javascript
import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync } from 'fs';

// 1. Read the Excel file
const buf = readFileSync('BODS.xlsx');
const workbook = XLSX.read(buf);

// 2. Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// 3. Convert sheet to JSON
const rawData = XLSX.utils.sheet_to_json(sheet);

// 4. Map Excel Columns to App Schema
const mappedData = rawData.map(row => ({
  etlTool: row['ETL Tool '] || 'SAP BODS', // Handled trailing space in header
  source: row['SOURCE'],
  sourceConnector: row['SOURCE_CONNECTOR'],
  sourceProtocol: row['SOURCE_PROTOCOL'],
  target: row['TARGET'],
  targetConnector: row['TARGET_CONNECTOR'],
  targetProtocol: row['TARGET_PROTOCOL']
})).filter(row => row.source && row.target); // Filter out empty rows

// 5. Save as JavaScript Module
const fileContent = `export const integrationMatrix = ${JSON.stringify(mappedData, null, 2)};`;
writeFileSync('src/data.js', fileContent);

console.log(`Successfully converted ${mappedData.length} rows.`);
```

### Data Schema

The extracted data is stored in `src/data.js` as an array of objects:

```javascript
{
  etlTool: "SAP BODS",
  source: "Amazon RDS for MS SQL Server",
  sourceConnector: "ODBC",
  sourceProtocol: "TCP/IP",
  target: "Oracle",
  targetConnector: "ODBC",
  targetProtocol: "TCP/IP"
}
```

---

## 🛠️ Project Setup

### Prerequisites
-   Node.js (v14 or higher)
-   npm

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:
```bash
npm run dev
```
Open your browser to the URL shown (usually `http://localhost:5173`).

### Building for Production

Create a production-ready build:
```bash
npm run build
```
The output files will be in the `dist` directory.
