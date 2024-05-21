const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const {
  findCartById
} = require("../models/repositories/cart.repo");

const {
  NotFoundError,
  BadRequestError
} = require("../core/error.response");
const { checkProdutByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  static async checkoutReview({
    cartId,
    userId,
    shop_order_ids
  }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new NotFoundError("Cart not found");
    }

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    },
    shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId, shop_discounts = [],
        item_products = []
      } = shop_order_ids[i];

      const checkProdutServer = await checkProdutByServer(item_products);

      if (!checkProdutByServer[0]) {
        throw new NotFoundError("Product not found");
      }

      const checkoutPrice = checkProdutByServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price);
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProdutByServer
      };

      if (shop_discounts.length > 0) {
        const {totalPrice = 0, discount = 0} = await getDiscountAmount({
          code: shop_discounts[0].code,
          userId,
          shopId,
          products: checkProdutByServer
        });

        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      order_shop_ids_new.push(itemCheckout);
    };

    return {
      checkout_order: checkoutOrder,
      shop_order_ids,
      shop_order_ids_new
    }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const {
      shop_order_ids_new,
      checkout_order
    } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    });

    // check lai xem vuot ton kho hay khong?
    const products = shop_order_ids_new.flatMap(order => order.item_products);
    const acquireLock = [];
    for (let i = 0; i < products.length; i++) {
      const {productId, quantity} = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireLock.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    //check san pham het hang trong kho
    if (acquireLock.includes(false)) {
      throw new BadRequestError("Some products are updated, please check again");
    }

    const newOrder = await Order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    });

    // neu insert thanh cong, remove product trong cart
    if (newOrder) {

    }

    return newOrder;
  }

  /**
   * 1. query orders 
   * 2. query one order
   * 3. cancel order
   * 4. update order [shop | admin]
   */

}

module.exports = CheckoutService;