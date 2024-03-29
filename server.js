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
        INSERT INTO company (companyName, companyAddress, five_inch_gutter, six_inch_gutter, five_inch_filter, six_inch_filter, fascia_wood, trim_metal)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `;
      return pool.query(insertCompanyQuery, [companyName, companyAddress, fiveInchPrice, sixInchPrice, fiveInchFilterPrice, sixInchFilterPrice, fasciaWoodPrice, trimMetalPrice]);
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
      c.five_inch_gutter, c.six_inch_gutter, c.five_inch_filter, c.six_inch_filter, c.fascia_wood, c.trim_metal 
    FROM company c
    JOIN customer cu ON c.id = cu.companyId
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

app.get('/get-jobs', checkUserLoggedIn, (req, res) => {
  var selectQuery = `
    SELECT 
      jobs.id, customer.customerName, jobs.address, jobs.status
    FROM jobs
    JOIN customer ON jobs.customerId = customer.id
  `;
  pool.query(selectQuery, (err, result) => {
    if (err) {
      console.log('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
    } else {
      console.log('Jobs retrieved');
      res.status(200).json(result.rows);
    }
  });
});
app.get('/get-full-job/:id', checkUserLoggedIn, async (req, res) => {
  try {
      const jobId = req.params.id;
      const job = await pool.query(`
          SELECT 
              j.id, 
              cu.customerName, 
              j.status, 
              cu.customerPhoneNumber,
              cu.customeremail,
              j.address, 
              c.companyName, 
              j.drawing, 
              TO_CHAR(j.estDate, 'YYYY-MM-DD') as estDate, 
              TO_CHAR(j.insDate, 'YYYY-MM-DD') as insDate, 
              j.price, 
              j.notes
          FROM jobs j
          JOIN customer cu ON j.customerId = cu.id
          LEFT JOIN company c ON cu.companyId = c.id
          WHERE j.id = $1
      `, [jobId]);

      if (job.rows.length > 0) {
          res.json(job.rows[0]);
      } else {
          res.json({ error: 'No job found with this ID' });
      }
  } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: err.stack });
  }
});
app.get('/search-jobs', async (req, res) => {
  const { term } = req.query;
  try {
      // Ensure the query selects the id (jobId) and any other necessary columns explicitly if needed for clarity
      const query = `
          SELECT id AS jobId, * FROM jobs
          WHERE status = 'Est Scheduled'
          AND address ILIKE $1;
      `;
      const values = [`%${term}%`];
      const result = await pool.query(query, values);
      // The response will include jobId along with other job details
      res.json(result.rows);
  } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error searching jobs');
  }
});
app.get('/get-material-prices', checkUserLoggedIn, async (req, res) => {
  try {
    const selectQuery = `
      SELECT * FROM material_prices
    `;
    const result = await pool.query(selectQuery);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: err.stack });
  }
});
app.post('/logout', (req, res) => {
  // Clear the 'token' cookie
  res.clearCookie('token');
  // Send a response indicating the user has been logged out
  res.json({ message: 'Logged out successfully' });
});
app.get('/get-job-addresses', checkUserLoggedIn, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT j.id, j.address
      FROM jobs j
      LEFT JOIN job_orders jo ON j.id = jo.job_id
      WHERE jo.job_id IS NULL;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch job addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// endpoint for updating job_orders and jobs after estimate
const updateJobPrice = async (jobId, price) => {
  const query = `
    UPDATE jobs
    SET price = $2
    WHERE id = $1;
  `;
  const result = await pool.query(query, [jobId, price]);
  return result.rowCount;
};

const insertJobOrder = async (jobData) => {
  const query = `
    INSERT INTO job_orders (
      job_id, size, gutterft, downspout, aelbow, belbow, outmiter, inmiter, filter, color, bigscrews, smallscrews, caulk, adapters, expect_cost, hangers, sets
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
  `;
  await pool.query(query, jobData);
};

app.post('/insert-job-data', checkUserLoggedIn, async (req, res) => {
  const jobData = [
    req.body.selectedJobId,
    req.body.sizeToggleGutterFt,
    req.body.inputGutterFt,
    req.body.inputDownspout,
    req.body.inputAElbow,
    req.body.inputBElbow,
    req.body.inputOutMiter,
    req.body.inputInMiter,
    req.body.inputFilter,
    req.body.selectedColor,
    req.body.BigScrews,
    req.body.SmallScrews,
    req.body.Caulk,
    req.body.inputAdapter,
    req.body.materialCostPrice,
    req.body.Hangers,
    req.body.inputSets
  ];

  try {
    await pool.query('BEGIN');
    const updatedRows = await updateJobPrice(req.body.selectedJobId, req.body.materialCharge);

    if (updatedRows === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Job not found' });
    }

    await insertJobOrder(jobData);
    await pool.query('COMMIT');
    res.status(200).json({ message: 'Job and job order data inserted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error processing job data:', error);
    res.status(500).json({ error: 'Failed to process job data' });
  }
});
app.post('/update-job/:id', checkUserLoggedIn, async (req, res) => {
  const jobId = req.params.id;
  const {
    status, address, drawing, estdate, insdate, price, notes,
    name, phone, email, obtainedHow // Assuming these are part of the request body
  } = req.body;

  // Start a transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateJobQuery = `
      UPDATE jobs
      SET 
        status = $2,
        address = $3,
        drawing = $4,
        estdate = TO_DATE($5, 'YYYY-MM-DD'),
        insdate = TO_DATE($6, 'YYYY-MM-DD'),
        price = $7,
        notes = $8
      WHERE id = $1 RETURNING customerid;
    `;
    const jobResult = await client.query(updateJobQuery, [jobId, status, address, drawing, estdate, insdate, price, notes]);
    const customerId = jobResult.rows[0].customerid; // Extract customerId from the job update result
    console.log(customerId);

    const updateCustomerQuery = `
      UPDATE customer
      SET 
        customername = $2,
        customerphonenumber = $3,
        customeremail = $4,
        obtainedhow = $5
      WHERE id = $1;
    `;

    await client.query(updateCustomerQuery, [customerId, name, phone, email, obtainedHow]);
    console.log(updateCustomerQuery);
    console.log([customerId, name, phone, email, obtainedHow]);
    await client.query('COMMIT');
    res.json({ message: 'Job and customer updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error executing transaction', err.stack);
    res.status(500).json({ error: 'Failed to update the job and customer.' });
  } finally {
    client.release();
  }
});