const boardElement = document.getElementById('board');
const cells = Array.from(document.getElementsByClassName('cell'));
const resetButton = document.getElementById('reset-button');

let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let humanPlayer = 'O';
let aiPlayer = 'X';

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');
    if (board[index] === ' ') {
        makeMove(index, humanPlayer);
        if (!checkWin(board, humanPlayer) && !checkTie()) {
            makeMove(findBestMove(board), aiPlayer);
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    if (checkWin(board, player)) {
        setTimeout(() => alert(`${player} wins!`), 100);
    } else if (checkTie()) {
        setTimeout(() => alert(`It's a tie!`), 100);
    }
}

function resetGame() {
    board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    cells.forEach(cell => cell.textContent = '');
}

function checkWin(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function checkTie() {
    return board.every(cell => cell !== ' ');
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === ' ') {
            board[i] = aiPlayer;
            let moveVal = minimax(board, 0, false);
            board[i] = ' ';
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const score = evaluate(board);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!board.includes(' ')) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === ' ') {
                board[i] = aiPlayer;
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = ' ';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === ' ') {
                board[i] = humanPlayer;
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = ' ';
            }
        }
        return best;
    }
}

function evaluate(board) {
    if (checkWin(board, aiPlayer)) return 10;
    if (checkWin(board, humanPlayer)) return -10;
    return 0;
}
