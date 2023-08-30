# web-scraper-ii

This an MVC web-scraping application built with Handlebars, Node.js, and MongoDB. It scrapes article metadata from the NY Times Space and Astronomy section, in particular, from the "Latest" articles near the bottom of the page: https://www.nytimes.com/section/science/space.

The NY Times changes their CSS selectors periodically at which point they need to be changed in the app to continue scraping successfully. So if you are no longer seeing new articles, NY Times has updated their CSS selectors.

Hosted on the Heroku platform here: https://dry-everglades-37811.herokuapp.com/

**Update** (8/29/2023): The MongoDB add-on is no longer available with my Heroku account so my app is no longer able to store scraped article metadata.