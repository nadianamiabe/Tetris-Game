const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const squareSize = 20;
const row = 20;
const col = 10;
const vacant = '#FFF'; // empty square

// draw a square
function drawSquare(x, y, color) {
  // x is the number of sq from the left and y is the number of sq from the top
  ctx.fillStyle = color;
  ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

  ctx.strokeStyle = 'black'; // border's color
  ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

// create the board
const board = [];
// when we create the board game, every square are empty, so each one are white
for (let r = 0; r < row; r++) {
  board[r] = [];
  for (let c = 0; c < col; c++) {
    board[r][c] = vacant;
  }
}

// draw the board
function drawBoard() {
  for (r = 0; r < row; r++) {
    for (c = 0; c < col; c++) {
      drawSquare(c, r, board[r][c]); // c = x, r = y, board[r][c] = color
    }
  }
}

drawBoard();

// the object Piece
function Piece(Tetromino, color) {
  this.tetromino = tetromino;
  this.tetrominoN = 0; // index 0
  this.activeTetromino = this.tetromino[this.tetrominoN]; // example = z[0]
  this.color = color;
  // inicialization position
  this.x = 3;
  this.y = -2;
}

Piece.prototype.fill = function () {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, this.color);
      }
    }
  }
};

// draw a piece to the board
Piece.prototype.draw = function () {
  // for (r = 0; r < this.activeTetromino.length; r++) {
  //   for (c = 0; c < this.activeTetromino.length; c++) {
  //     if (this.activeTetromino[r][c]) {
  //       drawSquare(this.x + c, this.y + r, this.color);
  //     }
  //   }
  // }
  this.fill(this.color);
};

// unDraw a piece
Piece.prototype.unDraw = function () {
  // for (r = 0; r < this.activeTetromino.length; r++) {
  //   for (c = 0; c < this.activeTetromino.length; c++) {
  //     if (this.activeTetromino[r][c]) {
  //       drawSquare(this.x + c, this.y + r, vacant);
  //     }
  //   }
  // }
  this.fill(vacant);
};

// move Down the Piece
Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    piece = randomPiece();
  }
};

Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
};

Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
};

Piece.prototype.rotate = function () {
  let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  let kick = 0;
  if (this.collision(0, 0, nextPattern)){
    if (this.x > col/2) {
      kick = -1;
    } else {
      kick = 1;
    } 
  }
  if (!this.collision(0, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
}

Piece.prototype.lock = function () {
  for (r = 0; r < this.activeTetromino.length; r++){
    for (c = 0; c < this.activeTetromino.length; c++){
      if (this.activeTetromino[r][c]) continue;
      if (this.y + r < 0){
        gameOver = true;
        alert("Game Over");
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
    
  }
  
}

Piece.prototype.collision = function (x, y, piece) {
  for (r = 0; r < piece.length; r++) {
    for (c = 0; c < piece.length; c++) {
      if (!piece[r][c]) continue;

      let newX = this.x + c + x;
      let newY = this.y + r + y;
      if (newX < 0 || newX >= col || newY > row) return true;
      if (newY = 0) continue;
      if (board[newX][newY] != vacant) return true;
    }
  }
  return false;
}


