const httpStatusCode = require('../utils/httpStatusCode.js')


class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = httpStatusCode.ReasonPhrases.FORBIDDEN, status = httpStatusCode.StatusCodes.FORBIDDEN) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = httpStatusCode.ReasonPhrases.BAD_REQUEST, status = httpStatusCode.StatusCodes.BAD_REQUEST) {
        super(message, status)
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message = httpStatusCode.ReasonPhrases.INTERNAL_SERVER_ERROR, status = httpStatusCode.StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, status)
    }
}

class ConflictError extends ErrorResponse {
    constructor(message = httpStatusCode.ReasonPhrases.CONFLICT, status = httpStatusCode.StatusCodes.CONFLICT) {
        super(message, status)
    }
}

module.exports = {
    BadRequestError,
    ForbiddenError,
}