const Discount = require('../models/discount.model.js');
const {
  default: mongoose
} = require('mongoose');

const {
  BadRequestError,
  NotFoundError,
} = require('../core/error.response.js');
const {
  queryProduct,
  getAllProducts
} = require('../models/repositories/product.repo.js');
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists
} = require('../models/repositories/discount.repo.js');

class DiscountService {

  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // check valid
    // if (!code || !start_date || !end_date || !shopId || !min_order_value || !product_ids || !applies_to || !name || !description || !type || !value || !max_value || !max_uses || !uses_count || !max_uses_per_user) {
    //   throw new BadRequestError('Invalid payload!');
    // }

    if (new Date(start_date) > new Date(end_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Invalid date range!');
    }

    const foundDiscount = await Discount.findOne({
      discount_code: code,
      discount_shopId: new mongoose.Types.ObjectId(shopId)
    }).lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code already exists!');
    }

    // return payload;

    const newDiscount = await Discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: [],
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: new mongoose.Types.ObjectId(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {

  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page
  }) {
    const foundDiscounts = await Discount.findOne({
      discount_code: code,
      discount_shopId: new mongoose.Types.ObjectId(shopId),
      discount_is_active: true,
      discount_start_date: {
        $lte: new Date()
      },
      discount_end_date: {
        $gte: new Date()
      },
    }).lean();

    if (!foundDiscounts) {
      throw new NotFoundError('Discount code not found!');
    }

    const {
      discount_product_ids,
      discount_applies_to
    } = foundDiscounts;
    let products;
    if (discount_applies_to === 'all') {
      products = await getAllProducts({
        limit: +limit,
        page: +page,
        filter: {
          product_shop: shopId,
          isPublished: true
        },
        sort: 'ctime',
        select: ['product_name']
      });
    } else if (discount_applies_to === 'specific') {
      products = await getAllProducts({
        limit: +limit,
        page: +page,
        filter: {
          product_shop: shopId,
          isPublished: true,
          _id: {
            $in: discount_product_ids
          }
        },
        sort: 'ctime',
        select: ['product_name']
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({
    limit,
    page,
    shopId
  }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: new mongoose.Types.ObjectId(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: Discount
    })

    return discounts;
  }

  static async getDiscountAmount({
    code,
    userId,
    shopId,
    products
  }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: code,
        discount_shopId: new mongoose.Types.ObjectId(shopId),
        discount_is_active: true,
        discount_users_used: {
          $nin: [userId]
        },
        discount_start_date: {
          $lte: new Date()
        },
        discount_end_date: {
          $gte: new Date()
        },
        discount_max_uses: {
          $gt: 0
        }
      },
      model: Discount
    })

    if (!foundDiscount) {
      throw new NotFoundError('Discount code not found!');
    }

    const {
      discount_type,
      discount_value,
      discount_min_order_value,
      discount_product_ids,
      discount_applies_to,
      discount_max_uses_per_user,
      discount_users_used
    } = foundDiscount;

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.product_price);
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError('Minimum order value not met!');
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsed = discount_users_used.filter(user => user === userId);
      if (userUsed && userUsed.length >= discount_max_uses_per_user) {
        throw new BadRequestError('Max uses per user reached!');
      }
    }

    const amount = discount_type === 'fix_amount' ? discount_value : (totalOrder * discount_value) / 100;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({
    shopId,
    code
  }) {
    const deletedDiscount = await Discount.findOneAndDelete({
      discount_code: code,
      discount_shopId: new mongoose.Types.ObjectId(shopId)
    });

    return deletedDiscount;
  }

  static async cancelDiscountCode({
    code,
    shopId,
    userId
  }) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: code,
        discount_shopId: new mongoose.Types.ObjectId(shopId),
      },
      model: Discount
    });

    if (!foundDiscount) {
      throw new NotFoundError('Discount code not found!');
    }

    const result = await Discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_uses_count: -1,
        discount_max_uses: 1 // increase max uses by 1 when user cancels the discount
      }
    }, {
      new: true
    });

    return result;
  }
}

module.exports = DiscountService;