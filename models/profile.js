import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
	{
		gender: {
			type: String,
			default: "Not specified",
		},
		fname: {
			type: String,
			
		},
		lname: {
			type: String,
		},
		age: {
			type: Number,
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
		interests:  {
			type: String,
			default: "",
		},
		equipment: {
			type: String,
			default: "",
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
