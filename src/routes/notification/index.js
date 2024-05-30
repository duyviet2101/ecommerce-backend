const express = require('express');
const router = express.Router();
const NotificationController = require('../../controllers/notification.controller');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
    authentication
} = require('../../auth/authUtils.js');

router.use(authentication);

router.get('', asyncHandler(NotificationController.listNotiByUser));

module.exports = router;