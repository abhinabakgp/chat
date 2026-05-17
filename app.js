import { auth, db } from './firebase-config.js';

import {
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged
}
from
'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';


import {
doc,
setDoc
}
from
'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';


const googleLogin=
document.getElementById(
'googleLogin'
);


const provider=
new GoogleAuthProvider();



onAuthStateChanged(
auth,

async(user)=>{

if(user){

console.log(
"Logged in:",
user.displayName
);


await setDoc(

doc(
db,
'users',
user.uid
),

{

uid:
user.uid,

name:
user.displayName,

photo:
user.photoURL,

email:
user.email,

online:true,

time:
Date.now()

}

);


console.log(
"User stored"
);


window.location=
'chat.html';

}

});




googleLogin.onclick=
async()=>{

try{

await signInWithPopup(
auth,
provider
);

}
catch(e){

console.log(e);

}

}