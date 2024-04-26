const ProductService = require("../services/product.service.js");
const {
  CREATED,
  OK,
  SuccessResponse
} = require("../core/success.response");


class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: 'Create product successfully',
      metadata: await ProductService.createProduct({
        type: req.body.product_type,
        payload: {
          ...req.body,
          product_shop: req.user.userId
        }
      })
    }).send(res);
  }
}

module.exports = new ProductController();