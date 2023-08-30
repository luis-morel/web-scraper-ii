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
                let title = $(element).find('h3.css-1kv6qi').text(), // Previously: h2.css-1j9dxys
                    summary = $(element).find('p.css-1pga48a').text(), // Previously: p.css-1echdzn
                    photo = $(element).find('img.css-rq4mmj').attr('src'), // Previously: img.css-11cwn6f
                    author = $(element).find('span.css-1n7hynb').text(), // Previously: span.css-1n7hynb
                    link = $(element).find('a.css-8hzhxf').attr('href'), // Previously: div.css-1l4spti a
                    date = link.slice(1, 11),
                    dateCheck = parseInt(date.slice(0, 4));
                if (isNaN(dateCheck)) date = getCurrentDate();
                else date = getCurrentDate(date);
                // Checking for Duplicates; Capturing New Headlines
                if (photo && link && summary && title) {
                    let duplicate = false,
                        articleLink = `https://www.nytimes.com${link}`;
                    for (let i = 0; i < dbHeadlines.length; i++)
                        if (dbHeadlines[i].link === articleLink) {
                            duplicate = true;
                            break;
                        }
                    if (!duplicate)
                        newHeadlines.push({ 
                            title, 
                            summary, 
                            author, 
                            photo, 
                            link: articleLink, 
                            date: date.shortDate, 
                            timestamp: date.isoDate });
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
};