const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/productModel');

// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/assets/images')); // โฟลเดอร์ที่เก็บรูปภาพ
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // ตั้งชื่อไฟล์ให้ไม่ซ้ำกัน
    }
});

const upload = multer({ storage: storage });

// Middleware ตรวจสอบว่าเป็นผู้ขายหรือไม่
function isSeller(req, res, next) {
    if (!req.session.user || !req.session.user.isSeller) {
        return res.redirect('/auth/become-seller');
    }
    next();
}

// Route สำหรับแสดงสินค้าทั้งหมด
router.get('/', (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.render('products', { 
            user: req.session.user, 
            products: products, 
            title: "Products",
            activePage: 'products'
        });
    });
});

// Route สำหรับแสดงฟอร์มเพิ่มสินค้าใหม่ (เฉพาะผู้ขาย)
router.get('/add', isSeller, (req, res) => {
    res.render('addProduct', { 
        user: req.session.user, 
        title: "เพิ่มสินค้าใหม่",
        activePage: 'products'
    });
});

// Route สำหรับการจัดการการเพิ่มสินค้าใหม่
router.post('/add', isSeller, upload.single('image'), (req, res) => {
    const { name, price, description } = req.body;
    const imagePath = `/assets/images/${req.file.filename}`;
    Product.create(req.session.user.id, name, description, price, imagePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/products');
    });
});

// Route สำหรับรายละเอียดสินค้า
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    Product.getById(productId, (err, product) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        // เพิ่มการตรวจสอบหากไม่พบสินค้า
        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render('productDetail', { 
            user: req.session.user, 
            product: product, 
            title: product.name,
            activePage: ''
        });
    });
});





module.exports = router;
