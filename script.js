const ANSWERS = ["Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет", "Я устал, спроси позже", "А сам как думаешь?", "Да, хотя нет", "100%", "Маловероятно", "Определённо да!", "Попробуй ещё раз", "Всё возможно", "Доверься судьбе", "Жди чуда", "Без сомнений", "Нет, и не надейся", "Может быть завтра", "Не торопи события", "Это твой выбор", "Спроси у другого шара", "Я в этом уверен", "Ты сам знаешь ответ", "Шансы равны", "Действуй смело", "Рискни", "Это тайна", "Подожди немного", "Тебе решать", "Не стоит сомневаться", "Слишком рано", "Звёзды молчат", "Ты на правильном пути", "Почему бы и нет?", "Слушай своё сердцечко", "Это плохая идея"];

const ball = document.getElementById('ball');
const answer = document.getElementById('answer');
const shakeBtn = document.getElementById('shakeButton');
const soundBtn = document.getElementById('soundButton');
const sound = document.getElementById('bounceSound');

let x = 0, y = 0, dx = 0, dy = 0;
let moving = false, soundOn = false;
let w = window.innerWidth, h = window.innerHeight;

function init() {
    w = window.innerWidth;
    h = window.innerHeight;
    x = (w - 150) >> 1;
    y = (h - 150) >> 1;
    ball.style.transform = `translate3d(${x}px,${y}px,0)`;
    
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
    }
}

function start() {
    if (moving) return;
    
    moving = true;
    answer.className = 'answer';
    ball.className = 'ball';
    
    const angle = Math.random() * Math.PI * 2;
    dx = Math.cos(angle) * 7;
    dy = Math.sin(angle) * 7;
    
    move();
}

function move() {
    if (!moving) return;
    
    x += dx;
    y += dy;
    
    if (x <= 0 || x >= w - 150) {
        dx = -dx;
        x = x <= 0 ? 0 : w - 150;
        if (soundOn) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }
    
    if (y <= 0 || y >= h - 150) {
        dy = -dy;
        y = y <= 0 ? 0 : h - 150;
        if (soundOn) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }
    
    dx *= 0.992;
    dy *= 0.992;
    
    ball.style.transform = `translate3d(${x|0}px,${y|0}px,0)`;
    
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        moving = false;
        answer.textContent = ANSWERS[Math.random() * ANSWERS.length | 0];
        answer.className = 'answer show';
        ball.className = 'ball glow';
        return;
    }
    
    requestAnimationFrame(move);
}

let lastShake = 0;
function onShake(e) {
    if (moving || Date.now() - lastShake < 500) return;
    
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    
    const force = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    if (force > 25) {
        lastShake = Date.now();
        start();
    }
}

shakeBtn.ontouchstart = shakeBtn.onclick = start;

soundBtn.onclick = () => {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
    soundBtn.className = soundOn ? '' : 'sound-off';
};

window.addEventListener('devicemotion', onShake, {passive: true});
window.addEventListener('resize', init);

init();