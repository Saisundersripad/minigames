const robot = document.getElementById("robot");
const obstacleContainer = document.getElementById("obstacle-container");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const countdownEl = document.getElementById("countdown");
const jumpBtn = document.getElementById("jump-btn");
const fallingRobotsContainer = document.getElementById("falling-robots");

let isJumping = false;
let score = 0;
let gameRunning = false;
let obstacleInterval;

document.getElementById("home-button").onclick = function (e) {
  e.preventDefault();
  window.location.href = "index.html";
};

// Countdown before game or restart
function startCountdown(callback) {
  let count = 3;
  countdownEl.style.display = "block";
  countdownEl.textContent = count;
  jumpBtn.style.display = "none";

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else if (count === 0) {
      countdownEl.textContent = "GO!";
    } else {
      clearInterval(countdownInterval);
      countdownEl.style.display = "none";
      callback();
    }
  }, 1000);
}

// Game start
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  startCountdown(() => {
    gameRunning = true;
    jumpBtn.style.display = "block";
    spawnObstacle();
    startObstacleLoop();
  });
});

function startRobotSnowfall() {
  const robot = document.createElement("div");
  robot.textContent = "🤖";
  robot.classList.add("robot-fall");

  robot.style.left = Math.random() * 100 + "%";
  robot.style.fontSize = Math.floor(Math.random() * 10 + 15) + "px";

  const container = document.getElementById("falling-robots");
  container.appendChild(robot);

  setTimeout(() => {
    robot.remove();
  }, 5000);
}

// Start snowfall only while on start screen
setInterval(() => {
  const startScreen = document.getElementById("start-screen");
  if (startScreen.style.display !== "none") {
    startRobotSnowfall();
  }
}, 300);



// Jump logic
function handleJump() {
  if (!isJumping && gameRunning) {
    robot.classList.add("jump");
    isJumping = true;
    setTimeout(() => {
      robot.classList.remove("jump");
      isJumping = false;
    }, 500);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    handleJump();
  }
});

jumpBtn.addEventListener("click", handleJump);
jumpBtn.addEventListener("touchstart", handleJump);

// Obstacle spawning
function spawnObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  let types = ["short-obstacle", "tall-obstacle", "wide-obstacle", "circle-obstacle", "triangle-obstacle"];
  const type = types[Math.floor(Math.random() * types.length)];
  obstacle.classList.add(type);

  obstacle.style.right = "-100px";
  obstacleContainer.appendChild(obstacle);

  obstacle.addEventListener("animationend", () => {
    obstacle.remove();
  });
}

function startObstacleLoop() {
  obstacleInterval = setInterval(spawnObstacle, 2000);
}

function stopObstacleLoop() {
  clearInterval(obstacleInterval);
}

// Collision
function checkCollision() {
  const robotRect = robot.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach((obs) => {
    const obsRect = obs.getBoundingClientRect();

    if (
      obsRect.left < robotRect.right &&
      obsRect.right > robotRect.left &&
      obsRect.bottom > robotRect.top &&
      obsRect.top < robotRect.bottom
    ) {
      gameOver();
    }
  });
}

// Score
function updateScore() {
  if (gameRunning) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }
}

// Game over
function gameOver() {
  gameRunning = false;
  stopObstacleLoop();
  gameOverScreen.style.display = "block";
  jumpBtn.style.display = "none";
}

// Restart
function restartGame() {
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  gameOverScreen.style.display = "none";
  obstacleContainer.innerHTML = "";

  startCountdown(() => {
    gameRunning = true;
    jumpBtn.style.display = "block";
    spawnObstacle();
    startObstacleLoop();
  });
}

// Game loop
setInterval(() => {
  if (gameRunning) {
    checkCollision();
    updateScore();
  }
}, 100);

function exitGame() {
  window.location.href = "robotrunaway.html";
}

