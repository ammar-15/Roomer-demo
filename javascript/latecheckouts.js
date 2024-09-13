// LATE CHECK OUTS //

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
async function addRoomLC() {
    const inputBoxLC = document.getElementById("latecheckoutinput-button");
    const selectTimeLC = document.getElementById("latecheckout-time");
    const listContainerLC = document.querySelector(".latecheckout-list");

    if (inputBoxLC.value.trim() === "") {
        alert("Please enter a room");
    } else {
        const LCdata = {
            text: inputBoxLC.value.trim(),
            time: selectTimeLC.value,
            checked: false,
            createdAt: new Date()
        };

        const LCRef = await addDoc(collection(db, "latecheckouts"), LCdata);
        
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox">${LCdata.text} - ${LCdata.time}`;
        li.setAttribute('data-id', LCRef.id);
        listContainerLC.appendChild(li);
        inputBoxLC.value = "";

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            updateRoomLC(LCRef.id, checkbox.checked);
        });
    }
}

// Load rooms from firebase
async function showLC() {
    const listContainerLC = document.querySelector(".latecheckout-list");
    listContainerLC.innerHTML = "";

    const q = query(collection(db, "latecheckouts"), orderBy("createdAt"));

    const LCQuery = await getDocs(q);
    LCQuery.forEach((doc) => {
        const LCdata = doc.data();
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"${LCdata.checked ? " checked" : ""}>${LCdata.text} - ${LCdata.time}`;
        li.setAttribute('data-id', doc.id);
        listContainerLC.appendChild(li);

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            updateRoomLC(doc.id, checkbox.checked);
        });
    });
}

showLC();

// Update room in firebase
async function updateRoomLC(id, checked) {
    const roomRef = doc(db, "latecheckouts", id);
    await updateDoc(roomRef, { checked: checked });
}

// Remove room from firebase
async function removeRoomLC() {
    const removeBoxLC = document.getElementById("removelatecheckoutinput-button");
    const listContainerLC = document.querySelector(".latecheckout-list");

    if (removeBoxLC.value.trim() === "") {
        alert("Please enter a room");
    } else {
        const removeLi = listContainerLC.getElementsByTagName("li");
        let LCfound = false;

        for (let i = 0; i < removeLi.length; i++) {
            let match = removeLi[i];
            let textValue = match.textContent.trim();
            let roomId = match.getAttribute('data-id');

            if (textValue.startsWith(removeBoxLC.value.trim())) {
                await deleteDoc(doc(db, "latecheckouts", roomId));
                listContainerLC.removeChild(match);
                LCfound = true;
                break;
            }
        }
        if (!LCfound) {
            alert("Room does not exist");
        }
        removeBoxLC.value = "";
    }
}

document.getElementById('addLCbtn').addEventListener('click', addRoomLC);
document.getElementById('removeLCbtn').addEventListener('click', removeRoomLC);
