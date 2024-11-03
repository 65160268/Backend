const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./database'); // ตรวจสอบว่าถูกต้อง

// ตั้งค่า Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware สำหรับการใช้งาน static files
app.use(express.static(path.join(__dirname, 'public')));

// ตั้งค่า Session ตามที่คุณกำหนด
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));

// ตั้งค่า View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);

// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
