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
  getMessage: async (req) => {
    const { chatRoomId } = req.params;
    const { id } = req.user;
    const numericChatRoomId = parseInt(chatRoomId, 10);

    const checkRoom = await prisma.chatRoom.findUnique({
      where: {
        id: numericChatRoomId,
      },
      include: {
        chatMembers: true,
      },
    });

    if (!checkRoom) throw new ResourceNotFoundError('查無此房間');

    const chatMember = checkRoom.chatMembers;
    const checkMember = chatMember.find((member) => member.userId === id);

    if (!checkMember) throw new ValidationError('無權限查閱訊息');

    const chatRoomMessage = await prisma.message.findMany({
      where: {
        chatRoomId: numericChatRoomId,
      },
    });

    return {
      statusCode: 200,
      data: chatRoomMessage,
    };
  },
  deleteMessage: async (req) => {
    const { chatRoomId, messageId } = req.params;
    const { id } = req.user;
    const numericChatRoomId = parseInt(chatRoomId, 10);
    const numericMessageId = parseInt(messageId, 10);

    const checkMessage = await prisma.message.findFirst({
      where: {
        id: numericMessageId,
        chatRoomId: numericChatRoomId,
        userId: id,
      },
    });

    if (!checkMessage) throw new ResourceNotFoundError('查無該訊息或該用戶無權限');

    const deleteMessage = await prisma.message.delete({
      where: {
        id: numericMessageId,
      },
    });

    if (!deleteMessage) throw new ResourceNotFoundError('查無該訊息');
    console.log(' deleteMessage :', deleteMessage);

    return {
      statusCode: 200,
      data: { message: '成功刪除訊息' },
    };
  },
};

export default messageServices;
