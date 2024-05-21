function createDesks() {
    const rows = 5;
    const cols = 2;
    const classroom = document.querySelector('.classroom');
    classroom.innerHTML = '<div class="screen">SCREEN</div>';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < cols; j++) {
            const desk = document.createElement('div');
            desk.className = 'desk';
            desk.textContent = `${i + 1}${String.fromCharCode(65 + j)}`;
            row.appendChild(desk);
        }
        classroom.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', createDesks);
//
// document.getElementById('rearrangeButton').addEventListener('click', function () {
//     const rows = document.querySelectorAll('.row');
//     for (let row of rows) {
//         let desks = Array.from(row.querySelectorAll('.desk'));
//         desks.sort(() => Math.random() - 0.5);
//         row.innerHTML = '';
//         desks.forEach(desk => row.appendChild(desk));
//     }
// });
