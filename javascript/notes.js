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
    console.log("hello");
    const notesSnapshot = await getDocs(collection(db, "notes"));
    console.log(notesSnapshot);
    return notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const notesContainer = document.querySelector(".addnotes-container")
const addNoteButton = document.querySelector(".add-notes");

//Save notes to firebase//
async function saveNoteToFirestore(note) {
    const docRef = await addDoc(collection(db, "notes"), note);
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

// Create new note
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

    optionsButton.addEventListener("click", () => {
        dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        dropdownMenu.style.opacity = dropdownMenu.style.display === "block" ? "1" : "0";
        event.stopPropagation();
    });

    dropdownMenu.querySelector(".delete-note-btn").addEventListener("click", () => {
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


// Add new note in firebase
async function addNote() {
    const noteObject = { content: "" };
    const noteId = await saveNoteToFirestore(noteObject);
    const noteElement = createNoteElement(noteId, noteObject.content);
    notesContainer.insertBefore(noteElement, addNoteButton);
    noteElement.setAttribute('data-id', noteId);
}

// Load notes from firebase
async function loadNotes() {
    const notes = await getNotes();
    notes.forEach(note => {
        const noteElement = createNoteElement(note.id, note.content);
        notesContainer.insertBefore(noteElement, addNoteButton);
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

loadNotes();

addNoteButton.addEventListener("click", addNote);
document.getElementById("searchnoteinput-button").addEventListener("input", searchNote);