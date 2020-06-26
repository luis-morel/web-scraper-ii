// ==============================================
//
//  Controller Function: webScraper()
//
//  Description: 
//      1) Retrieves all db headlines
//      2) Scrapes NY Times Science\Space Headlines
//      3) Adds new headlines to db
//      4) Returns all db headlines, with updates (if any)
//
// ==============================================

// Node Packages
const cheerio = require('cheerio');     // HTTP Request Body Parser
const fetch = require('node-fetch');    // HTTP Requester

// Controller Functions
const { dbInsertManyHeadlines } = require('./db-create');
const { getAllHeadlines } = require('./db-read');
const { getCurrentDate } = require('./helper-functions');

const webScraper = async () => {
    let dbHeadlines = await getAllHeadlines(),
        dbUpdatedHeadlines = [],
        newHeadlines = [];
    await fetch("https://www.nytimes.com/section/science/space")
        .then((res) => res.text())
        .then((body) => {
            const $ = cheerio.load(body);   // Load Response Body into Cheerio
            // Parse <li class='css-ye6x8s'> elements
            $("li.css-ye6x8s").each((i, element) => {
                let title = $(element).find('h2.css-1j9dxys').text(),
                    summary = $(element).find('p.css-1echdzn').text(),
                    photo = $(element).find('img.css-11cwn6f').attr('src'),
                    author = $(element).find('span.css-1n7hynb').text(),
                    link = $(element).find('div.css-1l4spti a').attr('href'),
                    date = link.slice(1, 11),
                    year = date.slice(0, 4),
                    dateCheck = parseInt(year);
                if (isNaN(dateCheck)) date = getCurrentDate();
                else {
                    let month = date.slice(5, 7),
                        day = date.slice(8, 10);
                    date = `${year}-${month}-${day}`;
                }
                // Checking for Duplicates; Capturing New Headlines
                if (photo && link && summary && title) {
                    let duplicate = false,
                        articleLink = `https://www.nytimes.com${link}`;
                    for (let i = 0; i < dbHeadlines.length; i++)
                        if (dbHeadlines[i].link === articleLink) {
                            duplicate = true;
                            break;
                        }
                    if (!duplicate) newHeadlines.push({ date, title, summary, photo, author, link: articleLink });
                };
            });
        })
        .catch((error) => console.log('\nUnable to scrape headlines. Error:\n', error));
    if (newHeadlines.length > 0) {
        await dbInsertManyHeadlines(newHeadlines);
        dbUpdatedHeadlines = await getAllHeadlines();
        return { document: dbUpdatedHeadlines };
    } else
        return { document: dbHeadlines };
};

module.exports = {
    webScraper
}