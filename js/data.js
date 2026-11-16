const url = "https://dummyjson.com/products?limit=100";
const PRODUCTS_KEY = 'products';

export async function getProducts() {
    try {
        const storage = localStorage.getItem(PRODUCTS_KEY);
        if (storage !== null) { 
            return JSON.parse(storage);
        }
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data.products));
            return data.products;
        }
        else { throw new Error('Error in fetching product data');}
    } catch (err) {
        console.error(err);
    }
}
