import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false
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
            default:"",

        },
        experience: {
            type: String,
            default:"",
        },
        area: {
            type: String,
            default:"",
        },
        profilepic: {
            type: String,
            default: "",
        },
        interests: {
            type: String,
            default: "",

        },
        equipment: {
            type: String,
            default: "",

        },
        favorites: {
            type: Array,
            default: [],

        },
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
        profile: {
            type: Boolean,
            default:false,
        },
        desc: {
            type:String,
            default:"",
        },
        bio: {
            type:String,
            default:"",
        },
        reviews: {
            type:Array,
            default:[],
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: String,
    },
    {timestamps: true}
);

export default mongoose.model("User", UsersSchema);