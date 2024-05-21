document.addEventListener('DOMContentLoaded', function() {
    createDesks(5, 2);
});

function createDesks(rows, cols) {
    const classroom = document.querySelector('.classroom');
    classroom.innerHTML = '<div class="screen">SCREEN</div>';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < cols; j++) {
            const desk = document.createElement('div');
            desk.className = 'desk';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '이름 입력';
            input.disabled = true;

            const button = document.createElement('button');
            button.textContent = '수정';
            button.onclick = function() {
                if (button.textContent === '수정') {
                    input.disabled = false;
                    input.focus();
                    button.textContent = '확인';
                } else {
                    input.disabled = true;
                    button.textContent = '수정';
                }
            };

            desk.appendChild(input);
            desk.appendChild(button);
            row.appendChild(desk);
        }
        classroom.appendChild(row);
    }
}
