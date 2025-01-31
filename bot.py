import random
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes

# Список ответов
ANSWERS = [
    "Да", "Нет", "Возможно", "Скорее всего да", "Скорее всего нет",
    "Я устал, спроси позже", "Я не экстрасенс, я просто шар",
    "А сам как думаешь?", "Да, хотя нет", "Да нет наверное",
    "100%", "АУФ", "Маловероятно"
]

# Команда /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("Начать игру", callback_data="start_game")]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Привет! Я магический шар. Нажми кнопку, чтобы начать.", reply_markup=reply_markup)

# Обработка кнопки
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "start_game":
        # Отправляем HTML-страницу с анимацией
        html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    overflow: hidden;
                    background-color: #1e1e2f;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .ball {
                    width: 50px;
                    height: 50px;
                    background-color: #ff6f61;
                    border-radius: 50%;
                    position: absolute;
                    box-shadow: 0 0 20px rgba(255, 111, 97, 0.8);
                }
            </style>
        </head>
        <body>
            <div class="ball" id="ball"></div>
            <script>
                const ball = document.getElementById('ball');
                let x = window.innerWidth / 2 - 25;
                let y = window.innerHeight / 2 - 25;
                let dx = 0;
                let dy = 0;
                let shaking = false;

                function getRandomDirection() {
                    return (Math.random() - 0.5) * 10;
                }

                function shakeDetected() {
                    if (!shaking) {
                        shaking = true;
                        dx = getRandomDirection();
                        dy = getRandomDirection();
                        setTimeout(() => shaking = false, 2000);
                    }
                }

                function moveBall() {
                    x += dx;
                    y += dy;

                    if (x <= 0 || x >= window.innerWidth - 50) dx = -dx;
                    if (y <= 0 || y >= window.innerHeight - 50) dy = -dy;

                    ball.style.left = x + 'px';
                    ball.style.top = y + 'px';

                    if (!shaking) {
                        dx *= 0.98;
                        dy *= 0.98;
                    }

                    requestAnimationFrame(moveBall);
                }

                window.addEventListener('devicemotion', () => shakeDetected());
                moveBall();
            </script>
        </body>
        </html>
        """
        await query.edit_message_text(text="Тряси телефон, чтобы запустить шар!")
        await context.bot.send_message(chat_id=update.effective_chat.id, text=html_content, parse_mode="HTML")

# Основная функция
def main():
    app = ApplicationBuilder().token("7720902231:AAFlMdPBhrNwNLRs3ATLICYbkNTEiiF8XBs").build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button_callback))

    app.run_polling()

if __name__ == "__main__":
    main()