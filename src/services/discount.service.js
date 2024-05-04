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
const { findAllDiscountCodesUnSelect } = require('../models/repositories/discount.repo.js');

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
      apllies_to,
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
    if (!code || !start_date || !end_date || !shopId || !min_order_value || !product_ids || !apllies_to || !name || !description || !type || !value || !max_value || !max_uses || !uses_count || !max_uses_per_user) {
      throw new BadRequestError('Invalid payload!');
    }

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
      discount_applies_to: apllies_to,
      discount_product_ids: product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {

  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page
  }) {
    const foundDiscounts = await Discount.find({
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
  }
}

module.exports = DiscountService;