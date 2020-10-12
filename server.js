const express = require('express');
const config = require('config');
const mysql = require("mysql2");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ 'type': 'application/json' }));
app.use(bodyParser.urlencoded({ 'extended': true }));
const PORT = config.get('port') || 5000;


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "manager",
  password: "root"
});

db.connect((err) => {
  if (err) { throw err; }
  console.log('Connected to database');
});
global.db = db;

app.listen(PORT, () => console.log(`here port ${PORT}`));




