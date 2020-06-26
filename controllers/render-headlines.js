// ================================================
//
//  Controller Function
//
// ================================================

// Controller Functions
const { webScraper } = require('./web-scraper');

// Display Headline with Comments
const renderHeadlines = async (res) => {
    const handlebarsObj = await webScraper();
    res.status(200).render('index', handlebarsObj);
};

module.exports = {
    renderHeadlines
};