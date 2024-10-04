import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

// TODO 1: กรอกข้อมูลของคุณสำหรับการยืนยันทั้ง 3 แบบ
const yourUsername = "65160268";
const yourPassword = "1234";
const yourAPIKey = "91fd9df2-daa2-4d3e-84ec-18602e035fe3";
const yourBearerToken = "cd365824-9b21-4dc9-9d13-7d91a9d07097";

app.set("view engine", "ejs"); // ตั้งค่า EJS เป็น view engine

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." }); // แสดงหน้าแรกที่ไม่มีการดึงข้อมูลจาก API
});

app.get("/noAuth", async (req, res) => {
  // TODO 2: ใช้ axios เรียกไปที่ endpoint /random โดยไม่ต้องใช้การยืนยันตัวตน
  try {
    const response = await axios.get(`${API_URL}/random`);
    // ส่งผลลัพธ์ไปที่หน้า EJS โดยแปลงข้อมูลจาก axios เป็นสตริง
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.error(error);
    res.render("index.ejs", { content: "Error fetching data." }); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  }
});

app.get("/basicAuth", async (req, res) => {
  // TODO 3: ดึงข้อมูลจาก endpoint /all และระบุว่าเป็นหน้าที่ 2 โดยใช้ basic auth
  try {
    const response = await axios.get(`${API_URL}/all?page=2`, {
      auth: {
        username: yourUsername, // ใส่ username ของคุณ
        password: yourPassword, // ใส่ password ของคุณ
      },
    });
    // ส่งผลลัพธ์ไปที่หน้า EJS
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.error(error);
    res.render("index.ejs", { content: "Error fetching data." }); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  }
});

app.get("/apiKey", async (req, res) => {
  // TODO 4: เรียกใช้ endpoint /filter โดยกรองข้อมูลที่ embarrassment score >= 5 และใช้ API Key
  try {
    const response = await axios.get(`${API_URL}/filter?apiKey=${yourAPIKey}&score=5`);
    // ส่งผลลัพธ์ไปที่หน้า EJS
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.error(error);
    res.render("index.ejs", { content: "Error fetching data." }); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  }
});

app.get("/bearerToken", async (req, res) => {
  // TODO 5: เรียกใช้ endpoint /secrets/42 โดยใช้ Bearer token authentication
  try {
    const response = await axios.get(`${API_URL}/secrets/42`, {
      headers: { Authorization: `Bearer ${yourBearerToken}` }, // ใส่ Bearer token ของคุณ
    });
    // ส่งผลลัพธ์ไปที่หน้า EJS
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.error(error);
    res.render("index.ejs", { content: "Error fetching data." }); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // แสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน
});
