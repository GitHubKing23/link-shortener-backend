require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const linkRoutes = require('./routes/linkRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', linkRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shortener';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app;
