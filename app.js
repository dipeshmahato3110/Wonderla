const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
// require method override
const methodOverride = require("method-override");
// require ejs-mate
const ejsMate = require("ejs-mate");

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

// // Index Route
app.get("/listings", async (req,res) =>{
   const allListing = await Listing.find({});
   res.render("./listings/index.ejs", {allListing});
});

// // New Route
app.get("/listings/new",(req,res) =>{
    res.render("./listings/new.ejs");
});

// // Show Route
app.get("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
});

// //Create Route
app.post("/listings", async (req,res) =>{
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// // Edit Route
app.get("/listings/:id/edit", async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
});

// // Update Route
app.put("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// // Delete Route
app.delete("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

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

app.listen(8080, () => {
    console.log("Server is listing to the port 8080")
});