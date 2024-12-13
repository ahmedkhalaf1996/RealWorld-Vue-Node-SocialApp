import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title:  {type: String, required: true},
    message:  {type: String, required: true},
    name: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    selectedFile: String,
    likes: {type: [String], default:[]},
    comments: {type: [String], default:[]},
    createdAt: {
        type: Date,
        default : new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
