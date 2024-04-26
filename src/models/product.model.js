const {
  model,
  Schema,
  Types
} = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';

const productSchema = new Schema({
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
    type: Schema.Types.Mixed,
    required: true,
  },
}, {
  collection: COLLECTION_NAME,
  timestamps: true,
});

// define product type = clothing

const clothingSchema = new Schema({
  product_shop: {
    type: Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  material: String,

}, {
  collection: 'clothers',
  timestamps: true,
});

// define product type = electronics
const electronicsSchema = new Schema({
  product_shop: {
    type: Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  color: {
    type: String,
  },
}, {
  collection: 'electronics',
  timestamps: true,
});

module.exports = {
  Product: model(DOCUMENT_NAME, productSchema),
  Clothing: model('Clothing', clothingSchema),
  Electronics: model('Electronics', electronicsSchema),
};