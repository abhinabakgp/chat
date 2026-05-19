import {
auth,
db
}
from './firebase-config.js';

import {
onAuthStateChanged,
signOut
}
from
'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

import {
collection,
query,
onSnapshot,
addDoc,
orderBy
}
from
'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';


const usersDiv=
document.getElementById("users");

const chatBox=
document.getElementById("chatBox");

const messageInput=
document.getElementById("messageInput");

const sendBtn=
document.getElementById("sendBtn");

const username=
document.getElementById("username");

const profilePic=
document.getElementById("profilePic");

const logoutBtn=
document.getElementById("logoutBtn");


let me=null;
let selectedUser=null;



// onAuthStateChanged(
// auth,
// (user)=>{

// if(!user){

// window.location="index.html";
// return;

// }

// me=user;

// username.innerText=
// user.displayName;

// profilePic.src=
// user.photoURL;

// loadUsers();

// });



onAuthStateChanged(auth,(user)=>{

if(!user){

window.location="index.html";
return;

}

me=user;

username.innerText=
user.displayName ||
user.email.split("@")[0];

profilePic.src=
user.photoURL ||
"https://ui-avatars.com/api/"+username.innerText;

loadUsers();

});






logoutBtn.onclick=
()=>{

signOut(auth);

}



async function loadUsers(){

const q=
query(
collection(
db,
'users'
)
);


onSnapshot(
q,

(snapshot)=>{


usersDiv.innerHTML='';


snapshot.forEach(
(doc)=>{

const u= doc.data();


if(
u.uid!==me.uid
&&
u.online===true
){

const div=
document.createElement(
'div'
);

div.className='user';


if(
selectedUser &&
selectedUser.uid===u.uid
){

div.style.background=
'#2e2525';

}


div.innerHTML=
`

<img
src="${u.photo}"
style="
width:45px;
height:45px;
border-radius:20%;
margin-right:10px;
">

${u.name}

`;

div.onclick=()=>{


selectedUser=u;

document.getElementById("sendBox").style.visibility = 'visible';
document.getElementById("chatHeader").style.visibility = 'visible';
try {
    document.getElementById("welcomePage").remove();
}
catch(error){};

document
.querySelectorAll(
'.user'
)
.forEach(
x=>x.style.background=''
);

div.style.background = '#293458';

loadMessages();

};


usersDiv.appendChild(div);

}
});
});

}



sendBtn.onclick=
async()=>{

if(
selectedUser===null
){

alert(
"Select user first"
);

return;

}


let txt=
messageInput.value.trim();

if(
txt==""
)return;


await addDoc(

collection(
db,
'messages'
),

{

sender:
me.uid,

receiver:
selectedUser.uid,

text:txt,

time:
Date.now()

}

);


messageInput.value='';

};

// ............................................................

messageInput.addEventListener(
'keypress',
(e)=>{

if(e.key==="Enter"){

sendBtn.click();

}

});

// ___________________________________________________________________


function loadMessages(){

document.getElementById('chatUserName').innerText = selectedUser.name;

document.getElementById('chatUserPic').src = selectedUser.photo;



const q=
query(

collection(
db,
'messages'
),

orderBy(
'time'
)

);


onSnapshot(

q,

(snapshot)=>{

chatBox.innerHTML='';


snapshot.forEach(
(doc)=>{

const m=
doc.data();


const ok=

(
m.sender===me.uid
&&
m.receiver===selectedUser.uid
)

||

(
m.sender===selectedUser.uid
&&
m.receiver===me.uid
);


if(ok){

const div=
document.createElement(
'div'
);


if(
m.sender===me.uid
){

div.className=
'message sent';

}
else{

div.className=
'message received';

}


div.innerHTML=m.text.replace(
/(https?:\/\/\S+)/g,
'<a href="$1" target="_blank">$1</a>'
);


chatBox.appendChild(
div);

}

});


chatBox.scrollTop=
chatBox.scrollHeight;

});

}



const search=
document.getElementById(
'searchUser'
);

search.addEventListener(
'input',
()=>{

const txt=
search.value
.toLowerCase();

document
.querySelectorAll('.user')
.forEach(u=>{

u.style.display=

u.innerText
.toLowerCase()
.includes(txt)

? 'flex'

: 'none';

});

});
