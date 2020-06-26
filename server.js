const express = require('express');                 // Web Server
const PORT = process.env.PORT || 3000;              // Web Server Port
const { routes } = require('./controllers/routes'); // Web Server Routes
const app = express();                              // Web App
const handlebars = require('express-handlebars');   // View Templating Engine
const logger = require('morgan');                   // HTTP Request Logger
const { connectDb } = require('./config/mongodb');  // MongoDB Config

// ========== Express Settings\Middleware Config ==========
app.use(express.json())                             // Registering body-parsing middleware
app.use(express.urlencoded({ extended: true }));    // Registering body-parsing middleware
app.use(logger('dev'));                             // Registering Morgan
app.use(express.static('public'));                  // Serving './Public' as statically
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));    // Registering Handlebars
app.set('view engine', 'handlebars');               // Registering Handlebars
app.use('/', routes);                               // Registering server routes
// ========================================================


/**************** Launching DB\Web Server ****************/
connectDb()
    .then(async () => {
        app.listen(PORT, () =>
            console.log(`Express server listening on port ${PORT}\n`),
        );
    });
/*********************************************************/
