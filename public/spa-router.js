const routes = {
    home: 'views/home.txt',
    loginregister: 'views/loginregister.txt',
    categories: 'views/categories/categories.html',
    categoriesfresh: 'views/categories/categories-fresh.html',
    categoriesfreshmeat: 'views/categories/categories-fresh-meat.html',
    categoriesfreshvegetables: 'views/categories/categories-fresh-vegetables.html',
    categoriesfreshother: 'views/categories/categories-fresh-other.html',
    categoriesfrozen: 'views/categories/categories-frozen.html',
    categoriesfrozenmeat: 'views/categories/categories-frozen-meat.html',
    categoriesfrozenvegetables: 'views/categories/categories-frozen-vegetables.html',
    categoriesfrozenother: 'views/categories/categories-frozen-other.html',
    login: 'views/login.html',
    register: 'views/register.html',
    basket: 'views/basket.html',
    orders: 'views/orders.html',
    admin: 'views/admin.html'
};

function displayProducts(products) {
    const container = document.createElement('div');
    container.classList.add('product-container');
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card', 'clickable');
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: £${product.price}</p>
            <p>Category: ${product.category}</p>
            <p>${product.description || ''}</p>
        `;
        card.addEventListener('click', async () => {
            const userPIN = localStorage.getItem('loggedInUser');
            if (!userPIN) {
                alert('You must be logged in to add items to the basket');
                return;
            }
            try {
                const response = await fetch('/basket/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userPIN, itemID: product._id })
                });
                const result = await response.json();
                console.log(result.message);
            } catch (error) {
                console.error(error);
            }
        });
        container.appendChild(card);
    });
    const app = document.querySelector('#app');
    app.innerHTML = '';
    app.appendChild(container);
}

async function loadView(view) {
    const route = routes[view] || routes['home'];
    const res = await fetch(route);
    const pageContent = await res.text();
    document.querySelector('#app').innerHTML = pageContent;

    switch (view) {
        case 'register':
            {
                const script = document.createElement('script');
                script.src = 'register.js';
                document.body.appendChild(script);
            }
            break;
        case 'login':
            {
                const script = document.createElement('script');
                script.src = 'login.js';
                document.body.appendChild(script);
            }
            break;
        case 'admin':
            {
                const form = document.querySelector('#productForm');
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const productData = {
                        name: document.querySelector('#name').value,
                        price: parseFloat(document.querySelector('#price').value),
                        category: document.querySelector('#category').value,
                        description: document.querySelector('#description').value
                    };
                    try {
                        const response = await fetch('/add-item', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(productData)
                        });
                        if (response.ok) {
                            console.log('Success adding');
                        } else {
                            console.log('Failed adding');
                        }
                    } catch (error) {
                        console.error('Error adding product:', error);
                    }
                });
            }
            break;
        case 'categories':
            {
                const freshBtn = document.querySelector('#freshButton');
                const frozenBtn = document.querySelector('#frozenButton');
                if (freshBtn) freshBtn.addEventListener('click', () => window.location.hash = '#categoriesfresh');
                if (frozenBtn) frozenBtn.addEventListener('click', () => window.location.hash = '#categoriesfrozen');
            }
            break;
        case 'categoriesfresh':
            {
                const freshMeatBtn = document.querySelector('#freshMeatButton');
                const freshVegBtn = document.querySelector('#freshVegButton');
                const freshOtherBtn = document.querySelector('#freshOtherButton');
                if (freshMeatBtn) freshMeatBtn.addEventListener('click', () => window.location.hash = '#categoriesfreshmeat');
                if (freshVegBtn) freshVegBtn.addEventListener('click', () => window.location.hash = '#categoriesfreshvegetables');
                if (freshOtherBtn) freshOtherBtn.addEventListener('click', () => window.location.hash = '#categoriesfreshother');
            }
            break;
        case 'categoriesfreshmeat':
            try {
                const res = await fetch('/freshMeatProducts');
                const products = await res.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
            }
            break;
        case 'categoriesfreshvegetables':
            try {
                const res = await fetch('/freshVegProducts');
                const products = await res.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
            }
            break;
        case 'categoriesfreshother':
            try {
                const res = await fetch('/freshOtherProducts');
                const products = await res.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
            }
            break;
        case 'categoriesfrozen':
            {
                const freshMeatBtn = document.querySelector('#frozenMeatButton');
                const freshVegBtn = document.querySelector('#frozenVegButton');
                const freshOtherBtn = document.querySelector('#frozenOtherButton');
                if (freshMeatBtn) freshMeatBtn.addEventListener('click', () => window.location.hash = '#categoriesfrozenmeat');
                if (freshVegBtn) freshVegBtn.addEventListener('click', () => window.location.hash = '#categoriesfrozenvegetables');
                if (freshOtherBtn) freshOtherBtn.addEventListener('click', () => window.location.hash = '#categoriesfrozenother');
            }
            break;
        case 'categoriesfrozenmeat':
            try {
                const res = await fetch('/frozenMeatProducts');
                const products = await res.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
            }
            break;
        case 'categoriesfrozenvegetables':
            try {
                const res = await fetch('/frozenVegProducts');
                const products = await res.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
            }
            break;
        case 'categoriesfrozenother':
            try {
                const res = await fetch('/frozenOtherProducts');
                const products = await res.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
            }
            break;
        case 'basket':
            {
                const userPIN = localStorage.getItem('loggedInUser');
                if (!userPIN) {
                    document.querySelector('#app').innerHTML = '<h3>You must be logged in to add items to your basket</h3>';
                    return;
                }
                try {
                    const response = await fetch(`/basket/${userPIN}`);
                    const basket = await response.json();
                    const basketArea = document.createElement('div');
                    basketArea.classList.add('basket-area');
                    if (basket.length === 0) {
                        basketArea.innerHTML = '<h3>Your basket is empty</h3>';
                    } else {
                        let total = 0;
                        const basketCard = document.createElement('div');
                        basketCard.classList.add('basket-card');
                        basket.forEach(element => {
                            const item = element.item;
                            const lineTotal = parseFloat(item.price) * element.quantity;
                            total += lineTotal;
                            const itemDiv = document.createElement('div');
                            itemDiv.classList.add('basket-item');
                            itemDiv.innerHTML = `
                                <span>${item.name} x ${element.quantity}</span>
                                <span>£${parseFloat(item.price).toFixed(2)}</span>
                            `;
                            basketCard.appendChild(itemDiv);

                            // Remove button for each item
                            const removeButton = document.createElement('button');
                            removeButton.textContent = 'Remove Item';
                            removeButton.addEventListener('click', async () => {
                                try {
                                    const response = await fetch('/basket/remove', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ userPIN, itemID: item._id })
                                    });
                                    const result = await response.json();
                                    if (response.ok) {
                                        itemDiv.remove();
                                    }
                                } catch (error) {
                                    alert('Remove item failed');
                                }
                            });
                            itemDiv.appendChild(removeButton);
                        });

                        // Total price
                        const totalDiv = document.createElement('div');
                        totalDiv.classList.add('basket-total');
                        totalDiv.textContent = `Total: £${total.toFixed(2)}`;
                        basketCard.appendChild(totalDiv);

                        // Order button
                        const orderButton = document.createElement('button');
                        orderButton.id = 'orderButton';
                        orderButton.textContent = 'Order';
                        orderButton.addEventListener('click', async () => {
                            try {
                                const response = await fetch('/order', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userPIN })
                                });
                                const result = await response.json();
                                if (response.ok) {
                                    basketArea.innerHTML = '<h3>Order placed successfully</h3>';
                                }
                            } catch (error) {
                                console.error(error);
                            }
                        });
                        basketCard.appendChild(orderButton);

                        basketArea.appendChild(basketCard);
                    }
                    const app = document.querySelector('#app');
                    app.innerHTML = '';
                    app.appendChild(basketArea);
                } catch (error) {
                    console.error(error);
                }
            }
            break;
        case 'orders':
            {
                const userPIN = localStorage.getItem('loggedInUser');
                if (!userPIN) {
                    document.querySelector('#app').innerHTML = '<h3>You must be logged in to view your orders</h3>';
                    return;
                }
                try {
                    const response = await fetch(`/orders/${userPIN}`);
                    const orders = await response.json();
                    const ordersArea = document.createElement('div');
                    ordersArea.classList.add('orders-area');
                    if (orders.length === 0) {
                        ordersArea.innerHTML = '<h3>No past orders found.</h3>';
                    } else {

                        orders.forEach(order => {
                            let total = 0;
                            const orderDetails = document.createElement('div');
                            orderDetails.classList.add('order-card');
                            orderDetails.innerHTML = `<h3>Order placed at: ${new Date(order.createdAt).toLocaleString()}</h3>`;
                            order.items.forEach(element => {
                                const item = element.item;
                                const lineTotal = item.price * element.quantity;
                                total += lineTotal;
                                orderDetails.innerHTML += `
                                    <div class="order-item>
                                    <span>${item.name} - £${item.price} x ${element.quantity}</span>
                                    </div>`;
                            });
                            orderDetails.innerHTML += `<div class="order-total">Total: £${total.toFixed(2)}</div>`
                            ordersArea.appendChild(orderDetails);
                        });
                    }
                    document.querySelector('#app').innerHTML = '';
                    document.querySelector('#app').appendChild(ordersArea);
                } catch (error) {
                    document.querySelector('#app').innerHTML = '<h3>Error loading orders.</h3>';
                }
            }
            break;
    }
}

window.addEventListener('hashchange', () => {
    const view = location.hash.replace('#', '');
    loadView(view);
});

window.addEventListener('load', () => {
    const view = location.hash.replace('#', '') || 'home';
    loadView(view);
});
