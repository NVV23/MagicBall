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
let shaking = false;
let isStopped = true; // Флаг для отслеживания остановки шара
let answerShown = false; // Флаг для отслеживания показа ответа

// Параметры тряски
const shakeThreshold = 15; // Пороговое значение для тряски
const shakeCooldown = 1000; // Задержка между трясками (в миллисекундах)
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
    return (Math.random() - 0.5) * 20; // Случайное направление от -10 до 10
}

// Обнаружение тряски
function startShake(acceleration) {
    if (!shaking && isStopped) {
        shaking = true;
        isStopped = false; // Шар начал движение
        answerShown = false; // Сбрасываем флаг показа ответа
        const speedFactor = Math.min(acceleration / 50, 3); // Ограничение максимальной скорости
        dx = getRandomDirection() * speedFactor;
        dy = getRandomDirection() * speedFactor;
        answerElement.classList.remove('show'); // Скрываем ответ при начале движения
    }
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
    window.addEventListener('devicemotion', (event) => {
        const { x, y, z } = event.accelerationIncludingGravity;

        // Вычисляем общее ускорение
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        // Если ускорение превышает пороговое значение, считаем, что устройство трясут
        if (acceleration > shakeThreshold) {
            shaking = true; // Продолжаем движение шара
        } else {
            shaking = false; // Прекращаем тряску, если ускорение ниже порога
        }
    });
} else {
    alert("Ваше устройство не поддерживает обнаружение тряски. Используйте кнопку ниже.");
}

// Обработчики кнопки "Имитировать тряску"
let simulatedShaking = false; // Флаг для имитации тряски кнопкой

shakeButton.addEventListener('mousedown', () => {
    simulatedShaking = true;
    const simulatedAcceleration = 30; // Имитируем среднюю силу тряски
    startShake(simulatedAcceleration);
});

shakeButton.addEventListener('mouseup', () => {
    simulatedShaking = false;
    shaking = false; // Прекращаем тряску
});

shakeButton.addEventListener('mouseleave', () => {
    simulatedShaking = false;
    shaking = false; // Прекращаем тряску, если курсор покинул кнопку
});

// Установка начального положения шара
setInitialPosition();

// Начало анимации
moveBall();