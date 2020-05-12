const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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
    isStudent:data.isStudent
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
