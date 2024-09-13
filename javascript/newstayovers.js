
// NEW STAYOVERS //

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
async function addRoomNStay() { 
    const inputBoxNStay = document.getElementById("newstayoversinput-button"); 
    const listContainerNStay = document.querySelector(".newstayovers-list"); 

    if (inputBoxNStay.value.trim() === "") { 
        alert("Please enter a room");
    } else {
        const NStaydata = { 
            text: inputBoxNStay.value.trim(),
            checked: false,
            createdAt: new Date()
        };

        const NStayRef = await addDoc(collection(db, "newstayovers"), NStaydata); 
        
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox">${NStaydata.text}`;
        li.setAttribute('data-id', NStayRef.id);
        listContainerNStay.appendChild(li);
        inputBoxNStay.value = ""; 

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            updateRoomNStay(NStayRef.id, checkbox.checked);
        });
    }
}

// Load rooms from firebase
async function showNStay() {
    const listContainerNStay = document.querySelector(".newstayovers-list");
    listContainerNStay.innerHTML = ""; 

    const q = query(collection(db, "newstayovers"), orderBy("createdAt"));

    const NStayQuery = await getDocs(q); 
    NStayQuery.forEach((doc) => {
        const NStaydata = doc.data();
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"${NStaydata.checked ? " checked" : ""}>${NStaydata.text}`;
        li.setAttribute('data-id', doc.id);
        listContainerNStay.appendChild(li);

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            updateRoomNStay(doc.id, checkbox.checked);
        });
    });
}

showNStay();

// Update room in firebase
async function updateRoomNStay(id, checked) {
    const roomRef = doc(db, "newstayovers", id);
    await updateDoc(roomRef, { checked: checked });
}

// Remove room from firebase
async function removeRoomNStay() { 
    const removeBoxNStay = document.getElementById("removenewstayoversinput-button"); 
    const listContainerNStay = document.querySelector(".newstayovers-list"); 

    if (removeBoxNStay.value.trim() === "") { 
        alert("Please enter a room");
    } else {
        const removeLi = listContainerNStay.getElementsByTagName("li"); 
        let NStayfound = false;

        for (let i = 0; i < removeLi.length; i++) {
            let match = removeLi[i];
            let textValue = match.textContent.trim();
            let roomId = match.getAttribute('data-id');

            if (textValue === removeBoxNStay.value.trim()) { 
                await deleteDoc(doc(db, "newstayovers", roomId)); 
                listContainerNStay.removeChild(match); 
                NStayfound = true; 
                break;
            }
        }
        if (!NStayfound) {
            alert("Room does not exist");
        }
        removeBoxNStay.value = ""; 
    }
}

document.getElementById('addNStaybtn').addEventListener('click', addRoomNStay); 
document.getElementById('removeNStaybtn').addEventListener('click', removeRoomNStay); 
