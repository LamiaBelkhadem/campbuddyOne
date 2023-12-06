import User from "../models/user.js";


export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true})
        res.status(200).json(updatedUser)
        console.log('Incoming data:', req.body);

    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");

    } catch (err) {

        next(err);
    }
};

export const getAllUser = async (req, res, next) => {
    try {
        const user = await User.find()
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const addFavorite = async (req, res, next) => {
    try {
        // Assuming req.body contains something like { favorite: "campsiteId" }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $push: { favorites: req.body.favorites } },
            { new: true }
        );
        res.status(200).json(updatedUser);
        console.log('Favorite added:', req.body.favorites);

    } catch (err) {
        console.error('Error updating user:', err);
        next(err);
    }
};


// To remove a favorite
export const removeFavorite = async (req, res, next) => {
    try {
        // Assuming req.body contains something like { favorite: "campsiteId" }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $pull: { favorites: req.body.favorite } },
            { new: true }
        );
        res.status(200).json(updatedUser);
        console.log('Favorite removed:', req.body.favorite);

    } catch (err) {
        console.error('Error updating user:', err);
        next(err);
    }
};


