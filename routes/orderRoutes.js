const express = require('express');
const orderRouter = express.Router();
const db = require('../db/queries');
const isAuth = require('../utilities/middleware').isAuth;

// Get all orders for a customer
orderRouter.get('/', isAuth, async (req, res) => {
  const orders = await db.getOrders(req.user.id);
  if (orders[0]) {
    res.status(200).json(orders)
  } else {
    res.status(200).json({ msg: "You have no order history" });
  }
});

// Get order by ID
orderRouter.get('/:id', isAuth, async (req, res) => {
  const order = await db.getOrderById(req.params.id);
  console.log(order);
  if (order) {
    res.status(200).json(order)
  } else {
    res.status(500).json({ msg: "could not retrieve order information" });
  }
});

module.exports = orderRouter;