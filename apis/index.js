import express from 'express';
import userController from '../controllers/userController.js';
import friendshipController from '../controllers/friendshipController.js';
import passport from '../config/passport.js';
import authenticated from '../middleware/authenticate.js';
import chatRoomController from '../controllers/chatRoomController.js';
import messageController from '../controllers/messageController.js';

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

// create chatRoom
router.post(
  '/chatRoom',
  authenticated,
  chatRoomController.create,
);

// connect chatRoom
router.post(
  '/chatRoom/:chatRoomId',
  authenticated,
  chatRoomController.connectChatRoom,
);

// get chatRoom
router.get(
  '/chatRoom/:chatRoomId',
  authenticated,
  chatRoomController.getChatRoom,
);

// send message
router.post(
  '/chatRoom/:chatRoomId/message',
  authenticated,
  messageController.sendMessage,
);

// get message
router.get(
  '/chatRoom/:chatRoomId/message',
  authenticated,
  messageController.getMessage,
);

export default router;
