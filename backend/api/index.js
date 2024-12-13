import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import {setupSwagger} from './swagger.js'

import userRouter from './routes/user.js'
import postRouter from './routes/posts.js'
import chatRouter from './routes/chat.js'
import notificationRouter from './routes/notification.js'

const app = express();

app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({  limit:'30mb', extended: true }))
app.use(cors());

// setup swagger
setupSwagger(app);

app.use('/user', userRouter)
app.use('/posts', postRouter)
app.use('/chat', chatRouter)
app.use('/notification', notificationRouter)



const CONNECtION_URL = "mongodb://localhost:27017/social"

const PORT = process.env.PORT || 5000;

// mongoose.connect(CONNECtION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(CONNECtION_URL)
        .then(() => app.listen(PORT, ()=> console.log(`server runing on port : ${PORT}`))    )
        .catch((err) => console.log(err.message))
