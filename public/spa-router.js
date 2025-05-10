const routes = {
    home: 'views/home.txt',
    loginregister: 'views/loginregister.txt',
    categories: 'views/categories.txt',
    login: 'views/login.html',
    register: 'views/register.html'
};

async function loadView(view) {
    const route = routes[view] || routes['home'];
    const res = await fetch(route);
    const pageContent = await res.text();
    document.getElementById('app').innerHTML = pageContent;

    // Load register script when on register page
    if (view === 'register') {
        const script = document.createElement('script');
        script.src = 'register.js';
        document.body.appendChild(script);
    }

    if (view === 'login') {
        const script = document.createElement('script');
        script.src = 'login.js';
        document.body.appendChild(script);
    }
}

window.addEventListener('hashchange', () => {
    const view = location.hash.replace('#', '');
    loadView(view);
});

// When page is loaded without a hash or is empty, default to home page (initial load)
window.addEventListener('load', () => {
    const view = location.hash.replace('#', '') || 'home';
    loadView(view);
});
