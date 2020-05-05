const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form');
const productModal = document.querySelector('.new-product');
const productLink = document.querySelector('.add-product');
const productForm = document.querySelector('.new-product form');
// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});
productLink.addEventListener('click',() =>{
  productModal.classList.add('open');
});
//close product modal
productModal.addEventListener('click', (e)=>{
  console.log("check close product 0");
  if(e.target.classList.contains('new-prodcut')){
    console.log("check close product");
    productModal.classList.remove('open');
  }
});
// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

// add a new request
requestForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const addRequest = firebase.functions().httpsCallable('addRequest');
  addRequest({ 
    text: requestForm.request.value 
  })
  .then(() => {
    requestForm.reset();
    requestForm.querySelector('.error').textContent = '';
    requestModal.classList.remove('open');
  })
  .catch(error => {
    requestForm.querySelector('.error').textContent = error.message;
  });
});
//add a new product
 productForm.addEventListener('submit', (e)=>{
   e.preventDefault();

   const addProduct = firebase.functions().httpsCallable('addProduct');
   addProduct({
    name: productForm.product_name.value,
    manufacturer: productForm.product_manufacturer.value,
    amount: productForm.product_amount.value,
    price: productForm.product_price.value
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