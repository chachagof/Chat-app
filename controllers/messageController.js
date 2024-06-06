import messageServices from '../services/messageServices.js';
import { successResponse } from '../utils/responseTemplate.js';

const messageController = {
  sendMessage: async (req, res, next) => {
    try {
      const data = await messageServices.sendMessage(req);
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
};

export default messageController;
