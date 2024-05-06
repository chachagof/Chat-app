import friendshipService from '../services/friendshipServices.js';
import { successResponse } from '../utils/responseTemplate.js';

const friendshipController = {
  getFriendship: async (req, res, next) => {
    try {
      const responseData = await friendshipService.getFriendship(req);
      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
  getFriendships: async (req, res, next) => {
    try {
      const responseData = await friendshipService.getFriendships(req);
      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
  changeFriendship: async (req, res, next) => {
    try {
      const responseData = await friendshipService.changeFriendship(req);
      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
  deleteFriendship: async (req, res, next) => {
    try {
      const responseData = await friendshipService.deleteFriendship(req);
      const { data, statusCode } = responseData;
      return successResponse(res, data, statusCode);
    } catch (error) {
      return next(error);
    }
  },
};

export default friendshipController;
