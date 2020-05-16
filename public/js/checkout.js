
var app3 = new Vue({
    el: '#app3',
    data: {
        products:[]
    },
    methods:{
      init(){
        console.log("in checkout mounted");
        firebase.auth().onAuthStateChanged(user => {
          if(user){
          user.getIdTokenResult().then(getIdTokenResult => {
            user.admin= getIdTokenResult.claims.admin;
            if(user.admin==false){
      const ref = firebase.firestore().collection('carts');
      ref.onSnapshot(snapshot => {
        let cart = [];
        let prods=[];
        snapshot.forEach(doc => {
          if(doc.id==user.uid){
              cart.push({...doc.data(), id: doc.id});
        }});
        if(typeof cart[0] != 'undefined'){
        for(var key in cart[0].mycart){
        prods.push({Name:key,Amount:cart[0].mycart[key]});

        }
        this.products=prods;
        console.log(this.products,"products");
        console.log(prods,"prods");
      }
      /*
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
  */
 var totalPrice=0;
var i=0;
const ref = firebase.firestore().collection('products');
ref.onSnapshot(snapshot => {
for(i=0 ; i< this.products.length;i++){
    snapshot.forEach(doc => {
      if(doc.data().name==(this.products[i]).Name){
          totalPrice=totalPrice+(Number(doc.data().price) *Number(this.products[i].Amount));
                      
      }
      });
      document.querySelector('.totalPrice').textContent=totalPrice;
    }
    });    

  })
}
})}})

      }
    },
    mounted() {  
      this.init();
    }

  })