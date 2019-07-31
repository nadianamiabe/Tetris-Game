const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const lineElement = document.getElementById("line");
const levelElement = document.getElementById("level");
 
const secondCanvas = document.getElementById('second-canvas');
const secondCtx = secondCanvas.getContext('2d');

const viewPieceRow = 5;
const viewPieceCol = 5;
const sq = 20;

const row2 = 5;
const col2 = 5;
const vacant2 = "rgb(219,112,147)";

const row = 20;
const col = 10;
const squareSize = 20;
const vacant = "rgb(219,112,147)";

function drawSquare2(x, y, color) {
  secondCtx.fillStyle = color;
  secondCtx.fillRect(x * sq, y * sq, sq, sq);
  secondCtx.lineWidth = 1;
  secondCtx.strokeStyle = "palevioletred";
  secondCtx.strokeRect(x * sq, y * sq, sq, sq);
}

const board2 = [];
for (r = 0; r < row2; r++) {
  board2[r] = [];
  for (c = 0; c < col2; c++) {
    board2[r][c] = vacant2;
  }
}
function drawBoard2() {
  for (let r = 0; r < row2; r++) {
    for (let c = 0; c < col2; c++) {
      drawSquare2(c, r, board2[r][c]);
    }
  }
}

drawBoard2();

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "palevioletred";
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

const board = [];
for (r = 0; r < row; r++) {
  board[r] = [];
  for (c = 0; c < col; c++) {
    board[r][c] = vacant;
  }
}

function drawBoard() {
  for (r = 0; r < row; r++) {
    for (c = 0; c < col; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

drawBoard();

const pieces = [
  [Z, "#8B008B"],
  [S, "#20B2AA"],
  [T, "#7B68EE"],
  [O, "#9932CC"],
  [J, "#7FFFD4"],
  [L, "#66CDAA"],
  [I, "#4B0082"]
];

function randomPiece() {
  const r = Math.floor(Math.random() * pieces.length);
  return new Piece(pieces[r][0], pieces[r][1]);
}

let p = randomPiece();
let p2 = randomPiece();

const gamePieces = [p, p2];

function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];

  this.x = 3;
  this.y = -2;
}
Piece.prototype.fill = function(color) {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
};

Piece.prototype.fill2 = function(color) {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        drawSquare2(1 + c, 1 + r, color);
      }
    }
  }
};

Piece.prototype.draw = function() {
  this.fill(this.color);
};

Piece.prototype.unDraw = function() {
  this.fill(vacant);
};

Piece.prototype.draw2 = function() {
  this.fill2(this.color);
};

Piece.prototype.unDraw2 = function() {
  secondCtx.clearRect(0, 0, 100, 100);

};

// this.draw2();
// this.unDraw2();


Piece.prototype.moveDown = function() {
  if (!gamePieces[0].collision(0, 1, gamePieces[0].activeTetromino)) {
    gamePieces[0].unDraw();
    gamePieces[1].unDraw2();
    gamePieces[0].y++;
    gamePieces[0].draw();
    gamePieces[1].draw2();
  } else {
    gamePieces[0].lock();
    gamePieces.shift();
    gamePieces.push(randomPiece());
    console.log('chamou uma nova peça');
  }
};

Piece.prototype.moveRight = function() {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
};

Piece.prototype.moveLeft = function() {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
};

Piece.prototype.rotate = function() {
  const nextPattern = this.tetromino[
    (this.tetrominoN + 1) % this.tetromino.length
  ];
  let kick = 0;
  if (this.collision(0, 0, nextPattern)) {
    if (this.x > col / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }
  if (!this.collision(0, 1, nextPattern)) {
    this.unDraw();
    this.y += 1;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
};

let score = 0;
let line = 0;
Piece.prototype.lock = function() {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      if (!this.activeTetromino[r][c]) {
        continue;
      }
      if (this.y + r < 0) {
        gameOver = true;
        alert("Game Over");
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
  }
  score += 10;
  for (r = 0; r < row; r++) {
    let isRowFull = true;
    for (c = 0; c < col; c++) {
      isRowFull = isRowFull && board[r][c] != vacant;
    }
    if (isRowFull) {
      for (y = r; y > 1; y--) {
        for (c = 0; c < col; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      for (c = 0; c < col; c++) {
        board[0][c] = vacant;
      }
      score += 100;
      line += 1;
    }
    if (score > 1000) {
      update = true;
    }
    if (score > 2000) {
      update2 = true;
    }
    if (score > 3000) {
      update3 = true;
    }
  }
  drawBoard();
  scoreElement.innerHTML = score;
  lineElement.innerHTML = line;
};

Piece.prototype.collision = function(x, y, piece) {
  for (r = 0; r < piece.length; r++) {
    for (c = 0; c < piece.length; c++) {
      if (!piece[r][c]) {
        continue;
      }
      const newX = this.x + c + x;
      const newY = this.y + r + y;

      if (newX < 0 || newX >= col || newY >= row) {
        return true;
      }

      if (newY < 0) {
        continue;
      }

      if (board[newY][newX] != vacant) {
        return true;
      }
    }
  }
  return false;
};

document.addEventListener("keydown", control);

let pause = false;
function control(event) {
  if (event.keyCode == 13) {
    startGame = true;
    drop();
  }
  if (startGame) {
    if (event.keyCode == 37) {
      gamePieces[0].moveLeft();
      dropStart = Date.now();
    } else if (event.keyCode == 38) {
      gamePieces[0].rotate();
      dropStart = Date.now();
    } else if (event.keyCode == 39) {
      gamePieces[0].moveRight();
      dropStart = Date.now();
    } else if (event.keyCode == 40) {
      gamePieces[0].moveDown();
    } 
  }
}
let startGame = false;
let dropStart = Date.now();
let gameOver = false;
let update = false;
let update2 = false;
let update3 = false;

function drop() {
  const now = Date.now();
  const delta = now - dropStart;
  if (startGame) {
    if (delta > 1000) {
      gamePieces[0].moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 1;
    }
    if (update) {
      if (delta > 900) {
        gamePieces[0].moveDown();
        dropStart = Date.now();
        levelElement.innerHTML = 2;
      }
    }
    if (update2) {
      if (delta > 800) {
        gamePieces[0].moveDown();
        dropStart = Date.now();
        levelElement.innerHTML = 3;
      }
    }
    if (update3) {
      if (delta > 700) {
        gamePieces[0].moveDown();
        dropStart = Date.now();
        levelElement.innerHTML = 4;
      }
    }
    if (!gameOver) {
      requestAnimationFrame(drop);
      console.log('passou');
    }
  }
}

drop();

