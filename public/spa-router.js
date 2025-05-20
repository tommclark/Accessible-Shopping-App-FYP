const routes = {
    home: 'views/home.txt',
    loginregister: 'views/loginregister.txt',
    categories: 'views/categories/categories.html',
    categoriesfresh: 'views/categories/categories-fresh.html',
    categoriesfreshmeat: 'views/categories/categories-fresh-meat.html',
    categoriesfreshvegetables: 'views/categories/categories-fresh-vegetables.html',
    categoriesfreshother: 'views/categories/categories-fresh-other.html',
    categoriesfrozen: 'views/categories/categories-frozen.html',
    login: 'views/login.html',
    register: 'views/register.html',
    admin: 'views/admin.html'
};

async function loadView(view) {
    const route = routes[view] || routes['home'];
    const res = await fetch(route);
    const pageContent = await res.text();
    document.getElementById('app').innerHTML = pageContent;

    // Load relevant scripts when on corresponding page

    if (view === 'register') {
        const script = document.createElement('script');
        script.src = 'register.js';
        document.body.appendChild(script);
    }

    if (view === 'login') {
        const script = document.createElement('script');
        script.src = 'login.js';
        document.body.appendChild(script);

        // script.onload = () => {
        //     if (typeof resetKeypad === 'function') {
        //         resetKeypad();
        //     }
        // };
    }

    if (view === 'admin') {
        const form = document.getElementById('productForm');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const productData = {
                name: document.getElementById('name').value,
                price: parseFloat(document.getElementById('price').value),
                category: document.getElementById('category').value,
                description: document.getElementById('description').value
            };

            try {
                const response = await fetch('/add-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });
                if (response.ok) {
                    console.log('Success adding');
                }
                else {
                    console.log('Failed adding');
                }
            } catch (error) {
                console.error('Error adding product:', error)

            }
        })
    }

    if (isLoggedIn && view === 'loginregister') {
        loginButton = document.querySelector('#loginButton');
        registerButton = document.querySelector('#registerButton');

        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
    }

    if (view === 'categories') {
        const freshBtn = document.getElementById('freshButton');
        const frozenBtn = document.getElementById('frozenButton');
        if (freshBtn) {
            freshBtn.addEventListener('click', () => {
                window.location.hash = '#categoriesfresh';
            });
        }
        if (frozenBtn) {
            frozenBtn.addEventListener('click', () => {
                window.location.hash = '#categoriesfrozen';
            });
        }
    }

    if (view === 'categoriesfresh') {
        const freshMeatBtn = document.getElementById('freshMeatButton');
        const freshVegBtn = document.getElementById('freshVegButton');
        const freshOtherBtn = document.getElementById('freshOtherButton');


        freshMeatBtn.addEventListener('click', () => {
            window.location.hash = '#categoriesfreshmeat';
        });

        freshVegBtn.addEventListener('click', () => {
            window.location.hash = '#categoriesfreshvegetables';
        });

        freshOtherBtn.addEventListener('click', () => {
            window.location.hash = '#categoriesfreshother';
        });

    }
    // HERE
    if (view === 'categoriesfreshmeat') {
        try {
            const res = await fetch('/freshMeatProducts');
            const products = await res.json();
            displayProducts(products);

        } catch (err) {
            console.error('Error loading products:', err);

        }
    }

    if (view === 'categoriesfreshvegetables') {
        try {
            const res = await fetch('/freshVegProducts');
            const products = await res.json();
            displayProducts(products);

        } catch (err) {
            console.error('Error loading products:', err);

        }
    }

    function displayProducts(products) {
        const container = document.createElement('div');
        container.classList.add('product-container');


        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.classList.add('clickable');
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: £${product.price}</p>
                <p>Category: ${product.category}</p>
                <p>${product.description || ''}</p>
            `;
            container.appendChild(card);
        });

        const app = document.getElementById('app');
        app.innerHTML = '';
        app.appendChild(container);
    }

}

window.addEventListener('hashchange', () => {
    const view = location.hash.replace('#', '');
    loadView(view);
});

if (isLoggedIn && view === 'loginregister') {
    loginButton = document.querySelector('#loginButton');
    registerButton = document.querySelector('#registerButton');

    loginButton.setAttribute('style', 'display:none');
}


// When page is loaded without a hash or is empty, default to home page (initial load)
window.addEventListener('load', () => {
    const view = location.hash.replace('#', '') || 'home';
    loadView(view);
});
