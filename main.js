const currentOperation = {
    firstOperand: null,
    operation: null,
    answer: null,
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
    processOperand(operand);
}

function processOperand(operand) {
    if (operand === 'answer') {
        const answer = currentOperation.answer;
        if (!answer) {
            return;
        }
        operand = answer;
    }
    else if (operand === 'decimal') {
        operand = '.';
        if (display.textContent.split("").includes('.')) return;
    }
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
    const node = e.target;
    const operation = node.getAttribute('data-full_name');
    const operationAbbr = node.getAttribute('data-value');
    processOperation(operation, operationAbbr);
}

function processOperation(operation, operationAbbr) {

    if(isOperationChange(operation, operationAbbr)) return; // Change of operation with no operand

    let operand = display.textContent;
    const result = `${operand} ${operationAbbr} `;

    setResult(result); // Set result on the display
    if(operation === 'equals') { // Check if operation is equals
        handleEquals(operand);
        return;
    }

    if (currentOperation.isActive) {
        operand = operate(currentOperation.operation, currentOperation.firstOperand, operand);
        display.textContent = operand;
    }

    currentOperation.firstOperand = operand;
    currentOperation.operation = operation;
    currentOperation.answer = operand;
    currentOperation.isActive = true;
    currentOperation.isNewOperand = true;

}

function handleEquals(operand) {
    const result = operate(currentOperation.operation, currentOperation.firstOperand, operand);
    (currentOperation.isActive && displayResult(result));
    display_result.textContent = display.textContent;
    currentOperation.answer = result;
    currentOperation.isActive = false;
    currentOperation.isNewOperand = true;
}

function setResult(result) {
    display_result.textContent = currentOperation.isActive ? display_result.textContent + result : result
}

function isOperationChange(operation, operationAbbr) {
    if (currentOperation.isActive && currentOperation.isNewOperand) {
        if (operationAbbr !== '=') {
            currentOperation.operation = operation;
            display_result.textContent = `${currentOperation.firstOperand} ${operationAbbr} `;
        }
        return true;
    }
    return false;
}

function displayResult(result) {
    if (result || result === 0) {
        display.textContent = result % 1 === 0 ? result : result.toFixed(4);
    }
}

function manageClearButtons(e) {
    processClearFunction(e.target.getAttribute('data-value'));
}

function processClearFunction(funcName) {
    const func = window[`${funcName}_action`];
    if (typeof func === 'function') {
        func();
    }
}

function clear_action() {
    currentOperation.firstOperand = null;
    currentOperation.operation = null;
    currentOperation.answer = null;
    currentOperation.isActive = false;
    currentOperation.isNewOperand = true;
    display_result.textContent = "";
    display.textContent = 0;
}

function delete_action() {
    const displayValue = display.textContent;
    const length = displayValue.length;
    if (length < 2) {
        if (displayValue !== '0') {
            display.textContent = 0;
        }
        currentOperation.isNewOperand = true;
        return;
    }

    display.textContent = displayValue.substring(0, length-1);
}

function createKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        manageKeyPressed(e);
    });
}

function manageKeyPressed(e) {
    let key = e.key.toLowerCase();
    switch (key) {
        case 'enter':
            key = '=';
            break;
        case 'backspace':
            key = 'delete';
            break;
        case 'escape':
            key = 'clear';
            break;
    }

    const node = document.querySelector(`[data-value="${key}"]`);
    if (!node) return;

    const nodeClassList = node.classList.value;
    const nodeClasses = nodeClassList.split(" ");

    if (nodeClasses.includes("operand")) {
        processOperand(key);
    }
    else if (nodeClasses.includes("operator")) {
        processOperation(node.getAttribute('data-full_name'), key);
    }
    else if (nodeClasses.includes("clear-action")) {
        processClearFunction(key);
    }
}

function blurAllButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.onclick = () => button.blur());
}

function main() {
    createButtonListeners('operand', manageDisplayContent);
    createButtonListeners('operator', manageOperators);
    createButtonListeners('clear-action', manageClearButtons);
    createKeyboardListeners();
    blurAllButtons();
}


// Main program
main();