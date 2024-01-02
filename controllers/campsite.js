import * as fs from "fs";
import path from "path";
import Campsite from "../models/campsite.js";
import Profile from "../models/profile.js";
import { errorMessage } from "../utils/index.js";
import { messageResponse } from "../utils/messageResponse.js";

const handleCampsiteImgsUpload = (res, { name, images, mainImg }) => {
	// Create a directory under public/images/campsites/${campsiteName}/
	// and move the images there (if any)
	//  move the main image to public/images/campsites/${campsiteName}/main.jpg

	console.log("HEEEEEEEEEEEEEEEEEEEEEEERE")
	console.log(process.cwd())
	// Create a directory under public/images/campsites/${campsiteName}/
	const campsiteDirectory = path.join(
		"public",
		"images",
		"campsites",
		name
	);

	if (!fs.existsSync(campsiteDirectory)) {
		fs.mkdirSync(campsiteDirectory, { recursive: true });
	}

	// Move the main image to public/images/campsites/${campsiteName}/main.jpg
	const mainImagePath = path.join(campsiteDirectory, "main.jpg");
	const oldPath = path.join("public", "images", mainImg);

	try {
		fs.renameSync(oldPath, mainImagePath);
	} catch (err) {
		// Handle any errors during file moving
		console.log(err)
		throw new Error("Error moving main image");
	}

	const imagePaths = [];
	let i = 0;
	for (const img of images) {
		const imgPath = path.join(campsiteDirectory, `${i}.png`);
		i++;
		const oldPath = path.join(process.cwd(), "public", "images", img);
		console.log({ oldPath, imgPath })

		try {
			fs.renameSync(oldPath, imgPath);
			imagePaths.push(`campsites/${name}/${i}.png`)
		} catch (err) {
			// Handle any errors during file moving
			console.error("Error moving image:", err);
			throw new Error("Error moving image");
		}
	}

	return {
		imagePaths: `campsites/${name}/mainImg.jpg`,
		mainImagePath,
	};
};

const create = async (req, res) => {
	const {
		name,
		location,
		category,
		mainImg,
		desc,
		images,
		amenities,
		security,
	} = req.body;

	console.log(mainImg)

	try {
		const { imagePaths, mainImagePath } = handleCampsiteImgsUpload(res, {
			images,
			mainImg,
			name,
		});

		const newCampsite = await Campsite.create({
			security,
			name,
			location,
			category,
			mainImg: mainImagePath,
			desc,
			images: imagePaths,
			amenities,
		});

		return res.status(200).json({ campsite: newCampsite });
	} catch (e) {
		return res.status(500).json(errorMessage(e.message));
	}
};

const update = async (req, res, next) => {
	const {
		security,
		name,
		location,
		category,
		mainImg,
		desc,
		images,
		amenities,
	} = req.body;

	const { id } = req.params;

	try {
		const { imagePaths, mainImagePath } = handleCampsiteImgsUpload(res, {
			images,
			mainImg,
			name,
		});

		const updatedCampsite = await Campsite.findByIdAndUpdate(
			id,
			{
				$set: {
					name,
					location,
					category,
					mainImg: mainImagePath,
					security,
					desc,
					images: imagePaths,
					amenities,
				},
			},
			{ new: true }
		);
		res.status(200).json({ campsite: updatedCampsite });
	} catch (err) {
		next(err);
	}
};

const getOne = async (req, res) => {
	const { id } = req.params;
	try {
		const campsite = await Campsite.findById(id);
		if (!campsite)
			return res.status(400).json(errorMessage("campsite not found"));
		return res.status(200).json({ campsite });
	} catch (err) {
		return res.status(500).json(err);
	}
};

const getMultiple = async (req, res) => {
    const { ids } = req.body; // Assuming you're sending an array of IDs in the request body

    try {
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json(errorMessage("No campsite IDs provided"));
        }

        const campsites = await Campsite.find({
            '_id': { $in: ids }
        });

        return res.status(200).json({ campsites });
    } catch (err) {
        console.error("Error fetching multiple campsites:", err);
        return res.status(500).json(errorMessage(err.message));
    }
};

const addReview = async (req, res, next) => {
	const { content, rate } = req.body;
	const { id } = req.params;
	const userId = req.user.id;

	try {

		const updatedCampsite = await Campsite.findByIdAndUpdate(
			id,
			{
				$push: {
					reviews: {
						user: userId,
						content,
						rate,
					},
				},
			},
			{ new: true }
		).populate("reviews.user");

		return res.status(200).json({ reviews: updatedCampsite.reviews });
	} catch (err) {
		console.error("Error updating Campsite:", err);
		next(err);
	}
};

const remove = async (req, res, next) => {
	const { id } = req.params.id;
	try {
		await Campsite.findByIdAndDelete(id);
		return res
			.status(200)
			.json(messageResponse("Campsite has been deleted"));
	} catch (err) {
		next(err);
	}
};

const getAll = async (req, res, next) => {
	try {
		const campsites = await Campsite.find();
		return res.status(200).json({ campsites });
	} catch (err) {
		next(err);
	}
};

const upload = (req, res) => {
	if (req.file) {
		return res
			.status(200)
			.json({ file: `tmp/campsites/${req.file.filename}` });
	}

	return res.status(400).json(errorMessage("File not uploaded"));
};

const getReviewsForCampsite = async (req, res) => {
	const { id } = req.params;

	const campsite = await Campsite.findById(id).populate("reviews.user");

	if (!campsite)
		return res.status(400).json(errorMessage("Campsite not found"));

	return res.status(200).json({ reviews: campsite.reviews });
};

const allCampsitesWithReviews = async (req, res) => {
	const campsites = await Campsite.find().populate("reviews.user");
	return res.status(200).json({ campsites });
};

const addToFavorite = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;
	const updatedProfile = await Profile.findOneAndUpdate(
		{
			user: userId,
		},
		{
			$push: {
				favorites: id,
			},
		},
		{ new: true }
	);
	return res.status(200).json({ profile: updatedProfile });
	console.log("added to favourites");
};

const deleteFromFavorite = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;
	const updatedProfile = await Profile.findOneAndUpdate(
		{
			user: userId,
		},
		{
			$pull: {
				favorites: id,
			},
		},
		{ new: true }
	);
	return res.status(200).json({ profile: updatedProfile });
};

export const campsite = {
	create,
	update,
	upload,
	getOne,
	getMultiple,
	addReview,
	remove,
	getAll,
	getReviewsForCampsite,
	allCampsitesWithReviews,
	addToFavorite: addToFavorite,
	deleteFromFavorite: deleteFromFavorite,
};
