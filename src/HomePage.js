import React from 'react';
import TemplateForm from './TemplateForm';
import ExcelDownloadButton from './ExcelDownloadButton';

function HomePage() {
    console.log("homepage rendered")
  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <TemplateForm />
      <ExcelDownloadButton />
    </div>
  );
}

export default HomePage;