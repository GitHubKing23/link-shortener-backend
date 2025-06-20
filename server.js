const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const linkRoutes = require('./routes/linkRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linkshortener';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', linkRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
