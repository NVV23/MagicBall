// script.js
const magicBall = document.getElementById('magic-ball');
const answerElement = document.getElementById('answer');

let isShaking = false;
let answers = [
    'Да', 'Нет', 'Возможно', 'Скорее всего да', 'Скорее всего нет',
    'Я устал, спроси позже', 'Я не экстрасенс, я просто шар',
    'Нет, но ты можешь спросить у Google', 'Да, хотя нет',
    'Да нет наверное', '100%', 'АУФ', 'Маловероятно'
];

function getRandomAnswer() {
    return answers[Math.floor(Math.random() * answers.length)];
}

function handleShakeEvent() {
    if (!isShaking) {
        isShaking = true;
        magicBall.style.animation = 'rotate 0.1s infinite linear';
        setTimeout(() => {
            isShaking = false;
            magicBall.style.animation = '';
            const randomAnswer = getRandomAnswer();
            answerElement.textContent = randomAnswer;
        }, 1000);
    }
}

window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (Math.abs(acceleration.x) > 1 || Math.abs(acceleration.y) > 1 || Math.abs(acceleration.z) > 1) {
        handleShakeEvent();
    }
});

// Для тестирования на десктопе
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        handleShakeEvent();
    }
});