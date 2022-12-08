const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./queries');
const bcrypt = require('bcrypt');

require('dotenv').config();

passport.use(new LocalStrategy(
  async (username, password, done) => {
    console.log(username);
    console.log(password);
    const user = await db.findByUsername(username);
    if (!user) return done(null, false);
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) return done(null, false);
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log('serialize user.id: ' + user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('deserialize id: ' + id);
  const user = await db.findById(id);
  done(null, user);
});