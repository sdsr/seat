document.addEventListener('DOMContentLoaded', function () {
    fetchStudentsAndCreateDesks();

    const rearrangeButton = document.getElementById('rearrangeButton');
    rearrangeButton.addEventListener('click', function () {
        // alert('자리를 재배치합니다.');
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

document.addEventListener('DOMContentLoaded', function () {
    fetchStudentsAndCreateDesks();

    const rearrangeButton = document.getElementById('rearrangeButton');
    rearrangeButton.addEventListener('click', function () {
        Swal.fire({
            title: '자리 재배치 중...',
            html: '잠시만 기다려주세요. <b></b> milliseconds.',
            timer: 500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("자리 재배치 타이머에 의해 닫혔습니다.");
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
            }
        });
    });
});


function fetchStudentsAndCreateDesks() {
    fetch('/get_student_list')
        .then(response => response.json())
        .then(students => createDesks(5, 2, students))
        .catch(error => {
            console.error('Error fetching students:', error);
            createDesks(5, 2, DEFAULT_STUDENTS);
        });
}

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
            row.appendChild(createDesk(students[studentIndex], studentIndex));
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
    const isEditing = button.textContent === '수정';
    input.disabled = !isEditing;
    button.textContent = isEditing ? '확인' : '수정';
    if (!isEditing) {
        updateStudent(input.dataset.index, input.value);
    }
}

function updateStudent(index, name) {
    fetch('/update_student', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({index, name})
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
