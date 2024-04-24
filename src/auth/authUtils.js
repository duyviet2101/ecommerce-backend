const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const {
    AuthenticationError,
    NotFoundError
} = require('../core/error.response');
const {
    findByUserId
} = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
}

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

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1. Check userId missing?
     * 2. Get accessToken
     * 3. Verify accessToken
     * 4. Check user in dbs
     * 5. Check keyStore with this userId
     * 6. OK all => retrun next()
     */

    //1.
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthenticationError('Missing userId');

    //2.
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('KeyStore not found');

    //3. 
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthenticationError('Missing accessToken');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthenticationError('Invalid accessToken');
        req.keyStore = keyStore;
        // console.log(`[P]::authentication::decodeUser::`, req.keyStore);
        return next();
    } catch (error) {
        throw error;
    }
});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}