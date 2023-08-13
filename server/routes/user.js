import { Router } from "express";
import { userModel } from "../models/user.js";
import { isLogin } from "../middlewares/isLogin.js";
import {
  findUserDetails,
  followUser,
  getLikedPosts,
  getSavedPosts,
  getUserDetails,
  getUserPost,
  updateUserDetails,
} from "../controllers/user.js";
import formidable from "express-formidable";

const router = Router();

router.get("/get-user/:userId", isLogin, getUserDetails);

router.post("/find-user", isLogin, findUserDetails);

router.get("/get-liked-post", isLogin, getLikedPosts);

router.get("/get-saved-post", isLogin, getSavedPosts);

router.put("/follow-user/:followId", isLogin, followUser);

router.put("/update-user", isLogin, formidable(), updateUserDetails);

router.get("/get-post-user/:userId", isLogin, getUserPost);

export { router as userRouter };
