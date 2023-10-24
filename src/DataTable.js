import React, { useState, useEffect } from 'react';
import './styles.css';

function DataTable() {
  const [data, setData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  useEffect(() => {
    fetch('/data')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setColumnHeaders(Object.keys(data[0]));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []); 

  const renderTableHeaders = () => {
    return columnHeaders.map((columnHeader, index) => (
      <th key={index}>{columnHeader}</th>
    ));
  };

  const renderTableBody = () => {
    return data.map((row, index) => (
      <tr key={index}>
        {columnHeaders.map((columnHeader, index) => (
          <td key={index}>{row[columnHeader]}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="data-table">
      <h2>Uploaded Data</h2>
      <table>
        <thead>
          <tr>
            {renderTableHeaders()}
          </tr>
        </thead>
        <tbody>
          {renderTableBody()}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
