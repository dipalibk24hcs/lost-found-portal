const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({

    // User who created this post
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Lost or Found
    type: {
        type: String,
        required: true,
        enum: ["Lost", "Found"]
    },

    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String
    },
    
    image: {
    type: String,
    default: ""
    }, 

    recovered: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model("Post", PostSchema);