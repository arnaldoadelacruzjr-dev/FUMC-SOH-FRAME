import { auth, db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const ADMIN_EMAIL =
"fumcsoh@admin.com";

const framesContainer =
document.getElementById("frames");

const logoutBtn =
document.getElementById("logoutBtn");

/* AUTH CHECK */

onAuthStateChanged(
auth,
(user)=>{

    if(!user){

        window.location.href =
        "login.html";

        return;

    }

    if(
        user.email !==
        ADMIN_EMAIL
    ){

        alert(
        "Access Denied"
        );

        signOut(auth);

        return;

    }

    loadFrames();

});

/* LOGOUT */

logoutBtn.addEventListener(
"click",
async ()=>{

    await signOut(auth);

    window.location.href =
    "login.html";

});

/* LOAD FRAMES */

async function loadFrames(){

try{

    const querySnapshot =
    await getDocs(
        collection(
            db,
            "frames"
        )
    );

    if(
        querySnapshot.empty
    ){

        framesContainer.innerHTML =

        `
        <div class="empty">
            No Frames Found
        </div>
        `;

        return;

    }

    let html =
    `<div class="frames-grid">`;

    querySnapshot.forEach(
    (frameDoc)=>{

        const data =
        frameDoc.data() || {};

        const image =
        data.image || "";

        const title =
        data.title || "Untitled Frame";

        const frameLink =
        `${window.location.origin}/frame.html?id=${frameDoc.id}`;

        html +=

        `
        <div class="frame-card">

            <img
            class="frame-image"
            src="${image}"
            onerror="
            this.src='https://via.placeholder.com/500x500?text=Frame'
            ">

            <div class="frame-content">

                <div class="frame-title">

                    ${title}

                </div>

                <div class="frame-buttons">

                    <button
                    class="view-btn"
                    onclick="
                    location.href=
                    'view.html?id=${frameDoc.id}'
                    ">
                    View
                    </button>

                    <button
                    class="copy-btn"
                    onclick="
                    copyLink(
                    '${frameLink}'
                    )
                    ">
                    Copy
                    </button>

                    <button
                    class="edit-btn"
                    onclick="
                    location.href=
                    'newframe.html?id=${frameDoc.id}'
                    ">
                    Edit
                    </button>

                    <button
                    class="delete-btn"
                    onclick="
                    deleteFrame(
                    '${frameDoc.id}'
                    )
                    ">
                    Delete
                    </button>

                </div>

            </div>

        </div>
        `;

    });

    html +=
    `</div>`;

    framesContainer.innerHTML =
    html;

}

catch(error){

    console.error(error);

    framesContainer.innerHTML =

    `
    <div class="empty">
        Error Loading Frames
        <br><br>
        ${error.message}
    </div>
    `;

}

}

/* COPY LINK */

window.copyLink =
function(link){

navigator.clipboard
.writeText(link)
.then(()=>{

alert(
"Link Copied!"
);

});

};

/* DELETE */

window.deleteFrame =
async function(frameId){

const confirmDelete =
confirm(
"Delete this frame?"
);

if(
!confirmDelete
) return;

try{

await deleteDoc(
doc(
db,
"frames",
frameId
)
);

alert(
"Frame Deleted!"
);

loadFrames();

}

catch(error){

alert(
error.message
);

}

};
