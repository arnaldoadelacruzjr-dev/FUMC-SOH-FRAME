import { auth, db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* CONFIG */

const ADMIN_EMAIL =
"fumcsoh@admin.com";

const CLOUD_NAME =
"dgpdrr83v";

const UPLOAD_PRESET =
"frame_upload";

/* ELEMENTS */

const title =
document.getElementById("title");

const frameFile =
document.getElementById("frameFile");

const preview =
document.getElementById("preview");

const saveBtn =
document.getElementById("saveBtn");

const status =
document.getElementById("status");

/* URL PARAMS */

const params =
new URLSearchParams(
window.location.search
);

const frameId =
params.get("id");

/* DATA */

let imageUrl = "";

/* AUTH */

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

        window.location.href =
        "login.html";

        return;

    }

    if(frameId){

        loadFrame();

    }

});

/* PREVIEW */

frameFile.addEventListener(
"change",
()=>{

    const file =
    frameFile.files[0];

    if(!file) return;

    preview.src =
    URL.createObjectURL(file);

    preview.style.display =
    "block";

});

/* CLOUDINARY UPLOAD */

async function uploadToCloudinary(file){

    const formData =
    new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    const response =
    await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method:"POST",
            body:formData
        }
    );

    const data =
    await response.json();

    return data.secure_url;

}

/* SAVE */

saveBtn.addEventListener(
"click",
async ()=>{

    try{

        if(
            !title.value
        ){

            alert(
            "Enter frame title"
            );

            return;

        }

        saveBtn.disabled =
        true;

        saveBtn.innerHTML =
        "Uploading...";

        if(
            frameFile.files.length
        ){

            imageUrl =
            await uploadToCloudinary(
                frameFile.files[0]
            );

        }

        if(
            !imageUrl
        ){

            alert(
            "Please upload a frame image"
            );

            saveBtn.disabled =
            false;

            saveBtn.innerHTML =
            "Save Frame";

            return;

        }

        if(frameId){

            await updateDoc(
                doc(
                    db,
                    "frames",
                    frameId
                ),
                {
                    title:
                    title.value,

                    image:
                    imageUrl
                }
            );

            status.innerHTML =
            "✅ Frame Updated";

        }

        else{

            await addDoc(
                collection(
                    db,
                    "frames"
                ),
                {
                    title:
                    title.value,

                    image:
                    imageUrl,

                    owner:
                    auth.currentUser.uid,

                    createdAt:
                    new Date()
                }
            );

            status.innerHTML =
            "✅ Frame Saved";

        }

        setTimeout(()=>{

            window.location.href =
            "dashboard.html";

        },1000);

    }

    catch(error){

        console.error(error);

        status.innerHTML =
        error.message;

        saveBtn.disabled =
        false;

        saveBtn.innerHTML =
        "Save Frame";

    }

});

/* EDIT MODE */

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
        ) return;

        const data =
        frameSnap.data();

        title.value =
        data.title;

        imageUrl =
        data.image;

        preview.src =
        imageUrl;

        preview.style.display =
        "block";

        saveBtn.innerHTML =
        "Update Frame";

    }

    catch(error){

        console.error(error);

    }

}
