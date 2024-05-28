const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

//! init middleware
app.use(morgan('dev')); //* app.use(morgan('combined'));
app.use(helmet()); //* che giấu thông tin header, bảo vệ khỏi các cuộc tấn công
app.use(compression()); //* giảm dung lượng trả về cho client
app.use(express.json()); //* parse json
app.use(express.urlencoded({
  extended: true
})); //* parse urlencoded
//! end init middleware

//! test pub.sub redis
require('./tests/inventory.test');
const productTest = require('./tests/product.test');
productTest.purchaseProduct('0001', 10);
//! end test pub.sub redis

//! init db
const database = require('./databases/init.mongodb');
const {
  checkOverload
} = require('./helpers/check.connect');
// checkOverload();
//! end init db

//! init routes
app.use('/', require('./routes/index.js'))
//! end init routes

//! handle error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: 'error',
    code: error.status || 500,
    message: error.message || 'Internal Server Error',
    stack: error.stack
  });
});
//! end handle error

module.exports = app;