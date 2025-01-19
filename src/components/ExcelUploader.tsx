import React, { useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface GridData {
  id: number;
  [key: string]: any;
}

const ExcelUploader: React.FC = () => {
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridData[]>([]);

  // Define headers that are known to be dates
  const dateColumns = ['Date', 'DOB', 'JoinDate', 'Doc Date'];

  const isExcelDate = (value: number): boolean => {
    // Assuming Excel date serial numbers start from 1 to 2958465 (01-01-1900 to 31-12-9999)
    return value > 0 && value < 2958465;
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

      if (jsonData.length > 0) {
        const headers = jsonData[0] as string[];
        const gridColumns: GridColDef[] = headers.map((header, index) => ({
          field: header || `column_${index}`,
          headerName: header || `Column ${index + 1}`,
          width: 150,
        }));

        const gridRows: GridData[] = jsonData.slice(1).map((row, index) => {
          const rowArray = row as (string | number | undefined)[];
          const rowData: GridData = { id: index + 1 };
          headers.forEach((header, i) => {
            const cellValue = rowArray[i];
            if (typeof cellValue === 'number' && dateColumns.includes(header) && isExcelDate(cellValue)) {
              rowData[header || `column_${i}`] = XLSX.SSF.format('dd-mm-yyyy', cellValue);
            } else {
              rowData[header || `column_${i}`] = cellValue === '-' || cellValue === undefined || cellValue === '' ? 'N/A' : cellValue;
            }
          });
          return rowData;
        });

        setColumns(gridColumns);
        setRows(gridRows);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } as Accept,
    multiple: false,
  });

  return (
    <div style={{ padding: '20px' }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #007bff',
          borderRadius: '5px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <input {...getInputProps()} />
        <p>Drag and drop an Excel file here, or click to select a file</p>
      </div>

      {columns.length > 0 && rows.length > 0 && (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight // Enable auto height to allow scrolling
          />
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
