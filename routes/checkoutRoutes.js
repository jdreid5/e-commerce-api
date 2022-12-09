const express = require('express');
const checkoutRouter = express.Router();
const db = require('../db/queries');
const { isAuth, validateCart } = require('../utilities/middleware');

checkoutRouter.post('/', isAuth, validateCart, async (req, res) => {
  // process payment
  const userid = req.user.id;
  const cart = await db.retrieveSubtotal(userid);
  const { id, subtotal } = cart;
  const newOrder = await db.createOrder({ userid, id, subtotal });
  console.log(newOrder);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(500).json({ msg: "order failed" });
  }
});

module.exports = checkoutRouter;