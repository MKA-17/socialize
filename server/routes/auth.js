import { Router } from "express";
import { Login, getImage, register } from "../controllers/auth.js";
import formidable from "express-formidable";
import { upload } from "../middlewares/multer.js";

let router = Router();

router.post('/', formidable(), (req, res)=>{
    console.log("req: ", req)
    const {image} = req.files;
    console.log("image", image.size / (1024 * 1024)) // mb
    res.send("hola")

});

router.post("/register", formidable(), register);

router.post("/login", Login);

 
router.get('/get-image/:id', getImage);

export {router as authRouter};
