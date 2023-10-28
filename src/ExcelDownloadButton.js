import React from 'react';
import './styles.css';

function ExcelDownloadButton() {
  const handleDownload = () => {
    fetch('http://localhost:5000/download')
      .then((response) => {
        if (response.ok) {
          // Trigger the browser to download the file
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'excel_template.xlsx'; // Set the file name for the template
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          console.error('Error downloading template:', response.statusText);
        }
      })
      .catch((error) => console.error('Error downloading template:', error));
  };

  return (
    <div className="download-button">
      <button className='button' onClick={handleDownload}>Download Excel Template</button>
      <h2>Or</h2>
      <button className='button' onClick={() => { window.location.href = '/upload';}}>
        Upload excel file
      </button>
    </div>
    
  );
}

export default ExcelDownloadButton;