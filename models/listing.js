const mongoose = require("mongoose");
const Reviews = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        fliename:String,
        url:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Reviews.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;