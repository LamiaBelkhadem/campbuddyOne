import Profile from "../models/profiles.js";
import User from "../models/user.js";

const create = async (req, res, next) => {
  const userId = req.params.userId;
  const newProfile = new Profile(req.body);
  try {
    const savedProfile = await newProfile.save();
    try {
      await User.findByIdAndUpdate(userId, {
        $set: { profile: savedProfile._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedProfile);
  } catch (err) {
    next(err);
  }
};
const update = async (req, res, next) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id);
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json(err);
  }
};

const remove = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await Profile.findByIdAndDelete(req.params.id);
    try {
      await User.findByIdAndUpdate(userId, {
        $unset: { profile: "" },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Profile has been deleted");
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const profile = await Profile.find();
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

export const profile = {
  create,
  update,
  getOne,
  remove,
  getAll,
};
