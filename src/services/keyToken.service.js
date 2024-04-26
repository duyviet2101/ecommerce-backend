const keytokenModel = require("../models/keytoken.model");
const {
    Types
} = require('mongoose');

class KeyTokenService {

    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken
    }) => {
        try {
            const filter = {
                user: userId
            };
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            };
            const options = {
                upsert: true,
                new: true
            };

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({
            user: new Types.ObjectId(userId)
        });
    };

    static removeKeyById = async (id) => {
        return await keytokenModel.findByIdAndDelete(id).select('_id');
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({
            refreshTokenUsed: refreshToken
        });
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({
            refreshToken
        });
    }

    static deleteKeyByUserId = async (userId) => {
        return await keytokenModel.findByIdAndDelete(userId).select('_id');
    };
}

module.exports = KeyTokenService;