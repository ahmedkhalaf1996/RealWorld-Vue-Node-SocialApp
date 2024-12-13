
import express from 'express';

import {MarknotAsReaded, getuserNotification} from '../controllers/notification.js'

const router = express.Router();




/**
 * @openapi
 * /notification/mark-notification-asreaded:
 *  get:
 *      summary: Mark notifications as read
 *      tags: [Notifications]
 *      parameters:
 *          - in: query
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Id of the user to mark notifications as read
 *      responses:
 *          200:
 *              description: successfully makrd notifications as read
 * 
 */

router.get('/mark-notification-asreaded',  MarknotAsReaded)



/**
 * @openapi
 * /notification/{userid}:
 *  get:
 *      summary: Get User Notifications
 *      tags: [Notifications]
 *      parameters:
 *          - in: path
 *            name: userid
 *            schema:
 *              type: string
 *            required: true
 *            description: Id of the user to fetch notifications 
 *      responses:
 *          200:
 *              description: successfully retreved user notifcations
 * 
 */

router.get('/:userid',  getuserNotification)





export default router;

