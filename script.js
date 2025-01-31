// Список ответов
const ANSWERS = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "А сам как думаешь?", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

// Элементы DOM
const ball = document.getElementById('ball');
const answerElement = document.getElementById('answer');
const shakeButton = document.getElementById('shakeButton');

// Позиция и направление шара
let x = window.innerWidth / 2 - 75; // Центр экрана
let y = window.innerHeight / 2 - 75;
let dx = 0;
let dy = 0;
let shaking = false; // Флаг для тряски
let isStopped = true; // Флаг для остановки шара
let answerShown = false; // Флаг для показа ответа

// Параметры тряски
const shakeThreshold = 15; // Пороговое значение для тряски
const shakeSpeed = 10; // Постоянная скорость шара во время тряски
let lastShakeTime = 0;

// Устанавливаем начальное положение шара
function setInitialPosition() {
    x = window.innerWidth / 2 - 75; // Центр по горизонтали
    y = window.innerHeight / 2 - 75; // Центр по вертикали
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

// Функция для получения случайного направления
function getRandomDirection() {
    return (Math.random() - 0.5) * 2; // Случайное направление (-1..1)
}

// Начать тряску
function startShake() {
    if (!shaking && isStopped) {
        shaking = true;
        isStopped = false; // Шар начал движение
        answerShown = false; // Сбрасываем флаг показа ответа
        dx = getRandomDirection() * shakeSpeed;
        dy = getRandomDirection() * shakeSpeed;
        answerElement.classList.remove('show'); // Скрываем ответ при начале движения
    }
}

// Остановить тряску
function stopShake() {
    shaking = false; // Прекращаем тряску
}

// Движение шара
function moveBall() {
    if (shaking || !isStopped) {
        x += dx;
        y += dy;

        // Отскок от стенок
        if (x <= 0 || x >= window.innerWidth - 150) dx = -dx;
        if (y <= 0 || y >= window.innerHeight - 150) dy = -dy;

        // Обновление позиции шара
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;

        // Замедление шара только если тряска прекратилась
        if (!shaking) {
            dx *= 0.98; // Уменьшаем коэффициент замедления для плавности
            dy *= 0.98;
        }

        // Если шар почти остановился
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && shaking === false) {
            isStopped = true; // Шар остановился
            if (!answerShown) {
                showAnswer();
                answerShown = true; // Ответ показан
            }
        }
    }

    requestAnimationFrame(moveBall);
}

// Показать случайный ответ
function showAnswer() {
    const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    answerElement.textContent = randomAnswer;
    answerElement.classList.add('show');
}

// Обработчик события devicemotion
if (window.DeviceMotionEvent) {
    // Для Safari на iOS требуется явное разрешение
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleDeviceMotion);
                } else {
                    alert("Разрешение на использование акселерометра не предоставлено.");
                }
            })
            .catch(console.error);
    } else {
        // Для других браузеров
        window.addEventListener('devicemotion', handleDeviceMotion);
    }
} else {
    alert("Ваше устройство не поддерживает обнаружение тряски. Используйте кнопку ниже.");
}

// Обработчик события devicemotion
function handleDeviceMotion(event) {
    const { x, y, z } = event.accelerationIncludingGravity;

    // Вычисляем общее ускорение
    const acceleration = Math.sqrt(x * x + y * y + z * z);

    // Если ускорение превышает пороговое значение, считаем, что устройство трясут
    if (acceleration > shakeThreshold) {
        startShake(); // Начинаем тряску
    } else {
        stopShake(); // Прекращаем тряску
    }
}

// Обработчики кнопки "Имитировать тряску"
shakeButton.addEventListener('touchstart', () => {
    startShake(); // Начинаем тряску при касании
});

shakeButton.addEventListener('touchend', () => {
    stopShake(); // Прекращаем тряску при отпускании
});

shakeButton.addEventListener('mousedown', () => {
    startShake(); // Начинаем тряску при нажатии на ПК
});

shakeButton.addEventListener('mouseup', () => {
    stopShake(); // Прекращаем тряску при отпускании на ПК
});

// Установка начального положения шара
setInitialPosition();

// Начало анимации
moveBall();