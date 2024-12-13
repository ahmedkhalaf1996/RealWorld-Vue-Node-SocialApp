import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import UserModal from '../models/user.js'
import PostMessage from "../models/postMessage.js";
import Notification from '../models/notification.js';


const secret = 'pWis+UbAuxOD150+4vbkjSKITJAjvmCUVcWiF0WbVB4='


export const signup = async (req,res)=> {
    const {email, password, firstName, lastName} = req.body;
    try {
        const oldUser = await UserModal.findOne({ email });
        if (oldUser) return res.status(400).json({ message: "User Alraedy exists" })
        
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await UserModal.create({ email, password: hashedPassword, name : `${firstName} ${lastName}` });

        const token = jwt.sign({email: result.email, id: result._id}, secret, { expiresIn: "24h" });

        res.status(201).json({ result, token })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong"})
    }
}

export const signin = async (req, res ) => {
    const {email, password} = req.body;

    try {
        
        const user = await UserModal.findOne({ email });
        if (!user) return res.status(404).json({ message: "User dosn't exists" })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })

        const token = jwt.sign({email: user.email, id: user._id}, secret, { expiresIn: "24h" });
        const userobj = user.toObject()
        delete userobj.password
        res.status(200).json({ result:userobj, token })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong" + error})
    }

}


export const getUser = async (req, res) => {
    const {id} = req.params

    try {
        const user = await UserModal.findById(id)
        if(user){
            const userobj = user.toObject()
            delete userobj.password

            const posts = await PostMessage.find({ creator: id })

            res.status(200).json({user:userobj, posts})
        } else {
            res.status(404).json({message: "user not found!"})
        }
    } catch (error) {
        res.status(404).json({message: error.message})
    }

}

export const updateUser = async (req, res) => {
    const {id} = req.params
    const {name, imageUrl, bio} = req.body;

    try {
        if(!req.userId) {return res.json({message: "Unauthenticated"})}
        const extractedId = req.userId
    
        if (id != extractedId) {return res.json({message: "you are not authorized to updated this user profile"})}
    
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id : ${id}`);
    
        const upatesUser = {name, imageUrl, bio, _id: id};
        let user = await UserModal.findByIdAndUpdate(id, upatesUser, {new: true})

        const posts = await PostMessage.find({ creator: id })

        res.status(200).json({user, posts})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const following = async (req, res) => {
    const { id } = req.params
    if(!req.userId) {return res.json({message: "Unauthenticated"})}

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id : ${id}`);

    try {
            
        const user1 = await UserModal.findById(id)
        const user2 = await UserModal.findById(req.userId)

        const index = user1.followers.find((ObjectId)=> ObjectId == String(req.userId))
        if(!index){
            user1.followers.push(req.userId)
            user2.following.push(id)

            // start Notification 
            const deatils = `${user2.name} Start Following You!`;
            const userIn = {name: user2.name, avatar: user2.imageUrl};

            const notificationData = {
                mainuid: user1._id,
                targetid: user2._id,
                deatils,
                user: userIn,
            }

            const notification = new Notification(notificationData)
            await notification.save()

        } else {
            const ID = String(req.userId)
            user1.followers = user1.followers.pull(ID)
            user2.following = user2.following.pull(id)
        }


        const updateduser1 = await UserModal.findByIdAndUpdate(id, user1, {new: true});
        const updateduser2 = await UserModal.findByIdAndUpdate(req.userId, user2, {new: true});

        res.status(200).json({updateduser1, updateduser2})
    } catch (error) {
        res.status(500).json({message: error.message})

    }

}

export const getSug = async (req, res)=>{
    
    const { id } = req.query
    if(!id) {return res.json({message: "Unauthenticated"})}

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id : ${id}`);


    try {
        let following = await UserModal.find({ $or: [{  followers: id }] }).select('followers following -_id')
        console.log("following", following, "f0", following[0])

        if (following && following[0]){

            let IFollowers = following[0]['followers'];
            let IFollowing = following[0]['following'];

            IFollowers = IFollowers.pull(id);
            IFollowing = IFollowing.pull(id);
            
            const MainUser = await UserModal.findById(id).select('following');
            const usdata = MainUser['following'];

            for (let index = 0; index < usdata.length; index++){
                const usersid = usdata[index]
                IFollowers = IFollowers.pull(usersid)
                IFollowing = IFollowing.pull(usersid)
            }

            let users = await UserModal.find({$or : [{ _id: IFollowing }, { _id: IFollowers }]}).limit(3);

            res.status(200).json({users})
        } else {
            res.status(200).json({users:[]})

        }



    } catch (error) {
        res.status(500).json({error})
    }
}














