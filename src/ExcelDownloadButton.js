import React from 'react';

function ExcelDownloadButton() {
  // Logic to handle Excel template download
  const handleDownload = () => {
    // Example: Fetch Excel template from /api/download endpoint
    fetch('/api/download')
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
      <button onClick={handleDownload}>Download Excel Template</button>
    </div>
  );
}

export default ExcelDownloadButton;
