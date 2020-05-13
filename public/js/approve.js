
var app2 = new Vue({
    el: '#app2',
    data: {
        approvals: []
    },
    mounted() {
      const ref = firebase.firestore().collection('users');
      ref.onSnapshot(snapshot => {
        let approvals = [];
        snapshot.forEach(doc => {
          if(doc.data().url!=="" && doc.data().isStudent===false)
            approvals.push({...doc.data(), id: doc.id});
        });
        this.approvals = approvals;
      });

    }
  });