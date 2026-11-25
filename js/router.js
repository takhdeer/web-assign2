import { renderBrowse, showCategory } from "./browse.js";
import { renderCartView } from "./view/cartView.js";

const viewIDs = {
    home: "home",
    category: "category",
    browse: "browse",
    product: "singleProduct",
    cart: "cart"
};

export function showView(viewName) {
    const selectedID = viewIDs[viewName];

    // hides every view
    const views = document.querySelectorAll(".view");
    for (let i = 0 ; i < views.length ; i++) {
        views[i].classList.add("hidden");
    }

    // show selected view
    const selected = document.querySelector("#" + selectedID);
    selected.classList.remove("hidden");

    //scrolls to top of page (https://www.w3schools.com/jsref/met_win_scrollto.asp)
    window.scrollTo(0,0);
}

export function initRouter(products) {
    document.addEventListener("click", (e) => {
        const viewName = e.target.dataset.view;
        
        // check if navigation click
        if (viewName === undefined) {
            return;
        }

        if (viewName === "cart") {
            e.preventDefault();
            showView(viewName);
            renderCartView(products);
            return;
        }

        if (viewName === "browse") {
            const category = e.target.dataset.category;
            if (category !== undefined) {
                showCategory(category);
            } else {
                renderBrowse(products);
            }
        }

        e.preventDefault();

        // switch views
        showView(viewName);
    });
}