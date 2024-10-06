import express from "express"
import bodyParser from "body-parser"
import mysql from "mysql"

mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node_project"
})

const app = express();

const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine','ejs');


app.get("/", (req, res) => {
    res.render("pages/index.ejs"); 
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });