require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool ({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const findByUsername = (req, res) => {
  const username = req.body.username;
  console.log(username);
  pool.query('SELECT * FROM user_accounts WHERE username = $1', [username], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

module.exports = {
  findByUsername
};