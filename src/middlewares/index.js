const Logger = require('../loggers/discord.log');

const pushToLogDiscord = async (req, res, next) => {
    try {
        Logger.sendToFormatCode({
            title: `method: ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`
        });
        console.log('nextttt')
        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    pushToLogDiscord
}