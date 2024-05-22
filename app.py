from flask import Flask, render_template, request, jsonify
import json
import random

app = Flask(__name__)

STUDENT_FILE_PATH = 'data/students.txt'
DEFAULT_STUDENTS = [{"index": i, "name": name} for i, name in
                    enumerate(["이태욱", "안새미", "박수형", "윤석인", "김승은", "김민서", "이효림", "정여원", "김민희", "황조연"])]


def load_students():
    try:
        with open(STUDENT_FILE_PATH, 'r', encoding='utf-8') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return DEFAULT_STUDENTS


def save_students(students):
    with open(STUDENT_FILE_PATH, 'w', encoding='utf-8') as file:
        json.dump(students, file, ensure_ascii=False)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_student_list', methods=['GET'])
def get_student_list():
    return jsonify(load_students())


@app.route('/update_student_order', methods=['POST'])
def update_student_order():
    students = request.get_json()
    save_students(students)
    return jsonify({"success": True, "message": "학생 목록 순서가 업데이트 되었습니다."})


@app.route('/update_student', methods=['POST'])
def update_student():
    data = request.get_json()
    index = data['index']
    name = data['name']

    students = load_students()
    if 0 <= index < len(students):
        students[index]['name'] = name
        save_students(students)
        return jsonify({"success": True, "message": "학생 정보가 업데이트 되었습니다."})
    return jsonify({"success": False, "message": "학생 인덱스가 유효하지 않습니다."})


@app.route('/relocate_student', methods=['POST'])
def relocate_student():
    students = load_students()
    random.shuffle(students)
    save_students(students)
    return jsonify({"success": True, "data": students})


if __name__ == '__main__':
    app.run(debug=True)
