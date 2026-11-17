import { getProducts } from './data.js';
import { createProductCard } from './components.js';
import { addToCart, getCart, getCartCount, decreaseQuanity, getItemQuantity } from './cart.js';
import { showView, initRouter } from './router.js';
import { renderSingleProduct } from './product.js';

// Router: Start on home view
initRouter();
showView("home");

// Initialising Cart
function updateCartCount() {
    const cart = getCart();
    const cartVal = document.querySelector('#cart-count');
    const count = getCartCount();
    cartVal.textContent = `(${count})`;
    cartVal.classList.toggle('hidden', count === 0);
};

updateCartCount();

// Products fetch
const products = await getProducts();
console.log(products);

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
// for (let i = 0 ; i < 4 ; i++) {
//     const card = createProductCard(products[i]);
//     featuredGrid.appendChild(card);
// }


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

getCart().forEach(item => updateRemoveButtons(item.id));

// Add / Remove from Cart functionality
main.addEventListener('click', (e) => {
    const addBtn = e.target.closest('button[aria-label="Add to cart"]');
    const removeBtn = e.target.closest('button[aria-label="Remove from cart"]');
    const btn = addBtn ?? removeBtn;
    if (btn === null) { return }

    if (addBtn) {
        addToCart(btn.dataset.id);
    } else {
        decreaseQuanity(btn.dataset.id);
    }
    updateCartCount();
    updateRemoveButtons(btn.dataset.id);
})