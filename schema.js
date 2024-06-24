const Joi = require("joi");
const review = require("./models/review");

// Listind joi Schema
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.string().required(),
        price : Joi.number().required().min(0),
        country : Joi.string().required(),
        location : Joi.string().required(),
    }).required()
});

// Review joi Schema
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
     rating : Joi.number().required().min(1).max(5),
     comment : Joi.string().required(),
    }).required(),
});