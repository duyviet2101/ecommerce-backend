const {
  Product,
  Clothing,
  Electronics,
  Furniture,
} = require('../product.model.js');

const {
  Types
} = require('mongoose');

const {
  getSelectData,
  getUnSelectData
} = require('../../utils/index.js');

const getAllProducts = async ({
  limit,
  page,
  sort,
  filter,
  select
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {
    _id: -1
  } : {
    _id: 1
  };

  const products = await Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products;
}

const getProduct = async ({
  product_id,
  unSelect
}) => {
  return await Product.findById(product_id).select(getUnSelectData(unSelect)).lean().exec();
}

const findAllDraftsForShop = async ({
  query,
  limit,
  skip
}) => {
  return await Product.find(query).
  populate('product_shop', 'name email -_id')
    .sort({
      updatedAt: -1
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllPublishedForShop = async ({
  query,
  limit,
  skip
}) => {
  return await Product.find(query).
  populate('product_shop', 'name email -_id')
    .sort({
      updatedAt: -1
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

const queryProduct = async ({
  query,
  limit,
  skip
}) => {
  return await Product.find(query).
  populate('product_shop', 'name email -_id')
    .sort({
      updatedAt: -1
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

const searchProductByUser = async ({
  keySearch
}) => {
  const regexSearch = new RegExp(keySearch, 'i');
  const result = await Product.find({
    $text: {
      $search: regexSearch
    },
    isPublished: true
  }, {
    score: {
      $meta: 'textScore'
    }
  }).sort({
    score: {
      $meta: 'textScore'
    }
  }).lean().exec();
  return result;
}

const publishProductByShop = async ({
  product_shop,
  product_id
}) => {
  const foundShop = await Product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  });
  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const res = await foundShop.updateOne(foundShop);
  return res;
}

const unPublishProductByShop = async ({
  product_shop,
  product_id
}) => {
  const foundShop = await Product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  });
  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const res = await foundShop.updateOne(foundShop);
  return res;
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  queryProduct,
  unPublishProductByShop,
  searchProductByUser,
  getAllProducts,
  getProduct
};