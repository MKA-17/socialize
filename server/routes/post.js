import { Router } from "express";
import formidable from "express-formidable";
import { isLogin } from "../middlewares/isLogin.js";
import { commentPost, createPost, deleteCommentPost, deletePost, editPost, getImage, getPost, likePost, savePost, sharePost } from "../controllers/post.js";

const router = Router();

router.post("/create-post", isLogin, formidable(), createPost);

router.put("/share-post/:postId", isLogin, sharePost);

router.get("/get-post", isLogin, getPost);

router.get("/get-image/:id", getImage);

router.put("/like-post/:postId/:userId", isLogin, likePost);

router.put("/save-post/:postId/:userId", isLogin, savePost);

router.put("/edit-post/:postId", isLogin, formidable(), editPost);

router.delete("/delete-post/:postId", isLogin, deletePost);

router.put("/comment-post/:postId/:userId", isLogin, commentPost);

router.delete("/delete-comment-post/:postId/:commentId", isLogin, deleteCommentPost);


export {router as postRouter}