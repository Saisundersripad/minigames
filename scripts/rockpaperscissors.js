let playerScore = 0;
let cpuScore = 0;
let canPlay = false;

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const timer = document.getElementById("timer");
const cpuHand = document.getElementById("cpu-hand");
const playerHand = document.getElementById("player-hand");
const resultDisplay = document.getElementById("result");

const playerScoreDisplay = document.getElementById("player-score");
const cpuScoreDisplay = document.getElementById("cpu-score");

document.getElementById("rock").onclick = () => handlePlayerChoice("rock");
document.getElementById("paper").onclick = () => handlePlayerChoice("paper");
document.getElementById("scissors").onclick = () => handlePlayerChoice("scissors");

document.getElementById("start-again").onclick = () => startRound();
document.getElementById("cancel-btn").onclick = () => {
  window.location.href = "rockpaperscissors.html";
};

document.getElementById("home-button").onclick = function (e) {
  e.preventDefault();
  window.location.href = "index.html";
};

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  startRound();
});

function startRound() {
  canPlay = false;
  timer.textContent = "[3]";
  cpuHand.textContent = "❓";
  playerHand.textContent = "❓";
  resultDisplay.textContent = "";
  resultDisplay.className = "result";

  let count = 3;
  const countdown = setInterval(() => {
    count--;
    if (count > 0) {
      timer.textContent = `[${count}]`;
    } else if (count === 0) {
      timer.textContent = "[Go]";
      canPlay = true;
      clearInterval(countdown);
    }
  }, 1000);
}

function handlePlayerChoice(playerChoice) {
  if (!canPlay) return;

  canPlay = false;
  const choices = ["rock", "paper", "scissors"];
  const cpuChoice = choices[Math.floor(Math.random() * 3)];

  playerHand.textContent = getEmoji(playerChoice);
  cpuHand.textContent = getEmoji(cpuChoice);

  // Reset result styling
  resultDisplay.className = "result";

  let result;
  if (playerChoice === cpuChoice) {
    result = "It's a draw!";
    resultDisplay.classList.add("draw");
  } else if (
    (playerChoice === "rock" && cpuChoice === "scissors") ||
    (playerChoice === "paper" && cpuChoice === "rock") ||
    (playerChoice === "scissors" && cpuChoice === "paper")
  ) {
    result = "You win!";
    playerScore++;
    resultDisplay.classList.add("win");
  } else {
    result = "CPU wins!";
    cpuScore++;
    resultDisplay.classList.add("lose");
  }

  resultDisplay.textContent = result;
  playerScoreDisplay.textContent = playerScore;
  cpuScoreDisplay.textContent = cpuScore;
}

function getEmoji(choice) {
  switch (choice) {
    case "rock": return "🪨";
    case "paper": return "📄";
    case "scissors": return "✂️";
  }
}

function createFallingSymbol() {
    const container = document.getElementById("falling-container");
    const symbol = document.createElement("div");
    symbol.classList.add("falling-symbol");
  
    const choices = ["🪨", "📄", "✂️"];
    symbol.textContent = choices[Math.floor(Math.random() * choices.length)];
  
    symbol.style.left = Math.random() * 100 + "vw";
    symbol.style.animationDuration = 2 + Math.random() * 3 + "s";
    symbol.style.fontSize = Math.random() * 20 + 20 + "px";
  
    container.appendChild(symbol);
  
    setTimeout(() => {
      symbol.remove();
    }, 5000);
  }
  
  // Only activate on start screen
  setInterval(() => {
    if (document.getElementById("start-screen").style.display !== "none") {
      createFallingSymbol();
    }
  }, 300);
  
