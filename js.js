function calculateResult() {
    const resultField = document.getElementById('result');
    const historyContent = document.getElementById('history-content');

    try {
        // Дополняем недостающие закрывающие скобки
        const correctedExpression = addMissingBrackets(resultField.value);
        console.log("Скорректированное выражение:", correctedExpression);

        // Последовательно обрабатываем выражение
        let expression = replaceAliases(correctedExpression); // Заменяем короткие имена
        expression = convertDegreesToRadians(expression); // Преобразуем градусы в радианы
        expression = convertPercentages(expression); // Преобразуем проценты
        console.log("Выражение для eval:", expression);

        // Вычисляем результат
        let result = eval(expression);
        result = parseFloat(result.toFixed(10)); // Округляем до 10 знаков

        // Добавляем результат в историю
        historyContent.innerHTML += `<div>${correctedExpression} = <strong>${result}</strong></div>`;
        resultField.value = result;

        isResult = true; // Устанавливаем флаг
    } catch (error) {
        console.error("Ошибка в выражении:", error.message);
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

// Замена коротких имен на Math-аналоги
function replaceAliases(expression) {
    return expression
        .replace(/\basin\(/g, "Math.asin(") // Заменяем asin, где \b означает "начало слова"
        .replace(/\bacos\(/g, "Math.acos(") // Заменяем acos
        .replace(/\batan\(/g, "Math.atan(") // Заменяем atan
        .replace(/\bsin\(/g, "Math.sin(")   // Заменяем sin
        .replace(/\bcos\(/g, "Math.cos(")   // Заменяем cos
        .replace(/\btan\(/g, "Math.tan(")   // Заменяем tan
        .replace(/\babs\(/g, "Math.abs(")   // Заменяем abs
        .replace(/\bsqrt\(/g, "Math.sqrt(") // Заменяем sqrt
        .replace(/\blog\(/g, "Math.log(")   // Заменяем log
        .replace(/π/g, "Math.PI")           // Заменяем π на Math.PI
        .replace(/e/g, "Math.E");           // Заменяем e на Math.E
}

function convertDegreesToRadians(expression) {
    return expression
        .replace(/Math\.sin\(([^)]+)\)/g, "Math.sin(($1)*Math.PI/180)") // sin(x)
        .replace(/Math\.cos\(([^)]+)\)/g, "Math.cos(($1)*Math.PI/180)") // cos(x)
        .replace(/Math\.tan\(([^)]+)\)/g, "Math.tan(($1)*Math.PI/180)") // tan(x)
        .replace(/Math\.asin\(([^)]+)\)/g, "Math.asin(($1))*180/Math.PI") // asin(x)
        .replace(/Math\.acos\(([^)]+)\)/g, "Math.acos(($1))*180/Math.PI") // acos(x)
        .replace(/Math\.atan\(([^)]+)\)/g, "Math.atan(($1))*180/Math.PI"); // atan(x)
}

function appendValue(value) {
    const resultField = document.getElementById('result');

    if (isResult) { 
        resultField.value = ''; // Если отображён результат, очищаем поле
        isResult = false;
    }

    //Проверка для избежания ошибок
    if (value === '.' && (resultField.value === '' || /[+\-*(]$/.test(resultField.value))) { 
        alert('Число не может начинаться с точки'); // Не даёт ввести первым символом в числе точку
        return;
    }
    if (resultField.value === '0' && value !== '.') {
        alert('После 0 - только точка'); // Не даёт ввести цифру после 0
        return;
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
