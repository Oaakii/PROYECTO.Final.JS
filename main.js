const products = [
    { id: 1, name: "Laptop", price: 1200, },
    { id: 2, name: "Celular", price: 800 },
    { id: 3, name: "Auriculares", price: 150 },
    { id: 4, name: "Teclado", price: 100 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts() {
    const container = document.getElementById("products-container");
    container.innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");

        div.innerHTML = `
            <span>${product.name} - $${product.price}</span>
            <button onclick="addToCart(${product.id})">Agregar</button>
        `;

        container.appendChild(div);
    });
}
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-container");
    container.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <span>${item.name} x${item.quantity} - $${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${item.id})">Eliminar</button>
        `;

        container.appendChild(div);
    });

    renderSummary();
}
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function renderSummary() {
    const summary = document.getElementById("cart-summary");

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    summary.innerHTML = `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>IVA (21%): $${iva.toFixed(2)}</p>
        <h3>Total: $${total.toFixed(2)}</h3>
    `;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        Swal.fire("El carrito está vacío");
        return;
    }

    Swal.fire({
        title: "¿Confirmar compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, comprar"
    }).then(result => {
        if (result.isConfirmed) {
            cart = [];
            saveCart();
            renderCart();

            Swal.fire("¡Compra realizada con éxito!", "", "success");
        }
    });
});

renderProducts();
renderCart();
