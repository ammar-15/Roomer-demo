# Roomer v1 🏨

Welcome to **Roomer v1**, an innovative web app designed to revolutionize communication between the front desk and housekeeping departments in hotels. Say goodbye to paper sheets and hello to real-time room updates!

[**Deployment**](https://roomer-demo1.web.app)

## 📢 Introduction

Roomer v1 streamlines communication with the housekeeping department. Front desk staff can enter information about rooms due for check-out, and this information is instantly displayed to housekeeping staff on their phones or office computers.

## 💡 Why I Made It

Working at a hotel, I noticed that during check-out time, we rely on paper sheets to track live information about rooms that check out. A housekeeping supervisor then has to physically come to the desk to take a snapshot of the sheet. This system is inefficient and prone to errors. **Roomer v1** was created to address these issues.

## 🚀 What It Does

With Roomer v1, the front desk can relay live information about rooms during check-out time, eliminating the need for a paper-based system. Key features include:

- Tracking rooms that are checking out and becoming vacant.
- Managing late check-outs.
- Identifying rooms that plan to stay over again.
- Flagging rooms that were no-shows.
- Reporting rooms that require housekeeping assistance.
- **Removing rooms** from the list as needed.
- **Searching rooms** to quickly find specific information.
- **Sorting the order of rooms** based on various criteria.

This app enhances efficiency and productivity while reducing miscommunication errors.

## 🔧 How the App Works

Roomer v1 uses **HTML**, **CSS**, **JavaScript**, and **Firebase Cloud Firestore** to perform Create, Read, Update, and Delete (CRUD) operations on data. Here’s how it works:

1. **Add Room**: Users can add room information through the "Add Room" box or the "Notes" section.
2. **Data Storage**: Information is stored in **Cloud Firestore**, ensuring data persists and synchronizes in real-time across all devices.
3. **Remove Rooms**: Users can remove rooms from the list when they are no longer needed.
4. **Search Rooms**: Users can search for specific rooms to access relevant information quickly.
5. **Sort Rooms**: Users can sort the order of rooms, such as by time, to prioritize tasks efficiently.
6. **Real-Time Updates**: The app dynamically updates the displayed information, making it instantly available to housekeeping staff.

## 💻 Technologies Used

- **HTML**: Utilized elements like divs, lists, hyperlinks, images, navigation bars, containers, inputs, buttons, and attributes like `onclick`, `onkeyup`, `class`, and `id`.
- **CSS**: Implemented margins, padding, flexbox, grid layouts, centering techniques, hover effects, background settings, custom fonts, borders, and styled scrollbars.
- **JavaScript**:
  - Variables (`const`, `let`)
  - Functions and asynchronous programming (`async`/`await`)
  - Loops and conditional statements
  - DOM manipulation
  - Creating, updating, and removing HTML elements
  - Live time/date display
  - Data searching and sorting
- **Cloud Firestore**:
  - Initializing Firebase projects with `initializeApp`
  - Importing and using methods like `getFirestore`, `doc`, `getDoc`, `setDoc`, `deleteDoc`, `collection`, `getDocs`, `addDoc`, `orderBy`
  - Performing CRUD operations on collections and documents
  - Sorting data by time in ascending and descending order
  - Searching for existing data
  - Managing the database using Firebase CLI
- **Firebase Hosting**:
  - Commands like `firebase init` and `firebase deploy` for hosting the app
  - Recognizing the importance of not deploying API keys publicly
  - Understanding that `dotenv` does not work with vanilla JavaScript (requires a React environment alongside Node.js)
  - Adding `node_modules` to `.gitignore`
  - Appreciating Firebase Hosting as a robust alternative to GitHub Pages
- **Git**: Version control using commands like `git pull`, `git add`, `git commit`, `git branch`, `git push`, `git merge`, `git reset`, and handling pull requests.
- **Bootstrap**: Implemented responsive design using breakpoints, lists, and hamburger menus to make the app mobile-ready.

## 📚 What I Learned

Developing Roomer v1 taught me a lot about web development and cloud technologies:

- **HTML**: Structuring web pages effectively using semantic tags and attributes.
- **CSS**: Styling web pages with modern layouts like flexbox and grid to create responsive designs.
- **JavaScript**: Writing efficient, dynamic scripts for DOM manipulation and handling asynchronous operations.
- **Cloud Firestore**:
  - Implementing CRUD operations for data in collections and documents.
  - Sorting data by time in both ascending and descending order.
  - Searching and querying data efficiently.
  - Managing the database through Firebase CLI.
- **Firebase Hosting**:
  - The importance of securely deploying applications and managing API keys.
  - Recognizing that `dotenv` doesn't work with vanilla JavaScript and requires a Node.js environment.
  - Understanding the necessity of adding `node_modules` to `.gitignore`.
  - Appreciating Firebase Hosting as a robust alternative to GitHub Pages.
- **Git**: Mastering version control and collaboration workflows to maintain code integrity.
- **Bootstrap**: Ensuring the application is responsive and user-friendly across various devices, especially phones and tablets.

## 🔮 Future Versions

Exciting features planned for future versions of Roomer include:

- **Multiple User Support**: Implementing different access permissions to accommodate various roles within the hotel staff.
- **Enhanced Features**: Adding more functionalities for housekeepers, room checkers, and supervisors to further streamline operations.

## 🐞 Bugs and Suggestions

If you encounter any bugs, have suggestions for improvements, or want to share some fun tricks, please reach out! Your feedback is invaluable in making **Roomer v1** even better.

Stay tuned for updates! 🚀

---

Thank you for checking out Roomer v1!

Made by Ammar Faruqui
