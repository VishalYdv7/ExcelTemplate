import React, { useState } from 'react';

function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Logic to upload the file to the server
    console.log('File uploaded:', file);
  };

  return (
    <div className="form-container">
      <h2>Upload Excel Template</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadForm;
