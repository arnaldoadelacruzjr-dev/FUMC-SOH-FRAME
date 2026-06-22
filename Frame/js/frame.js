import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* FIREBASE */

const firebaseConfig = {

apiKey:
"AIzaSyAUYMbEz5Gj1rTaUv9ZwdrwtecxQMfSbrE",

authDomain:
"fumc-frame-creator.firebaseapp.com",

projectId:
"fumc-frame-creator",

storageBucket:
"fumc-frame-creator.firebasestorage.app",

messagingSenderId:
"581698046289",

appId:
"1:581698046289:web:ed2d98dca9fe7494056b70"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

/* ELEMENTS */

const frameTitle =
document.getElementById(
"frameTitle"
);

const photoInput =
document.getElementById(
"photoInput"
);

const zoomSlider =
document.getElementById(
"zoom"
);

const downloadBtn =
document.getElementById(
"downloadBtn"
);

const canvas =
document.getElementById(
"previewCanvas"
);

const ctx =
canvas.getContext(
"2d"
);

/* URL PARAM */

const params =
new URLSearchParams(
window.location.search
);

const frameId =
params.get(
"id"
);

/* DATA */

let frameImage =
new Image();

let userImage =
null;

let scale = 1;

let posX = 0;
let posY = 0;

let dragging =
false;

let startX = 0;
let startY = 0;

/* LOAD FRAME */

async function loadFrame(){

try{

const snap =
await getDoc(
doc(
db,
"frames",
frameId
)
);

if(
!snap.exists()
){

frameTitle.innerHTML =
"Frame Not Found";

return;

}

const data =
snap.data();

frameTitle.innerHTML =
data.title;

frameImage =
new Image();

frameImage.crossOrigin =
"anonymous";

frameImage.onload =
()=>{

canvas.width =
frameImage.width;

canvas.height =
frameImage.height;

drawCanvas();

};

frameImage.src =
data.image;

}

catch(error){

console.error(
error
);

frameTitle.innerHTML =
"Error Loading Frame";

}

}

loadFrame();

/* UPLOAD PHOTO */

photoInput.addEventListener(
"change",
(event)=>{

const file =
event.target.files[0];

if(!file)
return;

userImage =
new Image();

userImage.onload =
()=>{

posX = 0;
posY = 0;
scale = 1;

zoomSlider.value =
1;

drawCanvas();

};

userImage.src =
URL.createObjectURL(
file
);

}
);

/* DRAW */

function drawCanvas(){

if(
!frameImage.width
)
return;

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

if(userImage){

const baseWidth =
canvas.width;

const baseHeight =
(userImage.height /
userImage.width)
*
baseWidth;

ctx.save();

ctx.translate(
(canvas.width / 2) + posX,
(canvas.height / 2) + posY
);

ctx.scale(
scale,
scale
);

ctx.drawImage(
userImage,
-baseWidth / 2,
-baseHeight / 2,
baseWidth,
baseHeight
);

ctx.restore();

}

ctx.drawImage(
frameImage,
0,
0,
canvas.width,
canvas.height
);

}

/* ZOOM */

zoomSlider.addEventListener(
"input",
()=>{

scale =
parseFloat(
zoomSlider.value
);

drawCanvas();

}
);

/* DRAG */

canvas.addEventListener(
"pointerdown",
(event)=>{

dragging = true;

startX =
event.clientX -
posX;

startY =
event.clientY -
posY;

}
);

window.addEventListener(
"pointermove",
(event)=>{

if(
!dragging
)
return;

posX =
event.clientX -
startX;

posY =
event.clientY -
startY;

drawCanvas();

}
);

window.addEventListener(
"pointerup",
()=>{

dragging =
false;

}
);

/* DOWNLOAD */

downloadBtn.addEventListener(
"click",
()=>{

if(
!userImage
){

alert(
"Upload a photo first."
);

return;

}

const link =
document.createElement(
"a"
);

link.download =
"fumc-frame.png";

link.href =
canvas.toDataURL(
"image/png"
);

link.click();

}
);