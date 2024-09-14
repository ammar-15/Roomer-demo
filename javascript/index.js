// Import functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc, 
    setDoc, 
    deleteDoc, 
    collection, 
    getDocs, 
    addDoc  
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

// DATE AND TIME //
const dateElement = document.querySelector(".date");
const timeElement = document.querySelector(".time");

/** 
* @param {Date} date
*/
function formatTime(date) {
    const hours12 = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const isAM = date.getHours() < 12;

    return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${isAM ? "AM" : "PM"}`; 
}

function formatDate(date) {
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function updateDateTime() {
    const now = new Date();
    timeElement.textContent = formatTime(now);
    dateElement.textContent = formatDate(now);

    saveDateTime(formatDate(now), formatTime(now));
}

// Save date and time to localStorage
function saveDateTime(date, time) { 
    localStorage.setItem("date", date);
    localStorage.setItem("time", time);
}

// Load saved date and time from localStorage
function loadDateTime() { 
    const savedDate = localStorage.getItem("date");
    const savedTime = localStorage.getItem("time");

    if (savedDate && savedTime) {
        dateElement.textContent = savedDate;
        timeElement.textContent = savedTime;
    } else {
        updateDateTime();
    }
}

loadDateTime();
setInterval(updateDateTime, 200);


// DAILY DATA //

function debounce(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

const inhouseInput = document.getElementById("inhouse-input");
const stayoversInput = document.getElementById("totalstayovers-input");
const checkoutsInput = document.getElementById("totalcheckouts-input");

loadDailyData();

inhouseInput.addEventListener("blur", _.debounce(() => saveDailyData("inhouse", inhouseInput.value), 500));
stayoversInput.addEventListener("blur", _.debounce(() => saveDailyData("stayovers", stayoversInput.value), 500));
checkoutsInput.addEventListener("blur", _.debounce(() => saveDailyData("checkouts", checkoutsInput.value), 500));

async function loadDailyData() {
    const docRef = doc(db, "metadata", "dailyData");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        inhouseInput.value = data.inhouse || "";
        stayoversInput.value = data.stayovers || "";
        checkoutsInput.value = data.checkouts || "";
    } else {
        inhouseInput.value = "";
        stayoversInput.value = "";
        checkoutsInput.value = "";
    }
}

// Saving data to firebase //
async function saveDailyData(key, value) {
    const docRef = doc(db, "metadata", "dailyData"); 
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : {};
    data[key] = value; 
    await setDoc(docRef, data); 
}


// Print all //
document.getElementById('printall-button').addEventListener('click', function () {
    const iframeSources = [
        'index.html',
        'lateCheckouts.html',
        'newStayovers.html',
        'noShows.html',
        'notes.html'
    ];
    let combinedContent = '';
    let loadPromises = iframeSources.map(src => {
        return new Promise((resolve) => {
            let iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = src;
            document.body.appendChild(iframe);
            iframe.onload = function() {
                if (iframe.contentDocument && iframe.contentDocument.body) {
                    combinedContent += iframe.contentDocument.body.innerHTML;
                }
                document.body.removeChild(iframe); 
                resolve();
            };
            iframe.onerror = function() {
                document.body.removeChild(iframe);
                resolve();
            };
        });
    });

    Promise.all(loadPromises)
        .then(() => {
            printCombinedContent(combinedContent);
        });
});

function printCombinedContent(content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print All Content</title>
            </head>
            <body>${content}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 1000);
}

// Reset all //
async function resetAll() {
    const userConfirmed = confirm("Please confirm that you wish to reset the data at end of day");
    if (userConfirmed) {
        setTimeout(async () => {
            await deleteDoc(doc(db, "metadata", "dailyData"));
            await deleteDoc(doc(db, "metadata", "dateTime"));
            await clearCollection("floor1");
            await clearCollection("floor2");
            await clearCollection("floor3");
            await clearCollection("floor4");
            await clearCollection("noshows");
            await clearCollection("latecheckouts");
            await clearCollection("newstayovers");
            await clearCollection("notes");
            window.location.reload();
        }, 300);
    }
}

async function clearCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
}

document.getElementById('resetall-button').addEventListener('click', resetAll);

