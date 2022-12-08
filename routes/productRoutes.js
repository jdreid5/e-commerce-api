const express = require('express');
const productRouter = express.Router();
const db = require('../queries');

// Retrieve all products or all from category
productRouter.get('/', async (req, res) => {
  const category = req.query;
  const products = await db.getAllProducts(category);
  console.log(products);
  if (products[0]) {
    res.status(200).json(products);
  } else {
    res.status(500).send();
  }
});

// Retrieve single product
productRouter.get('/:id', async (req, res) => {
  const product = await db.getProductById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ msg: "product not found" });
  }
});

module.exports = productRouter;