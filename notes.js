
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const saveNoteButton = document.getElementById('save-note-btn');
const notesList = document.getElementById('notes-list');
const searchBar = document.getElementById('search-bar');
const modeToggleButton = document.getElementById('mode-toggle-btn');


window.onload = loadNotes;

// Mode Toggle Button (Dark/Light Mode)
modeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('mode', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load mode preference from localStorage
if (localStorage.getItem('mode') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Save note to localStorage
saveNoteButton.addEventListener('click', saveNote);

// to save  a note
function saveNote() {
    const title = noteTitleInput.value;
    const content = noteContentInput.value;
    const category = document.getElementById('category').value;

    if (!title || !content) return alert('Please provide both title and content!');

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newNote = {
        title,
        content,
        timestamp: new Date().toLocaleString(),
        category,
        pinned: false
    };

    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));

    noteTitleInput.value = '';
    noteContentInput.value = '';
    loadNotes();
}


function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    displayNotes(notes);
}


function displayNotes(notes) {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );

    notesList.innerHTML = '';
    filteredNotes.forEach((note, index) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>${note.timestamp}</small>
            <button onclick="deleteNote(${index})">Delete</button>
            <button onclick="editNote(${index})">Edit</button>
            <button class="pin-btn" onclick="pinNote(${index})">${note.pinned ? 'Unpin' : 'Pin'}</button>
        `;
        notesList.appendChild(noteCard);
    });
}

// Delete a note
function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

// Edit a note
function editNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];

    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    saveNoteButton.innerHTML = 'Update Note';

    saveNoteButton.onclick = function() {
        note.title = noteTitleInput.value;
        note.content = noteContentInput.value;
        notes[index] = note;
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
        saveNoteButton.innerHTML = 'Save Note';
    };
}

// Pin a note
function pinNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes[index].pinned = !notes[index].pinned; // Toggle pinned status
    notes.sort((a, b) => b.pinned - a.pinned); // Sort pinned notes at the top
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}
