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

const reservationInventory = async ({
  productId,
  quantity,
  cartId
}) => {
  const query = {
    inven_productId: Types.ObjectId(productId),
    inven_stock: {
      $gte: quantity
    }
  };
  const update = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createdAt: new Date()
      }
    }
  }
  const options = {
    new: true,
    upsert: true
  }

  return await Inventory.updateOne(query, update, options);
}

module.exports = {
  insertInventory,
  reservationInventory
}