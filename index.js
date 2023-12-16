import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import {fileURLToPath} from "url";
import {isAuthenticated} from "./middlewares/index.js";
import authRoute from "./routes/auth.js";
import campsitesRoute from "./routes/campsites.js";
import lobbiesRoute from "./routes/lobbies.js";
import profileRoute from "./routes/profiles.js";
import reviewsRoute from "./routes/reviews.js";
import usersRoute from "./routes/users.js";
import morgan from "morgan";

const app = express();

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to Database.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("disconnected from Database!");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDirectory = path.join(__dirname, "public", "images");
console.log(`Serving images from: ${imagesDirectory}`);
app.use(morgan());
app.use("/images", express.static(imagesDirectory));

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoute);
app.use("/api/users", isAuthenticated, usersRoute);
app.use("/api/lobbies", isAuthenticated, lobbiesRoute);
app.use("/api/campsites", isAuthenticated, campsitesRoute);
app.use("/api/profiles", isAuthenticated, profileRoute);
app.use("/api/reviews", isAuthenticated, reviewsRoute);
app.use((err, _, res, __) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    });
});

app.listen(8080, async () => {
    await connect();
    console.log("Connected to Backend!");
    console.log("Server is running on port 8080, http://localhost:8080 ");
});
