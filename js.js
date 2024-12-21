function calculateResult() {
    const resultField = document.getElementById('result');
    const historyContent = document.getElementById('history-content');

    try {
        // Дополняем недостающие закрывающие скобки
        const correctedExpression = addMissingBrackets(resultField.value);
        console.log("Скорректированное выражение:", correctedExpression);

        // Преобразуем выражение
        const expression = replaceAliases(convertPercentages(convertDegreesToRadians(correctedExpression)));
        console.log("Выражение для eval:", expression);

        // Вычисляем результат
        let result = eval(expression);
        result = parseFloat(result.toFixed(10)); // Округляем до 10 знаков

        // Добавляем результат в историю
        historyContent.innerHTML += `<div>${correctedExpression} = <strong>${result}</strong></div>`;
        resultField.value = result;

        isResult = true; // Устанавливаем флаг
    } catch (error) {
        alert('Ошибка в выражении');
        clearResult();
    }
}

function addMissingBrackets(expression) {
    let openBrackets = 0; // Счётчик открывающих скобок
    let closeBrackets = 0; // Счётчик закрывающих скобок

    // Подсчитываем количество открывающих и закрывающих скобок
    for (const char of expression) {
        if (char === '(') {
            openBrackets++;
        } else if (char === ')') {
            closeBrackets++;
        }
    }

    // Добавляем недостающие закрывающие скобки
    const missingBrackets = openBrackets - closeBrackets;
    if (missingBrackets > 0) {
        expression += ')'.repeat(missingBrackets);
    }

    return expression;
}

// Преобразование градусов в радианы
function convertDegreesToRadians(expression) {
    return expression
        .replace(/sin\(([^)]+)\)/g, "sin(($1)*Math.PI/180)")
        .replace(/cos\(([^)]+)\)/g, "cos(($1)*Math.PI/180)")
        .replace(/tan\(([^)]+)\)/g, "tan(($1)*Math.PI/180)")
        .replace(/asin\(([^)]+)\)/g, "asin(($1))*180/Math.PI")
        .replace(/acos\(([^)]+)\)/g, "acos(($1))*180/Math.PI")
        .replace(/atan\(([^)]+)\)/g, "atan(($1))*180/Math.PI");
}

// Замена коротких имен на Math-аналоги
function replaceAliases(expression) {
    return expression
        .replace(/π/g, "Math.PI") 
        .replace(/e/g, "Math.E") 
        .replace(/abs\(/g, "Math.abs(")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/asin\(/g, "Math.asin(")
        .replace(/acos\(/g, "Math.acos(")
        .replace(/atan\(/g, "Math.atan(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log(");
}


function appendValue(value) {
    const resultField = document.getElementById('result');

    if (isResult) { 
        resultField.value = ''; // Если отображён результат, очищаем поле
        isResult = false;
    }

    // Отображаем символы π и e
    if (value === 'PI') {
        resultField.value += 'π'; // Показываем символ π
    } else if (value === 'E') {
        resultField.value += 'e'; // Показываем символ e
    } else {
        resultField.value += value; // Добавляем обычное значение
    }
}



function clearResult() {
    const resultField = document.getElementById('result');
    resultField.value = ''; // Полностью очищаем поле
    isResult = false; // Сбрасываем флаг результата
}


let isResult = false; // Указывает, отображается ли результат в поле ввода


function toggleScientific() {
    const scientificButtons = document.querySelector('.scientific-buttons');
    if (scientificButtons.style.display === 'none' || scientificButtons.style.display === '') {
        scientificButtons.style.display = 'block';
    } else {
        scientificButtons.style.display = 'none';
    }
}

function convertPercentages(expression) {
    return expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");
}

function deleteLastChar() {
    const resultField = document.getElementById('result');
    if (resultField.value && !isResult) {
        // Удаляем последний символ
        resultField.value = resultField.value.slice(0, -1);
    }
}
