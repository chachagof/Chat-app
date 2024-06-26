import { createChatRoom } from '../services/chatRoomServices.js';
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
};

export default chatRoomController;
