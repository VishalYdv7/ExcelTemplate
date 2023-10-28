import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import UploadPage from './UploadPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </div>
  );
}

export default App;
