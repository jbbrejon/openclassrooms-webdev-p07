// SCRIPT DESCRIPTION : "Express" routes for "/api/post (called from ../app.js)

// Module dependencies
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const express = require('express');

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();

// Set route : "/api/post" GET requests
router.get('/', auth, postCtrl.getAllPosts);
// Set route : "/api/post/:id" POST requests
router.get('/:id', auth, postCtrl.getOnePost);
// Set route : "/api/post" POST requests
router.post('/', auth, multer, postCtrl.createPost);
// Set route : "/api/post/:id" DELETE requests
router.delete('/:id', auth, postCtrl.deletePost);
// Set route : "/api/post/:id" PUT requests
router.put('/:id', auth, postCtrl.modifyPostDescription);
// Set route : "/api/post/image/:id" DELETE requests
router.put('/image/:id', auth, multer, postCtrl.modifyPostPicture);

module.exports = router;