const firebaseConfig = {
  apiKey: "AIzaSyCCODva5jiR0t4E28rtk1zmoXsY59BsAMw",
  authDomain: "supersami-76ae9.firebaseapp.com",
  databaseURL: "https://supersami-76ae9.firebaseio.com",
  projectId: "supersami-76ae9",
  storageBucket: "supersami-76ae9.appspot.com",
  messagingSenderId: "227496892156",
  appId: "1:227496892156:web:ac3465e56eea4d0b392979",
  measurementId: "G-44L8XEJG2Y"
};
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);
admin.initializeApp();
var db= firebase.firestore();


exports.addAdminRole= functions.https.onCall((data,context)=>{
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid,{
      admin: true
    });
}).then(() => {
  return {
    message :`Sucess, ${data.email} is an admin`
  }
}).catch(err =>{
    return err;
});
});


exports.getStudentStatus = functions.https.onCall((data,context)=>{
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid,{
      admin: true
    });
}).then(() => {
  return {
    message :`Sucess, ${data.email} is an admin`
  }
}).catch(err =>{
    return err;
});
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(user => {
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
});

exports.emptyCart = functions.https.onCall((data,context)=>{
  return db.collection('carts').doc(data.uid).delete();

})

//add new product
exports.addProduct = functions.https.onCall((data, context) => {
  console.log("in addProduct cloud function");
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can add products'
    );
  }
  if (data.name.length > 10) {
      throw new functions.https.HttpsError(
      'invalid-argument', 
      'product name must be no more than 10 characters long'
    );
  }
  return admin.firestore().collection('products').add({
    name: data.name,
    manufacturer: data.manufacturer,
    amount: data.amount,
    price: data.price,
    kashrut: data.kashrut,
    category: data.category,
    expiryDate: data.expiryDate,
    url: data.url
}).then(() => {
    return 'new product added';
}).catch(() => {
    throw new functions.https.HttpsError(
        'internal',
        'product not added'
    );
});
});

/*
//add new product
exports.addToCart = functions.https.onCall((data, context) => {
  console.log(data.uid);
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can add products to cart'
    );
  }
  const ref = firebase.firestore().collection('carts');
  ref.onSnapshot(snapshot => {
    let carts = [];
    console.log(data.uid);
    snapshot.forEach(doc => {
      if(doc.data().uid===data.uid)
      carts.push({...doc.data(), id:doc.id});
    });
    console.log(carts);
    return admin.firestore().collection('carts').add({
      name: data.name,
      manufacturer: data.manufacturer,
      amount: data.amount,
      price: data.price,
      kashrut: data.kashrut,
      category: data.category,
      expiryDate: data.expiryDate
  }).then(() => {
      return 'new product added';
  }).catch(() => {
      throw new functions.https.HttpsError(
          'internal',
          'product not added'
      );
  });
  });
*/
exports.ourNewUserSignUp = functions.https.onCall((data, context) => {
  console.log(data.user);
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
          );
  }
  return admin.firestore().collection('users').doc(data.user).set({
    email: data.email,
    password: data.password,
    isStudent:data.isStudent,
    url:data.url
  }).then(() => {
    return 'user added';
}).catch(() => {
    throw new functions.https.HttpsError(
        'internal',
        'user not added'
    );
});
});

// // upvote callable function
/*
exports.upvote = functions.https.onCall(async (data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can vote up requests'
    );
  }
  // get refs for user doc & request doc
  const user = admin.firestore().collection('users').doc(context.auth.uid);
  const request = admin.firestore().collection('requests').doc(data.id);
  const doc = await user.get();
  // check thew user hasn't already upvoted
  if(doc.data().upvotedOn.includes(data.id)){
    throw new functions.https.HttpsError(
      'failed-precondition', 
      'You can only vote something up once'
    );
  }

  // update the array in user document
  await user.update({
    upvotedOn: [...doc.data().upvotedOn, data.id]
  });

  // update the votes on the request
  return request.update({
    upvotes: admin.firestore.FieldValue.increment(1)
  });

});
*/

// firestore trigger for tracking activity
exports.logActivities = functions.firestore.document('/{collection}/{id}')
  .onCreate((snap, context) => {
    console.log(snap.data());

    const activities = admin.firestore().collection('activities');
    const collection = context.params.collection;
    if (collection === 'users') {
      return activities.add({ text: 'a new user signed up'});
    }
    if (collection === 'products') {
      return activities.add({ text: 'a new product was added'});
    }
    return null;
});


exports.setStudentApproval = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  
  const userProfile =  await admin.auth().getUserByEmail(data.email);
  try {
  const result =await  admin.firestore().collection('users').doc(userProfile.uid).update({isStudent:true});
    return "updated";
  } catch(e){
    throw e
  }
});

/*
exports.setStudentDisapproval = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  
  const userProfile =  await admin.auth().getUserByEmail(data.email);
  try {
  const result =await  admin.firestore().collection('users').doc(userProfile.uid).update({url:""});
    return "updated";
  } catch(e){
    throw e
  }
});
/*
exports.addToCart = functions.https.onCall((data) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
          );
  }
  let myCurrentCart = firestore().collection('carts').doc(data.uid).mycart;
  console.log(myCurrentCart);
  return admin.firestore().collection('carts').doc(data.uid).add({
    check: data.check
  }).then(() => {
    return 'cart added';
}).catch(() => {
    throw new functions.https.HttpsError(
        'internal',
        'cart not added'
    );
});
});
*/

exports.addToCart = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  try {
    const result =await  admin.firestore().collection('carts').doc(data.uid).update({mycart:data.mycart});
      return "updated";
    } catch(e){
      throw e
    }
  });
  
  exports.addNewCart = functions.https.onCall((data,context) =>{

    return admin.firestore().collection('carts').doc(data.uid).set({
      mycart:data.mycart
    }).then(() => {
      return 'new cart added';
  }).catch(() => {
      throw new functions.https.HttpsError(
          'cart not added'
      );
  });
  });


  exports.addTransaction = functions.https.onCall((data,context)=>{
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can add products'
    );
  }
  return admin.firestore().collection('transactions').add({
    mycart:data.mycart,
    firstname:data.firstname ,
    lastname: data.lastname,
    address: data.address,
    email: data.email,
    cardtype:data.cardtype ,
    ownerid: data.ownerid,
    ownername: data.ownername,
    cardnumber:data.cardnumber,
    cvc: data.cvc,
    expirydate: data.expirydate,
    delivered:false,
    totalPrice:data.totalPrice
}).then(() => {
    return 'new transaction added';
}).catch(() => {
    throw new functions.https.HttpsError(
        'transaction not added'
    );
});
});


exports.updateStock = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  try {
  const result =await  admin.firestore().collection('products').doc(data.id).update({amount:data.amount});
    return "updated";
  } catch(e){
    throw e
  }
});