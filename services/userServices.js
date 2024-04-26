import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const userServices = {
  register: async (req, cb) => {
    try {
      const { name, account, password, confirmPassword } = req.body;

      if (!name || !account || !password || !confirmPassword)
        throw new Error("請填寫完整資料");

      if (password !== confirmPassword) throw new Error("密碼錯誤");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const createUser = await prisma.user.create({
        data: {
          name,
          account,
          password: hash,
        },
      });

      if (!createUser) throw new Error("用戶尚未完成建立");

      return cb(null, {
        state: "200",
        message: "用戶已成功建立",
      });
    } catch (err) {
      return cb(err);
    }
  },
  signin: async (req, cb) => {
    try {
      if (!req.user) throw new Error("身分驗證失敗");

      const userInfo = { ...req.user };
      delete userInfo.password;
      const token = jwt.sign(req.user, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return cb(null, {
        state: "200",
        message: "登入成功",
        data: {
          user: userInfo,
          token,
        },
      });
    } catch (err) {
      return cb(err);
    }
  },
  getUser: async (req, cb) => {
    try {
      const { userId } = req.params;
      const userInfo = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!userInfo) throw new Error("查無此用戶");

      return cb(null, {
        state: "200",
        data: userInfo,
      });
    } catch (err) {
      cb(err);
    }
  },
  editUser: async (req, cb) => {
    try {
      const { password, confirmPassword, name, description } = req.body;
      const { userId } = req.params;
      const userInfo = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (password !== confirmPassword) throw new Error("密碼不一致");

      if (!userInfo) throw new Error("查無此用戶");

      const updateData = {};
      if (password) updateData.password = password;
      if (name) updateData.name = name;
      if (description) updateData.description = description;

      const update = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: updateData,
      });

      return cb(null, {
        state: "200",
        message: "用戶資料更新成功",
      });
    } catch (err) {
      cb(err);
    }
  },
};

export default userServices;
