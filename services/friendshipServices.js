import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const friendStatusList = {
  1: 'follow',
  2: 'block',
};

const friendshipService = {
  getFriendship: async (req) => {
    const userId = parseInt(req.user.id, 10);
    const friendId = parseInt(req.params.friendId, 10);
    const friendship = await prisma.friend.findMany({ where: { userId, friendId } });
    if (!friendship[0]) throw new Error('尚未建立好友關係');
    return {
      statusCode: 200,
      data: friendship,
    };
  },
  getFriendships: async (req) => {
    const { user } = req;
    const userId = parseInt(user.id, 10);
    const friendships = await prisma.friend.findMany({ where: { userId } });
    if (!friendships) throw new Error('此用戶尚未擁有好友');
    return {
      statusCode: 200,
      data: friendships,
    };
  },
  changeFriendship: async (req) => {
    // 所需資料
    const userId = parseInt(req.user.id, 10);
    const friendId = parseInt(req.params.friendId, 10);
    const friendStatus = parseInt(req.body.friendStatus, 10);

    // 尋找好友
    const friendship = await prisma.friend.findMany({ where: { userId, friendId } });

    // 新增好友狀態
    if (!friendship[0]) {
      await prisma.friend.create({
        data: {
          userId,
          friendId,
          status: friendStatus,
        },
      });
      return {
        statusCode: 201,
        data: { message: '已完成新增好友' },
      };
    }

    // 確認變更狀態
    if (friendship[0].status === friendStatus) {
      if (friendStatusList[friendStatus] === 'follow') throw new Error('已加為好友');
      if (friendStatusList[friendStatus] === 'block') throw new Error('已完成封鎖');
    }

    // 更改好友狀態
    await prisma.friend.updateMany({
      where: {
        userId,
        friendId,
      },
      data: {
        status: parseInt(friendStatus, 10),
      },
    });
    return {
      statusCode: 200,
      data: { message: '完成好友狀態變更' },
    };
  },
  deleteFriendship: async (req) => {
    const userId = parseInt(req.user.id, 10);
    const friendId = parseInt(req.params.friendId, 10);
    const deleteFriendship = await prisma.friend.deleteMany({ where: { userId, friendId } });

    if (deleteFriendship.count === 0) throw new Error('尚未加入好友');

    return {
      statusCode: 200,
      data: {
        message: '成功刪除好友',
      },
    };
  },
};

export default friendshipService;
