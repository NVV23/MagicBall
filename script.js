const ball = document.getElementById('ball');
const screen = document.getElementById('screen');
const responses = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

let dx = 0, dy = 0;
let isShaking = false;
let animationFrame;
let speed = 0;
const maxSpeed = 8;
const decelerationRate = 0.95;

// Генерация случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Начало тряски
function startShaking() {
    isShaking = true;

    // Генерируем начальное направление
    const angle = Math.random() * 2 * Math.PI;
    dx = Math.cos(angle) * maxSpeed;
    dy = Math.sin(angle) * maxSpeed;

    // Убираем старый ответ
    screen.style.opacity = 0;
    screen.textContent = "";

    if (!animationFrame) {
        moveBall();
    }
}

// Конец тряски
function stopShaking() {
    isShaking = false;
}

// Движение шара
function moveBall() {
    let x = parseFloat(ball.style.left) || window.innerWidth / 2;
    let y = parseFloat(ball.style.top) || window.innerHeight / 2;

    // Обновляем координаты
    x += dx;
    y += dy;

    // Отражение от стенок
    if (x <= 0 || x >= window.innerWidth - ball.offsetWidth) {
        dx = -dx;
    }
    if (y <= 0 || y >= window.innerHeight - ball.offsetHeight) {
        dy = -dy;
    }

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    if (!isShaking) {
        dx *= decelerationRate;
        dy *= decelerationRate;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            dx = 0;
            dy = 0;
            screen.textContent = getRandomResponse();
            screen.style.opacity = 1;
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
            return;
        }
    }

    animationFrame = requestAnimationFrame(moveBall);
}

// Обработчик тряски
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 2;

    if (Math.hypot(acceleration.x, acceleration.y, acceleration.z) > threshold) {
        if (!isShaking) {
            startShaking();
        }
    } else {
        if (isShaking) {
            stopShaking();
        }
    }
});

// Установка начального положения
ball.style.left = `${window.innerWidth / 2 - ball.offsetWidth / 2}px`;
ball.style.top = `${window.innerHeight / 2 - ball.offsetHeight / 2}px`;
