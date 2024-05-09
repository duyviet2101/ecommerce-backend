const Cart = require("../models/cart.model");
const {
  findCartById
} = require("../models/repositories/cart.repo");

const {
  NotFoundError,
  BadRequestError
} = require("../core/error.response");
const { checkProdutByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

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
}

module.exports = CheckoutService;