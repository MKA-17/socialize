import { postModel } from "../models/postModel.js";
import fs from "fs";
import { userModel } from "../models/user.js";

export const createPost = async(req, res)=>{
    try{
        const {fields} = req;
        const {files} = req;
        if(Object.keys(fields).length){
            // //console.log(fields);
            let post = await new postModel({...fields});
            if(files?.image){
                let docFile = fs.readFileSync(files.image.path);
                post.image = {
                    data: docFile,
                    contentType: files.image.type
                }
                post.isImage = true;
            }
            await post.save();

            res.status(200).json({messsage: 'Post has been created', post, success: true});

        }
    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const getPost = async(req, res)=>{
    // const postsPerPage = 5;
    // const {pageNo} = req.body;
    // //let pageNo = pageNo;
    // let skip = ((pageNo || 1 ) - 1) * postsPerPage;
    // //console.log("pagination: ", skip)
    try{
            
            let post = await postModel.find({}).select('-image').populate({
                path: 'likes',
                select: '-image -password', // Exclude the 'image' property
              }).populate({
                path: 'userId',
                select: '-image -password', // Exclude the 'image' property
              }).sort({ createdAt: -1 }).populate({
                path: 'comments.user',
                select: '-image -password', // Exclude the 'image' property
                
              })
            //   .skip(skip)
            //   .limit(postsPerPage)

            const totalCount = await postModel.estimatedDocumentCount(); // Total count of documents in the collection

            res.status(200).json({messsage: 'Getting Posts.', post, totalCount, success: true});
    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const likePost = async(req, res)=>{
    const {postId, userId} = req.params;
    const {user: currentUser} = req
    // //console.log(req.params)
    try{
        let post = await postModel.findById(postId).select('-image');
        let user = await userModel.findById(currentUser?.id).select("-image");
        ////console.log(post, user);
        ////console.log("likes: ", post.likes.includes(userId),  user.likedPosts)
        
       if( !post.likes.includes(userId)) {  
        post.likes = post.likes.concat(userId);
        user.likedPosts = user.likedPosts.concat(postId);
        ////console.log("meow: ", user.likedPosts.concat(postId));
        }
        else{
        post.likes = post.likes.filter(e => e?.toString() !== userId);
        user.likedPosts = user.likedPosts.filter(e => e?.toString() !== postId);
        ////console.log("filter", user.LikedPosts)

        }
        await post.save();
        await user.save();
        res.status(200).json({messsage: 'Posted has been Liked/Unliked.', success: true});

    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const deletePost = async(req, res)=>{
    const {postId} = req.params;
    ////console.log(req.params)
    try{
        let post = await postModel.findByIdAndDelete(postId);
        ////console.log(post.comments)
 
         res.status(200).json({messsage: 'Post has been deleted.', success: true});

    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const savePost = async(req, res)=>{
    const {postId, userId} = req.params;
    const {user: currentUser} = req
    //console.log(req.params)
    try{
        let user = await userModel.findById(currentUser?.id).select("-image");
        ////console.log(post, user);
        ////console.log("likes: ", post.likes.includes(userId),  user.likedPosts)
        ////console.log()
       if( !user.savedPosts.includes(postId)) {  
        user.savedPosts = user.savedPosts.concat(postId);
        ////console.log("meow: ", user.savedPosts.concat(postId));
        }
        else{
         user.savedPosts = user.savedPosts.filter(e => e?.toString() !== postId);
        //console.log("filter")

        }

        await user.save();
        res.status(200).json({messsage: 'Post has been saved/Unsaved.', savedPosts: user.savedPosts, success: true});

    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const commentPost = async(req, res)=>{
    const {postId, userId} = req.params;
    const {content} = req.body;
    //console.log(req.params, content)
    try{
        let post = await postModel.findById(postId).select('-image');
        //console.log(post.comments)
        post.comments = post.comments.concat({
            user: userId,
            content,
            time: Date(),

        })

        await post.save();
        res.status(200).json({messsage: 'Comment added to the post.', success: true});

    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const deleteCommentPost = async(req, res)=>{
    const {postId, commentId} = req.params;
    //console.log(req.params)
    try{
        let post = await postModel.findById(postId).select('-image');
        ////console.log(post.comments)
        post.comments = post.comments.filter(e=> e._id.toString() !== commentId);

        await post.save();
        res.status(200).json({messsage: 'Comment deleted from the post.', success: true});

    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const editPost = async(req, res)=>{
    const {postId} = req.params;
    const {files} = req;
    const {fields} = req;
    //console.log("PostId: ", postId, " fields:", fields, " files:", files)
    try{
       if(fields) { let post = await postModel.findByIdAndUpdate(postId, {content: fields.content}, {new: true});
        // ////console.log(post.comments)
        if(JSON.parse(fields.previous) === false && !fields?.image){
            //console.log("no image", typeof fields.previous,!fields?.image)
            post.image = null;
            post.isImage = false;

        } 
        if(files && JSON.parse(fields.previous) === false){
            //console.log("new image", typeof fields.previous,!fields?.image)
            let docFile = fs.readFileSync(files.image.path);
            post.image = {
                data: docFile,
                contentType: files.image.type
            }
            post.isImage = true;

        }

        post.edited = {
            isEdit: true,
            editedAt: Date()
        }

        await post.save();
        // post.comments = post.comments.filter(e=> e._id.toString() !== commentId);

        // await post.save();
        res.status(200).json({messsage: 'Post has been updated.', success: true});
}
    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const sharePost = async(req, res)=>{
    try{
        const {postId} =  req.params;
        if(postId){
            let post = await postModel.findById(postId).select("-_id -createdAt -updatedAt -comments -time -likes -shared -__v").populate({
                path: "userId",
                select: "_id firstName lastName "
            });
            let newPost = await new postModel({content: post?.content, isImage: post.isImage, image: post?.image, userId: req.user.id});
            newPost.shared = {
                isShare: true,
                sharedFrom:{
                    name:  `${post.userId.firstName} ${post.userId.lastName}`,
                    id: post.userId._id
                }
            }
            await newPost.save();

            ////console.log("sharePost: ", post)
            return res.status(200).json({messsage: 'Post has been shared', success: true});

        }

            res.status(200).json({messsage: 'Post could not be shared', success: true});

        
    }
    catch(err){
        res.status(404).json({messsage: err.message, success: false});

    }
}

export const getImage = async(req, res)=>{
    //console.log(req.params)
    try  {
        let user = await postModel.findById(req.params.id);
       // //console.log("image: ", user?.image?.data?.length / 2**20 ); //mb
        if( user?.image?.data){res.set("Content-Type", user.image.contentType);
        res.send(  user.image.data );
    }
    }
    catch(e){   
         res.send('');
    }
}
   