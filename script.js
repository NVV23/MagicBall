// Список ответов
const ANSWERS = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "А сам как думаешь?", "Да, хотя нет",
    "100%", "Маловероятно"
];

// Элементы DOM
const ball = document.getElementById('ball');
const answerElement = document.getElementById('answer');
const shakeButton = document.getElementById('shakeButton');
const bounceSound = document.getElementById('bounceSound');

// Параметры движения
let x = window.innerWidth / 2 - 75, y = window.innerHeight / 2 - 75;
let dx = 0, dy = 0, isStopped = true, answerShown = false;
let startTime = 0;

const initialSpeed = 13, deceleration = 0.99, constantSpeedDuration = 1000;

// Установка начального положения шара
function setInitialPosition() {
    x = window.innerWidth / 2 - 75;
    y = window.innerHeight / 2 - 75;
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

// Генерация случайного направления
function getRandomDirection() {
    const angle = (Math.PI / 4) * (Math.floor(Math.random() * 4) + 1) + (Math.random() - 0.5) * (Math.PI / 18);
    return { dx: Math.cos(angle), dy: Math.sin(angle) };
}

// Начать движение шара
function startMovement() {
    if (!isStopped) return;

    console.log("Шар начал движение!"); // Отладочное сообщение

    isStopped = false;
    answerShown = false;
    const direction = getRandomDirection();
    dx = direction.dx * initialSpeed;
    dy = direction.dy * initialSpeed;
    startTime = Date.now();
    ball.classList.remove('glow-active'); // Убираем яркое свечение при движении
}

// Движение шара
function moveBall() {
    if (isStopped) return;

    x += dx;
    y += dy;

    // Отскок от стенок
    let hitWall = false;
    if (x <= 0 || x >= window.innerWidth - 150) { dx = -dx; hitWall = true; }
    if (y <= 0 || y >= window.innerHeight - 150) { dy = -dy; hitWall = true; }

    if (hitWall) {
        bounceSound.currentTime = 0;
        bounceSound.play();
    }

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    if (Date.now() - startTime > constantSpeedDuration) {
        dx *= deceleration;
        dy *= deceleration;
    }

    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        isStopped = true;
        if (!answerShown) {
            answerElement.textContent = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
            answerElement.classList.add('show');
            ball.classList.add('glow-active'); // Добавляем яркое свечение при остановке
            answerShown = true;
        }
    }

    requestAnimationFrame(moveBall);
}

// Подготовка звука
function preloadAudio() {
    bounceSound.play().catch(() => {});
    bounceSound.pause();
    bounceSound.currentTime = 0;
}

// Обработчик тряски телефона
if (window.DeviceMotionEvent) {
    let lastShakeTime = 0, shakeCooldown = 300;

    window.addEventListener('devicemotion', (event) => {
        if (Date.now() - lastShakeTime < shakeCooldown) return;

        const acceleration = Math.sqrt(
            event.accelerationIncludingGravity.x ** 2 +
            event.accelerationIncludingGravity.y ** 2 +
            event.accelerationIncludingGravity.z ** 2
        );

        if (acceleration > 15) {
            console.log("Тряска обнаружена!"); // Отладочное сообщение
            startMovement();
            lastShakeTime = Date.now();
        }
    });
}

// Обработчики кнопки "Имитировать тряску"
shakeButton.addEventListener('touchstart', () => startMovement());
shakeButton.addEventListener('mousedown', () => startMovement());

// Инициализация
setInitialPosition();
preloadAudio();
moveBall();