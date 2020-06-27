const mongoose = require("mongoose");   // MongoDB Object Modeler

// Defining MongoDB 'Headlines' Model\Collection Schema
const Schema = mongoose.Schema;         // Mongoose Schema Constructor
const HeadlinesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    author: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        required: true
    },
    link: {
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
    },
    comments: [{                        // Relating 'Comments' Model to 'Headlines'
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }]
});
const Headlines = mongoose.model("Headlines", HeadlinesSchema);   // Creating 'Headlines' Model Using 'HeadlinesSchema'

module.exports = Headlines;             // Exporting the MongoDB 'Headlines' Model\Collection