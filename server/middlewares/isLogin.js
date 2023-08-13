import jwt from "jsonwebtoken";

export const isLogin = async(req, res, next)=>{
    try{
        let decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch(e){
        res.status(404).json({message: e.message, success: false});
    }
}