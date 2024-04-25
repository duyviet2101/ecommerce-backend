const express = require('express');
const router = express.Router();

const productController = require('../../controllers/product.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
  authentication
} = require('../../auth/authUtils.js');

router.use(authentication);

router.post('/', asyncHandler(productController.createProduct));

module.exports = router;