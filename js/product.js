import { createStarRating } from "./components.js";
import { addToCart } from "./cart.js";


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

    const sku = document.querySelector("#product-sku");
    sku.textContent = product.sku;
    
    const description = document.querySelector("#product-description");
    description.textContent = product.description;
}

function renderBreadcrumb(product) {
    const crumbCategory = document.querySelector("#crumb-category");
    const crumbTitle = document.querySelector("#crumb-title");

    crumbCategory.textContent = product.category;
    crumbTitle.textContent = product.title;
} 

function renderTags(product) {
    const tagList = document.querySelector("#product-tags");
    tagList.innerHTML = "";

    for (const tag of product.tags) {
        const pill = document.createElement("span");
        pill.textContent = tag;
        pill.className = "rounded-full bg-stone-100 px-3 text-xs font-medium text-stone-600";
        tagList.appendChild(pill);
    }
}

function renderStock(product) {
    const stock = document.querySelector("#product-stock");
    
    if (product.stock > 0) {
        stock.textContent = "In stock";
        stock.className = "mt-4 font-semibold text-green-600";
    } else {
        stock.textContent = "Out of stock";
        stock.className = "mt-4 font-semibold text-red-600";
    }
}

function renderSpecs(product) {
    const weight = document.querySelector("#spec-weight");
    const dimensions = document.querySelector("#spec-dimensions");
    const warranty = document.querySelector("#spec-warranty");
    const shipping = document.querySelector("#spec-shipping");
    const returns = document.querySelector("#spec-returns");

    weight.textContent = product.weight + "kg";
    dimensions.textContent = product.dimensions.width + " x " + product.dimensions.height + " x " + product.dimensions.depth + " cm";

    warranty.textContent = product.warrantyInformation;
    shipping.textContent = product.shippingInformation;
    returns.textContent = product.returnPolicy;
}

function renderReviews(product) {
    const reviewList = document.querySelector("#review-list");
    reviewList.innerHTML = "";

    if (product.reviews.length == 0) {
        const empty = document.createElement("li");
        empty.className = "text-stone-500";
        empty.textContent = "No reviews for this product yet.";
        reviewList.appendChild(empty);
        return;
    }

    for (const review of product.reviews) {
        const li = document.createElement("li");
        li.className = "border-b border-stone-200 pb-4";

        const name = document.createElement("p");
        name.className = "font-semibold";
        name.textContent = review.reviewerName;
        li.appendChild(name);

        const date = document.createElement("p");
        date.className = "text-xs text-stone-500";
        date.textContent = new Date(review.date).toLocaleDateString();
        li.appendChild(date);

        li.appendChild(createStarRating(review.rating))

        const comment = document.createElement("p");
        comment.className = "mt-1 text-stone-600";
        comment.textContent = review.comment;
        li.appendChild(comment);

        reviewList.appendChild(li);
    }

}

export function renderSingleProduct(product) {
    renderInfo(product);
    renderBreadcrumb(product);
    renderTags(product);
    renderStock(product);
    renderSpecs(product);
    renderReviews(product);

    // // reset quantity
    const qtyInput = document.querySelector("#product-qty");
    qtyInput.value = 1;

    // tag add button with product's id
    const addButton = document.querySelector("#product-add");
    addButton.dataset.id = product.id;

}

export function initProductView(onCartChange) {
    //Tabs
    const tabs = document.querySelector("#product-tabs");
    tabs.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        if (tabName == undefined) {
            return;
        }

        const panels = document.querySelectorAll(".tab-panel");
        for (const panel of panels) {
            panel.classList.add("hidden");
        }

        const activePanel = document.querySelector("#tab-" + tabName);
            activePanel.classList.remove("hidden");
    });

    // Add to cart
    const addButton = document.querySelector("#product-add");
    const qtyInput = document.querySelector("#product-qty");
    addButton.addEventListener("click", () => {
        let quantity = Number(qtyInput.value);

        const productID = addButton.dataset.id;
        addToCart(productID, quantity);
        onCartChange(productID);
    });

}