import userServices from '../services/userServices.js';

const userController = {
  register: async (req, res, next) => {
    try {
      const data = await userServices.register(req.body);
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
  signin: async (req, res, next) => {
    try {
      const data = await userServices.signin(req);
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const data = await userServices.getUser(req.params.userId);
      return res.json(data);
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
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
