const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'neon',
  host: 'ep-dawn-dew-50528787.us-east-2.aws.neon.tech',
  database: 'neondb',
  password: 'dIptZLhvHK10',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS subcontractors (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    sales_name VARCHAR(255),
    sales_number VARCHAR(255),
    sales_email VARCHAR(255),
    company_street_address VARCHAR(255)
  )
`;

pool.query(createTableQuery, (err, res) => {
  if (err) {
    console.log('Error executing query', err.stack);
  } else {
    console.log('Table created');
  }
});