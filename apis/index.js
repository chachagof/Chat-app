import express from 'express';
import userController from '../controllers/userController.js';
import friendshipController from '../controllers/friendshipController.js';
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

// get friendship
router.get(
  '/friendship/:friendId',
  authenticated,
  friendshipController.getFriendship,
);

// get friendships
router.get(
  '/friendship',
  authenticated,
  friendshipController.getFriendships,
);

// change friendship
router.post('/friendship/:friendId', authenticated, friendshipController.changeFriendship);

// delete friendship
router.delete(
  '/friendship/:friendId',
  authenticated,
  friendshipController.deleteFriendship,
);

export default router;
