document.addEventListener('DOMContentLoaded', function () {
    fetch('/get_student_list')
        .then(response => response.json())
        .then(students => {
            createDesks(5, 2, students);
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            const defaultStudents = ["이태욱", "안새미", "박수형", "윤석인", "김승은", "김민서", "이효림", "정여원", "김민희", "황조연"];
            createDesks(5, 2, defaultStudents);
        });

    const rearrangeButton = document.getElementById('rearrangeButton');
    rearrangeButton.addEventListener('click', function () {
        alert('자리를 재배치합니다.');
        fetch('/relocate_student', {method: 'POST'})
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    console.log('자리가 성공적으로 재배치되었습니다.', result.data);
                    createDesks(5, 2, result.data);
                } else {
                    console.error('자리 재배치에 실패했습니다.', result.message);
                }
            })
            .catch(error => {
                console.error('자리 재배치 요청 중 오류 발생:', error);
            });
    });
});

function createDesks(rows, cols, students) {
    const classroom = document.querySelector('.classroom');
    classroom.innerHTML = '<div class="screen">SCREEN</div>';

    let studentIndex = 0;
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        classroom.appendChild(row);

        for (let j = 0; j < cols; j++) {
            if (studentIndex >= students.length) break;

            const desk = createDesk(students[studentIndex], studentIndex);
            row.appendChild(desk);
            studentIndex++;
        }
    }
}

function createDesk(student, index) {
    const desk = document.createElement('div');
    desk.className = 'desk';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = student;
    input.value = student;
    input.dataset.index = index;
    input.disabled = true;

    const button = document.createElement('button');
    button.textContent = '수정';
    button.addEventListener('click', () => toggleEdit(input, button));

    desk.appendChild(input);
    desk.appendChild(button);
    return desk;
}

function toggleEdit(input, button) {
    if (button.textContent === '수정') {
        input.disabled = false;
        input.focus();
        button.textContent = '확인';
    } else {
        input.disabled = true;
        updateStudent(input.dataset.index, input.value);
        button.textContent = '수정';
    }
}

function updateStudent(index, name) {
    fetch('/update_student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({index: index, name: name})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('학생 정보가 업데이트되었습니다:', data.message);
            } else {
                console.error('학생 정보 업데이트 실패:', data.message);
            }
        });
}
