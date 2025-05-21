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
        submitRegistration();
    }
});

async function submitRegistration() {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userPIN: enteredPIN, password: enteredPasswordPIN })
        });

        const result = await response.text();
        if (response.ok) {
            enteredPIN = '';
            enteredPasswordPIN = '';
            isEnteringPassword = false;
            updateKeypad();
            window.location.href = '/#home';
        } else {
            resetKeypad();
            const display = document.querySelector('.keypad-display');
            display.textContent = result || 'Registration failed. Try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        errorText = document.querySelector('.keypad-display');
        resetKeypad();
        errorText.textContent = 'Invalid username or password, please try again.';
    }
}

function resetKeypad() {
    enteredPIN = '';
    enteredPasswordPIN = '';
    isEnteringPassword = false;
    const display = document.querySelector('.keypad-display');
    if (display) {
        updateKeypad();
    }
}
