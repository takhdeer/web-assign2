const CART_KEY = 'cart';

export function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
}

function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function removeFromCart(productId) {
     return getCart().filter(p => p.id !== productId);
}

export function addToCart(productId, quantity = 1) {
    const cart = getCart();
    
    const existing = cart.find(p => p.id === productId);

    if (existing) {
        existing.quantity += quantity;
    }
    else {
        cart.push( {
            id: productId,
            quantity: quantity
        });
    }
    setCart(cart);
}

export function decreaseQuanity(productId) {
    const cart = getCart();
    const existing = cart.find(p => p.id === productId);
    if (!existing) { throw new Error('Item is not in the cart') }

    if (existing.quantity === 1) {
        const newCart = removeFromCart(existing.id);
        setCart(newCart);
        return;
    }
    existing.quantity -= 1; 
    setCart(cart);
}

export function getItemQuantity(productId) {
    const existing = getCart().find(p => p.id === productId);
    return existing ? existing.quantity : 0;
}

export function getCartCount() {
    const cart = getCart();
    let items = 0;
    cart.map(c => {
        items += c.quantity;
    })
    return items;
}