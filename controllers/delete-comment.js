// ================================================
//
//  Controller Function
//
// ================================================

// Controller Functions
const { dbDeleteComment } = require('./db-delete');

const deleteComment = async (req, res) => {
    let commentId = req.params.id,
        headlineId = req.body.headlineId;
    await dbDeleteComment(commentId, headlineId);
    res.status(200).json('/comments/' + headlineId);
};

module.exports = {
    deleteComment
};