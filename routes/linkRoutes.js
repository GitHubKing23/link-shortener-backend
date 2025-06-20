const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Link = require('../models/Link');

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Create short URL
router.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    let link = await Link.findOne({ originalUrl: url });
    if (link) {
      return res.json({ shortCode: link.shortCode });
    }

    const shortCode = nanoid(7);
    link = new Link({ originalUrl: url, shortCode });
    await link.save();
    res.json({ shortCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all links for admin dashboard
router.get('/links', async (req, res) => {
  try {
    const links = await Link.find({}, 'originalUrl shortCode clicks createdAt')
      .sort({ createdAt: -1 });
    res.status(200).json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect short code
router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });
    if (!link) {
      return res.status(404).json({ error: 'Not found' });
    }

    link.clicks += 1;
    await link.save();

    res.redirect(link.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
