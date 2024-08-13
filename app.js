const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
// require method override
const methodOverride = require("method-override");
// require ejs-mate
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderrsto";
main().then(()=>{
    console.log("connection to DB");
}).catch((err)=>{;
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
//path for views folder
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
// Path for public folder
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret: "mysecret", 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires: Date.now() +1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly: true
    },
};

app.get("/", (req,res) => {
    res.send("Hi, Welcome to Dipesh's root !");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


// If the user go to the wrong route
app.all("*",(req,res,next) =>{
    next(new ExpressError(404, "Page Not Found!"));
});

// Expree midlleware for  error handling 
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong !"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
   next();
});


app.listen(8080, () => {
    console.log("Server is listing to the port 8080")
});