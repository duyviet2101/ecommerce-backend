const express = require('express');
const CheckoutController = require('../../controllers/checkout.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
    authentication
} = require('../../auth/authUtils.js');

router.post('/review', asyncHandler(authentication), asyncHandler(CheckoutController.checkoutReview));

module.exports = router;