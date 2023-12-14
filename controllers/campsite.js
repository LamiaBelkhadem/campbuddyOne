import Campsite from "../models/campsites.js";

const create = async (req, res, next) => {
  const newCampsite = new Campsite(req.body);
  try {
    const savedCampsite = await newCampsite.save();
    res.status(200).json(savedCampsite);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedCampsite = await Campsite.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCampsite);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const campsite = await Campsite.findByIdAndUpdate(req.params.id);
    res.status(200).json(campsite);
  } catch (err) {
    res.status(500).json(err);
  }
};
const addReview = async (req, res, next) => {
  try {
    const updatedCampsite = await Campsite.findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: req.body.reviews } },
      { new: true }
    );
    res.status(200).json(updatedCampsite);
    console.log("Review added:", req.body.reviews);
  } catch (err) {
    console.error("Error updating Campsite:", err);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await Campsite.findByIdAndDelete(req.params.id);
    res.status(200).json("Campsite has been deleted");
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const campsite = await Campsite.find();
    res.status(200).json(campsite);
  } catch (err) {
    next(err);
  }
};

export const campsite = {
  create,
  update,
  getOne,
  addReview,
  remove,
  getAll,
};
