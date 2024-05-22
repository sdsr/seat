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
                fetch('/relocate_student', { method: 'POST' })
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
    classroom.innerHTML = '<div class="screen">SCREEN</div>'; // Clear previous desks
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
    desk.id = `desk-${index}`;
    desk.draggable = true;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = student.name;
    input.value = student.name;
    input.dataset.index = index; // Store the current index here
    input.disabled = true;

    const button = document.createElement('button');
    button.textContent = '수정';
    button.onclick = () => toggleEdit(input, button);

    desk.appendChild(input);
    desk.appendChild(button);

    // 드래그 이벤트 리스너 추가
    desk.addEventListener('dragstart', handleDragStart);
    desk.addEventListener('dragover', handleDragOver);
    desk.addEventListener('drop', handleDrop);

    return desk;
}

function toggleEdit(input, button) {
    const isEditing = button.textContent === '수정';
    input.disabled = !isEditing;
    button.textContent = isEditing ? '확인' : '수정';
    if (!isEditing) {
        // 확인 버튼 클릭 시 서버에 업데이트
        updateStudentOnServer(input.dataset.index, input.value)
            .then(() => {
                fetchStudentsAndCreateDesks();
            });
    }
}

function updateStudentOnServer(index, name) {
    return fetch('/update_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: parseInt(index), name })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`학생 정보가 업데이트되었습니다: ${data.message}`);
            } else {
                console.error('학생 정보 업데이트 실패:', data.message);
            }
        });
}

function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const targetDesk = e.target.closest('.desk');
    const draggedDesk = document.getElementById(e.dataTransfer.getData("text/plain"));
    if (targetDesk && draggedDesk !== targetDesk) {
        // 입력 요소의 값과 인덱스를 교체
        const targetInput = targetDesk.querySelector('input');
        const draggedInput = draggedDesk.querySelector('input');

        // 값과 인덱스를 교체
        swapInputs(targetInput, draggedInput);

        // 서버에 학생 목록 순서를 업데이트
        updateStudentOrder()
            .then(() => {
                fetchStudentsAndCreateDesks();
            });
    }
}

function swapInputs(input1, input2) {
    let tempValue = input1.value;
    let tempIndex = input1.dataset.index;

    input1.value = input2.value;
    input1.dataset.index = input2.dataset.index;

    input2.value = tempValue;
    input2.dataset.index = tempIndex;
}

function updateStudentOrder() {
    const desks = document.querySelectorAll('.desk input');
    const updatedStudents = Array.from(desks).map((desk, newIndex) => ({
        index: newIndex,
        name: desk.value
    }));

    return fetch('/update_student_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudents)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('학생 목록 순서가 서버에 업데이트되었습니다.');
            } else {
                console.error('학생 목록 순서 업데이트 실패:', data.message);
            }
        });
}
