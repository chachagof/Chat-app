import express from 'express';
import userController from '../controllers/userController.js';
import passport from '../config/passport.js';
import authenticated from '../middleware/authenticate.js';

const router = express.Router();

// register
router.post('/register', userController.register);

// signin
router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signin,
);

// user info
router.get('/users/:userId', authenticated, userController.getUser);
router.put('/users/:userId', authenticated, userController.editUser);

export default router;
