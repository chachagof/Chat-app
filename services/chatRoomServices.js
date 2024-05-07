/* eslint-disable import/prefer-default-export */
import { PrismaClient, ChatRoomType } from '@prisma/client';
import ResourceDuplicateError from '../errors/ResourceDuplicateError.js';

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
