
var app5 = new Vue({
    el: '#app5',
    data: {
      products: []
    },
    
    methods: {
      sortBy() {
        var choice = document.getElementById("sort");
        var result = choice.options[choice.selectedIndex].value; 
        const ref = firebase.firestore().collection('products').orderBy(result, 'asc');
      ref.onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          if(doc.data().amount>0)
          products.push({...doc.data(), id: doc.id});
        });
        this.products = products;
      });
    },
    filterBy() {
      var choice = document.getElementById("filter");
      var filterText = document.getElementById("filterText").value;
      var result = choice.options[choice.selectedIndex].value; 
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
      const ref = firebase.firestore().collection('products').orderBy('name', 'asc');
      ref.onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          if(doc.data().amount>0)
          products.push({...doc.data(), id: doc.id});
        });
        this.products = products;
      });
    }
  });