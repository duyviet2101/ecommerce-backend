const {
    model,
    Schema
} = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema({
    order_userId: {
        type: Number,
        required: true
    },
    order_checkout: {
        type: Object,
        default: {}
    },
    order_shipping: {
        type: Object,
        default: {}
    },
    order_payment: {
        type: Object,
        default: {}
    },
    order_products: {
        type: Array,
        required: true
    },
    order_trackingNumber: {
        type: String,
        default: ""
    },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const Order = model(DOCUMENT_NAME, orderSchema);