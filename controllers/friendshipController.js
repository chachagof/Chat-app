import friendshipService from '../services/friendshipServices.js';
import { successResponse } from '../utils/responseTemplate.js';

const friendshipController = {
  getFriendship: async (req, res, next) => {
    try {
      const userId = parseInt(req.user.id, 10);
      const friendId = parseInt(req.params.friendId, 10);

      const responseData = await friendshipService.getFriendship(userId, friendId);

      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
  getFriendships: async (req, res, next) => {
    try {
      const userId = parseInt(req.user.id, 10);

      const responseData = await friendshipService.getFriendships(userId);

      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
  changeFriendship: async (req, res, next) => {
    try {
      const userId = parseInt(req.user.id, 10);
      const friendId = parseInt(req.params.friendId, 10);
      const friendStatus = parseInt(req.body.friendStatus, 10);

      const responseData = await friendshipService.changeFriendship(userId, friendId, friendStatus);

      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
  deleteFriendship: async (req, res, next) => {
    try {
      const userId = parseInt(req.user.id, 10);
      const friendId = parseInt(req.params.friendId, 10);

      const responseData = await friendshipService.deleteFriendship(userId, friendId);

      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
};

export default friendshipController;
