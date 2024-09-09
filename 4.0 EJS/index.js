import express from "express";

const app = express();
const port = 3000;

app.get("/",(req,res) => {
    const today = new Date();
    const day = today.getDay();
    // const day = 0;

    console.log(day)
    let type = " ";
    let adv = " ";

    if(day === 0 || day === 6){
        type = "a weekend";
        adv = "it time to relax";
    }else{
        type = "a weekday";
        adv = "it time to work hard";
    }

    res.render('index.ejs',{ //go to file index.ejs
        dayType:type, //oject js 
        advice:adv,
        
    });
});

app.listen(port,() => {
    console.log(`Sever running on Port ${port}.`);
});