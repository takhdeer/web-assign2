const DURATION = 3000;

export function showToast(message, type = "success") {
    const container = document.querySelector("#toast-container");

    // offset to right below header
    const header = document.querySelector("header");
    container.style.top = header.offsetHeight + 16 + "px";

    const toast = document.createElement("div");
    toast.className =
        "pointer-events-auto -translate-y-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg opacity-0 transition duration-300 " +
        (type === "error" ? "bg-red-600" : "bg-brand-600");
    toast.textContent = message;
    container.appendChild(toast);

    // had to nest, it wasnt working on my browser
    // this is because the first requestAnimationFrame runs before the next frame is drawn. Thats the same frame in which the toast was added, so the starting state still hasnt been drawn.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove("opacity-0", "-translate-y-2");
        });
    });

    // fade out, then remove from the DOM
    setTimeout(() => {
        toast.classList.add("opacity-0", "-translate-y-2");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });  // once caises the 2nd firing (for translate) to not get stuck on removing it
    }, DURATION);
}
