import {userModel} from "../models/user.js";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
// import path, { dirname } from "path"
// import { fileURLToPath } from 'url';
 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export const register =  async(req, res)=>{
    try{
        const {fields} = req;
         let user = await userModel.findOne({email: fields.email});
        if(user) return res.status(200).json({message: "User already exists.", success: true});
        
        let hashedPassword = await bcrypt.hash(fields.password, 10);
        let newUser = await new userModel({...fields, password: hashedPassword});
        
        if(req?.files?.image){
            const { image} = req.files
             //console.log("imagefile",  fs.readFileSync("uploads/", req.file.filename))

            let imageFile = fs.readFileSync( (image.path))

            newUser.image = {
                data: imageFile,
                contentType: image.type,
                
            }
        }
        else{
            const imageFile = fs.readFileSync('../server/public/NoProfileDp.jpg');
             newUser.image = {
                data: imageFile,
                 contentType: 'image/jpg'
            }
             
        }
        
        newUser.save();

         res.status(201).json({message: "User has been registered.", user: newUser , success: true})

    }
    catch(err){
        res.status(500).json({messsage: "Can't Register", error: err.message, success: false})
    }
}

export const Login =  async(req, res)=>{
    try{
        const {body} = req;
        //console.log(body)
        let user = await userModel.findOne({email: body.email});

        if(!user) return res.status(200).json({message: "User is not registered yet.", success: true});
        
        let isPassword = await bcrypt.compare(body.password || '', user.password);
        
        if(!isPassword) return res.status(401).json({message: "Incorrect Password", success: true});

        let token = await jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET, { expiresIn: '12h' })

        res.status(200).json({message: "Logging in...", token, isPassword, user: {email: user.email, id: user._id, name: `${user.firstName} ${user.lastName}`}, success: true});

    }
    catch(err){
        res.status(404).json({messsage: "Login failed.", error: err.message, success: false})
    }
}



export const getImage = async(req, res)=>{
    try  {
        let user = await userModel.findById(req.params.id);
        //console.log("image: ", user?.image?.data?.length / 2**20 ); //mb
        if( user?.image?.data){res.set("Content-Type", user.image.contentType);
        res.send(  user.image.data );
    }
    }
    catch(e){   
         res.send('');
    }
}
    

