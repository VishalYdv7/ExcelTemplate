import React, { useState, useEffect } from 'react';

function DataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the server and update the state
    // Example: Fetch data from /api/data endpoint
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <div className="data-table">
      <h2>Uploaded Data</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            {/* Add more table headers for other fields */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.firstName}</td>
              <td>{row.lastName}</td>
              {/* Render other data fields here */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
