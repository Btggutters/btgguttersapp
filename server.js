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
// server.js
app.get('/check-login', checkUserLoggedIn, (req, res) => {
  // If the middleware did not send a response, the user is logged in
  res.json({ isLoggedIn: true });
});

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
            res.status(200).json({ status: 'success' }); // Add this line
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


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
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
app.post('/add-company-and-prices', checkUserLoggedIn, (req, res) => {
  console.log('Form data:', req.body); 
  // Get the form data from the request body
  var { companyName, companyAddress, salesName, salesNumber, billingEmail, fiveInchPrice, sixInchPrice, fiveInchFilterPrice, sixInchFilterPrice, fasciaWoodPrice, trimMetalPrice } = req.body;

  // Define companyId outside of the promise chain
  var companyId;

  // Start a database transaction
  pool.query('BEGIN')
    .then(() => {
      // Insert into the company table
      var insertCompanyQuery = `
        INSERT INTO company (companyName, companyAddress)
        VALUES ($1, $2)
        RETURNING id
      `;
      return pool.query(insertCompanyQuery, [companyName, companyAddress]);
    })
    .then(result => {
      // Assign the ID of the newly inserted company to companyId
      companyId = result.rows[0].id;

      // Insert into the customer table
      var insertCustomerQuery = `
        INSERT INTO customer (customerName, customerPhoneNumber, customerEmail, companyId)
        VALUES ($1, $2, $3, $4)
      `;
      return pool.query(insertCustomerQuery, [salesName, salesNumber, billingEmail, companyId]);
    })
    .then(() => {
      // Insert into the company_prices table
      var insertCompanyPricesQuery = `
        INSERT INTO company_prices (company_id, five_inch_gutter, six_inch_gutter, five_inch_filter, six_inch_filter, fascia_wood, trim_metal)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      return pool.query(insertCompanyPricesQuery, [companyId, fiveInchPrice, sixInchPrice, fiveInchFilterPrice, sixInchFilterPrice, fasciaWoodPrice, trimMetalPrice]);
    })
    .then(() => {
      // Commit the transaction
      return pool.query('COMMIT');
    })
    .then(() => {
      console.log('Data inserted');
      res.status(200).json({ message: 'Data inserted' });
    })
    .catch(err => {
      // Rollback the transaction in case of error
      pool.query('ROLLBACK');
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
    });
});

app.get('/get-companies-and-prices', checkUserLoggedIn, (req, res) => {
  // Create a SELECT query
  var selectQuery = `
    SELECT 
      c.companyName, c.companyAddress, 
      cu.customerName, cu.customerPhoneNumber, cu.customerEmail, cu.companyId, 
      cp.company_id, cp.five_inch_gutter, cp.six_inch_gutter, cp.five_inch_filter, cp.six_inch_filter, cp.fascia_wood, cp.trim_metal 
    FROM company c
    JOIN customer cu ON c.id = cu.companyId
    JOIN company_prices cp ON c.id = cp.company_id
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
app.get('/get-companies', checkUserLoggedIn , (req, res) => {
  // Create a SELECT query
  var selectQuery = `
    SELECT 
      c.companyName
    FROM company c
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
app.post('/create-lead', checkUserLoggedIn, (req, res) => {
  // Get the form data from the request body
  var { customerName, customerPhoneNumber, customerEmail, obtainedHow, address, notes, typeOfWork, date } = req.body;

  // Start a database transaction
  pool.query('BEGIN')
    .then(() => {
      // Insert into the customer table
      var insertCustomerQuery = `
        INSERT INTO customer (customerName, customerPhoneNumber, customerEmail, obtainedHow)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      return pool.query(insertCustomerQuery, [customerName, customerPhoneNumber, customerEmail, obtainedHow]);
    })
    .then(result => {
      // Get the ID of the newly inserted customer
      var customerId = result.rows[0].id;

      // Insert into the jobs table
      var insertJobQuery = `
        INSERT INTO jobs (customerId, address, notes, typeOfWork)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      return pool.query(insertJobQuery, [customerId, address, notes, typeOfWork]);
    })
    .then(result => {
      // Get the ID of the newly inserted job
      var jobId = result.rows[0].id;

      // Insert into the estimate table
      var insertEstimateQuery = `
        INSERT INTO estimate (jobId, date)
        VALUES ($1, $2)
      `;
      return pool.query(insertEstimateQuery, [jobId, date]);
    })
    .then(() => {
      // Commit the transaction
      return pool.query('COMMIT');
    })
    .then(() => {
      console.log('Lead created');
      res.status(200).json({ message: 'Lead created' });
    })
    .catch(err => {
      // Rollback the transaction in case of error
      pool.query('ROLLBACK')
        .then(() => {
          console.log('Error executing query', err.stack);
          res.status(500).json({ error: err.stack });
        });
    });
});