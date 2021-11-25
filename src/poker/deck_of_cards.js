import { SuitToDisplayMap, RankToDisplayMap } from "./constants.js";

export function initDeck() {
  let cards = [];
  if (cards.length > 0) {
    console.log("ERROR: Deck already built!");
    return;
  }

  console.log("Building deck...");
  for (const suit of SuitToDisplayMap.keys()) {
    for (const rank of RankToDisplayMap.keys()) {
      // e.g. Ace of clubs = "C14", 2 of spades = "S2"
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
