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

// Функция для получения случайного направления
function getRandomDirection() {
    return (Math.random() - 0.5) * 20; // Увеличиваем скорость движения
}

// Обнаружение тряски
function shakeDetected(acceleration) {
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
        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        // Замедление шара только если тряска прекратилась
        if (!shaking) {
            dx *= 0.99; // Уменьшаем коэффициент замедления для плавности
            dy *= 0.99;
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
            const speedFactor = Math.min(acceleration / 50, 3); // Ограничение максимальной скорости
            dx = getRandomDirection() * speedFactor;
            dy = getRandomDirection() * speedFactor;
        } else {
            shaking = false; // Прекращаем тряску, если ускорение ниже порога
        }
    });
} else {
    alert("Ваше устройство не поддерживает обнаружение тряски. Используйте кнопку ниже.");
}

// Обработчик кнопки "Имитировать тряску"
shakeButton.addEventListener('click', () => {
    if (isStopped) {
        const simulatedAcceleration = 30; // Имитируем среднюю силу тряски
        shakeDetected(simulatedAcceleration);
    }
});

// Начало анимации
moveBall();