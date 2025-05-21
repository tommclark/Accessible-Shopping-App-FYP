console.log('current PIN: ' + enteredPIN);

function updateKeypad() {
    const display = document.querySelector('.keypad-display');

    if (isEnteringPassword) {
        display.textContent = 'Enter Password: ' + enteredPasswordPIN;
    }
    else {
        display.textContent = 'Enter PIN: ' + enteredPIN;
    }
}


document.querySelectorAll('#pinKeypad .clickable').forEach(button => {
    const value = button.textContent;
    if (!isNaN(value)) {
        button.addEventListener('click', () => {
            if (!isEnteringPassword && enteredPIN.length < 4) {
                enteredPIN += value;
                console.log('Current PIN:', enteredPIN);
                updateKeypad();
            } else if (isEnteringPassword && enteredPasswordPIN.length < 4) {
                enteredPasswordPIN += value;
                console.log('Current Password PIN: ', enteredPasswordPIN);
                updateKeypad();
            }
        });
    }
});

document.querySelector('#clear').addEventListener('click', () => {
    if (isEnteringPassword) {
        enteredPasswordPIN = '';
        console.log('Password PIN cleared');
    } else {
        enteredPIN = '';
        console.log('PIN cleared');
    }
    updateKeypad();
});

document.querySelector('#enter').addEventListener('click', () => {
    if (!isEnteringPassword) {
        if (enteredPIN.length !== 4) {
            alert('Please enter a 4-digit PIN.');
            return;
        }
        isEnteringPassword = true;
        updateKeypad();
    } else {
        if (enteredPasswordPIN.length !== 4) {
            alert('Please enter a 4-digit Password PIN.');
            return;
        }
        console.log('Password PIN entered:', enteredPasswordPIN);
        submitLogin();
    }
});

async function submitLogin() {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userPIN: enteredPIN, password: enteredPasswordPIN })
        });

        const result = await response.json();
        if (response.ok) {
            updateKeypad();
            const loggedInText = document.querySelector('#loggedIn');
            loggedInText.textContent = `Logged in as ${result.userPIN}`;
            localStorage.setItem('loggedInUser', result.userPIN);
            localStorage.setItem('isAdmin', result.isAdmin);
            isLoggedIn = true;
            setTimeout(() => {
                refreshNavbar();
            }, 100);
            window.location.href = '/#home'
            console.log(`Successfully logged in as ${result.userPIN}, admin status ${result.isAdmin}`);

        }
        else {
            const errorMsg = await response.json();
            alert(`Incorrect username or password: ${errorMsg}`);
            resetKeypad();

        }
    } catch (error) {
        console.error('Error:', error);
        errorText = document.querySelector('.keypad-display');
        resetKeypad();
        errorText.textContent = 'Incorrect username or password, please try again.';

    }
}

window.addEventListener('hashchange', () => {
    resetKeypad();
})

function resetKeypad() {
    enteredPIN = '';
    enteredPasswordPIN = '';
    isEnteringPassword = false;
    const display = document.querySelector('.keypad-display');
    if (display) {
        updateKeypad();
    }
}