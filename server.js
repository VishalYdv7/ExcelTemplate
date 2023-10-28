const express = require('express');
const multer = require('multer'); // For handling file uploads
const xlsx = require('xlsx'); // For parsing Excel files
const ExcelJS = require('exceljs');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const app = express();
const PORT = 5000;
const path= require('path');
const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());

// MongoDB Database Connection
const client = new MongoClient('mongodb://localhost:27017');  
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});
const db = client.db('icode');
// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a collection in MongoDB to store the data
db.createCollection('fields');
console.log("created a collection");
// API endpoint for handling form data upload
app.post('/', async (req, res) => {
  const fieldNames = req.body.fields;

  // Validate the fieldNames array to ensure it's an array and contains valid data before insertion

  // Transform the array of strings into an array of objects with a specific key
  const fields = fieldNames.map(fieldName => ({ fieldName }));

  try {
    // Insert the fields into the MongoDB collection
    await db.collection('fields').insertMany(fields);
    res.status(200).send('Fields uploaded successfully!');
  } catch (error) {
    console.error('Error inserting fields:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint for handling file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    await db.collection('fields').insertMany(data);

    res.json({ message: 'Data uploaded successfully!' });
  } catch (error) {
    console.error('Error parsing Excel file: ' + error.message);
    res.status(400).json({ error: 'Invalid Excel file' });
  }
});

// API endpoint for fetching data from MongoDB
app.get('/data', async (req, res) => {
  const data = await db.collection('fields').find().toArray();
  res.json(data);
});

// API endpoint for downloading data in Excel format
app.get('/download', async (req, res) => {
  try {
    const latestDocument = await db.collection('fields')
      .find()
      .sort({ _id: -1 }) // Sort by ObjectId in descending order (latest first)
      .limit(1) // Limit the result to 1 document (latest)
      .toArray();

    if (!latestDocument || latestDocument.length === 0 || !latestDocument[0].fields || latestDocument[0].fields.length === 0) {
      res.status(404).json({ error: 'No fields available for Excel template' });
      return;
    }

    const columnHeaders = latestDocument[0].fields;

    // Create an empty worksheet with dynamic column headers
    const worksheet = XLSX.utils.aoa_to_sheet([columnHeaders]); // Convert array of arrays to worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Convert the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers and send the Excel file as a response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=excel_template.xlsx');
    res.end(excelBuffer);
  } catch (error) {
    console.error('Error generating Excel template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});