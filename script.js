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
const decelerationRate = 0.9;

// Генерация случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Начало тряски
function startShaking() {
    isShaking = true;

    // Убираем старый ответ
    screen.style.opacity = 0;
    screen.textContent = "";

    // Начальные направления движения
    const angle = Math.random() * 2 * Math.PI;
    dx = Math.cos(angle) * 10;
    dy = Math.sin(angle) * 10;

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
    let x = parseFloat(ball.style.left) || (window.innerWidth - ball.offsetWidth) / 2;
    let y = parseFloat(ball.style.top) || (window.innerHeight - ball.offsetHeight) / 2;

    // Обновляем координаты
    x += dx;
    y += dy;

    // Отражение от стенок
    if (x <= 0) {
        x = 0;
        dx = -dx;
    }
    if (x >= window.innerWidth - ball.offsetWidth) {
        x = window.innerWidth - ball.offsetWidth;
        dx = -dx;
    }
    if (y <= 0) {
        y = 0;
        dy = -dy;
    }
    if (y >= window.innerHeight - ball.offsetHeight) {
        y = window.innerHeight - ball.offsetHeight;
        dy = -dy;
    }

    // Применяем новые координаты
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    // Плавная остановка, если тряска прекращена
    if (!isShaking) {
        dx *= decelerationRate;
        dy *= decelerationRate;

        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
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
const centerX = (window.innerWidth - ball.offsetWidth) / 2;
const centerY = (window.innerHeight - ball.offsetHeight) / 2;
ball.style.left = `${centerX}px`;
ball.style.top = `${centerY}px`;
