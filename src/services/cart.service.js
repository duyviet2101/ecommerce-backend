const Cart = require('../models/cart.model');
const {
  getProduct
} = require('../models/repositories/product.repo');

const {
  NotFoundError
} = require('../core/error.response.js');
const { Types } = require('mongoose');

class CartService {
  // repo cart
  static async createUserCart({
    userId,
    product
  }) {
    const query = {
      cart_userId: userId,
      cart_status: 'active'
    };

    return await Cart.findOneAndUpdate(query, {
      $push: {
        cart_products: product
      },
      $inc: {
        cart_count_product: 1
      }
    }, {
      upsert: true,
      new: true
    });
  }

  static async updateUserCartQuantity({
    userId,
    product
  }) {
    const {
      productId,
      quantity
    } = product;

    const query = {
      cart_userId: userId,
      cart_status: 'active',
      'cart_products.productId': productId
    };

    return await Cart.findOneAndUpdate(query, {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }, {
      new: true
    });
  }
  // end repo cart

  static async addToCart({
    userId,
    product = {}
  }) {

    const userCart = await Cart.findOne({
      cart_userId: userId
    });

    if (!userCart) {
      return await CartService.createUserCart({
        userId,
        product
      });
    }

    // if (userCart.cart_products.length === 0) {
    //   userCart.cart_products.push(product);
    //   userCart.cart_count_product = userCart.cart_products.length;
    //   return await userCart.save();
    // }
    if (userCart.cart_products.filter(p => p.productId === product.productId).length === 0) {
      userCart.cart_products.push(product);
      userCart.cart_count_product = userCart.cart_products.length;
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product
    });
  }

  static async addToCartV2({
    userId,
    shop_order_ids = {}
  }) {
    const {
      productId,
      quantity,
      old_quantity
    } = shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProduct({
      product_id: new Types.ObjectId(productId)
    });

    if (!foundProduct) {
      throw new NotFoundError('Product not found');
    }

    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError('Product not found');
    }

    if (quantity === 0) {
      // remove product from cart
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    });
    
  }

  static async deleteUserCart({
    userId,
    productId
  }) {
    const query = {
      cart_userId: +userId,
      cart_status: 'active',
      'cart_products.productId': productId
    };

    console.log(query); 

    return await Cart.findOneAndUpdate(query, {
      $pull: {
        cart_products: {
          productId: productId
        }
      },
      $inc: {
        cart_count_product: -1
      }
    }, {
      new: true
    });
  }

  static async getListUserCart({
    userId
  }) {
    return await Cart.findOne({
      cart_userId: +userId,
      cart_status: 'active'
    });
  }
}

module.exports = CartService;