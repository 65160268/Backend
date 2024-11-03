const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  // สร้างตารางผู้ใช้
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    isSeller INTEGER DEFAULT 0
  )`);

  // สร้างตารางสินค้า
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT,
    featured INTEGER DEFAULT 0,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // สร้างตารางคำสั่งซื้อ
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // สร้างตารางรายละเอียดคำสั่งซื้อ
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // ตรวจสอบและเพิ่มคอลัมน์ที่ขาดในตาราง users
  addMissingUserColumns();

  // ตรวจสอบคอลัมน์ที่ควรมีในตาราง products
  addMissingProductColumns();
});

// ฟังก์ชันเพิ่มคอลัมน์ที่ขาดในตาราง users
function addMissingUserColumns() {
  db.all(`PRAGMA table_info(users);`, [], (err, rows) => {
    if (err) {
      console.error('Error fetching table info for users:', err);
      return;
    }

    const columns = rows.map(row => row.name);

    // เพิ่มคอลัมน์ isSeller หากยังไม่มี
    if (!columns.includes('isSeller')) {
      db.run(`ALTER TABLE users ADD COLUMN isSeller INTEGER DEFAULT 0;`, [], (err) => {
        if (err) {
          console.error('Error adding isSeller column:', err);
        } else {
          console.log('Added isSeller column to users table');
        }
      });
    }
  });
}

// ฟังก์ชันเพิ่มคอลัมน์ที่ขาดในตาราง products
function addMissingProductColumns() {
  db.all(`PRAGMA table_info(products);`, [], (err, rows) => {
    if (err) {
      console.error('Error fetching table info for products:', err);
      return;
    }

    const columns = rows.map(row => row.name);

    // เพิ่มคอลัมน์ featured หากยังไม่มี
    if (!columns.includes('featured')) {
      db.run(`ALTER TABLE products ADD COLUMN featured INTEGER DEFAULT 0;`, [], (err) => {
        if (err) {
          console.error('Error adding featured column:', err);
        } else {
          console.log('Added featured column to products table');
        }
      });
    }

    // เพิ่มคอลัมน์ user_id หากยังไม่มี
    if (!columns.includes('user_id')) {
      db.run(`ALTER TABLE products ADD COLUMN user_id INTEGER;`, [], (err) => {
        if (err) {
          console.error('Error adding user_id column:', err);
        } else {
          console.log('Added user_id column to products table');
        }
      });
    }
  });
}

// ฟังก์ชันสำหรับปิดการเชื่อมต่อฐานข้อมูลอย่างปลอดภัย
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = db;
