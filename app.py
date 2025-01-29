from flask import Flask, render_template

app = Flask(__name__)

# Массив с возможными ответами
answers = [
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
]

@app.route('/')
def index():
    return render_template('index.html', answers=answers)

if __name__ == '__main__':
    app.run(debug=True)