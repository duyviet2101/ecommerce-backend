const { findById, create } = require("../services/apiKey.service");

const crypto = require('crypto');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(401).json({
        code: '401',
        message: 'Unauthorized',
        status: 'error'
      })
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(401).json({
        code: '401',
        message: 'Unauthorized',
        status: 'error'
      })
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    
  }
}

const permission = (permission) => {
  return async (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        code: '403',
        message: 'Forbidden',
        status: 'error'
      })
    }

    // console.log(`[P]::permission::req.objKey.permissions::`, req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        code: '403',
        message: 'Forbidden',
        status: 'error'
      })
    }

    return next();
  }
}

module.exports = {
  apiKey,
  permission
}