const express = require('express');

const router = express.Router();

const { pushToLogDiscord } = require('../middlewares/index.js');

router.use(pushToLogDiscord);

//! check api key
router.use(require('../auth/checkAuth.js').apiKey);
router.use(require('../auth/checkAuth.js').permission('0000'));

router.use('/v1/api/checkout', require('./checkout/index.js'));

router.use('/v1/api/inventory', require('./inventory/index.js'));

router.use('/v1/api/product', require('./product/index.js'));

router.use('/v1/api/discount', require('./discount/index.js'));

router.use('/v1/api/cart', require('./cart/index.js'));

router.use('/v1/api/comment', require('./comment/index.js'));

router.use('/v1/api/notification', require('./notification/index.js'));

router.use('/v1/api', require('./access/index.js'));

module.exports = router;