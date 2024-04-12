const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const incomeRouter = require('./routes/income');
const expenseRouter = require('./routes/expense');
const cors = require('cors'); // Import CORS middleware

const PORT = process.env.PORT || 2000;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/finable', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware to allow all origins by default

// Routes
app.use('/api/incomes', incomeRouter); 
app.use('/api/expenses', expenseRouter); 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
