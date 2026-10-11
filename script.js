/*
Blackjack V1
Currently still learning JS hopefully i'll get good "enough" soon

[1.] Start with the shuffle function
[2.] Make an bot that plays automatically after player dealt
[3.] Then make the actual game loop, where a card is given to player, player could answer a prompt with s for stand and h for hit, i'll add other options
[4.] Go make V2 with other more complex choices. Should i start hooking it up to html and css? idk we'll see
*/

let deck = [];
let playerHand = [];
let botHand = [];

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

  if (score(botHand) > 21) {
    return `Busted: ${score(botHand)}`;
  }
  return `Score: ${score(botHand)}`;
}

function main() {
  let running = true;
  while (running) {
    let exit = prompt("Exit? [y/n]: ");
        
    if (exit === "y") {
          
      running = false;
      break;
          
    } else if (exit === "n") {
        deck = [];
        playerHand = [];
        botHand = [];
      }
      else {
        console.log("Invalid input");
        continue;
      }
    console.log("Welcome to blackjack!\n==========\n");
    
    createDeck();
    deal(playerHand);
    deal(botHand);
    deal(playerHand);
    deal(botHand);
    bot();
    
    if (playerHand.length === 2 && score(playerHand) === 21) {
      if (botHand.length === 2 && score(botHand) === 21) {
          console.log("Blackjack! But dealer also got blackjack hahaha, you're so bad...")
        } else {
            console.log("Blackjack!")
          }
          
        console.log("Bot hand: \n==========")
        for (let i = 0; i < botHand.length; i++) {
            console.log(`${botHand[i].suit} | ${botHand[i].value}`);
        }
        break;
      }
    
    console.log("Bot hand: \n==========");
        console.log(`${botHand[0].suit} | ${botHand[0].value}`)
        console.log("??? | ???\n")
    while (true) {
      
      console.log(`Your Hand | ${score(playerHand)}: \n==========`);
      
      for (let i = 0; i < playerHand.length; i++) {
            console.log(`${playerHand[i].suit} | ${playerHand[i].value}`);
      }
      console.log()
      let choice = prompt("Hit or stand? [h/s]:");
      console.log()

      if (choice === "h") {
        deal(playerHand);
        if (score(playerHand) > 21) {
          console.log(`Busted with ${score(playerHand)}`);
          console.log("Your Hand: \n==========")
          for (let i = 0; i < playerHand.length; i++) {
            console.log(`${playerHand[i].suit} | ${playerHand[i].value}`);
          }
          
          deck = [];
          playerHand = [];
          botHand = [];
          break;
        }
        
      } else if (choice === "s") {

        const botS = score(botHand)
        const playerS = score(playerHand)
        let feedbackMsg = "How has this message even been logged"
        
        if (botS <= 21) {
          if (playerS > botS) {
          console.log()
          feedbackMsg = `Won | bot: ${botS} -|- player: ${playerS}`;
        } else if (botS === playerS) {
            feedbackMsg = `Tie | bot: ${botS} -|- player: ${playerS}`;
        } else {
            feedbackMsg = `Lost | bot: ${botS} -|- player: ${playerS}`;
        }
        } else { feedbackMsg = `Won-bot went bust| bot: ${botS} -|- player: ${playerS}`; }

        console.log(feedbackMsg)
        
        console.log("Bot hand: \n==========")
        for (let i = 0; i < botHand.length; i++) {
          console.log(`${botHand[i].suit} | ${botHand[i].value}`);
        }
        break;
      } else { console.log("Invalid Input\n"); continue; }
    }
   }
  }

main()
