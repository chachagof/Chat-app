import userServices from '../services/userServices.js';
import { successResponse } from '../utils/responseTemplate.js';

const userController = {
  register: async (req, res, next) => {
    try {
      const data = await userServices.register(req.body);
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
  signin: async (req, res, next) => {
    try {
      const data = await userServices.signin(req);
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const data = await userServices.getUser(req.params.userId);
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
  editUser: async (req, res, next) => {
    try {
      const {
        password,
        confirmPassword,
        name,
        description,
      } = req.body;
      const { userId } = req.params;
      const data = await userServices.editUser({
        password,
        confirmPassword,
        name,
        description,
        userId,
      });
      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
