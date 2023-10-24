import React from 'react';
import './styles.css';

function ExcelDownloadButton() {
  const handleDownload = () => {
    fetch('/download')
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error downloading template:', error));
  };

  return (
    <div className="download-button">
      <button className='button' onClick={handleDownload}>Download Excel Template</button>
    </div>
  );
}

export default ExcelDownloadButton;
