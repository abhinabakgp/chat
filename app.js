
import { auth, db } from './firebase-config.js';

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut
}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';


import {
    doc,
    setDoc
}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';



// -------------------- Buttons --------------------

const googleLogin =
document.getElementById('googleLogin');

const signupBtn =
document.getElementById('signupBtn');

const loginBtn =
document.getElementById('loginBtn');

const email =
document.getElementById('email');

const password =
document.getElementById('password');



const provider =
new GoogleAuthProvider();



googleLogin.onclick=async()=>{

try{

const result=
await signInWithPopup(
auth,
provider
);

const user=result.user;

await setDoc(
doc(db,'users',user.uid),
{
uid:user.uid,
name:user.displayName,
photo:user.photoURL,
email:user.email,
online:true,
time:Date.now()
},
{merge:true}
);

window.location='chat.html';

}
catch(e){

console.log(e);

}
}



// -----------------------------------------

const authMessage =
document.getElementById(
"authMessage"
);

function showMessage(
text,
color="#ff8080"
){

authMessage.innerText=
text;

authMessage.style.color=
color;

}



// -------------------- Email Signup --------------------

signupBtn.onclick=
async()=>{

try{

const userCredential=

await createUserWithEmailAndPassword(

auth,
email.value,
password.value

);


await sendEmailVerification(
userCredential.user
);


showMessage(
"Verification Email Sent. Check Inbox."
);


await signOut(auth);


}
catch(e){

console.log(e);

showMessage(
(e.message.match(/\(auth\/(.*?)\)/)?.[1] || e.message)
.replace(/-/g," ")
.replace(/\b\w/g,c=>c.toUpperCase())
);
}

}




// -------------------- Email Login --------------------

loginBtn.onclick=
async()=>{

try{

const userCredential=

await signInWithEmailAndPassword(

auth,
email.value,
password.value

);




const user=userCredential.user;

await user.reload();

if(!user.emailVerified){

showMessage(
"Please Verify Email Before Login"
);

await signOut(auth);

return;

}

await setDoc(
doc(db,'users',user.uid),
{
uid:user.uid,
name:user.email.split("@")[0],
photo:"https://ui-avatars.com/api/"+name,
email:user.email,
online:true,
time:Date.now()
},
{merge:true}
);

window.location='chat.html';


}
catch(e){

console.log(e);

showMessage(
(e.message.match(/\(auth\/(.*?)\)/)?.[1] || e.message).replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())
);

}

}


