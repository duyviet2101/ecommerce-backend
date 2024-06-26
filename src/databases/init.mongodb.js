const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const {db : {host, port, name}} = require('../configs/config.mongodb.js')
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = 'mongodb') {
        if (0 === 1) {
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