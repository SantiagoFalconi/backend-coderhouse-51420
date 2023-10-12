import EErrors from "../errors/enum.js";

export default (error, req, res, next) => {
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: 'error', error: error.message});
            break;
        default:
            next();
    }
};