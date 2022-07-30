function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return b === 0 ? 'Division by 0' : a / b;
}

function operate(operator, a, b) {
    return operator === '+' ? add(a, b) : (operator === '-' ? subtract(a, b) : (operator === '*' ? multiply(a, b) : (operator === '/' ? divide(a, b) : null)));
}

const numberButtons = document.querySelectorAll('.number');
const displayValue = document.querySelector('.display-value');
numberButtons.forEach(button => {
    button.addEventListener('click', function() {displayValue.textContent = button.id});
});

// Put above in a function.
// Format buttons manually, don't divide them in numbers and operators.