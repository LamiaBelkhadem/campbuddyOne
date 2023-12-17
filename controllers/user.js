import User from "../models/user.js";
import { errorMessage } from "../utils/index.js";
import { messageResponse } from "../utils/messageResponse.js";

const getOne = async (req, res) => {
	const { id } = req.params.id;
	try {
		const user = await User.findById(id);
		if (!user)
			return res.status(200).json(errorMessage("profile not found"));
		return res.status(200).json({ user });
	} catch (err) {
		return res.status(500).json(errorMessage({}));
	}
};

const remove = async (req, res, next) => {
	const { id } = req.params;
	try {
		await User.findByIdAndDelete(id);
		return res.status(200).json(messageResponse("User has been deleted"));
	} catch (err) {
		next(err);
	}
};

const getAll = async (req, res, next) => {
	try {
		const user = await User.find();
		return res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

const addFavorite = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Assuming req.body contains something like { favorite: "campsiteId" }
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ $push: { favorites: req.body.favorites } },
			{ new: true }
		);
		return res.status(200).json({ user: updatedUser });
	} catch (err) {
		next(err);
	}
};

// To remove a favorite
const removeFavorite = async (req, res, next) => {
	const { favorite } = req.body;
	try {
		// Assuming req.body contains something like { favorite: "campsiteId" }
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ $pull: { favorites: favorite } },
			{ new: true }
		);
		return res.status(200).json({ user: updatedUser });
	} catch (err) {
		next(err);
	}
};

export const user = {
	addFavorite,
	removeFavorite,
	getOne,
	remove,
	getAll,
};
