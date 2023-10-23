const express = require('express');
const multer = require('multer'); // For handling file uploads
const xlsx = require('xlsx'); // For parsing Excel files
const mysql = require('mysql'); // For MySQL database connection (if using MySQL)
const mongoose = require('mongoose'); // For MongoDB connection (if using MongoDB)

const app = express();
const PORT = 5000;

app.use(express.json());

// MySQL Database Connection 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database_name',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});



// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API endpoint for handling file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    // Parse uploaded Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Handle data processing (store in database, etc.)
    // For example, if using MySQL:
    const query = 'INSERT INTO your_table_name SET ?';
    connection.query(query, data, (error, results) => {
      if (error) {
        console.error('Error inserting data into MySQL database: ' + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      console.log('Data inserted into MySQL database');
      res.json({ message: 'Data uploaded successfully!' });
    });
    

    // Respond with a success message
    res.json({ message: 'Data uploaded successfully!' });
  } catch (error) {
    console.error('Error parsing Excel file: ' + error.message);
    res.status(400).json({ error: 'Invalid Excel file' });
  }
});

// Additional API endpoints can be added here as needed

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
