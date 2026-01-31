'use strict';


const API_KEY = "7535bec19c459bb981a2d018";

// коэфф. пересчёта (сколько в 1 литре)
const volumeRates = {
    l: 1,
    ml: 1000,
    cup: 4.226,
    tsp: 202.88,
    tbsp: 67.628,
    floz: 33.814
};

// Названия единиц
const volumeUnits = {
    l: "л.",
    ml: "мл",
    cup: "ст.",
    tsp: "ч.л.",
    tbsp: "ст.л.",
    floz: "fl oz"
};

//переключение вкладок
window.openTab = function(evt, tabName) {
    // скрываем все блоки с контентом
    const tabContents = document.getElementsByClassName("tab-content");
    for (let content of tabContents) {
        content.classList.remove("active");
    }

    // убираем подсветку со всех кнопок
    const tabButtons = document.getElementsByClassName("tab-btn");
    for (let btn of tabButtons) {
        btn.classList.remove("active");
    }

    // показываем нужный блок и кнопку
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    // сброс текста при переключении на объём
    if (tabName === 'volume-section') {
        document.getElementById('volume-result').innerText = "Введите данные...";
    }
};

//ВАЛЮТА
const currencyCalcBtn = document.querySelector('#cur-calc-btn');
const currencyDisplay = document.querySelector('#cur-result-display');
const serverStatus = document.getElementById('server-status');

currencyCalcBtn.addEventListener('click', () => { //при клике
    const fromCurrency = document.querySelector('#cur-from').value;
    const toCurrency = document.querySelector('#cur-type').value;
    const amount = parseFloat(document.querySelector('#cur-amount').value);

    // введено ли число?
    if (isNaN(amount)) {
        currencyDisplay.innerText = "Пожалуйста, введите сумму";
        return;
    }

    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сервера');
            serverStatus.innerText = "Статус сервера: данные получены";
            return response.json();
        })
        .then(data => {
            const rate = data.conversion_rates[toCurrency];
            const result = amount * rate; //кол-во * курс
            currencyDisplay.innerText = `Результат: ${result.toFixed(2)} ${toCurrency}`;
            currencyDisplay.style.color = "black";
        })
        .catch(error => {
            serverStatus.innerText = "Статус сервера: ошибка";
            currencyDisplay.innerText = "Не удалось получить курс";
            currencyDisplay.style.color = "red";
            console.error(error);
        });
});

// Свап (обмен) валют местами
document.querySelector('#cur-swap-btn').addEventListener('click', () => {
    const fromSelect = document.querySelector('#cur-from');
    const toSelect = document.querySelector('#cur-type');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    // Пересчитываем сразу, если введено число
    if (document.querySelector('#cur-amount').value) {
        currencyCalcBtn.click();
    }
});

//ОБЪЁМ
const volumeBtn = document.querySelector('#volume-btn');

volumeBtn.addEventListener('click', () => {
    const value = parseFloat(document.querySelector('#volume-input').value);
    const fromUnit = document.querySelector('#volume-from').value;
    const toUnit = document.querySelector('#volume-to').value;
    const display = document.querySelector('#volume-result');

    if (isNaN(value)) {
        display.innerText = "Введите число";
        return;
    }

    // (Значение / курс исходной единицы) * курс целевой единицы
    const result = (value / volumeRates[fromUnit]) * volumeRates[toUnit];
    
    // Для литров делаем 4 знака после запятой, для остального — 2
    const precision = (toUnit === 'l') ? 4 : 2;
    
    display.innerText = `Результат: ${result.toFixed(precision)} ${volumeUnits[toUnit]}`;
});

// Свап объёма
document.querySelector('#vol-swap-btn').addEventListener('click', () => {
    const fromSelect = document.querySelector('#volume-from');
    const toSelect = document.querySelector('#volume-to');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    if (document.querySelector('#volume-input').value) {
        volumeBtn.click();
    }
});