import { getProducts } from './data.js';
import { createProductCard } from './components.js';
import { addToCart, getCartCount, decreaseQuanity } from './cart.js';

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
function updateCartCount(cartCount) {
    const cartVal = document.querySelector('#cart-count');
    cartVal.textContent = cartCount
    cartVal.classList.remove('hidden')
};

main.addEventListener('click', (e) => {
    const btn = e.target.closest('button[aria-label="Add to cart"]');
    if (btn === null) { return }
    else {
        addToCart(btn.dataset.id)
        const cartCount = getCartCount();
        updateCartCount(cartCount);
    }
})