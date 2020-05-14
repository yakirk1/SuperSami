const productModal = document.querySelector('.new-product');
const productLink = document.querySelector('.add-product');
//const addToCart = document.querySelector('.add-to-cart');
const productForm = document.querySelector('.new-product form');
const homePage = document.getElementById("homePage");
const home = document.querySelector('.home');
const amount = document.getElementById('.amount');
const checkoutLink = document.querySelector('.checkout');
const checkoutModal = document.querySelector('.checkout-modal');
const checkoutForm = document.querySelector('.checkout-modal form');
const approveLink = document.querySelector('.approve-student');
const approveModal = document.querySelector('.approve-modal');
const approveForm = document.querySelector('.approve-modal form');

//const submitApprove = document.querySelector('.approvesubmit');
//const submitDisapprove = document.querySelector('.disapprovesubmit');
var approvalDict ={};

function submitForm (button)
{
  if (button.value == "Find")
  {
    /* open popup */
    find();
  }
  else if (button.value == "Add")
  {
    /* stay in the same window */
  } 

  return false;
}

approveForm.addEventListener('submit', (e)=>{
  var action = document.getElementsByName('action-submit');
  console.log(action[0].value);
  e.preventDefault(); 
  console.log("?????????");
  if ($_POST['action'] == 'submitApprove') {
    const setStudentApproval = firebase.functions().httpsCallable('setStudentApproval');
  console.log(approvalDict);
  
  for(var key in approvalDict){
    if(approvalDict[key]==true){
      setStudentApproval({email:key}).then((data)=>{
        console.log(data, "did it work");
        approveForm.reset();
        approveModal.classList.remove('open');
     
      });
    }
    }
    approvalDict={};
} else if ($_POST['action'] == 'submitDisapprove') {
    e.preventDefault();
    console.log("?????????");
    const setStudentDisapproval = firebase.functions().httpsCallable('setStudentDisapproval');
    console.log(approvalDict);
    for(var key in approvalDict){
      if(approvalDict[key]==true){
        setStudentDisapproval({email:key}).then((data)=>{
          console.log(data, "did it work");
          approveForm.reset();
          approveModal.classList.remove('open');
       
        });
      }
      }
      approvalDict={};
    }
  })
      
  
    
checkoutLink.addEventListener('click',() =>{
  checkoutModal.classList.add('open');
});
//close product modal
checkoutModal.addEventListener('click', (e)=>{
  if(e.target.classList.contains('checkout-modal')){
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
  const addToMyCart = firebase.functions().httpsCallable('addToCart');
  const addNewCart = firebase.functions().httpsCallable('addNewCart');

  const userUID=firebase.auth().currentUser.uid;
  console.log(userUID);
  var amount = document.getElementById(str1);
  const carts = firebase.firestore().collection('carts');
  var wtf=false;
 // console.log(carts.doc(userUID));
  let mycarts = [];
      carts.onSnapshot(snapshot => {
        snapshot.forEach(doc => {
        if(doc.id ==userUID &&wtf==false){
          wtf=true;
          mycarts.push({...doc.data(), id: doc.id});
          if(!(str1 in mycarts[0].mycart)){
            console.log("in if");
            mycarts[0].mycart[str1] = Number(amount.value);
            
          }
          else{
            console.log("in else");
            mycarts[0].mycart[str1] =Number(mycarts[0].mycart[str1]) + Number(amount.value);

          }
          addToMyCart({uid:userUID,mycart:mycarts[0].mycart}).then(data =>{
            console.log(data,"check");
            amount.value="";
          })
          return;
        }
        return;
      }
        
        
        );
        if(wtf==false){
          wtf=true;
          console.log("7");
          var dict ={};
          dict[str1]=Number(amount.value);
          console.log(dict);
          addNewCart({uid:userUID,mycart:dict}).then(data =>{
            console.log(data,"check");
            amount.value="";

           
          })
          
        }
      });
    
      /*
      console.log({uid:userUID,mycart:mycarts[0].mycart});
      const addToMyCart = firebase.functions().httpsCallable('addToCart');
      addToMyCart({uid:userUID,mycart:mycarts[0].mycart}).then(data =>{
        console.log(data,"check");
      })
      */

//function wtf(data){
  //console.log(data);
}
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
/*
 function checkValidAmount(prodName){
   var check=false;
  var amount = document.getElementById(prodName);
  const prodAmount = firebase.firestore().collection('products');
  prodAmount.onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      if(doc.data().name==prodName){
        if(Number(doc.data().amount)<Number(amount.value)){
          check=true;
          console.log("error");
          return false;
        }
      }
    })})
    if(check==false)
    {
      addTo
    }
    
  }
*/