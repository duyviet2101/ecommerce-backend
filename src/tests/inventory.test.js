const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {

  constructor() {
    redisPubSubService.subscribe('purchase_events', (channel, message) => {
      this.updateInventory(JSON.parse(message).productId, JSON.parse(message).quantity);
    });
  }

  static updateInventory(productId, quantity) {
    // update inventory
    console.log(`Updated inventory for product ${productId} with quantity ${quantity}`)
  }
}

module.exports = new InventoryServiceTest();