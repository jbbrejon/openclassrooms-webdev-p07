// SCRIPT DESCRIPTION : "Express" routes for "/api/comment" (called from ../app.js)


// Module dependencies
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const express = require('express');

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();

// Set route : "/api/comment" POST requests
router.post('/', auth, multer, commentCtrl.createComment);
// Set route : "/api/comment/:id" DELETE requests
router.delete('/:id', auth, commentCtrl.deleteComment);
// Set route : "/api/comment/:id" PUT requests
router.put('/:id', auth, multer, commentCtrl.modifyComment);
// Set route : "/api/comment" GET requests
router.get('/', auth, commentCtrl.getAllComments);
// Set route : "/api/comment/:id" GET requests
router.get('/:id', auth, commentCtrl.getOneComment);

module.exports = router;