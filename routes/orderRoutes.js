const express = require('express');
const orderRouter = express.Router();
const db = require('../queries');

// Get all orders for a customer
orderRouter.get('/', (req, res) => {

});

// Get order by ID
orderRouter.get('/:id', (req, res) => {

});

module.exports = orderRouter;