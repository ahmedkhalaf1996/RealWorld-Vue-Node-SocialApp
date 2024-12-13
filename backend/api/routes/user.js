import express from 'express'
const router = express.Router();

import {signup, signin, getUser,updateUser, following, getSug} from '../controllers/user.js'


import auth from '../middleware/auth.js';

/**
 * @openapi
 * components:
 *   schemas:
 *      User:
 *        type: object 
 *        properties:
 *          email:
 *              type: string 
 *          name:
 *              type: string 
 *          imageUrl:
 *              type: string
 *          bio:
 *              type: string
 *      SigninCredentials:
 *          type: object 
 *          properties:
 *           email:
 *              type: string 
 *           password:
 *              type: string          
 * 
 *      SignupCredentials:
 *          type: object 
 *          properties:
 *           email:
 *              type: string 
 *           password:
 *              type: string  
 *           firstName:
 *              type: string 
 *           lastName:
 *              type: string 
 */




/**
 * @openapi
 * /user/signin:
 *   post:
 *      summary: User sign In
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SigninCredentials'
 *      responses:
 *          200:
 *              description: Succufully signed in
 * 
 */

router.post("/signin", signin);

/**
 * @openapi
 * /user/signup:
 *   post:
 *      summary: User sign up
 *      tags: [Authentication]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SignupCredentials'
 *      responses:
 *          201:
 *              description: Succufully retreived user deatils
 * 
 */

router.post('/signup', signup)


/**
 * @openapi
 * /user/getUser/{id}:
 *   get:
 *      summary: Get User Deatils
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id 
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Succufully signed up
 * 
 */

router.get("/getUser/:id", getUser)



/**
 * @openapi
 * /user/getSug:
 *   get:
 *      summary: Get Suggested users
 *      tags: [Users]
 *      parameters:
 *          - in: query
 *            name: id 
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Succufully retrived suggested users
 * 
 */

router.get('/getSug', getSug)



/**
 * @openapi
 * /user/Update/{id}:
 *   patch:
 *      summary: Update User Deatils
 *      tags: [Users]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id 
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *           application/json:
 *              schema:
 *                  type: object 
 *                  properties:
 *                    name:
 *                      type: string
 *                    imageUrl:
 *                      type: string
 *                    bio:
 *                      type: string
 *      responses:
 *          200:
 *              description: Succufully updated user data
 * 
 */

router.patch("/Update/:id",auth, updateUser)




/**
 * @openapi
 * /user/{id}/following:
 *   patch:
 *      summary: follow/Unfollow User
 *      tags: [Users]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id 
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Succufully followed/unfollowed user 
 * 
 */

router.patch("/:id/following",auth, following)



export default router;




