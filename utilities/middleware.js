const db = require('../db/queries');

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: 'You are not authorised to view this resource' });
  }
};

module.exports.validateCart = async (req, res, next) => {
  const cart = await db.getCart(req.user.id);
  if (cart) {
    next();
  } else {
    res.status(500).json({ msg: "cart is empty" });
  }
};