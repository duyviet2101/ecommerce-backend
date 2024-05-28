const { Types } = require('mongoose');
const Comment = require('../models/comment.model');
const { NotFoundError } = require('../core/error.response');

class CommentService {

  /**
   * key features: Comment service
   * 1. Add comment [use, shop]
   * 2. get list comment
   * 3. delete comment
   */

  static async createComment ({
    productId, userId, content, parentCommentId = null
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError('Parent comment not found');
      }
      rightValue = parentComment.comment_right;

      await Comment.updateMany({
        comment_productId: new Types.ObjectId(productId),
        comment_right: { $gte: rightValue }
      }, {
        $inc: { comment_right: 2 }
      });

      await Comment.updateMany({
        comment_productId: new Types.ObjectId(productId),
        comment_left: { $gte: rightValue }
      }, {
        $inc: { comment_left: 2 }
      });
    } else {

      const maxRightValue = await Comment.findOne({
        comment_productId: new Types.ObjectId(productId),
      }, 'comment_right', { sort: { comment_right: -1 } });

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();

    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) {
        throw new NotFoundError('Parent comment not found');
      }

      const comments = await Comment.find({
        comment_productId: new Types.ObjectId(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right }
      })
        .select({
          comment_content: 1,
          comment_left: 1,
          comment_right: 1,
          comment_parentId: 1
        })
        .sort({ comment_left: 1 }).limit(limit).skip(offset);

      return comments;
    }

    const comments = await Comment.find({
      comment_productId: new Types.ObjectId(productId),
      comment_parentId: null
    })
      .select({
        comment_content: 1,
        comment_left: 1,
        comment_right: 1,
        comment_parentId: 1
      })
      .sort({ comment_left: 1 }).limit(limit).skip(offset);

    return comments;
  }

}

module.exports = CommentService;