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

// builds the list of chips for every filter that is currently active
function getActiveFilterChips() {
    const chips = [];

    if (filters.name !== "") {
        chips.push({ key: "name", value: "", label: 'Name: "' + filters.name + '"' });
    }
    for (const rating of filters.ratings) {
        chips.push({ key: "ratings", value: String(rating), label: rating + "★" });
    }
    for (const category of filters.categories) {
        chips.push({ key: "categories", value: category, label: category.replaceAll("-", " ") });
    }
    if (filters.priceOver !== null) {
        chips.push({ key: "priceOver", value: "", label: "Min $" + filters.priceOver });
    }
    if (filters.priceUnder !== null) {
        chips.push({ key: "priceUnder", value: "", label: "Max $" + filters.priceUnder });
    }

    return chips;
}

function renderActiveFilters() {
    const container = document.querySelector("#active-filters");
    container.innerHTML = "";

    for (const chip of getActiveFilterChips()) {
        const tag = document.createElement("span");
        tag.className = "flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-1 text-brand-800 capitalize";
        tag.textContent = chip.label;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-filter flex h-5 w-5 items-center justify-center rounded-full text-brand-700 hover:bg-brand-100 cursor-pointer";
        remove.dataset.key = chip.key;
        remove.dataset.value = chip.value;
        remove.setAttribute("aria-label", "Remove filter " + chip.label);
        remove.innerHTML = "&times;";

        tag.appendChild(remove);
        container.appendChild(tag);
    }
}

// removes a single filter and unchecks/clears the matching sidebar input
function removeFilter(key, value) {
    if (key === "name") {
        filters.name = "";
        document.querySelector("#filter-name").value = "";
    } else if (key === "priceOver") {
        filters.priceOver = null;
        document.querySelector("#filter-price-over").value = "";
    } else if (key === "priceUnder") {
        filters.priceUnder = null;
        document.querySelector("#filter-price-under").value = "";
    } else if (key === "ratings") {
        toggleFilterValue("ratings", Number(value), false);
        document.querySelector('#filter-ratings input[value="' + value + '"]').checked = false;
    } else if (key === "categories") {
        toggleFilterValue("categories", value, false);
        document.querySelector('#filter-categories input[value="' + value + '"]').checked = false;
    }
}

function resetFilters() {
    filters = { name: "",
                categories: [],
                ratings: [],
                priceUnder: null,
                priceOver: null
    };
    sort = "name";

    document.querySelector("#filter-name").value = "";
    document.querySelector("#filter-price-over").value = "";
    document.querySelector("#filter-price-under").value = "";
    document.querySelector("#sort-select").value = "name";

    const checked = document.querySelectorAll("#filters input[type=checkbox]");

    for (const box of checked) {
        box.checked = false;
    }
}

export function showCategory(category) {
    resetFilters();
    filters.categories = [category];
    const checkbox = document.querySelectorAll("#filters input[type=checkbox]");
    
    for (const box of checkbox) {
        if (box.value === category) {
            box.checked = true;
        }
    }

    renderBrowse();
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

    renderActiveFilters();
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

    // remove filter
    document.querySelector("#active-filters").addEventListener("click", (e) => {
        const button = e.target.closest(".remove-filter");
        if (!button) {
            return;
        }
        removeFilter(button.dataset.key, button.dataset.value);
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