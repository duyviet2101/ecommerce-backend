const { Types } = require('mongoose');
const Comment = require('../models/comment.model');
const { Product } = require('../models/product.model');
const { NotFoundError } = require('../core/error.response');
const { getProduct } = require('../models/repositories/product.repo');

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

  static async deleteComments({
    commentId, 
    productId
  }) {
    // check product exist db
    const fountProduct = await Product.findById(productId);
    if (!fountProduct) {
      throw new NotFoundError('Product not found');
    }

    //1.xac dinh ledt vs right of commendid
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    const left = comment.comment_left;
    const right = comment.comment_right;

    //2. calculate width (number of nodes) of comment left - right + 1
    const width = right - left + 1;
    //3. delete all comment between left and right
    await Comment.deleteMany({
      comment_productId: new Types.ObjectId(productId),
      comment_left: { $gte: left, $lte: right },
    })
    //4. update left of all comment left, right
    await Comment.updateMany({
      comment_productId: new Types.ObjectId(productId),
      comment_right: { $gt: right }
    }, {
      $inc: { comment_right: -width }
    });

    await Comment.updateMany({
      comment_productId: new Types.ObjectId(productId),
      comment_left: { $gt: right }
    }, {
      $inc: { comment_left: -width }
    });
  }
}

module.exports = CommentService;