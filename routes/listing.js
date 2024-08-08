const express = require("express");
const router = express.Router();
const wrapAsyns = require("../Extra-things/wrapAsyns.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../Extra-things/ExpressError.js");
const {listingSchema} = require("../schema.js");

// Validation for LISTINGS schema error middleware
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    } else{
        next();
    }
};

// // Index Route
router.get("/", wrapAsyns( async (req,res,next) =>{
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
 }));
 
 // // New Route
 router.get("/new",(req,res,next) =>{
     res.render("./listings/new.ejs");
 });
 
 // // Show Route
 router.get("/:id", wrapAsyns( async (req,res,next) =>{
     let {id} = req.params;
     // [.populate("reviews") use for render review]
     const listing = await Listing.findById(id).populate("reviews");
     if(!listings){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
     }
     res.render("./listings/show.ejs", {listing});
 }));
 
 // //Create Route
 router.post("/", validateListing, wrapAsyns( async (req,res,next) =>{
     // let {title, description, image, price, location, country} = req.body;
     const newListing = new Listing(req.body.listing);
     await newListing.save();
    //  flash
     req.flash("success", "New listing created !");
     res.redirect("/listings");
    
 }));
 
 // // Edit Route
 router.get("/:id/edit", wrapAsyns( async (req,res,next) =>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listings){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
     }
     res.render("./listings/edit.ejs", {listing});
 }));
 
 // // Update Route
 router.put("/:id", validateListing, wrapAsyns( async (req,res,next) =>{
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success", "Listing updated");
     res.redirect(`/listings/${id}`);
 }));
 
 // // Delete Route
 router.delete("/:id", wrapAsyns( async (req,res,next) =>{
     let {id} = req.params;
     const deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "Listing deleted !");
     res.redirect("/listings");
 }));
 
 module.exports = router;