import { ALL_SUITS, ALL_RANKS } from "./constants.js";

export function initDeck() {
  let cards = [];
  if (cards.length > 0) {
    console.log("ERROR: Deck already built!");
    return;
  }

  for (const suit of ALL_SUITS) {
    for (const rank of ALL_RANKS) {
      cards.push(suit + rank);
    }
  }

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }

  return cards;
}

function deal(deck, numCards = 1) {
  let dealtCards = [];
  for (let i = 0; i < numCards; i++) {
    dealtCards.push(deck.pop());
  }
  return dealtCards;
}
