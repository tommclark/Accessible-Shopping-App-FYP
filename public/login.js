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

// Handle keypad clicks
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
            window.location.href = '/#home'
            console.log('Success');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
