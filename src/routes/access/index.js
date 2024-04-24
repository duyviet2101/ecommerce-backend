const express = require('express');
const router = express.Router();

const accessController = require('../../controllers/access.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
  authentication
} = require('../../auth/authUtils.js');

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

//authentication
router.use(authentication);
//end authentication

router.use('/shop/logout', asyncHandler(accessController.logout));
router.use('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

module.exports = router;