const express = require('express');
const router = express.Router();

const accessController = require('../../controllers/access.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');

router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router;