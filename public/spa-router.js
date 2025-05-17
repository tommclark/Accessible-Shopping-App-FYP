const routes = {
    home: 'views/home.txt',
    loginregister: 'views/loginregister.txt',
    categories: 'views/categories.txt',
    login: 'views/login.html',
    register: 'views/register.html',
    admin: 'views/admin.html'
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
        
        // script.onload = () => {
        //     if (typeof resetKeypad === 'function') {
        //         resetKeypad();
        //     }
        // };
    }

    if (isLoggedIn && view === 'loginregister' ) {
        loginButton = document.querySelector('#loginButton');
        registerButton = document.querySelector('#registerButton');
    
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
    }

    
}

window.addEventListener('hashchange', () => {
    const view = location.hash.replace('#', '');
    loadView(view);
});

if (isLoggedIn && view === 'loginregister' ) {
    loginButton = document.querySelector('#loginButton');
    registerButton = document.querySelector('#registerButton');

    loginButton.setAttribute('style', 'display:none');
}


// When page is loaded without a hash or is empty, default to home page (initial load)
window.addEventListener('load', () => {
    const view = location.hash.replace('#', '') || 'home';
    loadView(view);
});
