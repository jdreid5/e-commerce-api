const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const db = require('./queries');
const pgSession = require('connect-pg-simple')(session);

app.set("view engine", "ejs");

require('./passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
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
// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log('console.log req.user from middleware: ' + req.user);
//   next();
// });

const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/profile', userRouter);
app.use('/cart', cartRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

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

// app.get('/profile', (req, res, next) => {
//   console.log('console.log from get profile req.user: ' + req.user);
//   res.status(200).json({"valueofru": 25});
//   next();
// });
  
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});