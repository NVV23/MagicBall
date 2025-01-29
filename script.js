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

const magicBall = document.getElementById('magic-ball');
const answerText = document.getElementById('answer');

let shaking = false;
let shakeTimeout;

// Функция для генерации случайного ответа
function getRandomAnswer() {
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
}

// Обработчик события devicemotion
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 15; // Порог чувствительности

    if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) {
        if (!shaking) {
            shaking = true;
            answerText.textContent = "Shaking...";
            moveBallRandomly();
        }

        clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => {
            shaking = false;
            stopBall();
        }, 500); // Задержка перед остановкой шара
    }
});

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
    magicBall.style.transform = 'translate(0, 0) rotate(0deg)';
    answerText.textContent = getRandomAnswer();
}