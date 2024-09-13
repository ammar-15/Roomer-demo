// HOME PAGE //

// Import functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
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
console.log(db); 

document.getElementById("addroominput-button").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("addbtn").click();
    }
});

// Adding room to firebase
async function addRoom() {
    const inputBox = document.getElementById("addroominput-button");
    const firstFloorList = document.querySelector(".first-content");
    const secondFloorList = document.querySelector(".second-content");
    const thirdFloorList = document.querySelector(".third-content");
    const fourthFloorList = document.querySelector(".fourth-content");

    if (inputBox.value.trim() === "") {
        alert("Please enter a room");
    } else {
        let li = document.createElement("li");
        li.textContent = inputBox.value.trim();

        let floor = "";
        if (inputBox.value > 100 && inputBox.value < 200) {
            firstFloorList.appendChild(li);
            floor = "floor1";
        } else if (inputBox.value > 200 && inputBox.value < 300) {
            secondFloorList.appendChild(li);
            floor = "floor2";
        } else if (inputBox.value > 300 && inputBox.value < 400) {
            thirdFloorList.appendChild(li);
            floor = "floor3";
        } else if (inputBox.value > 400 && inputBox.value < 500) {
            fourthFloorList.appendChild(li);
            floor = "floor4";
        }

        inputBox.value = "";

        if (floor) {
            await addRoomToFirestore(floor, li.textContent); 
        }
    }
}

// Save room to firebase
async function addRoomToFirestore(floor, room) { 
    await addDoc(collection(db, floor), { room: room, createdAt: new Date() });
}

// Load room from firebase
async function showCheckouts() {
    const floors = [".first-content", ".second-content", ".third-content", ".fourth-content"];
    const floorNames = ["floor1", "floor2", "floor3", "floor4"]; 

    for (let i = 0; i < floors.length; i++) {
        const list = document.querySelector(floors[i]);
        list.innerHTML = "";

        const q = query(collection(db, floorNames[i]), orderBy("createdAt"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => { 
            let li = document.createElement("li");
            li.textContent = doc.data().room; 
            list.appendChild(li);
        });
    }
}

showCheckouts();

// Remove room 
document.getElementById("removeroominput-button").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("removebtn").click();
    }
});

async function removeRoom() {
    const removeBox = document.getElementById("removeroominput-button");
    const floors = [".first-content", ".second-content", ".third-content", ".fourth-content"];
    const floorNames = ["floor1", "floor2", "floor3", "floor4"];

    if (removeBox.value.trim() === "") {
        alert("Please enter a room");
    } else {
        let roomFound = false;

        for (let i = 0; i < floors.length; i++) {
            const list = document.querySelector(floors[i]);
            const items = list.getElementsByTagName("li");

            for (let j = 0; j < items.length; j++) {
                if (items[j].textContent.trim() === removeBox.value.trim()) {
                    await removeRoomFromFirestore(floorNames[i], items[j].textContent);
                    list.removeChild(items[j]);
                    roomFound = true;
                    break;
                }
            }

            if (roomFound) break;
        }

        if (roomFound) {
            removeBox.value = "";
        } else {
            alert("Room does not exist");
            removeBox.value = "";
        }
    }
}

async function removeRoomFromFirestore(floor, room) { 
    const querySnapshot = await getDocs(collection(db, floor)); 
    querySnapshot.forEach((doc) => { 
        if (doc.data().room === room) { 
            deleteDoc(doc.ref); 
        }
    });
}

// Search room
document.getElementById("searchinput-button").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("searchbtn").click();
    }
});

function searchRoom() {
    const searchBox = document.getElementById("searchinput-button");
    const floors = [".first-content", ".second-content", ".third-content", ".fourth-content"];

    let roomFound = false;

    floors.forEach(floor => {
        const list = document.querySelector(floor);
        const items = list.getElementsByTagName("li");

        for (let i = 0; i < items.length; i++) {
            let match = items[i];
            if (match.textContent.toUpperCase().includes(searchBox.value.toUpperCase())) {
                items[i].style.backgroundColor = "yellow";
                if (!roomFound) {
                    items[i].scrollIntoView({ behavior: "smooth", block: "center" });
                    roomFound = true;
                }
                setTimeout(() => {
                    items[i].style.backgroundColor = "";
                }, 3000);
                break;
            } else {
                items[i].style.backgroundColor = "";
            }
        }
    });

    searchBox.value = "";

    if (!roomFound) {
        alert("Room does not exist");
    }
}

document.getElementById('addbtn').addEventListener('click', addRoom); 
document.getElementById('removebtn').addEventListener('click', removeRoom); 
document.getElementById('searchbtn').addEventListener('click', searchRoom); 

// Sort rooms //
async function sortRooms() {
    const sortOption = document.getElementById('sort-dropdown').value;
    const floors = [".first-content", ".second-content", ".third-content", ".fourth-content"];
    const floorNames = ["floor1", "floor2", "floor3", "floor4"];

    for (let i = 0; i < floors.length; i++) {
        const list = document.querySelector(floors[i]);
        list.innerHTML = "";
        const q = query(collection(db, floorNames[i]), orderBy("createdAt"));
        const querySnapshot = await getDocs(q);
        let rooms = [];
        querySnapshot.forEach((doc) => {
            rooms.push(doc.data().room);
        });
        if (sortOption === "ascending") {
            rooms.sort((a, b) => a - b);
        } else if (sortOption === "descending") {
            rooms.sort((a, b) => b - a);
        } else if (sortOption === "upside-down") {
            rooms.reverse();
        }
        rooms.forEach(room => {
            let li = document.createElement("li");
            li.textContent = room;
            list.appendChild(li);
        });
    }
}
document.getElementById('sortbtn').addEventListener('click', sortRooms);
