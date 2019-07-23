const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const squareSize = 20;
const row = 20;
const col = 10;
const vacant = '#FFF'; // empty square
const board = [];

function drawSquare(x, y, color) {
  // x is the number of sq from the left and y is the number of sq from the top
  ctx.fillStyle = color;
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
  ctx.strokeStyle = 'black'; // border's color
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

function createBoard() {
  for (let r = 0; r < row; r++) {
    board[r] = [];
    for (let c = 0; c < col; c++) {
      board[r][c] = vacant;
      // when we create the board game, every square are empty, so each one are white
    }
  }
}

function drawBoard() {
  for (r = 0; r < row; r++) {
    for (c = 0; c < col; c++) {
      drawSquare(c, r, board[r][c]);//c = x, r = y, board[r][c] = color
    }
  }
}

drawBoard();
