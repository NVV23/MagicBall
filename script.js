// Список ответов
const ANSWERS = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "А сам как думаешь?", "Да, хотя нет",
    "100%", "Маловероятно", "Определённо да!", "Скорее всего нет", "Попробуй ещё раз", "Всё возможно", "Доверься судьбе",
    "Жди чуда", "Без сомнений", "Нет, и не надейся",
    "Может быть завтра","Не торопи события", "Это твой выбор", "Спроси у другого шара",
    "Я в этом уверен", "Ты сам знаешь ответ", "Шансы равны",
    "Действуй смело", "Рискни", "Это тайна",
    "Подожди немного", "Тебе решать", "Не стоит сомневаться",
    "Слишком рано", "Звёзды молчат", "Ты на правильном пути",
    "Почему бы и нет?", "Слушай своё сердцечко", "Это плохая идея"
];

// DOM-элементы
const ball = document.getElementById('ball');
const answerElement = document.getElementById('answer');
const shakeButton = document.getElementById('shakeButton');
const bounceSound = document.getElementById('bounceSound'); // Звук удара
const soundButton = document.getElementById('soundButton'); // Кнопка звука

// Параметры движения
let x = window.innerWidth / 2 - 75, y = window.innerHeight / 2 - 75;
let dx = 0, dy = 0, isStopped = true;
let isAnimating = false;

const initialSpeed = 4; // Уменьшили скорость для мобильных
const constantSpeedDuration = 2000;

// Флаг для состояния звука
let isSoundEnabled = false; // Звук выключен по умолчанию

// Подготовка звука к воспроизведению
function preloadAudio() {
    if (isSoundEnabled) {
        bounceSound.play().catch(() => {}); // Пытаемся воспроизвести звук
        bounceSound.pause(); // Останавливаем воспроизведение
        bounceSound.currentTime = 0; // Сбрасываем время
    }
}

// Вызываем подготовку звука при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    preloadAudio();
    soundButton.textContent = '🔇'; // Значок выключенного звука
    soundButton.classList.add('sound-off');

    // Расширяем окно Telegram Web App
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.expand(); // Расширение окна приложения
    }
});

// Устанавливаем начальную позицию шара
function setInitialPosition() {
    x = window.innerWidth / 2 - 75; // Центр по горизонтали
    y = window.innerHeight / 2 - 75; // Центр по вертикали
    ball.style.transform = `translate(${x}px, ${y}px)`; // Используем transform
}

// Получение случайного направления по диагоналям с отклонением
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

function startMovement() {
    if (!isStopped || isAnimating) return;

    isStopped = false;
    isAnimating = true;
    answerElement.classList.remove('show');
    ball.classList.remove('glow-active');
    disableShakeDetection();

    const direction = getRandomDirection();
    dx = direction.dx * initialSpeed;
    dy = direction.dy * initialSpeed;

    startTime = Date.now();
    requestAnimationFrame(moveBall);
}

let startTime = null;

function moveBall() {
    if (isStopped || !isAnimating) {
        isAnimating = false;
        return;
    }

    const currentTime = Date.now();

    if (currentTime - startTime < constantSpeedDuration) {
        x += dx;
        y += dy;
    } else {
        const elapsedTime = (currentTime - startTime - constantSpeedDuration) / 1000;
        const decelerationFactor = Math.max(0.95 - elapsedTime * 0.05, 0.1);
        x += dx * decelerationFactor;
        y += dy * decelerationFactor;
        dx *= decelerationFactor;
        dy *= decelerationFactor;
    }

    const ballSize = 150;
    let hitWall = false;

    if (x <= 0 || x >= window.innerWidth - ballSize) {
        dx = -dx;
        x = Math.max(0, Math.min(x, window.innerWidth - ballSize));
        hitWall = true;
    }
    if (y <= 0 || y >= window.innerHeight - ballSize) {
        dy = -dy;
        y = Math.max(0, Math.min(y, window.innerHeight - ballSize));
        hitWall = true;
    }

    if (hitWall && isSoundEnabled) {
        bounceSound.currentTime = 0;
        bounceSound.play().catch(() => {});
    }

    ball.style.transform = `translate3d(${x|0}px, ${y|0}px, 0)`;

    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
        isStopped = true;
        isAnimating = false;
        answerElement.textContent = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
        answerElement.classList.add('show');
        ball.classList.add('glow-active');
        enableShakeDetection();
        return;
    }

    requestAnimationFrame(moveBall);
}

let lastShakeTime = 0;
const shakeCooldown = 800;
let isShakeDetectionActive = false;

function enableShakeDetection() {
    if (isShakeDetectionActive) return;
    isShakeDetectionActive = true;

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
    }
}

function disableShakeDetection() {
    if (!isShakeDetectionActive) return;
    isShakeDetectionActive = false;

    if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleDeviceMotion);
    }
}

function handleDeviceMotion(event) {
    if (!isStopped || isAnimating) return;
    
    const now = Date.now();
    if (now - lastShakeTime < shakeCooldown) return;

    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const acceleration = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

    if (acceleration > 30) {
        lastShakeTime = now;
        startMovement();
    }
}

// Обработчики кнопки
shakeButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMovement();
});
shakeButton.addEventListener('click', (e) => {
    e.preventDefault();
    startMovement();
});

// Логика кнопки звука
soundButton.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
        soundButton.textContent = '🔊';
        soundButton.classList.remove('sound-off');
    } else {
        soundButton.textContent = '🔇';
        soundButton.classList.add('sound-off');
    }
});

// Инициализация
setInitialPosition();
enableShakeDetection(); // Включаем проверку тряски при запуске