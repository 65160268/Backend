// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Middleware ตรวจสอบการเข้าสู่ระบบ
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/login');
}

// หน้า Checkout
router.get('/checkout', isAuthenticated, (req, res) => {
  const cartItems = [];
  let total = 0;

  if (req.session.cart) {
    const productIds = Object.keys(req.session.cart);
    Product.getAll((err, products) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      products.forEach(product => {
        if (req.session.cart[product.id]) {
          const quantity = req.session.cart[product.id];
          cartItems.push({ product, quantity });
          total += product.price * quantity;
        }
      });
      res.render('checkout', { 
        user: req.session.user, 
        cartItems, 
        total, 
        title: "ชำระเงิน",
        activePage: 'checkout' // กำหนดค่า activePage
      });
    });
  } else {
    res.redirect('/cart');
  }
});

// ดำเนินการสั่งซื้อ
router.post('/checkout', isAuthenticated, (req, res) => {
  const user_id = req.session.user.id;
  let total = 0;
  const cartItems = [];

  if (req.session.cart) {
    const productIds = Object.keys(req.session.cart);
    Product.getAll((err, products) => {
      if (err) throw err;
      products.forEach(product => {
        if (req.session.cart[product.id]) {
          const quantity = req.session.cart[product.id];
          cartItems.push({ product_id: product.id, quantity });
          total += product.price * quantity;
        }
      });
      Order.create(user_id, total, 'Processing', (err, orderId) => {
        if (err) throw err;
        cartItems.forEach(item => {
          Order.addItem(orderId, item.product_id, item.quantity, (err) => {
            if (err) throw err;
          });
        });
        req.session.cart = {};
        res.redirect('/orders');
      });
    });
  } else {
    res.redirect('/cart');
  }
});

// ดูรายการสั่งซื้อ
router.get('/', isAuthenticated, (req, res) => {
  const user_id = req.session.user.id;
  Order.getByUserId(user_id, (err, orders) => {
    if (err) throw err;
    res.render('orders', { 
      user: req.session.user, 
      orders, 
      title: "รายการสั่งซื้อ", 
      activePage: 'orders' // กำหนดค่า activePage
    });
  });
});

module.exports = router;
