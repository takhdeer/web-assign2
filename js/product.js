import { createStarRating } from "./components.js";


function renderInfo(product) {
    const image = document.querySelector("#product-image");
    image.src = product.images[0];
    image.alt = product.title;

    const title = document.querySelector("#product-title");
    title.textContent = product.title;

    const price = document.querySelector("#product-price");
    price.textContent = "$" + product.price;

    const rating = document.querySelector("#product-rating");
    rating.innerHTML = "";
    rating.appendChild(createStarRating(product.rating));
}

export function renderSingleProduct(product) {
    renderInfo(product);
}