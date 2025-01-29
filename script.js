const ball = document.getElementById('ball');
const responses = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

let isShaking = false;
let shakeTimer;

// Функция для получения случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Функция для перемещения шара
function moveBall() {
    const x = Math.random() * (window.innerWidth - ball.offsetWidth);
    const y = Math.random() * (window.innerHeight - ball.offsetHeight);
    ball.style.transform = `translate(${x}px, ${y}px)`;
}

// Функция для начала тряски
function startShaking() {
    if (!isShaking) {
        isShaking = true;
        ball.textContent = "🎱"; // Сбрасываем текст на эмодзи шара
        ball.classList.add('shaking'); // Добавляем класс для вращения
        shakeTimer = setInterval(moveBall, 100); // Перемещаем шар каждые 100 мс
    }
}

// Функция для остановки тряски
function stopShaking() {
    if (isShaking) {
        clearInterval(shakeTimer); // Останавливаем перемещение шара
        isShaking = false;
        ball.classList.remove('shaking'); // Убираем класс для вращения
        ball.textContent = getRandomResponse(); // Показываем случайный ответ
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