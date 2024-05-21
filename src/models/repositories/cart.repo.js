const Cart = require('../cart.model');
const {
    Types
} = require('mongoose');


module.exports.findCartById = async (cartId) => {
    return Cart.findOne({
        _id: new Types.ObjectId(cartId),
        cart_status: 'active'
    }).lean();
};