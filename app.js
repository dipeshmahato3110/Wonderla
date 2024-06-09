const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
// require method override
const methodOverride = require("method-override");
// require ejs-mate
const ejsMate = require("ejs-mate");
// Require wrapAsyns
const wrapAsyns = require("./Extra-things/wrapAsyns.js");
// Require ExpressError
const ExpressError = require("./Extra-things/ExpressError.js");
// Rewuire joi
const {listingSchema} = require("./schema.js");


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

app.get("/", (req,res) => {
    res.send("Hi, Welcome to Dipesh's root !");
});

// Validation for schema error middleware
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    console.log(result);
    if(error){
        throw new ExpressError(400,error);
    } else{
        next();
    }
}

// // Index Route
app.get("/listings", wrapAsyns( async (req,res,next) =>{
   const allListing = await Listing.find({});
   res.render("./listings/index.ejs", {allListing});
}));

// // New Route
app.get("/listings/new",(req,res,next) =>{
    res.render("./listings/new.ejs");
});

// // Show Route
app.get("/listings/:id", wrapAsyns( async (req,res,next) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
}));

// //Create Route
app.post("/listings", validateListing, wrapAsyns( async (req,res,next) =>{
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   
}));

// // Edit Route
app.get("/listings/:id/edit", wrapAsyns( async (req,res,next) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

// // Update Route
app.put("/listings/:id", validateListing, wrapAsyns( async (req,res,next) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// // Delete Route
app.delete("/listings/:id", wrapAsyns( async (req,res,next) =>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testListing", async (req,res) =>{
//     let sampleListing = new Listing({
//         title : "My new house 2",
//         description : "by the beach",
//         price : 12000,
//         location : "Goa",
//         country : "India"
//     })

//    await sampleListing.save();
//    console.log("Sample was saved");
//    res.send("Successful testing");
// });

// If the user go to the wrong route
app.all("*",(req,res,next) =>{
    next(new ExpressError(404, "Page Not Found!"));
});

// Expree midlleware for  error handling 
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong !"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);

});


app.listen(8080, () => {
    console.log("Server is listing to the port 8080")
});