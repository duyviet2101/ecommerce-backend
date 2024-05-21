const redis = require('redis');

const redisClient = redis.createClient();
const {promisify} = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');

const pexpire = promisify(redisClient.pExpire).bind(redisClient); 
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock:${productId}`;
    const retryTimes = 5;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        // tao key, thang nao giu key thi duoc mua hang
        const result = await setnxAsync(key, expireTime);
        if (result === 1) {
            // thao tac voi inventory
            const isReveration = await reservationInventory({
                productId,
                quantity,
                cartId
            });
            if (isReveration.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

const releaseLock = async (key) => {
    return await redisClient.del(key);
}

module.exports = {
    acquireLock,
    releaseLock
};