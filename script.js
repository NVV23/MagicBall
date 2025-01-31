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

// Позиция и направление шара
let x = window.innerWidth / 2 - 75; // Центр экрана
let y = window.innerHeight / 2 - 75;
let dx = 0;
let dy = 0;
let shaking = false;
let isStopped = true; // Флаг для отслеживания остановки шара

// Параметры тряски
let lastShakeTime = 0;
const shakeThreshold = 15; // Пороговое значение для тряски
const shakeCooldown = 1000; // Задержка между трясками (в миллисекундах)

// Функция для получения случайного направления
function getRandomDirection() {
    return (Math.random() - 0.5) * 10; // Случайное направление от -5 до 5
}

// Обнаружение тряски
function shakeDetected() {
    if (!shaking && isStopped) {
        shaking = true;
        isStopped = false; // Шар начал движение
        dx = getRandomDirection();
        dy = getRandomDirection();
        answerElement.classList.remove('show'); // Скрываем ответ при начале движения
    }
}

// Остановка тряски
function stopShake() {
    shaking = false;
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

        // Замедление шара
        dx *= 0.98;
        dy *= 0.98;

        // Если шар почти остановился
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            isStopped = true; // Шар остановился
            showAnswer();
        }
    }

    requestAnimationFrame(moveBall);
}

// Показать случайный ответ
function showAnswer() {
    if (isStopped) {
        const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
        answerElement.textContent = randomAnswer;
        answerElement.classList.add('show');
    }
}

// Обработчик события devicemotion
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (event) => {
        const { x, y, z } = event.accelerationIncludingGravity;

        // Вычисляем общее ускорение
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        // Проверяем, превышает ли ускорение пороговое значение
        if (acceleration > shakeThreshold) {
            const now = Date.now();

            // Проверяем задержку между трясками
            if (now - lastShakeTime > shakeCooldown) {
                shakeDetected();
                lastShakeTime = now; // Обновляем время последней тряски
            }
        }
    });
} else {
    alert("Ваше устройство не поддерживает обнаружение тряски. Пожалуйста, используйте другое устройство.");
}

// Начало анимации
moveBall();