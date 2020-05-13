const productModal = document.querySelector('.new-product');
const productLink = document.querySelector('.add-product');
//const addToCart = document.querySelector('.add-to-cart');
const productForm = document.querySelector('.new-product form');
const homePage = document.getElementById("homePage");
const home = document.querySelector('.home');
const amount = document.getElementById('.amount');
const checkoutLink = document.querySelector('.checkout');
const checkoutModal = document.querySelector('.checkoutForm');
const checkoutForm = document.querySelector('.checkoutForm form');
const approveLink = document.querySelector('.approve-student');
const approveModal = document.querySelector('.approve-modal');
const approveForm = document.querySelector('.approve-modal form');
const submitApprove = document.getElementById('approve-submit');
var approvalDict ={};

submitApprove.addEventListener('click', (e)=>{
  e.preventDefault();
  console.log("?????????");
  const setStudentApproval = firebase.functions().httpsCallable('setStudentApproval');
  console.log(approvalDict);
  for(var key in approvalDict){
    if(approvalDict[key]==true){
      console.log({email:key});
      console.log(setStudentApproval);
      setStudentApproval({email:key}).then((data)=>{
        console.log(data, "did it work");
        approveForm.reset();
        approveModal.classList.remove('open');
        approvalDict={};
     
      })
    }}
    })
checkoutLink.addEventListener('click',() =>{
  console.log("22");
  checkoutModal.style.display ='block';
  checkoutModal.classList.add('open');
});
//close product modal
checkoutModal.addEventListener('click', (e)=>{
  if(e.target.classList.contains('.checkoutModal')){
    checkoutModal.classList.remove('open');
    checkoutForm.reset();

  }
});

 checkoutForm.addEventListener('submit', (e)=>{
   console.log("?");
 });
/*
addToCart.addEventListener("click",(e)=>{
      e.preventDefault();
      console.log(1);
});
*/
home.addEventListener('click', (e) =>{
  homePage.classList.add('clicked');
});

homePage.addEventListener('click', (e) =>{
  if(e.target.classList.contains('clicked')){
    console.log("?");

  }
});

approveLink.addEventListener('click',() =>{
  approveModal.classList.add('open');
});
//close approve modal
approveModal.addEventListener('click', (e)=>{
  if(e.target.classList.contains('approve-modal')){
    approveModal.classList.remove('open');
    approveForm.reset();

  }
});

productLink.addEventListener('click',() =>{
  productModal.classList.add('open');
});
//close product modal
productModal.addEventListener('click', (e)=>{
  if(e.target.classList.contains('new-product')){
    productModal.classList.remove('open');
    productForm.reset();

  }
});

//add a new product
 productForm.addEventListener('submit', (e)=>{
   e.preventDefault();

   const addProduct = firebase.functions().httpsCallable('addProduct');
   addProduct({
    name: productForm.product_name.value,
    manufacturer: productForm.product_manufacturer.value,
    amount: productForm.product_amount.value,
    price: Number(productForm.product_price.value),
    kashrut: productForm.product_isKosher.value,
    category: productForm.product_category.value,
    expiryDate: productForm.product_expiryDate.value,
    url: productForm.product_url.value
})
   .then(() =>{
     productForm.reset();
     productModal.classList.remove('open');
     productForm.querySelector('.error').textContent = '';
   })
   .catch(error =>{
     productForm.querySelector('.error').textContent = error.message;
   });
 });
// notification
const notification = document.querySelector('.notification');

const showNotification = (message) => {
  notification.textContent = message;
  notification.classList.add('active');
  setTimeout(() => {
    notification.classList.remove('active');
    notification.textContent = '';
  }, 4000);
};


/*
approveForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const setStudentApproval = firebase.functions().httpsCallable('setStudentApproval');
  console.log(approvalDict);
  for(var key in approvalDict){
    if(approvalDict[key]==true){
      console.log({email:key});
      console.log(setStudentApproval);
      setStudentApproval({email:key}).then((data)=>{
        console.log(data, "did it work");
        approveForm.reset();
        approveModal.classList.remove('open');
        approvalDict={};
      })
      // .then( ()=>{
      //   approveForm.reset();
      //   approveModal.classList.remove('open');
      //   approveForm.querySelector('.error').textContent = '';
      // })
      // .catch(error =>{
      //   approveForm.querySelector('.error').textContent = error.message;
      // });
    }
  }
});
*/
function updateApproveDict(email){
  var check=document.getElementById(email);
  approvalDict[email]=check.checked;

}
function addToCart(str1){
  console.log("wtf");
  /*
  addToCart = firebase.functions().httpsCallable('addToCart');
  addToCart({check: 1}).then(() => { console.log('x');
  }).catch(() => { });
  /*
  const ref = firebase.firestore().collection('carts');
  const userUID=firebase.auth().currentUser.uid;
  var check = document.getElementById(str1);
  console.log(check.value);
  ref.onSnapshot(snapshot => {
let carts = [];
snapshot.forEach(doc => {
  if(doc.id==userUID)
  carts.push({...doc.data(), id: doc.id});
});
status = carts[0].mycart;
if(status === 'undefined'){}
    console.log(status);


});
 console.log("uid is ", userUID);
 console.log("before addToCartCloud");
 const addToCart= firebase.functions().httpsCallable('addToCart');
 console.log({uid:userUID});
 addToCart({uid:userUID})
 .then( () =>{
   console.log("????");
 })
 */
}