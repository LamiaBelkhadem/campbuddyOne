import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import lobbiesRoute from "./routes/lobbies.js"
import campsitesRoute from "./routes/campsites.js"
import profileRoute from "./routes/profiles.js"
import reviewsRoute from "./routes/reviews.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
const app=express()
dotenv.config()

const connect=async ()=> {
    try {
        await mongoose.connect(process.env["MONGO"]);
        console.log("Connected to Database.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected",()=>{
    console.log("disconnected from Database!")
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDirectory = path.join(__dirname, 'public', 'images');
console.log(`Serving images from: ${imagesDirectory}`);
app.use('/images', express.static(imagesDirectory));


//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});


app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/lobbies", lobbiesRoute);
app.use("/api/campsites", campsitesRoute);
app.use("/api/profiles", profileRoute);
app.use("/api/reviews",reviewsRoute),


app.use((err,req,res,next)=>{
    const errorStatus=err.status||500
    const errorMessage=err.message||"Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status: errorStatus,
        message:errorMessage,
        stack:err.stack,
    });
})
app.listen(8080,()=>{
    connect()
    console.log("Connected to Backend!");
});