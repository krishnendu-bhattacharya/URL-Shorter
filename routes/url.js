const express = require('express');
const { handelgenerateNewShortURL } = require("../controllers/url");

const router = express.Router();

// POST /url — Create short URL
router.post('/', handelgenerateNewShortURL);

module.exports = router;
