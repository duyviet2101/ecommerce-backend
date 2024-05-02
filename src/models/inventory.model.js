const {
  model,
  Schema,
  Types
} = require('mongoose');


const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'inventories';

const inventorySchema = new Schema({
  inven_productId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  inven_location: {
    type: String,
    default: 'N/A'
  },
  inven_stock: {
    type: Number,
    required: true,
  },
  inven_shopId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Shop'
},
  inven_reserations: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

const Inventory = model(DOCUMENT_NAME, inventorySchema);
module.exports = Inventory;