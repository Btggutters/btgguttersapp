require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'home.html'));
});

const cors = require('cors');
app.use(cors());

function checkUserLoggedIn(req, res, next) {
  if (req.cookies.token) {
    console.log('User is logged in');
    next(); // continue to the next middleware function or route handler
  } else {
    console.log('User is not logged in');
    res.status(401).json({ message: 'Not logged in' });
  }
}

const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
const bcrypt = require('bcryptjs');

app.post('/login', (req, res) => {
  // Get the username and password from the request body
  var { username, password } = req.body;

  // Create a SELECT query
  var selectQuery = `
    SELECT * FROM users WHERE username = $1
  `;

  // Execute the query
  pool.query(selectQuery, [username], (err, result) => {
    if (err) {
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
    } else {
      if (result.rows.length > 0) {
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, result.rows[0].password, function(err, isMatch) {
          if (err) {
            // ... existing code ...
          } else if (isMatch) {
            // Set a cookie that expires in 1 month
            res.cookie('token', process.env.SECRET_KEY, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            console.log('Login successful');
            res.status(200).json({ message: 'Login successful' });
          } else {
            console.log('Invalid username or password');
            res.status(401).json({ message: 'Invalid username or password' });
          }
        });
      } else {
        console.log('Invalid username or password');
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  });
});


app.post('/add-subcontractor', checkUserLoggedIn, (req, res) => {
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

app.get('/get-subcontractors', checkUserLoggedIn, (req, res) => {
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
app.post('/add-guttermaterial', checkUserLoggedIn, (req, res) => {
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
          INSERT INTO material (size, color, item, qty, location, job_id)
          VALUES ($1, $2, $3, $4, $5, $6)
      `;

      // Return a promise that resolves when the query is executed
      return pool.query(insertQuery, [size, color, item, qty, 'storage', null]);
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
app.get('/get-unique-colors', checkUserLoggedIn, (req, res) => {
  // Create a SELECT DISTINCT query
  var selectQuery = `
      SELECT DISTINCT color FROM material WHERE color IS NOT NULL AND location = 'storage'
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
app.get('/get-items-of-color', checkUserLoggedIn, (req, res) => {
  // Get the color from the query parameters
  var color = req.query.color;

  // Create a SELECT query
  var selectQuery = `
    SELECT * FROM material WHERE color = $1 AND location = 'storage'
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
app.post('/add-guttermaterial', checkUserLoggedIn, (req, res) => {
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
      INSERT INTO material (size, color, item, qty, location, job_id)
      VALUES ($1, $2, $3, $4, $5, $6)
  `;

  // Return a promise that resolves when the query is executed
  return pool.query(insertQuery, [size, color, item, qty, 'storage', null]);
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

app.get('/get-items-with-null-color-and-storage-location', checkUserLoggedIn, (req, res) => {
  // Create a SELECT query
  var selectQuery = `
    SELECT * FROM material WHERE color IS NULL AND location = 'storage'
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