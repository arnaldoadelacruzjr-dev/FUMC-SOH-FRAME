import { auth, db } from "./firebase-config.js";

import {
doc,
getDoc,
deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const ADMIN_EMAIL =
"fumcsoh@admin.com";

const preview =
document.getElementById("preview");

const frameTitle =
document.getElementById("frameTitle");

const frameLink =
document.getElementById("frameLink");

const copyBtn =
document.getElementById("copyBtn");

const openBtn =
document.getElementById("openBtn");

const editBtn =
document.getElementById("editBtn");

const deleteBtn =
document.getElementById("deleteBtn");

const params =
new URLSearchParams(
window.location.search
);

const frameId =
params.get("id");

let publicLink = "";

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

window.location.href =
"login.html";

return;

}

loadFrame();

}
);

/* LOAD FRAME */

async function loadFrame(){

try{

const frameRef =
doc(
db,
"frames",
frameId
);

const frameSnap =
await getDoc(
frameRef
);

if(
!frameSnap.exists()
){

alert(
"Frame Not Found"
);

window.location.href =
"dashboard.html";

return;

}

const data =
frameSnap.data();

frameTitle.innerHTML =
data.title;

preview.src =
data.image;

/* PUBLIC LINK */

publicLink =
`${window.location.origin}/FUMC-SOH-FRAME/Frame/frame.html?id=${frameId}`;

frameLink.value =
publicLink;

}

catch(error){

alert(
error.message
);

}

}

/* COPY LINK */

copyBtn.addEventListener(
"click",
()=>{

navigator.clipboard
.writeText(
publicLink
)
.then(()=>{

alert(
"Link Copied!"
);

});

});

/* OPEN FRAME */

openBtn.addEventListener(
"click",
()=>{

window.open(
publicLink,
"_blank"
);

});

/* EDIT */

editBtn.addEventListener(
"click",
()=>{

window.location.href =
`newframe.html?id=${frameId}`;

});

/* DELETE */

deleteBtn.addEventListener(
"click",
async ()=>{

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

window.location.href =
"dashboard.html";

}

catch(error){

alert(
error.message
);

}

});
