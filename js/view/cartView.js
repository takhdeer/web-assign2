import { getCart, getCartCount, getItemQuantity } from "../cart.js";
import { createProductLink, createAddButton, createRemoveButton } from "../components.js";

function getProduct(products) {
    const cart = getCart();
    const cartProducts = [];
    for (const c of cart) {
        const product = products.find(p => p.id === Number(c.id));
        cartProducts.push(product)
    };
    return cartProducts;
}

function createProductRow(product) {

    const imgLink = createProductLink(product, "view");
    const img = document.createElement('img');
    img.src = product.thumbnail; 
    img.alt = product.title;
    imgLink.appendChild(img);

    const info = document.createElement("div");

    const titleLink = createProductLink(product, "view");
    titleLink.textContent = product.title;
    info.appendChild(titleLink);

    const price = document.createElement('p');
    price.id = 'price';
    price.textContent = product.price;
    info.appendChild(price);

    const quantity = document.createElement('p');
    quantity.id = 'quantity';
    quantity.textContent = product.quantity;
    info.appendChild(quantity);

    const actions = document.createElement("div");
    actions.className = "flex shrink-0 items-center gap-2";
    actions.appendChild(createRemoveButton(product));
    actions.appendChild(createAddButton(product));
    info.appendChild(actions);

    const row = document.createElement("div");
    row.className = "flex items-center gap-3 p-4";
    row.appendChild(imgLink);
    row.appendChild(info);
    row.appendChild(actions);

    return row;
}


export function renderCartView(products) {
    const cartContainer = document.querySelector('#cart');
    cartContainer.textContent = ""      // empty for now
    
    const cartProducts = getProduct(products);
    for (const product of cartProducts) {
        const productRow = createProductRow(product);
        cartContainer.appendChild(productRow);
    }
}
