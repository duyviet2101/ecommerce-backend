const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const roleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async({name, email, password}) => {
        try {
            const hodelShop = await shopModel.findOne({email}).lean(); // *lean() returns a plain JavaScript object, not a Mongoose document
            if (hodelShop)
                return {
                    code: '400',
                    message: 'Email already exists',
                    status: 'error'
                }
            
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [roleShop.SHOP]
            })

            if (newShop) {
                //! create privateKey, publicKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1', // pkcs1: RSA public key format - public key cryptography standard #1
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })

                // console.log(`[P]::signUp::privateKey::`, privateKey);
                // console.log(`[P]::signUp::publicKey::`, publicKey);

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })
                if (!publicKeyString)
                {
                    return {
                        code: '500',
                        message: 'Error create publicKey',
                        status: 'error'
                    }
                }
                //! end create privateKey, publicKey
                const publicKeyObject = crypto.createPublicKey(publicKey);
                // console.log(`[P]::signUp::publicKeyObject::`, publicKeyObject);
                //! create tokenPair
                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email
                }, publicKeyObject, privateKey);
                // console.log(`[P]::signUp::tokens::`, tokens);

                return {
                    code: '201',
                    metadata: {
                        shop: getInfoData({
                            fileds: ['_id', 'name', 'email', 'status', 'roles'],
                            object: newShop
                        }),
                        tokens
                    }
                }
                //! end create tokenPair
            }

            return {
                code: '500',
                message: 'Error create shop',
                status: 'error'
            }
        } catch (error) {
            return {
                code: '500',
                message: error.message,
                status: 'error'
            }
        }
    }

}

module.exports = AccessService;