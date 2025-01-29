const ball = document.getElementById('ball');
const screen = document.getElementById('screen');
const responses = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

let isShaking = false;
let stopTimeout;
let dx = 0, dy = 0; // Направление и скорость движения шара
let animationFrame;
let deceleration = 0; // Замедление шара

// Функция для получения случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Функция для начала тряски
function startShaking() {
    if (!isShaking) {
        isShaking = true;
        screen.textContent = ""; // Очищаем экран

        // Задаем случайное направление движения
        const angle = Math.random() * 2 * Math.PI; // Случайный угол
        const speed = 10; // Начальная скорость движения
        dx = Math.cos(angle) * speed;
        dy = Math.sin(angle) * speed;

        // Запускаем движение шара
        moveBall();
    }
}

// Функция для остановки тряски
function stopShaking() {
    if (isShaking) {
        isShaking = false;

        // Запускаем плавное замедление шара
        deceleration = Math.hypot(dx, dy) / 120; // Замедление за 2 секунды (120 кадров)
        slowDownBall();
    }
}

// Функция для замедления шара
function slowDownBall() {
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        dx -= (dx / Math.hypot(dx, dy)) * deceleration;
        dy -= (dy / Math.hypot(dx, dy)) * deceleration;
        moveBall();
    } else {
        dx = 0;
        dy = 0;

        // Ждем 2 секунды, затем показываем ответ
        stopTimeout = setTimeout(() => {
            screen.textContent = getRandomResponse(); // Показываем случайный ответ
        }, 2000);
    }
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
        dx = Math.abs(dx); // Отскок от левой стенки
    }
    if (x > window.innerWidth - ballRadius) {
        x = window.innerWidth - ballRadius;
        dx = -Math.abs(dx); // Отскок от правой стенки
    }
    if (y < ballRadius) {
        y = ballRadius;
        dy = Math.abs(dy); // Отскок от верхней стенки
    }
    if (y > window.innerHeight - ballRadius) {
        y = window.innerHeight - ballRadius;
        dy = -Math.abs(dy); // Отскок от нижней стенки
    }

    // Применяем новые координаты
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    // Рекурсивно вызываем функцию для следующего кадра
    if (isShaking || Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animationFrame = requestAnimationFrame(moveBall);
    }
}

// Обработчик события тряски телефона
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 5; // Порог тряски

    if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) {
        startShaking();
    } else {
        stopShaking();
    }
});

// Для тестирования на компьютере
window.addEventListener('mousedown', startShaking);
window.addEventListener('mouseup', stopShaking);

// Инициализация начального положения шара
ball.style.left = `${window.innerWidth / 2}px`;
ball.style.top = `${window.innerHeight / 2}px`;