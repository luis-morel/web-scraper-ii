// ==============================================
//
//      Database DELETE Operations
//
// ==============================================

const db = require('../models');     // MongoDB Models

const dbDeleteComment = async (commentId, headlineId) => {
    await db.Comments.findOneAndRemove(
        { _id: commentId })
        .then((document) => {
            return db.Headlines.findOneAndUpdate(
                { _id: headlineId },
                { $pull: { comments: commentId } })
                .catch((error) => console.log(`\nUnable to remove comment (id: ${commentId}) from headline (id: ${headlineId}). Error:\n`, error));
        })
        .catch((error) => console.log(`\nUnable to delete comment (id: ${commentId}). Error:\n`, error));
};

module.exports = {
    dbDeleteComment
}