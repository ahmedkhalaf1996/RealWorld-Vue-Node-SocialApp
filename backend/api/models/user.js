import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    id: {type: String},
    imageUrl: {type: String},
    bio: {type: String},
    followers: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', default:[]},
    following: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', default:[]},

});

export default mongoose.model("User", userSchema);
