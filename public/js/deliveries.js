
var app4 = new Vue({
    el: '#app4',
    data: {
        transactions: []
    },
    mounted() {
        console.log("in deliveries mounted");
      const ref = firebase.firestore().collection('transactions');
      ref.onSnapshot(snapshot => {
        let transactions = [];
        snapshot.forEach(doc => {
          if(doc.data().delivered==false)
            transactions.push({...doc.data(), id: doc.id});
        });
        this.transactions = transactions;
      });

    }
  });