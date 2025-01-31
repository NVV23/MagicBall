from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("Начать игру", web_app=WebAppInfo(url="https://nvv23.github.io/MagicBall/"))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Привет! Я магический шар. Нажми кнопку, чтобы начать.", reply_markup=reply_markup)

def main():
    app = ApplicationBuilder().token("7720902231:AAFlMdPBhrNwNLRs3ATLICYbkNTEiiF8XBs").build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()

if __name__ == "__main__":
    main()