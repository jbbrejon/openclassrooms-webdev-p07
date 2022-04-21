// SCRIPT DESCRIPTION : "Express" routes for "/api/auth/signup" and "api/auth/login" (called from ../app.js)

// Module dependencies
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const express = require('express');

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();

// Set route : "/api/auth/signup" POST requests
router.post('/signup', userCtrl.signup);
// Set route : "/api/auth/login" POST requests
router.post('/login', userCtrl.login);
// Set route : "/api/auth/:id" DELETE requests
router.delete('/:id', auth, userCtrl.deleteUser);
// Set route : "/api/auth/:id" PUT requests
router.put('/:id', auth, multer, userCtrl.modifyUser);
// Set route : "/api/auth/:id" GET requests
router.get('/:id', auth, userCtrl.getOneUser);
// Set route : "/api/auth/" GET requests
router.get('/', auth, userCtrl.getAllUsers);
// Set route : "/api/auth/image/:id" PUT requests
router.put('/image/:id', auth, multer, userCtrl.modifyUserPicture);

module.exports = router;