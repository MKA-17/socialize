import { userModel } from "../models/user.js";
import { postModel } from "../models/postModel.js";
import bcrypt from "bcrypt";
import fs from "fs";

export const getUserDetails = async(req, res)=>{
    try{
    const {userId} = req.params;
    if(userId){
        //console.log(userId)
        let userDetails = await userModel.findById(userId)
        .populate({
            path: "followers",
            select: "_id firstName lastName"
        })
        .populate({
            path: "following",
            select: "_id firstName lastName"
        })

       return res.status(200).json({message:  "User details.", userDetails: {email: userDetails.email, id: userDetails._id, occupation: userDetails.occupation, firstName: userDetails.firstName, lastName: userDetails.lastName, followers: userDetails.followers, location: userDetails.location, following: userDetails.following}, success: true})
    }
      res.status(200).json({message: "User Id not provided.", success: true})
    }   
    catch(err){
        res.status(404).json({messsage: err.message, success: false})
    }
}

export const findUserDetails = async(req, res)=>{
      try{
    const {searchQuery} = req.body;
    //console.log("searchQuery", req.body)
    if(searchQuery){
        //console.log(searchQuery)
        
        let userDetails = await userModel.find({
            $or: [
              { firstName: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive regex search for firstName
              { lastName: { $regex: searchQuery, $options: 'i' } }   // Case-insensitive regex search for lastName
            ]
          })
          .select("_id firstName lastName");


        return res.status(200).json({message:  "Searched User details.", userDetails, success: true})
    }
    res.status(200).json({message: "Did not provide any Search.", success: true})

}
    catch(err){
        res.status(404).json({messsage: err.message, success: false})
    }
}

export const updateUserDetails = async(req, res)=>{
    try{
    const {user} = req;
    const {fields, files} = req;
     
    if(user && fields ){
        const {previousPassword, newPassword, id, newImage, ...obj} = fields;
        //console.log("meow", previousPassword, newPassword, obj,);
        
        let userDetails = await userModel.findByIdAndUpdate(user.id, {...obj}, {new: true});
        
        if(previousPassword){
            let isPassword = await bcrypt.compare(previousPassword || '', userDetails.password);
            if(!isPassword) return res.status(200).json({message:  "Wrong password entered, cant update User password.", success: true})

            let hashedPassword = await bcrypt.hash(newPassword, 10);
            userDetails.password = hashedPassword;


        }

        if(files?.newImage){

            //console.log("image", files.newImage);
            let imageFile = fs.readFileSync( (files.newImage.path))

            userDetails.image = {
                data: imageFile,
                contentType: files.newImage.type,
                
            }
        }

        await userDetails.save();
        // //console.log("userDetails: ", userDetails)

        res.status(200).json({message:  "User Details updated.", success: true})
    }
}
    catch(err){
        res.status(404).json({messsage: err.message, success: false})
    }
}

export const getLikedPosts = async(req, res)=>{
    try{
    const {user} = req;
    if(user?.id){
        //console.log(user.id)
        let userDetails = await userModel.findById(user.id)
        .select('-image')
        .populate({
          path: 'likedPosts',
          select: '-image', // Exclude the 'image' property from likedPosts
          populate: {
            path: 'userId',
            select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
          },populate: {
            path: 'userId',
            select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
          }
        })
        .populate({
            path: 'likedPosts',
            select: '-image', // Exclude the 'image' property from likedPosts
            populate: {
                path: 'comments.user',
                select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
            }
        })
        .populate({
            path: 'likedPosts',
            select: '-image',
            populate: {
                path: 'likes',
                select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
              },
            options: { sort: {createdAt : -1 } }
        });
        //console.log("Liked Posts: ", userDetails)
        res.status(200).json({message:  "Getting liked posts.", likedPosts: userDetails.likedPosts, success: true})
    }}
    catch(err){
        res.status(404).json({messsage: err.message, success: false})
    }
}

export const getSavedPosts = async(req, res)=>{
    try{
    const {user} = req;
    if(user?.id){
        //console.log(user.id)
        let userDetails = await userModel.findById(user.id)
        .select('-image')
        .populate({
          path: 'savedPosts',
          select: '-image', // Exclude the 'image' property from likedPosts
          populate: {
            path: 'userId',
            select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
          },populate: {
            path: 'userId',
            select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
          }
        })
        .populate({
            path: 'savedPosts',
            select: '-image', // Exclude the 'image' property from likedPosts
            populate: {
                path: 'comments.user',
                select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
            }
        })
        .populate({
            path: 'savedPosts',
            select: '-image',
            populate: {
                path: 'likes',
                select: 'firstName lastName _id', // Exclude the 'image' and 'password' properties from userId
              },
            options: { sort: {createdAt : -1 } }
        });
        //console.log("Saved Posts: ", userDetails)
        res.status(200).json({message:  "Getting saved posts.", savedPosts: userDetails.savedPosts, success: true})
    }}
    catch(err){
        res.status(404).json({messsage: err.message, success: false})
    }
}

export const followUser = async(req, res)=>{
    try{
    const {followId} = req.params;
    const {user} = req;
    ////console.log(userId, followId);
    if(user?.id ){
       // //console.log(user.id)
        let userDetails = await userModel.findById(user?.id).select("followers following firstName lastName email");
        let followingPerson = await userModel.findById(followId).select("followers following firstName lastName email");

        //console.log("following list: ", !userDetails?.following.includes(followId))
        if(!userDetails?.following.includes(followId)) { 
        userDetails?.following?.push(followId)
        followingPerson?.followers?.push(user?.id)
        }
        else{

            userDetails.following = userDetails?.following?.filter(e => e?.toString() !== followId);
            followingPerson.followers = followingPerson?.followers?.filter(e => e?.toString() !== user?.id);
            ////console.log("filter", userDetails)

        }

        await userDetails.save()
        await followingPerson.save()

         
        ////console.log("Saved Posts: ", userDetails)
        res.status(200).json({message:  "Following/Unfollowing User.", userDetails, success: true})
    }}
    catch(err){
        res.status(404).json({messsage: err.message, success: false})
    }
}


export const getUserPost = async(req, res)=>{
    const {userId} = req.params;
    //console.log(req.params)
    try{
        if(userId){
            let post = await postModel.find({userId}).select('-image').populate({
                path: 'likes',
                select: '-image -password', // Exclude the 'image' property
              }).populate({
                path: 'userId',
                select: '-image -password', // Exclude the 'image' property
              }).sort({ createdAt: -1 }).populate({
                path: 'comments.user',
                select: '-image -password', // Exclude the 'image' property
              }) 
              return res.status(200).json({messsage: 'Getting Posts.', post, success: true});
        }  
        res.status(200).json({messsage: 'Getting Posts.', post: [], success: true});
    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}