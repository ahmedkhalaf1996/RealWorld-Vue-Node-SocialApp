import express from 'express'
// import {sendmessage, 
//     getmsgsbynums, 
//     GetUserUnreadedMsg, 
//     MarkMsgAsReaded} from '../controllers/chat.js'

import {sendmessage, getmsgsbynums, GetUserUnreadedMsg, MarkMsgAsReaded} from '../controllers/chat.js'
const router = express.Router();
/**
 * @openapi
 * components:
 *   schemas:
 *      Message:
 *        type: object 
 *        properties:
 *          _id:
 *              type: string 
 *          sender:
 *              type: string 
 *          recever:
 *              type: string
 *          content:
 *              type: string
 *          ceratedAt:
 *              type: string
 *              format: date-time
 *      UnreadedMessage:
 *        type: object 
 *        properties:
 *          _id:
 *              type: string 
 *          mainUserid:
 *              type: string 
 *          otherUserid:
 *              type: string
 *          numOfUnreadedMessages:
 *              type: number
 *          isreded:
 *              type: boolean
 */




/**
 * @openapi
 * /chat/sendmessage:
 *   post:
 *      summary: send a new message
 *      tags: [Chat]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          sender:
 *                              type: string
 *                          recever:
 *                              type: string
 *                          content:
 *                              type: string
 *      responses:
 *          201:
 *              description: Message send successfully
 * 
 */

router.post("/sendmessage", sendmessage);



/**
 * @openapi
 * /chat/getmsgsbynums:
 *   get:
 *      summary: Get Messages between 2 users by Pagenation
 *      tags: [Chat]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: from
 *            required: true
 *            schema:
 *              type: number
 *          - in: query
 *            name: firstuid
 *            schema:
 *              type: string
 *            required: true
 *          - in: query
 *            name: seconduid
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          201:
 *              description: Succufully retreived messages
 * 
 */

router.get('/getmsgsbynums', getmsgsbynums);


/**
 * @openapi
 * /chat/get-user-unreadedmsg:
 *   get:
 *      summary: Get User's Unreaded Messages
 *      tags: [Chat]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: userid
 *            required: true
 *            schema:
 *              type: string
 *            description: User id to fetch unreaded messages for
 *      responses:
 *          201:
 *              description: Succufully retreived unreaded messages
 * 
 */

router.get('/get-user-unreadedmsg', GetUserUnreadedMsg);




/**
 * @openapi
 * /chat/mark-msg-asreaded:
 *   get:
 *      summary: Mark Messages as Read
 *      tags: [Chat]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: mainuid
 *            required: true
 *            schema:
 *              type: string
 *            description: main user id 
 *          - in: query
 *            name: otheruid
 *            required: true
 *            schema:
 *              type: string
 *            description: other user id 
 *      responses:
 *          201:
 *              description: Succufully markded messages as read
 * 
 */

router.get('/mark-msg-asreaded', MarkMsgAsReaded);




export default router;




