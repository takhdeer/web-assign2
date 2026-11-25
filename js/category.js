
function getCategories(products) {
    const categories = new Set();
    for (const product of products) {
        categories.add(product.category);
    }
    return categories;
}

function findThumbnail(products, category) {
    for (const product of products) {
        if (product.category == category) {
            return product.thumbnail;
        }
    }
    return "";
}

function createCategoryTile(category, thumbnail) {
    const link = document.createElement("a");
    link.href = "#";
    link.className = "block";
    link.dataset.view = "browse";
    link.dataset.category = category;

    const img = document.createElement("img");
    img.src = thumbnail;
    img.alt = category;
    img.className = "pointer-events-none aspect-square w-full rounded-2xl bg-white object-contain p-4";
    link.appendChild(img);

    const name = document.createElement("p");
    name.className = "pointer-events-none mt-3 text-center font-semibold capitalize";
    name.textContent = category;
    link.appendChild(name);

    return link;
}

export function renderCategory(products) {
    const grid = document.querySelector("#category-grid");
    grid.innerHTML = "";

    const categories = getCategories(products);
    for (const category of categories) {
        const thumbnail = findThumbnail(products, category);
        grid.appendChild(createCategoryTile(category, thumbnail));

    }
}