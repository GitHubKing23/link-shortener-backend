const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const linkRoutes = require('./routes/linkRoutes');
const Link = require('./models/Link'); // Needed for redirect logic

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linkshortener';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes (for shortening and admin dashboard)
app.use('/api', linkRoutes);

// Redirect handler for short links
app.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });
    if (!link) return res.status(404).send('Short link not found');

    link.clicks += 1;
    await link.save();

    return res.redirect(link.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
