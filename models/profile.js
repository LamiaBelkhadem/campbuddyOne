import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
	{
		gender: {
			type: String,
			default: "Not specified",
		},
		fname: {
			type: String,
			required: true,
		},
		lname: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
		},
		experience: {
			type: String,
		},
		area: {
			type: String,
		},
		profilePic: {
			type: String,
			default: "",
		},
		interests: [
			{
				type: String,
			},
		],
		equipment: {
			type: [
				{
					type: String,
				},
			],
			default: [],
		},
		favorites: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Campsite",
			},
		],
		facebook: {
			type: String,
		},
		instagram: {
			type: String,
		},
		tiktok: {
			type: String,
		},
		twitter: {
			type: String,
		},
		desc: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		lobbies: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Lobby",
				},
			],
			default: [],
		},
		reviews: {
			type: [
				{
					user: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
					},
					rating: {
						type: Number,
						required: true,
					},
					comment: {
						type: String,
						required: true,
					},
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);
export default mongoose.model("Profile", ProfileSchema);
