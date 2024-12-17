const express = require("express")
const router = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { upload } = require('../config/multerConfig')
const { register, login, getUserProfile, googleLogin ,updateUserProfile}  = require('../controllers/authController')
router.post('/register', register)
router.post('/login', login)
router.post('/google-login', googleLogin);
router.get('/user-profile',authMiddleware, getUserProfile)
router.put('/update-profile', authMiddleware,upload.single('image'),updateUserProfile)
module.exports = router;