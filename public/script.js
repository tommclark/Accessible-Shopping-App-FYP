const dwellTime = 500; // The amount of time it takes to trigger a click in ms
let gazeTarget = null;
let gazeTimer = null;
let enteredPIN = '';
let enteredPasswordPIN = '';
let isEnteringPassword = false;
let isLoggedIn = false;
let modeDisabled = false;


function toggleMode() {
    modeDisabled = !modeDisabled;
    document.querySelectorAll('.clickable').forEach(element => {
        if (!element.classList.contains('modebutton')) {
            if (modeDisabled) {
                element.classList.add('disabledclickable');
            } else {
                element.classList.remove('disabledclickable');
            }
        }
    });
}


function onPoint(point) {


    const x = point[0]; // x-coordinate
    const y = point[1]; // y-coordinate


    const elements = document.elementsFromPoint(x, y);
    const target = elements.find(el => el.classList.contains("clickable"));

    // Handle gaze target changes
    if (target !== gazeTarget) {
        if (gazeTarget) {
            gazeTarget.classList.remove("hovered");
        }
        gazeTarget = target;
        if (gazeTarget) {
            gazeTarget.classList.add("hovered");
            startDwellTimer(gazeTarget);
        } else {
            clearDwellTimer();
        }
    }
}

// Start the dwell timer for a gaze target to trigger clicks after 1000ms
function startDwellTimer(element) {
    clearDwellTimer();
    gazeTimer = setTimeout(() => {
        element.click(); // Trigger a click on the element being looked at
        console.log("Clicked:", element.id);
    }, dwellTime);
}

// Clear the dwell timer
function clearDwellTimer() {
    if (gazeTimer) {
        clearTimeout(gazeTimer);
        gazeTimer = null;
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    const loggedInText = document.querySelector('#loggedIn');
    isEnteringPassword = false;
    isLoggedIn = false;
    if (loggedInText) {
        loggedInText.textContent = 'Login/Register';
    }

    loginButton = document.querySelector('#loginButton');
    registerButton = document.querySelector('#registerButton');

    loginButton.style.display = 'block';
    registerButton.style.display = 'block';
    setTimeout(() => {
        refreshNavbar();
    }, 100);

    window.location.href = '/#loginregister';
}

function refreshNavbar() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const loggedInText = document.querySelector('#loggedIn');
    const adminSettings = document.querySelector('#admin-settings');

    if (loggedInText && loggedInUser) {
        loggedInText.textContent = `Logged in as: ${loggedInUser}`;
    }

    if (isLoggedIn && isAdmin && adminSettings) {
        adminSettings.style.display = 'block';
    } else if (adminSettings) {
        adminSettings.style.display = 'none';
    }
}

// Add click event listeners to clickable elements
document.querySelectorAll(".clickable").forEach(el => {
    el.addEventListener("click", () => alert("You selected: " + el.id));
});

document.addEventListener('DOMContentLoaded', () => {
    const gestures = new EyeGestures('video', onPoint);
    gestures.start();
    const backButton = document.querySelector('.backbutton');
    backButton.addEventListener('click', () => {
        window.history.back();
    });
    refreshNavbar();

    const modeButton = document.querySelector('.modebutton');
    modeButton.addEventListener('click', () => {
        toggleMode();
    })

    const loggedInText = document.querySelector('#loggedIn');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    isLoggedIn = !!loggedInUser;

    if (loggedInUser && loggedInText) {
        loggedInText.textContent = `Logged in as: ${loggedInUser}`;
    }


    if (isLoggedIn && isAdmin) {
        document.querySelector('#admin-settings').style.display = 'block';

    }
    else {
        document.querySelector('#admin-settings').style.display = 'none';
    }
});
