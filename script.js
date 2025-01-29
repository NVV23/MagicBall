// Массив с возможными ответами
const answers = [
    "Да",
    "Нет",
    "Возможно",
    "Скорее всего да",
    "Скорее всего нет",
    "Я устал, спроси позже",
    "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google",
    "Да, хотя нет",
    "Да нет наверное",
    "100%",
    "АУФ",
    "Маловероятно"
];

// Элементы DOM
const magicBall = document.getElementById('magic-ball');
const answerText = document.getElementById('answer');

let shaking = false; // Флаг для обнаружения тряски
let shakeTimeout; // Таймер для остановки шара

// Генерация случайного ответа
function getRandomAnswer() {
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
}

// Функция для случайного перемещения шара
function moveBallRandomly() {
    const container = document.querySelector('.container');
    const ballSize = magicBall.offsetWidth;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const maxX = containerWidth - ballSize;
    const maxY = containerHeight - ballSize;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    magicBall.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
}

// Функция для остановки шара и вывода ответа
function stopBall() {
    magicBall.style.transition = 'transform 1s ease-out'; // Медленная остановка
    magicBall.style.transform = 'translate(0, 0) rotate(0deg)'; // Возврат в центр
    setTimeout(() => {
        answerText.textContent = getRandomAnswer(); // Показать ответ
        magicBall.style.transition = ''; // Убрать анимацию после остановки
    }, 1000); // Задержка перед показом ответа
}

// Обработчик события devicemotion
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 15; // Порог чувствительности

    if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) {
        if (!shaking) {
            shaking = true;
            answerText.textContent = "Shaking..."; // Показываем текст "Shaking..."
            moveBallRandomly();
        }

        clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => {
            shaking = false;
            stopBall();
        }, 500); // Задержка перед остановкой шара
    }
});