// NOTES PAGE //

// Import functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
  };


// Initialize firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collecting notes
async function getNotes() {
    const notesSnapshot = await getDocs(collection(db, "notes"));
    return notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()  // Ensure createdAt is handled
    }));
}

const notesContainer = document.querySelector(".addnotes-container");
const addNoteButton = document.querySelector(".add-notes");

// Save notes to firebase
async function saveNoteToFirestore(note) {
    const docRef = await addDoc(collection(db, "notes"), { ...note, createdAt: new Date() });
    return docRef.id;
}

// Update note in firebase
async function updateNote(id, newContent) {
    const noteRef = doc(db, "notes", id);
    await updateDoc(noteRef, { content: newContent });
}

// Delete note from firebase
async function deleteNote(id, element) {
    const noteRef = doc(db, "notes", id);
    await deleteDoc(noteRef);
    notesContainer.removeChild(element);
}

// Create new note element
function createNoteElement(id, content = "") {
    const element = document.createElement("div");
    element.classList.add("note-container");

    const textarea = document.createElement("textarea");
    textarea.classList.add("note");
    textarea.value = content;
    textarea.placeholder = "Empty Note";

    textarea.addEventListener("change", () => {
        updateNote(id, textarea.value);
    });

    const optionsButton = document.createElement("div");
    optionsButton.classList.add("note-options");
    optionsButton.innerHTML = `<img src="images/three-dots.svg" alt="options">`;

    const dropdownMenu = document.createElement("div");
    dropdownMenu.classList.add("note-options-menu");
    dropdownMenu.style.display = "none";
    dropdownMenu.innerHTML = `<button class="delete-note-btn">Delete</button>`;

    optionsButton.addEventListener("click", (event) => {
        dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        dropdownMenu.style.opacity = dropdownMenu.style.display === "block" ? "1" : "0";
        event.stopPropagation();
    });

    dropdownMenu.querySelector(".delete-note-btn").addEventListener("click", (event) => {
        const doDelete = confirm("Are you sure you wish to delete this note?");
        if (doDelete) {
            deleteNote(id, element);
        }
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
    });

    dropdownMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    element.appendChild(textarea);
    element.appendChild(optionsButton);
    element.appendChild(dropdownMenu);

    return element;
}

// Add new note to firebase
async function addNote() {
    const noteObject = { content: "" };
    const noteId = await saveNoteToFirestore(noteObject);
    const noteElement = createNoteElement(noteId, noteObject.content);
    document.querySelector('.addnotes-container').appendChild(noteElement); 
    noteElement.setAttribute('data-id', noteId);
}

// Load notes from firebase
async function loadNotes() {
    const notes = await getNotes();
    const notesContainer = document.querySelector('.addnotes-container');
    notesContainer.innerHTML = ''; 
    notes.forEach(note => {
        const noteElement = createNoteElement(note.id, note.content);
        notesContainer.appendChild(noteElement); 
    });
}

// Search notes
function searchNote() {
    const searchboxN = document.getElementById("searchnoteinput-button").value.toUpperCase();
    const allNotes = document.querySelectorAll(".note");

    allNotes.forEach(note => {
        let textvalue = note.value || note.textContent;
        if (textvalue.toUpperCase().indexOf(searchboxN) > -1) {
            note.style.display = "";
        } else {
            note.style.display = "none";
        }
    });
}
// Sort notes
async function sortNotes() {
    const sortOption = document.getElementById('sort-notes-dropdown').value;
    const notes = await getNotes();
    
    let sortedNotes = [...notes];  // Create a copy of the notes array

    if (sortOption === 'ascending') {
        sortedNotes.sort((a, b) => a.content.localeCompare(b.content));
    } else if (sortOption === 'descending') {
        sortedNotes.sort((a, b) => b.content.localeCompare(a.content));
    } else if (sortOption === 'oldest') {
        sortedNotes.sort((a, b) => a.createdAt - b.createdAt);
    } else {
        sortedNotes.sort((a, b) => b.createdAt - a.createdAt);  // Default: recent
    }

    const notesContainer = document.querySelector('.addnotes-container');
    notesContainer.innerHTML = '';  // Clear the current notes (but not the Add Note button)

    sortedNotes.forEach(note => {
        const noteElement = createNoteElement(note.id, note.content);
        notesContainer.appendChild(noteElement);  // Re-add sorted notes
    });
}

loadNotes();

addNoteButton.addEventListener("click", addNote);
document.getElementById("searchnoteinput-button").addEventListener("input", searchNote);
document.getElementById('sort-notes-button').addEventListener('click', sortNotes);