const {
  BadRequestError
} = require('../core/error.response.js')

const {
  Product,
  Clothing,
  Electronics
} = require('../models/product.model.js')

//  define factory class
class ProductFactory {
  /**
   * type: 'Clothing' | 'Electronics'
   */
  static async createProduct({
    type,
    payload
  }) {
    switch (type) {
      case 'Clothing':
        return await new ClothingClass(payload).createProduct();
      case 'Electronics':
        return await new ElectronicsClass(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type::: ${type}`);
    }
  }
}

/*
  product_name: {
    type: String,
    required: true,
  },
  product_thumb: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Furniture']
  },
  product_shop: {
    type: Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  product_attributes: {
    type: Types.Mixed,
    required: true,
  },
*/

// define base product class
class ProductBase {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct() {
    return await Product.create(this);
  }
}

// define sub-class for different product types
class ClothingClass extends ProductBase {
  async createProduct() {
    const newClothing = await Clothing.create(this.product_attributes);
    if (!newClothing)
      throw new BadRequestError('Failed to create new clothing product');

    const newProduct = await super.createProduct();
    if (!newProduct)
      throw new BadRequestError('Failed to create new product');

    return newProduct;
  }
}

class ElectronicsClass extends ProductBase {
  async createProduct() {
    const newElectronics = await Electronics.create(this.product_attributes);
    if (!newElectronics)
      throw new BadRequestError('Failed to create new electronics product');

    const newProduct = await super.createProduct();
    if (!newProduct)
      throw new BadRequestError('Failed to create new product');

    return newProduct;
  }
}

module.exports = ProductFactory;