const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '30 days'
        });

        // JWT.verify(accessToken, publicKey, (err, decode) => {
        //     if (err) {
        //         console.log(`[P]::createTokenPair::accessToken::err::`, err);
        //     } else {
        //         console.log(`[P]::createTokenPair::accessToken::decode::`, decode);
        //     }
        // });

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        return error;
    }
}

module.exports = {
    createTokenPair
}