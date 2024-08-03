const express = require("express");
const app = express();
// const user = require("./routes/user.js");
// const post = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysecret", 
    resave:false, 
    saveUninitialized:true,
}

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req,res)=>{
    let {name = "DM"} = req.query;
    req.session.name = name;
    if(name==="DM"){
        req.flash("error","User not register");
    }else{
        req.flash("done", "You have register your completed.");
    }
   
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.locals.donemsg = req.flash("done");
    res.locals.errormsg = req.flash("error");
    res.render("page.ejs",{name : req.session.name});
});

app.get("/reqcount", (req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} times`);
});

app.get("/test", (req,res)=>{
    res.send("test successful !");
});

app.listen(3000,()=>{
    console.log("server is listing to 3000 port");
});