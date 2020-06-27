// ==============================================
//
//      Database CREATE Operations
//
// ==============================================

const db = require('../models');     // MongoDB Models
const { getCurrentDate } = require('./helper-functions');

// Insert New Headlines
const dbInsertManyHeadlines = async (newHeadlines) => {
    await db.Headlines.insertMany(newHeadlines)
        .then((documents) => console.log(`\nInserted '${documents.length}' new headlines\n`))
        .catch((error) => console.log(`\nUnable to add '${documents.length}' new headlines. Error:\n`, error));
};

// Insert New Post
const dbInsertComment = async (headlineId, comment) => {
    let date = getCurrentDate();
    comment.date = date.long;
    comment.timestamp = date.short;
    console.log(`Commment details:\n${comment}`)
    await db.Comments.create(comment)
        .then((document) => {
            return db.Headlines.findOneAndUpdate(
                { _id: headlineId },
                { $push: { comments: document._id } },
                { new: true })
        })
        .catch((error) => console.log('\nUnable to add new comment. Error:\n', error));
};

module.exports = {
    dbInsertComment,
    dbInsertManyHeadlines
};