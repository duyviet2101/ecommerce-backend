//FACTORY PATTERN
const {
  model,
  Schema,
  Types
} = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_slug: {
    type: String,
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
  product_ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating must be at most 5'],
    set: (value) => Math.round(value * 10) / 10,
  },
  product_variations: {
    type: Array,
    default: [],
  },
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: false,
  },
}, {
  collection: COLLECTION_NAME,
  timestamps: true,
});

// create index
productSchema.index({
  product_name: 'text',
  product_description: 'text',
})

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, {
    lower: true
  });
  next();
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

const furnitureSchema = new Schema({
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
  collection: 'furniture',
  timestamps: true,
});

module.exports = {
  Product: model(DOCUMENT_NAME, productSchema),
  Clothing: model('Clothing', clothingSchema),
  Electronics: model('Electronics', electronicsSchema),
  Furniture: model('Furniture', furnitureSchema),
};