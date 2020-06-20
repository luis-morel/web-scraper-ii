const express = require("express");                 // Web Server
const PORT = process.env.PORT || 3000;              // Web Server Port
const app = express();                              // Web App
const cheerio = require("cheerio");                 // HTML Body Parser
const fetch = require('node-fetch');                // HTML Requester
const handlebars = require("express-handlebars");   // Templating Engine
const logger = require("morgan");                   // Request Logger
const mongoose = require("mongoose");               // MongoDB Object Modeler
const db = require("./models");                     // MongoDB Models

// MongoDB Config\Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYTSSHeadlines";
mongoose.Promise = Promise;         // Leveraging built-in ES6 Promises
mongoose.set('useUnifiedTopology', true);
const connectDb = () => {
    return mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        .then(() => { console.log(`\nSuccessfully connected to MongoDB`) })
        .catch((error) => { console.log(`Unable to connect to MongoDB`, error) });
};

// Express Config\Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));             // Morgan Request Logger
app.use(express.static("public"));  // Serving './Public' as Static Directory

// HandleBars Config
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// App Endpoints
app.get("/", (req, res) => {
    // Retrieve All Headlines From DB, Scrape Web, and Update Mongo DB If New Headlines Available
    db.Headlines.find({})
        .then((dbData) => {
            webScrape(dbData, (newHeadlines) => {
                dbUpdate(newHeadlines, (completed) => {
                    if (completed) {
                        // Send All Headlines to Handlebars
                        db.Headlines.find({})
                            .sort({ date: 'desc' })
                            .lean()
                            .then((dbDocuments) => {
                                const hbsObject = { document: dbDocuments };
                                res.render("index", hbsObject);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    };
                });
            });
        })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/comments", (req, res) => {
    res.status(200).json('/comments/' + req.query.headlineId);
});

app.get("/comments/:id", (req, res) => {
    // Retrieve Requested Headline
    db.Headlines.findOne(
        { _id: req.params.id })
        .populate({ path: "comments", select: "message" })
        .then((dbHeadline) => {
            const hbsObject = { document: dbHeadline };
            res.render("comments", hbsObject);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post("/comments/:id", (req, res) => {
    db.Comments.create(req.body)
        .then((dbComment) => {
            return db.Headlines.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { comments: dbComment._id } },
                { new: true })
        })
        .then((dbHeadline) => {
            res.status(200).json('/comments/' + req.params.id);
        })
        .catch((error) => {
            res.json(error);
        });
});

app.delete("/comments/:id", (req, res) => {
    db.Comments.findOneAndRemove(
        { _id: req.params.id })
        .then((dbDocument) => {
            return db.Headlines.findOneAndUpdate(
                { _id: req.body.headlineId },
                { $pull: { comments: req.params.id } })
                .then((dbHeadline) => {
                    res.status(200).json('/comments/' + req.body.headlineId);
                })
                .catch((error) => {
                    res.json(error);
                });
        });
});

// HTTP Response Body Scraper
const webScrape = (dbHeadlines, callback) => {
    const newHeadlines = [];
    console.log("\nNow Scraping NY Times Science/Space Headlines!");
    fetch("https://www.nytimes.com/section/science/space")
        .then((res) => res.text())
        .then((body) => {
            const $ = cheerio.load(body);   // Load HTML Body into Cheerio
            // Parse <li class='css-ye6x8s'> elements
            $("li.css-ye6x8s").each((i, element) => {
                const title = $(element).find('h2.css-1j9dxys').text();
                const summary = $(element).find('p.css-1echdzn').text();
                const photo = $(element).find('img.css-11cwn6f').attr('src');
                const link = `https://www.nytimes.com${$(element).find('div.css-1l4spti a').attr('href')}`;
                const author = $(element).find('span.css-1n7hynb').text();
                const date = link.slice(24, 34);
                const year = date.slice(0, 4);
                const month = date.slice(5, 7);
                const day = date.slice(8, 10);
                const timestamp = `${year}-${month}-${day}`;
                // Checking for Duplicates
                if (photo && link && summary && title) {
                    let duplicate = false;
                    for (let i = 0; i < dbHeadlines.length; i++) {
                        if (dbHeadlines[i].link === link) {
                            duplicate = true;
                            break;
                        }
                    };
                    if (!duplicate)
                        newHeadlines.push({ title, author, summary, date: timestamp, photo, link });
                };
            });
            console.log("\nScraped Headlines: ", newHeadlines, `(Length: ${newHeadlines.length})\n`);
            return callback(newHeadlines); // Returning Array of Objects with New Headlilnes
        });
};

// MongoDB Update
const dbUpdate = (newHeadlines, callback) => {
    let completed = true;
    if (newHeadlines.length > 0) {
        db.Headlines.insertMany(newHeadlines, (error, dbDocuments) => {
            if (error) {
                completed = false;
                throw error;
            }
            else
                return callback(completed);
        });
    }
    else
        return callback(completed);
};

// Connect to MongoDB and Initialize Express Server
connectDb()
    .then(async () => {
        app.listen(PORT, () =>
            console.log(`\nExpress server listening on port ${PORT}`),
        );
    });
