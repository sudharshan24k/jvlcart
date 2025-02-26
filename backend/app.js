const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser');

const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Route files
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);

// Middleware for handling errors
app.use(errorMiddleware);

module.exports = app;
