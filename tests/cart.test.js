import { addToCart, decreaseQuanity } from '../js/cart.js';

const CART_KEY = 'cart';

function read() {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
}

export function runCartTests() {
    const backup = localStorage.getItem(CART_KEY);
    let passed = 0;
    let failed = 0;

    function check(label, actual, expected) {
        const pass = JSON.stringify(actual) === JSON.stringify(expected);
        if (pass) {
            passed++;
            console.log(`✅ ${label}`);
        } else {
            failed++;
            console.log(`❌ ${label}`, { actual, expected });
        }
    }

    function run(label, fn) {
        try {
            fn();
        } catch (err) {
            console.log(`💥✅ ${label} threw:`, err.message);
        }
    }

    try {
        localStorage.removeItem(CART_KEY);
        check('empty cart reads as []', read(), []);

        run('add new', () => addToCart(1));
        check('add new item', read(), [{ id: 1, quantity: 1 }]);

        run('add same', () => addToCart(1));
        check('adding same item bumps quantity', read(), [{ id: 1, quantity: 2 }]);

        run('add qty', () => addToCart(2, 3));
        check('add with quantity', read(), [{ id: 1, quantity: 2 }, { id: 2, quantity: 3 }]);

        run('decrease', () => decreaseQuanity(1));
        check('decrease 2 -> 1', read(), [{ id: 1, quantity: 1 }, { id: 2, quantity: 3 }]);

        run('decrease to 0', () => decreaseQuanity(1));
        check('decrease 1 -> removed, others kept', read(), [{ id: 2, quantity: 3 }]);

        run('decrease missing', () => decreaseQuanity(99));
        check('decrease missing item leaves cart alone', read(), [{ id: 2, quantity: 3 }]);
    } finally {
        if (backup === null) {
            localStorage.removeItem(CART_KEY);
        } else {
            localStorage.setItem(CART_KEY, backup);
        }
    }

    console.log(`${passed} passed, ${failed} failed. Original cart restored.`);
}
