
var app3 = new Vue({
    el: '#app3',
    data: {
        products:[]
    },
    methods: {
        getPrice(prodName) {

          const ref = firebase.firestore().collection('products');
        ref.onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            if(doc.data().name==prodName){
                console.log(doc.data().name);
                console.log(prodName);                
            }
            });
          
        });
        return 0;
      }},
    mounted() {
        var totalPrice=0;
        var price;
        const prods = firebase.firestore().collection('products');
        firebase.auth().onAuthStateChanged(user => {
      //const userUID=firebase.auth().currentUser.uid;
      const ref = firebase.firestore().collection('carts');
      ref.onSnapshot(snapshot => {
        let cart = [];
        snapshot.forEach(doc => {
          if(doc.id==user.uid)
            cart.push({...doc.data(), id: doc.id});
        });
        for(var key in cart[0].mycart){
            prods.onSnapshot(snapshot => {
              snapshot.forEach(doc => {
                if(doc.data().name==key){
                    price=doc.data().price;     
                    console.log(price);
                    console.log(key);    
                }
                });
              
            });
            totalPrice = totalPrice + (price* cart[0].mycart[key]);
            console.log(totalPrice);
            console.log(price); 
            this.products.push({Name:key,Amount:cart[0].mycart[key]});

        }
        console.log(totalPrice);
    });
    }
        )}})