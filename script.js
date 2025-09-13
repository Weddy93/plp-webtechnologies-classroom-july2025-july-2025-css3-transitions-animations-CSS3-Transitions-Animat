let cart = [];
let cartCount = 0;
let cartTotal = 0;

const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const quickViewButtons = document.querySelectorAll('.quick-view');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const overlay = document.getElementById('overlay');
const shopNowButton = document.getElementById('shopNow');

function init() {
    setupEventListeners();
}

function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', handleQuickView);
    });
    
    closeModal.addEventListener('click', closeProductModal);
    
    overlay.addEventListener('click', () => {
        closeProductModal();
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    });
    
    shopNowButton.addEventListener('click', () => {
        document.querySelector('.products').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function handleAddToCart(e) {
    const productId = e.target.getAttribute('data-id');
    const productName = e.target.getAttribute('data-name');
    const productPrice = parseFloat(e.target.getAttribute('data-price'));
    
    addToCart(productId, productName, productPrice);
    
    const button = e.target;
    button.textContent = 'Added!';
    button.style.backgroundColor = '#3d8e6a';
    
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = '#4caf82';
    }, 1500);
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalElement.textContent = cartTotal.toFixed(2);
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

function handleRemoveItem(e) {
    const productId = e.target.getAttribute('data-id');
    removeFromCart(productId);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

function handleQuickView(e) {
    const productId = e.target.getAttribute('data-id');
    showProductModal(productId);
}

function showProductModal(id) {
    const products = {
        '1': {
            name: 'Snake Plant',
            price: '$24.99',
            description: 'The Snake Plant is a hardy, low-maintenance plant that purifies air by removing toxins. It thrives in indirect light and requires minimal watering, making it perfect for beginners.',
            benefits: 'Removes formaldehyde, benzene, and other toxins from the air. Releases oxygen at night, improving sleep quality.'
        },
        '2': {
            name: 'Organic Potting Mix',
            price: '$14.99',
            description: 'Our premium organic potting mix is specially formulated to provide optimal nutrition for your plants. Contains compost, peat moss, perlite, and natural fertilizers.',
            benefits: 'Promotes healthy root development. Improves soil structure and water retention. 100% natural and chemical-free.'
        },
        '3': {
            name: 'Spider Plant',
            price: '$19.99',
            description: 'Spider Plants are excellent air purifiers that are easy to grow and maintain. They produce "spiderettes" that can be propagated to create new plants.',
            benefits: 'Removes formaldehyde, xylene, and toluene from the air. Safe for pets. Increases humidity levels.'
        },
        '4': {
            name: 'Self-Watering Pot',
            price: '$29.99',
            description: 'This innovative self-watering pot maintains optimal soil moisture levels, preventing both overwatering and underwatering. Includes a water level indicator.',
            benefits: 'Prevents root rot from overwatering. Reduces watering frequency. Promotes healthier plant growth.'
        }
    };
    
    const product = products[id];
    modalTitle.textContent = product.name;
    modalContent.innerHTML = `
        <p><strong>Price:</strong> ${product.price}</p>
        <p>${product.description}</p>
        <h3>Health Benefits:</h3>
        <p>${product.benefits}</p>
        <button class="add-to-cart modal-add" data-id="${id}" data-name="${product.name}" data-price="${product.price.slice(1)}">Add to Cart</button>
    `;
    
    productModal.classList.add('active');
    overlay.classList.add('active');
    
    const modalAddButton = document.querySelector('.modal-add');
    modalAddButton.addEventListener('click', function() {
        addToCart(
            this.getAttribute('data-id'),
            this.getAttribute('data-name'),
            parseFloat(this.getAttribute('data-price'))
        );
        closeProductModal();
    });
}

function closeProductModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
}

init();
