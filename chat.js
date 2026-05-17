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



onAuthStateChanged(
auth,
(user)=>{

if(!user){

window.location="index.html";
return;

}

me=user;

username.innerText=
user.displayName;

profilePic.src=
user.photoURL;


console.log(
"My UID:",
user.uid
);

loadUsers();

});



logoutBtn.onclick=
()=>{

signOut(auth);

}



function loadUsers(){

const q=query(
collection(
db,
'users'
)
);


onSnapshot(
q,

(snapshot)=>{

usersDiv.innerHTML='';


console.log(
"TOTAL USERS:",
snapshot.size
);


snapshot.forEach(
(doc)=>{

const u=
doc.data();


console.log(
"USER:",
u.name,
u.uid
);


if(
u.uid!==me.uid
){

let div=
document.createElement(
'div'
);

div.className=
'user';

div.innerHTML=
`
<img
src="${u.photo}"
style="
width:35px;
height:35px;
height:35px;
border-radius:50%;
margin-right:10px;
vertical-align:middle;
">

${u.name}
`;


div.onclick=
()=>{

selectedUser=u;

console.log(
"Selected:",
u.name
);

document
.querySelectorAll(
'.user'
)
.forEach(
x=>x.style.background=''
);

div.style.background=
'#ccc';


chatBox.innerHTML='';

loadMessages();

};


usersDiv.appendChild(
div);

}

});

});

}



sendBtn.onclick=
async()=>{


console.log(
selectedUser
);


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



function loadMessages(){


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


if(

(m.sender===me.uid &&
m.receiver===selectedUser.uid)

||

(m.sender===selectedUser.uid &&
m.receiver===me.uid)

){

let div=
document.createElement(
'div'
);

div.className=
'message';

div.innerHTML=
m.sender===me.uid

?

"<b>You:</b> "
+m.text

:

"<b>"
+
selectedUser.name
+
":</b> "
+
m.text;


chatBox.appendChild(
div);

}

});


chatBox.scrollTop=
chatBox.scrollHeight;

});

}