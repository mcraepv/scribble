const express = require('express');
const path = require('path');
const fs = require('fs');
const { STATUS_CODES } = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/notes', (req, res) => {
  return res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    return res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes.push(newNote);
    for (let i = 0; i < notes.length; i++) {
      notes[i].id = i + 1;
    }
    fs.writeFile(
      path.join(__dirname, '/db/db.json'),
      JSON.stringify(notes),
      (err) => {
        if (err) throw err;
      }
    );
  });
  return res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const deleteID = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes.forEach((note, index) => {
      note.id === deleteID ? notes.splice(index, 1) : null;
    });
    fs.writeFile(
      path.join(__dirname, '/db/db.json'),
      JSON.stringify(notes),
      (err) => {
        if (err) throw err;
      }
    );
  });
  return res.send('Deleted Note Successfully');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});
