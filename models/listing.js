const mongoose = require("mongoose");
const Review = require("./review.js");
const { ref } = require("joi");
const { listingSchema } = require("../schema.js");
const Schema = mongoose.Schema;

const listenSchema = new Schema({
    title :{
        type : String,
        required : true,
    },
    description :{
        type : String,
    },
    image :{
        type : String,
        default : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
        set : (v) =>
             v === "" 
        ? "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" 
        : v,
    },
    price :{
        type : Number,
    },
    location :{
        type : String,
    },
    country :{
        type : String,
    },

    // One to many case here, Review the listing by there objectId
    reviews:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review",
        },
    ],
});

// Mongoose Middleware for Delete listing for Handling Deletion of reviews
listenSchema.post("findOneAndDelete", async(Listing)=>{
    if(Listing){
        await Review.deleteMany({_id: {$in: listingSchema.review}});
    }
});

const Listing = mongoose.model("Listing", listenSchema);
module.exports = Listing;