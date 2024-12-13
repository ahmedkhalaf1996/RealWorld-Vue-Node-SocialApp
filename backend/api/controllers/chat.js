import Message from '../models/message.js';
import unReadedmessages from '../models/unReadedmessage.js'
import mongoose from 'mongoose';


export const sendmessage = async (req, res) => {
    try {
        const msg = req.body;

        const newMsg = new Message({ ...msg })

        UpdatedUserUnReadmsg(newMsg)

        await newMsg.save();

        res.status(201).json(newMsg)


    } catch (error) {
        res.status(400).json({ message: error.message })

    }
}

export const UpdatedUserUnReadmsg = async (x) => {
   try {
    const sender = x.sender 
    const recever = x.recever 

    if (!mongoose.Types.ObjectId.isValid(sender)) return res.status(404).send(`No post with id : ${id}`);
    if (!mongoose.Types.ObjectId.isValid(recever)) return res.status(404).send(`No post with id : ${id}`);

    const existingRecored = await unReadedmessages.findOneAndUpdate(
        {mainUserid: recever, otherUserid: sender},
        { $inc: {numOfUnreadedMessages: 1}, isreded: false },
        {new: true}
    )

    if (!existingRecored){
        await unReadedmessages.create({
            mainUserid: recever,
            otherUserid: sender,
            numOfUnreadedMessages: 1,
            isreded: false,
        })
    }

   } catch (error) {
         return   res.status(500).json({ message: error.message })
   }
    

}


export const getmsgsbynums = async (req, res) => {
    try {
        const {from , firstuid, seconduid} = req.query;

        const senderFilter = {sender: firstuid, recever: seconduid}
        const receverFilter = {sender: seconduid, recever: firstuid}

        const LIMIT = 2
        const messages = await Message
            .find({ $or: [senderFilter, receverFilter] })
            .sort({ _id: -1 })
            .skip(from * LIMIT)
            .limit(LIMIT)
            .exec();

            messages.reverse();
            res.status(200).json({ msgs: messages })


    } catch (error) {
       res.status(500).json({ message: error.message })
    }
}



export const GetUserUnreadedMsg = async (req, res)=> {
    try {
        
        const {userid} = req.query 
        if(!userid){
            return res.status(400).json({ message: 'userid is required as query param, missing' })
        }

        const urms = await unReadedmessages.find({ mainUserid: userid, isreded: false })

        const totalUnraededMessageCount = urms.reduce((total, msg)=> total + msg.numOfUnreadedMessages, 0);

        res.json({messages:urms,  total: totalUnraededMessageCount})
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


export const MarkMsgAsReaded = async (req, res) => {
    try {
        const {mainuid, otheruid} = req.query 
        if(!mainuid || !otheruid){
            return res.status(400).json({ message: 'mainuid and otheruid required as query param, missing' })
        }

        // fillter
        const filter = {  mainUserid: mainuid, otherUserid: otheruid };
        const update = { $set: { isreded: true, numOfUnreadedMessages: 0 } }

        const result = await unReadedmessages.findOneAndUpdate(filter, update, { upsert: true, new: true });
        if(result){
            res.status(200).json({ isMarked: true })
        } else {
            res.status(200).json({ isMarked: false })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


