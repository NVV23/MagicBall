const ball = document.getElementById('ball');
const responses = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

let isShaking = false;
let shakeTimer;
let stopTimeout;

// Функция для получения случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Функция для перемещения шара
function moveBall() {
    const x = Math.random() * (window.innerWidth - ball.offsetWidth);
    const y = Math.random() * (window.innerHeight - ball.offsetHeight);
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

// Функция для начала тряски
function startShaking() {
    if (!isShaking) {
        isShaking = true;
        ball.textContent = ""; // Убираем текст
        ball.classList.add('shaking'); // Добавляем класс для вращения
        shakeTimer = setInterval(moveBall, 100); // Перемещаем шар каждые 100 мс
    }
}

// Функция для остановки тряски
function stopShaking() {
    if (isShaking) {
        clearInterval(shakeTimer); // Останавливаем перемещение шара
        isShaking = false;

        // Добавляем класс для плавной остановки вращения
        ball.classList.remove('shaking');
        ball.classList.add('stopping');

        // Ждем 2 секунды, затем показываем ответ
        stopTimeout = setTimeout(() => {
            ball.classList.remove('stopping');
            ball.classList.add('showing-answer');
            ball.textContent = getRandomResponse(); // Показываем случайный ответ
        }, 2000);
    }
}

// Обработчик события тряски телефона
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 15; // Порог тряски

    if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) {
        startShaking();
    } else {
        stopShaking();
    }
});

// Для тестирования на компьютере
window.addEventListener('mousedown', startShaking);
window.addEventListener('mouseup', stopShaking);