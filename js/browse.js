import { createProductCard } from "./components.js";

let allProducts = [];

let ratingFilter = [];

function filterByRating(products) {

    if (ratingFilter.length === 0) {
        return products;
    }

    const results = [];
    for (const product of products) {
        const stars = Math.round(product.rating);
        if (ratingFilter.includes(stars)) {
            results.push(product);
        }
    }
    return results;
}

export function renderBrowse(products) {
    const results = filterByRating(products);

    const grid = document.querySelector("#results-grid");
    grid.innerHTML = "";

    for (const product of results) {
        grid.appendChild(createProductCard(product));
    }

    const count = document.querySelector("#result-count");
    count.textContent = "(" + results.length + " results) ";

    const noResults = document.querySelector("#no-results");
    if (results.length === 0) {
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
    }
}

export function initBrowse(products) {
    allProducts = products;

    const ratingBox = document.querySelector("#filter-ratings");
    ratingBox.addEventListener("change", (e) => {
        const stars = Number(e.target.value);

        if (e.target.checked) {
            ratingFilter.push(stars);
        } else {
            const remaining = [];
            for (const r of ratingFilter) {
                if (r !== stars) {
                    remaining.push(r);
                }
            }
            ratingFilter = remaining;
        }
        renderBrowse(allProducts);
    });
}