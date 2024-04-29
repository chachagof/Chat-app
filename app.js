import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import apis from './apis/index';
import passport from './config/passport';

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

app.listen(PORT, () => {
  console.log(`It's listen on http://localhost:${PORT}`);
});
