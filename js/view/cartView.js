import { getCart, getItemQuantity } from "../cart.js";
import { createProductLink, createAddButton, createRemoveButton } from "../components.js";

// shipping cost constants
const SHIPPING_COSTS = {
    STAN: { CAN: 10, US: 15, INT: 20 },
    EXP:  { CAN: 25, US: 25, INT: 30 },
    PRI:  { CAN: 35, US: 50, INT: 50 }
};
const FREE_SHIPPING_THRESHOLD = 500;
const CANADA_TAX_RATE = 0.05;

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
    quantity.textContent = getItemQuantity(String(product.id));
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

function calculateMerchandiseTotal(products) {
    let total = 0;
    for (const item of getCart()) {
        const product = products.find(p => p.id === Number(item.id));
        total += product.price * item.quantity;
    }
    return total;
}

function calculateShipping(merchandiseTotal, type, destination) {
    if (merchandiseTotal === 0 || merchandiseTotal > FREE_SHIPPING_THRESHOLD) {
        return 0;
    }
    return SHIPPING_COSTS[type][destination];
}

function calculateTax(merchandiseTotal, destination) {
    if (destination === "CAN") {
        return merchandiseTotal * CANADA_TAX_RATE;
    }
    return 0;
}

function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

function renderCartSummary(products) {
    const type = document.querySelector('#shipping-type').value;
    const destination = document.querySelector('#shipping-destination').value;

    const merchandise = calculateMerchandiseTotal(products);
    const shipping = calculateShipping(merchandise, type, destination);
    const tax = calculateTax(merchandise, destination);

    document.querySelector('#summary-merchandise').textContent = formatMoney(merchandise);
    document.querySelector('#summary-shipping').textContent = formatMoney(shipping);
    document.querySelector('#summary-tax').textContent = formatMoney(tax);
    document.querySelector('#summary-total').textContent = formatMoney(merchandise + shipping + tax);
}

export function initShippingListeners(products) {
    document.querySelector('#shipping-type').addEventListener('change', () => renderCartSummary(products));
    document.querySelector('#shipping-destination').addEventListener('change', () => renderCartSummary(products));
}

export function renderCartView(products) {
    const cartContainer = document.querySelector('#cart-items');
    cartContainer.textContent = "";
    
    const cartProducts = getProduct(products);
    for (const product of cartProducts) {
        const productRow = createProductRow(product);
        cartContainer.appendChild(productRow);
    }

    renderCartSummary(products);
}
