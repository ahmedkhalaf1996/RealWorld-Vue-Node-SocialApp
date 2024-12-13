import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";
import UserModal from '../models/user.js';
import Notification from '../models/notification.js';


export const createPost = async (req , res ) => {
    try {
        
        const post = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(404).send(`No post with id : ${req.userId}`);
 
        const user = await UserModal.findById(req.userId)

        const newPostMessage = new PostMessage({ ...post, creator: req.userId, name:user.name, createdAt: new Date().toISOString()})
        
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getPost = async (req, res)=> {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id : ${id}`);
 
        const post = await PostMessage.findById(id);

        res.status(200).json({post})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getPostsUsersBySearch = async (req, res) => {
    try {
        const { searchQuery } = req.query 

        const title = new RegExp(searchQuery, "i")

        const posts = await PostMessage.find({ $or: [{ title }] })
        const user = await UserModal.find({ $or: [{ name: title }] })

        res.status(200).json({ user, posts })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id : ${id}`);
        
        const post = await PostMessage.findById(id);

        if(!req.userId) {return res.json({message: "Unauthenticated"})}
        const extractedId = req.userId
    
        if (String(post.creator) != extractedId) {return res.json({message: "you are not authorized to updated this post"})}
        
        const {title, message, selectedFile} = req.body;
        const updatedpost = {title, message, selectedFile, _id: id}

        await PostMessage.findByIdAndUpdate(id, updatedpost, {new: true})

        res.status(200).json(updatedpost)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}



export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id : ${id}`);

        const post = await PostMessage.findById(id);

        if(!req.userId) {return res.json({message: "Unauthenticated"})}
        const extractedId = req.userId
    
        if (String(post.creator) != extractedId) {return res.json({message: "you are not authorized to delete this post"})}
        

        await PostMessage.findByIdAndDelete(id)

        res.status(200).json({ message: "Post deleted successfully." })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getPosts = async (req, res)=> {
    try {
        const {page} = req.query
        const {id} = req.query

        let following = await UserModal.find({ $or: [{ followers:id }] }).select('_id');
        following.push(id);

        const LIMIT = 2;
        const startIndex = (Number(page) -1) * LIMIT;

        const posts = await PostMessage.find({  $or: [{ creator: following }] })
            .sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        const total = await PostMessage.find({ $or :[{ creator: following }] })
            .countDocuments({});

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })

    } catch (error) {
        res.status(400).json({ message: error.message }) 
    }
}



export const likePost = async (req, res) => {
   try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id : ${id}`);
   
    if(!req.userId) {return res.json({message: "Unauthenticated"})}

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id)=> id === String(req.userId));

    if (index === -1){
        post.likes.push(req.userId)
        // start Create Notification

        const userIDToken = req.userId
        if (post.creator && userIDToken){
            const user = await UserModal.findById(userIDToken)            
            if (user) {
                const deatils = `${user.name} Like On Your Post`;
                const userIn = {name: user.name, avatar: user.imageUrl};
    
                const notificationData = {
                    mainuid: post.creator,
                    targetid: id,
                    deatils,
                    user: userIn,
                }
    
                const notification = new Notification(notificationData)
                await notification.save()
            }

        }


    } else {
        post.likes = post.likes.filter((id)=> id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    res.status(200).json({ post: updatedPost })

   } catch (error) {
    res.status(400).json({ message: error.message }) 
   }
}

// commentPost
export const commentPost = async (req, res) => {
    try {
     const { id } = req.params
     const {value} = req.body;

     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id : ${id}`);
 
     const post = await PostMessage.findById(id);
     if (!post){
        return res.status(404).json({ message: "post not found"})
     }

     post.comments.push(value);

     // start Add Notification

     const userIDToken = req.userId
     if (post.creator && userIDToken){
         const user = await UserModal.findById(userIDToken)            
         if (user) {
             const deatils = `${user.name} Comment On Your Post`;
             const userIn = {name: user.name, avatar: user.imageUrl};
 
             const notificationData = {
                 mainuid: post.creator,
                 targetid: id,
                 deatils,
                 user: userIn,
             }
 
             const notification = new Notification(notificationData)
             await notification.save()
         }

     }

 
     const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
     if (!updatedPost){
        return res.status(404).json({ message: "Can't add comment to the post"})
     }

     res.status(200).json({ data: updatedPost })
 
    } catch (error) {
     res.status(400).json({ message: error.message }) 
    }
 }
