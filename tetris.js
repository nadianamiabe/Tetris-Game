const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const lineElement = document.getElementById("line");
const levelElement = document.getElementById("level");


const row = 20;
const col = 10;
const squareSize = 20;
const vacant = "rgb(219,112,147)"; // empty square

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

let board = [];
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

let pieces = [
  [Z, "#00CED1"],
  [S, "#20B2AA"],
  [T, "#008B8B"],
  [O, "#008080"],
  [J, "#7FFFD4"],
  [L, "#66CDAA"],
  [I, "#5F9EA0"]
];

function randomPiece() {
  let r = Math.floor(Math.random() * pieces.length);
  return new Piece(pieces[r][0], pieces[r][1]);
}

let p = randomPiece();

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

Piece.prototype.draw = function() {
  this.fill(this.color);
};

Piece.prototype.unDraw = function() {
  this.fill(vacant);
};

Piece.prototype.moveDown = function() {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    p = randomPiece();
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
  let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  let kick = 0;
  if (this.collision(0, 0, nextPattern)) {
    if (this.x > col / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }
  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
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
        alert("Game Over");
        gameOver = true;
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
  }
  score += 10;
  for (r = 0; r < row; r++) {
    let isRowFull = true;
    for (c = 0; c < col; c++) {
      isRowFull = isRowFull && (board[r][c] != vacant);
    }
    if (isRowFull) {
      for (y = r; y > 1; y--) {
        for (c = 0; c < col; c++) {
          board[y][c] = board[y-1][c];
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
      let newX = this.x + c + x;
      let newY = this.y + r + y;

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

function control(event) {
  if (event.keyCode == 37) {
    p.moveLeft();
    dropStart = Date.now();
  } else if (event.keyCode == 38) {
    p.rotate();
    dropStart = Date.now();
  } else if (event.keyCode == 39) {
    p.moveRight();
    dropStart = Date.now();
  } else if (event.keyCode == 40) {
    p.moveDown();
  } else if (event.keyCode == 32) {
    startGame = true;
    drop();
  }
}
let startGame = false;
let dropStart = Date.now();
let gameOver = false;
let update = false;
let update2 = false;

function drop() {
  let now = Date.now();
  let delta = now - dropStart;
  if (startGame) {
    if (delta > 1000) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 1;
    }
    if (update) {
      if (delta > 700) {
        p.moveDown();
        dropStart = Date.now();
        levelElement.innerHTML = 2;
      }
    }
    if (update2) {
      if (delta > 500) {
        p.moveDown();
        dropStart = Date.now();
        levelElement.innerHTML = 3;
      }
    }
    if (!gameOver) {
      requestAnimationFrame(drop);
    }
  }
}

drop();
