import React, { useState, useEffect } from 'react';
import './DataTable.css'

function DataTable() {
  const [data, setData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  useEffect(() => {
    // Function to fetch data from the server and update state
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/data');
        const jsonData = await response.json();
        setData(jsonData.body);
        setColumnHeaders(jsonData.headers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function to automatically fetch data on component mount
    fetchData();
    
    // Optionally, you can set up polling to fetch data at regular intervals
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    
    // Clean up the interval if the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  const renderTableHeaders = () => {
    // Check if columnHeaders is defined before mapping
    if (columnHeaders && columnHeaders.length > 0) {
      return columnHeaders.map((columnHeader, index) => (
        <th key={index}>{columnHeader}</th>
      ));
    } else {
      return null; // Return null if columnHeaders is not defined yet
    }
  };

  const renderTableBody = () => {
    // Check if data is defined before mapping
    if (data && data.length > 0 && columnHeaders && columnHeaders.length > 0) {
      return data.map((row, index) => (
        <tr key={index}>
          {columnHeaders.map((columnHeader, columnIndex) => (
            <td key={columnIndex}>{row[columnIndex]}</td>
          ))}
        </tr>
      ));
    } else {
      return null; // Return null if data or columnHeaders is not defined yet
    }
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
