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
        ball.style.opacity = 1; // Делаем шар видимым
        ball.textContent = ""; // Очищаем текст
        shakeTimer = setInterval(moveBall, 50); // Увеличили частоту перемещения
    }
}

// Функция для остановки тряски
function stopShaking() {
    if (isShaking) {
        clearInterval(shakeTimer); // Останавливаем перемещение шара
        isShaking = false;

        // Ждем 2 секунды, затем показываем ответ
        stopTimeout = setTimeout(() => {
            ball.textContent = getRandomResponse(); // Показываем случайный ответ
        }, 2000);
    }
}

// Обработчик события тряски телефона
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 5; // Уменьшили порог тряски

    if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) {
        startShaking();
    } else {
        stopShaking();
    }
});

// Для тестирования на компьютере
window.addEventListener('mousedown', startShaking);
window.addEventListener('mouseup', stopShaking);

// Ограничение по ширине экрана устройства
function adjustBallPosition() {
    const maxWidth = window.innerWidth - ball.offsetWidth;
    const maxHeight = window.innerHeight - ball.offsetHeight;
    let x = parseFloat(ball.style.left);
    let y = parseFloat(ball.style.top);

    if (x < 0) x = 0;
    if (x > maxWidth) x = maxWidth;
    if (y < 0) y = 0;
    if (y > maxHeight) y = maxHeight;

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

// Следим за изменением размеров экрана
window.addEventListener('resize', adjustBallPosition);