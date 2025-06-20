const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

// GET /api/links - return all links with selected fields
router.get('/links', async (req, res) => {
  try {
    const links = await Link.find({}, 'originalUrl shortCode clicks createdAt')
      .sort({ createdAt: -1 });
    return res.status(200).json(links);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/links/:id - remove a link entry
router.delete('/links/:id', async (req, res) => {
  try {
    const deleted = await Link.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Link not found' });
    }
    return res.status(200).json({ message: 'Link deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
