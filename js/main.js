import { getProducts } from './data.js';
import { createProductCard } from './components.js';
import { addToCart, getCartCount, decreaseQuanity, getItemQuantity } from './cart.js';
import { showView, initRouter } from './router.js';
import { renderSingleProduct, initProductView } from './product.js';
import { renderCartView, initShippingListeners } from './view/cartView.js';
import { initBrowse } from './browse.js';
import { showToast } from './toast.js';
import { renderCategory } from './category.js';


// Initialising Cart
function updateCartCount() {
    const cartVal = document.querySelector('#cart-count');
    const count = getCartCount();
    cartVal.textContent = `(${count})`;
    cartVal.classList.toggle('hidden', count === 0);
};

updateCartCount();

initProductView((productId) => {
    updateCartCount();
    updateRemoveButtons(productId);
})

// Products fetch
const products = await getProducts();
console.log(products);

//browse
initBrowse(products);

// category view
renderCategory(products);

// Single product
document.addEventListener("click", (e) => {
    if (e.target.dataset.view !== "product") {
        return;
    }

    const id = Number(e.target.dataset.id);
    for (const p of products) {
        if (p.id === id) {
            renderSingleProduct(p);
            return;
        }
    }
});

// Router: Start on home view
initRouter(products);
initShippingListeners(products);
showView("home");

// Featured Grid 
const featuredGrid = document.querySelector("#featured-grid");
const featuredMax = 4;
let featuredCount = 0;

for (const p of products) {
    if (featuredCount == featuredMax) {
        break;
    }
    if (Math.round(p.rating) == 5){
        featuredGrid.appendChild(createProductCard(p));
        featuredCount += 1;
    }
}


const aboutButton = document.querySelector("#about-open");
const aboutDialog = document.querySelector("#about");
aboutButton.addEventListener("click", () => {
    aboutDialog.showModal();
});

// Main document functionality
const main = document.querySelector('main')

// Show/hide the minus button(s) 
function updateRemoveButtons(productId) {
    const quantity = getItemQuantity(productId);
    document
        .querySelectorAll(`button[aria-label="Remove from cart"][data-id="${productId}"]`)
        .forEach(btn => { btn.hidden = quantity === 0; });
}

// Add / Remove from Cart functionality
main.addEventListener('click', (e) => {
    const addBtn = e.target.closest('button[aria-label="Add to cart"]');
    const removeBtn = e.target.closest('button[aria-label="Remove from cart"]');
    const btn = addBtn ?? removeBtn;
    if (btn === null) { return }

    if (addBtn) {
        addToCart(btn.dataset.id);
        showToast("Added to cart");
    } else {
        decreaseQuanity(btn.dataset.id);
        showToast("Removed from cart");
    }
    updateCartCount();
    updateRemoveButtons(btn.dataset.id);

    // re-render the cart so quantities update and empty rows disappear
    if (!document.querySelector('#cart').classList.contains('hidden')) {
        renderCartView(products);
    }
})