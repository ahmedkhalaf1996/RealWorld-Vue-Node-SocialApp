import Notification from "../models/notification.js";

// MarknotAsReaded

export const getuserNotification = async (req , res ) => {
    try {
        const {userid} = req.params;
        
        const filter = { mainuid: { $regex: new RegExp(userid, 'i') }}
        let notifications = await Notification.find(filter).exec();

        notifications = notifications.reverse();

        res.status(200).json({notifications})

    } catch (error) {
        res.status(500).json({ message: error.message }) 

    }
}


export const MarknotAsReaded = async (req , res ) => {
    try {
        
        const {id} = req.query;
        console.log(id, "any")
        const filter = { mainuid: { $regex: new RegExp(id, 'i') }}
        const update = { $set: { isreded: true }};

        await Notification.updateMany(filter, update);

        const notifications = await Notification.find(filter)
            .sort({ craetedAt: -1 })
            .exec();


        res.status(200).json({notifications})


    } catch (error) {
        res.status(500).json({ message: error.message }) 

    }
}
