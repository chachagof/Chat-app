import { Server } from 'socket.io';
import logger from '../logger/logger.js';

export default function initializeSocketIo(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    logger.info(`User ${socket.id} connected`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      logger.info(`User ${socket.id} join room ${room}`);
    });

    socket.on('message', ({ room, message }) => {
      io.to(room).emit('message', { user: socket.id, message });
      logger.info(`User ${socket.id} send message to room ${room}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User ${socket.id} disconnect`);
    });
  });
}
