const ball = document.getElementById('ball');
const screen = document.getElementById('screen');
const responses = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "Нет, но ты можешь спросить у Google", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
];

let dx = 0, dy = 0; // Направление и скорость движения шара
let animationFrame;
const maxSpeed = 10; // Максимальная скорость шара
const decelerationRate = 0.95; // Коэффициент замедления
let isShaking = false;

// Функция для получения случайного ответа
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Функция для начала тряски
function startShaking(event) {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 2; // Порог тряски

    // Рассчитываем силу тряски
    const force = Math.hypot(acceleration.x, acceleration.y, acceleration.z);

    if (force > threshold) {
        isShaking = true;

        // Задаем направление движения в зависимости от силы тряски
        const angle = Math.random() * 2 * Math.PI; // Случайный угол
        dx += Math.cos(angle) * force * 0.5; // Увеличиваем скорость в зависимости от силы
        dy += Math.sin(angle) * force * 0.5;

        // Ограничиваем максимальную скорость
        const currentSpeed = Math.hypot(dx, dy);
        if (currentSpeed > maxSpeed) {
            dx = (dx / currentSpeed) * maxSpeed;
            dy = (dy / currentSpeed) * maxSpeed;
        }

        // Очищаем экран
        screen.textContent = "";
        screen.style.opacity = 0;

        // Запускаем движение шара
        if (!animationFrame) {
            moveBall();
        }
    }
}

// Функция для остановки тряски
function stopShaking() {
    isShaking = false;
}

// Функция для движения шара
function moveBall() {
    // Получаем текущие координаты шара
    let x = parseFloat(ball.style.left) || window.innerWidth / 2;
    let y = parseFloat(ball.style.top) || window.innerHeight / 2;

    // Обновляем координаты
    x += dx;
    y += dy;

    // Проверяем столкновение с границами экрана
    const ballRadius = ball.offsetWidth / 2;
    if (x < ballRadius) {
        x = ballRadius;
        dx = Math.abs(dx); // Отскок от левой стенки
    }
    if (x > window.innerWidth - ballRadius) {
        x = window.innerWidth - ballRadius;
        dx = -Math.abs(dx); // Отскок от правой стенки
    }
    if (y < ballRadius) {
        y = ballRadius;
        dy = Math.abs(dy); // Отскок от верхней стенки
    }
    if (y > window.innerHeight - ballRadius) {
        y = window.innerHeight - ballRadius;
        dy = -Math.abs(dy); // Отскок от нижней стенки
    }

    // Применяем новые координаты
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    // Замедление шара, если тряска прекратилась
    if (!isShaking) {
        dx *= decelerationRate;
        dy *= decelerationRate;

        // Если скорость очень маленькая, останавливаем шар
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            dx = 0;
            dy = 0;

            // Показываем ответ
            screen.textContent = getRandomResponse();
            screen.style.opacity = 1;
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
            return;
        }
    }

    // Рекурсивно вызываем функцию для следующего кадра
    animationFrame = requestAnimationFrame(moveBall);
}

// Обработчик события тряски телефона
window.addEventListener('devicemotion', (event) => {
    if (isShaking) {
        startShaking(event);
    }
});

// Обработчик начала тряски
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 2; // Порог тряски

    if (Math.hypot(acceleration.x, acceleration.y, acceleration.z) > threshold) {
        if (!isShaking) {
            isShaking = true;
            startShaking(event);
        }
    } else {
        if (isShaking) {
            stopShaking();
        }
    }
});

// Инициализация начального положения шара
ball.style.left = `${window.innerWidth / 2}px`;
ball.style.top = `${window.innerHeight / 2}px`;