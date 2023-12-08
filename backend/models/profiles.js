import mongoose  from "mongoose";

const profileSchema =new mongoose.Schema({
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: true,},
        age: {
            type: Number,
            required: true,
        },
        experience: {
                type: Number,
            min:0,
            max:5,
        },
        area: {
            type: String,
        },
        profilepic: {
            type: String,
            default:"",
        },
    },


    {timestamps: true}
);
export default  mongoose.model("Profile", profileSchema);