import * as XLSX from 'xlsx';
import { integrationMatrix } from './src/data.js';

// Configuration
const OUTPUT_FILE = 'BODS_Restored.xlsx';

try {
    console.log('Reading data from src/data.js...');

    // 1. Map App Schema back to Excel Columns
    const rows = integrationMatrix.map(item => ({
        'ETL Tool ': item.etlTool,
        'SOURCE': item.source,
        'SOURCE_CONNECTOR': item.sourceConnector,
        'SOURCE_PROTOCOL': item.sourceProtocol,
        'TARGET': item.target,
        'TARGET_CONNECTOR': item.targetConnector,
        'TARGET_PROTOCOL': item.targetProtocol
    }));

    // 2. Create Sheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // 3. Create Workbook and Append Sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 4. Write File
    XLSX.writeFile(workbook, OUTPUT_FILE);

    console.log(`✅ Successfully restored ${rows.length} rows to ${OUTPUT_FILE}`);

} catch (error) {
    console.error('❌ Error restoring Excel file:', error.message);
}
