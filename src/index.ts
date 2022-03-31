import express from "express";
import { router as authRouter } from "./routes/user/auth";
import { errorHandler } from "./middleware/error-handler";
import mongoose from "mongoose";
import 'express-async-errors'; // prevents async error
import 'dotenv/config';

const PORT = 5000;
const DB_URI = process.env.DB;
const app = express();

app.use(express.json());

app.use("/user/auth/", authRouter);

app.use(errorHandler);

const startApp = async () => {
    console.log("Starting App.");
    try {
        console.log("Connecting to DB.");
        await mongoose.connect(DB_URI);
        console.log("Connected to DB.");
        app.listen(PORT, () => console.log("Server running at PORT:", PORT));
    } catch(error) {
        if(error) {
            console.log(error);
        }
    }
};

startApp();