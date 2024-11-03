const db = require('../database');

const Product = {
    // ดึงสินค้าทั้งหมด
    getAll: function(callback) {
        const sql = "SELECT * FROM products";
        db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    },

    // ดึงสินค้าที่เป็นสินค้าแนะนำ
    getFeatured: function(callback) {
        const sql = "SELECT * FROM products WHERE featured = 1";
        db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    },

    // ดึงสินค้าตาม ID
    getById: function(id, callback) {
        const sql = "SELECT * FROM products WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, row || null); // ส่งคืน null หากไม่พบสินค้า
            }
        });
    },

    // เพิ่มสินค้าลงในระบบ
    addNew: function(name, price, description, image, callback) {
        const sql = `INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)`;
        db.run(sql, [name, price, description, image], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    },

    // สร้างสินค้าจากผู้ขายที่กำหนด
    create: function(userId, name, description, price, image, callback) {
        const sql = "INSERT INTO products (user_id, name, description, price, image) VALUES (?, ?, ?, ?, ?)";
        db.run(sql, [userId, name, description, price, image], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, this.lastID); // คืนค่า ID ของสินค้าที่เพิ่มใหม่
            }
        });
    },


};

module.exports = Product;
