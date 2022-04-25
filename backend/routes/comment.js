// SCRIPT DESCRIPTION : "Express" routes for "/api/auth/signup" and "api/auth/login" (called from ../app.js)

// Module dependencies
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const express = require('express');

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();


// Specify which controller to call for each route
router.post('/', auth, multer, commentCtrl.createComment);
router.delete('/:id', auth, commentCtrl.deleteComment);
router.put('/:id', auth, multer, commentCtrl.modifyComment);
router.get('/', auth, commentCtrl.getAllComments);
router.get('/:id', auth, commentCtrl.getOneComment);

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = router;