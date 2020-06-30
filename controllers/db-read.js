// ==============================================
//
//      Database READ Operations
//
// ==============================================

const db = require('../models');     // MongoDB Models

// Retrieve All Headlines
const getAllHeadlines = async () => {
    let headlines = [];
    await db.Headlines.find()
        .sort({ date: 'desc' })
        .lean()
        .then((documents) => { headlines = documents; })
        .catch((error) => console.log('\nUnable to retrieve all headlines. Error:\n', error));
    return headlines;
};

// Retrieve Headline with All Comments
const getHeadlineWithComments = async (_id) => {
    let headline = [];
    await db.Headlines.findOne({ _id })
        .populate({ 
            path: 'comments', 
            select: ['name', 'comment', 'date'],
            options: {
                sort: { 'timestamp': 'desc'}
            }
        })
        .lean()
        .then((document) => { headline = document })
        .catch((error) => console.log('\nUnable to retrieve headline with comments. Error:\n', error));
    return { document: headline };
};

module.exports = {
    getAllHeadlines,
    getHeadlineWithComments
};