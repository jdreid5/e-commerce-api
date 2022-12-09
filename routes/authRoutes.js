const express = require('express');
const authRouter = express.Router();
const db = require('../db/queries');
const passport = require('passport');

require('../config/passport');

authRouter.post('/register', async (req, res) => {
  const { username, password, address, email } = req.body;
  const newUser = await db.createUser({ username, password, address, email });
  if (newUser) {
    res.status(201).json({
      msg: 'User created',
      newUser
    });
  } else {
    res.status(500).json({ msg: 'Failed to create user' });
  }
});

authRouter.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
      res.status(200).redirect('profile');
    }
);

authRouter.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = authRouter;