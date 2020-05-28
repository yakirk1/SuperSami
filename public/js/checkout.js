
var app3 = new Vue({
    el: '#app3',
    data: {
        products:[]
    },
    methods:{
      init(){
        firebase.auth().onAuthStateChanged(user => {
          if(user){
            user.getIdTokenResult().then(getIdTokenResult => {
              user.admin= getIdTokenResult.claims.admin;
              if(typeof (user.admin)=='undefined'){
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
        this.products=prods;      }
const ref2 = firebase.firestore().collection('users');
ref2.onSnapshot(snapshot => {
  var status;
  let myuser = [];
snapshot.forEach(doc => {
  if(doc.id==user.uid)
  myuser.push({...doc.data(), id: doc.id});
});
if(myuser.length!=0){
status = myuser[0].isStudent;

var totalPrice=0;
var i=0;
const ref = firebase.firestore().collection('products');
ref.onSnapshot(snapshot => {
for(i=0 ; i< this.products.length;i++){
    snapshot.forEach(doc => {
      if(doc.data().name==(this.products[i]).Name){
        if(status){
          totalPrice=(totalPrice+(Number(doc.data().price)*0.9 *Number(this.products[i].Amount)));

        }
        else{
          totalPrice=totalPrice+(Number(doc.data().price) *Number(this.products[i].Amount));
        }                      
      }
      });
      document.querySelector('.totalPrice').textContent=totalPrice;
    }
    });   
  } 
  })
  })
}
})}})

      }
    },
    mounted() {  
      this.init();
    }

  })