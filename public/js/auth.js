const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');
const adminElements = document.querySelectorAll('.admin');
const userElements = document.querySelectorAll('.user');
const accountInfoLink = document.querySelector('.modal-account');
const InfoLink =document.querySelector('.account-info');
const checkBox = document.getElementById("checkbox");
const url=document.getElementById("student_pic_url");
const textInsert=document.getElementById("urlTextInsert");


checkBox.addEventListener('change', function() {
  if(this.checked) {
      url.style.display ='block';
      textInsert.style.display ='block';
  } else {
    url.style.display ='none';
    textInsert.style.display ='none';
  }
});

 function isEmailValid(email){
   email+="";
  index=email.indexOf("@");
	var check=email.substring(index+1,email.length);
  var re=/^[a-zA-Z0-9]+[@]/;
  if (re.test(email)===false || (check!=="gmail.com"&& check!=="hotmail.com"&&check!=="ymail.com")) {
    throw "email or password are invalid";
  }
  return true;
}
function isPassValid(password){
  var count=0;
  var re=/^[a-z0-9]+$/i;
	for(var i=0;i<password.length;i++){
		if(!isNaN(Number(password[i])))
			count++;
	}
  if ((password.length<7 || password.length>12)||re.test(password)===false||count===0)
  {
    throw "email or password are invalid"
  }
  return true;
}
/*
function setAdmins(){
  console.log("in setAdmin");
  const addAdminRole = firebase.functions().httpsCallable('addAdminRole');
  addAdminRole({email:"almog@gmail.com"}).then(result =>{
    console.log(result);
  });
  addAdminRole({email:"shani@gmail.com"}).then(result =>{
    console.log(result);
  });
  addAdminRole({email:"yakir@gmail.com"}).then(result =>{
    console.log(result);
  });
  addAdminRole({email:"shirel@gmail.com"}).then(result =>{
    console.log(result);
  });
}
*/
authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
    loginForm.querySelector('.error').textContent="";
    registerForm.querySelector('.error').textContent = "";
    registerForm.reset();
    loginForm.reset();

  });
});

// register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  try{
  if(isEmailValid(email) == true && isPassValid(password)==true){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(user => {
      const ourNewUserSignUp= firebase.functions().httpsCallable('ourNewUserSignUp');
      ourNewUserSignUp({
        user:user.user.uid,
        email:email,
        password:password,
        isStudent:false,
        url:url.value
      })
      .then(() =>{
        console.log('registered', user);
        console.log(url.value)
        if(url.value!="")
        {
          alert("You've signed up as a student! You must wait for admin approval before having discounted prices.");
        }
        registerForm.reset();
        registerForm.querySelector('.error').textContent ="";
      });
    })
    .catch(error => {
      registerForm.querySelector('.error').textContent = error.message;
    });
  }
} catch(error){
  registerForm.querySelector('.error').textContent = error;
}})

// login form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  //setAdmins();
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      console.log('logged in', user);

      admin.auth().getUser(uid).then((userRecord) => {
        // The claims can be accessed on the user record.
      });
      loginForm.reset();
    })
    .catch(error => {
      loginForm.querySelector('.error').textContent = error.message;
    });
});

// sign out
signOut.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => console.log('signed out'));
});

// auth listener
firebase.auth().onAuthStateChanged(user => {
  const getStudentStatus = firebase.functions().httpsCallable('getStudentStatus');
  if (user) {
    //console.log(status);
    //var myStatus=2;
    //var myUser={user:user};
    //getStudentStatus(myUser).then(val =>{
      //console.log("???");
     // myStatus=val;
    //console.log(myStatus);
    user.getIdTokenResult().then(getIdTokenResult => {
      user.admin= getIdTokenResult.claims.admin;
      if(user.admin){
        InfoLink.innerHTML = 'Admin';
        adminElements.forEach(item => item.style.display ='block');
        userElements.forEach(item => item.style.display ='none');

      }
      else{
        var status;
    var ref = firebase.firestore().collection('users');
    ref.onSnapshot(snapshot => {
      let myuser = [];
      snapshot.forEach(doc => {
        if(doc.id==user.uid)
        myuser.push({...doc.data(), id: doc.id});
      });
      if(myuser.length!=0){
      status = myuser[0].isStudent;
        if(status){
        const html= `
        <div>Student</div>
        `;
          InfoLink.textContent ='Student';

        }
        else {
          //var check=firebase.auth().currentUser;
          //console.log(myStatus, 'check if works');
          InfoLink.innerHTML="Regular user";
        }
        //accountInfoLink.classList.style.display ='none';
        //accountInfoLink.innerHTML =""
        adminElements.forEach(item => item.style.display ='none');
        userElements.forEach(item => item.style.display ='block');
      }

        // console.log(status);

    });
  }
    authWrapper.classList.remove('open');
    
    authModals.forEach(modal => modal.classList.remove('active'));
    })
  } else {
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
  }

});

//InfoLink.addEventListener('click', () => {
  //accountInfoLink.classList.style.display ='block';
//});
