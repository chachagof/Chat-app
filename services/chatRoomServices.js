/* eslint-disable import/prefer-default-export */
import { PrismaClient, ChatRoomType } from '@prisma/client';
import ResourceDuplicateError from '../errors/ResourceDuplicateError.js';
import ResourceNotFoundError from '../errors/ResourceNotFoundError.js';
import ValidationError from '../errors/ValidationError.js';

const prisma = new PrismaClient();
export async function createChatRoom({
  userId, type, name = '', friendId,
}) {
  let isGroupChatRoom = true;
  const numericFriendId = Number(friendId);

  if (type === ChatRoomType.PERSONAL) isGroupChatRoom = false;

  if (!isGroupChatRoom) {
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
    return createResult;
  }

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
  return createResult;
}

export async function connectChatRoom(req) {
  const { chatRoomId } = req.params;
  const { user } = req;
  const id = parseInt(chatRoomId, 10);

  // 確認房間
  const joinRoom = await prisma.chatRoom.findUnique({ where: { id } });

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
    const isMember = await prisma.chatMember.findMany({
      where: {
        chatRoomId: id,
        userId: user.id,
      },
    });

    if (isMember.length === 0) throw new ValidationError('沒有進入房間資格', 401);

    resData.validation = true;

    return resData;
  }

  // 確認房間類型-群組
  const checkGroupMember = await prisma.chatMember.findMany({
    where: {
      chatRoomId: id,
      userId: user.id,
    },
  });

  if (checkGroupMember.length === 0) {
    const joinGroupChatRoom = await prisma.chatMember.create({
      data: {
        chatRoomId: id,
        userId: user.id,
      },
    });

    if (!joinGroupChatRoom) throw new ValidationError('無法加入群組', 404);
  }

  resData.validation = true;

  return resData;
}
