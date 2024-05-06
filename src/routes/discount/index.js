const express = require('express');
const router = express.Router();

const discountController = require('../../controllers/discount.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
  authentication
} = require('../../auth/authUtils.js');

router.post('/amount', asyncHandler(discountController.getDiscountAmount));

router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct));

router.use(authentication);

router.get('/', asyncHandler(discountController.getAllDiscountCodesByShop));

router.post('/', asyncHandler(discountController.createDiscountCode));

module.exports = router;