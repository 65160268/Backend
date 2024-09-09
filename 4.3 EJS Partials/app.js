import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// กำหนดเส้นทางต่าง ๆ
app.get("/", (req, res) => {
    res.render('index.ejs');
});

app.get("/about", (req, res) => {
    res.render('about.ejs');
});

app.get("/contact", (req, res) => {
    res.render('contact.ejs');
});

app.post('/submit', (req, res) => {
    const { name, email, comment } = req.body;

    // สร้างตัวส่งอีเมล
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'testercode009@gmail.com', // ใส่อีเมล
            pass: 'xqjm yuty xrnr ayrs' // ใช้รหัสผ่าน app password
        }
    });

    // ตั้งค่าข้อมูลอีเมล
    const mailOptions = {
        from: 'testercode009@gmail.com', // ใส่อีเมลของผู้ส่ง
        to: email, // ใช้อีเมลที่ผู้ใช้กรอกในแบบฟอร์ม
        subject: 'Thank you for contacting me!',
        text: `Dear ${name}\n\nThank you for reaching out! We have received your comment:,\n\n"${comment}"\n\nKAi SO BIG`
    };

    // ส่งอีเมล
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.redirect('/contact?success=false'); // แจ้งเตือนว่ามีข้อผิดพลาด
        } else {
            console.log('Message sent: %s', info.messageId);
            res.redirect('/contact?success=true'); // ส่ง query parameter เพื่อแจ้งเตือนว่าทำการส่งสำเร็จ
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on Port ${port}.`);
});
