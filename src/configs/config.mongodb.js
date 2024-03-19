const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'dbDEV'
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3056
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'dbPRO'
    }
}

const config = process.env.NODE_ENV === 'pro' ? pro : dev;
module.exports = config;