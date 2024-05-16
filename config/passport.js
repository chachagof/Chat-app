import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import ValidationError from '../errors/ValidationError.js';

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    { usernameField: 'account', passReqToCallback: true },
    async (req, account, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { account } });
        if (!user) done(new ValidationError('此用戶未註冊', 403));

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) done(new ValidationError('帳號或密碼錯誤', 401));
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOption, async (jwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id },
      });
      if (!user) done(new ValidationError('驗證失敗', 401));
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});

export default passport;
