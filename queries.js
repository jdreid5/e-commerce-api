require('dotenv').config();
const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');

const pool = new Pool ({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const createUser = async ({username, password, address, email}) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    pool.query(
      'INSERT INTO user_accounts VALUES (DEFAULT, $1, $2, $3, $4);', 
      [username, passwordHash, address, email]
    );
    const newUser = await pool.query('SELECT * FROM user_accounts WHERE username = $1;', [username]);
    return newUser.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const findByUsername = async (username) => {
  // console.log('findByUsername username parameter: ' + username);
  try {
    const data = await pool.query('SELECT * FROM user_accounts WHERE username = $1;', [username]);
    return data.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const findById = async (id) => {
  console.log('findById id parameter: ' + id);
  try {
    const data = await pool.query('SELECT * FROM user_accounts WHERE id = $1', [id]);
    return data.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const updateDetails = async ({ id, address, email }) => {
  try {
    pool.query('UPDATE user_accounts SET address = $2, email = $3 WHERE id = $1;', 
      [id, address, email], 
      (err) => (err) ? console.log(err.stack) : null 
    );
    const viewRecord = await pool.query('SELECT * FROM user_accounts WHERE id = $1;', [id]);
    return viewRecord.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const getOrders = async (id) => {
  try {
    const orderData = await pool.query('SELECT * FROM orders WHERE user_id = $1;', [id]);
    return orderData.rows;
  } catch (error) {
    console.log(error);
  }
};

const getOrderById = async (id) => {
  try {
    const orderData = await pool.query('SELECT * FROM orders WHERE id = $1;', [id]);
    return orderData.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const getAllProducts = async (category) => {
  try {
    console.log('category: ' + category);
    if (Object.keys(category).length === 0) {
      const data = await pool.query('SELECT * FROM products ORDER BY name ASC;');
      return data.rows;
    } else {
      const data = await pool.query('SELECT * FROM products WHERE category = $1;', [category.category]);
      return data.rows;
    }
  } catch (error) {
    console.log(error);
  }
};

const getProductById = async (id) => {
  try {
    const data = await pool.query('SELECT * FROM products WHERE id = $1;', [id]);
    return data.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const createCart = async (id) => {
  try {
    pool.query('INSERT INTO cart VALUES (DEFAULT, $1, 0.00);', 
      [id],
      (err) => (err) ? console.log(err.stack) : null
    );
    const newCart = await pool.query('SELECT * FROM cart WHERE user_id = $1;', [id]);
    return newCart.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const addProductToCart = async ({ cartId, productId }) => {
  try {
    const newItem = await pool.query('SELECT * FROM carts_items WHERE cart_id = $1 AND product_id = $2;', [cartId, productId]);
    const newItemData = newItem.rows[0];
    if (!newItemData) {
      await pool.query('INSERT INTO carts_items VALUES ($1, $2, 1)', [cartId, productId]);
    } else {
      await pool.query('UPDATE carts_items SET quantity = quantity + 1 WHERE cart_id = $1 AND product_id = $2;', [cartId, productId]);
    }
    const subtotal = await pool.query('WITH item_cost AS (SELECT carts_items.quantity * products.price AS total_item_cost FROM carts_items JOIN products ON carts_items.product_id = products.id WHERE carts_items.cart_id = $1) SELECT SUM(total_item_cost) AS subtotal FROM item_cost', [cartId]);
    const subtotalValue = subtotal.rows[0].subtotal;
    pool.query('UPDATE cart SET subtotal = $2 WHERE id = $1;', 
      [cartId, subtotalValue],
      (err) => (err) ? console.log(err.stack) : null
    );
    const updatedCart = await pool.query('SELECT * FROM cart WHERE id = $1;', [cartId]);
    return updatedCart.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const removeProductFromCart = async ({ cartId, productId }) => {
  try {
    const newItem = await pool.query('SELECT * FROM carts_items WHERE cart_id = $1 AND product_id = $2;', [cartId, productId]);
    const newItemData = newItem.rows[0];
    if (!newItemData) {
      const update = { msg: "product does not exist in cart" };
      return update;
    } else if (newItemData.quantity === 1) {
      await pool.query('DELETE FROM carts_items WHERE cart_id = $1 AND product_id = $2;', [cartId, productId]);
    } else {
      await pool.query('UPDATE carts_items SET quantity = quantity - 1 WHERE cart_id = $1 AND product_id = $2;', [cartId, productId]);
    }
    const subtotal = await pool.query('WITH item_cost AS (SELECT carts_items.quantity * products.price AS total_item_cost FROM carts_items JOIN products ON carts_items.product_id = products.id WHERE carts_items.cart_id = $1) SELECT SUM(total_item_cost) AS subtotal FROM item_cost', [cartId]);
    const subtotalValue = subtotal.rows[0].subtotal;
    pool.query('UPDATE cart SET subtotal = $2 WHERE id = $1;', 
      [cartId, subtotalValue],
      (err) => (err) ? console.log(err.stack) : null
    );
    const updatedCart = await pool.query('SELECT * FROM cart WHERE id = $1;', [cartId]);
    return updatedCart.rows[0];
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  pool,
  createUser,
  findByUsername,
  findById,
  updateDetails,
  getOrders,
  getOrderById,
  getAllProducts,
  getProductById,
  createCart,
  addProductToCart,
  removeProductFromCart
};