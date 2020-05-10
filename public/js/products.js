
var app1 = new Vue({
    el: '#app1',
    data: {
      products: []
    },
    
    methods: {
      sortBy() {
        var choice = document.getElementById("sort");
        var result = choice.options[choice.selectedIndex].value; 
        console.log(result);
        const ref = firebase.firestore().collection('products').orderBy(result, 'asc');
      ref.onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          products.push({...doc.data(), id: doc.id});
          console.log(doc.data().category);
        });
        this.products = products;
      });
    },
    filterBy() {
      var choice = document.getElementById("filter");
      var filterText = document.getElementById("filterText").value;
      var result = choice.options[choice.selectedIndex].value; 
    //  console.log("Result is " +result +" filterText is "+ filterText.value);
      const ref = firebase.firestore().collection('products').orderBy(result, 'asc');
    ref.onSnapshot(snapshot => {
      let products = [];
      snapshot.forEach(doc => {
        if((result=="category" && doc.data().category==filterText) ||(result=="name" && doc.data().name ==filterText)|| (result=="manufacturer" && filterText==doc.data().manufacturer) || (result == "price" && Number(filterText) > Number(doc.data().price))){
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
      const ref = firebase.firestore().collection('products').orderBy('name', 'asc');
      ref.onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          products.push({...doc.data(), id: doc.id});
        });
        this.products = products;
      });
    }
  });