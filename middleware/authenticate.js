import passport from "../config/passport.js";

const authenticated = passport.authenticate("jwt", { session: false });

export default authenticated;
