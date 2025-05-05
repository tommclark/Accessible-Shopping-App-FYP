const routes = {
    home: 'views/home.txt',
    calibration: 'views/calibration.txt',
    categories: 'views/categories.txt'
};

async function loadView(view) {
    const route = routes[view] || routes['home'];
    const res = await fetch(route);
    const html = await res.text();
    document.getElementById('app').innerHTML = html;



}

window.addEventListener('hashchange', () => {
    const view = location.hash.replace('#', '');
    loadView(view);
});

// Initial load
window.addEventListener('load', () => {
    const view = location.hash.replace('#', '') || 'home';
    loadView(view);
});
