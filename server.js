const express = require('express');
const multer = require('multer'); // For handling file uploads
const xlsx = require('xlsx'); // For parsing Excel files
const ExcelJS = require('exceljs');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 5000;

app.use(express.json());

// MongoDB Database Connection
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('icode');

// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a collection in MongoDB to store the data
db.createCollection('fields');

// API endpoint for handling form data upload
app.post('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const fields = req.body.fields;

  // Insert the fields into the MongoDB collection
  await db.collection('fields').insertMany(fields);
  console.log("insterted the fields");

  res.status(200).send('Fields uploaded successfully!');
});

// API endpoint for handling file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/upload');
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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/data');
  const data = await db.collection('fields').find().toArray();
  res.json(data);
});

// API endpoint for downloading data in Excel format
app.get('/download', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/download');
  const data = await db.collection('fields').find().toArray();

  // Create Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Add headers dynamically based on keys in the fetched data
  const columns = Object.keys(data[0]).map((key) => {
    return { header: key, key: key, width: 15 };
  });

  worksheet.columns = columns;

  data.forEach((row) => {
    worksheet.addRow(row);
  });
  workbook.xlsx.writeBuffer().then((buffer) => {
    // Set response headers for Excel file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=excel_data.xlsx');
    res.send(buffer);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});