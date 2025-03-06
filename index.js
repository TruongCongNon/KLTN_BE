/* eslint-disable no-undef */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js"
import productRoute from './routes/product.js'
import categoriesRoute from './routes/categories.js'
import cartRoute from "./routes/cart.js"
const port = 5000;
const app = express();
dotenv.config();

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected db")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }

};
connectToMongo();
app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use("/v1/auth", authRoute)
app.use("/v1/user", userRoute)
app.use("/v1/product",productRoute)
app.use("/v1/category",categoriesRoute)
app.use("/v1/cart",cartRoute)


app.listen(port, () => {
    console.log(`Server is running port:${port}`);
})

