import mongoose  from "mongoose";
const { schema } =mongoose;

const ReviewsSchema =new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});
export default  mongoose.model("Review", ReviewsSchema)