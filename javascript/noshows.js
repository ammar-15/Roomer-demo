
// NO SHOWS //

// Import functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
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

// Adding room to firebase
async function addRoomNS() {
    const inputBoxNS = document.getElementById("noshowsinput-button");
    const listContainerNS = document.querySelector(".noshows-list");

    if (inputBoxNS.value.trim() === "") {
        alert("Please enter a room");
    } else {
        const NSdata = {
            text: inputBoxNS.value.trim(),
            checked: false,
            createdAt: new Date()
        };

        const NSRef = await addDoc(collection(db, "noshows"), NSdata);
        
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox">${NSdata.text}`;
        li.setAttribute('data-id', NSRef.id); 
        listContainerNS.appendChild(li);
        inputBoxNS.value = "";

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            updateRoomNS(NSRef.id, checkbox.checked);
        });
    }
}

// Load rooms from firebase
async function showNS() {
    const listContainerNS = document.querySelector(".noshows-list");
    listContainerNS.innerHTML = ""; 

    const q = query(collection(db, "noshows"), orderBy("createdAt"));

    const NoShowQuery = await getDocs(q);
    NoShowQuery.forEach((doc) => {
        const NSdata = doc.data();
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"${NSdata.checked ? " checked" : ""}>${NSdata.text}`;
        li.setAttribute('data-id', doc.id); 
        listContainerNS.appendChild(li);

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            updateRoomNS(doc.id, checkbox.checked);
        });
    });
}

showNS() 

// Update room in firebase
async function updateRoomNS(id, checked) {
    const roomRef = doc(db, "noshows", id);
    await updateDoc(roomRef, { checked: checked });
}

// Remove room from firebase
async function removeRoomNS() {
    const removeBoxNS = document.getElementById("removenoshowsinput-button");
    const listContainerNS = document.querySelector(".noshows-list");

    if (removeBoxNS.value.trim() === "") {
        alert("Please enter a room");
    } else {
        const removeLi = listContainerNS.getElementsByTagName("li");
        let NSfound = false;

        for (let i = 0; i < removeLi.length; i++) {
            let match = removeLi[i];
            let textValue = match.textContent.trim();
            let roomId = match.getAttribute('data-id');

            if (textValue === removeBoxNS.value.trim()) {
                await deleteDoc(doc(db, "noshows", roomId));
                listContainerNS.removeChild(match);
                NSfound = true;
                break;
            }
        }
        if (!NSfound) {
            alert("Room does not exist");
        }
        removeBoxNS.value = "";
    }
}

document.getElementById('addNSbtn').addEventListener('click', addRoomNS);
document.getElementById('removeNSbtn').addEventListener('click', removeRoomNS);
