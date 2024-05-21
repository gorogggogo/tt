document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 10;
    let cells = Array.from({length: 200}, () => document.createElement('div'));
    let score = 0;
    let timerId;
    let currentPosition = 4;
    let currentRotation = 0;

    // Create the grid cells
    cells.forEach(cell => grid.appendChild(cell));
    cells = Array.from(grid.children);

    // Add "taken" cells at the bottom
    for (let i = 0; i < 10; i++) {
        const cell = document.createElement('div');
        cell.classList.add('taken');
        grid.appendChild(cell);
        cells.push(cell);
    }

    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const tetrominoes = [lTetromino]; // Add more tetrominoes here

    let random = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[random][currentRotation];

    function draw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.add('tetromino');
        });
    }

    function undraw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.remove('tetromino');
        });
    }

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keydown', control);

    document.getElementById('left-button').addEventListener('click', moveLeft);
    document.getElementById('rotate-button').addEventListener('click', rotate);
    document.getElementById('right-button').addEventListener('click', moveRight);
    document.getElementById('down-button').addEventListener('click', moveDown);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        currentRotation = (currentRotation + 1) % current.length;
        current = tetrominoes[random][currentRotation];
        draw();
    }

    function freeze() {
        if (current.some(index => cells[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => cells[currentPosition + index].classList.add('taken'));
            random = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            addScore();
            gameOver();
        }
    }

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => cells[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    cells[index].classList.remove('taken');
                    cells[index].classList.remove('tetromino');
                });
                const cellsRemoved = cells.splice(i, width);
                cells = cellsRemoved.concat(cells);
                cells.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over';
            clearInterval(timerId);
        }
    }

    draw();
    timerId = setInterval(moveDown, 1000);
});
