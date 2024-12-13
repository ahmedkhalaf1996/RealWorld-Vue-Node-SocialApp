import express from 'express'
import {createPost, 
    getPost, 
    getPostsUsersBySearch, 
    updatePost,
    deletePost,
    getPosts,
    likePost,
    commentPost} from '../controllers/posts.js'
import auth from '../middleware/auth.js'

const router = express.Router();

/**
 * @openapi
 * /posts/search:
 *  get:
 *      summary: Search posts and users
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            name: searchQuery
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          200:
 *              description: Successfully reterived search result
 * 
 */

router.get('/search', getPostsUsersBySearch)



/**
 * @openapi
 * /posts:
 *  get:
 *      summary: Get posts with pagenition
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            required: true
 *            description: Page number
 *          - in: query
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User ID
 *      responses:
 *          200:
 *              description: Successfully reterived posts
 * 
 */

router.get('/', getPosts)

/**
 * @openapi
 * /posts/{id}:
 *  get:
 *      summary: Get Single post by id
 *      tags: [Posts]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          200:
 *              description: Successfully reterived post
 * 
 */

router.get('/:id', getPost)

/**
 * @openapi
 * /posts/{id}/commentPost:
 *  post:
 *      summary: Add a comment to post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          value:
 *                              type: string
 *      responses:
 *          200:
 *              description: Comment Added Successfully 
 * 
 */

router.post('/:id/commentPost', auth,commentPost)



/**
 * @openapi
 * /posts:
 *  post:
 *      summary: Create a new post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          message:
 *                              type: string
 *                          selectedFile:
 *                              type: string
 *      responses:
 *          200:
 *              description: Post created successfully
 * 
 */

router.post('/', auth, createPost)


/**
 * @openapi
 * /posts/{id}:
 *  patch:
 *      summary: Update an existing post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          message:
 *                              type: string
 *                          selectedFile:
 *                              type: string
 *      responses:
 *          200:
 *              description: Post Updated successfully
 * 
 */

router.patch('/:id', auth, updatePost)




/**
 * @openapi
 * /posts/{id}/likePost:
 *  patch:
 *      summary: like or unlike a post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          200:
 *              description: Post Liked/unliked  Successfully 
 * 
 */

router.patch('/:id/likePost', auth,likePost)



/**
 * @openapi
 * /posts/{id}:
 *  delete:
 *      summary: Delete a post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          200:
 *              description: Post deleted  Successfully 
 * 
 */

router.delete('/:id', auth,deletePost)

export default router;