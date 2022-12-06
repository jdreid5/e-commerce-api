const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const store = new session.MemoryStore();
const db = require('./queries');

require('dotenv').config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: 'none'
    },
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.findByUsername(username, (error, user) => {
      if (error) return done(error);
      if (!user) return done(null, false);
      if (user.password !== password) return done(null, false);
      return done(null, user);
    });
  }
));
