const express = require('express');
const router = express.Router();

const productController = require('../../controllers/product.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
  authentication
} = require('../../auth/authUtils.js');

router.get('/search/:keySearch', asyncHandler(productController.searchProduct));
router.get('', asyncHandler(productController.getAllProducts));
router.get('/:id', asyncHandler(productController.getProduct));

router.use(authentication);

router.post('/', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProduct));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProduct));

// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop));

module.exports = router;