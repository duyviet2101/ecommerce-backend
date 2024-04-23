const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'apikeys';

const apikeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222'] // * 0000: read, 1111: write, 2222: admin
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const ApiKey = model(DOCUMENT_NAME, apikeySchema);

module.exports = ApiKey;