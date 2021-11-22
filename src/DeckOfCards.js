import { SuitToDisplayMap, RankToDisplayMap } from "./Constants.js";

export function initDeck() {
  let cards = [];
  if (cards.length > 0) {
    console.log("ERROR: Deck already built!");
    return;
  }

  for (const suit of SuitToDisplayMap.keys()) {
    for (const rank of RankToDisplayMap.keys()) {
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

// function deal(numCards = 1) {
//   let dealtCards = [];
//   for (let i = 0; i < numCards; i++) {
//     dealtCards.push(cards.pop());
//   }
//   return dealtCards;
// }
