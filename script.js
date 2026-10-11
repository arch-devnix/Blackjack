// ---- State ----
let deck = [];
let playerHand = [];
let botHand = [];
let gameOver = false;

function reset() {
  deck = [];
  playerHand = [];
  botHand = [];
  gameOver = false;
}

function endRound(message) {
  gameOver = true;
  render();
  statusEl.textContent = message;
  dealBtn.disabled = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
}

// ---- Element references ----
const playerHandEl = document.querySelector("#playerHand");
const dealerHandEl = document.querySelector("#dealerHand");
const playerScoreEl = document.querySelector("#playerScore");
const dealerScoreEl = document.querySelector("#dealerScore");
const statusEl = document.querySelector("#status");

const dealBtn = document.querySelector("#dealBtn");
const hitBtn = document.querySelector("#hitBtn");
const standBtn = document.querySelector("#standBtn");

// Fisher Yates shuffle, great but simple "realistic" shuffling
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // take random index from 0-i, ensuring j could equal i itself
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function createDeck() {
  deck = [
  { suit: "hearts", value: "2" },
  { suit: "hearts", value: "3" },
  { suit: "hearts", value: "4" },
  { suit: "hearts", value: "5" },
  { suit: "hearts", value: "6" },
  { suit: "hearts", value: "7" },
  { suit: "hearts", value: "8" },
  { suit: "hearts", value: "9" },
  { suit: "hearts", value: "10" },
  { suit: "hearts", value: "J" },
  { suit: "hearts", value: "Q" },
  { suit: "hearts", value: "K" },
  { suit: "hearts", value: "A" },
  { suit: "diamonds", value: "2" },
  { suit: "diamonds", value: "3" },
  { suit: "diamonds", value: "4" },
  { suit: "diamonds", value: "5" },
  { suit: "diamonds", value: "6" },
  { suit: "diamonds", value: "7" },
  { suit: "diamonds", value: "8" },
  { suit: "diamonds", value: "9" },
  { suit: "diamonds", value: "10" },
  { suit: "diamonds", value: "J" },
  { suit: "diamonds", value: "Q" },
  { suit: "diamonds", value: "K" },
  { suit: "diamonds", value: "A" },
  { suit: "clubs", value: "2" },
  { suit: "clubs", value: "3" },
  { suit: "clubs", value: "4" },
  { suit: "clubs", value: "5" },
  { suit: "clubs", value: "6" },
  { suit: "clubs", value: "7" },
  { suit: "clubs", value: "8" },
  { suit: "clubs", value: "9" },
  { suit: "clubs", value: "10" },
  { suit: "clubs", value: "J" },
  { suit: "clubs", value: "Q" },
  { suit: "clubs", value: "K" },
  { suit: "clubs", value: "A" },
  { suit: "spades", value: "2" },
  { suit: "spades", value: "3" },
  { suit: "spades", value: "4" },
  { suit: "spades", value: "5" },
  { suit: "spades", value: "6" },
  { suit: "spades", value: "7" },
  { suit: "spades", value: "8" },
  { suit: "spades", value: "9" },
  { suit: "spades", value: "10" },
  { suit: "spades", value: "J" },
  { suit: "spades", value: "Q" },
  { suit: "spades", value: "K" },
  { suit: "spades", value: "A" }
];
  shuffle(deck);
} // Create the deck

function cardPoints(card) {
  if (card.value === "A") return 11;
  if (card.value === "K" || card.value === "Q" || card.value === "J") return 10;
  return Number(card.value);
} // get point of card

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
} // get the score of a hand

function deal(hand) {
  if (deck.length === 0) {
    createDeck()
  }
  hand.push(deck.pop());
} // deal a card to a set hand (shuffles automatically)

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
    el.className = "card";
    el.textContent = card.value;
    playerHandEl.appendChild(el);
  }

  for (let i = 0; i < botHand.length; i++) {
    const el = document.createElement("div");
    el.className = "card";

    if (i === 1 && !gameOver) {
      el.textContent = "🂠";
      el.classList.add("hidden");
    } else {
      el.textContent = botHand[i].value;
    }

    dealerHandEl.appendChild(el);
  }

  playerScoreEl.textContent = score(playerHand);

  // only show dealer score when revealed
  dealerScoreEl.textContent = gameOver ? score(botHand) : "?";
}

// ---- Game actions ----
function startRound() {
  statusEl.textContent = "Playing..."
  reset()

  createDeck();

  deal(playerHand);
  deal(botHand);
  deal(playerHand);
  deal(botHand);

  const playerBJ = playerHand.length === 2 && score(playerHand) === 21;
  const dealerBJ = botHand.length === 2 && score(botHand) === 21;

  if (playerBJ && dealerBJ) {
    endRound("Both blackjack, push.");
    return;
  } else if (playerBJ) {
    endRound("Blackjack! You win!");
    return;
  } else if (dealerBJ) {
    bot();
    endRound("Dealer blackjack, you lose.");
    return;
  }

  render();
  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
}

function hit() {
  if (gameOver) return;

  deal(playerHand);

  render();

  if (score(playerHand) > 21) {
    endRound("You busted!");
  }
}

function stand() {
  if (gameOver) return;

  bot();
  render();

  const player = score(playerHand);
  const botScore = score(botHand);

  if (botScore > 21) {
    endRound("Dealer busted — you win!");
  } else if (player > botScore) {
    endRound("You win!");
  } else if (player < botScore) {
    endRound("Dealer wins.");
  } else {
    endRound("Push (tie).");
  }
}

// ---- Events ----
dealBtn.addEventListener("click", startRound);
hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);
