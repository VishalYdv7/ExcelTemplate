import React, { useState } from 'react';

const TemplateComponent = () => {
    const [uploadedData, setUploadedData] = useState('');

    const handleUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                Papa.parse(content, {
                    header: true,
                    complete: function(results) {
                        setUploadedData(results.data);
                        updateDatabase(results.data);
                    }
                });
                setUploadedData(content);
            };
            reader.readAsText(file);
        } else {
            alert('Please select a file to upload.');
        }

        const updateDatabase = (data) => {
            axios.post('/api/update', data) //self rem. to update it
                .then(response => {
                    console.log('Database updated successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error updating database:', error);
                });
        };

    };

    return (
        <div>
            {/* Render UI elements and buttons similar to the HTML version */}
            <input type="file" onChange={handleUpload} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
            <div id="uploadedData">{uploadedData}</div>
        </div>
    );
};

export default TemplateComponent;