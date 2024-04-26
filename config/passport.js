import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    { usernameField: "account" },
    async (account, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { account } });
        if (!user) done(null, false, { message: "此用戶未註冊" });
        if (user.password !== password)
          done(null, false, { message: "帳號或密碼錯誤" });
        return done(null, user);
      } catch (err) {
        return done(null, false);
      }
    }
  )
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
      if (!user) done(null, false, { message: "驗證失敗" });
      return done(null, user);
    } catch (error) {
      return done(err, null);
    }
  })
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
