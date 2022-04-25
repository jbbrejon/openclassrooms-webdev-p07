// SCRIPT DESCRIPTION : "Express" routes for "/api/auth/signup" and "api/auth/login" (called from ../app.js)

// Module dependencies
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const express = require('express');

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();


// Specify which controller to call for each route
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.put('/:id', auth, postCtrl.modifyPostDescription);
router.put('/image/:id', auth, multer, postCtrl.modifyPostPicture);

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = router;