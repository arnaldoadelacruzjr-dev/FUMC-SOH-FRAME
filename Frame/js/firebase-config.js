import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAUYMbEz5Gj1rTaUv9ZwdrwtecxQMfSbrE",
    authDomain: "fumc-frame-creator.firebaseapp.com",
    projectId: "fumc-frame-creator",
    storageBucket: "fumc-frame-creator.firebasestorage.app",
    messagingSenderId: "581698046289",
    appId: "1:581698046289:web:ed2d98dca9fe7494056b70"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };