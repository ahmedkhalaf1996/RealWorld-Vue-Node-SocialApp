import mongoose from "mongoose";

const userInSchema = mongoose.Schema({
    name: {type: String, required: true},
    avatar: {type: String},
})

const notificationSchema = mongoose.Schema({
    deatils: {type: String, required: true},
    mainuid: {type: String, required: true},
    targetid: {type: String, required: true},
    isreded: {type: Boolean, default: false},
    createdAt: {
        type: Date,
        default: new Date(),
    },
    user: {type: userInSchema, required: true},
})

var Notification = mongoose.model('Notification', notificationSchema);

export default Notification;








