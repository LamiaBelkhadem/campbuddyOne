import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		role: {
			type: String,
			default: "USER",
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profile: {
			type: mongoose.Types.ObjectId,
			ref: "Profile",
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("User", UserSchema);
