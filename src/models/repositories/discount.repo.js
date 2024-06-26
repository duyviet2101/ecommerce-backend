const {
  getSelectData,
  getUnSelectData
} = require('../../utils/index.js');


module.exports.findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
  model
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {
    _id: -1
  } : {
    _id: 1
  };

  const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return products;
};

module.exports.findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {
    _id: -1
  } : {
    _id: 1
  };

  const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

module.exports.checkDiscountExists = async ({
  model,
  filter
}) => {
  const discount = await model.findOne(filter).lean();

  return discount;
}