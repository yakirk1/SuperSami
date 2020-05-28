
var app1 = new Vue({
  el: '#app1',
  data: {
    products: []
  },methods: {
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
     firebase.auth().onAuthStateChanged(user => {
      var status;
      if(user){
     const ref2 = firebase.firestore().collection('users');
      ref2.onSnapshot(snapshot => {
      let myuser = [];
      snapshot.forEach(doc => {
        if(doc.id==user.uid)
        myuser.push({...doc.data(), id: doc.id});
      });
      if(myuser.length!=0){
      status = myuser[0].isStudent;
      var requirement={};
      const ref = firebase.firestore().collection('products');
      const req = firebase.firestore().collection('transactions');

      req.onSnapshot(snapshot => {
      let transactions = [];
      snapshot.forEach(doc => {
        if(doc.data().email==user.email){
          for(var key in doc.data().mycart){
          if(key in requirement)
          requirement[key]= requirement[key]+ doc.data().mycart[key];
          else{
            requirement[key]= doc.data().mycart[key];

          }
        }
        
      }
    });
       ref.onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          if(!(doc.data().name in requirement)){
          requirement[doc.data().name]=0;
        }
        });
        var keys = [];
        for(var key in requirement) { keys.push(key) }
        keys.sort(function(a, b) {
          return keys[b] - keys[a];
        })


        ref.onSnapshot(snapshot => {
          let products = [];
          var i=0;
          snapshot.forEach(doc => {
            for(i=0;i<keys.length;i++){
            if(doc.data().amount>0 && doc.data().name==keys[i]){
            products[i]={...doc.data(),id:doc.id};
            if(status==true){
              products[i].price=products[i].price*0.9;
            }
          }
        }
        
      });
      this.products = products;
        });
      
      });
    
    
      });
      }  
      else{
        const ref = firebase.firestore().collection('products');
        ref.onSnapshot(snapshot => {
          let products = [];
          snapshot.forEach(doc => {
            if(doc.data().amount>0){
            products.push({...doc.data(),id:doc.id});
            
          }
        
      });
      this.products = products;
        });
      }

    })
    
  }
  })
  }
});