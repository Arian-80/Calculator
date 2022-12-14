const currentOperation = {
    firstOperand: null,
    operation: null,
    answer: null,
    isActive: false,
    isNewOperand: true,
}
const display = document.querySelector('.display');
const display_result = document.querySelector('.display-result'); 

function resetCurrentOperation() {
    currentOperation.firstOperand = null;
    currentOperation.answer = null;
    currentOperation.operation = null;
    currentOperation.isActive = false;
    currentOperation.isNewOperand = true;
}

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
    resetCurrentOperation();
}

function operate(operator, a, b) {
    const func = window[operator]; // Get function as the value of the operator argument
    return typeof func === 'function' ? func(a, b) : null; // Check if function is valid, e.g. add
}

function createButtonListeners(className, listenerFunction) { // Adds general event listeners for buttons with a given class
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
    if (display.offsetWidth > 295) { // Prevents horizontal overflow from the display
        return;
    }
    if (operand === 'answer') { // Set input as the previous answer
        const answer = currentOperation.answer;
        if (!answer) {
            return;
        }
        operand = answer;
    }
    else if (operand === '.') { // Process decimal point
        operand = '.';
        if (display.textContent.split("").includes('.')) return; // Only allow 1 decimal point in an operand
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
    const operationAbbr = node.getAttribute('data-value'); // Abbreviation of the operator, e.g. +
    processOperation(operation, operationAbbr);
}

function processOperation(operation, operationAbbr) {
    if(isOperationChange(operation, operationAbbr)) return; // Change of operation with no operand

    let operand = display.textContent;
    let result = `${operand} ${operationAbbr} `;
    let resultOverflowed = false;

    if (display_result.offsetWidth > 285) { // Prevent horizontal overflow
        resultOverflowed = true;
    }

    if(operation === 'equals') {
        handleEquals(operand);
        return;
    }

    if (currentOperation.isActive) { // Process chained operations without '=' being pressed.
        operand = operate(currentOperation.operation, currentOperation.firstOperand, operand);
        display.textContent = operand;
    }

    if (resultOverflowed) {
        setResult(`${operand} ${operationAbbr} `);
    }
    else {
        result = currentOperation.isActive ? display_result.textContent + result : result;
        setResult(result);
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
    setResult(display.textContent);
    currentOperation.answer = result;
    currentOperation.isActive = false;
    currentOperation.isNewOperand = true;
}

function setResult(result) { // Set result on display
    display_result.textContent = result;
}

function isOperationChange(operation, operationAbbr) { // Check and process if the operator has only changed and no new operand has been entered
    if (currentOperation.isActive && currentOperation.isNewOperand) {
        if (operationAbbr !== '=') {
            currentOperation.operation = operation;
            setResult(`${currentOperation.firstOperand} ${operationAbbr} `);
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
    const func = window[`${funcName}_action`]; // Get function as the value of the argument and add a suffix of _action, e.g. delete_action 
    if (typeof func === 'function') {
        func();
    }
}

function clear_action() { // Reset the calculator
    resetCurrentOperation();
    setResult("");
    display.textContent = 0;
}

function delete_action() { // Delete the last digit of the current operand
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
    switch (key) { // Map certain keys to their corresponding actions
        case 'enter':
            key = '=';
            break;
        case 'backspace':
            key = 'delete';
            break;
        case 'escape':
            key = 'clear';
            break;
        case 'a':
            key = 'answer';
            break;
    }

    const node = document.querySelector(`[data-value="${key}"]`);
    if (!node) return; // Make sure there is a node with an associated key/action.

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

function blurAllButtons() { // Blur all buttons so pressing enter does not enter the previous input (if entered by mouse click)
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