import { createChatRoom, connectChatRoom, getChatRoom } from '../services/chatRoomServices.js';
import { successResponse } from '../utils/responseTemplate.js';

const chatRoomController = {
  create: async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { type, name, friendId } = req.body;
      const result = await createChatRoom({
        userId, type, name, friendId,
      });

      return successResponse(res, { chatRoomId: result.id });
    } catch (error) {
      return next(error);
    }
  },
  connectChatRoom: async (req, res, next) => {
    try {
      const { chatRoomId } = req.params;
      const { id: userId } = req.user;
      const data = await connectChatRoom({ chatRoomId, userId });
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
  getChatRoom: async (req, res, next) => {
    try {
      const { chatRoomId } = req.params;
      const { id: userId } = req.user;
      const data = await getChatRoom({ chatRoomId, userId });
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
};

export default chatRoomController;
