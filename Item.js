const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({

    title:String,

    description:String,

    category:String,

    location:String,

    contact:String,

    image:String,

    status:{
        type:String,
        enum:["Lost","Found"],
        default:"Lost"
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("Item",ItemSchema);