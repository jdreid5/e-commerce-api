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
    console.log(newUser.rows[0]);
    return newUser.rows[0];
  } catch (error) {
    throw error;
  }
};

const findByUsername = async (username) => {
  console.log(username);
  try {
    const data = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findById = async (id) => {
  console.log(id);
  try {
    const data = await pool.query('SELECT * FROM user_accounts WHERE id = $1', [username]);
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const data = await pool.query('SELECT * FROM products;');
    return data.rows;
  } catch (error) {
    throw error;
  }
}

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
  getAllProducts,
  getProductById
};