import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginBtn =
document.getElementById("loginBtn");

const status =
document.getElementById("status");

loginBtn.addEventListener(
"click",
async ()=>{

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    if(!email || !password){

        status.innerHTML =
        "Please enter email and password";

        return;

    }

    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href =
        "dashboard.html";

    }

    catch(error){

        status.innerHTML =
        error.message;

    }

});