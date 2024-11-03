// routes/cart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Middleware ตรวจสอบการเข้าสู่ระบบ
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/login');
}

// เพิ่มสินค้าในตะกร้า
router.post('/add/:id', isAuthenticated, (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity) || 1;

  if (!req.session.cart) req.session.cart = {};

  if (req.session.cart[productId]) {
    req.session.cart[productId] += quantity;
  } else {
    req.session.cart[productId] = quantity;
  }

  res.redirect('/cart');
});

// ดูตะกร้าสินค้า
router.get('/', isAuthenticated, (req, res) => {
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
      res.render('cart', { 
        user: req.session.user, 
        cartItems, 
        total, 
        title: "ตะกร้าสินค้า", 
        activePage: 'cart' // เพิ่มค่า activePage
      });
    });
  } else {
    res.render('cart', { 
      user: req.session.user, 
      cartItems, 
      total, 
      title: "ตะกร้าสินค้า", 
      activePage: 'cart' // เพิ่มค่า activePage
    });
  }
});

// อัพเดทจำนวนสินค้าในตะกร้า
router.post('/update/:id', isAuthenticated, (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity);

  if (req.session.cart && req.session.cart[productId]) {
    if (quantity <= 0) {
      delete req.session.cart[productId];
    } else {
      req.session.cart[productId] = quantity;
    }
  }

  res.redirect('/cart');
});

// ลบสินค้าออกจากตะกร้า
router.post('/remove/:id', isAuthenticated, (req, res) => {
  const productId = req.params.id;

  if (req.session.cart && req.session.cart[productId]) {
    delete req.session.cart[productId];
  }

  res.redirect('/cart');
});

module.exports = router;
