const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('home');
});
// Route for Calculations page
app.get('/calculator', function(req, res) {
    res.render('calculator'); // Assuming you have a dashboard.ejs file in views folder
});
// Route for CRM
app.get('/crm', function(req, res) {
    res.render('crm'); // Assuming you have a crm.ejs file in views folder
});
// Route for Customer page
app.get('/customer', function(req, res) {
  res.render('customer');
});
// Route for dashboard page
app.get('/dashboard', function(req, res) {
  res.render('dashboard');
});

app.get('/financial', function(req, res) {
  res.render('financial');
});

app.get('/home', function(req, res) {
  res.render('home');
});

app.get('/inventory', function(req, res) {
  res.render('inventory');
});
app.get('/invoiceandEstimates', function(req, res) {
  res.render('invoiceandEstimates');
});

// Continue with your route setup...

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
