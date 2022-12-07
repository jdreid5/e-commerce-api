const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const db = require('./queries');
const pgSession = require('connect-pg-simple')(session);

const productRouter = require('./routes/productRoutes');

app.use('/products', productRouter);

require('./passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: 'none'
    },
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: db.pool
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/username', db.findByUsername);

app.post('/register', async (req, res) => {
  const { username, password, address, email } = req.body;
  const newUser = await db.createUser({ username, password, address, email });
  if (newUser) {
    res.status(201).json({
      msg: 'User created',
      newUser
    });
  } else {
    res.status(500).json({ msg: 'Failed to create user' });
  }
})

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.status(200).redirect('profile');
  }
);

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      return next(err);
    }
    res.redirect('/');
  });
});

app.get('/profile', (req, res) => {
  // res.render('dashboard', { user: req.user })
  next();
});
  
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});