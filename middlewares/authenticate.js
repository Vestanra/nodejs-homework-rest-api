import jwt from "jsonwebtoken";
import dotevn from "dotenv";
import { HttpError } from "../helpers/index.js";
import { User } from "../models/User.js";

dotevn.config();

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not authorized"))
    }
    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            return next(HttpError(401, "Not authorized"))
        }
        req.user = user;
        next()
    } catch {
        return next(HttpError(401, "Not authorized"))
    }
};

export default authenticate;