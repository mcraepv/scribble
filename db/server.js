const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/notes', (req, res) => {
  const data = getNotes();
  res.json(data);
});

async function getNotes() {
  fs.readFile('./db.json', (err, data) => {
    if (err) throw err;
    return data;
  });
}

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});
