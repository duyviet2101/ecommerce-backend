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

  publishProduct = async (req, res, next) => {
    new OK({
      message: 'Publish product successfully',
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res);
  }

  unPublishProduct = async (req, res, next) => {
    new OK({
      message: 'Unpublish product successfully',
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res);
  }

  // query
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all draft for shop successfully',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
        limit: req.query.limit || 50,
        skip: req.query.skip || 0
      })
    }).send(res);
  }

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all published for shop successfully',
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId,
        limit: req.query.limit || 50,
        skip: req.query.skip || 0
      })
    }).send(res);
  }

  searchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all search product successfully',
      metadata: await ProductService.searchProduct({
        keySearch: req.params.keySearch
      })
    }).send(res);
  }

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all products successfully',
      metadata: await ProductService.getAllProducts({
        limit: req.query.limit || 50,
        skip: req.query.skip || 0
      })
    }).send(res);
  }

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get product successfully',
      metadata: await ProductService.getProduct({
        product_id: req.params.id
      })
    }).send(res);
  }
}

module.exports = new ProductController();