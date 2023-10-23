import React, { useState } from 'react';
import './styles.css';

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
    <div>
      <h2>Upload Excel Template</h2>
      <input className='fileUpload' type="file" onChange={handleFileChange} />
      <button className='button' onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadForm;
