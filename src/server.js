// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const exceljs = require('exceljs');
const app = express();


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vishal',
  database: 'icode'
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to MySQL: ' + error.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use(bodyParser.json());


app.get('/api/generate-template', (req, res) => {
  const fields = req.query.fields.split(','); //comma-separated string
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.addRow(fields);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');
  workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
});

app.post('/api/update', (req, res) => {
  const data = req.body;
  const query = 'INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)';
  const values = [data.first_name, data.last_name, data.email];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error updating database: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log('Database updated successfully');
    res.json({ message: 'Database updated successfully' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
