import mongoose from "mongoose";

const UnReadedMsgSchema = mongoose.Schema({
    mainUserid: {type: String, required: true},
    otherUserid: {type: String, required: true},
    numOfUnreadedMessages: {type: Number, required: true},
    isreded: {type: Boolean, required: true},
    
})

export default mongoose.model("Unreaded_messages", UnReadedMsgSchema)
