const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { Pool } = require('pg');

const cors = require('cors');
app.use(cors());

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

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});

app.post('/add-subcontractor', (req, res) => {
  // Get the form data from the request body
  var { companyName, salesName, salesNumber, salesEmail, companyStreetAddress, companyPricePerFoot } = req.body;

  // Create an INSERT INTO query
  var insertQuery = `
    INSERT INTO subcontractors (company_name, sales_name, sales_number, sales_email, company_street_address, company_price_per_foot)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  // Execute the query
  pool.query(insertQuery, [companyName, salesName, salesNumber, salesEmail, companyStreetAddress, companyPricePerFoot], (err, result) => {
    if (err) {
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
    } else {
      console.log('Data inserted');
      res.status(200).json({ message: 'Data inserted' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/get-subcontractors', (req, res) => {
  // Create a SELECT query
  var selectQuery = `
    SELECT * FROM subcontractors
  `;

  // Execute the query
  pool.query(selectQuery, (err, result) => {
    if (err) {
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
    } else {
      console.log('Data retrieved');
      res.status(200).json(result.rows);
    }
  });
});
app.post('/add-guttermaterial', (req, res) => {
  // Get the form data from the request body
  var formDataArray = req.body;

  // Check if formDataArray is an array
  if (!Array.isArray(formDataArray)) {
      formDataArray = [formDataArray];
  }

  // Create a promise for each insert query
  var promises = formDataArray.map(({ size, color, item, qty }) => {
      // Create an INSERT INTO query
      var insertQuery = `
          INSERT INTO guttermaterialstorage (size, color, item, qty)
          VALUES ($1, $2, $3, $4)
      `;

      // Return a promise that resolves when the query is executed
      return pool.query(insertQuery, [size, color, item, qty]);
  });

  // Execute all queries
  Promise.all(promises)
  .then(() => {
      console.log('Data inserted');
      res.status(200).json({ message: 'Data inserted' });
  })
  .catch(err => {
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
  });
});
app.get('/get-unique-colors', (req, res) => {
  // Create a SELECT DISTINCT query
  var selectQuery = `
      SELECT DISTINCT color FROM guttermaterialstorage WHERE color IS NOT NULL
  `;

  // Execute the query
  pool.query(selectQuery, (err, result) => {
      if (err) {
          console.log('Error executing query', err.stack);
          res.status(500).json({ error: err.stack });
      } else {
          console.log('Data retrieved');
          res.status(200).json(result.rows);
      }
  });
});
app.get('/get-items-of-color', (req, res) => {
  // Get the color from the query parameters
  var color = req.query.color;

  // Create a SELECT query
  var selectQuery = `
    SELECT * FROM guttermaterialstorage WHERE color = $1
  `;

  // Execute the query
  pool.query(selectQuery, [color], (err, result) => {
    if (err) {
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
    } else {
      console.log('Data retrieved');
      res.status(200).json(result.rows);
    }
  });
});
app.post('/add-guttermaterial', (req, res) => {
  // Get the form data from the request body
  var formDataArray = req.body;

  // Check if formDataArray is an array
  if (!Array.isArray(formDataArray)) {
      formDataArray = [formDataArray];
  }

  // Create a promise for each insert query
  var promises = formDataArray.map(({ size, color, item, qty }) => {
      // Create an INSERT INTO query
      var insertQuery = `
          INSERT INTO guttermaterialstorage (size, color, item, qty)
          VALUES ($1, $2, $3, $4)
      `;

      // Return a promise that resolves when the query is executed
      return pool.query(insertQuery, [size, color, item, qty]);
  });

  // Execute all queries
  Promise.all(promises)
  .then(() => {
      console.log('Data inserted for Other');
      res.status(200).json({ message: 'Data inserted' });
  })
  .catch(err => {
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
  });
});