import mongoose from "mongoose";

const CampsiteSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		location: {
			type: String,
			required: true,
			unique: true,
		},
		category: {
			type: String,
			required: true,
		},
		security: {
			type: Boolean,
			default: false,
		},
		mainImg: {
			type: String,
			default: "",
		},
		desc: {
			type: String,
			default: "",
		},
		images: {
			type: Array.of(String),
			default: [],
		},
		amenities: {
			type: String,
			required: true,
		},
		reviews: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				content: String,
				rate: Number,
			},
		],
		rating: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);
export default mongoose.model("Campsite", CampsiteSchema);
