import passport from '../config/passport';

const authenticated = passport.authenticate('jwt', { session: false });

export default authenticated;
