const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// หน้าลงทะเบียน
router.get('/register', (req, res) => {
  res.render('auth/register', { user: req.session.user, title: "สมัครสมาชิก", activePage: 'register' });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.create(username, password, (err) => {
    if (err) {
      console.error(err);
      return res.redirect('/auth/register');
    }
    res.redirect('/auth/login');
  });
});

// หน้าเข้าสู่ระบบ
router.get('/login', (req, res) => {
  res.render('auth/login', { user: req.session.user, title: "เข้าสู่ระบบ", activePage: 'login' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, (err, user) => {
    if (err || !user) {
      console.error(err);
      return res.redirect('/auth/login');
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        console.error(err);
        return res.redirect('/auth/login');
      }
      // เก็บสถานะ isSeller ไว้ใน session เพื่อใช้งานในแอปพลิเคชัน
      req.session.user = { id: user.id, username: user.username, isSeller: user.isSeller };
      res.redirect('/');
    });
  });
});

// สมัครเป็นผู้ขาย
router.get('/become-seller', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  // ตรวจสอบว่าผู้ใช้เป็นผู้ขายแล้วหรือยัง
  if (req.session.user.isSeller) {
    return res.redirect('/'); // ถ้าเป็นผู้ขายอยู่แล้ว ให้กลับไปหน้าแรก
  }
  res.render('auth/becomeSeller', { user: req.session.user, title: "สมัครเป็นผู้ขาย" });
});

router.post('/become-seller', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  // อัปเดตสถานะของผู้ใช้ให้เป็นผู้ขาย
  User.updateToSeller(req.session.user.id, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    // อัปเดต session ด้วยสถานะใหม่
    req.session.user.isSeller = true;
    res.redirect('/');
  });
});

// ออกจากระบบ
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/'); // ถ้าเกิดข้อผิดพลาด ให้กลับไปหน้าแรก
    }
    res.clearCookie('connect.sid'); // ลบคุกกี้ที่เชื่อมโยงกับ session
    res.redirect('/auth/login'); // กลับไปที่หน้า login
  });
});

module.exports = router;
