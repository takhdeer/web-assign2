import { getProducts } from './data.js';
import { createProductCard } from './components.js';
import { addToCart, getCart, getCartCount, decreaseQuanity } from './cart.js';

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

// Featured Grid 

const featuredGrid = document.querySelector("#featured-grid");
for (let i = 0 ; i < 4 ; i++) {
    const card = createProductCard(products[i]);
    featuredGrid.appendChild(card);
}

const aboutButton = document.querySelector("#about-open");
const aboutDialog = document.querySelector("#about");
aboutButton.addEventListener("click", () => {
    aboutDialog.showModal();
});

// Main document functionality
const main = document.querySelector('main')

// Add to Cart functionality
main.addEventListener('click', (e) => {
    const btn = e.target.closest('button[aria-label="Add to cart"]');
    if (btn === null) { return }
    else {
        addToCart(btn.dataset.id);
        updateCartCount();
    }
})