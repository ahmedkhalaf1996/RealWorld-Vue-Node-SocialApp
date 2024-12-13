import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    content: {type: String, required: true},
    sender: {type: String, required: true},
    recever: {type: String, required: true},
})

export default mongoose.model("Message", messageSchema)







