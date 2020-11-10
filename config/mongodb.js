// ******************************************
//
//      MongoDB Configuration
//
// ******************************************

const mongoose = require('mongoose');   // MongoDB Object Modeler

const MONGODB_URI = process.env.MLAB_MONGODB_URI || 'mongodb://localhost/NYTSSHeadlines';
mongoose.Promise = Promise; // Leveraging ES6 Promises
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const connectDb = () => {
    return mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
        .then(() => { console.log(`\nSuccessfully connected to MongoDB`) })
        .catch((error) => { console.log(`\nUnable to connect to MongoDB`, error) });
};

module.exports = {
    connectDb
}