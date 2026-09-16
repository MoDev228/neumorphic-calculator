let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

const displayExpression = document.querySelector(".calculator__expression");
const displayResult = document.querySelector(".calculator__result");
const buttons = document.querySelector(".calculator__buttons");

function inputNumber(number) {
  if (currentInput === "0" || shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else {
    currentInput += number;
  }

  displayResult.textContent = currentInput;
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0";
    shouldResetDisplay = false;
  }

  if (currentInput.includes(".")) {
    return;
  }

  currentInput += ".";

  displayResult.textContent = currentInput;
}

function chooseOperator(selectedOperator) {
  if (operator !== null && previousInput !== null && !shouldResetDisplay) {
    calculate();
  }

  previousInput = currentInput;
  operator = selectedOperator;
  shouldResetDisplay = true;

  displayExpression.textContent = `${previousInput} ${selectedOperator}`;
}

function inputPercentage() {
  const number = Number(currentInput);

  if (!Number.isFinite(number)) {
    return;
  }

  if (previousInput !== null && operator !== null) {
    const baseNumber = Number(previousInput);

    if (!Number.isFinite(baseNumber)) {
      return;
    }

    if (operator === "+" || operator === "-") {
      currentInput = String((baseNumber * number) / 100);
    } else {
      currentInput = String(number / 100);
    }
  } else {
    currentInput = String(number / 100);
  }

  displayResult.textContent = currentInput;
}

function showError(message) {
  displayExpression.textContent = "Erreur";
  displayResult.textContent = message;

  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
}

function formatResult(number) {
  if (!Number.isFinite(number)) {
    return "Erreur";
  }

  const absoluteNumber = Math.abs(number);

  // Très grand nombre ou très petit nombre.
  if (
    absoluteNumber >= 1e15 ||
    (absoluteNumber > 0 && absoluteNumber < 1e-10)
  ) {
    return number.toExponential(10);
  }

  // Nombre normal.
  return Number.parseFloat(number.toFixed(10)).toString();
}

function calculate() {
  if (previousInput === null || operator === null) {
    return;
  }

  const firstNumber = Number(previousInput);
  const secondNumber = Number(currentInput);

  if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
    showError("Nombre invalide");
    return;
  }

  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "*":
      result = firstNumber * secondNumber;
      break;

    case "/":
      if (secondNumber === 0) {
        showError("Division impossible");
        return;
      }

      result = firstNumber / secondNumber;
      break;

    default:
      return;
  }

  currentInput = formatResult(result);

  displayExpression.textContent = `${previousInput} ${operator} ${secondNumber} =`;

  displayResult.textContent = currentInput;

  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
}

function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;

  displayExpression.textContent = "";
  displayResult.textContent = currentInput;
}

function deleteLastCharacter() {
  if (shouldResetDisplay) {
    return;
  }

  if (currentInput.length <= 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  displayResult.textContent = currentInput;
}

function handleKeyboard(event) {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    inputNumber(key);
    return;
  }

  if (key === "." || key === ",") {
    inputDecimal();
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
    return;
  }

  if (key === "%") {
    inputPercentage();
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Backspace") {
    deleteLastCharacter();
    return;
  }

  if (key === "Escape") {
    clearCalculator();
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const number = button.dataset.number;
  const action = button.dataset.action;
  const selectedOperator = button.dataset.operator;

  if (number !== undefined) {
    if (number === ".") {
      inputDecimal();
      return;
    }

    inputNumber(number);
    return;
  }

  if (selectedOperator !== undefined) {
    chooseOperator(selectedOperator);
    return;
  }

  if (action === "percentage") {
    inputPercentage();
    return;
  }

  if (action === "clear") {
    clearCalculator();
    return;
  }

  if (action === "delete") {
    deleteLastCharacter();
    return;
  }

  if (action === "calculate") {
    calculate();
  }
});

document.addEventListener("keydown", handleKeyboard);
