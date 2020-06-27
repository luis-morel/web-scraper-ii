const mongoose = require("mongoose");   // MongoDB Object Modeler

// Defining MongoDB 'Comments' Model\Collection Schema
const Schema = mongoose.Schema;         // Mongoose Schema Constructor
const CommentsSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        require: true
    }
});
const Comments = mongoose.model("Comments", CommentsSchema);    // Creating 'Comments' Model Using 'CommentsSchema'

module.exports = Comments;              // Exporting the MongoDB 'Comments' Model\Collection