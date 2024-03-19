const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const connectString = `mongodb://localhost:27017/shopDEV`;

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }

        mongoose.connect(connectString)
            .then(() => {
                console.log(`Connect mongodb successfully`);
            })
            .catch((error) => {
                console.log(`Connect mongodb failure: ${error}`);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;