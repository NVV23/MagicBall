// script.js
const magicBall = document.getElementById('magic-ball');
const answerElement = document.getElementById('answer');

let isShaking = false;
let shakeTimeout;

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
        changeAnswer();
    }
}

function changeAnswer() {
    const randomAnswer = getRandomAnswer();
    answerElement.textContent = randomAnswer;
    shakeTimeout = setTimeout(() => {
        if (isShaking) {
            changeAnswer(); // Continue changing answer while shaking
        }
    }, 200);
}

window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const shakeThreshold = 10; // Adjust this value as needed

    if (Math.abs(acceleration.x) > shakeThreshold || Math.abs(acceleration.y) > shakeThreshold || Math.abs(acceleration.z) > shakeThreshold) {
        handleShakeEvent();
    } else {
        stopShake();
    }
});

function stopShake() {
    clearTimeout(shakeTimeout);
    if (isShaking) {
        isShaking = false;
        magicBall.style.animation = '';
        const finalAnswer = getRandomAnswer();
        answerElement.textContent = finalAnswer;
    }
}

// Для тестирования на десктопе
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        handleShakeEvent();
        setTimeout(stopShake, 1000); // Simulate stopping the shake after 1 second
    }
});