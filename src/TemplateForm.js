import React, { useState } from 'react';

function TemplateForm() {
  const [fields, setFields] = useState([]);

  const handleFieldChange = (e, index) => {
    const updatedFields = [...fields];
    updatedFields[index] = e.target.value;
    setFields(updatedFields);
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
      <button onClick={() => setFields([...fields, ''])}>Add Field</button>
    </div>
  );
}

export default TemplateForm;
