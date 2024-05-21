import random

from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)


def load_students():
    try:
        with open('data/students.txt', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return ["이태욱", "안새미", "박수형", "윤석인", "김승은", "김민서", "이효림", "정여원", "김민희", "황조연"]
    except json.JSONDecodeError:
        return []


def save_students(students):
    with open('data/students.txt', 'w', encoding='utf-8') as file:
        json.dump(students, file, ensure_ascii=False)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_student_list', methods=['GET'])
def get_student_list():
    students = load_students()
    return jsonify(students)


@app.route('/update_student', methods=['POST'])
def update_student():
    students = load_students()
    data = request.get_json()
    index = int(data['index'])
    name = data['name']
    if 0 <= index < len(students):
        students[index] = name
        save_students(students)
        return jsonify({"success": True, "message": "학생 이름이 업데이트 되었습니다."})
    else:
        return jsonify({"success": False, "message": "유효하지 않은 인덱스입니다."})


@app.route('/relocate_student', methods=['POST'])
def relocate_students():
    students = load_students()
    random.shuffle(students)
    save_students(students)
    return jsonify({"success": True, "message": "학생들의 자리가 재배치되었습니다.", "data": students})


if __name__ == '__main__':
    app.run(debug=True)
