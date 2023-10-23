import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Router } from 'react-router-dom';
import TemplateForm from './TemplateForm';
import UploadForm from './UploadForm';
import DataTable from './DataTable';
import ExcelDownloadButton from './ExcelDownloadButton.js';
// import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TemplateForm />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/data" element={<DataTable />} />
        </Routes>
        <ExcelDownloadButton />
      </div>
    </Router>
  );
}

export default App;
