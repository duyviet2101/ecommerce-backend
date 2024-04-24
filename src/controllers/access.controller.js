const AccessService = require("../services/access.service");
const {
    CREATED,
    OK,
    SuccessResponse
} = require("../core/success.response");


class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        console.log('req.body.refreshToken:::', req.body.refreshToken)
        
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res);
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Sign up successfully',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login successfully',
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
}

module.exports = new AccessController();