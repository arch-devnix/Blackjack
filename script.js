// ---- State ----
let deck = [];
let playerHand = [];
let botHand = [];
let gameOver = false;
let chips = 100;
let currentBet = 0;

// ---- Element references ----
const playerHandEl = document.querySelector("#playerHand");
const dealerHandEl = document.querySelector("#dealerHand");
const playerScoreEl = document.querySelector("#playerScore");
const dealerScoreEl = document.querySelector("#dealerScore");
const statusEl = document.querySelector("#status");

const dealBtn = document.querySelector("#dealBtn");
const hitBtn = document.querySelector("#hitBtn");
const standBtn = document.querySelector("#standBtn");

const chipsEl = document.querySelector("#chips");
const playerBetEl = document.querySelector("#playerBet");
const chipBtns = document.querySelectorAll(".chipBtn");
const clearBetBtn = document.querySelector("#clearBetBtn");

// ---- Deck ----
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function createDeck() {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  shuffle(deck);
}

function deal(hand) {
  if (deck.length === 0) {
    createDeck();
  }
  hand.push(deck.pop());
}

// ---- Scoring ----
function cardPoints(card) {
  if (card.value === "A") return 11;
  if (card.value === "K" || card.value === "Q" || card.value === "J") return 10;
  return Number(card.value);
}

function score(hand) {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === "A") {
      aces++;
      total += 11;
    } else {
      total += cardPoints(card);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function suitSymbol(suit) {
  if (suit === "hearts") return "♥";
  if (suit === "diamonds") return "♦";
  if (suit === "clubs") return "♣";
  if (suit === "spades") return "♠";
  return "";
}

// ---- Dealer ----
function bot() {
  while (score(botHand) < 17) {
    deal(botHand);
  }
}

// ---- Render ----
function render() {
  playerHandEl.innerHTML = "";
  dealerHandEl.innerHTML = "";

  for (const card of playerHand) {
    const el = document.createElement("div");
    el.className = "card " + card.suit;
    el.textContent = card.value + suitSymbol(card.suit);
    playerHandEl.appendChild(el);
  }

  for (let i = 0; i < botHand.length; i++) {
    const el = document.createElement("div");
    el.className = "card " + botHand[i].suit;

    if (i === 1 && !gameOver) {
      el.textContent = "";
      el.className = "card hidden";
    } else {
      el.textContent = botHand[i].value + suitSymbol(botHand[i].suit);
    }

    dealerHandEl.appendChild(el);
  }

  playerScoreEl.textContent = score(playerHand);
  dealerScoreEl.textContent = gameOver ? score(botHand) : "?";

  chipsEl.textContent = chips;
  playerBetEl.textContent = currentBet;
}

// ---- Betting ----
function addToBet(amount) {
  if (currentBet + amount > chips) return;
  currentBet += amount;
  render();
}

function clearBet() {
  currentBet = 0;
  render();
}

// ---- Round flow ----
function reset() {
  deck = [];
  playerHand = [];
  botHand = [];
  gameOver = false;
}

function endRound(message, result) {
  if (result === "win") chips += currentBet * 2;
  else if (result === "push") chips += currentBet;
  else if (result === "blackjack") chips += currentBet * 2.5;

  currentBet = 0;

  gameOver = true;
  render();
  statusEl.textContent = message;

  dealBtn.classList.remove("invisible");
  hitBtn.classList.add("invisible");
  standBtn.classList.add("invisible");

  if (chips <= 0) {
    statusEl.textContent = "Out of chips — game over!";
    dealBtn.classList.add("invisible");
    chipBtns.forEach(btn => btn.disabled = true);
  }
}

function startRound() {
  if (currentBet === 0) return;
  if (currentBet > chips) return;

  chips -= currentBet;

  statusEl.textContent = "Playing...";
  reset();
  createDeck();

  deal(playerHand);
  deal(botHand);
  deal(playerHand);
  deal(botHand);

  const playerBJ = playerHand.length === 2 && score(playerHand) === 21;
  const dealerBJ = botHand.length === 2 && score(botHand) === 21;

  if (playerBJ && dealerBJ) {
    endRound("Both blackjack, push.", "push");
    return;
  } else if (playerBJ) {
    endRound("Blackjack! You win!", "blackjack");
    return;
  } else if (dealerBJ) {
    endRound("Dealer blackjack, you lose.", "lose");
    return;
  }

  render();
  dealBtn.classList.add("invisible");
  hitBtn.classList.remove("invisible");
  standBtn.classList.remove("invisible");
}

function hit() {
  if (gameOver) return;

  deal(playerHand);
  render();

  if (score(playerHand) > 21) {
    endRound("You busted!", "lose");
  }
}

function stand() {
  if (gameOver) return;

  bot();
  render();

  const player = score(playerHand);
  const botScore = score(botHand);

  if (botScore > 21) {
    endRound("Dealer busted — you win!", "win");
  } else if (player > botScore) {
    endRound("You win!", "win");
  } else if (player < botScore) {
    endRound("Dealer wins.", "lose");
  } else {
    endRound("Push (tie).", "push");
  }
}

// ---- Events ----
chipBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    addToBet(Number(btn.dataset.value));
  });
});

clearBetBtn.addEventListener("click", clearBet);
dealBtn.addEventListener("click", startRound);
hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);
