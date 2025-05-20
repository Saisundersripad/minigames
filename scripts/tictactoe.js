const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const cancelBtn = document.getElementById("cancel-btn");
const scoreXDisplay = document.getElementById("score-x");
const scoreODisplay = document.getElementById("score-o");
const scoreDrawDisplay = document.getElementById("score-draw");

let currentPlayer = "X";
let gameActive = true;
let boardState = Array(9).fill("");
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

document.getElementById("home-button").onclick = function (e) {
  e.preventDefault();
  window.location.href = "index.html";
};

startBtn.onclick = () => {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  resetGame();
};

restartBtn.onclick = () => {
  resetGame();
};

cancelBtn.onclick = () => {
  window.location.href = "tictactoe.html";
};
  

function resetGame() {
  boardState.fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  drawBoard();
}

function drawBoard() {
  board.innerHTML = "";
  boardState.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = value;
    cell.addEventListener("click", () => handleCellClick(index));
    board.appendChild(cell);
  });
}

function handleCellClick(index) {
  if (!gameActive || boardState[index] !== "") return;

  boardState[index] = currentPlayer;
  drawBoard();

  const winningCombo = checkWin(currentPlayer);
  if (winningCombo) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    highlightWinningCells(winningCombo);
    updateScore(currentPlayer);
  } else if (boardState.every(cell => cell !== "")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    scoreDraw++;
    updateScoreDisplay();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function checkWin(player) {
  const winConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winConditions.find(([a, b, c]) =>
    boardState[a] === player &&
    boardState[b] === player &&
    boardState[c] === player
  );
}

function highlightWinningCells(cells) {
  const cellElements = document.querySelectorAll('.cell');
  cells.forEach(index => {
    cellElements[index].classList.add('winner');
  });
}

function updateScore(player) {
  if (player === "X") {
    scoreX++;
  } else {
    scoreO++;
  }
  updateScoreDisplay();
}

function updateScoreDisplay() {
  scoreXDisplay.textContent = scoreX;
  scoreODisplay.textContent = scoreO;
  scoreDrawDisplay.textContent = scoreDraw;
}

const symbols = ['X', 'O'];
const fallingContainer = document.getElementById('falling-symbols');

function createSymbol() {
  const symbol = document.createElement('div');
  symbol.classList.add('symbol');
  symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  symbol.style.left = Math.random() * 100 + 'vw';
  symbol.style.top = '-30px';
  symbol.style.fontSize = (16 + Math.random() * 20) + 'px';
  symbol.style.animationDuration = (3 + Math.random() * 4) + 's';

  fallingContainer.appendChild(symbol);

  setTimeout(() => { symbol.remove(); }, 8000);
}

setInterval(createSymbol, 300);
