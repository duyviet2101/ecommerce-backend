const {
  BadRequestError
} = require('../core/error.response.js')

const {
  Product,
  Clothing,
  Electronics,
  Furniture
} = require('../models/product.model.js')
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  queryProduct,
  unPublishProductByShop,
  searchProductByUser,
  getAllProducts,
  getProduct,
  updateProductById
} = require('../models/repositories/product.repo.js')
const { removeUndefined, updateNestedObjectParser } = require('../utils/index.js')

//  define factory class
class ProductFactory {
  /**
   * type: 'Clothing' | 'Electronics'
   */

  static productRegistry = {}

  static registerProductType(type, productClass) {
    ProductFactory.productRegistry[type] = productClass
  }

  static async createProduct({
    type,
    payload
  }) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid product type::: ${type}`);
    }

    return await new productClass(payload).createProduct();
  }

  static async updateProduct({
    type,
    payload,
    productId
  }) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid product type::: ${type}`);
    }

    return await new productClass(payload).updateProduct(productId);
  }

  //PUT
  static async publishProductByShop({
    product_shop,
    product_id
  }) {
    return await publishProductByShop({
      product_shop,
      product_id
    });
  }
  static async unPublishProductByShop({
    product_shop,
    product_id
  }) {
    return await unPublishProductByShop({
      product_shop,
      product_id
    });
  }

  // query
  static async findAllDraftsForShop({
    product_shop,
    limit = 50,
    skip = 0
  }) {
    const query = {
      product_shop,
      isDraft: true
    };
    return await queryProduct({
      query,
      limit,
      skip,
    });
  }

  static async findAllPublishedForShop({
    product_shop,
    limit = 50,
    skip = 0
  }) {
    const query = {
      product_shop,
      isPublished: true
    };
    return await queryProduct({
      query,
      limit,
      skip,
    });
  }

  static async searchProduct({
    keySearch
  }) {
    return await searchProductByUser({
      keySearch
    });
  }

  static async getAllProducts({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter = {
      isPublished: true
    }
  }) {
    return await getAllProducts({
      limit,
      page,
      sort,
      filter,
      select: ['product_name', 'product_price', 'product_thumb']
    })
  }

  static async getProduct({
    product_id
  }) {
    return await getProduct({
      product_id,
      unSelect: ['__v']
    });
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
  async createProduct(product_id) {
    return await Product.create({
      ...this,
      _id: product_id
    });
  }

  // update product
  async updateProduct(productId, bodyUpdate) {
    return updateProductById({
      productId,
      bodyUpdate,
      model: Product,
    })
  }
}

// define sub-class for different product types
class ClothingClass extends ProductBase {
  async createProduct() {
    const newClothing = await Clothing.create({
      product_shop: this.product_shop,
      ...this.product_attributes
    });
    if (!newClothing)
      throw new BadRequestError('Failed to create new clothing product');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new BadRequestError('Failed to create new product');

    return newProduct;
  }

  async updateProduct(productId) {
    //1. remove null/undefined fields
    const objectParams = removeUndefined(this);
    //2. Check update product attributes or not?
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: Clothing,
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

class ElectronicsClass extends ProductBase {
  async createProduct() {
    const newElectronics = await Electronics.create({
      product_shop: this.product_shop,
      ...this.product_attributes
    });
    if (!newElectronics)
      throw new BadRequestError('Failed to create new electronics product');

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct)
      throw new BadRequestError('Failed to create new product');

    return newProduct;
  }

  async updateProduct(productId) {
    //1. remove null/undefined fields
    const objectParams = removeUndefined(this);
    //2. Check update product attributes or not?
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: Electronics,
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

class FurnitureClass extends ProductBase {
  async createProduct() {
    const newFurniture = await Furniture.create({
      product_shop: this.product_shop,
      ...this.product_attributes
    });
    if (!newFurniture)
      throw new BadRequestError('Failed to create new furniture product');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct)
      throw new BadRequestError('Failed to create new product');

    return newProduct;
  }

  async updateProduct(productId) {
    //1. remove null/undefined fields
    const objectParams = removeUndefined(this);
    //2. Check update product attributes or not?
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: Furniture,
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

// register product type
ProductFactory.registerProductType('Clothing', ClothingClass);
ProductFactory.registerProductType('Electronics', ElectronicsClass);
ProductFactory.registerProductType('Furniture', FurnitureClass);

module.exports = ProductFactory;