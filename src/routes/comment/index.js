const express = require('express');
const CommentController = require('../../controllers/comment.controller.js');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler.js');
const {
    authentication
} = require('../../auth/authUtils.js');

router.use(authentication);

router.post('', asyncHandler(CommentController.createComment));

router.get('', asyncHandler(CommentController.getCommentsByParentId));

module.exports = router;