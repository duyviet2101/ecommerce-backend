const Cart = require('../models/cart.model');

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
      'cart_products._id': productId
    };
    
    return await Cart.findOneAndUpdate(query, {
      $set: {
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

    if (userCart.cart_products.length === 0) {
      userCart.cart_products.push(product);
      userCart.cart_count_product = userCart.cart_products.length;
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product
    });
  }

  
}

module.exports = CartService;