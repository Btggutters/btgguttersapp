const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/calculator.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});