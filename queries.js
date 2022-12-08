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
    throw error;
  }
};

const findByUsername = async (username) => {
  // console.log('findByUsername username parameter: ' + username);
  try {
    const data = await pool.query('SELECT * FROM user_accounts WHERE username = $1;', [username]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  console.log('findById id parameter: ' + id);
  try {
    const data = await pool.query('SELECT * FROM user_accounts WHERE id = $1', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
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

const getAllProducts = async (category) => {
  try {
    if (category === {}) {
      const data = await pool.query('SELECT * FROM products;');
      return data.rows;
    } else {
      const data = await pool.query('SELECT * FROM products WHERE category = $1;', [category.category]);
      return data.rows;
    }
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const data = await pool.query('SELECT * FROM products WHERE id = $1;', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};



module.exports = {
  pool,
  createUser,
  findByUsername,
  findById,
  updateDetails,
  getAllProducts,
  getProductById
};