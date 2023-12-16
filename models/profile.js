import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        gender: {
            type: String,
            default: "Not specified"
        },
        fname: {
            type: String, required: true,
        },
        lname: {
            type: String, required: true,
        }, age: {
            type: Number, required: true,
        }, experience: {
            type: String,
        },
        area: {
            type: String,
        },
        profilePic: {
            type: String, default: "",
        },
        interests: {
            type: String, default: "",
        },
        equipment: {
            type: String, default: "",
        },
        favorites: {
            type: Array, default: [],
        },
        facebook: {
            type: String,
        }, instagram: {
            type: String,
        }, tiktok: {
            type: String,
        }, twitter: {
            type: String,
        },
        desc: {
            type: String, default: "",
        }, bio: {
            type: String, default: "",
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    },
    {timestamps: true});
export default mongoose.model("Profile", profileSchema);