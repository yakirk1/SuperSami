
var app6 = new Vue({
    el: '#app6',
    data: {
        transactions: []
    },
     
    methods: {
      filterBy() {
        var choice = document.getElementById("transactionsFilter");
        var filterText = document.getElementById("transactionsFilterText").value;
        var result = choice.options[choice.selectedIndex].value; 
      //  console.log("Result is " +result +" filterText is "+ filterText.value);
        const ref = firebase.firestore().collection('products').orderBy(result, 'asc');
      ref.onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          if((result=="category" && doc.data().category==filterText) ||(result=="name" && doc.data().name ==filterText)|| (result=="manufacturer" && filterText==doc.data().manufacturer) || (result == "price" && Number(filterText) > Number(doc.data().price)))
          {
            if(doc.data().amount>0)
            products.push({...doc.data(), id: doc.id});
          }
        });
        
        this.products = products;
        var displayError= document.querySelector('.errorDisplay');
        if(products.length==0)
          displayError.textContent="No matches.";
          else{
            displayError.textContent="";
          }
      });
    }
      },
    mounted() {
      const ref = firebase.firestore().collection('transactions');
      ref.onSnapshot(snapshot => {
        let transactions = [];
        snapshot.forEach(doc => {
            transactions.push({...doc.data(), id: doc.id});
        });
        this.transactions = transactions;
      });

    }
  });