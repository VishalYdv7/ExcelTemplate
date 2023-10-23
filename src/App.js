import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TemplateForm from './TemplateForm';
import UploadForm from './UploadForm';
import DataTable from './DataTable';
import ExcelDownloadButton from './ExcelDownloadButton.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TemplateForm />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
      <ExcelDownloadButton />
    </div>
  );
}

export default App;
