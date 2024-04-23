const {
    Schema,
    model
} = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'keys';

var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokenUsed: {
        type: Array,
        default: [],
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema);