# Code Explanation: Source Dropdown Logic

This document explains how the "Source System" dropdown is populated in the application.

## 1. The Data Source (`src/data.js`)

The data comes from `src/data.js`, which exports a variable named `integrationMatrix`. This is a large array of objects, where each object represents one row from your Excel file.

**Example Data Structure:**
```javascript
// src/data.js
export const integrationMatrix = [
  {
    etlTool: "SAP BODS",
    source: "Amazon RDS for MS SQL Server", // <--- We want this value
    target: "Oracle",
    // ... other fields
  },
  {
    etlTool: "SAP BODS",
    source: "Amazon RDS for MS SQL Server", // <--- Duplicate value
    target: "SAP HANA DB",
    // ... other fields
  },
  // ... more rows
];
```

## 2. The Logic (`src/App.jsx`)

The logic to extract these values is located in `src/App.jsx`. It uses a 3-step process to get a clean list for the dropdown.

### Step 1: Import the Data
First, the component imports the data from the file.
```javascript
import { integrationMatrix } from './data';
```

### Step 2: Extract and Deduplicate
The code uses `useMemo` (for performance) to process the data.

```javascript
const sources = useMemo(() => {
  // A. Get all source names (including duplicates)
  const allSources = integrationMatrix.map(row => row.source);
  
  // B. Remove duplicates using a Set
  const uniqueSources = new Set(allSources);
  
  // C. Convert back to Array and Sort alphabetically
  return Array.from(uniqueSources).sort();
}, []);
```

*   **`map`**: Goes through every row and picks out just the "source" value.
*   **`Set`**: Automatically removes any duplicate values (e.g., "Amazon RDS..." appears many times in `data.js`, but only once in the Set).
*   **`sort`**: Arranges them A-Z for the dropdown.

### Step 3: Render the Dropdown
Finally, the `sources` array is used to create the HTML options.

```jsx
<select ... >
  <option value="">Select Source...</option>
  {sources.map((source) => (
    <option key={source} value={source}>
      {source}
    </option>
  ))}
</select>
```

## Summary Flow

1.  **File**: `src/data.js` contains the raw data.
2.  **Import**: `App.jsx` imports `integrationMatrix`.
3.  **Process**: Code extracts `row.source`, removes duplicates, and sorts them.
4.  **Display**: The unique list is mapped to `<option>` tags in the dropdown.
