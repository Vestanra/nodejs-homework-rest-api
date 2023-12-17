import { HttpError } from "../helpers/index.js";

const isEmptyVerifyBody = async (req, res, next) => {
    const keys = Object.keys(req.body);
    if (!keys.length) {
        return next(HttpError(400, "missing required field email"))
    };
    next();
};

export default isEmptyVerifyBody;