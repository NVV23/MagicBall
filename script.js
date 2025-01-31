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
let x = window.innerWidth / 2 - 30;
let y = window.innerHeight / 2 - 30;
let dx = 0;
let dy = 0;
let shaking = false;

// Функция для получения случайного направления
function getRandomDirection() {
    return (Math.random() - 0.5) * 10;
}

// Обнаружение тряски
function shakeDetected() {
    if (!shaking) {
        shaking = true;
        dx = getRandomDirection();
        dy = getRandomDirection();
        setTimeout(() => shaking = false, 2000); // Прекращение тряски через 2 секунды
    }
}

// Движение шара
function moveBall() {
    x += dx;
    y += dy;

    // Отскок от стенок
    if (x <= 0 || x >= window.innerWidth - 60) dx = -dx;
    if (y <= 0 || y >= window.innerHeight - 60) dy = -dy;

    // Обновление позиции шара
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';

    // Замедление шара
    if (!shaking) {
        dx *= 0.98;
        dy *= 0.98;

        // Если шар остановился, показываем ответ
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            showAnswer();
        }
    }

    requestAnimationFrame(moveBall);
}

// Показать случайный ответ
function showAnswer() {
    const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    answerElement.textContent = randomAnswer;
    answerElement.classList.add('show');
    setTimeout(() => answerElement.classList.remove('show'), 3000); // Скрыть ответ через 3 секунды
}

// Начало анимации
window.addEventListener('devicemotion', () => shakeDetected());
moveBall();