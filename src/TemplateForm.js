import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';
axios.defaults.timeout = 100000;

function TemplateForm() {
  const [fields, setFields] = useState([]);

  const handleFieldChange = (e, index) => {
    const updatedFields = [...fields];
    updatedFields[index] = e.target.value;
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    const formattedFields = fields.map(fieldName => ({ fieldName }));
    try {
      const response = await axios.post('http://localhost:5000/', { fields: formattedFields });
      if (response.status === 200) {
        console.log('Fields uploaded successfully!');
      } else {
        console.error('Error uploading fields:', response.data);
      }
    } catch (error) {
      console.error('Error uploading fields:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Define Fields for Mapping</h2>
      {fields.map((field, index) => (
        <input
          key={index}
          type="text"
          value={field}
          onChange={(e) => handleFieldChange(e, index)}
          placeholder={`Field ${index + 1}`}
        />
      ))}
      <button className='button' onClick={() => setFields([...fields, ''])}>Add Field</button>
      <button className='button' onClick={handleSubmit}>
        Upload these fields
      </button>
    </div>
  );
}

export default TemplateForm;
