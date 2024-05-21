const express = require('express');
const InventoryController = require('../../controllers/inventory.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
    authentication
} = require('../../auth/authUtils.js');

router.use(authentication);
router.post('', asyncHandler(InventoryController.addStockToInventory));

module.exports = router;