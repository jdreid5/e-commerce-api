const express = require('express');
const cartRouter = express.Router();
const db = require('../queries');
const isAuth = require('./middleware').isAuth;

// If cart does not exist, create a new cart - do this in frontend
cartRouter.post('/', isAuth, async (req, res) => {
  const newCart = await db.createCart(req.user.id);
  if (newCart) {
    res.status(200).json(newCart);
  } else {
    res.status(400).send();
  }
});

// Add/remove product from cart - 
// 1. insert into carts_items
// 2. calculate subtotal in sql query
// 3. store subtotal value in javascript variable
// 4. update cart with subtotal
cartRouter.put('/', isAuth, async (req, res) => {
  const { cartId, productId, addremove } = req.body;
  const updatedCart = (addremove) ? await db.addProductToCart({ cartId, productId }) : await db.removeProductFromCart({ cartId, productId });
  console.log(updatedCart);
  if (!updatedCart) {
    res.status(500).json({ msg: "cart failed to update" });
  } else {
    res.status(200).json(updatedCart);
  }
});

cartRouter.get('/', isAuth, async (req, res) => {
  const cart = await db.getCart(req.user.id);
  if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(500).json({ msg: "could not retrieve cart" });
  }
});

module.exports = cartRouter;