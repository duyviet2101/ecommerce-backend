const httpStatusCode = require('../utils/httpStatusCode.js')

class SuccessResponse {
    constructor({message, statusCode = httpStatusCode.StatusCodes.OK, reasonStatusCode = httpStatusCode.ReasonPhrases.OK, metadata = {}}) {
        this.message = message
        this.statusCode = statusCode
        this.reasonStatusCode = reasonStatusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.statusCode).json(this)
    }
}


class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse {
    constructor({options = {}, message, statusCode = httpStatusCode.StatusCodes.CREATED, reasonStatusCode = httpStatusCode.ReasonPhrases.CREATED, metadata}) {
        super({message, statusCode, reasonStatusCode, metadata})
        this.options = options
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}