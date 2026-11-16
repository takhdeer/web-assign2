import { getProducts } from './data.js';
import { createProductCard } from './components.js';

const products = await getProducts();
console.log(products);


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