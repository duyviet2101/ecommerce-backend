const Redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();

    this.subscriber.on('error', (err) => {
      console.log(`Error: ${err}`);
    });

    this.publisher.on('error', (err) => {
      console.log(`Error: ${err}`);
    });
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      // if (this.publisher.isOpen === false) {
      //   this.publisher.connect();
      // }

      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message);
      }
    });
  }

  close() {
    this.subscriber.quit();
    this.publisher.quit();
  }
}

module.exports = new RedisPubSubService();