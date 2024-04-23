const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const {
    createTokenPair
} = require("../auth/authUtils");
const {
    getInfoData
} = require("../utils");

const {
    BadRequestError,
    ForbiddenError,
    InternalServerError
} = require('../core/error.response.js');

const roleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({
        name,
        email,
        password
    }) => {
        const hodelShop = await shopModel.findOne({
            email
        }).lean(); // *lean() returns a plain JavaScript object, not a Mongoose document
        if (hodelShop)
            throw new BadRequestError('Email already exists');

        const passwordHash = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [roleShop.SHOP]
        })

        if (newShop) {
            //! create privateKey, publicKey

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            // console.log(`[P]::signUp::privateKey::`, privateKey);
            // console.log(`[P]::signUp::publicKey::`, publicKey);

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) throw new InternalServerError('Error create keyStore');

            //! end create privateKey, publicKey
            //! create tokenPair
            const tokens = await createTokenPair({
                userId: newShop._id,
                email
            }, publicKey, privateKey);
            // console.log(`[P]::signUp::tokens::`, tokens);

            return {
                shop: getInfoData({
                    fileds: ['_id', 'name', 'email', 'status', 'roles'],
                    object: newShop
                }),
                tokens
            }
            //! end create tokenPair
        }

        throw new InternalServerError('Error create shop');
    }

}

module.exports = AccessService;