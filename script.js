let playerMoney = 1000;
let playerHand = [];
let dealerHand = [];
let deck = [];
let betAmount = 100;
let dealerCardRevealed = false;

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");

const dealerLabel = document.getElementById("dealer-label");
const playerLabel = document.getElementById("player-label");

const betModal = document.getElementById("bet-modal");
const betInput = document.getElementById("bet-amount");
const confirmBetBtn = document.getElementById("confirm-bet");
const currentBetEl = document.getElementById("current-bet");

const resultSection = document.getElementById("result-section");
const resultMessage = document.getElementById("result-message");
const nextRoundBtn = document.getElementById("next-round");
const cancelGameBtn = document.getElementById("cancel-game");

startBtn.onclick = () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-area").style.display = "block";
  updateMoney();
  showBetModal();
};

restartBtn.onclick = () => location.reload();
cancelGameBtn.onclick = () => location.reload();
nextRoundBtn.onclick = () => {
  resultSection.style.display = "none";
  enableButtons();
  showBetModal();
};

hitBtn.onclick = () => {
  playerHand.push(drawCard());
  updateUI();
  if (calculateHandValue(playerHand) > 21) {
    disableButtons();
    endRound("You Busted! Dealer Wins.");
  }
};

standBtn.onclick = () => dealerPlays();

document.getElementById("minus-10").onclick = () => changeBet(-10);
document.getElementById("minus-100").onclick = () => changeBet(-100);
document.getElementById("plus-10").onclick = () => changeBet(10);
document.getElementById("plus-100").onclick = () => changeBet(100);

confirmBetBtn.onclick = () => {
  betAmount = parseInt(betInput.value);
  if (playerMoney < betAmount || playerMoney == 0) {
    alert("Not enough funds!");
    return;
  }
  betModal.style.display = "none";
  startRound();
};

function changeBet(delta) {
  const newBet = parseInt(betInput.value) + delta;
  if (newBet >= 10 && newBet <= playerMoney) {
    betInput.value = newBet;
  }
}

function showBetModal() {
  betInput.value = Math.min(100, playerMoney);
  betModal.style.display = "flex";
}

function startRound() {
  resultSection.style.display = "none";
  playerHand = [];
  dealerHand = [];
  dealerCardRevealed = false;
  deck = buildDeck();
  shuffle(deck);
  playerMoney -= betAmount;
  updateMoney();
  currentBetEl.textContent = `Current Bet: $${betAmount}`;
  playerHand.push(drawCard(), drawCard());
  dealerHand.push(drawCard(), drawCard());
  updateUI();
  enableButtons();
}

function dealerPlays() {
  disableButtons();
  revealDealerCard();

  // Delay to finish card flip and allow visual update
  setTimeout(() => {
    dealerCardRevealed = true;
    updateUI();

    while (calculateHandValue(dealerHand) < 17) {
      dealerHand.push(drawCard());
    }

    updateUI();

    const pVal = calculateHandValue(playerHand);
    const dVal = calculateHandValue(dealerHand);

    let message = "";
    if (dVal > 21 || pVal > dVal) {
      playerMoney += betAmount * 2;
      message = "You Win!";
    } else if (pVal === dVal) {
      playerMoney += betAmount;
      message = "Push!";
    } else {
      message = "Dealer Wins.";
    }

    setTimeout(() => {
      endRound(message);
    }, 400);
  }, 700);
}

function endRound(message) {
  disableButtons();
  updateUI();
  updateMoney();

  resultMessage.textContent = message;

  if (playerMoney < 10) {
    document.getElementById("action-buttons").style.display = "none";
    document.getElementById("no-money").style.display = "block";
  } else {
    document.getElementById("action-buttons").style.display = "block";
    document.getElementById("no-money").style.display = "none";
  }

  resultSection.style.display = "block";
}

const endGameBtn = document.getElementById("end-game");
endGameBtn.onclick = () => {
  location.reload();
};


function updateMoney() {
  document.getElementById("money").textContent = playerMoney;
  if (playerMoney < 0) {
    document.getElementById("game-area").style.display = "none";
    document.getElementById("game-over").style.display = "flex";
  }
}

function updateUI() {
  const playerCards = document.getElementById("player-cards");
  const dealerCards = document.getElementById("dealer-cards");
  playerCards.innerHTML = "";
  dealerCards.innerHTML = "";

  const pVal = calculateHandValue(playerHand);
  const dVal = calculateHandValue(dealerHand);

  playerLabel.textContent = `Player (${pVal})`;
  dealerLabel.textContent = dealerCardRevealed
    ? `Dealer (${dVal})`
    : `Dealer (${getCardValue(dealerHand[0])} + ?)`;

  playerHand.forEach(card => {
    playerCards.appendChild(createCard(card.val + card.suit));
  });

  dealerHand.forEach((card, i) => {
    if (i === 1 && !dealerCardRevealed) {
      dealerCards.appendChild(createCard("❓"));
    } else {
      dealerCards.appendChild(createCard(card.val + card.suit));
    }
  });
}

function revealDealerCard() {
  const dealerCards = document.getElementById("dealer-cards");
  const hiddenCard = dealerCards.children[1];
  if (hiddenCard && hiddenCard.textContent === "❓") {
    hiddenCard.classList.add("flip");
    setTimeout(() => {
      hiddenCard.textContent = dealerHand[1].val + dealerHand[1].suit;
    }, 300);
  }
}

function createCard(content) {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = content;
  return card;
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.val)) return 10;
  if (card.val === 'A') return 11;
  return parseInt(card.val);
}

function calculateHandValue(hand) {
  let value = 0, aces = 0;
  hand.forEach(card => {
    value += getCardValue(card);
    if (card.val === 'A') aces++;
  });
  while (value > 21 && aces) {
    value -= 10;
    aces--;
  }
  return value;
}

function buildDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return suits.flatMap(suit => values.map(val => ({ val, suit })));
}

function drawCard() {
  return deck.pop();
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function disableButtons() {
  hitBtn.disabled = true;
  standBtn.disabled = true;
}

function enableButtons() {
  hitBtn.disabled = false;
  standBtn.disabled = false;
}

const rulesBtn = document.getElementById("rules-btn");
const rulesModal = document.getElementById("rules-modal");
const closeRulesBtn = document.getElementById("close-rules");

rulesBtn.onclick = () => {
  rulesModal.style.display = "flex";
};

closeRulesBtn.onclick = () => {
  rulesModal.style.display = "none";
};

const suits = ['♠', '♥', '♦', '♣'];
const fallingContainer = document.getElementById('falling-suits');

function createSuit() {
  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.textContent = suits[Math.floor(Math.random() * suits.length)];

  suit.style.left = Math.random() * 100 + 'vw';
  suit.style.top = '-30px';
  suit.style.fontSize = (16 + Math.random() * 20) + 'px';
  suit.style.animationDuration = (3 + Math.random() * 4) + 's';

  fallingContainer.appendChild(suit);

  setTimeout(() => {
    suit.remove();
  }, 8000);
}

// Trigger falling suits continuously
setInterval(createSuit, 300);
