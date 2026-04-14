const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is alive 🚀');
});

const noteRoutes = require('./routes/note.routes');
app.use('/api/notes', noteRoutes);

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

module.exports = app;