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
  const { url, customCode } = req.body;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    if (!customCode) {
      const existing = await Link.findOne({ originalUrl: url });
      if (existing) {
        return res.json({ shortCode: existing.shortCode });
      }
    }

    let shortCode = customCode;

    if (customCode) {
      const codeInUse = await Link.findOne({ shortCode: customCode });
      if (codeInUse) {
        return res.status(409).json({ error: 'Custom code already exists' });
      }
    } else {
      shortCode = nanoid(Math.floor(Math.random() * 2) + 6);
    }

    const link = new Link({ originalUrl: url, shortCode });
    await link.save();

    res.json({ shortCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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
