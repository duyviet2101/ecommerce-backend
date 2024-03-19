const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

//! init middleware
app.use(morgan('dev')); //* app.use(morgan('combined'));
app.use(helmet()); //* che giấu thông tin header, bảo vệ khỏi các cuộc tấn công
app.use(compression()); //* giảm dung lượng trả về cho client
//! end init middleware

//! init db
const database = require('./databases/init.mongodb');
const {checkOverload} = require('./helpers/check.connect');
// checkOverload();
//! end init db

//! init routes
app.get('/', (req, res) => {
    const strCompress = 'Hello World';
    res.status(200).json({
        message: strCompress
    });
});
//! end init routes

//! handle error
//! end handle error

module.exports = app;