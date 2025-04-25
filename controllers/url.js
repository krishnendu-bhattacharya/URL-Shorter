const { nanoid } = require("nanoid");
const URL = require('../models/url');

// Create a new short URL
async function handelgenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url || body.url.trim() === '') {
        return res.render("home", {
            id: null,
            message: "❌ URL is required!"
        });
    }

    const inputURL = body.url.trim();
    const shortID = nanoid(8);

    await URL.create({
        shortID,
        redirectURL: inputURL,
        visitHistory: [],
    });

    return res.render("home", {
        id: shortID,
        message: "✅ Short URL created successfully!"
    });
}

// Get analytics for a short URL
async function handelGetAnalytics(req, res) {
    const shortID = req.params.shortId.trim();
    const result = await URL.findOne({ shortID });

    if (!result) return res.status(404).json({ error: 'Short URL not found' });

    return res.status(200).json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

// Handle redirection to original URL
async function handelShortIDRedirect(req, res) {
    const shortID = req.params.shortID.trim();
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

    if (!entry) return res.status(404).send("Short URL not found!");
    res.redirect(entry.redirectURL);
}

module.exports = {
    handelgenerateNewShortURL,
    handelGetAnalytics,
    handelShortIDRedirect
};
