import Review from "../models/review.js";

const create = async (req, res, next) => {
  const newReview = new Review(req.body);
  try {
    const savedReview = await newReview.save();
    res.status(200).json(savedReview);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedReview);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id);
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json(err);
  }
};

const viewUserReview = async (req, res) => {
  try {
    // Assuming `userId` is the field in the Review model that you want to match
    const userReviews = await Review.find({ userId: req.params.id });
    res.status(200).json(userReviews);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getByIds = async (req, res, next) => {
  try {
    const reviewIds = req.query.ids.split(","); // Split the comma-separated IDs into an array
    console.log(reviewIds);
    const reviews = await Review.find({ _id: { $in: reviewIds } });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json("Review has been deleted");
  } catch (err) {
    next(err);
  }
};

const getAll = async (_, res, next) => {
  try {
    const review = await Review.find();
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const review = {
  create,
  update,
  getOne,
  viewUserReview,
  getByIds,
  remove,
  getAll,
};
