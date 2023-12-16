import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
    {
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
        isAdmin: {
            type: Boolean,
            default: false,
        },
        lobbies: {
            type: Array,
            default: [],
        },
        fname: {
            type: String,
        },
        lname: {
            type: String,
        },
        age: {
            type: Number,
            default: "",
        },
        profile: {
            type: mongoose.Types.ObjectId,
            ref: 'Profile'
        },
        reviews: {
            type: Array,
            default: [],
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
    {timestamps: true}
);

export default mongoose.model("User", UsersSchema);
