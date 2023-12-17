import Profile from "../models/profile.js";
import User from "../models/user.js";
import { messageResponse } from "../utils/messageResponse.js";
import { errorMessage } from "../utils/index.js";

const upsertProfile = async (req, res) => {
	const user = await User.findById(req.user.id);

	const {
		gender,
		fname,
		lname,
		age,
		area,
		experience,
		equipment,
		favorites,
		facebook,
		instagram,
		tiktok,
		twitter,
		desc,
		bio,
	} = req.body;

	const profile = {
		fname,
		user: req.user.id,
		lname,
		age,
		area,
		experience,
		equipment,
		favorites,
		facebook,
		instagram,
		tiktok,
		twitter,
		desc,
		bio,
		gender,
		profilePic: `users/${req.user.id}/profile-pic.png`,
	};

	if (user.profile) {
		const updatedProfile = await Profile.findByIdAndUpdate(
			user.profile._id,
			{
				$set: profile,
			},
			{ new: true }
		).lean();

		console.log(updatedProfile);

		return res.status(200).json({ profile: updatedProfile });
	} else {
		const newProfile = await Profile.create(profile);

		await User.findByIdAndUpdate(
			req.user.id,
			{
				$set: { profile: newProfile._id },
			},
			{ new: true }
		);

		return res.json({ profile: newProfile });
	}
};
const getOne = async (req, res) => {
	const { id } = req.params;
	try {
		const profile = await Profile.findByIdAndUpdate(id).lean();
		return res.status(200).json({ profile });
	} catch (err) {
		return res.status(500).json(err);
	}
};
const remove = async (req, res, next) => {
	const { userId } = req.params;
	try {
		await Profile.findByIdAndDelete(userId);
		try {
			return await User.findByIdAndUpdate(userId, {
				$unset: { profile: "" },
			});
		} catch (err) {
			next(err);
		}
		return res
			.status(200)
			.json(messageResponse("profile has been deleted"));
	} catch (err) {
		next(err);
	}
};
const getAll = async (_, res, next) => {
	try {
		const profiles = await Profile.find();
		return res.status(200).json({ profiles });
	} catch (err) {
		next(err);
	}
};

const myProfile = async (req, res) => {
	const myProfileObj = await Profile.findOne({
		user: req.user.id,
	}).lean();
	console.log(myProfileObj);

	if (!myProfile)
		return res.json(errorMessage("profile not found, please create it "));
	return res.json({ profile: myProfileObj });
};

export const profile = {
	upsertProfile,
	getOne,
	remove,
	getAll,
	myProfile,
};
