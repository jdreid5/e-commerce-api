const express = require('express');
const userRouter = express.Router();
const db = require('../db/queries');
const isAuth = require('../utilities/middleware').isAuth;

// Get user profile
userRouter.get('/', isAuth, (req, res, next) => {
  console.log('user properties available in req.user: ' + req.user.id);
  res.status(200).json({ msg: "successfully logged in" });
  // res.render('dashboard', { user: req.user })
  next();
});

// Update user profile 
userRouter.put('/', isAuth, async (req, res) => {
  const { address, email } = req.body;
  const id = req.user.id;
  const updatedRecord = await db.updateDetails({ id, address, email });
  if (updatedRecord) {
    res.status(200).json(updatedRecord);
  } else {
    res.status(400).json({ msg: "failed to update profile" });
  }
});

module.exports = userRouter;