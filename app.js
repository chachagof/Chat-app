import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import apis from './apis/index.js';
import passport from './config/passport.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './logger/logger.js';
import initializeSocketIo from './services/socketIoServices.js';

if (process.env.NODE_ENT !== 'production') {
  dotenv.config();
}

const app = express();
const { PORT } = process.env;
const server = createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', apis);
app.use(errorHandler);

initializeSocketIo(server);

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`It's listen on http://localhost:${PORT}`);
});
