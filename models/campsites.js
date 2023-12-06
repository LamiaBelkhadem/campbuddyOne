import mongoose from "mongoose";

const campsiteSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        location: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: String,
            required: true,
        },
        security: {
            type: Boolean,
            default: false
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
            type: Array,
            default: [],
        },
        amenities: {
            type: String,
            default: "",
        },
        reviews: {
            type:Array,
            default:[],
        },
        rating: {
            type:String,
            default:"N/A",
        },

    },
    {timestamps: true}
);
export default mongoose.model("Campsite", campsiteSchema);