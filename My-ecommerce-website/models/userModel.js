const db = require('../database');
const bcrypt = require('bcrypt');

const User = {
  // ฟังก์ชันสร้างผู้ใช้ใหม่
  create: (username, password, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return callback(err);
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], callback);
    });
  },

  // ค้นหาผู้ใช้โดยใช้ชื่อผู้ใช้
  findByUsername: (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], callback);
  },

  // ค้นหาผู้ใช้โดยใช้ ID
  findById: (id, callback) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  },

  // เปรียบเทียบรหัสผ่าน
  comparePassword: (password, hash, callback) => {
    bcrypt.compare(password, hash, callback);
  },

  // อัปเดตผู้ใช้ให้เป็นผู้ขาย
  updateToSeller: (userId, callback) => {
    const sql = "UPDATE users SET isSeller = 1 WHERE id = ?";
    db.run(sql, [userId], callback);
  }
};

module.exports = User;
