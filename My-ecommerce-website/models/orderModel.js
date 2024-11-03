// models/orderModel.js
const db = require('../database');

const Order = {
  create: (user_id, total, status, callback) => {
    const created_at = new Date().toISOString();
    db.run('INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, ?, ?)', [user_id, total, status, created_at], function(err) {
      callback(err, this.lastID);
    });
  },
  addItem: (order_id, product_id, quantity, callback) => {
    db.run('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', [order_id, product_id, quantity], callback);
  },
  getByUserId: (user_id, callback) => {
    db.all('SELECT * FROM orders WHERE user_id = ?', [user_id], callback);
  },
  getItemsByOrderId: (order_id, callback) => {
    db.all('SELECT * FROM order_items WHERE order_id = ?', [order_id], callback);
  }
};

module.exports = Order;
