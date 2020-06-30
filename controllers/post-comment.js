// ================================================
//
//  Controller Function
//
// ================================================

// Controller Functions
const { dbInsertComment } = require('./db-create');

const postComment = async (req, res) => {
    let headlineId = req.params.id,
        comment = req.body;
    await dbInsertComment(headlineId, comment);
    res.status(200).json('/comments/' + headlineId);
};

module.exports = {
    postComment
};