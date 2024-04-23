import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

// register
router.post('/register', userController.register)

// signin
router.post("/signin", userController.signin);

// signout
router.get('/signout', userController.signout)

// user info
router.get('/users/:userId',userController.getUser)
router.put('/users/:userId', userController.editUser)

export default router;
