import express from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { postRouter } from "./routes/post.js";
 
config();

mongoose.connect(`mongodb+srv://2020ee30:${process.env.DB_PASSWORD}@cluster0.gvwk9sa.mongodb.net/socialize`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

let app = express();

//configuration
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));




//routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);


app.listen(3001, ()=> console.log("Listening..."))