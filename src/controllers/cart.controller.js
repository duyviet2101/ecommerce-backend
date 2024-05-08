const CartService = require('../services/cart.service');
const {
  CREATED,
  OK,
  SuccessResponse
} = require('../core/success.response');

class CartController {

  addToCart = async (req, res, next) => {
    new CREATED({
      message: 'Add to cart successfully',
      metadata: await CartService.addToCart({
        ...req.body,
      })
    }).send(res);
  }

  updateCart = async (req, res, next) => {
    new OK({
      message: 'Update cart successfully',
      metadata: await CartService.addToCartV2({
        ...req.body,
      })
    }).send(res);
  }

  delete = async (req, res, next) => {
    new OK({
      message: 'Delete cart successfully',
      metadata: await CartService.deleteUserCart({
        ...req.body,
      })
    }).send(res);
  }

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List cart successfully',
      metadata: await CartService.getListUserCart({
        ...req.query,
      })
    }).send(res);
  }

}

module.exports = new CartController();