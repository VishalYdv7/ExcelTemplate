const express = require('express');
const multer = require('multer'); // For handling file uploads
const XLSX = require('xlsx'); // For parsing Excel files
const ExcelJS = require('exceljs');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const app = express();
const PORT = 5000;
const path= require('path');

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

// Create a collection in MongoDB to store the data
db.createCollection('excelData');
console.log("created a collection");
// API endpoint for handling form data upload
app.post('/', async (req, res) => {
  const reqBodyFields = req.body.fields;
  console.log(reqBodyFields);
  // Validate the fieldNames array to ensure it's an array and contains valid data before insertion

  // Transform the array of strings into an object with keys as field names
  const headers = reqBodyFields.map(field => field.fieldName);

  const fieldsObject = { "headers": headers };
  console.log(fieldsObject);
  try {
    // Insert the fields object into the MongoDB collection
    await db.collection('excelData').insertOne(fieldsObject);
    res.status(200).send('Fields uploaded successfully!');
  } catch (error) {
    console.error('Error inserting fields:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// API endpoint for handling file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    // Assuming the first sheet contains the data
    const worksheet = workbook.getWorksheet(1);

    // Extract data from the worksheet
    const excelData = [];
    worksheet.eachRow((row, rowNumber) => {
      const rowData = row.values;
      excelData.push(rowData);
    });

    // Extract headers (assuming they are in the first row)
    const headers = excelData.shift();

    // Prepare data to be stored in MongoDB
    const dataToStore = {
      headers: headers,
      body: excelData,
    };

    // Insert the formatted data into MongoDB
    await db.collection('excelData').insertOne(dataToStore);
    console.log(dataToStore);

    res.status(200).json({ message: 'Data uploaded successfully!' });
  } catch (error) {
    console.error('Error parsing Excel file: ' + error.message);
    res.status(400).json({ error: 'Invalid Excel file' });
  }
});

// API endpoint for fetching data from MongoDB
app.get('/data', async (req, res) => {
  try {
    const latestRecord = await db.collection('excelData')
      .find()
      .sort({ _id: -1 }) // Sort by ObjectId in descending order (latest first)
      .limit(1) // Limit the result to 1 document (latest)
      .next(); // Use next() to retrieve the document

    if (!latestRecord || !latestRecord.headers || !latestRecord.body) {
      res.status(404).json({ error: 'No data available' });
      return;
    }
    const filteredBody = latestRecord.body.map(row => row.slice(1));
    res.status(200).json({
      headers: latestRecord.headers.slice(1), // Remove the first header as well
      body: filteredBody,
    });
  } catch (error) {
    console.error('Error fetching data from MongoDB: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for downloading data in Excel format
app.get('/download', async (req, res) => {
  try {
    const latestDocument = await db.collection('excelData')
      .find()
      .sort({ _id: -1 }) // Sort by ObjectId in descending order (latest first)
      .limit(1) // Limit the result to 1 document (latest)
      .toArray();

    if (!latestDocument || latestDocument.length === 0 || !latestDocument[0].headers || latestDocument[0].headers.length === 0) {
      res.status(404).json({ error: 'No fields available for Excel template' });
      return;
    }

    const columnHeaders = latestDocument[0].headers;

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