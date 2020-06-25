const express = require('express');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/notes', (req, res) => {
  return res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', async (req, res) => {
  const notes = await readNotes();
  return res.json(notes);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', async (req, res) => {
  try {
    const newNote = req.body;
    const notes = await readNotes();
    notes.push(newNote);
    console.log(newNote);
    for (let i = 0; i < notes.length; i++) {
      notes[i].id = i + 1;
    }
    writeNotes(notes);
    return res.json(newNote);
  } catch (err) {
    throw err;
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  const deleteID = parseInt(req.params.id);
  const notes = await readNotes();
  notes.forEach((note, index) => {
    note.id === deleteID ? notes.splice(index, 1) : null;
  });
  writeNotes(notes);
  return res.send('Deleted Note Successfully');
});

async function readNotes() {
  try {
    const data = await readFileAsync(path.join(__dirname, '/db/db.json'), {
      encoding: 'utf8',
    });
    let notes = JSON.parse(data);
    return notes;
  } catch (err) {
    console.log(err);
  }
}

function writeNotes(notes) {
  try {
    const data = JSON.stringify(notes);
    writeFileAsync(path.join(__dirname, '/db/db.json'), data, {
      encoding: 'utf8',
    });
  } catch (err) {
    console.log(err);
  }
}

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});
