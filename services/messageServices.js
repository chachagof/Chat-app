import { PrismaClient } from '@prisma/client';
import ValidationError from '../errors/ValidationError.js';
import ResourceNotFoundError from '../errors/ResourceNotFoundError.js';

const prisma = new PrismaClient();

const messageServices = {
  sendMessage: async (req) => {
    const { message } = req.body;
    const { user } = req;
    const { chatRoomId } = req.params;
    const numericChatRoomId = parseInt(chatRoomId, 10);

    if (!message || typeof (message) !== 'string') throw new ValidationError('請傳送正確消息');

    const checkchatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: numericChatRoomId,
      },
    });

    if (!checkchatRoom) throw new ResourceNotFoundError('查無此房間');

    const sendMessage = await prisma.message.create({
      data: {
        chatRoomId: numericChatRoomId,
        userId: user.id,
        content: message,
      },
    });

    if (!sendMessage) throw new ValidationError('無法傳送訊息');

    return {
      statusCode: 200,
      data: { message: '完成訊息傳送' },
    };
  },
};

export default messageServices;
