const express = require('express');
const productRouter = express.Router();
const db = require('../queries');

// Retrieve all products
productRouter.get('/', async (req, res) => {

});

// Retrieve single product
productRouter.get('/:id', async (req, res) => {
  const product = await db.getProductById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).send();
  }
});

// Retrieve products by category
productRouter.get('/', )

module.exports = productRouter;