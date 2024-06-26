import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import apis from './apis/index.js';
import passport from './config/passport.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './logger/logger.js';

if (process.env.NODE_ENT !== 'production') {
  dotenv.config();
}

const app = express();
const { PORT } = process.env;

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

app.listen(PORT, () => {
  logger.info(`It's listen on http://localhost:${PORT}`);
});
