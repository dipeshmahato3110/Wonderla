const mongoose = require("mongoose");
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
});

const Listing = mongoose.model("Listing", listenSchema);
module.exports = Listing;