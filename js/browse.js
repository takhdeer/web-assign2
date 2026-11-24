import { createProductCard } from "./components.js";

let allProducts = [];

// Intial browse state
let filters = {
    name: "",
    categories: [],
    ratings: [],
    priceUnder: null,
    priceOver: null
};
let sort = "name";

function matchesFilters(product) {
    if (filters.name !== "") {
        const title = product.title.toLowerCase();
        if (!title.includes(filters.name.toLowerCase())) {
            return false;
        }
    }

    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
    }

    if (filters.ratings.length > 0 && !filters.ratings.includes(Math.round(product.rating))) {
        return false;
    }

    if (filters.priceUnder !== null && product.price >= filters.priceUnder) {
        return false;
    }

    if (filters.priceOver !== null && product.price <= filters.priceOver) {
        return false;
    }

    return true;
}

function applyFilters(products) {
    const results = [];
    for (const product of products) {
        if (matchesFilters(product)) {
            results.push(product);
        }
    }
    return results;
}

function applySort(products) {
    const sorted = [...products];

    if (sort === "name") {
        sorted.sort((a, b) => a.title.localeCompare(b.title)); // Citation: https://www.w3schools.com/jsref/jsref_localecompare.asp
    } else if (sort === "price") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "rating") {
        sorted.sort((a, b) => b.rating - a.rating);
    } else if (sort === "category") {
        sorted.sort((a, b) => a.category.localeCompare(b.category));
    }

    return sorted;
}

// toggles a value in one of the array filters (categories, ratings)
function toggleFilterValue(key, value, checked) {
    if (checked) {
        if (!filters[key].includes(value)) {
            filters[key].push(value);
        }
    } else {
        filters[key] = filters[key].filter((v) => v !== value);
    }
}

export function renderBrowse(products = allProducts) {
    const results = applySort(applyFilters(products));

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

    const nameInput = document.querySelector("#filter-name");
    nameInput.addEventListener("input", (e) => {
        filters.name = e.target.value.trim();
        renderBrowse();
    });

    const ratingBox = document.querySelector("#filter-ratings");
    ratingBox.addEventListener("change", (e) => {
        toggleFilterValue("ratings", Number(e.target.value), e.target.checked);
        renderBrowse();
    });

    // build one checkbox per category found in the data
    const categoryBox = document.querySelector("#filter-categories");
    const categories = [];
    for (const product of products) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    }
    categories.sort();

    for (const category of categories) {
        const label = document.createElement("label");
        label.className = "flex items-center gap-2 capitalize";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;

        label.appendChild(checkbox);
        label.append(" " + category.replaceAll("-", " "));
        categoryBox.appendChild(label);
    }

    categoryBox.addEventListener("change", (e) => {
        toggleFilterValue("categories", e.target.value, e.target.checked);
        renderBrowse();
    });

    // price inputs: empty box means no limit
    const priceOverInput = document.querySelector("#filter-price-over");
    const priceUnderInput = document.querySelector("#filter-price-under");

    priceOverInput.addEventListener("input", (e) => {
        filters.priceOver = e.target.value === "" ? null : Number(e.target.value);
        renderBrowse();
    });

    priceUnderInput.addEventListener("input", (e) => {
        filters.priceUnder = e.target.value === "" ? null : Number(e.target.value);
        renderBrowse();
    });

    const sortSelect = document.querySelector("#sort-select");
    sortSelect.addEventListener("change", (e) => {
        sort = e.target.value;
        renderBrowse();
    });

    // reset everything back to the initial state
    document.querySelector("#clear-filters").addEventListener("click", () => {
        filters = { name: "", categories: [], ratings: [], priceUnder: null, priceOver: null };
        sort = "name";

        nameInput.value = "";
        priceOverInput.value = "";
        priceUnderInput.value = "";
        sortSelect.value = "name";
        for (const box of document.querySelectorAll("#filters input[type=checkbox]")) {
            box.checked = false;
        }
        renderBrowse();
    });
}