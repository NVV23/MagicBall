const ball = document.getElementById('ball');
const screen = document.getElementById('screen');
const responses = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

let dx = 0, dy = 0; // Направление и скорость движения шара
let animationFrame;
const maxSpeed = 5; // Максимальная скорость шара
const sensitivity = 0.1; // Чувствительность к наклону

// Функция для получения случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Функция для движения шара
function moveBall() {
    // Получаем текущие координаты шара
    let x = parseFloat(ball.style.left) || window.innerWidth / 2;
    let y = parseFloat(ball.style.top) || window.innerHeight / 2;

    // Обновляем координаты
    x += dx;
    y += dy;

    // Проверяем столкновение с границами экрана
    const ballRadius = ball.offsetWidth / 2;
    if (x < ballRadius) {
        x = ballRadius;
        dx = 0; // Останавливаем шар при столкновении
    }
    if (x > window.innerWidth - ballRadius) {
        x = window.innerWidth - ballRadius;
        dx = 0; // Останавливаем шар при столкновении
    }
    if (y < ballRadius) {
        y = ballRadius;
        dy = 0; // Останавливаем шар при столкновении
    }
    if (y > window.innerHeight - ballRadius) {
        y = window.innerHeight - ballRadius;
        dy = 0; // Останавливаем шар при столкновении
    }

    // Применяем новые координаты
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    // Рекурсивно вызываем функцию для следующего кадра
    animationFrame = requestAnimationFrame(moveBall);
}

// Обработчик события наклона телефона
window.addEventListener('deviceorientation', (event) => {
    const gamma = event.gamma; // Наклон влево-вправо (от -90 до 90)
    const beta = event.beta;   // Наклон вперед-назад (от -180 до 180)

    // Преобразуем наклон в скорость
    dx = gamma * sensitivity;
    dy = beta * sensitivity;

    // Ограничиваем максимальную скорость
    const currentSpeed = Math.hypot(dx, dy);
    if (currentSpeed > maxSpeed) {
        dx = (dx / currentSpeed) * maxSpeed;
        dy = (dy / currentSpeed) * maxSpeed;
    }

    // Запускаем движение шара, если оно еще не запущено
    if (!animationFrame) {
        moveBall();
    }
});

// Обработчик остановки движения
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 1; // Порог для определения остановки

    if (Math.hypot(acceleration.x, acceleration.y, acceleration.z) < threshold) {
        // Если телефон не двигается, останавливаем шар
        dx = 0;
        dy = 0;

        // Показываем ответ
        screen.textContent = getRandomResponse();
        screen.style.opacity = 1;
    }
});

// Инициализация начального положения шара
ball.style.left = `${window.innerWidth / 2}px`;
ball.style.top = `${window.innerHeight / 2}px`;