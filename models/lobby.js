import mongoose from "mongoose";

const LobbiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    campsite: {
        type: String,
        required: true
    },
    maximumParticipants: {
        type: Number,
        required: false
    },
    participants: {
        type: Array,
        default: [],
    },
    open: {
        type: Boolean,
        default: true,
    },
    age: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        default: '',
    },
    kids: {
        type: Boolean,
        default: true,
    },
    pets: {
        type: Boolean,
        default: true,
    },
    ambiance: {
        type: String,
        default: '',
    },
    food: {
        type: Boolean,
        default: true,
    },
    transport: {
        type: Boolean,
        default: true,
    },
    equipmentProvided: {
        type: Array,
        default: [],
    },
    equipmentNeeded: {
        type: Array,
        default: [],
    },

    owner:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    joined: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]

}, {timestamps: true


})
export default mongoose.model("Lobby", LobbiesSchema)