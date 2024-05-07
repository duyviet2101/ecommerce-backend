const {
  model, 
  Schema
} = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

const cartSchema = new Schema({
  cart_status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'cancelled', 'pending'],
    default: 'active'
  },
  cart_products: {
    type: Array,
    required: true,
    default: []
  },
  cart_count_product: {
    type: Number,
    required: true,
    default: 0
  },
  cart_userId: {
    type: Number,
    required: true
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, cartSchema, COLLECTION_NAME);