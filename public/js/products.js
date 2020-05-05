var app1 = new Vue({
    el: '#app1',
    data: {
      products: [],
    },
    mounted() {
      const ref = firebase.firestore().collection('products').orderBy('name', 'asc');
      console.log("check product in mounted");
      ref.onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          products.push({...doc.data(), id: doc.id});
        });
        console.log(products[0].amount);
        this.products = products;
      });
    }
  });