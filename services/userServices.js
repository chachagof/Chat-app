import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ValidationError from '../errors/ValidationError.js';
import logger from '../logger/logger.js';

const prisma = new PrismaClient();

const userServices = {
  register: async ({
    name, account, password, confirmPassword,
  }) => {
    logger.debug(`用戶嘗試註冊 name: ${name}, account: ${account}`);

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

    logger.info(`用戶已成功建立 userId:${createUser.id}`);

    return {
      statusCode: 201,
      data: { message: '用戶已成功建立' },
    };
  },
  signin: async ({ user }) => {
    logger.debug(`用戶嘗試登入 user: ${user.id}`);

    if (!user) throw new ValidationError('身分驗證失敗', 401);

    const userInfo = { ...user };
    delete userInfo.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    logger.info('登入成功');

    return {
      statusCode: 200,
      data: {
        message: '登入成功',
        user: userInfo,
        token,
      },
    };
  },
  getUser: async (userId) => {
    logger.debug(`查詢用戶資料 user: ${userId}`);

    const userInfo = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!userInfo) throw new ValidationError('查無此用戶', 403);

    delete userInfo.password;

    logger.info('查詢成功');

    return {
      statusCode: 200,
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
    logger.debug(`用戶更新資料 user: ${userId}`);

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

    logger.info('用戶資料更新成功');

    return {
      statusCode: 200,
      data: { message: '用戶資料更新成功' },
    };
  },
};

export default userServices;
