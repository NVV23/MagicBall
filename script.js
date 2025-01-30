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
let dx = 0, dy = 0; // Направление движения шара
let animationFrame;
const maxSpeed = 5; // Максимальная скорость шара
let decelerationStartTime = 0; // Время начала замедления
let isStopping = false; // Флаг для замедления

// Функция для получения случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Функция для начала тряски
function startShaking() {
    if (!isShaking) {
        isShaking = true;
        isStopping = false; // Сбрасываем флаг замедления
        screen.textContent = ""; // Очищаем экран
        screen.style.opacity = 0; // Скрываем экран

        // Задаем случайное направление движения
        const angle = Math.random() * 2 * Math.PI; // Случайный угол
        dx = Math.cos(angle) * maxSpeed;
        dy = Math.sin(angle) * maxSpeed;

        // Запускаем движение шара
        moveBall();
    }
}

// Функция для остановки тряски
function stopShaking() {
    if (isShaking) {
        isShaking = false;
        isStopping = true; // Включаем замедление
        decelerationStartTime = performance.now(); // Запоминаем время начала замедления
        slowDownBall();
    }
}

// Функция для замедления шара
function slowDownBall() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - decelerationStartTime; // Время с начала замедления
    const decelerationDuration = 3000; // Замедление в течение 3 секунд

    if (elapsedTime < decelerationDuration) {
        // Плавно уменьшаем скорость
        const progress = elapsedTime / decelerationDuration;
        dx = dx * (1 - progress);
        dy = dy * (1 - progress);
        moveBall();
    } else {
        // Полная остановка
        dx = 0;
        dy = 0;
        isStopping = false;

        // Показываем ответ
        screen.textContent = getRandomResponse(); // Показываем случайный ответ
        screen.style.opacity = 1; // Плавное появление ответа
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
    if (isShaking || isStopping) {
        animationFrame = requestAnimationFrame(moveBall);
    }
}

// Обработчик события тряски телефона
let lastShakeTime = 0;
const shakeCooldown = 500; // Задержка между событиями тряски (в миллисекундах)

window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 2; // Уменьшенный порог тряски для более чувствительного реагирования

    // Проверяем, прошло ли достаточно времени с последней тряски
    const currentTime = performance.now();
    if (currentTime - lastShakeTime < shakeCooldown) return;

    if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) {
        lastShakeTime = currentTime;
        startShaking();
    } else {
        stopShaking();
    }
});

// Инициализация начального положения шара
ball.style.left = `${window.innerWidth / 2}px`;
ball.style.top = `${window.innerHeight / 2}px`;