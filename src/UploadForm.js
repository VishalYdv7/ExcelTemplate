import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/upload', formData);
    if (response.status === 200) {
      console.log('File uploaded successfully!');
    } else {
      console.error('Error uploading file:', response.data);
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input className='fileUpload' type="file" onChange={handleFileChange} />
      <button className='button' onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadForm;
