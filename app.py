from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)

student = ["이태욱", "안새미", "박수형", "윤석인", "김승은",
           "김민서", "이효림", "정여원", "김민희", "황조연"]
