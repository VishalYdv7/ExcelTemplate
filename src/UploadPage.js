import React from 'react';
import UploadForm from './UploadForm';
import DataTable from './DataTable';

function UploadPage() {
  return (
    <div className="upload-page">
      <UploadForm />
      <DataTable />
    </div>
  );
}

export default UploadPage;
