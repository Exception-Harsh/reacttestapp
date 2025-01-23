import { useState } from 'react';
import axios from 'axios';
import { TableData } from '../types/alltypes';

const DBConnection = () => {
  const [tableData, setTableData] = useState<TableData[] | null>(null);
  const [tableName, setTableName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGetTableData = async () => {
    setError(null); // Clear any previous errors
    if (!tableName) {
        setError("Please enter a table name.");
        return;
    }

    try {
      const response = await axios.get(`https://localhost:44391/api/Oracle/GetTableData?tableName=${tableName}`); // Replace with your actual API endpoint
      setTableData(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        // Access specific Axios error properties if available
        setError(err.response?.data?.message || err.message || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("API Error:", err); // Log the full error for debugging
    }
  };

  return (
    <div>
      <h1>Get Table Data</h1>

      <label htmlFor="tableName">Table Name:</label>
      <input
        type="text"
        id="tableName"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />
      <button onClick={handleGetTableData}>Get Table Data</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {tableData && tableData.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value !== null ? value.toString() : "null"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableData === null ? (
          <p>No data yet. Please enter a table name and click the button.</p>
      ) : (
        <p>No data found for this table.</p>
      )}
    </div>
  );
};

export default DBConnection;