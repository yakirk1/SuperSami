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
    expiryDate: productForm.product_expiryDate.value
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