import User from "../models/user.js";
import Profile from "../models/profile.js";
import Lobby from "../models/lobby.js";
import { messageResponse } from "../utils/messageResponse.js";

const create = async (req, res, next) => {
	const {
		name,
		start,
		end,
		time,
		campsite,
		maximumParticipants,
		age,
		experience,
		gender,
		kids,
		pets,
		ambiance,
		food,
		transport,
		equipmentNeeded,
		equipmentProvided,
	} = req.body;

	try {
		const savedLobby = await Lobby.create({
			name,
			start,
			end,
			time,
			campsite,
			maximumParticipants,
			ambiance,
			food,
			transport,
			equipmentNeeded,
			equipmentProvided,
			experience,
			gender,
			kids,
			pets,
			age,
			owner: req.user.id,
		});
		const user = await User.findById(req.user.id)
			.populate("profile")
			.lean();
		await Profile.findByIdAndUpdate(user.profile._id, {
			$push: { lobbies: savedLobby._id },
		});

		return res.status(200).json({ lobby: savedLobby });
	} catch (err) {
		next(err);
	}
};
const update = async (req, res, next) => {
	const { id } = req.params;
	try {
		const updatedLobby = await Lobby.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true }
		).lean();
		return res.status(200).json({ lobby: updatedLobby });
	} catch (err) {
		next(err);
	}
};
const get = async (req, res) => {
	const { id } = req.params;
	try {
		const lobby = await Lobby.findById(id)
			.populate({
				path: "owner",
				populate: {
					path: "profile",
				},
			})
			.populate("campsite")
			.populate({ path: "joined", populate: { path: "profile" } })
			.lean();
		res.status(200).json({ lobby });
	} catch (err) {
		res.status(500).json(err);
	}
};
const remove = async (req, res, next) => {
	const { id } = req.params;
	try {
		await Lobby.findByIdAndDelete(id);
		return res.status(200).json(messageResponse("Lobby has been deleted"));
	} catch (err) {
		next(err);
	}
};
const getAll = async (_, res, next) => {
	try {
		const lobbies = await Lobby.find()
			.populate({
				path: "owner",
				populate: {
					path: "profile",
				},
			})
			.populate("campsite")
			.lean();
		return res.status(200).json({ lobbies });
	} catch (err) {
		next(err);
	}
};

export const joinLobby = async (req, res, next) => {
	const { id } = req.params;
	const userId = req.user.id;
	try {
		const updatedLobby = await Lobby.findByIdAndUpdate(
			id,
			{ $push: { joined: userId } },
			{ new: true }
		)
			.populate({
				path: "owner",
				populate: {
					path: "profile",
				},
			})
			.populate("campsite")
			.lean();
		return res.status(200).json({ lobby: updatedLobby });
	} catch (err) {
		next(err);
	}
};

export const leaveLobby = async (req, res, next) => {
	const { id } = req.params;
	const userId = req.user.id;
	try {
		const updatedLobby = await Lobby.findByIdAndUpdate(
			id,
			{ $pull: { joined: userId } },
			{ new: true }
		)
			.populate({
				path: "owner",
				populate: {
					path: "profile",
				},
			})
			.populate("campsite")
			.lean();
		return res.status(200).json({ lobby: updatedLobby });
	} catch (err) {
		next(err);
	}
};

export const getLobbiesByOwner = async (req, res, next) => {
	const ownerId = req.params.ownerId;
	try {
		const lobbies = await Lobby.find({ owner: ownerId })
			.populate("campsite")
			.populate({
				path: "owner",
				populate: {
					path: "profile",
				},
			})
			.populate({ path: "joined", populate: { path: "profile" } })
			.lean();
		return res.status(200).json({ lobbies });
	} catch (err) {
		next(err);
	}
};


export const getLobbiesByParticipant = async (req, res, next) => {
	const participantId = req.params.participantId;
	try {
		const lobbies = await Lobby.find({ joined: participantId })
			.populate("campsite")
			.populate({
				path: "owner",
				populate: {
					path: "profile",
				},
			})
			.populate({ path: "joined", populate: { path: "profile" } })
			.lean();
		return res.status(200).json({ lobbies });
	} catch (err) {
		next(err);
	}
};



export const lobby = {
	create,
	update,
	get,
	remove,
	getAll,
	joinLobby,
	leaveLobby,
	getLobbiesByParticipant,
	getLobbiesByOwner

};
