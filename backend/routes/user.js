// SCRIPT DESCRIPTION : "Express" routes for "/api/auth/" (called from ../app.js)

// Module dependencies
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const express = require('express');

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();


// Specify which controller to call for each route
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id', auth, userCtrl.deleteUser);
router.put('/:id', auth, multer, userCtrl.modifyUser);
router.get('/:id', auth, userCtrl.getOneUser);
router.get('/', auth, userCtrl.getAllUsers);
router.put('/image/:id', auth, multer, userCtrl.modifyUserPicture);

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = router;