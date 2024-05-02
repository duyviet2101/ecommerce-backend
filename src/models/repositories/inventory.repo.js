const Inventory = require("../inventory.model");
const {
  Types
} = require("mongoose");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "N/A"
}) => {
  return await Inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId
  })
}

module.exports = {
  insertInventory
}