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
const bounceSound = document.getElementById('bounceSound'); // Звук удара

// Позиция и направление шара
let x = window.innerWidth / 2 - 75; // Центр экрана
let y = window.innerHeight / 2 - 75;
let dx = 0;
let dy = 0;
let isStopped = true; // Флаг для остановки шара
let answerShown = false; // Флаг для показа ответа

// Параметры движения
const initialSpeed = 20; // Начальная скорость шара
const deceleration = 0.99; // Коэффициент замедления

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

// Начать движение шара
function startMovement() {
    if (isStopped) {
        isStopped = false; // Шар начал движение
        answerShown = false; // Сбрасываем флаг показа ответа
        dx = getRandomDirection() * initialSpeed;
        dy = getRandomDirection() * initialSpeed;
        answerElement.classList.remove('show'); // Скрываем ответ при начале движения
    }
}

// Движение шара
function moveBall() {
    if (!isStopped) {
        x += dx;
        y += dy;

        // Проверка столкновения со стенками
        let hitWall = false;

        if (x <= 0 || x >= window.innerWidth - 150) {
            dx = -dx;
            hitWall = true;
        }
        if (y <= 0 || y >= window.innerHeight - 150) {
            dy = -dy;
            hitWall = true;
        }

        // Воспроизведение звука при ударе
        if (hitWall) {
            bounceSound.currentTime = 0; // Сброс времени воспроизведения
            bounceSound.play(); // Воспроизведение звука
        }

        // Обновление позиции шара
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;

        // Замедление шара
        dx *= deceleration;
        dy *= deceleration;

        // Если шар почти остановился
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
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
        if (acceleration > 15) {
            startMovement(); // Начинаем движение шара
        }
    });
} else {
    alert("Ваше устройство не поддерживает обнаружение тряски. Используйте кнопку ниже.");
}

// Обработчики кнопки "Имитировать тряску"
shakeButton.addEventListener('touchstart', () => {
    startMovement(); // Начинаем движение шара
});

shakeButton.addEventListener('mousedown', () => {
    startMovement(); // Начинаем движение шара
});

// Установка начального положения шара
setInitialPosition();

// Начало анимации
moveBall();