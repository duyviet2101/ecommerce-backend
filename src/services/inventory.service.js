const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'N/A'
    }) {
        const product = await Product.findOne({
            _id: productId,
            product_shop: shopId
        });
        if (!product) {
            throw new Error('Product not found');
        }
        
        const query = {
            inven_productId: productId,
            inven_shopId: shopId
        };
        const update = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        };
        const options = {
            new: true,
            upsert: true
        };

        return await Inventory.findOneAndUpdate(query, update, options);
    }
};

module.exports = InventoryService;