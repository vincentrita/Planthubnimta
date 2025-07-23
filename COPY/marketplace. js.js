// Marketplace functionality
let cart = [];
let cartTotal = 0;

const productDatabase = {
    "peace-lily": {
        id: 1,
        name: "Classic Peace Lily",
        price: 29.99,
        originalPrice: 39.99,
        image: "./RITA BEST 1.jpg",
        seller: "Green Paradise",
        rating: "4.8",
        reviews: 127,
        shipping: "Free shipping",
        description: "It is very easy to plant.",
        features: ["Air purifying", "Low maintenance"],
        care: ["Water weekly", "Indirect sunlight"],
    },
    "premium peace-lily": {
        id: 2,
        name: "Premium Peace Lily",
        price: 49.99,
        originalPrice: null,
        image: "./RITA BEST 3.jpg",
        seller: "Plant Masters",
        rating: "4.6",
        reviews: 89,
        shipping: "Free shipping over $40",
        description: "It is a very beautiful plant.",
        features: ["Air purifying", "Low maintenance"],
        care: ["Water daily", "Direct sunlight"],
    },
    "tropical-foliage": {
        id: 3,
        name: "tropical foliage",
        price: 34.99,
        originalPrice: 30.99,
        image: "./RITA BEST 3.jpg",
        seller: "Urban Jungle",
        rating: "4.9",
        reviews: 156,
        shipping: "Free shipping",
        description: "It can stay with or without water.",
        features: ["Air purifying", "Low maintenance"],
        care: ["Water daily"],
    },
    "succulent-gardens": {
        id: 4,
        name: "Delicate Succulent Garden",
        price: 27.99,
        originalPrice: 32.99,
        image: "./RITA BEST 4.jpg",
        seller: "Desert Bloom",
        rating: "4.5",
        reviews: 73,
        shipping: "Free shipping",
        description: "It is good for decorating.",
        features: ["Direct sunlight", "Low amount of water"],
        care: ["Water daily"],
    },
    "designers-lily collection": {
        id: 5,
        name: "Designers-lily collection",
        price: 89.99,
        originalPrice: 62.98,
        image: "./RITA BEST 2.png",
        seller: "Desert Bloom",
        rating: "4.5",
        reviews: 73,
        shipping: "Free shipping",
        description: "It is good for decorating.",
        features: ["Direct sunlight", "Low amount of water"],
        care: ["Water daily"],
    },
    "luxury-vase": {
        id: 6,
        name: "Luxury Designer Vase Plant",
        price: 129.99,
        originalPrice: 100.00,
        image: "./RITA BEST 3.jpg",
        seller: "Elite Garden",
        rating: "5.0",
        reviews: 42,
        shipping: "Free shipping",
        description: "It is good for decorating.",
        features: ["Direct sunlight", "Low amount of water"],
        care: ["Water daily"],
    },
};

// Initialize marketplace
document.addEventListener('DOMContentLoaded', function () {
    initializeEventListeners();
    updateCartDisplay();
});

function initializeEventListeners() {
    // Cart toggle
    document.getElementById('cart-toggle').addEventListener('click', toggleCart);
    document.getElementById('cart-close').addEventListener('click', closeCart);

    // Search functionality
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') performSearch();
    });

    // Hero button
    document.querySelector('.hero-btn').addEventListener('click', function () {
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);

            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Category items
    document.querySelectorAll('.categories-item').forEach(item => {
        item.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });

            // Update filter button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            const filterBtn = document.querySelector(`[data-filter="${category}"]`);
            if (filterBtn) filterBtn.classList.add('active');
        });
    });

    // Add to cart buttons
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));

            addToCart(id, name, price);

            // Visual feedback
            e.target.textContent = 'Added!';
            e.target.style.background = '#27ae60';
            setTimeout(() => {
                e.target.textContent = 'Add to cart';
                e.target.style.background = '#2d5a27';
            }, 1000);
        }

        // Quick view buttons
        if (e.target.classList.contains('quick-view')) {
            const productId = e.target.getAttribute('data-id');
            showQuickView(productId);
        }

        // Deal buttons
        if (e.target.classList.contains('deal-btn')) {
            document.getElementById('featured').scrollIntoView({});
        }
    });

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('quick-view-modal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });

    // Overlay
    document.getElementById('overlay').addEventListener('click', function () {
        closeCart();
        closeModal();
    });

    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
}

// Cart functionality
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = Object.values(productDatabase).find(p => p.id === id);
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            image: product ? product.image : './plant',
        });
    }
    cartTotal += price;
    updateCartDisplay();

    // Show cart briefly
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('open');
    document.getElementById('overlay').classList.add('active');

    setTimeout(() => {
        if (!cartSidebar.matches(':hover')) {
            closeCart();
        }
    }, 2000);
}

function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cartTotal -= item.price * item.quantity;
        cart.splice(itemIndex, 1);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart total
    cartTotalElement.textContent = cartTotal.toFixed(2);

    // Update cart items
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        return;
    }

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; pointer; margin-top: 0.5rem;">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItemElement);
    });
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// Product filtering
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');

        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productSeller = product.querySelector('.seller').textContent.toLowerCase();

        if (productName.includes(searchTerm) || productSeller.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    // Scroll to products
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });

    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
}

// Quick view modal
function showQuickView(productId) {
    const product = productDatabase[productId];
    if (!product) return;

    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h1>${product.name}</h1>
                <div class="seller" style="margin-bottom: 1rem;">Sold by: ${product.seller}</div>
                <div class="rating" style="margin-bottom: 1rem;">
                    <span class="stars">${product.rating}</span>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="price-section" style="margin-bottom: 1rem;">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="shipping" style="margin-bottom: 1rem;">${product.shipping}</div>
                <p style="margin-bottom: 1.5rem;">${product.description}</p>
                <div class="product-specs">
                    <h4>Key Features:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <h4>Care Instructions:</h4>
                    <ul>
                        ${product.care.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-top: 2rem;">
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                        Add to cart - $${product.price}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('quick-view-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('quick-view-modal').style.display = 'none';
}

// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const orderSummary = cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');

    alert(`Order Summary:\n\n${orderSummary}\n\nTotal: $${cartTotal.toFixed(2)}\n\nThank you for your order! This is a PlantHub marketplace.`);

    // Clear cart
    cart = [];
    cartTotal = 0;
    updateCartDisplay();
    closeCart();
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});