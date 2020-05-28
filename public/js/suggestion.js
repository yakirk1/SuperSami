
var app7 = new Vue({
    el: '#app7',
    data: {
      suggestions: [],
      potentialSuggestions: {}
    },
    methods: {
        SearchSimilarity(prodName,email){
            var ref = firebase.firestore().collection('transactions');
            ref.onSnapshot(snapshot => {
                let products = [];
                let cart =[];
                snapshot.forEach(doc => {
                    cart=doc.data().mycart;
                    if(doc.data().email!=email){
                    for(var key in cart){
                        if(key==prodName){
                            for(var key2 in cart){
                                if(key2 in this.potentialSuggestions){
                                    this.potentialSuggestions[key2]= Number(this.potentialSuggestions[key2])+ Number(cart[key2]);
                                
                                }
                                else{
                                    this.potentialSuggestions[key2]= Number(cart[key2]);
                                }
                            }
                        }
                    }
                    /*
                  if(doc.data().name==prodName&& doc.data().amount>0){

                  if(prodName in potentialSuggestions)
                  potentialSuggestions[key]= potentialSuggestions[prodName]+ doc.data().mycart[key];
                  else{
                    requirement[key]= doc.data().mycart[key];
                  }}
                  */
                }
            }
                                
                );
                console.log(this.potentialSuggestions,"potential");

            })
        },
        finalizeSuggestions(mycart,status){
            var ref = firebase.firestore().collection('products');
            ref.onSnapshot(snapshot => {
            for(var key in this.potentialSuggestions){
                snapshot.forEach(doc => {
                    if(doc.data().name==key&&doc.data().amount<=0){
                        delete this.potentialSuggestions[key];
                    }
                })
            }
            this.deleteSameProduct(mycart,status);
    })
    },
        deleteSameProduct(mycart,status){
            for(var key in mycart){
               for(var key2 in this.potentialSuggestions){
                   if(key==key2){
                    delete this.potentialSuggestions[key];
                   }
               } 
            }
            console.log(this.potentialSuggestions,"after deleting");
            this.updateKeys(status);
        },
        updateKeys(status){
            var keys = [];
            for(var key in this.potentialSuggestions) { keys.push(key) }
            keys.sort(function(a, b) {
              return keys[b] - keys[a];
            })
            console.log(keys,"check keys")
            const refs = firebase.firestore().collection('products').orderBy('name', 'asc');

            refs.onSnapshot(snapshot => {
              let suggestions = [];
              var i=0;
              snapshot.forEach(doc => {
                for(i=0;i<3;i++){
                if(doc.data().amount>0 && doc.data().name==keys[i]){
                suggestions[i]={...doc.data(),id:doc.id};
                if(status==true){
                    suggestions[i].price=suggestions[i].price*0.9;
                  }
              }
            }
            
          });
          console.log("??");
          this.suggestions = suggestions;
            });
        }
    },
    mounted() {
        this.$nextTick(function () {
        this.potentialSuggestions={};
        firebase.auth().onAuthStateChanged(user => {
            var status;
            var mycart=[];
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
            const doc = firebase.firestore().collection('carts');
            doc.onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                  if(doc.id==user.uid)
                  mycart.push({...doc.data(), id: doc.id});
                });
                if(typeof mycart[0] !="undefined"){
                console.log(mycart[0].mycart,"mycart");
                for(var key in mycart[0].mycart){
                    console.log("before search");
                    this.SearchSimilarity(key,user.email);
                }
                console.log(this.potentialSuggestions,"122");
                this.finalizeSuggestions(mycart[0].mycart,status);

                console.log(this.potentialSuggestions,"in mounted");
                /*
                const ref = firebase.firestore().collection('products').orderBy('name', 'asc');
                var i=0;
                ref.onSnapshot(snapshot => {
                  let suggestions = [];
                  snapshot.forEach(doc => {
                    if(doc.data().amount>0&&i<3)
                    suggestions.push({...doc.data(), id: doc.id});
                    i++;
                  });
                  this.suggestions = suggestions;
                });

                */
            
            if(mycart[0].mycart==0||Object.keys(this.potentialSuggestions).length<3){
                
            }

            }
            })
        
        }
    })}})  
    })
    }
  });