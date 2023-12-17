import { errorMessage } from "../utils/index.js";

export const isAdmin = (req, res, next) => {
	if (req.user.role === "ADMIN") {
		return next();
	}

	return res.status(403).json(errorMessage("You are not authorized"));
};
