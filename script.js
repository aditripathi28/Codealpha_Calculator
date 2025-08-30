const inputDisplay = document.getElementById('inputDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const buttons = document.querySelectorAll('.button');

let currentInput = '';
let previousInput = '';
let operator = null;
let result = 0;
let waitingForSecondOperand = false;

// Function to update the display
function updateDisplay() {
    if (waitingForSecondOperand && operator !== null && previousInput !== '') {
         inputDisplay.textContent = previousInput + ' ' + operator;
    } else {
         inputDisplay.textContent = previousInput + ' ' + (operator || '');
    }
    resultDisplay.textContent = currentInput || result || '0';
}

// Handle number clicks/inputs
function handleNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

// Handle decimal point
function handleDecimal() {
    if (!currentInput.includes('.')) {
        if (waitingForSecondOperand) {
            currentInput = '0.';
            waitingForSecondOperand = false;
        } else {
            currentInput += '.';
        }
    }
    updateDisplay();
}

// Handle operator clicks/inputs
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        inputDisplay.textContent = previousInput + ' ' + operator;
        return;
    }

    if (previousInput === '') {
        result = inputValue;
        previousInput = currentInput;
    } else if (operator) {
        const calculatedValue = calculate(parseFloat(previousInput), inputValue, operator);
        result = calculatedValue;
        previousInput = result;
        inputDisplay.textContent = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
    inputDisplay.textContent = previousInput + ' ' + operator;
    currentInput = '';
    updateDisplay();
}

// Handle the equals button
function handleEquals() {
    const inputValue = parseFloat(currentInput);
    if (operator === null || waitingForSecondOperand) {
        // Nothing to calculate
        return;
    }
    const calculatedValue = calculate(parseFloat(previousInput), inputValue, operator);
    result = calculatedValue;
    currentInput = result;
    previousInput = '';
    operator = null;
    waitingForSecondOperand = true; // Wait for a new number
    updateDisplay();
}

// Handle special actions
function handleAction(action) {
    switch(action) {
        case 'clear':
            currentInput = '';
            previousInput = '';
            operator = null;
            result = 0;
            waitingForSecondOperand = false;
            updateDisplay();
            break;
        case 'negate':
            currentInput = (parseFloat(currentInput) * -1).toString();
            updateDisplay();
            break;
        case 'percent':
            currentInput = (parseFloat(currentInput) / 100).toString();
            updateDisplay();
            break;
        case 'equals':
            handleEquals();
            break;
    }
}

// Perform the calculation
function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    }
    if (operator === '-') {
        return firstOperand - secondOperand;
    }
    if (operator === '*') {
        return firstOperand * secondOperand;
    }
    if (operator === '/') {
        if (secondOperand === 0) {
            // Prevent division by zero
            return 'Error';
        }
        return firstOperand / secondOperand;
    }
    return secondOperand;
}

// Event listener for button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.value) {
            handleNumber(button.dataset.value);
        } else if (button.dataset.action) {
            handleAction(button.dataset.action);
        } else if (['+', '-', '*', '/'].includes(button.textContent)) {
            handleOperator(button.textContent);
        } else if (button.textContent === '=') {
            handleEquals();
        }
    });
});

// Event listener for keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        handleNumber(key);
    } else if (key === '.') {
        handleDecimal();
    } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevents newline in some text areas
        handleEquals();
    } else if (key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        updateDisplay();
    } else if (key === 'Escape') {
        handleAction('clear');
    }
});

// Initialize display
updateDisplay();
