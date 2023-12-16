// Product list with IDs, names, prices, quantities, and image URLs

let products = [
    {
        id: 123,
        name: 'لپتاپ ایکس',
        price: 3500000,
        quantity: 1,
        img: 'https://dkstatics-public.digikala.com/digikala-products/06aaa82b2af4b71992683701769b0afa4fa169bf_1666160815.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'
    },
    {
        id: 143,
        name: 'گوشی موبایل وای',
        price: 2500000,
        quantity: 1,
        img: 'https://dkstatics-public.digikala.com/digikala-products/06aaa82b2af4b71992683701769b0afa4fa169bf_1666160815.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'
    },
    {
        id: 1473,
        name: 'کیف دستی زد',
        price: 800000,
        quantity: 1,
        img: 'https://dkstatics-public.digikala.com/digikala-products/06aaa82b2af4b71992683701769b0afa4fa169bf_1666160815.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'
    }
];

// Array to hold items added to the cart

const cartList = [];

// HTML elements from the DOM

let productListElement = document.getElementById('list_products');
let cartOrderListElement = document.getElementById('list_cart_order');
let allTotalOrderElement = document.getElementById('all_total_order');
let allPriceOrderElement = document.getElementById('all_price_order');

// Initial message for an empty cart

cartOrderListElement.innerHTML = `
    <div class="alert alert-warning"> سبد خرید شما خالی است</div>
`;

// Loop through products to display them

products.forEach(item => {
        // Check if the product is already in the cart

    let isExistInCart = cartList.find(itemCart =>{
        return itemCart.id === item.id;
    });
    let htmlExistInCart = 'نیست';
    if(isExistInCart){
        htmlExistInCart = `
            <span class='badge bg-warning'>${isExistInCart.quantity}</span>
        `;
    }
    // HTML structure for each product

    let productItem = `
        <div class='col-3'>
            <div class='card'>
                <img src='${item.img}' />
                <div class='card-body'>
                    <span>${item.name}</span>
                    <div>
                        <span>قیمت:</span>
                        <span>${item.price}</span>
                    </div>
                    <span class='badge bg-danger' id=${item.id}></span>
                    <button class='btn btn-success addToCart' data-id='${item.id}'>خرید</button>
                </div>
            </div>
        </div>
    `;
    
        // Insert product HTML into the productListElement

    productListElement.insertAdjacentHTML('beforeend', productItem);
});

// Add event listeners to "Add to Cart" buttons

let addToCartButtons = document.querySelectorAll('.addToCart');

// Function to update product quantity in the cart

const updateProductQuantity = (id, quantity) =>{
    let spanProductItem = document.getElementById(`${id}`);
    spanProductItem.innerHTML =`${quantity}`;
};

addToCartButtons.forEach(button => {
    button.addEventListener('click', e => {
        // Handle adding items to the cart
        let targetButton = e.target;
        let targetButtonId = targetButton.getAttribute('data-id');
        let itemProductFilter = products.find(item => {
            return item.id === Number(targetButtonId);
        });

        let existingProduct = cartList.find(item => {
            return item.id === Number(targetButtonId);
        });
        
        if (existingProduct) {
            existingProduct.quantity++;
            updateProductQuantity(targetButtonId, existingProduct.quantity);
        } else {
            cartList.push({
                id: itemProductFilter.id,
                name: itemProductFilter.name,
                price: itemProductFilter.price,
                quantity: itemProductFilter.quantity,
                img: itemProductFilter.img
            });
            updateProductQuantity(targetButtonId, itemProductFilter.quantity);
        }
        
        displayCart();
    });
});

const deleteProduct = (index, id) => {
     // Delete product from the cart
    cartList.splice(index, 1);
    displayCart();
    updateProductQuantity(id, '');
};

const updateQuantityProduct = (id, type) => {
      // Update quantity of a product in the cart
    let getProduct = cartList.find(item => {
        return item.id === Number(id);
    });

    if (type === 'dec') {
        if (getProduct.quantity > 1) {
            getProduct.quantity--;
            updateProductQuantity(id, getProduct.quantity);
        }
    } else {
        getProduct.quantity++;
        updateProductQuantity(id, getProduct.quantity);
    }
    displayCart();
};

const displayCart = () => {
    // Show cart items in the UI
    cartOrderListElement.innerHTML = '';
    if (cartList.length === 0) {
        cartOrderListElement.innerHTML = `
            <div class="alert alert-warning"> سبد خرید شما خالی است</div>
        `;
    }

    cartList.forEach((cartOrder, index) => {
        let itemOrder = `
            <li class='list-group-item'>
                ${cartOrder.name}
                <span> ${cartOrder.price * cartOrder.quantity}</span>
                <button class='btn btn-danger' onclick="updateQuantityProduct(${cartOrder.id},'dec')">-</button>
                <span class='badge bg-secondary'> ${cartOrder.quantity}</span>
                <button class='btn btn-danger' onclick="updateQuantityProduct(${cartOrder.id},'inc')">+</button>
                <button class='btn btn-danger' onclick="deleteProduct(${index},${cartOrder.id})">حذف</button>
            </li>
        `;
        cartOrderListElement.insertAdjacentHTML('beforeend', itemOrder);
    });
   
    let totalOrder = cartList.reduce((total, item) => total + item.quantity, 0);
    let totalPrice = cartList.reduce((total, item) => total + item.quantity * item.price, 0);
    allTotalOrderElement.innerHTML = `تعداد  آیتم: ${totalOrder}`;
    allPriceOrderElement.innerHTML = `  قیمت کل: ${totalPrice}`;
};
