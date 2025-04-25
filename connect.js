const mongoose = require('mongoose');

// Connect to MongoDB
function connectToMongoDB(url) {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = { connectToMongoDB };
