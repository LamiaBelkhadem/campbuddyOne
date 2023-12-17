import Lobby from "../models/lobby.js";
import { messageResponse } from "../utils/messageResponse.js";

const create = async (req, res, next) => {
	const newLobby = req.body;

	try {
		const savedLobby = await Lobby.create(newLobby);
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
	const { id } = req.params.id;
	try {
		const lobby = await Lobby.findById(id).lean();
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
		const lobbies = await Lobby.find().lean();
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
};
