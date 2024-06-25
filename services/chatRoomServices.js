/* eslint-disable import/prefer-default-export */
import { PrismaClient, ChatRoomType } from '@prisma/client';
import ResourceDuplicateError from '../errors/ResourceDuplicateError.js';
import ResourceNotFoundError from '../errors/ResourceNotFoundError.js';
import ValidationError from '../errors/ValidationError.js';
import logger from '../logger/logger.js';

const prisma = new PrismaClient();
export async function createChatRoom({
  userId, type, name = '', friendId,
}) {
  logger.debug(`用戶 : ${userId} 建立聊天室`);

  let isGroupChatRoom = true;
  const numericFriendId = Number(friendId);

  if (type === ChatRoomType.PERSONAL) isGroupChatRoom = false;

  if (!isGroupChatRoom) {
    logger.debug(`用戶 : ${userId} 與朋友: ${friendId} 建立個人聊天室`);
    const friendChatRoom = await prisma.chatRoom.findMany({
      where: {
        type: ChatRoomType.PERSONAL,
        chatMembers: {
          some: {
            userId: numericFriendId,
          },
        },
      },
      include: {
        chatMembers: true,
      },
    });
    const myChatRoom = await prisma.chatRoom.findMany({
      where: {
        type: ChatRoomType.PERSONAL,
        chatMembers: {
          some: { userId },
        },
      },
      include: {
        chatMembers: true,
      },
    });
    const friendChatRoomSet = friendChatRoom.reduce((acc, cur) => {
      acc.add(cur.id);
      return acc;
    }, new Set());

    myChatRoom.forEach((val) => {
      if (friendChatRoomSet.has(val.id)) throw new ResourceDuplicateError();
    });

    const createResult = await prisma.chatRoom.create({
      data: {
        name,
        type,
        chatMembers: {
          createMany: {
            data: [{
              userId,
            }, {
              userId: numericFriendId,
            }],
          },
        },
      },
    });

    logger.info(`用戶: ${userId} 與朋友: ${friendId} 成功建立個人聊天室`);
    return createResult;
  }

  logger.debug(`用戶: ${userId} 建立群組聊天室: ${name}`);
  const createResult = await prisma.chatRoom.create({
    data: {
      name,
      type,
      chatMembers: {
        create: {
          userId,
        },
      },
    },
  });

  logger.info(`用戶: ${userId} 成功建立群組聊天室: ${name}`);

  return createResult;
}

export async function connectChatRoom({ chatRoomId, userId }) {
  logger.debug(`用戶: ${userId} 連線聊天室: ${chatRoomId}`);

  const numericFriendId = parseInt(chatRoomId, 10);

  // 確認房間
  const joinRoom = await prisma.chatRoom.findUnique({ where: { id: numericFriendId } });

  if (!joinRoom) throw new ResourceNotFoundError('尚未建立聯繫', 404);

  // 確認回傳格式
  const resData = {
    chatRoomId,
    roomName: joinRoom.name,
    roomType: joinRoom.type,
    validation: false,
  };

  // 確認房間類型-個人
  if (joinRoom.type === ChatRoomType.PERSONAL) {
    logger.debug(`用戶: ${userId} 連線個人聊天室: ${chatRoomId}`);

    const isMember = await prisma.chatMember.findMany({
      where: {
        chatRoomId: numericFriendId,
        userId,
      },
    });

    if (isMember.length === 0) throw new ValidationError('沒有進入房間資格', 401);

    resData.validation = true;

    logger.info(`用戶: ${userId} 連線個人聊天室: ${chatRoomId}`);

    return resData;
  }

  // 確認房間類型-群組
  logger.debug(`用戶: ${userId} 連線群組聊天室: ${chatRoomId}`);

  const checkGroupMember = await prisma.chatMember.findMany({
    where: {
      chatRoomId: numericFriendId,
      userId,
    },
  });

  if (checkGroupMember.length === 0) {
    const joinGroupChatRoom = await prisma.chatMember.create({
      data: {
        chatRoomId: numericFriendId,
        userId,
      },
    });

    if (!joinGroupChatRoom) throw new ValidationError('無法加入群組', 404);
  }

  resData.validation = true;

  logger.info(`用戶: ${userId} 建立群組聊天室: ${chatRoomId}`);

  return resData;
}

export async function getChatRoom({ chatRoomId, userId }) {
  logger.debug(`用戶: ${userId} 嘗試取得聊天室: ${chatRoomId} 資訊`);

  const numericFriendId = parseInt(chatRoomId, 10);

  // 確認聊天室
  const data = await prisma.chatRoom.findUnique({ where: { id: numericFriendId } });

  if (!data) throw new ResourceNotFoundError('查無此聊天室', 404);

  // 確認資格
  const member = await prisma.chatMember.findMany({ where: { chatRoomId: numericFriendId } });

  const isMember = member.some((m) => m.userId === userId);

  if (!isMember) throw new ValidationError('此用戶不再聊天室內，無法查詢', 400);

  logger.info(`用戶: ${userId} 取得聊天室: ${chatRoomId} 資訊`);

  return data;
}
