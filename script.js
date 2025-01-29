const answers = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

let isShaking = false;

function getRandomAnswer() {
    return answers[Math.floor(Math.random() * answers.length)];
}

function handleShake(event) {
    if (event.accelerationIncludingGravity.x > 15 || event.accelerationIncludingGravity.y > 15 || event.accelerationIncludingGravity.z > 15) {
        if (!isShaking) {
            isShaking = true;
            const magicBall = document.querySelector('.magic-ball');
            magicBall.style.animationPlayState = 'running';
            setTimeout(() => {
                isShaking = false;
                magicBall.style.animationPlayState = 'paused';
                const answerElement = document.querySelector('.answer');
                answerElement.textContent = getRandomAnswer();
            }, 1000);
        }
    }
}

window.addEventListener('devicemotion', handleShake);

// For desktop testing
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        const magicBall = document.querySelector('.magic-ball');
        magicBall.style.animationPlayState = 'running';
        setTimeout(() => {
            magicBall.style.animationPlayState = 'paused';
            const answerElement = document.querySelector('.answer');
            answerElement.textContent = getRandomAnswer();
        }, 1000);
    }
});