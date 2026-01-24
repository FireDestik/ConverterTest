'use strict'
const currencyCalcBtn = document.querySelector('#cur-calc-btn');
const currencyDisplay = document.querySelector('#cur-result-display');
const serverstatus = document.getElementById('server-status');
const apikey = "7535bec19c459bb981a2d018";
window.openTab = function(evt, tabName) {
    let i, tabContent, tabBtns;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
    }
    tabBtns = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}
currencyCalcBtn.addEventListener('click', () => {
    const currencyFrom = document.querySelector('#cur-from');
    const currencyAmount = document.querySelector('#cur-amount');
    const currencyType = document.querySelector('#cur-type');
    
    const selectedFrom = currencyFrom.value;
    const selectedTo = currencyType.value;
    const amount = parseFloat(currencyAmount.value);

    if (isNaN(amount)) {
        currencyDisplay.innerText = "Пожалуйста, введите сумму";
        return; 
    }
    const apirequest = `https://v6.exchangerate-api.com/v6/${apikey}/latest/${selectedFrom}`;
    fetch(apirequest)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            serverstatus.innerText = "Статус сервера: данные получены";
            return response.json();
        })
        .then(data => {
            const rate = data.conversion_rates[selectedTo];
            const result = amount * rate; 
            currencyDisplay.innerText = `Результат: ${result.toFixed(2)} ${selectedTo}`;
        })
        .catch(error => {
            serverstatus.innerText = "Статус сервера: ошибка";
            currencyDisplay.style.color = "red";
            console.error(error);
        });
});

document.querySelector('#volume-btn').addEventListener('click', () => {
    const liters = parseFloat(document.querySelector('#volume-input').value);
    const type = document.querySelector('#volume-type').value;
    const display = document.querySelector('#volume-result');
    
    if (isNaN(liters)) {
        display.innerText = "Введите число";
        return;
    }
    if (type === 'ml') {
        display.innerText = `Результат: ${liters * 1000} мл`;
    } else {
        display.innerText = `Результат: ${(liters * 4.226).toFixed(2)} ст.`;
    }
});