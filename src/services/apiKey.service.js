const apiKeyModel = require('../models/apikey.model.js');

const findById = async (key) => {
  const objKey = await apiKeyModel.findOne({
    key,
    status: true
  }).lean();

  return objKey;
}

const create = async (key, permissions = ['0000']) => {
  const objKey = await apiKeyModel.create({
    key,
    status: true,
    permissions: permissions
  });

  return objKey;
}

module.exports = {
  findById,
  create
}