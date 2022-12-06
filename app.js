const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const db = require('./queries');

require('./passport');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// app.get('/username', db.findByUsername);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});