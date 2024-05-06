const express = require('express');

const router = express.Router();

//! check api key
router.use(require('../auth/checkAuth.js').apiKey);
router.use(require('../auth/checkAuth.js').permission('0000'));

router.use('/v1/api/product', require('./product/index.js'));

router.use('/v1/api/discount', require('./discount/index.js'));

router.use('/v1/api', require('./access/index.js'));

module.exports = router;