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

const initialSpeed = 15, deceleration = 0.99;

// Установка начального положения шара
function setInitialPosition() {
    x = window.innerWidth / 2 - 75;
    y = window.innerHeight / 2 - 75;
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

// Генерация случайного направления по диагоналям с отклонением
function getRandomDirection() {
    const baseAngles = [
        Math.PI / 4,   // 45° (право-верх)
        3 * Math.PI / 4, // 135° (лево-верх)
        5 * Math.PI / 4, // 225° (лево-низ)
        7 * Math.PI / 4  // 315° (право-низ)
    ];

    const baseAngle = baseAngles[Math.floor(Math.random() * baseAngles.length)];
    const deviation = (Math.random() - 0.5) * (10 * Math.PI / 180); // ±10°
    const angle = baseAngle + deviation;

    return {
        dx: Math.cos(angle),
        dy: Math.sin(angle)
    };
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

    answerElement.classList.remove('show'); // Скрываем ответ при начале движения
    ball.classList.remove('glow-active'); // Убираем яркое свечение при движении
}

// Движение шара
function moveBall() {
    if (isStopped) return;

    x += dx;
    y += dy;

    // Ограничение движения шара в пределах экрана
    if (x <= 0 || x >= window.innerWidth - 150) { dx = -dx; }
    if (y <= 0 || y >= window.innerHeight - 150) { dy = -dy; }

    // Обновление позиции шара
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    // Замедление шара
    dx *= deceleration;
    dy *= deceleration;

    // Проверка остановки шара
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
    let lastShakeTime = 0, shakeCooldown = 400;

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