const express = require('express');
const app = express();
const connectDB = require('./config/db');

// connect to database
connectDB();

app.get('/', (req, res) => {
  res.send("Wohooo, it's working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started at http://localhost:5000'));
