import {createError} from "../utils/index.js";

export const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return next(createError(403, "You are not authorized"));
    }
};
