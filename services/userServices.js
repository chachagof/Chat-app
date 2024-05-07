import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ValidationError from '../errors/ValidationError.js';

const prisma = new PrismaClient();

const userServices = {
  register: async ({
    name, account, password, confirmPassword,
  }) => {
    if (!name || !account || !password || !confirmPassword) {
      throw new ValidationError('請填寫完整資料', 400);
    }

    if (password !== confirmPassword) throw new ValidationError('密碼錯誤', 401);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createUser = await prisma.user.create({
      data: {
        name,
        account,
        password: hash,
      },
    });

    if (!createUser) throw new ValidationError('用戶尚未完成建立', 403);

    return {
      state: '200',
      message: '用戶已成功建立',
    };
  },
  signin: async ({ user }) => {
    if (!user) throw new ValidationError('身分驗證失敗', 401);

    const userInfo = { ...user };
    delete userInfo.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      state: '200',
      message: '登入成功',
      data: {
        user: userInfo,
        token,
      },
    };
  },
  getUser: async (userId) => {
    const userInfo = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!userInfo) throw new ValidationError('查無此用戶', 403);

    delete userInfo.password;

    return {
      state: '200',
      data: userInfo,
    };
  },
  editUser: async ({
    password,
    confirmPassword,
    name,
    description,
    userId,
  }) => {
    const userInfo = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });
    if (password !== confirmPassword) throw new ValidationError('密碼不一致', 403);

    if (!userInfo) throw new ValidationError('查無此用戶', 403);

    const updateData = {};
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      updateData.password = hash;
    }
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: updateData,
    });

    return {
      state: '200',
      message: '用戶資料更新成功',
    };
  },
};

export default userServices;
