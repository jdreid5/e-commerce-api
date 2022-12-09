const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const db = require('./db/queries');
const pgSession = require('connect-pg-simple')(session);

app.set("view engine", "ejs");

require('./config/passport');

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

const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const checkoutRouter = require('./routes/checkoutRoutes');
const authRouter = require('./routes/authRoutes');

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/profile', userRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});
  
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});