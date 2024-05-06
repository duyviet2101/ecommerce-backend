const DiscountService = require("../services/discount.service");
const {
    CREATED,
    OK,
    SuccessResponse
} = require("../core/success.response");


class DiscountController {
  
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create discount code successfully!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res);
  }

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all discount codes successfully!',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        shopId: req.user.userId,
        ...req.query
      })
    }).send(res);
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get discount amount successfully!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      })
    }).send(res);
  }

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all discount codes with product successfully!',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res);
  }

  updateDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update discount code successfully!',
      metadata: await DiscountService.updateDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res);
  }
}

module.exports = new DiscountController();