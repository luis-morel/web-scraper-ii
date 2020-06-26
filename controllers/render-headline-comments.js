// ================================================
//
//  Controller Function
//
// ================================================

// Controller Functions
const { getHeadlineWithComments } = require('./db-read');

// Display Headline with Comments
const renderHeadlineComments = async (req, res) => {
    let headlineId = req.params.id,
        handlebarsObj = await getHeadlineWithComments(headlineId);
    res.status(200).render('comments', handlebarsObj);
};

module.exports = {
    renderHeadlineComments
};