const express = require('express');
const path = require('path');
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const staticRoute = require("./routes/staticRouter");

const app = express();
const PORT = 8001;

// DB Connection
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/url", urlRoute);
app.use("/", staticRoute);

// Redirect route to handle short URL
app.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;

    const entry = await URL.findOneAndUpdate(
        { shortID },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            }
        }
    );

    if (!entry) {
        return res.status(404).send("Short URL not found!");
    }

    res.redirect(entry.redirectURL);
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});
