const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'shops'

const shopSchema = new Schema({
    name: {
        type: String,
        trim: true, // remove whitespace from both ends of a string
        maxLength: 150
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, shopSchema)