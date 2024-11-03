// routes/index.js
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Route สำหรับหน้า Home
router.get('/', (req, res) => {
    Product.getFeatured((err, products) => { // สมมติว่า getFeatured ดึงสินค้าที่เป็น Featured
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.render('index', { 
            user: req.session.user, 
            products: products, 
            title: "Home",
            activePage: 'home' // กำหนด activePage เป็น 'home'
        });
    });
});

module.exports = router;
