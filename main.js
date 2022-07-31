const currentOperation = {
    firstOperand: null,
    operation: null,
    isActive: false,
    isNewOperand: true,
}
const display = document.querySelector('.display');
const display_result = document.querySelector('.display-result'); 


function add(a, b) {
    return +a + +b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if(b !== '0') {
        return a / b;
    }
    alert('Division by 0 is undefined.');
    currentOperation.firstOperand, currentOperation.operation = null;
    currentOperation.isActive = false;
}

function operate(operator, a, b) {
    const func = window[operator];
    return typeof func === 'function' ? func(a, b) : null;
    // return operator === 'add' ? add(a, b) : (operator === 'subtract' ? subtract(a, b) : 
    //     (operator === 'multiply' ? multiply(a, b) : (operator === 'divide' ? divide(a, b) : null)));
}

function createButtonListeners(className, listenerFunction) {
    const buttons = document.querySelectorAll(`.${className}`);
    buttons.forEach(button => {
        button.addEventListener('click', listenerFunction);
    });
}

function manageDisplayContent(e) {
    const operand = e.target.getAttribute('data-value');
    displayOperand(operand);
}

function displayOperand(operand) {
    const displayValue = display.textContent;
    if (currentOperation.isNewOperand) {
        display.textContent = operand;
        currentOperation.isNewOperand = false;
    }
    else {
        display.textContent = displayValue + operand;
    }
}

function manageOperators(e) {
    const isActive = currentOperation.isActive;
    const operation = e.target.getAttribute('data-value');
    const operationAbbr = e.target.textContent;
    if (isActive && currentOperation.isNewOperand) {
        currentOperation.operation = operation;
        display_result.textContent = `${currentOperation.firstOperand} ${operationAbbr} `;
        return;
    }

    let operand = display.textContent;
    const result = `${operand} ${operationAbbr} `;

    display_result.textContent = isActive ? display_result.textContent + result : result

    if (operation === 'equals') {
        (isActive && displayResult(operand));
        display_result.textContent = display.textContent;
        currentOperation.isActive = false;
        currentOperation.isNewOperand = true;
        return;
    }

    if (isActive) {
        operand = operate(currentOperation.operation, currentOperation.firstOperand, operand);
        display.textContent = operand;
    }

    currentOperation.firstOperand = operand;
    currentOperation.operation = operation;
    currentOperation.isActive = true;
    currentOperation.isNewOperand = true;

}

function displayResult(operand) {
    const result = operate(currentOperation.operation, currentOperation.firstOperand, operand);
    if (result || result === 0) {
        display.textContent = result % 1 === 0 ? result : result.toFixed(4);
    }
}

function main() {
    createButtonListeners('number', manageDisplayContent);
    createButtonListeners('operator', manageOperators);
}


// Main program
main();