import express from "express"
const app = express();
const port = 3000;

app.get("/name", (req, res) => {
    res.send("<h1>Sorrawit Srisuk</h1>"); 
});

app.get("/food", (req, res) => {
    res.send("<h1>Mcdonold</h1>"); 
});

app.get("/contact", (req, res) => {
    res.send("<h1>099-999-9999</h1>"); 
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});