import { getCart, getCartCount, getItemQuantity } from "../cart.js";
import { createProductLink, createAddButton, createRemoveButton } from "../components.js";

function getProductInfo(products) {
    const cart = getCart();
    for (const c of cart) {
        const product = products.find(p => p.id === Number(c.id));
        return product;
    };
    
}

function createProductRow(product) {
    const div = document.createElement('div');
    const imgLink = createProductLink(product, "view");
    const img = document.createElement('img');
    img.src = product.thumbnail; 
    img .alt = product.title;
    imgLink.appendChild(img);

    const titleLink = createProductLink(product, "view");
    titleLink.textContent = product.title;
    div.appendChild(titleLink);

    const price = document.createElement('p');
    price.id = 'price';
    price.textContent = product.price;

    const quantity = document.createElement('p');
    price.id = 'price';
    quantity.textContent = product.quantity;
}


export function renderCartView() {
    const cartContainer = document.querySelector('#cart');
    cartContainer.textContent = ""      // empty for now
    const cart = getCart();
    

}
