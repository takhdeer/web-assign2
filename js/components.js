import { getItemQuantity } from "./cart.js";

function createParagraph(className, text) {
    const para = document.createElement("p");
    para.className = className;
    para.textContent = text;
    return para;
}

export function createProductLink(product, className) {
    const link = document.createElement("a");
    link.href = "#";
    link.className = className;
    link.dataset.view = "product";
    link.dataset.id = product.id;
    return link;
}

export function createAddButton(product) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg text-white hover:bg-brand-700";
    button.dataset.id = product.id;
    button.setAttribute("aria-label", "Add to cart");
    button.textContent = "+";
    return button;
}

// hidden unless the product is already in the cart
export function createRemoveButton(product) {
    const button = document.createElement("button");
    button.type = "button";
    button.hidden = getItemQuantity(String(product.id)) === 0;
    button.className = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg text-white hover:bg-brand-700";
    button.dataset.id = product.id;
    button.setAttribute("aria-label", "Remove from cart");
    button.textContent = "−";
    return button;
}

export function createStarRating(rating) {
    const completedCount = Math.round(rating);
    const emptyCount = 5 - completedCount;

    let completedStars = "";
    for (let i = 0 ; i < completedCount ; i++) {
        completedStars = completedStars + "★";
    }

    let emptyStars = "";
    for (let i = 0 ; i < emptyCount ; i++) {
        emptyStars = emptyStars + "☆";
    }

    const wrapper = document.createElement("span");
    wrapper.className = "text-amber-500";

    const completedSpan = document.createElement("span");
    completedSpan.textContent = completedStars;

    const emptySpan = document.createElement("span");
    emptySpan.className = "text-stone-300";
    emptySpan.textContent = emptyStars;

    wrapper.appendChild(completedSpan);
    wrapper.appendChild(emptySpan);

    wrapper.setAttribute("role", "img");
    wrapper.setAttribute("aria-label", "Rated " + rating + " out of 5");

    return wrapper;
}

export function createProductCard(product) {
    //image
    const imageLink = createProductLink(product, "block aspect-square overflow-hidden rounded-t-lg bg-gray-100");
    const img =  document.createElement("img");
    img.src = product.thumbnail;
    img.alt = product.title;
    img.className = "h-full w-full object-cover";
    imageLink.appendChild(img);

    // info
    const info = document.createElement("div");
    info.className = "min-w-0";

    const titleLink = createProductLink(product, "block truncate font-medium text-gray-900 hover:text-brand-600");
    titleLink.textContent = product.title;
    info.appendChild(titleLink);

    const category = createParagraph("text-sm text-gray-500 capitalize", product.category);
    info.appendChild(category);

    info.appendChild(createStarRating(product.rating));

    const price = createParagraph("font-semibold text-gray-900", "$" + product.price);
    info.appendChild(price);

    // body div
    const body = document.createElement("div");
    body.className = "flex items-center justify-between gap-3 p-4";
    body.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "flex shrink-0 items-center gap-2";
    actions.appendChild(createRemoveButton(product));
    actions.appendChild(createAddButton(product));
    body.appendChild(actions);

    // card div
    const card = document.createElement("div");
    card.className = "flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm";
    card.appendChild(imageLink);
    card.appendChild(body);

    return card;
}