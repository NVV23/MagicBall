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
let x = window.innerWidth / 2 - 75, y = window.innerHeight / 2 - 75; // Начальная позиция
let dx = 0, dy = 0, isStopped = true;

const initialSpeed = 6;
const constantSpeedDuration = 2500; // Время постоянного движения (2 секунды)

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

// Начать движение шара
function startMovement() {
    if (!isStopped) return;

    isStopped = false;
    answerElement.classList.remove('show');
    ball.classList.remove('glow-active');

    const direction = getRandomDirection();
    dx = direction.dx * initialSpeed;
    dy = direction.dy * initialSpeed;

    startTime = Date.now(); // Запоминаем время начала движения
}

// Движение шара
let startTime = null;

function moveBall() {
    if (!isStopped) {
        const currentTime = Date.now();

        // Если прошло меньше времени, чем constantSpeedDuration, движение с постоянной скоростью
        if (currentTime - startTime < constantSpeedDuration) {
            x += dx;
            y += dy;
        } else {
            // После истечения времени постоянного движения начинаем замедление
            const elapsedTime = (currentTime - startTime - constantSpeedDuration) / 1000; // Время после constantSpeedDuration в секундах
            const decelerationFactor = 1 - Math.min(elapsedTime * 0.01, 0.996); // Нелинейное замедление
            x += dx * decelerationFactor;
            y += dy * decelerationFactor;
            dx *= decelerationFactor;
            dy *= decelerationFactor;
        }

        let hitWall = false;

        // Проверка столкновения со стенками
        if (x <= 0 || x >= window.innerWidth - 150) {
            dx = -dx;
            hitWall = true;
        }
        if (y <= 0 || y >= window.innerHeight - 150) {
            dy = -dy;
            hitWall = true;
        }

        // Воспроизведение звука при ударе
        if (hitWall && isSoundEnabled) {
            bounceSound.currentTime = 0;
            bounceSound.play().catch(() => {});
        }

        // Обновление позиции шара через transform
        ball.style.transform = `translate(${Math.floor(x)}px, ${Math.floor(y)}px)`;

        // Если шар почти остановился
        if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
            isStopped = true;
            answerElement.textContent = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
            answerElement.classList.add('show');
            ball.classList.add('glow-active');
            enableShakeDetection(); // Включаем проверку тряски
        } else {
            ball.classList.remove('glow-active');
        }
    }
    requestAnimationFrame(moveBall);
}

// Логика проверки тряски
let lastShakeTime = 0, shakeCooldown = 400;
let isShakeDetectionActive = false; // Флаг для предотвращения дублирования обработчиков

function enableShakeDetection() {
    if (isShakeDetectionActive) return; // Защита от дублирования
    isShakeDetectionActive = true;

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleDeviceMotion);
    }
}

function disableShakeDetection() {
    if (!isShakeDetectionActive) return; // Защита от повторного удаления
    isShakeDetectionActive = false;

    if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleDeviceMotion);
    }
}

function handleDeviceMotion(event) {
    const now = Date.now();
    if (now - lastShakeTime < shakeCooldown) return;

    const { x, y, z } = event.accelerationIncludingGravity;
    const acceleration = Math.sqrt(x * x + y * y + z * z);

    if (acceleration > 35 && isStopped) { // Увеличен порог ускорения
        startMovement();
        lastShakeTime = now;
        disableShakeDetection(); // Отключаем проверку тряски
    }
}

// Обработчики кнопки "Имитировать тряску"
shakeButton.addEventListener('touchstart', () => {
    if (isStopped) startMovement();
});
shakeButton.addEventListener('mousedown', () => {
    if (isStopped) startMovement();
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
moveBall(); // Запускаем анимацию
enableShakeDetection(); // Включаем проверку тряски при запуске