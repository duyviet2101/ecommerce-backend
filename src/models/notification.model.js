const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'notifications';

// ORDER-001: order success
// ORDER-002: order failed
// PROMOTION-001: promotion
// SHOP-001: new product by user follow

const notificationSchema = new Schema({
  noti_type: {
    type: String,
    enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
    required: true
  },
  noti_senderId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Shop'
  },
  noti_receiverId: {
    type: Number,
    required: true
  },
  noti_content: {
    type: String,
    required: true
  },
  noti_options: {
    type: Object,
    default: {}
  },
}, {
  timestamps: true,
});

const Notification = model(DOCUMENT_NAME, notificationSchema, COLLECTION_NAME);
module.exports = Notification;