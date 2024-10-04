// นำเข้าโมดูลที่จำเป็น
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

// เริ่มต้นแอพพลิเคชั่น express
const app = express();
const port = 3000;

// ให้บริการไฟล์สถิติที่ตั้งอยู่ในไดเร็กทอรี 'public'
app.use(express.static("public"));

// ใช้ middleware body-parser เพื่อแยกข้อมูลฟอร์มที่ส่งผ่าน HTTP POST
app.use(bodyParser.urlencoded({ extended: true }));

// สร้างเส้นทางที่จัดการกับคำขอ HTTP GET ไปยังหน้าแรก
app.get("/", async (req, res) => {
  try {
    // ส่งคำขอ API เพื่อรับกิจกรรมแบบสุ่ม
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    // เรนเดอร์ไฟล์มุมมอง 'index.ejs' และส่งข้อมูลกิจกรรมที่ได้รับ
    res.render("index.ejs", { data: result });
  } catch (error) {
    // จัดการข้อผิดพลาดโดยการบันทึกและแสดงในมุมมอง 'index.ejs'
    console.error("ไม่สามารถทำคำขอได้:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

// สร้างเส้นทางที่จัดการกับคำขอ HTTP POST ไปยังหน้าแรก
app.post("/", async (req, res) => {
  // สกัดประเภทกิจกรรมและจำนวนผู้เข้าร่วมจากข้อมูลที่ส่งมาในแบบฟอร์ม
  var activity = req.body.type;
  var participants = req.body.participants;
  try {
    // ส่งคำขอ API เพื่อเรียกข้อมูลกิจกรรมตามประเภทและจำนวนผู้เข้าร่วมที่ระบุ
    const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${activity}&participants=${participants}`);
    const results = response.data;
    // เลือกกิจกรรมแบบสุ่มจากผลลัพธ์ที่ได้
    var result = results[Math.floor(Math.random() * results.length)];
    console.log(result); // บันทึกกิจกรรมที่เลือกเพื่อการดีบัก
    // เรนเดอร์ไฟล์มุมมอง 'index.ejs' พร้อมข้อมูลกิจกรรมที่เลือก
    res.render("index.ejs", { data: result });
  } catch (error) {
    // จัดการข้อผิดพลาดโดยการบันทึกและแสดงในมุมมอง 'index.ejs'
    console.error("ไม่สามารถทำคำขอได้:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

// ฟังค์ชั่นที่เรียกใช้เมื่อเซิร์ฟเวอร์เริ่มทำงาน แสดงข้อความบนคอนโซล
app.listen(port, () => {
  console.log(`Server is currently running on port :\ ${port}`);
});
