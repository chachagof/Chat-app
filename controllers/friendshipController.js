import friendshipService from '../services/friendshipServices.js';
import { successResponse } from '../utils/responseTemplate.js';

const friendshipController = {
  getFriendship: async (req, res, next) => {
    try {
      const data = await friendshipService.getFriendship(req);
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
  changeFriendship: async (req, res, next) => {
    try {
      const data = await friendshipService.changeFriendship(req);
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
  deleteFriendship: async (req, res, next) => {
    try {
      const data = await friendshipService.deleteFriendship(req);
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
};

export default friendshipController;
