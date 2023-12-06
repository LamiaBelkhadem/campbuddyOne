import Lobby from "../models/lobbies.js";

export const createLobby = async (req, res, next) => {
    const newLobby = new Lobby(req.body);
    try {
        const savedLobby = await newLobby.save()
        res.status(200).json(savedLobby)
    } catch (err) {
        next(err);

    }
}

export const updateLobby = async (req, res, next) => {
    try {
        const updatedLobby = await Lobby.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true})
        res.status(200).json(updatedLobby)
    } catch (err) {
        next(err);
    }
}

export const getLobby = async (req, res, next) => {
    try {
        const lobby = await Lobby.findByIdAndUpdate(
            req.params.id,
        );
        res.status(200).json(lobby);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const deleteLobby = async (req, res, next) => {
    try {
        await Lobby.findByIdAndDelete(req.params.id);
        res.status(200).json("Lobby has been deleted");
    } catch (err) {
        next(err);
    }
}

export const getAllLobby = async (req, res, next) => {
    try {
        const lobby = await Lobby.find()
        res.status(200).json(lobby);
    } catch (err) {
        next(err);
    }
}